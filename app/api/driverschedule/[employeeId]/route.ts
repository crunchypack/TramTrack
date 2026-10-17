import { connectToDB } from "@/utils/database";
import { DriverSchedule, CirculationTemplate, Driver, TramLine } from "@/models";
import { getVasttrafikToken } from "@/lib/vasttrafik";

// --- TYPES ---
type PopulatedStop = { name: string; vasttrafikGid?: string; minutesFromStart: number; };
type VasttrafikStop = { gid: string | null; name: string; index: number; plannedArrivalTime: string | null; plannedDepartureTime: string | null; estimatedArrivalTime: string | null; estimatedDepartureTime: string | null; isCancelled: boolean; };
type DetailedVasttrafikTrip = { serviceJourneyGid: string | null; line: string | null; direction: string; plannedDepartureTime: string | null; plannedArrivalTime: string | null; detailsReference: string; stops: VasttrafikStop[]; };

// --- HELPER FUNCTIONS ---
const normalizeStopName = (name?: string) => (name || "").trim().toLowerCase().replace(/,?\s*göteborg$/i, "").replace(/\s+/g, " ").trim();
const getTimeFromIso = (value?: string | null) => { if (!value) return ""; const match = value.match(/T(\d{2}:\d{2})/); return match?.[1] || ""; };
const minutesFromHm = (hm: string) => { if (!hm) return Number.POSITIVE_INFINITY; const [h, m] = hm.split(":").map(Number); return Number.isNaN(h) || Number.isNaN(m) ? Number.POSITIVE_INFINITY : h * 60 + m; };
const timeDistance = (a: string, b: string) => { const aM = minutesFromHm(a); const bM = minutesFromHm(b); return !Number.isFinite(aM) || !Number.isFinite(bM) ? Number.POSITIVE_INFINITY : Math.abs(aM - bM); };

const getRouteSlice = (routeStops: PopulatedStop[], originName: string, destinationName: string) => {
  const originIndex = routeStops.findIndex(stop => normalizeStopName(stop.name) === normalizeStopName(originName));
  const destinationIndex = routeStops.findIndex(stop => normalizeStopName(stop.name) === normalizeStopName(destinationName));
  if (destinationIndex === -1) return [];
  if (originIndex !== -1 && originIndex <= destinationIndex) return routeStops.slice(originIndex, destinationIndex + 1);
  if (originIndex === -1) return routeStops.slice(0, destinationIndex + 1);
  return [];
};

const rebaseRouteStops = (stops: PopulatedStop[]) => {
  if (stops.length === 0) return [];
  const base = stops[0].minutesFromStart;
  return stops.map((stop) => ({ ...stop, minutesFromStart: stop.minutesFromStart - base }));
};

const getStockholmOffset = (dateStr: string, time: string) => {
  const guess = new Date(`${dateStr}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Stockholm", timeZoneName: "longOffset" }).formatToParts(guess);
  const offset = parts.find((part) => part.type === "timeZoneName")?.value;
  return (!offset || offset === "GMT") ? "+00:00" : offset.replace("GMT", "");
};

// FIXED: Timezone correct active trip detection
const isTripActiveNow = (dateStr: string, tripStartTime: string, tripEndTime: string) => {
  const startOffset = getStockholmOffset(dateStr, tripStartTime);
  const endOffset = getStockholmOffset(dateStr, tripEndTime);

  const start = new Date(`${dateStr}T${tripStartTime}:00${startOffset}`);
  let end = new Date(`${dateStr}T${tripEndTime}:00${endOffset}`);

  if (end < start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000);

  const now = new Date();
  return now >= start && now <= end;
};

const getBestLiveTrip = (trips: any[], scheduleDateStr: string) => {
  return trips.find((trip) => isTripActiveNow(scheduleDateStr, trip.startTime, trip.endTime)) || trips[0] || null;
};

// --- VÄSTTRAFIK SERVICE ---
const getDetailedVasttrafikTrip = async ({ accessToken, date, trip, routeStops }: { accessToken: string; date: string; trip: any; routeStops: PopulatedStop[]; }): Promise<DetailedVasttrafikTrip | null> => {
  const originGid = trip.originGid || trip.startStop?.vasttrafikGid || routeStops[0]?.vasttrafikGid;
  const destinationGid = trip.destinationGid || trip.endStop?.vasttrafikGid || routeStops[routeStops.length - 1]?.vasttrafikGid;

  if (!originGid || !destinationGid) return null;

  const offset = getStockholmOffset(date, trip.startTime);
  let currentUrl = `https://ext-api.vasttrafik.se/pr/v4/journeys?originGid=${encodeURIComponent(originGid)}&destinationGid=${encodeURIComponent(destinationGid)}&dateTime=${encodeURIComponent(`${date}T${trip.startTime}:00${offset}`)}&transportModes=tram&limit=50&onlyDirectConnections=true`;

  const candidates: Array<{ detailsReference: string; tramLeg: any; }> = [];

  for (let page = 0; page < 5; page++) {
    const res = await fetch(currentUrl, { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } });
    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data.results) || data.results.length === 0) break;

    for (const journey of data.results) {
      const tramLeg = journey.tripLegs?.find((leg: any) => leg.serviceJourney?.line?.shortName === trip.line?.toString());
      if (!tramLeg || !journey.detailsReference) continue;

      const apiDirection = tramLeg.serviceJourney?.direction?.trim().toLowerCase() || "";
      const wantedDirection = trip.heading?.trim().toLowerCase() || "";
      if (wantedDirection && !apiDirection.includes(wantedDirection) && !wantedDirection.includes(apiDirection)) continue;

      candidates.push({ detailsReference: journey.detailsReference, tramLeg });
    }
    if (data.links?.next) { currentUrl = `https://ext-api.vasttrafik.se/pr/v4/${data.links.next}`; } else { break; }
  }

  const matchingCandidate = candidates.sort((a, b) => timeDistance(getTimeFromIso(a.tramLeg.plannedDepartureTime), trip.startTime) - timeDistance(getTimeFromIso(b.tramLeg.plannedDepartureTime), trip.startTime))[0];
  if (!matchingCandidate) return null;

  const detailsRes = await fetch(`https://ext-api.vasttrafik.se/pr/v4/journeys/${encodeURIComponent(matchingCandidate.detailsReference)}/details`, { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } });
  if (!detailsRes.ok) return null;

  const detailsData = await detailsRes.json();
  const tripLeg = detailsData?.tripLegs?.[0];
  if (!tripLeg) return null;

  const serviceJourney = tripLeg.serviceJourneys?.[0];
  const calls = Array.isArray(tripLeg.callsOnTripLeg) ? tripLeg.callsOnTripLeg : [];
  const stops: VasttrafikStop[] = calls.map((call: any) => {
    const stopPoint = call.stopPoint;
    const stopArea = stopPoint?.stopArea;
    return {
      gid: stopArea?.gid ?? stopPoint?.gid ?? null,
      name: stopArea?.name ?? stopPoint?.name ?? "Unknown",
      index: Number(call.index),
      plannedArrivalTime: call.plannedArrivalTime ?? null,
      plannedDepartureTime: call.plannedDepartureTime ?? null,
      estimatedArrivalTime: call.estimatedArrivalTime ?? call.estimatedOtherwisePlannedArrivalTime ?? null,
      estimatedDepartureTime: call.estimatedDepartureTime ?? call.estimatedOtherwisePlannedDepartureTime ?? null,
      isCancelled: call.isCancelled ?? false,
    };
  }).sort((a: any, b: any) => a.index - b.index);

  return {
    serviceJourneyGid: serviceJourney?.gid ?? matchingCandidate.tramLeg.serviceJourney?.gid ?? null,
    line: serviceJourney?.line?.name ?? trip.line?.toString() ?? null,
    direction: serviceJourney?.direction ?? trip.heading ?? "Unknown",
    plannedDepartureTime: matchingCandidate.tramLeg.plannedDepartureTime ?? stops[0]?.plannedDepartureTime ?? null,
    plannedArrivalTime: matchingCandidate.tramLeg.plannedArrivalTime ?? stops[stops.length - 1]?.plannedArrivalTime ?? null,
    detailsReference: matchingCandidate.detailsReference,
    stops,
  };
};

// --- MAIN ROUTE HANDLER ---
export async function GET(req: Request, { params }: { params: { employeeId: string } }) {
  const { searchParams } = new URL(req.url);
  const dateQuery = searchParams.get("date");

  if (!dateQuery) return new Response("Missing 'date' query param", { status: 400 });

  try {
    await connectToDB();
    const driver = await Driver.findOne({ employeeId: params.employeeId });
    if (!driver) return new Response("Driver not found", { status: 404 });

    const startOfDay = new Date(`${dateQuery}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateQuery}T23:59:59.999Z`);

    const schedule = await DriverSchedule.findOne({
      driver: driver._id,
      date: { $gte: startOfDay,$lte: endOfDay },
    }).populate({ path: "circulations.circulationTemplate", model: CirculationTemplate });

    if (!schedule) return new Response("Schedule not found", { status: 404 });

    const token = await getVasttrafikToken();
    const tramLineCache = new Map(); // FIXED: Cache MongoDB lookups to prevent N+1 queries

    const enrichedCirculations = [];

    // FIXED: Sequential loop to prevent API Rate Limits from Västtrafik
    for (const circ of schedule.circulations) {
      const circObj = circ.toObject();
      const template = circObj.circulationTemplate;

      if (!template || !Array.isArray(template.trips) || template.trips.length === 0) {
        enrichedCirculations.push(circObj);
        continue;
      }

      // STEP 1: Enrich all trips with route geometry
      const enrichedTrips = await Promise.all(template.trips.map(async (trip: any) => {
        const cacheKey = `${trip.line}-${trip.heading}`;
        let tramLine = tramLineCache.get(cacheKey);

        if (!tramLine) {
          tramLine = await TramLine.findOne({ number: Number(trip.line), direction: trip.heading }).populate("route.stop");
          tramLineCache.set(cacheKey, tramLine);
        }

        if (!tramLine || !Array.isArray(tramLine.route)) return { ...trip, routeStops: [] };

        const populatedRoute: PopulatedStop[] = tramLine.route.map((entry: any) => ({
          name: entry.stop.name, vasttrafikGid: entry.stop.vasttrafikGid || "", minutesFromStart: entry.minutesFromStart,
        }));

        const slicedRoute = getRouteSlice(populatedRoute, trip.originName, trip.destinationName);
        return { ...trip, routeStops: rebaseRouteStops(slicedRoute) };
      }));

      // STEP 2: Pick live trip
      const liveTrip = getBestLiveTrip(enrichedTrips, dateQuery);
      let tripsWithVasttrafik = enrichedTrips;
      let detailedTrip: DetailedVasttrafikTrip | null = null;

      // STEP 3 & 4: Fetch actual timetables & realtime data
      if (liveTrip) {
        detailedTrip = await getDetailedVasttrafikTrip({ accessToken: token, date: dateQuery, trip: liveTrip, routeStops: liveTrip.routeStops || [] });

        if (detailedTrip) {
          const { stops, serviceJourneyGid, detailsReference, plannedDepartureTime, plannedArrivalTime } = detailedTrip;
          tripsWithVasttrafik = enrichedTrips.map((trip: any) => trip === liveTrip ? { ...trip, vasttrafikStops: stops, serviceJourneyGid, detailsReference, vasttrafikPlannedDepartureTime: plannedDepartureTime, vasttrafikPlannedArrivalTime: plannedArrivalTime } : trip);
        }
      }

      const liveTripWithDetails = tripsWithVasttrafik.find((trip: any) => trip.serviceJourneyGid === detailedTrip?.serviceJourneyGid) || liveTrip;
      const gid = liveTripWithDetails?.originGid || liveTripWithDetails?.routeStops?.[0]?.vasttrafikGid;

      if (!gid) {
        enrichedCirculations.push({ ...circObj, circulationTemplate: { ...template, trips: tripsWithVasttrafik } });
        continue;
      }

      try {
        const res = await fetch(`https://ext-api.vasttrafik.se/pr/v4/stop-areas/${gid}/departures?limit=50`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("VT API reached but failed");
        
        const liveData = await res.json();
        const tripLineNumber = liveTripWithDetails?.line?.toString();
        const tripDirection = liveTripWithDetails?.heading?.trim().toLowerCase();
        
        const liveMatch = liveData.results?.filter((d: any) => d.line?.shortName === tripLineNumber).filter((d: any) => {
          const dir = d.direction?.trim().toLowerCase() || "";
          return (!tripDirection || dir.includes(tripDirection) || tripDirection.includes(dir));
        }).sort((a: any, b: any) => timeDistance(getTimeFromIso(a.plannedTime || a.estimatedTime), liveTripWithDetails?.startTime) - timeDistance(getTimeFromIso(b.plannedTime || b.estimatedTime), liveTripWithDetails?.startTime))[0] || null;

        enrichedCirculations.push({
          ...circObj,
          circulationTemplate: { ...template, trips: tripsWithVasttrafik },
          liveStatus: liveMatch ? { delayMinutes: (liveMatch.delay || 0) / 60, estimatedTime: liveMatch.estimatedTime || liveMatch.plannedTime, isCancelled: liveMatch.isCancelled || false, serviceJourneyGid: detailedTrip?.serviceJourneyGid || null } : null,
        });
      } catch (error) {
        enrichedCirculations.push({ ...circObj, circulationTemplate: { ...template, trips: tripsWithVasttrafik } });
      }
    }

    return new Response(JSON.stringify({ ...schedule.toObject(), circulations: enrichedCirculations }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Critical Route Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
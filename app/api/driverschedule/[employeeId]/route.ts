import { connectToDB } from "@/utils/database";
import {
  DriverSchedule,
  CirculationTemplate,
  Driver,
  TramLine,
} from "@/models";
import { getVasttrafikToken } from "@/lib/vasttrafik";

type PopulatedStop = {
  name: string;
  vasttrafikGid?: string;
  minutesFromStart: number;
};
const isTripActiveNow = (
  date: Date,
  tripStartTime: string,
  tripEndTime: string,
) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const [startHour, startMinute] = tripStartTime.split(":").map(Number);
  const [endHour, endMinute] = tripEndTime.split(":").map(Number);

  const start = new Date(Date.UTC(year, month, day, startHour, startMinute, 0));
  let end = new Date(Date.UTC(year, month, day, endHour, endMinute, 0));

  if (end < start) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }

  const now = new Date();
  return now >= start && now <= end;
};

const getBestLiveTrip = (trips: any[], scheduleDate: Date) => {
  const activeTrip = trips.find((trip) =>
    isTripActiveNow(scheduleDate, trip.startTime, trip.endTime),
  );

  return activeTrip || trips[0] || null;
};

const normalizeStopName = (name?: string) =>
  (name || "")
    .trim()
    .toLowerCase()
    .replace(/,?\s*göteborg$/i, "")
    .replace(/\s+/g, " ")
    .trim();

const getRouteSlice = (
  routeStops: PopulatedStop[],
  originName: string,
  destinationName: string,
) => {
  const originIndex = routeStops.findIndex(
    (stop) => normalizeStopName(stop.name) === normalizeStopName(originName),
  );

  const destinationIndex = routeStops.findIndex(
    (stop) =>
      normalizeStopName(stop.name) === normalizeStopName(destinationName),
  );

  if (destinationIndex === -1) {
    return [];
  }

  if (originIndex !== -1 && originIndex <= destinationIndex) {
    return routeStops.slice(originIndex, destinationIndex + 1);
  }

  if (originIndex === -1) {
    return routeStops.slice(0, destinationIndex + 1);
  }

  return [];
};
const rebaseRouteStops = (stops: PopulatedStop[]) => {
  if (stops.length === 0) return [];

  const base = stops[0].minutesFromStart;

  return stops.map((stop) => ({
    ...stop,
    minutesFromStart: stop.minutesFromStart - base,
  }));
};

export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } },
) {
  const { searchParams } = new URL(req.url);
  const dateQuery = searchParams.get("date");

  if (!dateQuery) {
    return new Response("Missing 'date' query param", { status: 400 });
  }

  try {
    await connectToDB();

    const driver = await Driver.findOne({ employeeId: params.employeeId });
    if (!driver) {
      return new Response("Driver not found", { status: 404 });
    }
    const startOfDay = new Date(`${dateQuery}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateQuery}T23:59:59.999Z`);
    const schedule = await DriverSchedule.findOne({
      driver: driver._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate({
      path: "circulations.circulationTemplate",
      model: CirculationTemplate,
    });

    if (!schedule) {
      return new Response("Schedule not found", { status: 404 });
    }

    const token = await getVasttrafikToken();

    const enrichedCirculations = await Promise.all(
      schedule.circulations.map(async (circ: any) => {
        const circObj = circ.toObject();
        const template = circObj.circulationTemplate;

        if (
          !template ||
          !Array.isArray(template.trips) ||
          template.trips.length === 0
        ) {
          return circObj;
        }

        // Step 1: Enrich all trips with route stop geometry from our DB
        const enrichedTrips = await Promise.all(
          template.trips.map(async (trip: any) => {
            try {
              const tramLine = await TramLine.findOne({
                number: Number(trip.line),
                direction: trip.heading,
              }).populate("route.stop");

              if (!tramLine || !Array.isArray(tramLine.route)) {
                return { ...trip, routeStops: [] };
              }

              const populatedRoute: PopulatedStop[] = tramLine.route.map(
                (entry: any) => ({
                  name: entry.stop.name,
                  vasttrafikGid: entry.stop.vasttrafikGid || "",
                  minutesFromStart: entry.minutesFromStart,
                }),
              );

              const slicedRoute = getRouteSlice(
                populatedRoute,
                trip.originName,
                trip.destinationName,
              );

              const routeStops = rebaseRouteStops(slicedRoute);

              return { ...trip, routeStops };
            } catch (error) {
              console.error("Failed to enrich trip with routeStops:", error);
              return { ...trip, routeStops: [] };
            }
          }),
        );

        // Step 2: Handle Live Status (Västtrafik API)
        // We use the corrected 'originGid' and matching logic here
        const liveTrip = getBestLiveTrip(enrichedTrips, schedule.date);
        const gid = liveTrip?.originGid;

        if (!gid) {
          console.log(`⚠️ GID missing for designation ${template.designation}`);
          return {
            ...circObj,
            circulationTemplate: { ...template, trips: enrichedTrips },
          };
        }

        try {
          const res = await fetch(
            `https://ext-api.vasttrafik.se/pr/v4/stop-areas/${gid}/departures?limit=50`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (!res.ok) throw new Error("VT API reached but failed");

          const liveData = await res.json();
          if (!Array.isArray(liveData.results)) {
            throw new Error("Unexpected Västtrafik departures payload");
          }

          const tripLineNumber = liveTrip.line?.toString();
          const tripDirection = liveTrip.heading?.trim().toLowerCase();
          const tripStartTime = liveTrip.startTime;

          const toHm = (value?: string) => {
            if (!value) return "";
            const match = value.match(/T(\d{2}:\d{2})/);
            return match?.[1] || "";
          };

          const minutesFromHm = (hm: string) => {
            const [h, m] = hm.split(":").map(Number);
            return h * 60 + m;
          };

          const timeDistance = (a: string, b: string) => {
            if (!a || !b) return Number.POSITIVE_INFINITY;
            return Math.abs(minutesFromHm(a) - minutesFromHm(b));
          };

          const candidates = Array.isArray(liveData.results)
            ? liveData.results
            : [];

          const liveMatch =
            candidates
              .filter((d: any) => d.line?.shortName === tripLineNumber)
              .filter((d: any) => {
                const dir = d.direction?.trim().toLowerCase() || "";
                return (
                  !tripDirection ||
                  dir.includes(tripDirection) ||
                  tripDirection.includes(dir)
                );
              })
              .sort((a: any, b: any) => {
                const aTime = toHm(a.plannedTime || a.estimatedTime);
                const bTime = toHm(b.plannedTime || b.estimatedTime);
                return (
                  timeDistance(aTime, tripStartTime) -
                  timeDistance(bTime, tripStartTime)
                );
              })[0] || null;

          return {
            ...circObj,
            circulationTemplate: { ...template, trips: enrichedTrips },
            liveStatus: liveMatch
              ? {
                  delayMinutes: (liveMatch.delay || 0) / 60,
                  estimatedTime:
                    liveMatch.estimatedTime || liveMatch.plannedTime,
                  isCancelled: liveMatch.isCancelled || false,
                }
              : null,
          };
        } catch (error) {
          console.error(`Live fetch failed for GID ${gid}:`, error);
          return {
            ...circObj,
            circulationTemplate: { ...template, trips: enrichedTrips },
          };
        }
      }),
    );

    const finalResponse = {
      ...schedule.toObject(),
      circulations: enrichedCirculations,
    };

    return new Response(JSON.stringify(finalResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Critical Route Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

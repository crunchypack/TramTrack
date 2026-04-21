import { connectToDB } from "@/utils/database";
import { DriverSchedule, CirculationTemplate, Driver, TramLine } from "@/models";
import { getVasttrafikToken } from "@/lib/vasttrafik";

type PopulatedStop = {
  name: string;
  vasttrafikGid?: string;
};

const normalizeStopName = (name?: string) =>
  (name || "")
    .trim()
    .toLowerCase()
    .replace(/,?\s*göteborg$/i, "")
    .replace(/\s+/g, " ")
    .trim();

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const getTripDurationMinutes = (startTime: string, endTime: string) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  // Handles overnight trips if needed
  if (end < start) {
    return end + 24 * 60 - start;
  }

  return end - start;
};

const getRouteSlice = (
  routeStops: PopulatedStop[],
  originName: string,
  destinationName: string,
) => {
  const originIndex = routeStops.findIndex(
    (stop) => normalizeStopName(stop.name) === normalizeStopName(originName),
  );

  const destinationIndex = routeStops.findIndex(
    (stop) => normalizeStopName(stop.name) === normalizeStopName(destinationName),
  );

  if (originIndex === -1 || destinationIndex === -1) {
    return [];
  }

  if (originIndex > destinationIndex) {
    return [];
  }

  return routeStops.slice(originIndex, destinationIndex + 1);
};

const buildRouteStopsWithTiming = (
  slicedRoute: PopulatedStop[],
  tripStartTime: string,
  tripEndTime: string,
) => {
  if (slicedRoute.length === 0) return [];

  if (slicedRoute.length === 1) {
    return [
      {
        ...slicedRoute[0],
        minutesFromStart: 0,
      },
    ];
  }

  const totalTripMinutes = Math.max(
    1,
    getTripDurationMinutes(tripStartTime, tripEndTime),
  );

  return slicedRoute.map((stop, index) => ({
    ...stop,
    minutesFromStart: Math.round(
      (index / (slicedRoute.length - 1)) * totalTripMinutes,
    ),
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

    const schedule = await DriverSchedule.findOne({
      driver: driver._id,
      date: new Date(dateQuery),
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

        if (!template || !Array.isArray(template.trips) || template.trips.length === 0) {
          return circObj;
        }

        // Step 1: Enrich all trips with route stop geometry from our DB
        const enrichedTrips = await Promise.all(
          template.trips.map(async (trip: any) => {
            try {
              const tramLine = await TramLine.findOne({
                number: Number(trip.line),
                direction: trip.heading,
              }).populate("route");

              if (!tramLine || !Array.isArray(tramLine.route)) {
                return { ...trip, routeStops: [] };
              }

              const populatedRoute: PopulatedStop[] = tramLine.route.map((stop: any) => ({
                name: stop.name,
                vasttrafikGid: stop.vasttrafikGid || "",
              }));

              const slicedRoute = getRouteSlice(
                populatedRoute,
                trip.originName,
                trip.destinationName,
              );

              const routeStops = buildRouteStopsWithTiming(
                slicedRoute,
                trip.startTime,
                trip.endTime,
              );

              return { ...trip, routeStops };
            } catch (error) {
              console.error("Failed to enrich trip with routeStops:", error);
              return { ...trip, routeStops: [] };
            }
          }),
        );

        // Step 2: Handle Live Status (Västtrafik API)
        // We use the corrected 'originGid' and matching logic here
        const firstTrip = enrichedTrips[0];
        const gid = firstTrip?.originGid;

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
          const tripLineNumber = firstTrip.line?.toString();

          // Match by shortName (e.g. "6")
          const liveMatch = liveData.results?.find(
            (d: any) => d.line?.shortName === tripLineNumber,
          );

          return {
            ...circObj,
            circulationTemplate: { ...template, trips: enrichedTrips },
            liveStatus: liveMatch
              ? {
                  delayMinutes: (liveMatch.delay || 0) / 60,
                  estimatedTime: liveMatch.estimatedTime || liveMatch.plannedTime,
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
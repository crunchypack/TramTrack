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

type VasttrafikStop = {
  gid: string | null;
  name: string;
  index: number;

  plannedArrivalTime: string | null;
  plannedDepartureTime: string | null;

  estimatedArrivalTime: string | null;
  estimatedDepartureTime: string | null;

  isCancelled: boolean;
};

type DetailedVasttrafikTrip = {
  serviceJourneyGid: string | null;
  line: string | null;
  direction: string;
  plannedDepartureTime: string | null;
  plannedArrivalTime: string | null;
  detailsReference: string;
  stops: VasttrafikStop[];
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

  const start = new Date(
    Date.UTC(year, month, day, startHour, startMinute, 0),
  );

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

const getTimeFromIso = (value?: string | null) => {
  if (!value) return "";

  const match = value.match(/T(\d{2}:\d{2})/);

  return match?.[1] || "";
};

const minutesFromHm = (hm: string) => {
  if (!hm) return Number.POSITIVE_INFINITY;

  const [h, m] = hm.split(":").map(Number);

  if (Number.isNaN(h) || Number.isNaN(m)) {
    return Number.POSITIVE_INFINITY;
  }

  return h * 60 + m;
};

const timeDistance = (a: string, b: string) => {
  const aMinutes = minutesFromHm(a);
  const bMinutes = minutesFromHm(b);

  if (
    !Number.isFinite(aMinutes) ||
    !Number.isFinite(bMinutes)
  ) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.abs(aMinutes - bMinutes);
};

/**
 * Gets the UTC offset used in Europe/Stockholm for the requested date/time.
 * This avoids hard-coding +02:00 so winter schedules can use +01:00.
 */
const getStockholmOffset = (date: string, time: string) => {
  const guess = new Date(`${date}T${time}:00Z`);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Stockholm",
    timeZoneName: "longOffset",
  }).formatToParts(guess);

  const offset = parts.find((part) => part.type === "timeZoneName")?.value;

  if (!offset || offset === "GMT") {
    return "+00:00";
  }

  return offset.replace("GMT", "");
};

/**
 * Fetches the journey details for one scheduled trip and converts
 * callsOnTripLeg into the simplified structure used by the app.
 */
const getDetailedVasttrafikTrip = async ({
  accessToken,
  date,
  trip,
  routeStops,
}: {
  accessToken: string;
  date: string;
  trip: any;
  routeStops: PopulatedStop[];
}): Promise<DetailedVasttrafikTrip | null> => {
  const originGid =
    trip.originGid ||
    trip.startStop?.vasttrafikGid ||
    routeStops[0]?.vasttrafikGid;

  const destinationGid =
    trip.destinationGid ||
    trip.endStop?.vasttrafikGid ||
    routeStops[routeStops.length - 1]?.vasttrafikGid;

  if (!originGid || !destinationGid) {
    console.warn(
      "Cannot fetch detailed Västtrafik trip: missing origin/destination GID",
      {
        line: trip.line,
        heading: trip.heading,
        startTime: trip.startTime,
        originGid,
        destinationGid,
      },
    );

    return null;
  }

  const offset = getStockholmOffset(date, trip.startTime);

  let currentUrl =
    `https://ext-api.vasttrafik.se/pr/v4/journeys` +
    `?originGid=${encodeURIComponent(originGid)}` +
    `&destinationGid=${encodeURIComponent(destinationGid)}` +
    `&dateTime=${encodeURIComponent(
      `${date}T${trip.startTime}:00${offset}`,
    )}` +
    `&transportModes=tram` +
    `&limit=50` +
    `&onlyDirectConnections=true`;

  const candidates: Array<{
    detailsReference: string;
    tramLeg: any;
  }> = [];

  // Search a few pages because the exact scheduled journey
  // may not be the first result returned by Västtrafik.
  for (let page = 0; page < 5; page++) {
    const res = await fetch(currentUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(
        "Västtrafik journey search failed:",
        res.status,
        await res.text(),
      );

      break;
    }

    const data = await res.json();

    if (!Array.isArray(data.results) || data.results.length === 0) {
      break;
    }

    for (const journey of data.results) {
      const tramLeg = journey.tripLegs?.find(
        (leg: any) =>
          leg.serviceJourney?.line?.shortName ===
          trip.line?.toString(),
      );

      if (!tramLeg || !journey.detailsReference) {
        continue;
      }

      const apiDirection =
        tramLeg.serviceJourney?.direction
          ?.trim()
          .toLowerCase() || "";

      const wantedDirection =
        trip.heading?.trim().toLowerCase() || "";

      if (
        wantedDirection &&
        !apiDirection.includes(wantedDirection) &&
        !wantedDirection.includes(apiDirection)
      ) {
        continue;
      }

      candidates.push({
        detailsReference: journey.detailsReference,
        tramLeg,
      });
    }

    if (data.links?.next) {
      currentUrl =
        `https://ext-api.vasttrafik.se/pr/v4/${data.links.next}`;
    } else {
      break;
    }
  }

  if (candidates.length === 0) {
    console.warn(
      "No matching Västtrafik journey found:",
      {
        line: trip.line,
        heading: trip.heading,
        startTime: trip.startTime,
        originGid,
        destinationGid,
      },
    );

    return null;
  }

  // Pick the candidate whose departure time is closest
  // to the scheduled database trip.
  const matchingCandidate = candidates.sort((a, b) => {
    const aTime = getTimeFromIso(
      a.tramLeg.plannedDepartureTime,
    );

    const bTime = getTimeFromIso(
      b.tramLeg.plannedDepartureTime,
    );

    return (
      timeDistance(aTime, trip.startTime) -
      timeDistance(bTime, trip.startTime)
    );
  })[0];

  if (!matchingCandidate) {
    return null;
  }

  const detailsUrl =
    `https://ext-api.vasttrafik.se/pr/v4/journeys/` +
    `${encodeURIComponent(matchingCandidate.detailsReference)}/details`;

  const detailsRes = await fetch(detailsUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!detailsRes.ok) {
    console.error(
      "Västtrafik details request failed:",
      detailsRes.status,
      await detailsRes.text(),
    );

    return null;
  }

  const detailsData = await detailsRes.json();

  // IMPORTANT:
  // /details returns { tripLegs: [...] }
  // not { details: { tripLegs: [...] } }.
  const tripLeg = detailsData?.tripLegs?.[0];

  if (!tripLeg) {
    console.error(
      "No tripLeg found in details response:",
      matchingCandidate.detailsReference,
    );
    console.error("Data:", detailsData);

    return null;
  }

  const serviceJourney = tripLeg.serviceJourneys?.[0];

  const calls = Array.isArray(tripLeg.callsOnTripLeg)
    ? tripLeg.callsOnTripLeg
    : [];

  const stops: VasttrafikStop[] = calls
    .map((call: any) => {
      const stopPoint = call.stopPoint;
      const stopArea = stopPoint?.stopArea;

      return {
        gid:
          stopArea?.gid ??
          stopPoint?.gid ??
          null,

        name:
          stopArea?.name ??
          stopPoint?.name ??
          "Unknown",

        index: Number(call.index),

        plannedArrivalTime:
          call.plannedArrivalTime ??
          null,

        plannedDepartureTime:
          call.plannedDepartureTime ??
          null,

        estimatedArrivalTime:
          call.estimatedArrivalTime ??
          call.estimatedOtherwisePlannedArrivalTime ??
          null,

        estimatedDepartureTime:
          call.estimatedDepartureTime ??
          call.estimatedOtherwisePlannedDepartureTime ??
          null,

        isCancelled:
          call.isCancelled ??
          false,
      };
    })
    .sort((a: { index: number; }, b: { index: number; }) => a.index - b.index);

  return {
    serviceJourneyGid:
      serviceJourney?.gid ??
      matchingCandidate.tramLeg.serviceJourney?.gid ??
      null,

    line:
      serviceJourney?.line?.name ??
      trip.line?.toString() ??
      null,

    direction:
      serviceJourney?.direction ??
      trip.heading ??
      "Unknown",

    plannedDepartureTime:
      matchingCandidate.tramLeg.plannedDepartureTime ??
      stops[0]?.plannedDepartureTime ??
      null,

    plannedArrivalTime:
      matchingCandidate.tramLeg.plannedArrivalTime ??
      stops[stops.length - 1]?.plannedArrivalTime ??
      null,

    detailsReference:
      matchingCandidate.detailsReference,

    stops,
  };
};

export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } },
) {
  const { searchParams } = new URL(req.url);
  const dateQuery = searchParams.get("date");

  if (!dateQuery) {
    return new Response(
      "Missing 'date' query param",
      { status: 400 },
    );
  }

  try {
    await connectToDB();

    const driver = await Driver.findOne({
      employeeId: params.employeeId,
    });

    if (!driver) {
      return new Response(
        "Driver not found",
        { status: 404 },
      );
    }

    const startOfDay = new Date(
      `${dateQuery}T00:00:00.000Z`,
    );

    const endOfDay = new Date(
      `${dateQuery}T23:59:59.999Z`,
    );

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
      return new Response(
        "Schedule not found",
        { status: 404 },
      );
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

        // --------------------------------------------------
        // STEP 1:
        // Enrich all trips with our route geometry.
        // --------------------------------------------------

        const enrichedTrips = await Promise.all(
          template.trips.map(async (trip: any) => {
            try {
              const tramLine = await TramLine.findOne({
                number: Number(trip.line),
                direction: trip.heading,
              }).populate("route.stop");

              if (
                !tramLine ||
                !Array.isArray(tramLine.route)
              ) {
                return {
                  ...trip,
                  routeStops: [],
                };
              }

              const populatedRoute: PopulatedStop[] =
                tramLine.route.map((entry: any) => ({
                  name: entry.stop.name,
                  vasttrafikGid:
                    entry.stop.vasttrafikGid || "",
                  minutesFromStart:
                    entry.minutesFromStart,
                }));

              const slicedRoute = getRouteSlice(
                populatedRoute,
                trip.originName,
                trip.destinationName,
              );

              const routeStops =
                rebaseRouteStops(slicedRoute);

              return {
                ...trip,
                routeStops,
              };
            } catch (error) {
              console.error(
                "Failed to enrich trip with routeStops:",
                error,
              );

              return {
                ...trip,
                routeStops: [],
              };
            }
          }),
        );

        // --------------------------------------------------
        // STEP 2:
        // Pick the trip currently relevant to this circulation.
        // --------------------------------------------------

        const liveTrip = getBestLiveTrip(
          enrichedTrips,
          schedule.date,
        );

        // --------------------------------------------------
        // STEP 3:
        // Fetch actual stop-by-stop Västtrafik timetable
        // for the selected trip.
        // --------------------------------------------------

        let tripsWithVasttrafik =
          enrichedTrips;

        let detailedTrip:
          | DetailedVasttrafikTrip
          | null = null;

        if (liveTrip) {
          try {
            detailedTrip =
              await getDetailedVasttrafikTrip({
                accessToken: token,
                date: dateQuery,
                trip: liveTrip,
                routeStops:
                  liveTrip.routeStops || [],
              });

            if (detailedTrip) {
  const vasttrafikStops = detailedTrip.stops;
  const serviceJourneyGid = detailedTrip.serviceJourneyGid;
  const detailsReference = detailedTrip.detailsReference;
  const plannedDepartureTime =
    detailedTrip.plannedDepartureTime;
  const plannedArrivalTime =
    detailedTrip.plannedArrivalTime;

  tripsWithVasttrafik = enrichedTrips.map((trip: any) => {
    if (trip === liveTrip) {
      return {
        ...trip,

        // Complete Västtrafik stop schedule.
        vasttrafikStops,

        // Exact Västtrafik service journey.
        serviceJourneyGid,

        detailsReference,

        vasttrafikPlannedDepartureTime:
          plannedDepartureTime,

        vasttrafikPlannedArrivalTime:
          plannedArrivalTime,
      };
    }

    return trip;
  });
            }else {
              console.warn(
                "No detailed Västtrafik trip found for liveTrip:",
                {
                  line: liveTrip.line,
                  heading: liveTrip.heading,
                  startTime: liveTrip.startTime,
                },
              );
            }
          } catch (error) {
            console.error(
              "Failed to get detailed Västtrafik trip:",
              error,
            );
          }
        }

        // --------------------------------------------------
        // STEP 4:
        // Existing live-status lookup.
        // --------------------------------------------------

        const liveTripWithDetails =
          tripsWithVasttrafik.find(
            (trip: any) =>
              trip.serviceJourneyGid ===
              detailedTrip?.serviceJourneyGid,
          ) || liveTrip;

        const gid =
          liveTripWithDetails?.originGid ||
          liveTripWithDetails?.routeStops?.[0]
            ?.vasttrafikGid;

        if (!gid) {
          console.log(
            `⚠️ GID missing for designation ${template.designation}`,
          );

          return {
            ...circObj,
            circulationTemplate: {
              ...template,
              trips: tripsWithVasttrafik,
            },
          };
        }

        try {
          const res = await fetch(
            `https://ext-api.vasttrafik.se/pr/v4/stop-areas/${gid}/departures?limit=50`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );

          if (!res.ok) {
            throw new Error(
              "VT API reached but failed",
            );
          }

          const liveData = await res.json();

          if (!Array.isArray(liveData.results)) {
            throw new Error(
              "Unexpected Västtrafik departures payload",
            );
          }

          const tripLineNumber =
            liveTripWithDetails?.line?.toString();

          const tripDirection =
            liveTripWithDetails?.heading
              ?.trim()
              .toLowerCase();

          const tripStartTime =
            liveTripWithDetails?.startTime;

          const candidates =
            liveData.results;

          const liveMatch =
            candidates
              .filter(
                (d: any) =>
                  d.line?.shortName ===
                  tripLineNumber,
              )
              .filter((d: any) => {
                const dir =
                  d.direction
                    ?.trim()
                    .toLowerCase() || "";

                return (
                  !tripDirection ||
                  dir.includes(tripDirection) ||
                  tripDirection.includes(dir)
                );
              })
              .sort((a: any, b: any) => {
                const aTime =
                  getTimeFromIso(
                    a.plannedTime ||
                      a.estimatedTime,
                  );

                const bTime =
                  getTimeFromIso(
                    b.plannedTime ||
                      b.estimatedTime,
                  );

                return (
                  timeDistance(
                    aTime,
                    tripStartTime,
                  ) -
                  timeDistance(
                    bTime,
                    tripStartTime,
                  )
                );
              })[0] || null;

          return {
            ...circObj,

            circulationTemplate: {
              ...template,
              trips: tripsWithVasttrafik,
            },

            liveStatus: liveMatch
              ? {
                  delayMinutes:
                    (liveMatch.delay || 0) /
                    60,

                  estimatedTime:
                    liveMatch.estimatedTime ||
                    liveMatch.plannedTime,

                  isCancelled:
                    liveMatch.isCancelled ||
                    false,

                  // This will be useful when we
                  // connect the exact service journey
                  // to realtime vehicle data.
                  serviceJourneyGid:
                    detailedTrip?.serviceJourneyGid ||
                    null,
                }
              : null,
          };
        } catch (error) {
          console.error(
            `Live fetch failed for GID ${gid}:`,
            error,
          );

          return {
            ...circObj,

            circulationTemplate: {
              ...template,
              trips: tripsWithVasttrafik,
            },
          };
        }
      }),
    );

    const finalResponse = {
      ...schedule.toObject(),
      circulations: enrichedCirculations,
    };

    return new Response(
      JSON.stringify(finalResponse),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/json",
        },
      },
    );
  } catch (err) {
    console.error(
      "Critical Route Error:",
      err,
    );

    return new Response(
      "Internal Server Error",
      { status: 500 },
    );
  }
}
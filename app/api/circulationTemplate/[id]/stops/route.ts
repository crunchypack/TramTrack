import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/utils/database";
import { CirculationTemplate, TramLine } from "@/models";
import { getVasttrafikToken } from "@/lib/vasttrafik";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export interface RouteStopDetail {
  index: number;
  name: string;
  gid: string | null;
  arrivalTime: string;
  departureTime: string;
  isReliefPoint: boolean;
}

export interface TripWithStops {
  tripIndex: number;
  line: string;
  heading: string;
  startTime: string;
  endTime: string;
  originName: string;
  originGid?: string;
  destinationName: string;
  destinationGid?: string;
  detailsReference?: string;
  source: "vasttrafik" | "fallback";
  stops: RouteStopDetail[];
}

// Known common relief points in Gothenburg tram network
const DEFAULT_RELIEF_STOP_NAMES = [
  "svingeln",
  "ullevi norra",
  "centralstationen",
  "drottningtorget",
  "vagnhallen majorna",
  "jaegerdorffsplatsen",
  "frihamnen",
  "hjalmar brantingsplatsen",
  "brunnsparken",
  "korsvägen",
  "marklandsgatan",
  "redbergsplatsen",
];

const normalizeName = (name?: string) =>
  (name || "")
    .trim()
    .toLowerCase()
    .replace(/,?\s*göteborg$/i, "")
    .replace(/\s+/g, " ")
    .trim();

const getTimeFromIso = (iso?: string | null): string => {
  if (!iso) return "";
  const match = iso.match(/T(\d{2}:\d{2})/);
  return match?.[1] || "";
};

const getStockholmOffset = (dateStr: string, time: string = "12:00") => {
  try {
    const guess = new Date(`${dateStr}T${time}:00Z`);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Stockholm",
      timeZoneName: "longOffset",
    }).formatToParts(guess);
    const offset = parts.find((part) => part.type === "timeZoneName")?.value;
    return !offset || offset === "GMT" ? "+02:00" : offset.replace("GMT", "");
  } catch {
    return "+02:00";
  }
};

const minutesFromHm = (hm: string) => {
  if (!hm) return Number.POSITIVE_INFINITY;
  const [h, m] = hm.split(":").map(Number);
  return Number.isNaN(h) || Number.isNaN(m)
    ? Number.POSITIVE_INFINITY
    : h * 60 + m;
};

const timeDistance = (a: string, b: string) => {
  const aM = minutesFromHm(a);
  const bM = minutesFromHm(b);
  return !Number.isFinite(aM) || !Number.isFinite(bM)
    ? Number.POSITIVE_INFINITY
    : Math.abs(aM - bM);
};

export async function GET(req: Request, context: RouteContext) {
  try {
    await connectToDB();
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    const { searchParams } = new URL(req.url);

    // Default to today in local Sweden date
    const dateInput =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Find the circulation template
    const filter: Record<string, any> = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { designation: Number(id) };

    const template = await CirculationTemplate.findOne(filter);
    if (!template) {
      return NextResponse.json(
        { error: "Circulation template not found" },
        { status: 404 },
      );
    }

    // Load TramLines to retrieve designated relief points and fallback route geometry
    const tramLines = await TramLine.find({})
      .populate("route.stop")
      .populate("reliefPoints");

    const reliefStopSet = new Set<string>(DEFAULT_RELIEF_STOP_NAMES);
    for (const tl of tramLines) {
      if (Array.isArray(tl.reliefPoints)) {
        for (const rp of tl.reliefPoints as any[]) {
          if (rp?.name) reliefStopSet.add(normalizeName(rp.name));
        }
      }
    }

    let token = "";
    try {
      token = await getVasttrafikToken();
    } catch (tokenErr) {
      console.warn("Could not retrieve Västtrafik token:", tokenErr);
    }

    const tripsWithStops: TripWithStops[] = [];

    for (let tripIdx = 0; tripIdx < template.trips.length; tripIdx++) {
      const trip = template.trips[tripIdx];
      const tripLineStr = trip.line?.toString() || "";
      const tripHeading = trip.heading || "";
      let detailedStops: RouteStopDetail[] | null = null;
      let usedDetailsRef = trip.detailsReference || "";

      // 1. Try fetching from Västtrafik if token is available
      if (token) {
        try {
          let detailsRefToUse = trip.detailsReference;

          // If no stored detailsReference, search journeys in Västtrafik API
          if (!detailsRefToUse && trip.originGid && trip.destinationGid) {
            const offset = getStockholmOffset(dateInput, trip.startTime);
            const searchUrl =
              `https://ext-api.vasttrafik.se/pr/v4/journeys` +
              `?originGid=${encodeURIComponent(trip.originGid)}` +
              `&destinationGid=${encodeURIComponent(trip.destinationGid)}` +
              `&dateTime=${encodeURIComponent(
                `${dateInput}T${trip.startTime}:00${offset}`,
              )}` +
              `&transportModes=tram` +
              `&limit=20` +
              `&onlyDirectConnections=true`;

            const searchRes = await fetch(searchUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            });

            if (searchRes.ok) {
              const searchData = await searchRes.json();
              const candidateJourneys: any[] = [];

              for (const j of searchData.results || []) {
                const leg = j.tripLegs?.find(
                  (l: any) =>
                    l.serviceJourney?.line?.shortName === tripLineStr,
                );
                if (leg && j.detailsReference) {
                  candidateJourneys.push({
                    detailsReference: j.detailsReference,
                    plannedDepartureTime: leg.plannedDepartureTime,
                  });
                }
              }

              // Pick the candidate closest to scheduled start time
              if (candidateJourneys.length > 0) {
                candidateJourneys.sort(
                  (a, b) =>
                    timeDistance(
                      getTimeFromIso(a.plannedDepartureTime),
                      trip.startTime,
                    ) -
                    timeDistance(
                      getTimeFromIso(b.plannedDepartureTime),
                      trip.startTime,
                    ),
                );
                detailsRefToUse = candidateJourneys[0].detailsReference;
              }
            }
          }

          // Fetch stop-by-stop details using the reference
          if (detailsRefToUse) {
            const detRes = await fetch(
              `https://ext-api.vasttrafik.se/pr/v4/journeys/${encodeURIComponent(
                detailsRefToUse,
              )}/details`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              },
            );

            if (detRes.ok) {
              const detData = await detRes.json();
              const calls = detData?.tripLegs?.[0]?.callsOnTripLeg || [];

              if (calls.length > 0) {
                usedDetailsRef = detailsRefToUse;
                detailedStops = calls.map((call: any, idx: number) => {
                  const rawName =
                    call.stopPoint?.stopArea?.name ||
                    call.stopPoint?.name ||
                    "Unknown Stop";
                  const cleanName = rawName.replace(/,?\s*göteborg$/i, "");
                  const arr = getTimeFromIso(call.plannedArrivalTime);
                  const dep = getTimeFromIso(call.plannedDepartureTime);
                  const effectiveTime = dep || arr || trip.startTime;

                  return {
                    index: idx,
                    name: cleanName,
                    gid:
                      call.stopPoint?.stopArea?.gid ||
                      call.stopPoint?.gid ||
                      null,
                    arrivalTime: arr || effectiveTime,
                    departureTime: dep || effectiveTime,
                    isReliefPoint: reliefStopSet.has(normalizeName(cleanName)),
                  };
                });
              }
            }
          }
        } catch (vtErr) {
          console.warn(
            `Västtrafik fetch failed for leg ${tripIdx + 1}:`,
            vtErr,
          );
        }
      }

      // 2. Fallback to DB TramLine geometry if Västtrafik had no results
      if (!detailedStops || detailedStops.length === 0) {
        const matchingLine = tramLines.find(
          (tl) =>
            tl.number === Number(trip.line) &&
            normalizeName(tl.direction) === normalizeName(tripHeading),
        );

        if (matchingLine && Array.isArray(matchingLine.route)) {
          const normOrigin = normalizeName(trip.originName);
          const normDest = normalizeName(trip.destinationName);

          const origIdx = matchingLine.route.findIndex(
            (r: any) => normalizeName(r.stop?.name) === normOrigin,
          );
          const destIdx = matchingLine.route.findIndex(
            (r: any) => normalizeName(r.stop?.name) === normDest,
          );

          let sliced = matchingLine.route;
          if (origIdx !== -1 && destIdx !== -1 && origIdx <= destIdx) {
            sliced = matchingLine.route.slice(origIdx, destIdx + 1);
          } else if (destIdx !== -1) {
            sliced = matchingLine.route.slice(0, destIdx + 1);
          }

          const startMinutes = minutesFromHm(trip.startTime);
          const baseOffset = sliced[0]?.minutesFromStart || 0;

          detailedStops = sliced.map((entry: any, sIdx: number) => {
            const stopName = (entry.stop?.name || "Unknown Stop").replace(
              /,?\s*göteborg$/i,
              "",
            );
            const estMinutes =
              startMinutes + (entry.minutesFromStart - baseOffset);
            const hrs = Math.floor(estMinutes / 60) % 24;
            const mins = estMinutes % 60;
            const calculatedTime = `${hrs.toString().padStart(2, "0")}:${mins
              .toString()
              .padStart(2, "0")}`;

            return {
              index: sIdx,
              name: stopName,
              gid: entry.stop?.vasttrafikGid || null,
              arrivalTime: calculatedTime,
              departureTime: calculatedTime,
              isReliefPoint: reliefStopSet.has(normalizeName(stopName)),
            };
          });
        }
      }

      // 3. Absolute fallback: Origin and Destination only
      if (!detailedStops || detailedStops.length === 0) {
        const originClean = trip.originName.replace(/,?\s*göteborg$/i, "");
        const destClean = trip.destinationName.replace(/,?\s*göteborg$/i, "");

        detailedStops = [
          {
            index: 0,
            name: originClean,
            gid: trip.originGid || null,
            arrivalTime: trip.startTime,
            departureTime: trip.startTime,
            isReliefPoint: reliefStopSet.has(normalizeName(originClean)),
          },
          {
            index: 1,
            name: destClean,
            gid: trip.destinationGid || null,
            arrivalTime: trip.endTime,
            departureTime: trip.endTime,
            isReliefPoint: reliefStopSet.has(normalizeName(destClean)),
          },
        ];
      }

      tripsWithStops.push({
        tripIndex: tripIdx,
        line: tripLineStr,
        heading: tripHeading,
        startTime: trip.startTime,
        endTime: trip.endTime,
        originName: trip.originName,
        originGid: trip.originGid,
        destinationName: trip.destinationName,
        destinationGid: trip.destinationGid,
        detailsReference: usedDetailsRef,
        source: token && usedDetailsRef ? "vasttrafik" : "fallback",
        stops: detailedStops,
      });
    }

    return NextResponse.json({
      circulationId: template._id,
      designation: template.designation,
      date: dateInput,
      trips: tripsWithStops,
    });
  } catch (error: any) {
    console.error("Failed to fetch stops for circulation:", error);
    return NextResponse.json(
      { error: "Failed to fetch circulation stops", details: error.message },
      { status: 500 },
    );
  }
}

import { getVasttrafikToken } from "@/lib/vasttrafik";
import { NextResponse } from "next/server";

/**
 * Extracts the time in HH:MM format from an ISO 8601 date-time string.
 * @param iso - The ISO 8601 date-time string.
 * @returns The time in HH:MM format or null if the input is invalid.
 */
function getTime(iso?: string | null) {
  if (!iso) return null;

  const match = iso.match(/T(\d{2}:\d{2})/);
  return match?.[1] ?? null;
}

/**
 * Fetches detailed information for a specific tram journey.
 * @param accessToken - The access token for Vasttrafik API.
 * @param detailsReference - The reference ID for the journey details.
 * @param fallbackTrip - The fallback trip data.
 * @returns The detailed trip information or null if the request fails.
 */
async function fetchTripDetails(
  accessToken: string,
  detailsReference: string,
  fallbackTrip: any,
) {
  const detailsUrl = `https://ext-api.vasttrafik.se/pr/v4/journeys/${encodeURIComponent(
    detailsReference,
  )}/details`;

  const res = await fetch(detailsUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error("Details request failed for detailsReference:", detailsReference);
    console.error("Status:", res.status, "Status Text:", res.statusText);
    return null;
  }

  const data = await res.json();

  // The details response contains the complete stop-by-stop trip.
  const tripLeg = data?.tripLegs?.[0];

  if (!tripLeg) {
    console.error("No tripLeg found in details response for detailsReference:", detailsReference);
    console.error("Data:", data);
    return null;
  }

  const serviceJourney = tripLeg.serviceJourneys?.[0];

  const calls = tripLeg.callsOnTripLeg ?? [];

  const stops = calls
    .map((call: any) => {
      const stopPoint = call.stopPoint;
      const stopArea = stopPoint?.stopArea;

      return {
        gid: stopArea?.gid ?? stopPoint?.gid ?? null,
        name: stopArea?.name ?? stopPoint?.name ?? "Unknown",
        index: Number(call.index),

        plannedArrivalTime: call.plannedArrivalTime ?? null,
        plannedDepartureTime: call.plannedDepartureTime ?? null,

        estimatedArrivalTime:
          call.estimatedArrivalTime ??
          call.estimatedOtherwisePlannedArrivalTime ??
          null,

        estimatedDepartureTime:
          call.estimatedDepartureTime ??
          call.estimatedOtherwisePlannedDepartureTime ??
          null,

        isCancelled: call.isCancelled ?? false,
      };
    })
    .sort((a: any, b: any) => a.index - b.index);

  return {
    serviceJourneyGid:
      serviceJourney?.gid ??
      fallbackTrip.serviceJourney?.gid ??
      fallbackTrip.gid ??
      null,

    line:
      serviceJourney?.line?.name ??
      fallbackTrip.serviceJourney?.line?.shortName ??
      null,

    direction:
      serviceJourney?.direction ??
      fallbackTrip.serviceJourney?.direction ??
      "Unknown",

    plannedDepartureTime:
      fallbackTrip.plannedDepartureTime ??
      stops[0]?.plannedDepartureTime ?? null,

    plannedArrivalTime:
      fallbackTrip.plannedArrivalTime ??
      stops[stops.length - 1]?.plannedArrivalTime ?? null,

    startTime:
      getTime(
        fallbackTrip.plannedDepartureTime ??
          stops[0]?.plannedDepartureTime,
      ),

    endTime:
      getTime(
        fallbackTrip.plannedArrivalTime ??
          stops[stops.length - 1]?.plannedArrivalTime,
      ),

    heading:
      serviceJourney?.direction ??
      fallbackTrip.serviceJourney?.direction ??
      "Unknown",

    originName:
      stops[0]?.name ??
      fallbackTrip.origin?.stopPoint?.stopArea?.name ??
      fallbackTrip.origin?.stopPoint?.name ??
      "Unknown",

    originGid:
      stops[0]?.gid ??
      fallbackTrip.origin?.stopPoint?.stopArea?.gid ??
      fallbackTrip.origin?.stopPoint?.gid ??
      null,

    destinationName:
      stops[stops.length - 1]?.name ??
      fallbackTrip.destination?.stopPoint?.stopArea?.name ??
      fallbackTrip.destination?.stopPoint?.name ??
      "Unknown",

    destinationGid:
      stops[stops.length - 1]?.gid ??
      fallbackTrip.destination?.stopPoint?.stopArea?.gid ??
      fallbackTrip.destination?.stopPoint?.gid ??
      null,

    detailsReference,

    stops,
  };
}

/**
 * Handles the GET request to fetch tram journeys based on query parameters.
 * @param req - The incoming request object.
 * @returns A JSON response containing the unique tram journeys with details.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const line = searchParams.get("line");
  const originGid = searchParams.get("originGid");
  const destinationGid = searchParams.get("destinationGid");
  const dateInput = searchParams.get("date");
  const timeInput = searchParams.get("time") || "04:00";

  if (!line || !originGid || !destinationGid || !dateInput) {
    return NextResponse.json(
      { error: "Missing required params" },
      { status: 400 },
    );
  }

  try {
    const accessToken = await getVasttrafikToken();

    const allJourneyResults: any[] = [];

    let currentUrl =
      `https://ext-api.vasttrafik.se/pr/v4/journeys` +
      `?originGid=${encodeURIComponent(originGid)}` +
      `&destinationGid=${encodeURIComponent(destinationGid)}` +
      `&dateTime=${encodeURIComponent(
        `${dateInput}T${timeInput}:00+02:00`,
      )}` +
      `&transportModes=tram` +
      `&limit=50` +
      `&onlyDirectConnections=true`;

    // Get the journey search results first.
    for (let i = 0; i < 5; i++) {
      const res = await fetch(currentUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        break;
      }

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        break;
      }

      for (const journey of data.results) {
        const tramLeg = journey.tripLegs?.find(
          (leg: any) =>
            leg.serviceJourney?.line?.shortName === line,
        );

        if (!tramLeg) {
          continue;
        }

        if (!journey.detailsReference) {
          continue;
        }

        allJourneyResults.push({
          journey,
          tramLeg,
          detailsReference: journey.detailsReference,
        });
      }

      if (data.links?.next) {
        currentUrl = `https://ext-api.vasttrafik.se/pr/v4/${data.links.next}`;
      } else {
        break;
      }
    }

    // Remove duplicate service journeys before requesting details.
    const uniqueJourneyResults = Array.from(
      new Map(
        allJourneyResults.map((item) => [
          item.tramLeg?.serviceJourney?.gid,
          item,
        ]),
      ).values(),
    );

    // Fetch the detailed stop list for every unique trip.
    const detailedTrips = await Promise.all(
      uniqueJourneyResults.map(async (item) => {
        try {
          return await fetchTripDetails(
            accessToken,
            item.detailsReference,
            item.tramLeg,
          );
        } catch {
          return null;
        }
      }),
    );
    console.log(`Västtrafik search-trips: Found ${detailedTrips.length} trips for line ${line} from ${originGid} to ${destinationGid} on ${dateInput} at ${timeInput}`,
    );


    const trips = detailedTrips
      .filter(Boolean)
      .sort((a: any, b: any) => {
        return (
          new Date(a.plannedDepartureTime).getTime() -
          new Date(b.plannedDepartureTime).getTime()
        );
      });
    // log each trip
    console.log(trips);


    return NextResponse.json(trips);
  } catch (error: any) {
    console.error("Västtrafik search-trips error:", error);

    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 },
    );
  }
}
import { getVasttrafikToken } from "@/lib/vasttrafik";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const line = searchParams.get("line");
  const originGid = searchParams.get("originGid");
  const destinationGid = searchParams.get("destinationGid");
  const dateInput = searchParams.get("date");
  const timeInput = searchParams.get("time") || "04:00"; // Default to 04:00 if not provided

  if (!line || !originGid || !destinationGid || !dateInput) {
    return NextResponse.json(
      { error: "Missing required params" },
      { status: 400 },
    );
  }

  try {
    const access_token = await getVasttrafikToken();
    let allTrips: any[] = [];

    // We use %2B02:00 for Swedish Summer Time (CEST)
    let currentUrl = `https://ext-api.vasttrafik.se/pr/v4/journeys?originGid=${originGid}&destinationGid=${destinationGid}&dateTime=${dateInput}T${timeInput}:00%2B02:00&transportModes=tram&limit=50&onlyDirectConnections=true`;

    // Increased to 5 iterations to capture ~8-10 hours of results
    for (let i = 0; i < 5; i++) {
      const res = await fetch(currentUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) break;

      const data = await res.json();
      if (!data.results || data.results.length === 0) break;

      const batch = data.results
        .map((journey: any) => {
          const tramLeg = journey.tripLegs?.find(
            (l: any) => l.serviceJourney?.line?.shortName === line,
          );
          if (!tramLeg) return null;

          return {
            _id: tramLeg.serviceJourney.gid,
            startTime: tramLeg.plannedDepartureTime
              .split("T")[1]
              .substring(0, 5),
            endTime: tramLeg.plannedArrivalTime.split("T")[1].substring(0, 5),
            heading: tramLeg.serviceJourney.direction || "Unknown",
            originName: tramLeg.origin?.stopPoint?.name || "Unknown",
            originGid:
              tramLeg.origin?.stopPoint?.stopArea?.gid ||
              tramLeg.origin?.stopPoint?.gid ||
              "Missing GID",
            destinationName: tramLeg.destination?.stopPoint?.name || "Unknown",
            destinationGid:
              tramLeg.destination?.stopPoint?.stopArea?.gid ||
              tramLeg.destination?.stopPoint?.gid ||
              "Missing GID",
          };
        })
        .filter(Boolean);

      allTrips = [...allTrips, ...batch];

      if (data.links?.next) {
        currentUrl = `https://ext-api.vasttrafik.se/pr/v4/${data.links.next}`;
      } else {
        break;
      }
    }

    const uniqueTrips = Array.from(
      new Map(allTrips.map((item) => [item._id, item])).values(),
    );
    return NextResponse.json(
      uniqueTrips.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

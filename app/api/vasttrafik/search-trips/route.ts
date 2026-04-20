import { getVasttrafikToken } from "@/lib/vasttrafik";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const originGid = searchParams.get("originGid");
  const destinationGid = searchParams.get("destinationGid");
  const lineFilter = searchParams.get("line");

  try {
    const token = await getVasttrafikToken();
    
    // We search for journeys between two points. 
    // includeExternalTrips=false ensures we stay in the VT network.
    const url = `https://ext-api.vasttrafik.se/pr/v4/journeys?originGid=${originGid}&destinationGid=${destinationGid}&limit=50`;

    const res = await fetch(url, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: "VT API Error" }, { status: res.status });

    // We only want the legs that are actually trams and match our line
    const formattedJourneys = data.results.map((result: any) => {
      // A "Journey" can have multiple legs (changes), but for circulations, 
      // we usually want the direct tram leg.
      const tramLeg = result.tripLegs.find((leg: any) => 
        leg.serviceJourney?.line?.transportMode === 'tram' &&
        (!lineFilter || leg.serviceJourney.line.designation === lineFilter)
      );

      if (!tramLeg) return null;

      return {
        _id: result.detailsReference,
        tramline: {
          number: tramLeg.serviceJourney.line.designation,
          direction: tramLeg.serviceJourney.direction
        },
        startTime: tramLeg.plannedDepartureTime.split('T')[1].substring(0, 5),
        endTime: tramLeg.plannedArrivalTime.split('T')[1].substring(0, 5),
        heading: tramLeg.serviceJourney.directionDetails?.fullDirection || tramLeg.serviceJourney.direction,
        journeyDetailRef: result.detailsReference,
        originName: tramLeg.origin.stopPoint.name,
        destinationName: tramLeg.destination.stopPoint.name
      };
    }).filter(Boolean); // Remove nulls where no tram leg was found

    return NextResponse.json(formattedJourneys);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
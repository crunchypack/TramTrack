import { connectToDB } from "@/utils/database";
import TramStop from "@/models/TramStop";
import TramLine from "@/models/TramLine";
import { NextResponse } from "next/server";

const uniquePreserveOrder = (items: string[]) => {
  return [...new Set(items.map((s) => s.trim()))];
};

export async function GET() {
  try {
    await connectToDB();

    // 1. Actual in-service route for Line 1 toward Tynnered
    const actualLine1TynneredNames = [
      "Östra Sjukhuset",
      "Tingvallsvägen",
      "Kaggeledstorget",
      "Munkebäckstorget",
      "Härlanda",
      "Stockholmsgatan",
      "Redbergsplatsen",
      "Olskrokstorget",
      "Svingeln",
      "Ullevi Norra",
      "Centralstationen",
      "Brunnsparken",
      "Stenpiren",
      "Järntorget",
      "Prinsgatan",
      "Olivedalsgatan",
      "Linnéplatsen",
      "Botaniska Trädgården",
      "Marklandsgatan",
      "Axel Dahlströms Torg",
      "Lantmilsgatan",
      "Nymilsgatan",
      "Musikvägen",
      "Positivgatan",
      "Frölunda Torg",
      "Briljantgatan",
      "Smaragdgatan",
      "Opaltorget",
    ];

    const actualLine1OstraNames = [...actualLine1TynneredNames].reverse();

    // 2. Extra operational stops you need to discover/store trips for circulations
    const line1OperationalStops = [
      "Svingeln",
      "Ullevi Norra",
      "Centralstationen",
      "Vagnhallen Majorna",
      "Jaegerdorffsplatsen",
      "Frihamnen",
      "Hjalmar Brantingsplatsen",
    ];

    // 3. Search routes:
    // actual route + operational/discovery stops
    const searchLine1TynneredNames = uniquePreserveOrder([
      ...actualLine1TynneredNames,
      ...line1OperationalStops,
    ]);

    const searchLine1OstraNames = [...searchLine1TynneredNames].reverse();

    // 4. Relief points:
    // only the operational stops relevant for takeover/handover
    const reliefLine1TynneredNames = uniquePreserveOrder(line1OperationalStops);
    const reliefLine1OstraNames = [...reliefLine1TynneredNames].reverse();

    // 5. Helper: convert stop names to ObjectIds
    const getStopIds = async (names: string[]) => {
      const ids = await Promise.all(
        names.map(async (name) => {
          const stop = await TramStop.findOne({ name: name.trim() });
          if (!stop) {
            throw new Error(`Stop not found in TramStop collection: ${name}`);
          }
          return stop._id;
        }),
      );

      return ids;
    };

    // 6. Convert all arrays to ObjectIds
    const actualTynneredRoute = await getStopIds(actualLine1TynneredNames);
    const actualOstraRoute = await getStopIds(actualLine1OstraNames);

    const searchTynneredRoute = await getStopIds(searchLine1TynneredNames);
    const searchOstraRoute = await getStopIds(searchLine1OstraNames);

    const reliefTynneredPoints = await getStopIds(reliefLine1TynneredNames);
    const reliefOstraPoints = await getStopIds(reliefLine1OstraNames);

    // 7. Remove old Line 1 docs so reseeding is deterministic
    await TramLine.deleteMany({ number: 1 });

    // 8. Insert new Line 1 definitions
    const newLines = await TramLine.insertMany([
      {
        number: 1,
        direction: "Tynnered",
        route: actualTynneredRoute,
        searchRoute: searchTynneredRoute,
        reliefPoints: reliefTynneredPoints,
      },
      {
        number: 1,
        direction: "Östra Sjukhuset",
        route: actualOstraRoute,
        searchRoute: searchOstraRoute,
        reliefPoints: reliefOstraPoints,
      },
    ]);

    return NextResponse.json({
      message: "✅ Line 1 seeded successfully",
      count: newLines.length,
      seeded: newLines.map((line) => ({
        number: line.number,
        direction: line.direction,
        routeCount: line.route.length,
        searchRouteCount: line.searchRoute.length,
        reliefPointsCount: line.reliefPoints.length,
      })),
    });
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
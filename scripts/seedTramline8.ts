// seedLine8.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/TramLine";

const line8Forward = [
  "Frölunda Torg",
  "Positivgatan",
  "Musikvägen",
  "Nymilsgatan",
  "Lantmilsgatan",
  "Axel Dahlströms Torg",
  "Marklandsgatan",
  "Botaniska Trädgården",
  "Sahlgrenska Huvudentré",
  "Medicinaregatan",
  "Wavrinskys Plats",
  "Chalmers",
  "Korsvägen",
  "Scandinavium",
  "Ullevi Södra",
  "Ullevi Norra",
  "Svingeln",
  "Olskrokstorget",
  "Redbergsplatsen",
  "Ejdergatan",
  "Gamlestads Torg",
  "Hjällbo",
  "Hammarkullen",
  "Storås",
  "Angered Centrum",
];

const timeBetweenForward = [
  1, // Frölunda Torg → Positivgatan
  1, // Positivgatan → Musikvägen
  1, // Musikvägen → Nymilsgatan
  1, // Nymilsgatan → Lantmilsgatan
  2, // Lantmilsgatan → Axel Dahlströms Torg
  1, // Axel Dahlströms Torg → Marklandsgatan
  3, // Marklandsgatan → Botaniska Trädgården
  3, // Botaniska Trädgården → Sahlgrenska Huvudentré
  0, // Sahlgrenska Huvudentré → Medicinaregatan (same time)
  2, // Medicinaregatan → Wavrinskys Plats
  1, // Wavrinskys Plats → Chalmers
  5, // Chalmers → Korsvägen
  1, // Korsvägen → Scandinavium
  2, // Scandinavium → Ullevi Södra
  2, // Ullevi Södra → Ullevi Norra
  2, // Ullevi Norra → Svingeln
  1, // Svingeln → Olskrokstorget
  2, // Olskrokstorget → Redbergsplatsen
  1, // Redbergsplatsen → Ejdergatan
  3, // Ejdergatan → Gamlestads Torg
  6, // Gamlestads Torg → Hjällbo
  2, // Hjällbo → Hammarkullen
  2, // Hammarkullen → Storås
  3, // Storås → Angered Centrum
];

const line8Reverse = [...line8Forward].reverse();
const timeBetweenReverse = [...timeBetweenForward].reverse();

async function seedTramLines() {
  await connectToDB();

  const getStopIds = async (names: string[]) => {
    const stops = await TramStop.find({ name: { $in: names } });

    // Check for missing stops
    const missingStops = names.filter(
      (name) => !stops.some((s) => s.name === name)
    );
    if (missingStops.length > 0) {
      console.warn("⚠️ Missing stops in database:", missingStops);
    }

    const stopMap = new Map(stops.map((s) => [s.name, s._id]));
    return names.map((name) => stopMap.get(name));
  };

  const forwardStopIds = await getStopIds(line8Forward);
  const reverseStopIds = await getStopIds(line8Reverse);

  const lines = [
    {
      number: 8,
      direction: "Angered Centrum",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 8,
      direction: "Frölunda Torg",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 8 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 8 (both directions)");
  process.exit(0);
}

seedTramLines();

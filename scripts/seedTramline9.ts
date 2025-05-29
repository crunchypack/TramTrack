// seedLine9.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/tramStop";
import TramLine from "../models/tramline";

const line9Forward = [
  "Kungssten",
  "Sandarna",
  "Sannaplan",
  "Ostindiegatan",
  "Vagnhallen Majorna",
  "Jaegerdorffsplatsen",
  "Chapmans Torg",
  "Kaptensgatan",
  "Stigbergstorget",
  "Masthuggstorget",
  "Järntorget",
  "Hagakyrkan",
  "Grönsakstorget",
  "Domkyrkan",
  "Brunnsparken",
  "Centralstationen",
  "Gamlestads Torg",
  "Hjällbo",
  "Hammarkullen",
  "Storås",
  "Angered Centrum",
];

const timeBetweenForward = [
  1, // Kungssten → Sandarna
  1, // Sandarna → Sannaplan
  2, // Sannaplan → Ostindiegatan
  1, // Ostindiegatan → Vagnhallen Majorna
  1, // Vagnhallen Majorna → Jaegerdorffsplatsen
  2, // Jaegerdorffsplatsen → Chapmans Torg
  2, // Chapmans Torg → Kaptensgatan
  1, // Kaptensgatan → Stigbergstorget
  3, // Stigbergstorget → Masthuggstorget
  2, // Masthuggstorget → Järntorget
  3, // Järntorget → Hagakyrkan
  1, // Hagakyrkan → Grönsakstorget
  1, // Grönsakstorget → Domkyrkan
  3, // Domkyrkan → Brunnsparken
  2, // Brunnsparken → Centralstationen
  6, // Centralstationen → Gamlestads Torg
  6, // Gamlestads Torg → Hjällbo
  2, // Hjällbo → Hammarkullen
  2, // Hammarkullen → Storås
  3, // Storås → Angered Centrum
];

const line9Reverse = [...line9Forward].reverse();
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

  const forwardStopIds = await getStopIds(line9Forward);
  const reverseStopIds = await getStopIds(line9Reverse);

  const lines = [
    {
      number: 9,
      direction: "Angered Centrum",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 9,
      direction: "Kungssten",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 9 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 9 (both directions)");
  process.exit(0);
}

seedTramLines();

// seedLine4.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/TramLine";

const line4Forward = [
  "Angered Centrum",
  "Storås",
  "Hammarkullen",
  "Hjällbo",
  "Gamlestads Torg",
  "Centralstationen",
  "Brunnsparken",
  "Kungsportsplatsen",
  "Valand",
  "Berzeliigatan",
  "Korsvägen",
  "Liseberg Södra",
  "Almedal",
  "Elisedal",
  "Varbergsgatan",
  "Lana",
  "Krokslätts Torg",
  "Krokslätts Fabriker",
  "Lackarebäck",
  "Mölndals Sjukhus",
  "Mölndals Innerstad",
];

const timeBetweenForward = [
  2, // Angered Centrum → Storås
  1, // Storås → Hammarkullen
  3, // Hammarkullen → Hjällbo
  6, // Hjällbo → Gamlestads Torg
  2, // Gamlestads Torg → Centralstationen
  1, // Centralstationen → Brunnsparken
  3, // Brunnsparken → Kungsportsplatsen
  2, // Kungsportsplatsen → Valand
  2, // Valand → Berzeliigatan
  1, // Berzeliigatan → Korsvägen
  2, // Korsvägen → Liseberg Södra
  1, // Liseberg Södra → Almedal
  1, // Almedal → Elisedal
  1, // Elisedal → Varbergsgatan
  0, // Varbergsgatan → Lana (same time)
  2, // Lana → Krokslätts torg
  2, // Krokslätts torg → Krokslätts Fabriker
  1, // Krokslätts Fabriker → Lackarebäck
  2, // Lackarebäck → Mölndals sjukhus
  // No time after last stop (Mölndals Innerstad)
];

const line4Reverse = [...line4Forward].reverse();
const timeBetweenReverse = [...timeBetweenForward].reverse();

async function seedTramLines() {
  await connectToDB();

  const getStopIds = async (names: string[]) => {
    const stops = await TramStop.find({ name: { $in: names } });
    const stopMap = Object.fromEntries(
      stops.map((s) => [s.name.toLowerCase(), s._id])
    );
    return names.map((name) => stopMap[name.toLowerCase()]);
  };

  const forwardStopIds = await getStopIds(line4Forward);
  const reverseStopIds = await getStopIds(line4Reverse);

  const lines = [
    {
      number: 4,
      direction: "Mölndal",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 4,
      direction: "Angered",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 4 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 4 (both directions)");
  process.exit(0);
}

seedTramLines();

// seedLine2.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/TramLine";

const line2Forward = [
  "Axel Dahlströms Torg",
  "Marklandsgatan",
  "Botaniska Trädgården",
  "Linnéplatsen",
  "Olivedalsgatan",
  "Seminariegatan",
  "Brunnsgatan",
  "Handelshögskolan",
  "Vasa Viktoriagatan",
  "Vasaplatsen",
  "Grönsakstorget",
  "Domkyrkan",
  "Brunnsparken",
  "Centralstationen",
  "Ullevi Södra",
  "Scandinavium",
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
  1, // Axel Dahlströms Torg → Marklandsgatan
  3, // Marklandsgatan → Botaniska Trädgården
  2, // Botaniska Trädgården → Linnéplatsen
  1, // Linnéplatsen → Olivedalsgatan
  1, // Olivedalsgatan → Seminariegatan
  2, // Seminariegatan → Brunnsgatan
  2, // Brunnsgatan → Handelshögskolan
  1, // Handelshögskolan → Vasa Viktoriagatan
  1, // Vasa Viktoriagatan → Vasaplatsen
  1, // Vasaplatsen → Grönsakstorget
  3, // Grönsakstorget → Domkyrkan
  2, // Domkyrkan → Brunnsparken
  3, // Brunnsparken → Centralstationen
  1, // Centralstationen → Ullevi Södra
  2, // Ullevi Södra → Scandinavium
  1, // Scandinavium → Korsvägen
  2, // Korsvägen → Liseberg Södra
  1, // Liseberg Södra → Almedal
  1, // Almedal → Elisedal
  1, // Elisedal → Varbergsgatan
  0, // Varbergsgatan → Lana (same time)
  2, // Lana → Krokslätts torg
  2, // Krokslätts torg → Krokslätts Fabriker
  1, // Krokslätts Fabriker → Lackarebäck
  2, // Lackarebäck → Mölndals sjukhus
  // Note: No time after last stop (Mölndals Innerstad)
];

const line2Reverse = [...line2Forward].reverse();
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

  const forwardStopIds = await getStopIds(line2Forward);
  const reverseStopIds = await getStopIds(line2Reverse);

  const lines = [
    {
      number: 2,
      direction: "Mölndal",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 2,
      direction: "Högsbotorp",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 2 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 2 (both directions)");
  process.exit(0);
}

seedTramLines();

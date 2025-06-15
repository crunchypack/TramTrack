// seedLine9.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/TramLine";

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
const lineXForward = [
  "Saltholmen",
  "Långedrag",
  "Hinsholmen",
  "Käringberget",
  "Tranered",
  "Hagen",
  "Nya Varvsallén",
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
  "SKF",
  "Bellevue",
  "Kviberg",
  "Beväringsgatan",
  "Nymånegatan",
];
const timeBetweenXForward = [
  1, // Saltholmen → Långedrag
  1, // Långedrag → Hinsholmen
  1, // Hinsholmen → Käringberget
  2, // Käringberget → Tranered
  1, // Tranered → Hagen
  2, // Hagen → Nya Varvsallén
  1, // Nya Varvsallén → Kungssten
  1, // Kungssten → Sandarna
  2, // Sandarna → Sannaplan
  1, // Sannaplan → Ostindiegatan
  1, // Ostindiegatan → Vagnhallen Majorna
  1, // Vagnhallen Majorna → Jaegerdorffsplatsen
  2, // Jaegerdorffsplatsen → Chapmans Torg
  2, // Chapmans Torg → Kaptensgatan
  1, // Kaptensgatan → Stigbergstorget
  3, // Stigbergstorget → Masthuggstorget
  2, // Masthuggstorget → Järntorget
  3, // Järntorget → Hagakyrkan
  1, // Hagakyrkan → Grönsakstorget
  3, // Grönsakstorget → Domkyrkan
  2, // Domkyrkan → Brunnsparken
  6, // Brunnsparken → Centralstationen
  0, // Centralstationen → Gamlestads Torg (same time? maybe correction needed)
  3, // Gamlestads Torg → SKF
  1, // SKF → Bellevue
  1, // Bellevue → Kviberg
  2, // Kviberg → Beväringsgatan
  2, // Beväringsgatan → Nymånegatan
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
const lineXReverse = [...lineXForward].reverse();
const timeBetweenXReverse = [...timeBetweenXForward].reverse();

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

  const forwardStopIds = await getStopIds(lineXForward);
  const reverseStopIds = await getStopIds(lineXReverse);

  const lines = [
    {
      number: 109,
      direction: "Nymånegatan",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 109,
      direction: "Saltholmen",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 109 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 9 (both directions)");
  process.exit(0);
}

seedTramLines();

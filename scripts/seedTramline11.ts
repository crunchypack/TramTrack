// seedLine11.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/tramStop";
import TramLine from "../models/tramline";

const line11Forward = [
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
  "Mariaplan",
  "Godhemsgatan",
  "Ekedal",
  "Majvallen",
  "Fjällgatan",
  "Stigbergstorget",
  "Masthuggstorget",
  "Järntorget",
  "Stenpiren",
  "Brunnsparken",
  "Centralstationen",
  "Gamlestads Torg",
  "SKF",
  "Bellevue",
  "Kviberg",
  "Beväringsgatan",
  "Nymånegatan",
  "Runstavsgatan",
  "Kortedala Torg",
  "Allhelgonakyrkan",
  "Januarigatan",
  "Galileis Gata",
  "Teleskopgatan",
  "Rymdtorget",
  "Komettorget",
];

const timeBetweenForward = [
  2, // Saltholmen → Långedrag
  1, // Långedrag → Hinsholmen
  1, // Hinsholmen → Käringberget
  1, // Käringberget → Tranered
  2, // Tranered → Hagen
  1, // Hagen → Nya Varvsallén
  2, // Nya Varvsallén → Kungssten
  1, // Kungssten → Sandarna
  1, // Sandarna → Sannaplan
  2, // Sannaplan → Mariaplan
  1, // Mariaplan → Godhemsgatan
  0, // Godhemsgatan → Ekedal (same time)
  2, // Ekedal → Majvallen
  2, // Majvallen → Fjällgatan
  2, // Fjällgatan → Stigbergstorget
  1, // Stigbergstorget → Masthuggstorget
  3, // Masthuggstorget → Järntorget
  2, // Järntorget → Stenpiren
  3, // Stenpiren → Brunnsparken
  2, // Brunnsparken → Centralstationen
  6, // Centralstationen → Gamlestads Torg
  0, // Gamlestads Torg → SKF (same time)
  3, // SKF → Bellevue
  1, // Bellevue → Kviberg
  1, // Kviberg → Beväringsgatan
  2, // Beväringsgatan → Nymånegatan
  1, // Nymånegatan → Runstavsgatan
  1, // Runstavsgatan → Kortedala Torg
  2, // Kortedala Torg → Allhelgonakyrkan
  1, // Allhelgonakyrkan → Januarigatan
  1, // Januarigatan → Galileis Gata
  2, // Galileis Gata → Teleskopgatan
  1, // Teleskopgatan → Rymdtorget Spårvagn
  2, // Rymdtorget Spårvagn → Komettorget
];

const line11Reverse = [...line11Forward].reverse();
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

  const forwardStopIds = await getStopIds(line11Forward);
  const reverseStopIds = await getStopIds(line11Reverse);

  const lines = [
    {
      number: 11,
      direction: "Bergsjön",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 11,
      direction: "Saltholmen",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 11 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 11 (both directions)");
  process.exit(0);
}

seedTramLines();

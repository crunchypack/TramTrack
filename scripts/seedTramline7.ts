import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/Tramline";

const line7Forward = [
  "Opaltorget",
  "Smaragdgatan",
  "Briljantgatan",
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
  "Kapellplatsen",
  "Vasaplatsen",
  "Valand",
  "Kungsportsplatsen",
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
  0, // Opaltorget → Smaragdgatan (same time)
  1, // Smaragdgatan → Briljantgatan
  2, // Briljantgatan → Frölunda Torg Spårvagn
  1, // Frölunda Torg Spårvagn → Positivgatan
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
  1, // Chalmers → Kapellplatsen
  4, // Kapellplatsen → Vasaplatsen
  1, // Vasaplatsen → Valand
  2, // Valand → Kungsportsplatsen
  3, // Kungsportsplatsen → Brunnsparken
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
const line7Reverse = [...line7Forward].reverse();
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

  const forwardStopIds = await getStopIds(line7Forward);
  const reverseStopIds = await getStopIds(line7Reverse);

  const lines = [
    {
      number: 7,
      direction: "Bergsjön",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 7,
      direction: "Tynnered",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 7 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 7 (both directions)");
  process.exit(0);
}
seedTramLines();

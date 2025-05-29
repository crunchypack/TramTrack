// seedLine6.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/tramStop";
import TramLine from "../models/tramline";

const line6Forward = [
  "Varmfrontsgatan",
  "Temperaturgatan",
  "Väderilsgatan",
  "Friskväderstorget",
  "Önskevädersgatan",
  "Mildvädersgatan",
  "Vårväderstorget",
  "Sälöfjordsgatan",
  "Eketrägatan",
  "Gropegårdsgatan",
  "Rambergsvallen",
  "Wieselgrensplatsen",
  "Vågmästareplatsen",
  "Hjalmar Brantingsplatsen",
  "Frihamnen",
  "Nordstan",
  "Brunnsparken",
  "Domkyrkan",
  "Grönsakstorget",
  "Hagakyrkan",
  "Järntorget",
  "Prinsgatan",
  "Olivedalsgatan",
  "Linnéplatsen",
  "Sahlgrenska Huvudentré",
  "Medicinaregatan",
  "Wavrinskys Plats", //6835b76cf517a6d17c834f1e
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
  "SKF",
  "Bellevue",
  "Kviberg",
  "Beväringsgatan",
  "Nymånegatan",
  "Runstavsgatan",
  "Kortedala Torg", //6835b76cf517a6d17c834f24
  "Allhelgonakyrkan",
  "Aprilgatan",
];

const timeBetweenForward = [
  0, // Varmfrontsgatan → Temperaturgatan (same time)
  2, // Temperaturgatan → Väderilsgatan
  1, // Väderilsgatan → Friskväderstorget
  0, // Friskväderstorget → Önskevädersgatan (same time)
  2, // Önskevädersgatan → Mildvädersgatan
  1, // Mildvädersgatan → Vårväderstorget
  1, // Vårväderstorget → Sälöfjordsgatan
  2, // Sälöfjordsgatan → Eketrägatan
  1, // Eketrägatan → Gropegårdsgatan
  1, // Gropegårdsgatan → Rambergsvallen
  1, // Rambergsvallen → Wieselgrensplatsen
  1, // Wieselgrensplatsen → Vågmästareplatsen
  2, // Vågmästareplatsen → Hjalmar Brantingsplatsen
  1, // Hjalmar Brantingsplatsen → Frihamnen
  4, // Frihamnen → Nordstan
  2, // Nordstan → Brunnsparken
  1, // Brunnsparken → Domkyrkan
  2, // Domkyrkan → Grönsakstorget
  3, // Grönsakstorget → Hagakyrkan
  1, // Hagakyrkan → Järntorget
  2, // Järntorget → Prinsgatan
  2, // Prinsgatan → Olivedalsgatan
  3, // Olivedalsgatan → Linnéplatsen
  0, // Linnéplatsen → Sahlgrenska Huvudentré (same time)
  2, // Sahlgrenska Huvudentré → Medicinaregatan
  1, // Medicinaregatan → Wavrinskys Plats
  5, // Wavrinskys Plats → Chalmers
  1, // Chalmers → Korsvägen
  2, // Korsvägen → Scandinavium
  2, // Scandinavium → Ullevi Södra
  2, // Ullevi Södra → Ullevi Norra
  1, // Ullevi Norra → Svingeln
  2, // Svingeln → Olskrokstorget
  1, // Olskrokstorget → Redbergsplatsen
  3, // Redbergsplatsen → Ejdergatan
  0, // Ejdergatan → Gamlestads Torg (same time)
  3, // Gamlestads Torg → SKF
  1, // SKF → Bellevue
  1, // Bellevue → Kviberg
  2, // Kviberg → Beväringsgatan
  1, // Beväringsgatan → Nymånegatan
  1, // Nymånegatan → Runstavsgatan
  1, // Runstavsgatan → Kortedala Torg
  2, // Kortedala Torg → Allhelgonakyrkan
  // No time after last stop (Aprilgatan)
];

const line6Reverse = [...line6Forward].reverse();
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

  const forwardStopIds = await getStopIds(line6Forward);
  const reverseStopIds = await getStopIds(line6Reverse);

  const lines = [
    {
      number: 6,
      direction: "Kortedala",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 6,
      direction: "Länsmansgården",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 6 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 6 (both directions)");
  process.exit(0);
}

seedTramLines();

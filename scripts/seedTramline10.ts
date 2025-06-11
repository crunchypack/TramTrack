// seedLine10.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/Tramline";

const line10Forward = [
  "Doktor Sydows Gata",
  "Dr Fries Torg",
  "Wavrinskys Plats",
  "Chalmers",
  "Kapellplatsen",
  "Vasaplatsen",
  "Valand",
  "Kungsportsplatsen",
  "Brunnsparken",
  "Lilla Bommen",
  "Frihamnen",
  "Hjalmar Brantingsplatsen",
  "Vågmästareplatsen",
  "Wieselgrensplatsen",
  "Rambergsvallen",
  "Gropegårdsgatan",
  "Eketrägatan",
  "Sälöfjordsgatan",
  "Vårväderstorget",
  "Mildvädersgatan",
  "Önskevädersgatan",
  "Friskväderstorget",
  "Väderilsgatan",
];

const timeBetweenForward = [
  0, // Doktor Sydows Gata → Doktor Fries Torg (same time)
  2, // Doktor Fries Torg → Wavrinskys Plats
  1, // Wavrinskys Plats → Chalmers
  1, // Chalmers → Kapellplatsen
  4, // Kapellplatsen → Vasaplatsen
  1, // Vasaplatsen → Valand
  2, // Valand → Kungsportsplatsen
  3, // Kungsportsplatsen → Brunnsparken
  0, // Brunnsparken → Lilla Bommen (same time)
  5, // Lilla Bommen → Frihamnen
  1, // Frihamnen → Hjalmar Brantingsplatsen
  0, // Hjalmar Brantingsplatsen → Vågmästareplatsen (same time)
  2, // Vågmästareplatsen → Wieselgrensplatsen
  1, // Wieselgrensplatsen → Rambergsvallen
  1, // Rambergsvallen → Gropegårdsgatan
  2, // Gropegårdsgatan → Eketrägatan
  1, // Eketrägatan → Sälöfjordsgatan
  1, // Sälöfjordsgatan → Vårväderstorget
  1, // Vårväderstorget → Mildvädersgatan
  2, // Mildvädersgatan → Önskevädersgatan
  1, // Önskevädersgatan → Friskväderstorget
  1, // Friskväderstorget → Väderilsgatan
];

const line10Reverse = [...line10Forward].reverse();
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

  const forwardStopIds = await getStopIds(line10Forward);
  const reverseStopIds = await getStopIds(line10Reverse);

  const lines = [
    {
      number: 10,
      direction: "Biskopsgården",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 10,
      direction: "Guldheden",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 10 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 10 (both directions)");
  process.exit(0);
}

seedTramLines();

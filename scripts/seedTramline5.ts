// seedLine5.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/Tramline";

const line5Forward = [
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
  "Lilla Bommen",
  "Brunnsparken",
  "Kungsportsplatsen",
  "Valand",
  "Berzeliigatan",
  "Korsvägen",
  "Liseberg Station",
  "Sankt Sigfrids Plan",
  "Bäckeliden",
  "Ekmanska",
  "Bögatan",
  "Töpelsgatan",
  "Welandergatan",
  "Virginsgatan",
  "Sanatoriegatan",
  "Solrosgatan",
  "Munkebäckstorget",
  "Ättehögsgatan",
  "Kaggeledstorget",
  "Tingvallsvägen",
  "Östra Sjukhuset",
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
  4, // Frihamnen → Lilla Bommen
  1, // Lilla Bommen → Brunnsparken
  3, // Brunnsparken → Kungsportsplatsen
  2, // Kungsportsplatsen → Valand
  2, // Valand → Berzeliigatan
  1, // Berzeliigatan → Korsvägen
  2, // Korsvägen → Liseberg Station
  0, // Liseberg Station → Sankt Sigfrids Plan (same time)
  1, // Sankt Sigfrids Plan → Bäckeliden
  1, // Bäckeliden → Ekmanska
  2, // Ekmanska → Bögatan
  1, // Bögatan → Töpelsgatan
  2, // Töpelsgatan → Welandergatan
  0, // Welandergatan → Virginsgatan (same time)
  2, // Virginsgatan → Sanatoriegatan
  1, // Sanatoriegatan → Solrosgatan
  0, // Solrosgatan → Munkebäckstorget (same time)
  1, // Munkebäckstorget → Ättehögsgatan
  2, // Ättehögsgatan → Kaggeledstorget
  2, // Kaggeledstorget → Tingvallsvägen
  // No time after last stop (Östra Sjukhuset)
];

const line5Reverse = [...line5Forward].reverse();
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

  const forwardStopIds = await getStopIds(line5Forward);
  const reverseStopIds = await getStopIds(line5Reverse);

  const lines = [
    {
      number: 5,
      direction: "Östra Sjukhuset",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 5,
      direction: "Länsmansgården",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 5 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 5 (both directions)");
  process.exit(0);
}

seedTramLines();

// seedLine3.ts
import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/TramLine";

const line3Forward = [
  "Marklandsgatan",
  "Bokekullsgatan",
  "Högsbogatan",
  "Klintens Väg",
  "Godhemsgatan",
  "Mariaplan",
  "Ostindiegatan",
  "Vagnhallen Majorna",
  "Jaegerdorffsplatsen",
  "Chapmans Torg",
  "Kaptensgatan",
  "Stigbergstorget",
  "Masthuggstorget",
  "Järntorget",
  "Hagakyrkan",
  "Vasa Viktoriagatan",
  "Vasaplatsen",
  "Valand",
  "Kungsportsplatsen",
  "Brunnsparken",
  "Centralstationen",
  "Ullevi Norra",
  "Svingeln",
  "Olskrokstorget",
  "Redbergsplatsen",
  "Stockholmsgatan",
  "Härlanda",
  "Solrosgatan",
  "Sanatoriegatan",
  "Virginsgatan",
];

const timeBetweenForward = [
  1, // Marklandsgatan → Bokekullsgatan
  1, // Bokekullsgatan → Högsbogatan
  1, // Högsbogatan → Klintens Väg
  2, // Klintens Väg → Godhemsgatan
  1, // Godhemsgatan → Mariaplan
  2, // Mariaplan → Ostindiegatan
  1, // Ostindiegatan → Vagnhallen Majorna
  1, // Vagnhallen Majorna → Jaegerdorffsplatsen
  2, // Jaegerdorffsplatsen → Chapmans Torg
  2, // Chapmans Torg → Kaptensgatan
  1, // Kaptensgatan → Stigbergstorget
  3, // Stigbergstorget → Masthuggstorget
  3, // Masthuggstorget → Järntorget
  2, // Järntorget → Hagakyrkan
  1, // Hagakyrkan → Vasa Viktoriagatan
  1, // Vasa Viktoriagatan → Vasaplatsen
  2, // Vasaplatsen → Valand
  3, // Valand → Kungsportsplatsen
  2, // Kungsportsplatsen → Brunnsparken
  3, // Brunnsparken → Centralstationen
  2, // Centralstationen → Ullevi Norra
  1, // Ullevi Norra → Svingeln
  2, // Svingeln → Olskrokstorget
  1, // Olskrokstorget → Redbergsplatsen
  2, // Redbergsplatsen → Stockholmsgatan
  1, // Stockholmsgatan → Härlanda
  1, // Härlanda → Solrosgatan
  2, // Solrosgatan → Sanatoriegatan
  2, // Sanatoriegatan → Virginsgatan
];

const line3Reverse = [...line3Forward].reverse();
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

  const forwardStopIds = await getStopIds(line3Forward);
  const reverseStopIds = await getStopIds(line3Reverse);

  const lines = [
    {
      number: 3,
      direction: "Kålltorp",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 3,
      direction: "Marklandsgatan",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  await TramLine.deleteMany({ number: 3 });
  await TramLine.insertMany(lines);

  console.log("✅ Seeded Tram Line 3 (both directions)");
  process.exit(0);
}

seedTramLines();

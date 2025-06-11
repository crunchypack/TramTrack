import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/TramLine";

const line1Forward = [
  "Opaltorget",
  "Smaragdgatan",
  "Briljantgatan",
  "Frölunda Torg",
  "Positivgatan",
  "Musikvägen",
  "Nymilsgatan",
  "Lantmilsgatan",
  "Axel Dahlströms torg",
  "Marklandsgatan",
  "Botaniska Trädgården",
  "Linnéplatsen",
  "Olivedalsgatan",
  "Prinsgatan",
  "Järntorget",
  "Stenpiren",
  "Brunnsparken",
  "Centralstationen",
  "Ullevi Norra",
  "Svingeln",
  "Olskrokstorget",
  "Redbergsplatsen",
  "Stockholmsgatan",
  "Härlanda",
  "Munkebäckstorget",
  "Ättehögsgatan",
  "Kaggeledstorget",
  "Tingvallsvägen",
  "Östra Sjukhuset",
];

const timeBetweenForward = [
  0, 1, 2, 1, 1, 1, 1, 2, 1, 3, 2, 1, 2, 2, 2, 3, 2, 3, 2, 1, 2, 1, 1, 2, 0, 1,
  2, 2,
];

const line1Reverse = [...line1Forward].reverse();
const timeBetweenReverse = [...timeBetweenForward].reverse();

async function seedTramLines() {
  await connectToDB();

  // Helper to fetch tram stop IDs
  const getStopIds = async (names: string[]) => {
    const stops = await TramStop.find({ name: { $in: names } });
    const stopMap = Object.fromEntries(
      stops.map((s) => [s.name.toLowerCase(), s._id])
    );
    return names.map((name) => stopMap[name.toLowerCase()]);
  };

  const forwardStopIds = await getStopIds(line1Forward);
  const reverseStopIds = await getStopIds(line1Reverse);

  const lines = [
    {
      number: 1,
      direction: "Östra Sjukhuset",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenForward,
    },
    {
      number: 1,
      direction: "Tynnered",
      route: reverseStopIds,
      timeBetweenStops: timeBetweenReverse,
    },
  ];

  //await TramLine.deleteMany({ number: 1 }); // optional cleanup
  const result = await TramLine.insertMany(lines);
  console.log(
    "Inserted:",
    result.map((l) => `${l.number} to ${l.direction}`)
  );

  console.log("✅ Seeded Tram Line 1 (both directions)");
  process.exit(0);
}

seedTramLines();

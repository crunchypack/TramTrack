import "dotenv/config";
import { connectToDB } from "../utils/database";
import TramStop from "../models/TramStop";
import TramLine from "../models/TramLine";

const lineXForward = [
  "Opaltorget",
  "Smaragdgatan",
  "Briljantgatan",
  "Frölunda Torg Spårvagn",
  "Positivgatan",
  "Musikvägen",
  "Nymilsgatan",
  "Lantmilsgatan",
  "Axel Dahlströms Torg",
  "Marklandsgatan",
  "Bokekullsgatan",
  "Högsbogatan",
  "Klintens Väg",
  "Godhemsgatan",
  "Mariaplan",
  "Ostindiegatan",
  "Vagnhallen Majorna",
];

const timeBetweenXForward = [
  1, // Opaltorget → Smaragdgatan
  2, // Smaragdgatan → Briljantgatan
  1, // Briljantgatan → Frölunda Torg Spårvagn
  1, // Frölunda Torg Spårvagn → Positivgatan
  1, // Positivgatan → Musikvägen
  1, // Musikvägen → Nymilsgatan
  2, // Nymilsgatan → Lantmilsgatan
  1, // Lantmilsgatan → Axel Dahlströms Torg
  0, // Axel Dahlströms Torg → Marklandsgatan (same time)
  2, // Marklandsgatan → Bokekullsgatan
  1, // Bokekullsgatan → Högsbogatan
  1, // Högsbogatan → Klintens Väg
  1, // Klintens Väg → Godhemsgatan
  1, // Godhemsgatan → Mariaplan
  1, // Mariaplan → Ostindiegatan
  1, // Ostindiegatan → Vagnhallen Majorna
];

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

  const forwardStopIds = await getStopIds(lineXForward);

  const lines = [
    {
      number: 101,
      direction: "Vagnhallen Majorna",
      route: forwardStopIds,
      timeBetweenStops: timeBetweenXForward,
    },
  ];

  //await TramLine.deleteMany({ number: 1 }); // optional cleanup
  const result = await TramLine.insertMany(lines);
  console.log(
    "Inserted:",
    result.map((l) => `${l.number} to ${l.direction}`)
  );

  console.log("✅ Seeded Tram Line X (both directions)");
  process.exit(0);
}

seedTramLines();

import { seedTripTemplates } from "./tripSeeder";

const weekdaySchedule = [
  { hour: 21, minutes: [12] },
  { hour: 22, minutes: [48] },
  { hour: 23, minutes: [57] },
];
const saturdaySchedule = [
  { hour: 21, minutes: [49] },
  { hour: 22, minutes: [28] },
  { hour: 23, minutes: [28] },
];
const sundaySchedule = [
  { hour: 21, minutes: [49] },
  { hour: 22, minutes: [28] },
  { hour: 23, minutes: [28] },
];
async function seedTripX() {
  try {
    const result = await seedTripTemplates({
      tramLineNumber: 101,
      startStopName: "Opaltorget",
      endStopName: "Vagnhallen Majorna",
      heading: "Vagnhallen Majorna",
      tripDurationMinutes: 16, // Adjust based on actual travel time
      weekdaySchedule,
      saturdaySchedule,
      sundaySchedule,
      season: "summer",
    });
    console.log("Trip X seeded successfully:", result);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Trip X:", error);
    process.exit(1);
  }
}
seedTripX();

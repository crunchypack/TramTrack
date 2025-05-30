// seedLine1Reverse.ts
import { seedTripTemplates } from "./tripSeeder";
// Weekday schedule (Monday-Friday)
const weekdaySchedule = [
  { hour: 5, minutes: [10, 25, 40, 55] },
  { hour: 6, minutes: [10, 24, 38, 50] },
  { hour: 7, minutes: [1, 11, 20, 29, 38, 48, 56] },
  { hour: 8, minutes: [6, 14, 25, 36, 45, 55] },
  { hour: 9, minutes: [6, 16, 26, 35, 46, 56] },
  { hour: 10, minutes: [6, 15, 26, 36, 46, 55] },
  { hour: 11, minutes: [6, 15, 26, 35, 46, 55] },
  { hour: 12, minutes: [6, 15, 26, 36, 46, 56] },
  { hour: 13, minutes: [6, 17, 26, 36, 46, 56] },
  { hour: 14, minutes: [5, 14, 24, 33, 42, 49, 57] },
  { hour: 15, minutes: [5, 14, 22, 29, 38, 46, 54] },
  { hour: 16, minutes: [2, 10, 18, 26, 34, 42, 50, 58] },
  { hour: 17, minutes: [6, 14, 23, 31, 40, 48, 57] },
  { hour: 18, minutes: [6, 15, 23, 34, 42, 51] },
  { hour: 19, minutes: [1, 12, 24, 36, 48] },
  { hour: 20, minutes: [0, 13, 28, 43, 58] },
  { hour: 21, minutes: [13, 28, 43, 58, 59] },
  { hour: 22, minutes: [13, 17, 28, 37, 43, 57, 58] },

  // Continue with all weekday hours from your schedule
];

// Saturday schedule
const saturdaySchedule = [
  { hour: 5, minutes: [15, 45] },
  { hour: 6, minutes: [15, 45] },
  { hour: 7, minutes: [15, 45] },
  { hour: 8, minutes: [14, 33, 48] },
  { hour: 9, minutes: [3, 18, 33, 48] },
  { hour: 10, minutes: [2, 14, 26, 38, 50] },
  { hour: 11, minutes: [2, 17, 27, 36, 46, 56] },
  { hour: 12, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 13, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 14, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 15, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 16, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 17, minutes: [7, 17, 24, 35, 46, 58] },
  { hour: 18, minutes: [10, 22, 34, 46, 58] },
  { hour: 19, minutes: [13, 28, 43, 58] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 28, 43, 58] },
  { hour: 22, minutes: [13, 28, 43, 58] },
];

// Sunday schedule
const sundaySchedule = [
  { hour: 5, minutes: [15, 45] },
  { hour: 6, minutes: [15, 45] },
  { hour: 7, minutes: [15, 45] },
  { hour: 8, minutes: [14, 34, 54] },
  { hour: 9, minutes: [14, 34, 53] },
  { hour: 10, minutes: [13, 31, 46] },
  { hour: 11, minutes: [1, 15, 29, 41, 53] },
  { hour: 12, minutes: [5, 17, 29, 41, 53] },
  { hour: 13, minutes: [5, 17, 29, 41, 53] },
  { hour: 14, minutes: [5, 17, 29, 41, 53] },
  { hour: 15, minutes: [5, 17, 29, 41, 53] },
  { hour: 16, minutes: [5, 17, 29, 41, 53] },
  { hour: 17, minutes: [5, 17, 29, 41, 53] },
  { hour: 18, minutes: [5, 17, 29, 44, 58] },
  { hour: 19, minutes: [13, 28, 43, 58] },
  { hour: 20, minutes: [13, 28, 44, 58] },
  { hour: 21, minutes: [13, 28, 43, 59] },
  { hour: 22, minutes: [17, 37, 57] },
];

async function seedLine1Reverse() {
  try {
    await seedTripTemplates({
      tramLineNumber: 1,
      startStopName: "Östra Sjukhuset",
      endStopName: "Opaltorget",
      heading: "Tynnered",
      tripDurationMinutes: 45, // Adjust based on actual travel time
      weekdaySchedule,
      saturdaySchedule,
      sundaySchedule,
    });
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Line 1 (Reverse):", error);
    process.exit(1);
  }
}

seedLine1Reverse();

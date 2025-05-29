// seedLine1TripTemplates.ts
import { seedTripTemplates } from "./tripSeeder";
import "dotenv/config";

// Weekday schedule (Monday-Friday)
const weekdayTrips = [
  { hour: 4, minutes: [30, 45] },
  { hour: 5, minutes: [0, 20, 40, 58] },
  { hour: 6, minutes: [12, 24, 34, 44, 54] },
  { hour: 7, minutes: [2, 14, 22, 31, 40, 49, 58] },
  { hour: 8, minutes: [6, 18, 27, 38, 46, 58] },
  { hour: 9, minutes: [7, 17, 26, 38, 47, 57] },
  { hour: 10, minutes: [7, 18, 27, 37, 47, 58] },
  { hour: 11, minutes: [7, 17, 27, 38, 47, 57] },
  { hour: 12, minutes: [7, 18, 27, 37, 47, 58] },
  { hour: 13, minutes: [7, 17, 27, 38, 47, 57] },
  { hour: 14, minutes: [6, 14, 26, 34, 43, 51] },
  { hour: 15, minutes: [0, 8, 16, 25, 32, 40, 48, 56] },
  { hour: 16, minutes: [4, 12, 20, 28, 36, 44, 52] },
  { hour: 17, minutes: [0, 8, 16, 24, 34, 42, 54] },
  { hour: 18, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 19, minutes: [2, 12, 23, 34, 47, 58] },
  { hour: 20, minutes: [12, 27, 42, 58] },
];

// Saturday schedule (example - replace with actual times)
const saturdayTrips = [
  { hour: 6, minutes: [24, 54] },
  { hour: 7, minutes: [24, 54] },
  { hour: 8, minutes: [24, 44] },
  { hour: 9, minutes: [2, 17, 32, 47] },
  { hour: 10, minutes: [2, 14, 26, 33, 43, 53] },
  { hour: 11, minutes: [3, 14, 26, 33, 43, 53] },
  { hour: 12, minutes: [3, 14, 26, 33, 43, 53] },
  { hour: 13, minutes: [3, 14, 26, 33, 43, 53] },
  { hour: 14, minutes: [3, 14, 26, 33, 43, 53] },
  { hour: 15, minutes: [3, 14, 26, 33, 43, 53] },
  { hour: 16, minutes: [3, 14, 26, 33, 43, 53] },
  { hour: 17, minutes: [3, 13, 31, 43, 55] },
  { hour: 18, minutes: [7, 19, 31, 43, 57] },
  { hour: 19, minutes: [12, 27, 42, 57] },
  { hour: 20, minutes: [12, 27, 42, 57] },
  { hour: 21, minutes: [12, 27, 42, 57] },
  { hour: 22, minutes: [12, 27, 42, 57] },
];

// Sunday schedule (example - replace with actual times)
const sundayTrips = [
  { hour: 6, minutes: [24, 54] },
  { hour: 7, minutes: [24, 54] },
  { hour: 8, minutes: [24, 44] },
  { hour: 9, minutes: [4, 24, 44] },
  { hour: 10, minutes: [2, 17, 32, 47] },
  { hour: 11, minutes: [2, 17, 29, 41, 53] },
  { hour: 12, minutes: [5, 17, 29, 41, 53] },
  { hour: 13, minutes: [5, 17, 29, 41, 53] },
  { hour: 14, minutes: [6, 18, 30, 42, 54] },
  { hour: 15, minutes: [6, 18, 30, 42, 54] },
  { hour: 16, minutes: [6, 18, 30, 42, 54] },
  { hour: 17, minutes: [6, 18, 30, 42, 54] },
  { hour: 18, minutes: [7, 19, 31, 43, 57] },
  { hour: 19, minutes: [12, 27, 42, 57] },
  { hour: 20, minutes: [12, 27, 42, 57] },
  { hour: 21, minutes: [13, 28, 48] },
  { hour: 22, minutes: [6, 26, 46] },
];

async function seedLine1() {
  try {
    await seedTripTemplates({
      tramLineNumber: 1,
      startStopName: "Opaltorget",
      endStopName: "Östra Sjukhuset",
      heading: "Östra Sjukhuset",
      tripDurationMinutes: 45,
      weekdaySchedule: weekdayTrips,
      saturdaySchedule: saturdayTrips,
      sundaySchedule: sundayTrips,
    });
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}
seedLine1();

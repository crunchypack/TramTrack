import { seedTripTemplates } from "./tripSeeder";

// Weekday Schedule
const weekdaySchedule = [
  { hour: 8, minutes: [1, 11, 21, 31, 41, 52] },
  { hour: 9, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 10, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 11, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 12, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 13, minutes: [2, 12, 22, 32, 41, 53] },
  { hour: 14, minutes: [2, 12, 22, 32, 41, 49, 57] },
  { hour: 15, minutes: [5, 11, 20, 29, 37, 46, 54] },
  { hour: 16, minutes: [1, 9, 17, 24, 32, 41, 49, 58] },
  { hour: 17, minutes: [5, 13, 21, 28, 36, 45, 55] },
  { hour: 18, minutes: [5, 16, 26, 36, 46, 58] },
  { hour: 19, minutes: [10, 22, 34, 46, 58] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 28, 33, 43, 53, 58] }, // Removed d/e suffixes
  { hour: 22, minutes: [13, 28, 33, 43, 53, 58] }, // Removed d/e suffixes
];

// Saturday Schedule
const saturdaySchedule = [
  { hour: 8, minutes: [10, 30, 48] },
  { hour: 9, minutes: [4, 19, 34, 48] },
  { hour: 10, minutes: [1, 14, 27, 39, 51] },
  { hour: 11, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 12, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 13, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 14, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 15, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 16, minutes: [3, 13, 23, 33, 43, 55] },
  { hour: 17, minutes: [7, 19, 31, 43, 55] },
  { hour: 18, minutes: [7, 19, 31, 43, 58] },
  { hour: 19, minutes: [13, 28, 43, 58] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 28, 43, 58] },
  { hour: 22, minutes: [13, 28, 43, 58] },
];

// Sunday Schedule
const sundaySchedule = [
  { hour: 8, minutes: [10, 30, 50] },
  { hour: 9, minutes: [10, 30, 49] },
  { hour: 10, minutes: [6, 21, 34, 46, 59] },
  { hour: 11, minutes: [11, 23, 35, 47, 59] },
  { hour: 12, minutes: [11, 23, 35, 47, 59] },
  { hour: 13, minutes: [11, 23, 35, 47, 59] },
  { hour: 14, minutes: [0, 12, 24, 36, 48] },
  { hour: 15, minutes: [0, 12, 24, 36, 48] },
  { hour: 16, minutes: [0, 12, 24, 36, 48] },
  { hour: 17, minutes: [0, 12, 24, 36, 48] },
  { hour: 18, minutes: [0, 14, 29, 44, 59] },
  { hour: 19, minutes: [14, 29, 44, 58] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 33, 53] },
  { hour: 22, minutes: [13, 33, 53] },
];

// Weekday Schedule
const weekdayScheduleRev = [
  { hour: 8, minutes: [0, 9, 18, 27, 37, 47, 57] },
  { hour: 9, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 10, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 11, minutes: [7, 17, 28, 38, 48, 58] },
  { hour: 12, minutes: [8, 18, 28, 38, 48, 58] },
  { hour: 13, minutes: [8, 18, 28, 38, 48, 58] },
  { hour: 14, minutes: [9, 18, 28, 38, 48, 56] },
  { hour: 15, minutes: [4, 12, 20, 28, 36, 44, 52] },
  { hour: 16, minutes: [0, 8, 16, 24, 32, 40, 47, 56] },
  { hour: 17, minutes: [4, 12, 20, 28, 37, 46, 55] },
  { hour: 18, minutes: [5, 14, 23, 34, 44, 55] },
  { hour: 19, minutes: [6, 18, 30, 42, 54] },
  { hour: 20, minutes: [6, 18, 30, 42, 54] },
  { hour: 21, minutes: [6, 21, 36, 51] },
  { hour: 22, minutes: [6, 11, 21, 31, 36, 51] }, // Removed letter suffixes
];

// Saturday Schedule
const saturdayScheduleRev = [
  { hour: 8, minutes: [6, 26, 46] },
  { hour: 9, minutes: [6, 26, 46] },
  { hour: 10, minutes: [10, 24, 36, 48] },
  { hour: 11, minutes: [0, 12, 24, 36, 46, 56] },
  { hour: 12, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 13, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 14, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 15, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 16, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 17, minutes: [6, 16, 27, 39, 52] },
  { hour: 18, minutes: [3, 15, 27, 39, 51] },
  { hour: 19, minutes: [5, 20, 35, 50] },
  { hour: 20, minutes: [6, 21, 36, 51] },
  { hour: 21, minutes: [6, 21, 36, 51] },
  { hour: 22, minutes: [6, 21, 36, 51] },
];

// Sunday Schedule
const sundayScheduleRev = [
  { hour: 8, minutes: [23, 46] },
  { hour: 9, minutes: [6, 25, 40, 55] },
  { hour: 10, minutes: [4, 19, 36, 49] },
  { hour: 11, minutes: [2, 14, 28, 38, 50] },
  { hour: 12, minutes: [2, 14, 26, 38, 50] },
  { hour: 13, minutes: [2, 14, 26, 38, 50] },
  { hour: 14, minutes: [2, 14, 26, 38, 50] },
  { hour: 15, minutes: [2, 15, 27, 39, 51] },
  { hour: 16, minutes: [3, 15, 27, 39, 51] },
  { hour: 17, minutes: [3, 15, 27, 39, 52] },
  { hour: 18, minutes: [4, 16, 27, 39, 52] },
  { hour: 19, minutes: [6, 21, 36, 51] },
  { hour: 20, minutes: [6, 21, 36, 51] },
  { hour: 21, minutes: [6, 21, 36, 51] },
  { hour: 22, minutes: [11, 31, 51] },
];
async function seedLine() {
  await seedTripTemplates({
    tramLineNumber: 5,
    startStopName: "Varmfrontsgatan",
    endStopName: "Östra Sjukhuset",
    heading: "Östra Sjukhuset",
    tripDurationMinutes: 46, // Adjust based on actual travel time
    weekdaySchedule,
    saturdaySchedule,
    sundaySchedule,
  });
}
async function seedLineRev() {
  await seedTripTemplates({
    tramLineNumber: 5,
    startStopName: "Östra Sjukhuset",
    endStopName: "Varmfrontsgatan",
    heading: "Länsmansgården",
    tripDurationMinutes: 45,
    weekdaySchedule: weekdayScheduleRev,
    saturdaySchedule: saturdayScheduleRev,
    sundaySchedule: sundayScheduleRev,
  });
}

async function main() {
  try {
    await seedLine();
    await seedLineRev();
    console.log("Tram Line 5 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 4:", error);
    process.exit(1);
  }
}
main();

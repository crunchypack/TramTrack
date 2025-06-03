import { seedTripTemplates } from "./tripSeeder";

// Bergsjön - Saltholmen
const weekdaySchedule = [
  { hour: 4, minutes: [25, 45] },
  { hour: 5, minutes: [3, 23, 40, 55] },
  { hour: 6, minutes: [7, 19, 32, 44, 55] },
  { hour: 7, minutes: [4, 12, 20, 26, 32, 38, 44, 50, 56] },
  { hour: 8, minutes: [2, 8, 14, 21, 27, 34, 42, 50, 58] },
  { hour: 9, minutes: [6, 14, 22, 30, 38, 46, 54] },
  { hour: 10, minutes: [2, 10, 18, 26, 34, 42, 50, 58] },
  { hour: 11, minutes: [6, 14, 22, 30, 38, 46, 54] },
  { hour: 12, minutes: [2, 10, 18, 26, 34, 42, 50, 58] },
  { hour: 13, minutes: [6, 14, 22, 30, 38, 46, 54] },
  { hour: 14, minutes: [2, 10, 18, 26, 34, 42, 50, 58] },
  { hour: 15, minutes: [6, 14, 22, 30, 38, 46, 54] },
  { hour: 16, minutes: [3, 11, 19, 27, 35, 43, 51, 59] },
  { hour: 17, minutes: [7, 15, 23, 31, 40, 47, 55] },
  { hour: 18, minutes: [4, 13, 23, 33, 43, 53] },
  { hour: 19, minutes: [3, 14, 26, 38, 50] },
  { hour: 20, minutes: [4, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 34, 49] },
  { hour: 22, minutes: [4, 6, 19, 26, 34, 46, 49] },
  { hour: 23, minutes: [4, 6, 19, 26, 34, 46, 49] }
];

// Saturday Schedule
const saturdaySchedule = [
  { hour: 4, minutes: [1, 21, 40] },
  { hour: 5, minutes: [9] },
  { hour: 6, minutes: [2, 32] },
  { hour: 7, minutes: [2, 32] },
  { hour: 8, minutes: [1, 21, 41] },
  { hour: 9, minutes: [1, 21, 35, 47, 59] },
  { hour: 10, minutes: [11, 23, 35, 47, 59] },
  { hour: 11, minutes: [8, 18, 28, 38, 48, 58] },
  { hour: 12, minutes: [8, 18, 28, 38, 48, 58] },
  { hour: 13, minutes: [8, 18, 28, 38, 48, 58] },
  { hour: 14, minutes: [8, 18, 28, 38, 48, 58] },
  { hour: 15, minutes: [8, 18, 28, 39, 49, 59] },
  { hour: 16, minutes: [9, 19, 29, 39, 49, 59] },
  { hour: 17, minutes: [11, 23, 35, 47] },
  { hour: 18, minutes: [0, 11, 23, 35, 49] },
  { hour: 19, minutes: [4, 19, 34, 49] },
  { hour: 20, minutes: [4, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 34, 49] },
  { hour: 22, minutes: [4, 19, 34, 49] },
  { hour: 23, minutes: [4, 19, 34, 49] }
];

// Sunday Schedule
const sundaySchedule = [
  { hour: 4, minutes: [1, 21, 40] },
  { hour: 5, minutes: [9] },
  { hour: 6, minutes: [2, 32] },
  { hour: 7, minutes: [2, 32] },
  { hour: 8, minutes: [1, 21, 41] },
  { hour: 9, minutes: [1, 21, 41] },
  { hour: 10, minutes: [1, 21, 37, 52] },
  { hour: 11, minutes: [7, 22, 34, 46, 58] },
  { hour: 12, minutes: [10, 22, 34, 46, 58] },
  { hour: 13, minutes: [10, 22, 34, 46, 58] },
  { hour: 14, minutes: [10, 22, 34, 46, 58] },
  { hour: 15, minutes: [10, 22, 34, 46, 58] },
  { hour: 16, minutes: [10, 22, 34, 46, 58] },
  { hour: 17, minutes: [10, 22, 34, 46, 58] },
  { hour: 18, minutes: [12, 24, 36, 50] },
  { hour: 19, minutes: [5, 20, 35, 49] },
  { hour: 20, minutes: [4, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 34, 49] },
  { hour: 22, minutes: [6, 26, 46] },
  { hour: 23, minutes: [6, 26, 46] }
];

// Saltholmen - Bersjön
const weekdayScheduleRev = [
  { hour: 5, minutes: [27, 52] },
  { hour: 6, minutes: [8, 27, 40, 47, 53, 59] },
  { hour: 7, minutes: [6, 13, 20, 25, 31, 37, 43, 49, 56] },
  { hour: 8, minutes: [11, 19, 27, 35, 43, 51, 59] },
  { hour: 9, minutes: [7, 15, 23, 31, 39, 47, 55] },
  { hour: 10, minutes: [3, 11, 19, 27, 35, 43, 51, 59] },
  { hour: 11, minutes: [7, 15, 23, 31, 39, 47, 55] },
  { hour: 12, minutes: [3, 11, 19, 27, 35, 43, 51, 59] },
  { hour: 13, minutes: [7, 15, 23, 31, 40, 48, 56] },
  { hour: 14, minutes: [4, 12, 20, 28, 36, 44, 52] },
  { hour: 15, minutes: [1, 9, 17, 24, 33, 41, 49, 57] },
  { hour: 16, minutes: [5, 13, 21, 29, 37, 44, 52] },
  { hour: 17, minutes: [0, 8, 16, 24, 32, 39, 47, 56] },
  { hour: 18, minutes: [5, 15, 25, 35, 45, 54] },
  { hour: 19, minutes: [4, 14, 24, 35, 47, 59] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 29, 43, 46, 58] },
  { hour: 22, minutes: [6, 13, 26, 28, 43, 46, 58] },
  { hour: 23, minutes: [6, 13, 26, 28, 43, 51, 58] }
];

// Saturday Schedule
const saturdayScheduleRev = [
  { hour: 6, minutes: [16, 46] },
  { hour: 7, minutes: [16, 42] },
  { hour: 8, minutes: [2, 22, 42] },
  { hour: 9, minutes: [2, 22, 43, 58] },
  { hour: 10, minutes: [12, 24, 37, 48, 59] },
  { hour: 11, minutes: [10, 20, 30, 40, 50] },
  { hour: 12, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 13, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 14, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 15, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 16, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 17, minutes: [0, 9, 20, 30, 42, 54] },
  { hour: 18, minutes: [6, 18, 30, 42, 57] },
  { hour: 19, minutes: [12, 27, 42, 57] },
  { hour: 20, minutes: [12, 27, 42, 57] },
  { hour: 21, minutes: [12, 27, 43, 58] },
  { hour: 22, minutes: [13, 28, 43, 58] },
  { hour: 23, minutes: [13, 28, 43, 58] }
];

// Sunday Schedule
const sundayScheduleRev = [
  { hour: 6, minutes: [16, 46] },
  { hour: 7, minutes: [16, 46] },
  { hour: 8, minutes: [16, 42] },
  { hour: 9, minutes: [2, 22, 43] },
  { hour: 10, minutes: [3, 20, 35, 49] },
  { hour: 11, minutes: [3, 17, 30, 42, 54] },
  { hour: 12, minutes: [6, 18, 30, 42, 54] },
  { hour: 13, minutes: [6, 18, 30, 42, 54] },
  { hour: 14, minutes: [6, 18, 30, 42, 54] },
  { hour: 15, minutes: [6, 18, 30, 42, 54] },
  { hour: 16, minutes: [6, 18, 30, 42, 54] },
  { hour: 17, minutes: [6, 18, 30, 41, 53] },
  { hour: 18, minutes: [6, 18, 30, 44, 58] },
  { hour: 19, minutes: [13, 28, 43, 58] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 29, 46] },
  { hour: 22, minutes: [6, 26, 46] },
  { hour: 23, minutes: [6, 26, 51] }
];

// Seed the trip templates with the schedules
async function seedLine() {
  await seedTripTemplates({
    tramLineNumber: 11,
    startStopName: "Komettorget",
    endStopName: "Saltholmen",
    heading: "Saltholmen",
    tripDurationMinutes: 50, // Adjust based on actual travel time
    weekdaySchedule,
    saturdaySchedule,
    sundaySchedule,
    season: "standard",
  });
}
async function seedLineRev() {
  await seedTripTemplates({
    tramLineNumber: 10,
    startStopName: "Saltholmemn",
    endStopName: "Komettorget",
    heading: "Bergsjön",
    tripDurationMinutes: 52, // Adjust based on actual travel time
    weekdaySchedule: weekdayScheduleRev,
    saturdaySchedule: saturdayScheduleRev,
    sundaySchedule: sundayScheduleRev,
    season: "standard",
  });
}
async function main() {
  try {
    await seedLine();
    await seedLineRev();
    console.log("Tram Line 11 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 11:", error);
    process.exit(1);
  }
}
main();

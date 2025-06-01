import { seedTripTemplates } from "./tripSeeder";
// Weekday Schedule Angered - Frölunda
const weekdaySchedule = [
  { hour: 5, minutes: [59] },
  { hour: 6, minutes: [22, 33, 47, 59] },
  { hour: 7, minutes: [8, 17, 24, 29, 40, 48, 58] },
  { hour: 8, minutes: [6, 15, 25, 35, 44, 53] },
  { hour: 9, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 10, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 11, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 12, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 13, minutes: [3, 13, 23, 33, 45, 55] },
  { hour: 14, minutes: [5, 15, 24, 36, 46, 55] },
  { hour: 15, minutes: [4, 13, 21, 32, 40, 51] },
  { hour: 16, minutes: [0, 9, 17, 25, 33, 41, 55] },
  { hour: 17, minutes: [5, 13, 21, 29, 38, 49, 57] },
  { hour: 18, minutes: [7, 17, 29, 41, 53] },
  { hour: 19, minutes: [4, 16, 28, 40, 52] },
  { hour: 20, minutes: [4, 16, 29, 40, 54] },
  { hour: 21, minutes: [9, 24, 40, 44, 55] }, // Removed c/de suffixes
  { hour: 22, minutes: [3, 10, 23, 25, 40, 43, 55] }, // Removed de/c suffixes
  { hour: 23, minutes: [3, 10, 23, 25, 39, 43, 54] }, // Removed de/cf/df suffixes
];

// Saturday Schedule
const saturdaySchedule = [
  { hour: 7, minutes: [30] },
  { hour: 8, minutes: [0, 30] },
  { hour: 9, minutes: [0, 21, 41] },
  { hour: 10, minutes: [0, 15, 30, 45] },
  { hour: 11, minutes: [0, 13, 23, 33, 43, 53] },
  { hour: 12, minutes: [3, 13, 23, 34, 44, 54] },
  { hour: 13, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 14, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 15, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 16, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 17, minutes: [4, 14, 25, 37, 49] },
  { hour: 18, minutes: [1, 13, 25, 38, 55] },
  { hour: 19, minutes: [10, 25, 40, 55] },
  { hour: 20, minutes: [10, 25, 40, 55] },
  { hour: 21, minutes: [10, 25, 40, 55] },
  { hour: 22, minutes: [10, 25, 40, 55] },
  { hour: 23, minutes: [10, 25, 39, 54] }, // Removed f suffix
];

// Sunday Schedule
const sundaySchedule = [
  { hour: 7, minutes: [30] },
  { hour: 8, minutes: [0, 30] },
  { hour: 9, minutes: [1, 21, 41] },
  { hour: 10, minutes: [1, 21, 41, 58] },
  { hour: 11, minutes: [11, 25, 37, 49] },
  { hour: 12, minutes: [1, 13, 25, 37, 49] },
  { hour: 13, minutes: [1, 13, 25, 37, 49] },
  { hour: 14, minutes: [1, 13, 25, 37, 49] },
  { hour: 15, minutes: [1, 13, 25, 37, 49] },
  { hour: 16, minutes: [1, 13, 25, 37, 49] },
  { hour: 17, minutes: [1, 13, 25, 37, 49] },
  { hour: 18, minutes: [1, 13, 26, 40, 54] },
  { hour: 19, minutes: [9, 24, 39, 54] },
  { hour: 20, minutes: [9, 24, 39, 54] },
  { hour: 21, minutes: [9, 23, 43] }, // Removed e suffix
  { hour: 22, minutes: [3, 23, 43] }, // Removed e suffix
  { hour: 23, minutes: [3, 23, 43] }, // Removed e/f suffix
];
// Frölunda - Angered Schedule
const weekdayScheduleRev = [
  { hour: 6, minutes: [4, 24, 38, 46] },
  { hour: 7, minutes: [1, 11, 20, 29, 37, 46, 55] },
  { hour: 8, minutes: [5, 15, 25, 34, 45, 55] },
  { hour: 9, minutes: [5, 16, 25, 35, 45, 57] },
  { hour: 10, minutes: [5, 15, 25, 37, 45, 55] },
  { hour: 11, minutes: [5, 17, 25, 35, 45, 57] },
  { hour: 12, minutes: [5, 15, 25, 37, 45, 55] },
  { hour: 13, minutes: [5, 17, 25, 35, 45, 54] },
  { hour: 14, minutes: [4, 14, 22, 31, 40, 48, 56] },
  { hour: 15, minutes: [9, 17, 26, 37, 45, 53] },
  { hour: 16, minutes: [1, 9, 17, 25, 33, 45, 57] },
  { hour: 17, minutes: [5, 14, 22, 34, 41, 52] },
  { hour: 18, minutes: [1, 9, 19, 30, 44, 56] },
  { hour: 19, minutes: [8, 19, 31, 43, 55] },
  { hour: 20, minutes: [4, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 34, 49, 56] },
  { hour: 22, minutes: [4, 19, 36, 50] },
  { hour: 23, minutes: [5, 20] },
];
// Saturday Schedule
const saturdayScheduleRev = [
  { hour: 7, minutes: [31] },
  { hour: 8, minutes: [1, 31] },
  { hour: 9, minutes: [1, 23, 41] },
  { hour: 10, minutes: [1, 21, 41, 51] },
  { hour: 11, minutes: [3, 14, 24, 34, 44, 54] },
  { hour: 12, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 13, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 14, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 15, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 16, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 17, minutes: [4, 14, 26, 38, 50] },
  { hour: 18, minutes: [2, 14, 26, 39, 50] },
  { hour: 19, minutes: [4, 19, 34, 49] },
  { hour: 20, minutes: [4, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 34, 49] },
  { hour: 22, minutes: [4, 19, 36, 51] },
  { hour: 23, minutes: [6, 21] },
];
// Sunday Schedule
const sundayScheduleRev = [
  { hour: 7, minutes: [31] },
  { hour: 8, minutes: [1, 31, 52] },
  { hour: 9, minutes: [12, 32, 52] },
  { hour: 10, minutes: [12, 33, 46, 58] },
  { hour: 11, minutes: [11, 24, 36, 48] },
  { hour: 12, minutes: [0, 12, 24, 36, 48] },
  { hour: 13, minutes: [0, 12, 24, 36, 48] },
  { hour: 14, minutes: [0, 11, 23, 35, 47, 59] },
  { hour: 15, minutes: [11, 23, 35, 47, 59] },
  { hour: 16, minutes: [11, 23, 35, 47, 59] },
  { hour: 17, minutes: [11, 23, 35, 47] },
  { hour: 18, minutes: [0, 12, 24, 36, 50] },
  { hour: 19, minutes: [5, 20, 35, 50] },
  { hour: 20, minutes: [5, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 36, 56] },
];

async function seedLine() {
  await seedTripTemplates({
    tramLineNumber: 8,
    startStopName: "Angered Centrum",
    endStopName: "Frölunda Torg",
    heading: "Frölunda",
    tripDurationMinutes: 48, // Adjust based on actual travel time
    weekdaySchedule,
    saturdaySchedule,
    sundaySchedule,
    season: "standard",
  });
}
async function seedLineRev() {
  await seedTripTemplates({
    tramLineNumber: 8,
    startStopName: "Frölunda Torg",
    endStopName: "Angered Centrum",
    heading: "Angered",
    tripDurationMinutes: 44, // Adjust based on actual travel time
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
    console.log("Tram Line 8 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 8:", error);
    process.exit(1);
  }
}
main();

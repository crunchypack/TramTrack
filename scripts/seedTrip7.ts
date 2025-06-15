import { seedTripTemplates } from "./tripSeeder";
// Weekday Schedule Opaltorget - Komettorget
const weekdaySchedule = [
  { hour: 8, minutes: [0, 8, 16, 24, 32, 40, 48, 56] },
  { hour: 9, minutes: [4, 12, 20, 28, 36, 44, 52] },
  { hour: 10, minutes: [0, 9, 16, 24, 32, 40, 49, 56] },
  { hour: 11, minutes: [4, 12, 20, 29, 36, 44, 52] },
  { hour: 12, minutes: [0, 9, 16, 24, 32, 40, 49, 56] },
  { hour: 13, minutes: [4, 12, 20, 29, 36, 44, 52] },
  { hour: 14, minutes: [0, 8, 16, 24, 32, 40, 48, 56] },
  { hour: 15, minutes: [4, 12, 20, 28, 36, 44, 52] },
  { hour: 16, minutes: [0, 8, 16, 24, 32, 40, 48, 56] },
  { hour: 17, minutes: [4, 13, 21, 29, 36, 44, 52] },
  { hour: 18, minutes: [0, 10, 20, 30, 39, 50] },
  { hour: 19, minutes: [0, 10, 20, 30, 42, 54] },
  { hour: 20, minutes: [6, 21, 36, 51] },
  { hour: 21, minutes: [6, 22, 36, 52, 57] }, // Removed c/d suffixes
  { hour: 22, minutes: [7, 17, 22, 37, 52, 57] }, // Removed c/d suffixes
];
const weekdaySummer16 = [
  { hour: 5, minutes: [10, 30, 50] },
  { hour: 6, minutes: [5, 18, 33, 48] },
  { hour: 7, minutes: [0, 13, 25, 37, 49] },
  { hour: 8, minutes: [1, 13, 25, 37, 49] },
  { hour: 9, minutes: [1, 13, 25, 37, 49] },
  { hour: 10, minutes: [1, 13, 25, 37, 49] },
  { hour: 11, minutes: [1, 13, 25, 37, 49] },
  { hour: 12, minutes: [1, 13, 25, 37, 49] },
  { hour: 13, minutes: [1, 13, 25, 37, 49] },
  { hour: 14, minutes: [1, 13, 25, 37, 59] },
  { hour: 15, minutes: [1, 13, 25, 37, 49] },
  { hour: 16, minutes: [1, 13, 25, 37, 49] },
  { hour: 17, minutes: [1, 13, 25, 37, 49] },
  { hour: 18, minutes: [1, 13, 25, 37, 49] },
  { hour: 19, minutes: [2, 15, 26, 38, 50] },
  { hour: 20, minutes: [5, 20, 35, 50] },
  { hour: 21, minutes: [5, 20, 36, 58] },
  { hour: 22, minutes: [18, 38, 58] },
  { hour: 23, minutes: [18] },
];

// Saturday Schedule
const saturdaySchedule = [
  { hour: 8, minutes: [15, 35, 55] },
  { hour: 9, minutes: [13, 27, 41, 56] },
  { hour: 10, minutes: [9, 21, 36, 46, 57] },
  { hour: 11, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 12, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 13, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 14, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 15, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 16, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 17, minutes: [7, 16, 26, 38, 50] },
  { hour: 18, minutes: [2, 14, 26, 38, 51] },
  { hour: 19, minutes: [6, 21, 36, 51] },
  { hour: 20, minutes: [6, 21, 36, 51] },
  { hour: 21, minutes: [6, 22, 37, 52] },
  { hour: 22, minutes: [7, 22, 37, 52] },
];
const saturdaySummer16 = [
  { hour: 6, minutes: [6, 36] },
  { hour: 7, minutes: [6, 36] },
  { hour: 8, minutes: [6, 35, 55] },
  { hour: 9, minutes: [15, 35, 52] },
  { hour: 10, minutes: [7, 22, 37, 52] },
  { hour: 11, minutes: [7, 22, 37, 52] },
  { hour: 12, minutes: [7, 22, 37, 52] },
  { hour: 13, minutes: [7, 22, 37, 52] },
  { hour: 14, minutes: [7, 22, 37, 52] },
  { hour: 15, minutes: [7, 22, 37, 52] },
  { hour: 16, minutes: [7, 22, 37, 52] },
  { hour: 17, minutes: [7, 22, 37, 52] },
  { hour: 18, minutes: [7, 22, 37, 52] },
  { hour: 19, minutes: [7, 22, 37, 52] },
  { hour: 20, minutes: [8, 23, 28, 53] },
  { hour: 21, minutes: [8, 22, 37, 52] },
  { hour: 22, minutes: [7, 22, 37, 52] },
  { hour: 23, minutes: [7, 22] },
];

// Sunday Schedule
const sundaySchedule = [
  { hour: 8, minutes: [6, 35, 55] },
  { hour: 9, minutes: [15, 35, 55] },
  { hour: 10, minutes: [12, 27, 42, 57] },
  { hour: 11, minutes: [11, 25, 37, 49] },
  { hour: 12, minutes: [1, 13, 25, 37, 49] },
  { hour: 13, minutes: [1, 13, 25, 37, 49] },
  { hour: 14, minutes: [1, 13, 25, 37, 49] },
  { hour: 15, minutes: [1, 13, 25, 37, 49] },
  { hour: 16, minutes: [1, 13, 25, 37, 49] },
  { hour: 17, minutes: [1, 13, 25, 37, 49] },
  { hour: 18, minutes: [1, 13, 25, 37, 52] },
  { hour: 19, minutes: [7, 22, 37, 52] },
  { hour: 20, minutes: [6, 21, 36, 51] },
  { hour: 21, minutes: [6, 22, 37, 57] },
  { hour: 22, minutes: [17, 37, 57] },
];
const sundaySummer16 = [
  { hour: 6, minutes: [6, 36] },
  { hour: 7, minutes: [6, 36] },
  { hour: 8, minutes: [6, 35, 55] },
  { hour: 9, minutes: [15, 35, 52] },
  { hour: 10, minutes: [7, 22, 37, 52] },
  { hour: 11, minutes: [7, 22, 37, 52] },
  { hour: 12, minutes: [7, 22, 37, 52] },
  { hour: 13, minutes: [7, 22, 37, 52] },
  { hour: 14, minutes: [7, 22, 37, 52] },
  { hour: 15, minutes: [7, 22, 37, 52] },
  { hour: 16, minutes: [7, 22, 37, 52] },
  { hour: 17, minutes: [7, 22, 37, 52] },
  { hour: 18, minutes: [7, 22, 37, 52] },
  { hour: 19, minutes: [7, 22, 37, 52] },
  { hour: 20, minutes: [8, 23, 38, 53] },
  { hour: 21, minutes: [8, 22, 37, 57] },
  { hour: 22, minutes: [17, 37, 57] },
  { hour: 23, minutes: [17] },
];

// Weekday Schedule Komettorget - Opaltorget
const weekdayScheduleRev = [
  { hour: 8, minutes: [5, 11, 17, 23, 30, 38, 46, 54] },
  { hour: 9, minutes: [2, 10, 18, 26, 34, 42, 50, 58] },
  { hour: 10, minutes: [6, 14, 22, 30, 38, 46, 54] },
  { hour: 11, minutes: [2, 10, 18, 26, 34, 42, 50, 58] },
  { hour: 12, minutes: [6, 14, 22, 30, 38, 46, 54] },
  { hour: 13, minutes: [2, 10, 18, 26, 34, 42, 50, 58] },
  { hour: 14, minutes: [6, 14, 22, 30, 38, 46, 54] },
  { hour: 15, minutes: [2, 10, 18, 26, 34, 42, 50, 59] },
  { hour: 16, minutes: [7, 15, 23, 31, 39, 47, 55] },
  { hour: 17, minutes: [3, 11, 19, 27, 35, 43, 51, 59] },
  { hour: 18, minutes: [8, 19, 29, 38, 48, 58] },
  { hour: 19, minutes: [8, 20, 32, 44, 56] },
  { hour: 20, minutes: [11, 26, 42, 57] },
  { hour: 21, minutes: [12, 27, 42, 56, 57] },
  { hour: 22, minutes: [11, 17, 26, 37, 41, 56, 57] }, // Removed e/c suffixes
];
const weekdaySummer16Rev = [
  { hour: 4, minutes: [52] },
  { hour: 5, minutes: [12, 32, 49] },
  { hour: 6, minutes: [4, 19, 34, 49] },
  { hour: 7, minutes: [4, 17, 30, 42, 54] },
  { hour: 8, minutes: [6, 18, 30, 42, 54] },
  { hour: 9, minutes: [6, 18, 30, 42, 54] },
  { hour: 10, minutes: [6, 18, 30, 42, 54] },
  { hour: 11, minutes: [6, 18, 30, 42, 54] },
  { hour: 12, minutes: [6, 18, 30, 42, 54] },
  { hour: 13, minutes: [6, 18, 30, 42, 54] },
  { hour: 14, minutes: [6, 18, 30, 42, 54] },
  { hour: 15, minutes: [6, 18, 30, 42, 54] },
  { hour: 16, minutes: [6, 18, 30, 42, 54] },
  { hour: 17, minutes: [6, 18, 30, 42, 54] },
  { hour: 18, minutes: [6, 18, 30, 42, 54] },
  { hour: 19, minutes: [6, 19, 33, 45, 58] },
  { hour: 20, minutes: [13, 28, 42, 57] },
  { hour: 21, minutes: [12, 28, 43, 59] },
  { hour: 22, minutes: [18, 38, 58] },
  { hour: 23, minutes: [18, 39, 57] },
];

// Saturday Schedule
const saturdayScheduleRev = [
  { hour: 8, minutes: [13, 33, 53] },
  { hour: 9, minutes: [13, 29, 42, 54] },
  { hour: 10, minutes: [6, 18, 30, 42, 53] },
  { hour: 11, minutes: [3, 13, 23, 32, 42, 52] },
  { hour: 12, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 13, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 14, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 15, minutes: [2, 12, 22, 34, 44, 54] },
  { hour: 16, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 17, minutes: [4, 17, 30, 42, 54] },
  { hour: 18, minutes: [6, 18, 30, 42, 56] },
  { hour: 19, minutes: [11, 26, 41, 56] },
  { hour: 20, minutes: [11, 26, 41, 57] },
  { hour: 21, minutes: [12, 27, 42, 57] },
  { hour: 22, minutes: [12, 27, 42, 57] },
];
const saturdaySummer16Rev = [
  { hour: 5, minutes: [18, 48] },
  { hour: 6, minutes: [18, 48] },
  { hour: 7, minutes: [18, 47] },
  { hour: 8, minutes: [13, 33, 53] },
  { hour: 9, minutes: [13, 33, 53] },
  { hour: 10, minutes: [12, 27, 42, 57] },
  { hour: 11, minutes: [12, 27, 42, 57] },
  { hour: 12, minutes: [12, 27, 42, 57] },
  { hour: 13, minutes: [12, 27, 42, 57] },
  { hour: 14, minutes: [12, 27, 42, 57] },
  { hour: 15, minutes: [12, 27, 42, 57] },
  { hour: 16, minutes: [12, 27, 42, 57] },
  { hour: 17, minutes: [12, 27, 42, 57] },
  { hour: 18, minutes: [12, 27, 42, 57] },
  { hour: 19, minutes: [11, 26, 41, 56] },
  { hour: 20, minutes: [11, 26, 41, 56] },
  { hour: 21, minutes: [11, 26, 41, 56] },
  { hour: 22, minutes: [11, 26, 41, 56] },
  { hour: 23, minutes: [11, 26, 41, 56] },
];

// Sunday Schedule
const sundayScheduleRev = [
  { hour: 8, minutes: [13, 33, 53] },
  { hour: 9, minutes: [13, 33, 53] },
  { hour: 10, minutes: [13, 29, 44, 59] },
  { hour: 11, minutes: [13, 28, 40, 52] },
  { hour: 12, minutes: [4, 16, 28, 40, 52] },
  { hour: 13, minutes: [4, 16, 28, 40, 52] },
  { hour: 14, minutes: [4, 16, 28, 40, 52] },
  { hour: 15, minutes: [4, 16, 28, 40, 52] },
  { hour: 16, minutes: [4, 16, 28, 40, 52] },
  { hour: 17, minutes: [4, 16, 28, 40, 52] },
  { hour: 18, minutes: [5, 17, 29, 43, 57] },
  { hour: 19, minutes: [12, 27, 42, 56] },
  { hour: 20, minutes: [11, 26, 42, 57] },
  { hour: 21, minutes: [12, 27, 42, 57] },
  { hour: 22, minutes: [17, 37, 57] },
];
const sundaySummer16Rev = [
  { hour: 5, minutes: [18, 48] },
  { hour: 6, minutes: [18, 48] },
  { hour: 7, minutes: [18, 47] },
  { hour: 8, minutes: [13, 33, 53] },
  { hour: 9, minutes: [13, 33, 53] },
  { hour: 10, minutes: [12, 27, 42, 57] },
  { hour: 11, minutes: [12, 27, 42, 57] },
  { hour: 12, minutes: [12, 27, 42, 57] },
  { hour: 13, minutes: [12, 27, 42, 57] },
  { hour: 14, minutes: [12, 27, 42, 57] },
  { hour: 15, minutes: [12, 27, 42, 57] },
  { hour: 16, minutes: [12, 27, 42, 57] },
  { hour: 17, minutes: [12, 27, 42, 57] },
  { hour: 18, minutes: [12, 27, 42, 57] },
  { hour: 19, minutes: [11, 26, 41, 56] },
  { hour: 20, minutes: [11, 26, 41, 56] },
  { hour: 21, minutes: [11, 26, 41, 57] },
  { hour: 22, minutes: [17, 37, 57] },
  { hour: 23, minutes: [17, 37, 57] },
];

async function seedLine() {
  await seedTripTemplates({
    tramLineNumber: 7,
    startStopName: "Opaltorget",
    endStopName: "Komettorget",
    heading: "Bergsjön",
    tripDurationMinutes: 48, // Adjust based on actual travel time
    weekdaySchedule,
    saturdaySchedule,
    sundaySchedule,
  });
}
async function seedLineSummer16() {
  await seedTripTemplates({
    tramLineNumber: 7,
    startStopName: "Opaltorget",
    endStopName: "Komettorget",
    heading: "Bergsjön",
    tripDurationMinutes: 48, // Adjust based on actual travel time
    weekdaySchedule: weekdaySummer16,
    saturdaySchedule: saturdaySummer16,
    sundaySchedule: sundaySummer16,
    season: "summer",
  });
}
async function seedLineRev() {
  await seedTripTemplates({
    tramLineNumber: 7,
    startStopName: "Komettorget",
    endStopName: "Opaltorget",
    heading: "Tynnered",
    tripDurationMinutes: 55, // Adjust based on actual travel time
    weekdaySchedule: weekdayScheduleRev,
    saturdaySchedule: saturdayScheduleRev,
    sundaySchedule: sundayScheduleRev,
  });
}
async function seedLineRevSummer16() {
  await seedTripTemplates({
    tramLineNumber: 7,
    startStopName: "Komettorget",
    endStopName: "Opaltorget",
    heading: "Tynnered",
    tripDurationMinutes: 55, // Adjust based on actual travel time
    weekdaySchedule: weekdaySummer16Rev,
    saturdaySchedule: saturdaySummer16Rev,
    sundaySchedule: sundaySummer16Rev,
    season: "summer",
  });
}
async function main() {
  try {
    await seedLine();
    await seedLineRev();
    console.log("Tram Line 7 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 4:", error);
    process.exit(1);
  }
}
async function mainSummer16() {
  try {
    await seedLineSummer16();
    await seedLineRevSummer16();
    console.log("Tram Line 7 summer 2016 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 4 summer 2016:", error);
    process.exit(1);
  }
}
mainSummer16();

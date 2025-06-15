import { seedTripTemplates } from "./tripSeeder";
// Marklandsgatan - Virginsgatan Schedule
const weekdaySchedule = [
  { hour: 8, minutes: [9, 19, 29, 39, 49, 59] },
  { hour: 9, minutes: [9, 18, 28, 38, 48, 58] },
  { hour: 10, minutes: [8, 18, 28, 38, 48, 57] },
  { hour: 11, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 12, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 13, minutes: [7, 17, 27, 37, 47, 56] },
  { hour: 14, minutes: [5, 14, 24, 32, 41, 51] },
  { hour: 15, minutes: [4, 12, 21, 29, 38, 46, 54] },
  { hour: 16, minutes: [2, 10, 18, 26, 34, 41, 50, 58] },
  { hour: 17, minutes: [6, 14, 22, 31, 39, 46, 55] },
  { hour: 18, minutes: [6, 14, 25, 35, 46, 56] },
  { hour: 19, minutes: [4, 14, 26, 38, 50] },
  { hour: 20, minutes: [2, 16, 32, 48] },
  { hour: 21, minutes: [3, 19, 34, 36, 49, 56] },
  { hour: 22, minutes: [4, 17, 19, 34, 37, 49, 57] },
];
const weekdayScheduleSummer16 = [
  { hour: 0, minutes: [25, 37] },
  { hour: 1, minutes: [8, 34] },
  { hour: 2, minutes: [4] },
  { hour: 5, minutes: [0, 16, 33, 48, 59] },
  { hour: 6, minutes: [13, 28, 43, 58] },
  { hour: 7, minutes: [10, 22, 34, 46, 58] },
  { hour: 8, minutes: [10, 22, 34, 46, 58] },
  { hour: 9, minutes: [10, 22, 34, 46, 58] },
  { hour: 10, minutes: [10, 22, 34, 46, 58] },
  { hour: 11, minutes: [10, 22, 34, 46, 58] },
  { hour: 12, minutes: [10, 22, 34, 46, 58] },
  { hour: 13, minutes: [10, 22, 34, 46, 58] },
  { hour: 14, minutes: [10, 22, 34, 46, 58] },
  { hour: 15, minutes: [10, 22, 34, 46, 58] },
  { hour: 16, minutes: [10, 22, 34, 46, 58] },
  { hour: 17, minutes: [10, 22, 34, 46, 59] },
  { hour: 18, minutes: [11, 23, 35, 48] },
  { hour: 19, minutes: [4, 19, 34, 49] },
  { hour: 20, minutes: [4, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 36, 56] },
  { hour: 22, minutes: [16, 36, 56] },
  { hour: 23, minutes: [17, 37, 59] },
];

const saturdaySchedule = [
  { hour: 8, minutes: [11, 34, 52] },
  { hour: 9, minutes: [7, 22, 37, 52] },
  { hour: 10, minutes: [7, 21, 33, 46, 56] },
  { hour: 11, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 12, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 13, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 14, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 15, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 16, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 17, minutes: [7, 19, 31, 43, 55] },
  { hour: 18, minutes: [7, 19, 32, 47] },
  { hour: 19, minutes: [2, 17, 32, 47] },
  { hour: 20, minutes: [2, 17, 32, 47] },
  { hour: 21, minutes: [2, 18, 34, 49] },
  { hour: 22, minutes: [4, 19, 34, 49] },
];
const saturdayScheduleSummer16 = [
  { hour: 0, minutes: [25, 37] },
  { hour: 1, minutes: [8, 34] },
  { hour: 2, minutes: [4] },
  { hour: 5, minutes: [41] },
  { hour: 6, minutes: [11, 41] },
  { hour: 7, minutes: [11, 41] },
  { hour: 8, minutes: [11, 33, 53] },
  { hour: 9, minutes: [13, 33, 50] },
  { hour: 10, minutes: [6, 21, 36, 51] },
  { hour: 11, minutes: [6, 21, 36, 51] },
  { hour: 12, minutes: [6, 21, 36, 51] },
  { hour: 13, minutes: [6, 21, 36, 51] },
  { hour: 14, minutes: [6, 21, 36, 51] },
  { hour: 15, minutes: [6, 21, 36, 51] },
  { hour: 16, minutes: [6, 21, 36, 51] },
  { hour: 17, minutes: [6, 21, 36, 51] },
  { hour: 18, minutes: [5, 20, 34, 49] },
  { hour: 19, minutes: [4, 19, 34, 49] },
  { hour: 20, minutes: [4, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 34, 49] },
  { hour: 22, minutes: [4, 19, 34, 49] },
  { hour: 23, minutes: [4, 19, 34, 48] },
];

const sundaySchedule = [
  { hour: 8, minutes: [11, 34, 53] },
  { hour: 9, minutes: [13, 33, 53] },
  { hour: 10, minutes: [10, 26, 41, 56] },
  { hour: 11, minutes: [10, 22, 34, 46, 58] },
  { hour: 12, minutes: [10, 22, 34, 46, 58] },
  { hour: 13, minutes: [10, 22, 34, 46, 57] },
  { hour: 14, minutes: [9, 21, 33, 45, 57] },
  { hour: 15, minutes: [9, 21, 33, 45, 57] },
  { hour: 16, minutes: [9, 21, 33, 45, 57] },
  { hour: 17, minutes: [9, 21, 33, 45, 58] },
  { hour: 18, minutes: [10, 23, 36, 48] },
  { hour: 19, minutes: [2, 17, 32, 47] },
  { hour: 20, minutes: [2, 16, 32, 48] },
  { hour: 21, minutes: [3, 18, 36, 56] },
  { hour: 22, minutes: [16, 36, 56] },
];
const sundayScheduleSummer16 = [
  { hour: 0, minutes: [4, 19, 25, 35, 38, 54] },
  { hour: 1, minutes: [8, 14, 34, 35, 54] },
  { hour: 2, minutes: [5, 14, 34, 54] },
  { hour: 3, minutes: [14, 34] },
  { hour: 5, minutes: [41] },
  { hour: 6, minutes: [11, 41] },
  { hour: 7, minutes: [11, 41] },
  { hour: 8, minutes: [11, 33, 53] },
  { hour: 9, minutes: [13, 33, 50] },
  { hour: 10, minutes: [6, 21, 36, 51] },
  { hour: 11, minutes: [6, 21, 36, 51] },
  { hour: 12, minutes: [6, 21, 36, 51] },
  { hour: 13, minutes: [6, 21, 36, 51] },
  { hour: 14, minutes: [6, 21, 36, 51] },
  { hour: 15, minutes: [6, 21, 36, 51] },
  { hour: 16, minutes: [6, 21, 36, 51] },
  { hour: 17, minutes: [6, 21, 36, 51] },
  { hour: 18, minutes: [5, 20, 34, 49] },
  { hour: 19, minutes: [4, 19, 34, 49] },
  { hour: 20, minutes: [4, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 36, 56] },
  { hour: 22, minutes: [16, 36, 56] },
  { hour: 23, minutes: [17, 37, 57] },
];
// Virginsgatan - Marklandsgatan Schedule
const weekdayScheduleRev = [
  { hour: 8, minutes: [9, 19, 29, 39, 49, 59] },
  { hour: 9, minutes: [9, 18, 28, 38, 48, 58] },
  { hour: 10, minutes: [8, 18, 28, 38, 48, 57] },
  { hour: 11, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 12, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 13, minutes: [7, 17, 27, 37, 47, 56] },
  { hour: 14, minutes: [5, 14, 24, 32, 41, 51] },
  { hour: 15, minutes: [4, 12, 21, 29, 38, 46, 54] },
  { hour: 16, minutes: [2, 10, 18, 26, 34, 41, 50, 58] },
  { hour: 17, minutes: [6, 14, 22, 31, 39, 46, 55] }, // 46d/46e combined
  { hour: 18, minutes: [6, 14, 25, 35, 46, 56] },
  { hour: 19, minutes: [4, 14, 26, 38, 50] },
  { hour: 20, minutes: [2, 16, 32, 48] },
  { hour: 21, minutes: [3, 19, 34, 36, 49, 56] }, // d/e suffixes removed
  { hour: 22, minutes: [4, 17, 19, 34, 37, 49, 57] }, // d/e suffixes removed
];
const weekdayScheduleSummer16Rev = [
  { hour: 5, minutes: [20, 35, 49] },
  { hour: 6, minutes: [3, 18, 33, 48] },
  { hour: 7, minutes: [3, 15, 29, 41, 53] },
  { hour: 8, minutes: [5, 17, 29, 41, 53] },
  { hour: 9, minutes: [5, 17, 29, 41, 53] },
  { hour: 10, minutes: [5, 17, 29, 41, 53] },
  { hour: 11, minutes: [5, 17, 29, 41, 53] },
  { hour: 12, minutes: [5, 17, 29, 41, 53] },
  { hour: 13, minutes: [5, 17, 29, 41, 53] },
  { hour: 14, minutes: [5, 17, 29, 41, 53] },
  { hour: 15, minutes: [5, 17, 29, 41, 53] },
  { hour: 16, minutes: [5, 17, 29, 41, 53] },
  { hour: 17, minutes: [5, 17, 29, 41, 53] },
  { hour: 18, minutes: [5, 17, 29, 41, 53] },
  { hour: 19, minutes: [5, 17, 32, 47] },
  { hour: 20, minutes: [2, 17, 32, 47] },
  { hour: 21, minutes: [2, 17, 32, 47] },
  { hour: 22, minutes: [7, 27, 47] },
  { hour: 23, minutes: [7, 27, 47] },
];

const saturdayScheduleRev = [
  { hour: 8, minutes: [11, 34, 52] },
  { hour: 9, minutes: [7, 22, 37, 52] },
  { hour: 10, minutes: [7, 21, 33, 46, 56] },
  { hour: 11, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 12, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 13, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 14, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 15, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 16, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 17, minutes: [7, 19, 31, 43, 55] },
  { hour: 18, minutes: [7, 19, 32, 47] },
  { hour: 19, minutes: [2, 17, 32, 47] },
  { hour: 20, minutes: [2, 17, 32, 47] },
  { hour: 21, minutes: [2, 18, 34, 49] },
  { hour: 22, minutes: [4, 19, 34, 49] },
];
const saturdayScheduleSummer16Rev = [
  { hour: 6, minutes: [2, 32] },
  { hour: 7, minutes: [2, 32] },
  { hour: 8, minutes: [2, 26, 46] },
  { hour: 9, minutes: [6, 26, 46] },
  { hour: 10, minutes: [6, 23, 38, 53] },
  { hour: 11, minutes: [8, 23, 38, 53] },
  { hour: 12, minutes: [8, 23, 38, 53] },
  { hour: 13, minutes: [8, 23, 38, 53] },
  { hour: 14, minutes: [8, 23, 38, 53] },
  { hour: 15, minutes: [8, 23, 38, 53] },
  { hour: 16, minutes: [8, 23, 38, 53] },
  { hour: 17, minutes: [9, 24, 39, 54] },
  { hour: 18, minutes: [9, 24, 39, 54] },
  { hour: 19, minutes: [9, 24, 39, 54] },
  { hour: 20, minutes: [9, 24, 39, 55] },
  { hour: 21, minutes: [10, 25, 40, 55] },
  { hour: 22, minutes: [10, 25, 40, 55] },
  { hour: 23, minutes: [10, 25, 40, 55] },
];

// Sunday schedule (original order)
const sundayScheduleRev = [
  { hour: 8, minutes: [11, 34, 53] },
  { hour: 9, minutes: [13, 33, 53] },
  { hour: 10, minutes: [10, 26, 41, 56] },
  { hour: 11, minutes: [10, 22, 34, 46, 58] },
  { hour: 12, minutes: [10, 22, 34, 46, 58] },
  { hour: 13, minutes: [10, 22, 34, 46, 57] },
  { hour: 14, minutes: [9, 21, 33, 45, 57] },
  { hour: 15, minutes: [9, 21, 33, 45, 57] },
  { hour: 16, minutes: [9, 21, 33, 45, 57] },
  { hour: 17, minutes: [9, 21, 33, 45, 58] },
  { hour: 18, minutes: [10, 23, 36, 48] },
  { hour: 19, minutes: [2, 17, 32, 47] },
  { hour: 20, minutes: [2, 16, 32, 48] },
  { hour: 21, minutes: [3, 18, 36, 56] },
  { hour: 22, minutes: [16, 36, 56] },
];
const sundayScheduleSummer16Rev = [
  { hour: 6, minutes: [2, 32] },
  { hour: 7, minutes: [2, 32] },
  { hour: 8, minutes: [2, 26, 46] },
  { hour: 9, minutes: [6, 26, 46] },
  { hour: 10, minutes: [6, 23, 38, 53] },
  { hour: 11, minutes: [8, 23, 38, 53] },
  { hour: 12, minutes: [8, 23, 38, 53] },
  { hour: 13, minutes: [8, 23, 38, 53] },
  { hour: 14, minutes: [8, 23, 38, 53] },
  { hour: 15, minutes: [8, 23, 38, 53] },
  { hour: 16, minutes: [8, 23, 38, 53] },
  { hour: 17, minutes: [9, 24, 39, 54] },
  { hour: 18, minutes: [9, 24, 39, 54] },
  { hour: 19, minutes: [9, 24, 39, 54] },
  { hour: 20, minutes: [9, 24, 39, 55] },
  { hour: 21, minutes: [10, 25, 40, 55] },
  { hour: 22, minutes: [9, 27, 47] },
  { hour: 23, minutes: [7, 27, 47] },
];

async function seedLine3() {
  await seedTripTemplates({
    tramLineNumber: 3,
    startStopName: "Marklandsgatan",
    endStopName: "Virginsgatan",
    heading: "Kålltorp",
    tripDurationMinutes: 45, // Adjust based on actual travel time
    weekdaySchedule,
    saturdaySchedule,
    sundaySchedule,
  });
}
async function seedLine3Summer16() {
  await seedTripTemplates({
    tramLineNumber: 3,
    startStopName: "Marklandsgatan",
    endStopName: "Virginsgatan",
    heading: "Kålltorp",
    tripDurationMinutes: 45, // Adjust based on actual travel time
    weekdaySchedule: weekdayScheduleSummer16,
    saturdaySchedule: saturdayScheduleSummer16,
    sundaySchedule: sundayScheduleSummer16,
    season: "summer",
  });
}
async function seedLine3Rev() {
  await seedTripTemplates({
    tramLineNumber: 3,
    startStopName: "Virginsgatan",
    endStopName: "Marklandsgatan",
    heading: "Marklandsgatan",
    tripDurationMinutes: 40,
    weekdaySchedule: weekdayScheduleRev,
    saturdaySchedule: saturdayScheduleRev,
    sundaySchedule: sundayScheduleRev,
  });
}
async function seedLine3RevSummer16() {
  await seedTripTemplates({
    tramLineNumber: 3,
    startStopName: "Virginsgatan",
    endStopName: "Marklandsgatan",
    heading: "Marklandsgatan",
    tripDurationMinutes: 40,
    weekdaySchedule: weekdayScheduleSummer16Rev,
    saturdaySchedule: saturdayScheduleSummer16Rev,
    sundaySchedule: sundayScheduleSummer16Rev,
    season: "summer",
  });
}
async function main() {
  try {
    await seedLine3();
    await seedLine3Rev();
    console.log("Tram Line 3 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Tram Line 3 trip templates:", error);
    process.exit(1);
  }
}
async function mainSummer() {
  try {
    await seedLine3Summer16();
    await seedLine3RevSummer16();
    console.log("Tram Line 3 Summer trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Tram Line 3 Summer trip templates:", error);
    process.exit(1);
  }
}
mainSummer();

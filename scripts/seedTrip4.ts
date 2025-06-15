import { seedTripTemplates } from "./tripSeeder";
// Angered Centrum - Mölndals Innerstad Schedule
// Weekday schedule (Monday-Friday)
const weekdaySchedule = [
  { hour: 8, minutes: [0, 8, 18, 30, 40, 50] },
  { hour: 9, minutes: [1, 11, 21, 30, 40, 51] },
  { hour: 10, minutes: [1, 10, 20, 31, 41, 50] },
  { hour: 11, minutes: [0, 11, 21, 30, 40, 50] },
  { hour: 12, minutes: [1, 11, 20, 31, 41, 50] },
  { hour: 13, minutes: [0, 11, 21, 31, 41, 51] },
  { hour: 14, minutes: [1, 12, 21, 31, 41, 52] },
  { hour: 15, minutes: [0, 6, 16, 24, 30, 38, 46, 56] },
  { hour: 16, minutes: [3, 11, 19, 27, 35, 43, 51, 59] },
  { hour: 17, minutes: [7, 15, 23, 31, 41, 51] },
  { hour: 18, minutes: [1, 10, 20, 31, 45, 57] },
  { hour: 19, minutes: [9, 21, 33, 45, 57] },
  { hour: 20, minutes: [9, 21, 33, 45] },
  { hour: 21, minutes: [0, 15, 30, 32, 45, 51] }, // Removed d/e suffixes
  { hour: 22, minutes: [0, 11, 15, 30, 31, 45, 51] }, // Removed d/e suffixes
];
// Mölndal - Nymånegatan Schedule
const weekdayScheduleNym = [
  { hour: 0, minutes: [1, 21, 41] },
  { hour: 1, minutes: [1, 14, 15, 34, 35] },
  { hour: 4, minutes: [55] },
  { hour: 5, minutes: [19, 39, 52] },
  { hour: 6, minutes: [6, 20, 31, 44, 58] },
  { hour: 7, minutes: [7, 20, 32, 44, 56] },
  { hour: 8, minutes: [8, 20, 32, 44, 56] },
  { hour: 9, minutes: [8, 20, 32, 44, 56] },
  { hour: 10, minutes: [8, 20, 32, 44, 56] },
  { hour: 11, minutes: [8, 20, 32, 44, 56] },
  { hour: 12, minutes: [8, 20, 32, 44, 56] },
  { hour: 13, minutes: [8, 20, 32, 43, 56] },
  { hour: 14, minutes: [8, 20, 32, 44, 56] },
  { hour: 15, minutes: [8, 20, 32, 44, 56] },
  { hour: 16, minutes: [8, 20, 32, 44, 56] },
  { hour: 17, minutes: [8, 20, 32, 44, 56] },
  { hour: 18, minutes: [8, 20, 32, 44, 56] },
  { hour: 19, minutes: [8, 20, 32, 50] },
  { hour: 20, minutes: [5, 20, 35, 50] },
  { hour: 21, minutes: [5, 20, 36, 54] },
  { hour: 22, minutes: [14, 35] },
  { hour: 23, minutes: [15, 38] },
];
// Saturday schedule
const saturdaySchedule = [
  { hour: 8, minutes: [4, 27, 47] },
  { hour: 9, minutes: [7, 27, 46] },
  { hour: 10, minutes: [3, 18, 33, 48] },
  { hour: 11, minutes: [3, 16, 27, 36, 46, 56] },
  { hour: 12, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 13, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 14, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 15, minutes: [6, 16, 26, 36, 47, 57] },
  { hour: 16, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 17, minutes: [7, 17, 29, 41, 53] },
  { hour: 18, minutes: [5, 17, 29, 44, 59] },
  { hour: 19, minutes: [14, 29, 44, 59] },
  { hour: 20, minutes: [14, 29, 44] },
  { hour: 21, minutes: [0, 15, 30, 45] },
  { hour: 22, minutes: [0, 15, 30, 45] },
];
const saturdayScheduleNym = [
  { hour: 0, minutes: [1, 21, 41] },
  { hour: 1, minutes: [1, 15, 35] },
  { hour: 5, minutes: [15, 45] },
  { hour: 6, minutes: [17, 48] },
  { hour: 7, minutes: [18, 48] },
  { hour: 8, minutes: [12, 32, 53] },
  { hour: 9, minutes: [12, 32, 52] },
  { hour: 10, minutes: [10, 30, 50] },
  { hour: 11, minutes: [5, 20, 35, 50] },
  { hour: 12, minutes: [5, 20, 35, 50] },
  { hour: 13, minutes: [5, 20, 35, 50] },
  { hour: 14, minutes: [5, 20, 35, 50] },
  { hour: 15, minutes: [5, 20, 35, 50] },
  { hour: 16, minutes: [5, 20, 35, 50] },
  { hour: 17, minutes: [5, 20, 35, 50] },
  { hour: 18, minutes: [5, 20, 35, 51] },
  { hour: 21, minutes: [6, 21, 36, 51] },
  { hour: 22, minutes: [6, 21, 36, 51] },
  { hour: 23, minutes: [6, 21, 41] },
];

// Sunday schedule
const sundaySchedule = [
  { hour: 8, minutes: [4, 27, 47] },
  { hour: 9, minutes: [7, 27, 47] },
  { hour: 10, minutes: [7, 27, 47] },
  { hour: 11, minutes: [8, 22, 34, 46, 58] },
  { hour: 12, minutes: [10, 22, 34, 46, 58] },
  { hour: 13, minutes: [10, 22, 34, 46, 58] },
  { hour: 14, minutes: [10, 22, 34, 46, 58] },
  { hour: 15, minutes: [10, 22, 34, 46, 58] },
  { hour: 16, minutes: [10, 22, 34, 46, 58] },
  { hour: 17, minutes: [10, 22, 34, 45, 58] },
  { hour: 18, minutes: [11, 23, 36, 50] },
  { hour: 19, minutes: [5, 20, 35, 50] },
  { hour: 20, minutes: [5, 20, 35, 50] },
  { hour: 21, minutes: [5, 20, 36, 51] },
  { hour: 22, minutes: [11, 31, 51] },
];
const sundayScheduleNym = [
  { hour: 0, minutes: [0, 1, 20, 21, 40, 41] },
  { hour: 1, minutes: [0, 1, 15, 21, 35, 41] },
  { hour: 2, minutes: [1, 21, 41] },
  { hour: 3, minutes: [1, 21, 41, 56] },
  { hour: 4, minutes: [16] },
  { hour: 5, minutes: [15, 45] },
  { hour: 6, minutes: [17, 48] },
  { hour: 7, minutes: [18, 48] },
  { hour: 8, minutes: [12, 32, 53] },
  { hour: 9, minutes: [12, 32, 52] },
  { hour: 10, minutes: [10, 30, 50] },
  { hour: 11, minutes: [5, 20, 35, 50] },
  { hour: 12, minutes: [5, 20, 35, 50] },
  { hour: 13, minutes: [5, 20, 35, 50] },
  { hour: 14, minutes: [5, 20, 35, 50] },
  { hour: 15, minutes: [5, 20, 35, 50] },
  { hour: 16, minutes: [5, 20, 35, 50] },
  { hour: 17, minutes: [5, 20, 35, 50] },
  { hour: 18, minutes: [5, 20, 35, 51] },
  { hour: 19, minutes: [5, 20, 35, 50] },
  { hour: 20, minutes: [6, 21, 36, 51] },
  { hour: 21, minutes: [6, 21, 36, 54] },
  { hour: 22, minutes: [14, 34, 54] },
  { hour: 23, minutes: [14, 37] },
];

// Mölndals Innerstad - Angered Centrum Schedule>
const weekdayScheduleRev = [
  { hour: 8, minutes: [3, 13, 23, 34, 44, 54] },
  { hour: 9, minutes: [4, 14, 24, 34, 45, 54] },
  { hour: 10, minutes: [4, 14, 25, 34, 44, 54] },
  { hour: 11, minutes: [5, 14, 24, 34, 45, 54] },
  { hour: 12, minutes: [4, 14, 25, 34, 44, 54] },
  { hour: 13, minutes: [5, 14, 24, 34, 45, 54] },
  { hour: 14, minutes: [3, 12, 22, 30, 39, 47, 55] },
  { hour: 15, minutes: [5, 11, 19, 28, 37, 45, 53] },
  { hour: 16, minutes: [1, 9, 17, 25, 33, 41, 51, 58] },
  { hour: 17, minutes: [6, 15, 23, 31, 40, 50, 56] },
  { hour: 18, minutes: [5, 17, 28, 39, 52] },
  { hour: 19, minutes: [5, 17, 28, 41, 53] },
  { hour: 20, minutes: [5, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 35, 51, 54] }, // Letter suffixes preserved
  { hour: 22, minutes: [6, 14, 21, 34, 36, 51, 54] }, // All suffixes preserved
];
// Nymånegatan - Mölndal Schedule
const weekdayScheduleNymRev = [
  { hour: 0, minutes: [18, 38, 58] },
  { hour: 1, minutes: [14, 33, 51] },
  { hour: 4, minutes: [36, 56] },
  { hour: 5, minutes: [11, 21, 39, 55] },
  { hour: 6, minutes: [12, 26, 43, 57] },
  { hour: 7, minutes: [7, 19, 30, 42, 54] },
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
  { hour: 19, minutes: [7, 19, 31, 41, 53] },
  { hour: 20, minutes: [7, 21, 36, 51] },
  { hour: 21, minutes: [6, 21, 37, 57] },
  { hour: 22, minutes: [18, 38, 58] },
  { hour: 23, minutes: [18, 38, 58] },
];

// Saturday schedule
const saturdayScheduleRev = [
  { hour: 8, minutes: [11, 31, 50] },
  { hour: 9, minutes: [9, 24, 39, 54] },
  { hour: 10, minutes: [9, 24, 37, 48] },
  { hour: 11, minutes: [0, 12, 22, 32, 42, 52] },
  { hour: 12, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 13, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 14, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 15, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 16, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 17, minutes: [2, 12, 22, 34, 47, 59] },
  { hour: 18, minutes: [11, 23, 35, 48] },
  { hour: 19, minutes: [3, 18, 33, 48] },
  { hour: 20, minutes: [3, 18, 33, 48] },
  { hour: 21, minutes: [3, 18, 34, 50] },
  { hour: 22, minutes: [6, 21, 36, 51] },
];
const saturdayScheduleNymRev = [
  { hour: 0, minutes: [18, 38, 58] },
  { hour: 1, minutes: [14, 33, 51] },
  { hour: 5, minutes: [36] },
  { hour: 6, minutes: [10, 40] },
  { hour: 7, minutes: [10, 41] },
  { hour: 8, minutes: [14, 32, 52] },
  { hour: 9, minutes: [12, 33, 52] },
  { hour: 10, minutes: [12, 32, 48] },
  { hour: 11, minutes: [3, 18, 33, 48] },
  { hour: 12, minutes: [3, 18, 33, 48] },
  { hour: 13, minutes: [3, 18, 33, 48] },
  { hour: 14, minutes: [3, 18, 33, 48] },
  { hour: 15, minutes: [3, 18, 33, 48] },
  { hour: 16, minutes: [3, 18, 33, 48] },
  { hour: 17, minutes: [3, 18, 33, 48] },
  { hour: 18, minutes: [3, 18, 33, 48] },
  { hour: 19, minutes: [3, 18, 33, 48] },
  { hour: 20, minutes: [3, 18, 33, 48] },
  { hour: 21, minutes: [3, 18, 33, 48] },
  { hour: 22, minutes: [4, 19, 34, 49] },
  { hour: 23, minutes: [4, 19, 37, 52] },
];

// Sunday schedule (original order)
const sundayScheduleRev = [
  { hour: 8, minutes: [11, 31, 51] },
  { hour: 9, minutes: [11, 31, 51] },
  { hour: 10, minutes: [11, 31, 47] },
  { hour: 11, minutes: [0, 12, 24, 36, 48] },
  { hour: 12, minutes: [0, 12, 24, 36, 48] },
  { hour: 13, minutes: [0, 12, 24, 36, 48] },
  { hour: 14, minutes: [0, 12, 24, 36, 48] },
  { hour: 15, minutes: [0, 12, 24, 36, 48] },
  { hour: 16, minutes: [0, 12, 24, 36, 48] },
  { hour: 17, minutes: [0, 12, 24, 36, 48] },
  { hour: 18, minutes: [0, 12, 24, 36, 49] },
  { hour: 19, minutes: [4, 19, 34, 49] },
  { hour: 20, minutes: [5, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 35, 54] },
  { hour: 22, minutes: [14, 34, 54] },
];
const sundayScheduleNymRev = [
  { hour: 0, minutes: [8, 18, 23, 38, 39, 58, 59] },
  { hour: 1, minutes: [14, 19, 33, 39, 51, 59] },
  { hour: 2, minutes: [19, 39, 59] },
  { hour: 3, minutes: [19, 39, 58] },
  { hour: 4, minutes: [17] },
  { hour: 5, minutes: [36] },
  { hour: 6, minutes: [10, 40] },
  { hour: 7, minutes: [10, 41] },
  { hour: 8, minutes: [14, 32, 52] },
  { hour: 9, minutes: [12, 33, 52] },
  { hour: 10, minutes: [12, 32, 48] },
  { hour: 11, minutes: [3, 18, 33, 48] },
  { hour: 12, minutes: [3, 18, 33, 48] },
  { hour: 13, minutes: [3, 18, 33, 48] },
  { hour: 14, minutes: [3, 18, 33, 48] },
  { hour: 15, minutes: [3, 18, 33, 48] },
  { hour: 16, minutes: [3, 18, 33, 48] },
  { hour: 18, minutes: [3, 18, 33, 48] },
  { hour: 19, minutes: [3, 18, 33, 48] },
  { hour: 20, minutes: [3, 18, 33, 48] },
  { hour: 21, minutes: [3, 18, 38, 58] },
  { hour: 22, minutes: [18, 38, 58] },
  { hour: 23, minutes: [18, 38, 58] },
];

async function seedLine4() {
  await seedTripTemplates({
    tramLineNumber: 4,
    startStopName: "Angered Centrum",
    endStopName: "Mölndals Innerstad",
    heading: "Mölndal",
    tripDurationMinutes: 41, // Adjust based on actual travel time
    weekdaySchedule,
    saturdaySchedule,
    sundaySchedule,
  });
}
async function seedLine4Rev() {
  await seedTripTemplates({
    tramLineNumber: 4,
    startStopName: "Mölndals Innerstad",
    endStopName: "Angered Centrum",
    heading: "Angered",
    tripDurationMinutes: 42,
    weekdaySchedule: weekdayScheduleRev,
    saturdaySchedule: saturdayScheduleRev,
    sundaySchedule: sundayScheduleRev,
  });
}
async function seedLine4Nym() {
  await seedTripTemplates({
    tramLineNumber: 4,
    startStopName: "Mölndals Innerstad",
    endStopName: "Nymånegatan",
    heading: "Nymånegatan",
    tripDurationMinutes: 34, // Adjust based on actual travel time
    weekdaySchedule: weekdayScheduleNym,
    saturdaySchedule: saturdayScheduleNym,
    sundaySchedule: sundayScheduleNym,
  });
}
async function seedLine4NymRev() {
  await seedTripTemplates({
    tramLineNumber: 4,
    startStopName: "Nymånegatan",
    endStopName: "Mölndals Innerstad",
    heading: "Mölndal",
    tripDurationMinutes: 31,
    weekdaySchedule: weekdayScheduleNymRev,
    saturdaySchedule: saturdayScheduleNymRev,
    sundaySchedule: sundayScheduleNymRev,
  });
}
async function main() {
  try {
    await seedLine4();
    await seedLine4Rev();
    console.log("Tram Line 4 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 4:", error);
    process.exit(1);
  }
}
async function mainNym() {
  try {
    await seedLine4Nym();
    await seedLine4NymRev();
    console.log("Tram Line 4 Nymånegatan trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 4 Nymånegatan:", error);
    process.exit(1);
  }
}
mainNym();

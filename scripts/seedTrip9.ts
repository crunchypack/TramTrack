import { seedTripTemplates } from "./tripSeeder";
// Angered - Kungsten Schedule
// Weekday Schedule
const weekdaySchedule = [
  { hour: 5, minutes: [26, 41, 57] },
  { hour: 6, minutes: [13, 29, 42, 53] },
  { hour: 7, minutes: [4, 15, 27, 36, 44, 53] },
  { hour: 8, minutes: [2, 11, 20, 27, 37, 46, 57] },
  { hour: 9, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 10, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 11, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 12, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 13, minutes: [6, 17, 28, 38, 48, 58] },
  { hour: 14, minutes: [8, 18, 28, 38, 48, 58] },
  { hour: 15, minutes: [8, 18, 26, 34, 42, 49, 58] },
  { hour: 16, minutes: [6, 14, 22, 30, 38, 46, 53] },
  { hour: 17, minutes: [2, 10, 19, 27, 35, 44, 53] },
  { hour: 18, minutes: [5, 14, 25, 37, 50] },
  { hour: 19, minutes: [1, 13, 25, 38, 50] },
  { hour: 20, minutes: [2, 14, 26, 37, 49] },
  { hour: 21, minutes: [4, 19, 34, 36, 49, 58] },
  { hour: 22, minutes: [4, 18, 19, 34, 38, 49, 58] },
  { hour: 23, minutes: [4, 18, 19] },
];
// Saltholmen - Nymånegatan Schedule
// Weekday Schedule
const weekdayScheduleNym = [
  { hour: 9, minutes: [0, 12, 24, 36, 48] },
  { hour: 10, minutes: [0, 12, 24, 36, 47, 59] },
  { hour: 11, minutes: [11, 23, 35, 47, 59] },
  { hour: 12, minutes: [11, 23, 35, 47, 59] },
  { hour: 13, minutes: [11, 23, 35, 47, 59] },
  { hour: 14, minutes: [11, 23, 35, 47, 59] },
  { hour: 15, minutes: [11, 23, 35, 47, 59] },
  { hour: 16, minutes: [11, 23, 35, 47, 59] },
  { hour: 17, minutes: [11, 23, 35, 48] },
  { hour: 18, minutes: [0, 12, 24, 36, 48] },
  { hour: 19, minutes: [0, 12, 24, 36, 50] },
];

const weekdayKungstenSummer = [
  { hour: 5, minutes: [7, 26, 41] },
  { hour: 6, minutes: [7, 22, 37, 52] },
  { hour: 7, minutes: [7, 22, 34, 46, 58] },
  { hour: 8, minutes: [10, 22, 34, 46, 58] },
  { hour: 20, minutes: [42, 57] },
  { hour: 21, minutes: [12, 29, 45] },
  { hour: 22, minutes: [5, 25, 45] },
  { hour: 23, minutes: [5, 25, 45] },
];

// Saturday Schedule
const saturdaySchedule = [
  { hour: 6, minutes: [16, 46] },
  { hour: 7, minutes: [16, 46] },
  { hour: 8, minutes: [19, 53] },
  { hour: 9, minutes: [13, 33, 53] },
  { hour: 10, minutes: [10, 27, 51] },
  { hour: 11, minutes: [7, 20, 30, 40, 50] },
  { hour: 12, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 13, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 14, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 15, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 16, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 17, minutes: [0, 10, 20, 33, 46, 58] },
  { hour: 18, minutes: [11, 23, 35, 48] },
  { hour: 19, minutes: [3, 18, 33, 48] },
  { hour: 20, minutes: [3, 18, 33, 48] },
  { hour: 21, minutes: [4, 19, 34, 49] },
  { hour: 22, minutes: [4, 19, 34, 49] },
  { hour: 23, minutes: [4, 19] },
];
const saturdayScheduleNym = [
  { hour: 9, minutes: [12, 32, 50] },
  { hour: 10, minutes: [6, 21, 35, 50] },
  { hour: 11, minutes: [5, 20, 35, 50] },
  { hour: 12, minutes: [5, 20, 35, 50] },
  { hour: 13, minutes: [5, 20, 35, 50] },
  { hour: 14, minutes: [5, 20, 35, 50] },
  { hour: 15, minutes: [5, 20, 35, 50] },
  { hour: 16, minutes: [5, 20, 35, 50] },
  { hour: 17, minutes: [5, 20, 35, 50] },
  { hour: 18, minutes: [5, 20, 36, 51] },
  { hour: 19, minutes: [6, 21, 36, 51] },
  { hour: 20, minutes: [1] },
];
const saturdayKungstenSummer = [
  { hour: 5, minutes: [27, 57] },
  { hour: 6, minutes: [31] },
  { hour: 7, minutes: [2, 32] },
  { hour: 8, minutes: [2, 32] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 29, 44, 59] },
  { hour: 22, minutes: [14, 29, 42, 57] },
  { hour: 23, minutes: [12, 27, 42, 49] },
];
// Sunday Schedule
const sundaySchedule = [
  { hour: 6, minutes: [16, 46] },
  { hour: 7, minutes: [16, 46] },
  { hour: 8, minutes: [19, 53] },
  { hour: 9, minutes: [13, 33, 53] },
  { hour: 10, minutes: [15, 35, 50] },
  { hour: 11, minutes: [3, 17, 29, 41, 53] },
  { hour: 12, minutes: [5, 18, 30, 42, 54] },
  { hour: 13, minutes: [6, 18, 30, 42, 54] },
  { hour: 14, minutes: [6, 18, 30, 42, 54] },
  { hour: 15, minutes: [6, 18, 30, 42, 54] },
  { hour: 16, minutes: [6, 18, 30, 42, 54] },
  { hour: 17, minutes: [6, 18, 30, 42, 54] },
  { hour: 18, minutes: [6, 19, 31, 45] },
  { hour: 19, minutes: [0, 15, 30, 45] },
  { hour: 20, minutes: [0, 15, 30, 46] },
  { hour: 21, minutes: [1, 16, 33, 57] },
  { hour: 22, minutes: [16, 36, 58] },
  { hour: 23, minutes: [18] },
];
const sundayScheduleNym = [
  { hour: 9, minutes: [12, 32, 50] },
  { hour: 10, minutes: [6, 21, 35, 50] },
  { hour: 11, minutes: [5, 20, 35, 50] },
  { hour: 12, minutes: [5, 20, 35, 50] },
  { hour: 13, minutes: [5, 20, 35, 50] },
  { hour: 14, minutes: [5, 20, 35, 50] },
  { hour: 15, minutes: [5, 20, 35, 50] },
  { hour: 16, minutes: [5, 20, 35, 50] },
  { hour: 17, minutes: [5, 20, 35, 50] },
  { hour: 18, minutes: [5, 20, 36, 51] },
  { hour: 19, minutes: [6, 21, 36, 51] },
  { hour: 20, minutes: [1] },
];
const sundayKungstenSummer = [
  { hour: 0, minutes: [4] },
  { hour: 5, minutes: [27, 57] },
  { hour: 6, minutes: [31] },
  { hour: 7, minutes: [2, 32] },
  { hour: 8, minutes: [2, 32] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 29, 44] },
  { hour: 22, minutes: [4, 24, 44] },
  { hour: 23, minutes: [4, 24, 44] },
];
// Kungsten - Angered
// Weekday Schedule
const weekdayScheduleRev = [
  { hour: 5, minutes: [7, 26, 41] },
  { hour: 6, minutes: [6, 17, 30, 40, 53] },
  { hour: 7, minutes: [0, 5, 13, 21, 30, 38, 47, 56] }, // Removed 'e' suffix
  { hour: 8, minutes: [16, 26, 36, 45, 57] },
  { hour: 9, minutes: [6, 17, 27, 37, 46, 57] },
  { hour: 10, minutes: [7, 17, 26, 37, 47, 56] },
  { hour: 11, minutes: [5, 16, 26, 36, 45, 56] },
  { hour: 12, minutes: [6, 16, 25, 36, 46, 56] },
  { hour: 13, minutes: [5, 16, 26, 36, 45, 55] },
  { hour: 14, minutes: [5, 13, 23, 32, 40, 49] },
  { hour: 15, minutes: [0, 6, 14, 22, 31, 38, 46, 54] },
  { hour: 16, minutes: [2, 10, 18, 26, 34, 42, 51, 59] },
  { hour: 17, minutes: [7, 15, 23, 31, 40, 51] },
  { hour: 18, minutes: [0, 10, 21, 31, 42, 54] },
  { hour: 19, minutes: [8, 21, 33, 45, 57] },
  { hour: 20, minutes: [10, 26, 42, 57] },
  { hour: 21, minutes: [12, 27, 44, 59] }, // Removed 'c' suffix
  { hour: 22, minutes: [4, 14, 24, 29, 44, 59] }, // Removed letter suffixes and kept duplicates
  { hour: 23, minutes: [4, 14, 24, 29, 44] }, // Removed letter suffixes
];
// Nymånegatan - Saltholmen Schedule
const weekdayScheduleNymRev = [
  { hour: 5, minutes: [32, 47] },
  { hour: 6, minutes: [1, 17, 32, 48] },
  { hour: 7, minutes: [2, 14, 26, 38, 51] },
  { hour: 8, minutes: [2, 14, 26, 38, 50] },
  { hour: 9, minutes: [2, 14, 26, 38, 50] },
  { hour: 10, minutes: [2, 14, 26, 38, 50] },
  { hour: 11, minutes: [2, 14, 26, 38, 50] },
  { hour: 12, minutes: [2, 14, 26, 38, 50] },
  { hour: 13, minutes: [2, 14, 26, 38, 50] },
  { hour: 14, minutes: [2, 14, 26, 38, 50] },
  { hour: 15, minutes: [2, 14, 26, 38, 50] },
  { hour: 16, minutes: [2, 14, 26, 38, 50] },
  { hour: 17, minutes: [2, 14, 26, 38, 50] },
  { hour: 18, minutes: [2, 14, 26, 39, 50] },
  { hour: 19, minutes: [2, 13, 26, 44, 58] },
  { hour: 20, minutes: [10, 26, 41, 56] },
  { hour: 21, minutes: [11, 26, 46] },
  { hour: 22, minutes: [6, 26, 46] },
  { hour: 23, minutes: [6, 26] },
];

// Saturday Schedule
const saturdayScheduleRev = [
  { hour: 5, minutes: [27, 57] },
  { hour: 6, minutes: [32] },
  { hour: 7, minutes: [2, 32] },
  { hour: 8, minutes: [2, 32] },
  { hour: 9, minutes: [18, 41] },
  { hour: 10, minutes: [1, 30, 41] },
  { hour: 11, minutes: [4, 15, 35, 45, 55] },
  { hour: 12, minutes: [5, 15, 25, 35, 45, 55] },
  { hour: 13, minutes: [5, 15, 25, 35, 45, 55] },
  { hour: 14, minutes: [5, 15, 25, 35, 45, 55] },
  { hour: 15, minutes: [5, 15, 25, 35, 45, 55] },
  { hour: 16, minutes: [5, 15, 25, 35, 45, 55] },
  { hour: 17, minutes: [5, 15, 26, 39, 51] },
  { hour: 18, minutes: [3, 15, 27, 39, 55] },
  { hour: 19, minutes: [10, 25, 40, 55] },
  { hour: 20, minutes: [10, 25, 40, 55] },
  { hour: 21, minutes: [10, 26, 44, 59] },
  { hour: 22, minutes: [14, 29, 44, 59] }, // Removed 'f' suffix
  { hour: 23, minutes: [14, 29, 44] }, // Removed letter suffixes
];
const saturdayScheduleNymRev = [
  { hour: 6, minutes: [22, 51] },
  { hour: 7, minutes: [22, 52] },
  { hour: 8, minutes: [24, 59] },
  { hour: 9, minutes: [22, 42] },
  { hour: 10, minutes: [2, 21, 35, 51] },
  { hour: 11, minutes: [6, 21, 36, 51] },
  { hour: 12, minutes: [6, 21, 36, 51] },
  { hour: 13, minutes: [6, 21, 36, 51] },
  { hour: 14, minutes: [6, 21, 36, 51] },
  { hour: 15, minutes: [6, 21, 36, 51] },
  { hour: 16, minutes: [6, 21, 36, 51] },
  { hour: 17, minutes: [6, 21, 36, 51] },
  { hour: 18, minutes: [6, 21, 36, 51] },
  { hour: 19, minutes: [6, 24, 39, 54] },
  { hour: 20, minutes: [9, 24, 39, 54] },
  { hour: 21, minutes: [9, 24, 39, 54] },
  { hour: 22, minutes: [9, 24, 39, 54] },
  { hour: 23, minutes: [9, 24] },
];

// Sunday Schedule
const sundayScheduleRev = [
  { hour: 5, minutes: [27, 57] },
  { hour: 6, minutes: [32] },
  { hour: 7, minutes: [2, 32] },
  { hour: 8, minutes: [2, 32] },
  { hour: 9, minutes: [18, 41] },
  { hour: 10, minutes: [2, 20, 39, 52] },
  { hour: 11, minutes: [6, 18, 30, 42, 54] },
  { hour: 12, minutes: [6, 18, 30, 42, 54] },
  { hour: 13, minutes: [6, 18, 30, 42, 54] },
  { hour: 14, minutes: [6, 18, 30, 42, 54] },
  { hour: 15, minutes: [6, 18, 30, 42, 54] },
  { hour: 16, minutes: [6, 18, 30, 42, 54] },
  { hour: 17, minutes: [6, 18, 30, 42, 55] },
  { hour: 18, minutes: [7, 19, 31, 43, 57] },
  { hour: 19, minutes: [11, 26, 41, 56] },
  { hour: 20, minutes: [11, 26, 42, 57] },
  { hour: 21, minutes: [12, 27, 44] },
  { hour: 22, minutes: [4, 24, 44] }, // Removed 'f' suffix
  { hour: 23, minutes: [4, 24, 44] }, // Removed letter suffixes
];
const sundayScheduleNymRev = [
  { hour: 6, minutes: [22, 51] },
  { hour: 7, minutes: [22, 52] },
  { hour: 8, minutes: [24, 59] },
  { hour: 9, minutes: [22, 42] },
  { hour: 10, minutes: [2, 21, 35, 51] },
  { hour: 11, minutes: [6, 21, 36, 51] },
  { hour: 12, minutes: [6, 21, 36, 51] },
  { hour: 13, minutes: [6, 21, 36, 51] },
  { hour: 14, minutes: [6, 21, 36, 51] },
  { hour: 15, minutes: [6, 21, 36, 51] },
  { hour: 16, minutes: [6, 21, 36, 51] },
  { hour: 17, minutes: [6, 21, 36, 51] },
  { hour: 18, minutes: [6, 21, 36, 51] },
  { hour: 19, minutes: [6, 24, 39, 54] },
  { hour: 20, minutes: [9, 24, 39, 54] },
  { hour: 21, minutes: [9, 24, 41] },
  { hour: 22, minutes: [3, 23, 43] },
  { hour: 23, minutes: [4, 24] },
];
// Seed the trip templates with the schedules
async function seedLine() {
  await seedTripTemplates({
    tramLineNumber: 9,
    startStopName: "Angered Centrum",
    endStopName: "Kungssten",
    heading: "Kungssten",
    tripDurationMinutes: 42, // Adjust based on actual travel time
    weekdaySchedule,
    saturdaySchedule,
    sundaySchedule,
    season: "standard",
  });
}
async function seedLineRev() {
  await seedTripTemplates({
    tramLineNumber: 9,
    startStopName: "Kungssten",
    endStopName: "Angered Centrum",
    heading: "Angered",
    tripDurationMinutes: 41, // Adjust based on actual travel time
    weekdaySchedule: weekdayScheduleRev,
    saturdaySchedule: saturdayScheduleRev,
    sundaySchedule: sundayScheduleRev,
    season: "standard",
  });
}
async function seedLineNym() {
  await seedTripTemplates({
    tramLineNumber: 109,
    startStopName: "Saltholmen",
    endStopName: "Nymånegatan",
    heading: "Nymånegatan",
    tripDurationMinutes: 46, // Adjust based on actual travel time
    weekdaySchedule: weekdayScheduleNym,
    saturdaySchedule: saturdayScheduleNym,
    sundaySchedule: sundayScheduleNym,
    season: "summer",
  });
  await seedTripTemplates({
    tramLineNumber: 109,
    startStopName: "Kungssten",
    endStopName: "Nymånegatan",
    heading: "Nymånegatan",
    tripDurationMinutes: 38, // Adjust based on actual travel time
    weekdaySchedule: weekdayKungstenSummer,
    saturdaySchedule: saturdayKungstenSummer,
    sundaySchedule: sundayKungstenSummer,
    season: "summer",
  });
}
const seedLineNymRev = async () => {
  await seedTripTemplates({
    tramLineNumber: 109,
    startStopName: "Nymånegatan",
    endStopName: "Saltholmen",
    heading: "Saltholmen",
    tripDurationMinutes: 44, // Adjust based on actual travel time
    weekdaySchedule: weekdayScheduleNymRev,
    saturdaySchedule: saturdayScheduleNymRev,
    sundaySchedule: sundayScheduleNymRev,
    season: "summer",
  });
};
async function main() {
  try {
    await seedLine();
    await seedLineRev();
    console.log("Tram Line 9 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 9:", error);
    process.exit(1);
  }
}
async function mainNym() {
  try {
    await seedLineNym();
    await seedLineNymRev();
    console.log("Tram Line 109 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 109:", error);
    process.exit(1);
  }
}
mainNym();

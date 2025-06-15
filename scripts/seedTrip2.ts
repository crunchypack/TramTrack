import { seedTripTemplates } from "./tripSeeder";
// Axel Dahlströms Torg - Mölndals Innerstad Schedule
const weekdaySchedule = [
  { hour: 5, minutes: [43, 57] },
  { hour: 6, minutes: [11, 26, 40, 48, 57] },
  { hour: 7, minutes: [4, 15, 26, 35, 44, 54] },
  { hour: 8, minutes: [3, 12, 23, 35, 45, 55] },
  { hour: 9, minutes: [5, 17, 27, 36, 46, 57] },
  { hour: 10, minutes: [7, 17, 26, 37, 47, 57] },
  { hour: 11, minutes: [6, 17, 27, 37, 46, 57] },
  { hour: 12, minutes: [7, 17, 26, 37, 47, 57] },
  { hour: 13, minutes: [6, 15, 25, 35, 46, 54] },
  { hour: 14, minutes: [4, 11, 19, 29, 38, 47, 56] },
  { hour: 15, minutes: [4, 12, 20, 28, 35, 44, 52] },
  { hour: 16, minutes: [0, 8, 16, 24, 32, 40, 48, 55] },
  { hour: 17, minutes: [4, 12, 19, 27, 35, 46, 56] },
  { hour: 18, minutes: [6, 17, 28, 40, 52] },
  { hour: 19, minutes: [4, 16, 28, 40, 52] },
  { hour: 20, minutes: [4, 16, 28, 41, 56] },
];
const weekdayScheduleSummer16 = [
  { hour: 5, minutes: [43, 59] },
  { hour: 6, minutes: [13, 28, 43, 56] },
  { hour: 7, minutes: [8, 20, 32, 44, 56] },
  { hour: 8, minutes: [8, 20, 32, 44, 56] },
  { hour: 9, minutes: [8, 20, 32, 44, 56] },
  { hour: 10, minutes: [8, 20, 32, 44, 56] },
  { hour: 11, minutes: [8, 20, 32, 44, 56] },
  { hour: 12, minutes: [8, 20, 32, 44, 56] },
  { hour: 13, minutes: [8, 20, 32, 44, 55] },
  { hour: 14, minutes: [7, 19, 31, 43, 55] },
  { hour: 15, minutes: [7, 19, 31, 43, 55] },
  { hour: 16, minutes: [7, 19, 31, 43, 55] },
  { hour: 17, minutes: [7, 19, 31, 43, 56] },
  { hour: 18, minutes: [8, 20, 32, 44, 56] },
  { hour: 19, minutes: [8, 20, 32, 44, 56] },
  { hour: 20, minutes: [9, 23, 38, 53] },
  { hour: 21, minutes: [8, 23] },
];

const saturdaySchedule = [
  { hour: 6, minutes: [52] },
  { hour: 7, minutes: [22, 52] },
  { hour: 8, minutes: [22, 54] },
  { hour: 9, minutes: [18, 37, 55] },
  { hour: 10, minutes: [14, 31, 53] },
  { hour: 11, minutes: [8, 24, 34, 44, 54] },
  { hour: 12, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 13, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 14, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 15, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 16, minutes: [4, 14, 24, 34, 44, 54] },
  { hour: 17, minutes: [4, 14, 24, 36, 48] },
  { hour: 18, minutes: [0, 12, 24, 37, 53] },
  { hour: 19, minutes: [8, 23, 38, 53] },
  { hour: 20, minutes: [8, 23, 38, 53] },
  { hour: 21, minutes: [8, 23, 41, 56] },
];
const saturdayScheduleSummer16 = [
  { hour: 6, minutes: [52] },
  { hour: 7, minutes: [22, 52] },
  { hour: 8, minutes: [22, 55] },
  { hour: 9, minutes: [19, 39, 58] },
  { hour: 10, minutes: [19, 36, 51] },
  { hour: 11, minutes: [6, 21, 36, 51] },
  { hour: 12, minutes: [6, 21, 36, 51] },
  { hour: 13, minutes: [6, 21, 36, 51] },
  { hour: 14, minutes: [6, 21, 36, 51] },
  { hour: 15, minutes: [6, 21, 36, 51] },
  { hour: 16, minutes: [6, 21, 36, 51] },
  { hour: 17, minutes: [6, 21, 36, 51] },
  { hour: 18, minutes: [6, 21, 36, 51] },
  { hour: 19, minutes: [6, 21, 36, 51] },
  { hour: 20, minutes: [6, 21, 36, 51] },
  { hour: 21, minutes: [6, 21, 37, 53] },
  { hour: 22, minutes: [8, 23, 38, 53] },
  { hour: 23, minutes: [10, 25, 45] },
];
const sundaySchedule = [
  { hour: 6, minutes: [52] },
  { hour: 7, minutes: [22, 52] },
  { hour: 8, minutes: [22, 54] },
  { hour: 9, minutes: [17, 37, 57] },
  { hour: 10, minutes: [17, 37, 57] },
  { hour: 11, minutes: [15, 28, 40, 52] },
  { hour: 12, minutes: [4, 16, 28, 40, 52] },
  { hour: 13, minutes: [4, 16, 28, 40, 52] },
  { hour: 14, minutes: [4, 16, 28, 40, 52] },
  { hour: 15, minutes: [4, 16, 28, 40, 52] },
  { hour: 16, minutes: [4, 16, 28, 40, 52] },
  { hour: 17, minutes: [4, 16, 28, 40, 52] },
  { hour: 18, minutes: [5, 17, 29, 43, 58] },
  { hour: 19, minutes: [13, 28, 43, 58] },
  { hour: 20, minutes: [13, 28, 42, 57] },
  { hour: 21, minutes: [12, 27] },
];
const sundayScheduleSummer16 = [
  { hour: 6, minutes: [52] },
  { hour: 7, minutes: [22, 52] },
  { hour: 8, minutes: [22, 55] },
  { hour: 9, minutes: [19, 39, 58] },
  { hour: 10, minutes: [19, 36, 51] },
  { hour: 11, minutes: [6, 21, 36, 51] },
  { hour: 12, minutes: [6, 21, 36, 51] },
  { hour: 13, minutes: [6, 21, 36, 51] },
  { hour: 14, minutes: [6, 21, 36, 51] },
  { hour: 15, minutes: [6, 21, 36, 51] },
  { hour: 16, minutes: [6, 21, 36, 51] },
  { hour: 17, minutes: [6, 21, 36, 51] },
  { hour: 18, minutes: [6, 21, 36, 51] },
  { hour: 19, minutes: [6, 21, 36, 51] },
  { hour: 20, minutes: [6, 21, 36, 51] },
  { hour: 21, minutes: [6, 22] },
];
// Mölndals Innerstad - Axel Dahlströms Torg Schedule (Reverse Direction)
const weekdayScheduleRev = [
  { hour: 6, minutes: [16, 30, 45, 55] },
  { hour: 7, minutes: [4, 12, 22, 30, 40, 48, 52, 58] },
  { hour: 8, minutes: [7, 18, 29, 39, 48, 59] },
  { hour: 9, minutes: [9, 19, 28, 37, 49, 59] },
  { hour: 10, minutes: [8, 20, 29, 39, 48] },
  { hour: 11, minutes: [0, 9, 19, 28, 40, 51, 59] },
  { hour: 12, minutes: [9, 20, 29, 39, 48] },
  { hour: 13, minutes: [0, 9, 19, 29, 41, 50, 58] },
  { hour: 14, minutes: [7, 16, 24, 32, 42, 50] },
  { hour: 15, minutes: [0, 9, 17, 25, 33, 42, 51, 58] },
  { hour: 16, minutes: [6, 14, 22, 30, 38, 46, 54] },
  { hour: 17, minutes: [2, 11, 19, 27, 36, 45, 53] },
  { hour: 18, minutes: [2, 11, 22, 35, 45, 58] },
  { hour: 19, minutes: [10, 22, 34, 46, 58] },
  { hour: 20, minutes: [11, 26, 41, 56] },
  { hour: 21, minutes: [11, 26, 41, 45, 57] },
  { hour: 22, minutes: [5, 12, 25, 27, 42, 44, 57] },
  { hour: 23, minutes: [4, 12, 24, 29, 47, 49] },
];
const weekdayScheduleSummer16Rev = [
  // Early morning hours (descending)
  { hour: 6, minutes: [25, 37, 49] },
  { hour: 7, minutes: [3, 14, 26, 38, 50] },
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
  { hour: 18, minutes: [2, 14, 26, 38, 50] },
  { hour: 19, minutes: [2, 14, 28, 42, 57] },
  { hour: 20, minutes: [12, 27, 42, 58] },
  { hour: 21, minutes: [13, 27, 45] },
  { hour: 22, minutes: [5, 25, 45] },
  { hour: 23, minutes: [5, 25, 45] },
];
const saturdayScheduleRev = [
  { hour: 6, minutes: [35] },
  { hour: 7, minutes: [5, 35] },
  { hour: 8, minutes: [6, 36] },
  { hour: 9, minutes: [1, 19, 42] },
  { hour: 10, minutes: [1, 20, 40, 54] },
  { hour: 11, minutes: [6, 20, 37, 47, 57] },
  { hour: 12, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 13, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 14, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 15, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 16, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 17, minutes: [7, 17, 29, 41, 53] },
  { hour: 18, minutes: [5, 17, 29, 41, 55] },
  { hour: 19, minutes: [10, 25, 40, 56] },
  { hour: 20, minutes: [11, 26, 41, 56] },
  { hour: 21, minutes: [11, 26, 42, 57] },
  { hour: 22, minutes: [12, 27, 42, 57] },
  { hour: 23, minutes: [12, 29, 50] },
];
const saturdayScheduleSummer16Rev = [
  // First block
  { hour: 6, minutes: [35] },
  { hour: 7, minutes: [5, 35] },
  { hour: 8, minutes: [6, 35] },
  { hour: 9, minutes: [3, 23, 43] },
  { hour: 10, minutes: [3, 23, 43, 58] },
  { hour: 11, minutes: [13, 28, 43, 58] },
  { hour: 12, minutes: [13, 28, 43, 58] },
  { hour: 13, minutes: [13, 28, 43, 58] },
  { hour: 14, minutes: [13, 28, 43, 58] },
  { hour: 15, minutes: [13, 28, 43, 58] },
  { hour: 16, minutes: [13, 28, 43, 58] },
  { hour: 17, minutes: [13, 28, 43, 58] },
  { hour: 18, minutes: [13, 28, 43, 58] },
  { hour: 19, minutes: [13, 28, 43, 58] },
  { hour: 20, minutes: [13, 38, 43, 58] },
  { hour: 21, minutes: [13, 28, 43, 58] },
  { hour: 22, minutes: [13, 28, 43, 58] },
  { hour: 23, minutes: [13, 29, 50] },
];
const sundayScheduleRev = [
  { hour: 6, minutes: [36] },
  { hour: 7, minutes: [6, 36] },
  { hour: 8, minutes: [6, 36] },
  { hour: 9, minutes: [1, 19, 42] },
  { hour: 10, minutes: [2, 22, 42] },
  { hour: 11, minutes: [1, 21, 40, 54] },
  { hour: 12, minutes: [6, 18, 30, 42, 54] },
  { hour: 13, minutes: [6, 18, 30, 42, 54] },
  { hour: 14, minutes: [6, 18, 30, 42, 54] },
  { hour: 15, minutes: [6, 18, 30, 42, 54] },
  { hour: 16, minutes: [6, 18, 30, 42, 54] },
  { hour: 17, minutes: [6, 18, 30, 42, 54] },
  { hour: 18, minutes: [6, 18, 30, 42, 56] },
  { hour: 19, minutes: [11, 26, 41, 56] },
  { hour: 20, minutes: [11, 26, 41, 56] },
  { hour: 21, minutes: [11, 26, 45] },
  { hour: 22, minutes: [5, 25, 44] },
  { hour: 23, minutes: [4, 24, 47] },
];
const sundayScheduleSummer16Rev = [
  { hour: 0, minutes: [10] },
  { hour: 6, minutes: [35] },
  { hour: 7, minutes: [5, 35] },
  { hour: 8, minutes: [6, 35] },
  { hour: 9, minutes: [3, 23, 43] },
  { hour: 10, minutes: [3, 23, 43, 58] },
  { hour: 11, minutes: [13, 28, 43, 58] },
  { hour: 12, minutes: [13, 28, 43, 58] },
  { hour: 13, minutes: [13, 28, 43, 58] },
  { hour: 14, minutes: [13, 28, 43, 58] },
  { hour: 15, minutes: [13, 28, 43, 58] },
  { hour: 16, minutes: [13, 28, 43, 58] },
  { hour: 17, minutes: [13, 28, 43, 58] },
  { hour: 18, minutes: [13, 28, 43, 58] },
  { hour: 19, minutes: [13, 28, 43, 58] },
  { hour: 20, minutes: [13, 28, 43, 57] },
  { hour: 21, minutes: [11, 26, 45] },
  { hour: 22, minutes: [5, 25, 44] },
  { hour: 23, minutes: [4, 24, 47] },
];
/**
 *
 */
async function seedLine2() {
  await seedTripTemplates({
    tramLineNumber: 2,
    startStopName: "Axel Dahlströms Torg",
    endStopName: "Mölndals Innerstad",
    heading: "Mölndal",
    tripDurationMinutes: 41,
    weekdaySchedule,
    saturdaySchedule,
    sundaySchedule,
    season: "standard",
  });
}
async function seedLine2Summer() {
  await seedTripTemplates({
    tramLineNumber: 2,
    startStopName: "Axel Dahlströms Torg",
    endStopName: "Mölndals Innerstad",
    heading: "Mölndal",
    tripDurationMinutes: 41,
    weekdaySchedule: weekdayScheduleSummer16,
    saturdaySchedule: saturdayScheduleSummer16,
    sundaySchedule: sundayScheduleSummer16,
    season: "summer",
  });
}

async function seedLine2Rev() {
  await seedTripTemplates({
    tramLineNumber: 2,
    startStopName: "Mölndals Innerstad",
    endStopName: "Axel Dahlströms Torg",
    heading: "Högsbotorp",
    tripDurationMinutes: 36,
    weekdaySchedule: weekdayScheduleRev,
    saturdaySchedule: saturdayScheduleRev,
    sundaySchedule: sundayScheduleRev,
    season: "standard",
  });
}
async function seedLine2RevSummer() {
  await seedTripTemplates({
    tramLineNumber: 2,
    startStopName: "Mölndals Innerstad",
    endStopName: "Axel Dahlströms Torg",
    heading: "Högsbotorp",
    tripDurationMinutes: 36,
    weekdaySchedule: weekdayScheduleSummer16Rev,
    saturdaySchedule: saturdayScheduleSummer16Rev,
    sundaySchedule: sundayScheduleSummer16Rev,
    season: "summer",
  });
}
async function main() {
  try {
    await seedLine2();
    await seedLine2Rev();
    console.log("✅ Line 2 seeded in both directions.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed Line 2:", err);
    process.exit(1);
  }
}
async function mainSummer() {
  try {
    await seedLine2Summer();
    await seedLine2RevSummer();
    console.log("✅ Line 2 Summer schedule seeded in both directions.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed Line 2 Summer:", err);
    process.exit(1);
  }
}
mainSummer();

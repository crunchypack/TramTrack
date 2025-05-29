import { seedTripTemplates } from "./tripSeeder";
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
async function seedLine3() {
  try {
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
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Line 2:", error);
    process.exit(1);
  }
}
async function seedLine3Rev() {
  try {
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
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Line 2 (Reverse):", error);
    process.exit(1);
  }
}
seedLine3Rev();

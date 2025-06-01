import { seedTripTemplates } from "./tripSeeder";
// Guldheden - Väderil Schedule
const weekdaySchedule = [
  { hour: 0, minutes: [18, 43] },
  { hour: 1, minutes: [11, 43] },
  { hour: 5, minutes: [20, 40, 59] },
  { hour: 6, minutes: [14, 27, 40, 52] },
  { hour: 7, minutes: [4, 14, 24, 33, 44, 54] },
  { hour: 8, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 9, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 10, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 11, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 12, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 13, minutes: [3, 13, 23, 33, 43, 53] },
  { hour: 14, minutes: [3, 13, 22, 31, 39, 47, 57] },
  { hour: 15, minutes: [6, 14, 24, 33, 42, 51] },
  { hour: 16, minutes: [0, 9, 18, 28, 37, 45, 54] },
  { hour: 17, minutes: [4, 13, 22, 31, 41, 50, 59] },
  { hour: 18, minutes: [8, 18, 28, 38, 40, 50] },
  { hour: 19, minutes: [2, 14, 26, 38, 50] },
  { hour: 20, minutes: [2, 14, 28, 43, 58] },
  { hour: 21, minutes: [13, 28, 43, 58] },
  { hour: 22, minutes: [13, 18, 28, 38, 43, 58] },
  { hour: 23, minutes: [13, 18, 28, 38, 43, 58] },
];

// Saturday Schedule
const saturdaySchedule = [
  { hour: 0, minutes: [15, 35, 55] },
  { hour: 1, minutes: [15, 35, 55] },
  { hour: 2, minutes: [15, 35, 55] },
  { hour: 3, minutes: [15, 35, 55] },
  { hour: 5, minutes: [42] },
  { hour: 6, minutes: [12, 42] },
  { hour: 7, minutes: [12, 42] },
  { hour: 8, minutes: [2, 22, 42] },
  { hour: 9, minutes: [2, 22, 36, 50] },
  { hour: 10, minutes: [4, 18, 32, 42, 52] },
  { hour: 11, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 12, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 13, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 14, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 15, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 16, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 17, minutes: [2, 12, 22, 32, 47] },
  { hour: 18, minutes: [0, 12, 24, 36, 48, 59] },
  { hour: 19, minutes: [13, 28, 43, 58] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 28, 43, 58] },
  { hour: 22, minutes: [13, 28, 43, 58] },
  { hour: 23, minutes: [13, 28, 43, 58] },
];

// Sunday Schedule
const sundaySchedule = [
  { hour: 5, minutes: [42] },
  { hour: 6, minutes: [12, 42] },
  { hour: 7, minutes: [12, 42] },
  { hour: 8, minutes: [2, 22, 42] },
  { hour: 9, minutes: [2, 22, 42] },
  { hour: 10, minutes: [0, 17, 34, 49] },
  { hour: 11, minutes: [4, 19, 34, 47, 59] },
  { hour: 12, minutes: [11, 23, 35, 47, 59] },
  { hour: 13, minutes: [11, 23, 35, 47, 59] },
  { hour: 14, minutes: [11, 23, 35, 47, 59] },
  { hour: 15, minutes: [11, 23, 35, 47, 59] },
  { hour: 16, minutes: [11, 23, 35, 47, 59] },
  { hour: 17, minutes: [11, 23, 35, 47, 59] },
  { hour: 18, minutes: [11, 23, 34, 47, 59] },
  { hour: 19, minutes: [13, 28, 43, 58] },
  { hour: 20, minutes: [13, 28, 43, 58] },
  { hour: 21, minutes: [13, 28, 43, 58] },
  { hour: 22, minutes: [18, 38, 58] },
  { hour: 23, minutes: [18, 38, 58] },
];
//Väderil - Guldheden
const weekdayScheduleRev = [
  { hour: 6, minutes: [34, 45, 55] },
  { hour: 7, minutes: [4, 14, 24, 33, 42, 52] },
  { hour: 8, minutes: [2, 12, 22, 32, 42, 51] },
  { hour: 9, minutes: [1] },
  { hour: 13, minutes: [1] },
  { hour: 14, minutes: [7, 16, 26, 35, 45, 53] },
  { hour: 15, minutes: [1, 10, 19, 28, 37, 46, 55] },
  { hour: 16, minutes: [5, 13, 22, 31, 40, 49, 58] },
  { hour: 17, minutes: [9, 17, 25, 34, 44, 54] },
  { hour: 18, minutes: [4, 14, 24, 34, 45, 56] },
  { hour: 19, minutes: [8, 20, 32] },
];

// Saturday Schedule
const saturdayScheduleRev = [
  { hour: 10, minutes: [25, 37, 49] },
  { hour: 11, minutes: [1, 11, 21, 31, 41, 51] },
  { hour: 12, minutes: [1, 11, 21, 31, 41, 51] },
  { hour: 13, minutes: [1, 11, 21, 31, 41, 51] },
  { hour: 14, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 15, minutes: [2, 12, 22, 32, 42, 52] },
  { hour: 16, minutes: [2, 12, 22, 32, 42, 53] },
  { hour: 17, minutes: [5, 17, 29, 41, 53] },
  { hour: 18, minutes: [5, 17, 29, 40, 55] },
  { hour: 19, minutes: [10, 25] },
];

// Sunday Schedule
const sundayScheduleRev = [
  { hour: 10, minutes: [53] },
  { hour: 11, minutes: [6, 18, 30, 42, 54] },
  { hour: 12, minutes: [6, 18, 30, 42, 54] },
  { hour: 13, minutes: [6, 18, 30, 42, 54] },
  { hour: 14, minutes: [6, 18, 30, 42, 54] },
  { hour: 15, minutes: [6, 18, 30, 42, 54] },
  { hour: 16, minutes: [6, 18, 30, 42, 54] },
  { hour: 17, minutes: [6, 18, 30, 42, 54] },
  { hour: 18, minutes: [6, 19] },
];
// Seed the trip templates with the schedules
async function seedLine() {
  await seedTripTemplates({
    tramLineNumber: 10,
    startStopName: "Doktor Sydows Gata",
    endStopName: "Väderilsgatan",
    heading: "Biskopsgården",
    tripDurationMinutes: 30, // Adjust based on actual travel time
    weekdaySchedule,
    saturdaySchedule,
    sundaySchedule,
    season: "standard",
  });
}
async function seedLineRev() {
  await seedTripTemplates({
    tramLineNumber: 10,
    startStopName: "Väderilsgatan",
    endStopName: "Doktor Sydows Gata",
    heading: "Guldheden",
    tripDurationMinutes: 33, // Adjust based on actual travel time
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
    console.log("Tram Line 10 trip templates seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding line 10:", error);
    process.exit(1);
  }
}
main();

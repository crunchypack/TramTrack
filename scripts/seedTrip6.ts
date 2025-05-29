import { seedTripTemplates } from "./tripSeeder";
// Weekday Schedule
const weekdaySchedule = [
  { hour: 8, minutes: [6, 16, 26, 35, 45, 56] },
  { hour: 9, minutes: [6, 16, 26, 35, 46, 56] },
  { hour: 10, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 11, minutes: [5, 16, 26, 36, 46, 56] },
  { hour: 12, minutes: [6, 16, 26, 36, 46, 56] },
  { hour: 13, minutes: [6, 16, 26, 35, 43, 51, 59] },
  { hour: 14, minutes: [8, 18, 27, 37, 45, 54] },
  { hour: 15, minutes: [3, 15, 24, 32, 41, 49, 57] },
  { hour: 16, minutes: [6, 14, 27, 36, 44, 53] },
  { hour: 17, minutes: [2, 10, 18, 31, 40, 50] },
  { hour: 18, minutes: [0, 9, 19, 30, 40, 52] },
  { hour: 19, minutes: [3, 16, 28, 39, 52] }, // Removed duplicate 52
  { hour: 20, minutes: [5, 20, 35, 50] }, // Removed duplicate 50
  { hour: 21, minutes: [5, 20, 22, 35, 42, 50] }, // Removed letter suffixes
  { hour: 22, minutes: [3, 6, 21, 23, 36, 43, 51] }, // Removed letter suffixes
];

// Saturday Schedule
const saturdaySchedule = [
  { hour: 8, minutes: [0, 20, 38, 56] },
  { hour: 9, minutes: [11, 26, 41, 54] },
  { hour: 10, minutes: [7, 20, 32, 44, 56] },
  { hour: 11, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 12, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 13, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 14, minutes: [7, 17, 27, 37, 47, 57] },
  { hour: 15, minutes: [7, 17, 27, 37, 48, 58] },
  { hour: 16, minutes: [8, 18, 28, 38, 48, 59] },
  { hour: 17, minutes: [11, 23, 35, 48] }, // Removed duplicate 49
  { hour: 18, minutes: [0, 12, 21, 36, 49] },
  { hour: 19, minutes: [4, 19, 34, 49] }, // Removed duplicate 49
  { hour: 20, minutes: [4, 19, 34, 49] }, // Removed duplicate 49
  { hour: 21, minutes: [4, 19, 34, 50] }, // Removed duplicate 50
  { hour: 22, minutes: [5, 21, 36, 51] }, // Removed duplicate 51
];

// Sunday Schedule
const sundaySchedule = [
  { hour: 8, minutes: [0, 20, 40] },
  { hour: 9, minutes: [0, 20, 40, 57] },
  { hour: 10, minutes: [14, 28, 41, 55] },
  { hour: 11, minutes: [7, 19, 30, 42, 54] },
  { hour: 12, minutes: [6, 18, 30, 42, 54] },
  { hour: 13, minutes: [6, 18, 30, 42, 54] },
  { hour: 14, minutes: [6, 18, 30, 42, 54] },
  { hour: 15, minutes: [6, 18, 30, 42, 54] },
  { hour: 16, minutes: [6, 18, 30, 42, 54] },
  { hour: 17, minutes: [6, 18, 30, 42, 55] },
  { hour: 18, minutes: [8, 21, 36, 51] }, // Removed duplicate 51
  { hour: 19, minutes: [6, 21, 35, 50] }, // Removed duplicate 50
  { hour: 20, minutes: [5, 20, 35, 50] }, // Removed duplicate 50
  { hour: 21, minutes: [5, 27, 42] }, // Removed duplicate 50
  { hour: 22, minutes: [3, 23, 43] }, // Removed duplicate 50
];
// Weekday Schedule (cleaned)
const weekdayScheduleRev = [
  { hour: 8, minutes: [3, 13, 23, 29, 39, 50, 59] },
  { hour: 9, minutes: [9, 19, 29, 39, 49, 59] },
  { hour: 10, minutes: [9, 19, 29, 39, 49, 59] },
  { hour: 11, minutes: [9, 19, 29, 39, 49, 59] },
  { hour: 12, minutes: [9, 19, 29, 39, 49, 59] },
  { hour: 13, minutes: [9, 19, 29, 39, 49, 59] },
  { hour: 14, minutes: [10, 19, 31, 41, 50] },
  { hour: 15, minutes: [1, 11, 22, 30, 38, 46, 54] },
  { hour: 16, minutes: [2, 12, 23, 32, 40, 50, 58] },
  { hour: 17, minutes: [7, 18, 27, 35, 43, 54] },
  { hour: 18, minutes: [2, 15, 25, 35, 47, 57] },
  { hour: 19, minutes: [12, 24, 35, 47, 59] },
  { hour: 20, minutes: [12, 24, 36, 50] },
  { hour: 21, minutes: [5, 20, 35, 39, 50, 58] }, // Removed c/d suffixes
  { hour: 22, minutes: [5, 18, 20, 35, 38, 50, 58] }, // Removed c/d suffixes
];

// Saturday Schedule (cleaned)
const saturdayScheduleRev = [
  { hour: 8, minutes: [13, 33, 53] },
  { hour: 9, minutes: [9, 24, 39, 55] },
  { hour: 10, minutes: [9, 22, 34, 46, 58] },
  { hour: 11, minutes: [9, 19, 29, 40, 50] },
  { hour: 12, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 13, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 14, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 15, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 16, minutes: [0, 10, 20, 30, 40, 50] },
  { hour: 17, minutes: [0, 10, 20, 33, 45, 57] },
  { hour: 18, minutes: [10, 22, 35, 49] },
  { hour: 19, minutes: [4, 19, 34, 49] },
  { hour: 20, minutes: [4, 19, 34, 49] },
  { hour: 21, minutes: [4, 19, 34, 50] },
  { hour: 22, minutes: [5, 20, 35, 50] },
];

// Sunday Schedule (cleaned)
const sundayScheduleRev = [
  { hour: 8, minutes: [13, 33, 53] },
  { hour: 9, minutes: [13, 33, 52] },
  { hour: 10, minutes: [11, 31, 47] },
  { hour: 11, minutes: [1, 17, 31, 44, 56] },
  { hour: 12, minutes: [8, 20, 32, 44, 56] },
  { hour: 13, minutes: [8, 20, 32, 44, 56] },
  { hour: 14, minutes: [8, 20, 32, 44, 56] },
  { hour: 15, minutes: [8, 20, 32, 44, 56] },
  { hour: 16, minutes: [8, 20, 32, 44, 56] },
  { hour: 17, minutes: [8, 20, 32, 44, 56] },
  { hour: 18, minutes: [8, 20, 34, 48] },
  { hour: 19, minutes: [5, 20, 35, 50] },
  { hour: 20, minutes: [5, 20, 35, 50] },
  { hour: 21, minutes: [5, 20, 38, 58] },
  { hour: 22, minutes: [18, 38, 58] },
];

async function seedLine() {
  try {
    await seedTripTemplates({
      tramLineNumber: 6,
      startStopName: "Varmfrontsgatan",
      endStopName: "Aprilgatan",
      heading: "Kortedala",
      tripDurationMinutes: 71, // Adjust based on actual travel time
      weekdaySchedule,
      saturdaySchedule,
      sundaySchedule,
    });
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Line 6:", error);
    process.exit(1);
  }
}
async function seedLineRev() {
  try {
    await seedTripTemplates({
      tramLineNumber: 6,
      startStopName: "Aprilgatan",
      endStopName: "Varmfrontsgatan",
      heading: "Länsmansgården",
      tripDurationMinutes: 72, // Adjust based on actual travel time
      weekdaySchedule: weekdayScheduleRev,
      saturdaySchedule: saturdayScheduleRev,
      sundaySchedule: sundayScheduleRev,
    });
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Line 6:", error);
    process.exit(1);
  }
}

//seedLine();
seedLineRev(); // Uncomment to seed the reverse direction

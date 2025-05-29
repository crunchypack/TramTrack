// tripTemplateSeeder.ts
import { connectToDB } from "../utils/database";
import TramLine from "../models/tramline";
import TramStop from "../models/tramStop";
import TripTemplate from "../models/tripTemplate";
import { Types } from "mongoose";
import "dotenv/config";

interface ScheduleData {
  hour: number;
  minutes: number[];
}

interface SeedTripTemplatesParams {
  tramLineNumber: number;
  direction: string; // 
  startStopName: string;
  endStopName: string;
  heading: string;
  tripDurationMinutes: number;
  weekdaySchedule: ScheduleData[];
  saturdaySchedule: ScheduleData[];
  sundaySchedule: ScheduleData[];
}


export async function seedTripTemplates({
  tramLineNumber,
  startStopName,
  endStopName,
  heading,
  tripDurationMinutes,
  weekdaySchedule,
  saturdaySchedule,
  sundaySchedule,
}: SeedTripTemplatesParams) {
  await connectToDB();

  try {
    // 1. Get all required references
    const tramLine = await TramLine.findOne({ number: tramLineNumber,direction:heading });
    if (!tramLine) throw new Error(`Tram Line ${tramLineNumber} not found`);

    const getStopId = async (name: string): Promise<Types.ObjectId> => {
      const stop = await TramStop.findOne({ name });
      if (!stop) throw new Error(`Stop "${name}" not found`);
      return stop._id;
    };

    const [startStopId, endStopId] = await Promise.all([
      getStopId(startStopName),
      getStopId(endStopName),
    ]);

    // 2. Delete existing templates for this configuration
    const deleteResult = await TripTemplate.deleteMany({
      tramline: tramLine._id,
      startStop: startStopId,
      heading,
    });
    console.log(
      `♻️ Deleted ${deleteResult.deletedCount} existing trip templates`
    );

    // 3. Helper to create trips for a schedule
    const createTrips = async (
      schedule: ScheduleData[],
      dayType: "weekday" | "saturday" | "sunday"
    ) => {
      const operations = schedule.flatMap(({ hour, minutes }) =>
        minutes.map((minute) => ({
          insertOne: {
            document: {
              tramline: tramLine._id,
              startTime: `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`,
              endTime: new Date(0, 0, 0, hour, minute + tripDurationMinutes)
                .toTimeString()
                .substring(0, 5),
              heading,
              startStop: startStopId,
              endStop: endStopId,
              dayType,
              isWeekend: dayType !== "weekday",
            },
          },
        }))
      );

      return operations.length > 0
        ? (await TripTemplate.bulkWrite(operations)).insertedCount
        : 0;
    };

    // 4. Seed all schedules
    const [weekdayCount, saturdayCount, sundayCount] = await Promise.all([
      createTrips(weekdaySchedule, "weekday"),
      createTrips(saturdaySchedule, "saturday"),
      createTrips(sundaySchedule, "sunday"),
    ]);

    console.log(
      `✅ Successfully seeded trip templates for Line ${tramLineNumber}:`
    );
    console.log(`   Weekday: ${weekdayCount} trips`);
    console.log(`   Saturday: ${saturdayCount} trips`);
    console.log(`   Sunday: ${sundayCount} trips`);
    console.log(
      `   Total: ${weekdayCount + saturdayCount + sundayCount} trips`
    );

    return {
      weekdayCount,
      saturdayCount,
      sundayCount,
      total: weekdayCount + saturdayCount + sundayCount,
    };
  } catch (error) {
    console.error(
      `❌ Failed to seed trip templates for Line ${tramLineNumber}:`,
      error
    );
    throw error;
  }
}

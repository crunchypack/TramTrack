import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";
import { Driver, DriverSchedule } from "@/models";
import { populate } from "dotenv";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const employeeId = params.id;

  if (!employeeId) {
    return NextResponse.json(
      { message: "Employee ID is required" },
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    // 1. Find driver by employeeId
    const driver = await Driver.findOne({ employeeId });
    if (!driver) {
      return NextResponse.json(
        { message: "Driver not found" },
        { status: 404 }
      );
    }

    // 2. Get today's start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Find all schedules on or after today
    const schedules = await DriverSchedule.find({
      driver: driver._id,
      date: { $gte: today },
    })
      .sort({ date: 1 }) // Optional: sort ascending
      .populate({
        path: "circulations.circulationTemplate",
        populate: {
          path: "trips", // sort trips by start time
          options: { sort: { startTime: 1 } },
          populate: [
            {
              path: "tramline",
              populate: {
                path: "route",
                select: "name",
              },
            },
            { path: "startStop", select: "name" },
            { path: "endStop", select: "name" },
          ],
        },
      })
      .populate("circulations.startStop")
      .populate("circulations.endStop")
      .exec();

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching upcoming schedules:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

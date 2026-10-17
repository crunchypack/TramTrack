import { connectToDB } from "@/utils/database";
import { DriverSchedule } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, date, circulations } = body;

    // Validate payload presence
    if (!employeeId || !date || !Array.isArray(circulations) || circulations.length === 0) {
      return NextResponse.json({ error: "Missing required data or empty circulations array" }, { status: 400 });
    }

    await connectToDB();

    // We store the schedule as a single document per driver per day
    const newSchedule = await DriverSchedule.findOneAndUpdate(
      { employeeId, date },
      { 
        employeeId, 
        date, 
        circulations // Array of { circulationTemplate, startTime, endTime, startStop, endStop }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      message: "Schedule saved successfully", 
      id: newSchedule._id 
    });
  } catch (error: any) {
    console.error("Failed to save schedule:", error);
    return NextResponse.json({ error: error.message || "Failed to save schedule" }, { status: 500 });
  }
}
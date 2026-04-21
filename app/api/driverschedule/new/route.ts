import { connectToDB } from "@/utils/database";
import { DriverSchedule } from "@/models";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, date, circulations } = body;

    if (!employeeId || !date || !circulations.length) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

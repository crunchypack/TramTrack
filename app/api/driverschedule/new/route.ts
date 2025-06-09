import { connectToDB } from "@/utils/database";
import DriverSchedule from "@/models/driverSchedule";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDB();
  const data = await req.json();

  const { driver, date, circulationTemplate } = data;

  if (!driver || !date || !circulationTemplate) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const schedule = new DriverSchedule({ driver, date, circulationTemplate });
    await schedule.save();
    return NextResponse.json(schedule, { status: 201 });
  } catch (err) {
    console.error("Failed to create driver schedule:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

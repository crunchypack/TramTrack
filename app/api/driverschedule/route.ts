// /api/driverSchedule/route.ts
import { connectToDB } from "@/utils/database";
import Driver from "@/models/driver";
import DriverSchedule from "@/models/driverSchedule";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { employeeId, date, circulations } = body;
    if (!employeeId || !date || !Array.isArray(circulations)) {
      return new Response("Missing or invalid data", { status: 400 });
    }

    const driver = await Driver.findOne({ employeeId });
    if (!driver) {
      return new Response("Driver not found", { status: 404 });
    }

    const existing = await DriverSchedule.findOne({
      driver: driver._id,
      date: new Date(date),
    });

    if (existing) {
      existing.circulations = circulations;
      await existing.save();
      return new Response(
        JSON.stringify({ message: "Schedule updated", id: existing._id }),
        { status: 200 }
      );
    } else {
      const newSchedule = new DriverSchedule({
        driver: driver._id,
        date: new Date(date),
        circulations,
      });
      await newSchedule.save();
      return new Response(
        JSON.stringify({ message: "Schedule created", id: newSchedule._id }),
        { status: 201 }
      );
    }
  } catch (err) {
    console.error("Failed to save driver schedule:", err);
    return new Response("Failed to save schedule", { status: 500 });
  }
}

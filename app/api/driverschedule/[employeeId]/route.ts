// /api/driverSchedule/[employeeId]/route.ts
import { connectToDB } from "@/utils/database";

import driverSchedule from "@/models/DriverSchedule";
import CirculationTemplate from "@/models/CirculationTemplate";

import { Driver } from "@/models";

export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  const { searchParams } = new URL(req.url);
  const dateQuery = searchParams.get("date");

  if (!dateQuery) {
    return new Response("Missing 'date' query param", { status: 400 });
  }

  try {
    await connectToDB();

    const driver = await Driver.findOne({ employeeId: params.employeeId });
    if (!driver) {
      return new Response("Driver not found", { status: 404 });
    }

    const schedule = await driverSchedule
      .findOne({
        driver: driver._id,
        date: new Date(dateQuery),
      })
      .populate({
        path: "circulations.circulationTemplate",
        model: CirculationTemplate,
        populate: { path: "trips", populate: "tramline" },
      })
      .populate("circulations.startStop")
      .populate("circulations.endStop");

    if (!schedule) {
      return new Response("Schedule not found", { status: 404 });
    }

    return new Response(JSON.stringify(schedule), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch driver schedule:", err);
    return new Response("Failed to fetch schedule", { status: 500 });
  }
}

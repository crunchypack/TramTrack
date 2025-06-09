import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";
import { Driver, DriverSchedule } from "@/models";

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

    const driver = await Driver.findOne({ employeeId }).exec();
    if (!driver) {
      return NextResponse.json(
        { message: "Driver not found" },
        { status: 404 }
      );
    }

    const schedule = await DriverSchedule.findOne({ driver: driver._id })
      .populate({
        path: "circulations.circulationTemplate",
        populate: {
          path: "trips",
          populate: {
            path: "tramline",
          },
        },
      })
      .populate("circulations.startStop")
      .populate("circulations.endStop")
      .exec();

    if (!schedule) {
      return NextResponse.json(
        { message: "Driver schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

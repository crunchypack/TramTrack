import { connectToDB } from "@/utils/database";
import { Driver, PlannedWorkday } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDB();
  const { employeeId, date } = await req.json();

  if (!employeeId || !date) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const driver = await Driver.findOne({ employeeId });
  if (!driver) {
    return NextResponse.json({ message: "Driver not found" }, { status: 404 });
  }

  const existing = await PlannedWorkday.findOne({
    driver: driver._id,
    date: new Date(date),
  });

  if (existing) {
    return NextResponse.json({ message: "Already planned" }, { status: 409 });
  }

  const planned = new PlannedWorkday({ driver: driver._id, date });
  await planned.save();
  return NextResponse.json({ message: "Planned workday saved", planned });
}

export async function DELETE(req: Request) {
  await connectToDB();
  const { employeeId, date } = await req.json();

  const driver = await Driver.findOne({ employeeId });
  if (!driver) {
    return NextResponse.json({ message: "Driver not found" }, { status: 404 });
  }

  await PlannedWorkday.deleteOne({ driver: driver._id, date: new Date(date) });
  return NextResponse.json({ message: "Planned workday removed" });
}

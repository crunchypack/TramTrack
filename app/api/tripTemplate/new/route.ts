import { connectToDB } from "@/utils/database";
import { TripTemplate } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDB();
  const data = await req.json();

  const { tramline, startTime, endTime, heading, startStop, endStop } = data;

  if (
    !tramline ||
    !startTime ||
    !endTime ||
    !heading ||
    !startStop ||
    !endStop
  ) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const trip = new TripTemplate({
      tramline,
      startTime,
      endTime,
      heading,
      startStop,
      endStop,
    });
    await trip.save();
    return NextResponse.json(trip, { status: 201 });
  } catch (err) {
    console.error("Failed to create trip template:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

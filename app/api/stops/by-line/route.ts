import { NextResponse } from "next/server";

import TramLine from "@/models/TramLine";
import "@/models/TramStop"; // Ensure the model is registered for population
import { connectToDB } from "@/utils/database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number");
  const direction = searchParams.get("direction");

  if (!number)
    return NextResponse.json(
      { error: "Line number required" },
      { status: 400 },
    );

  await connectToDB();

  // Find the specific line/direction and populate the stops in the route
  const line = await TramLine.findOne({ number, direction })
    .populate("route.stop")
    .lean();

  if (!line)
    return NextResponse.json({ error: "Line not found" }, { status: 404 });

  const tramLineData = line as any;

  return NextResponse.json(tramLineData.route || []);
}

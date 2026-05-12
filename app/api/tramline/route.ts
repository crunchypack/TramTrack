import { connectToDB } from "../../../utils/database";
import { TramLine } from "@/models";
import { NextResponse } from "next/server";
// This route handles both GET and POST requests for tramlines
// GET retrieves all tramlines, and POST creates new tramlines
export async function GET() {
  try {
    await connectToDB();
    // We populate 'route' so the frontend gets the GIDs immediately
    const lines = await TramLine.find({})
      .populate("route.stop")
      .populate("searchRoute")
      .populate("reliefPoints");
    return NextResponse.json(lines);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lines" },
      { status: 500 },
    );
  }
}

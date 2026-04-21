import { connectToDB } from "@/utils/database";
import { CirculationTemplate } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const url = req.nextUrl;

    const designation = url.searchParams.get("designation");
    const dayType = url.searchParams.get("dayType");

    const filters: any = {};
    if (dayType) filters.dayType = dayType;
    if (designation) filters.designation = parseInt(designation);

    // No need for .populate() because trips are stored directly in the document
    const templates = await CirculationTemplate.find(filters);

    return NextResponse.json(templates, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch templates:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
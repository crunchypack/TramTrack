import { connectToDB } from "@/utils/database";
import { CirculationTemplate } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let data: any = {}; // Declare outside the try block

  try {
    await connectToDB();
    data = await req.json();
    const { designation, dayType, trips, season } = data;

    // 1. Validate required fields before hitting the database
    if (!designation || !dayType || !Array.isArray(trips) || trips.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: designation, dayType, and at least one trip." },
        { status: 400 }
      );
    }

    // 2. Save the template
    const newTemplate = new CirculationTemplate({
      designation: Number(designation),
      dayType,
      season: season || "standard",
      trips 
    });

    await newTemplate.save();
    return NextResponse.json(newTemplate, { status: 201 });

  } catch (error: any) {
    console.error("Save Error:", error);

    // 3. Catch MongoDB duplicate key error on our new compound index
    if (error.code === 11000) {
      return NextResponse.json(
        { error: `A template with designation #${data?.designation} already exists for ${data?.dayType} (${data?.season || "standard"}).` },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
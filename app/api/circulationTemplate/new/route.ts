import { connectToDB } from "@/utils/database";
import { CirculationTemplate } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { designation, dayType, trips, season } = await req.json();

    // With our new simplified model, we just save the whole object at once!
    const newTemplate = new CirculationTemplate({
      designation,
      dayType,
      season,
      trips // This is now just an array of trip objects
    });

    await newTemplate.save();
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error: any) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

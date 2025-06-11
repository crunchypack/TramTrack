import { connectToDB } from "@/utils/database";
import { CirculationTemplate } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDB();

  try {
    const {
      trips,
      dayType,
      season = "standard", // default if not provided
    } = await req.json();

    if (!trips || !dayType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCirculation = new CirculationTemplate({
      trips,

      dayType,
      season,
    });

    await newCirculation.save();

    return NextResponse.json(newCirculation, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating CirculationTemplate:", error);
    return NextResponse.json(
      { message: "Error creating circulation" },
      { status: 500 }
    );
  }
}

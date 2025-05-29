import { connectToDB } from "@/utils/database";
import CirculationTemplate from "@/models/circulationTemplate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDB();
  const data = await req.json();

  const { name, trips } = data;

  if (!name || !Array.isArray(trips) || trips.length === 0) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const circulation = new CirculationTemplate({ name, trips });
    await circulation.save();
    return NextResponse.json(circulation, { status: 201 });
  } catch (err) {
    console.error("Failed to create circulation template:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

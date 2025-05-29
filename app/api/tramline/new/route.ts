import { NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/database";
import TramLine from "../../../../models/tramline";

export async function POST(req: Request) {
  await connectToDB();
  const data = await req.json();

  try {
    const { number, route, timeBetweenStops } = data;

    if (!number || !Array.isArray(route)) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTramLine = new TramLine({ number, route, timeBetweenStops });
    await newTramLine.save();

    return NextResponse.json(newTramLine, { status: 201 });
  } catch (error) {
    console.error("Error creating tramline:", error);
    return NextResponse.json(
      { message: "Error creating tramline" },
      { status: 500 }
    );
  }
}

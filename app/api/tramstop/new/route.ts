import { connectToDB } from "@/utils/database";
import { TramStop } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDB();
  const data = await req.json();

  const { name, location } = data;

  if (!name) {
    return NextResponse.json(
      { message: "Tram stop name is required" },
      { status: 400 }
    );
  }

  try {
    const stop = new TramStop({ name, location });
    await stop.save();
    return NextResponse.json(stop, { status: 201 });
  } catch (err) {
    console.error("Failed to create tram stop:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

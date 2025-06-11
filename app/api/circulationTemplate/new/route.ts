import { connectToDB } from "@/utils/database";
import { CirculationTemplate } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const data = await req.json();

    const { designation, trips, dayType, season } = data;

    if (!designation || !Array.isArray(trips) || !dayType) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newCirculation = new CirculationTemplate({
      designation,
      trips,
      dayType,
      season: season || "standard",
    });

    await newCirculation.save();
    return new Response(JSON.stringify(newCirculation), { status: 201 });
  } catch (err) {
    console.error("Failed to create circulation template:", err);
    return new Response("Failed to create circulation template", {
      status: 500,
    });
  }
}

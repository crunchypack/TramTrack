import { connectToDB } from "@/utils/database";
import { CirculationTemplate } from "@/models";
import { NextResponse } from "next/server";

// GET /api/circulationTemplate/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const template = await CirculationTemplate.findOne({
      designation: params.id,
    }).populate({
      path: "trips",
      populate: {
        path: "tramline startStop endStop",
      },
    });

    if (!template) {
      return new Response("Circulation not found", { status: 404 });
    }

    return new Response(JSON.stringify(template), { status: 200 });
  } catch (error) {
    console.error("Failed to get circulation:", error);
    return new Response("Failed to fetch circulation", { status: 500 });
  }
}

// PUT /api/circulationTemplate/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const data = await req.json();
    const { designation, trips, dayType, season } = data;

    if (!designation || !Array.isArray(trips) || !dayType) {
      return new Response("Missing required fields", { status: 400 });
    }

    const updated = await CirculationTemplate.findOneAndUpdate(
      { designation: params.id },
      {
        designation,
        trips,
        dayType,
        season: season || "standard",
      },
      { new: true }
    );

    if (!updated) {
      return new Response("Circulation not found", { status: 404 });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error("Failed to update circulation template:", err);
    return new Response("Failed to update circulation", { status: 500 });
  }
}

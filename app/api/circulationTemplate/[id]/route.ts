import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/utils/database";
import { CirculationTemplate } from "@/models";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

// GET /api/circulationTemplate/[id]
export async function GET(req: Request, context: RouteContext) {
  try {
    await connectToDB();
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    const { searchParams } = new URL(req.url);

    let query: Record<string, any> = {};

    // If passed a 24-character hex ObjectId, search by _id directly
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      // Otherwise, query by numerical designation
      const designationNum = Number(id);
      if (Number.isNaN(designationNum)) {
        return NextResponse.json(
          { error: "Invalid designation or ID format" },
          { status: 400 },
        );
      }

      query.designation = designationNum;

      // Optional filters to disambiguate weekday/saturday/sunday shifts
      const dayType = searchParams.get("dayType");
      const season = searchParams.get("season");
      if (dayType) query.dayType = dayType;
      if (season) query.season = season;
    }

    const template = await CirculationTemplate.findOne(query);

    if (!template) {
      return NextResponse.json(
        { error: "Circulation template not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(template, { status: 200 });
  } catch (error: any) {
    console.error("Failed to get circulation:", error);
    return NextResponse.json(
      { error: "Failed to fetch circulation", details: error.message },
      { status: 500 },
    );
  }
}

// PUT /api/circulationTemplate/[id]
export async function PUT(req: Request, context: RouteContext) {
  try {
    await connectToDB();
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    const data = await req.json();

    const { designation, trips, dayType, season } = data;

    if (!designation || !Array.isArray(trips) || !dayType) {
      return NextResponse.json(
        { error: "Missing required fields (designation, trips, dayType)" },
        { status: 400 },
      );
    }

    const filter: Record<string, any> = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { designation: Number(id), dayType };

    const updated = await CirculationTemplate.findOneAndUpdate(
      filter,
      {
        designation: Number(designation),
        trips,
        dayType,
        season: season || "standard",
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Circulation template not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("Failed to update circulation template:", err);
    return NextResponse.json(
      { error: "Failed to update circulation", details: err.message },
      { status: 500 },
    );
  }
}

// DELETE /api/circulationTemplate/[id]
export async function DELETE(_req: Request, context: RouteContext) {
  try {
    await connectToDB();
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    const filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { designation: Number(id) };

    const deleted = await CirculationTemplate.findOneAndDelete(filter);

    if (!deleted) {
      return NextResponse.json(
        { error: "Circulation template not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Template deleted successfully" },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete template", details: err.message },
      { status: 500 },
    );
  }
}
import { connectToDB } from "../../../utils/database";
import { TramLine } from "@/models";
import { NextResponse } from "next/server";
// This route handles both GET and POST requests for tramlines
// GET retrieves all tramlines, and POST creates new tramlines
export async function GET(req: Request) {
  try {
    await connectToDB();
    const tramlines = await TramLine.find({}).populate("route", "name");
    return new Response(JSON.stringify(tramlines), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch tramlines", { status: 500 });
  }
}
export async function POST(req: Request) {
  await connectToDB();
  const data = await req.json();

  const entries = Array.isArray(data) ? data : [data];

  try {
    const created = await Promise.all(
      entries.map(async ({ number, direction, route, timeBetweenStops }) => {
        if (
          !number ||
          !direction ||
          !Array.isArray(route) ||
          !Array.isArray(timeBetweenStops)
        ) {
          throw new Error("Missing required fields");
        }
        if (route.length < 2) {
          throw new Error("Route must contain at least 2 stops.");
        }

        if (route.length - 1 !== timeBetweenStops.length) {
          throw new Error(
            `TimeBetweenStops must have exactly ${route.length - 1} entries.`
          );
        }

        const newTramLine = new TramLine({
          number,
          direction,
          route,
          timeBetweenStops,
        });
        return await newTramLine.save();
      })
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating tramline:", error);
    return NextResponse.json(
      { message: "Error creating tramline" },
      { status: 500 }
    );
  }
}

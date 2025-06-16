import { connectToDB } from "@/utils/database";
import { CirculationTemplate } from "@/models";
import "@/models";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const url = req.nextUrl;

    const heading = url.searchParams.get("heading");
    const dayType = url.searchParams.get("dayType");
    const season = url.searchParams.get("season");
    const designation = url.searchParams.get("designation");

    const filters: any = {};
    if (heading) filters["trips.heading"] = heading;
    if (dayType) filters.dayType = dayType;
    if (season) filters.season = season;
    if (designation) filters.designation = parseInt(designation);

    const templates = await CirculationTemplate.find(filters).populate({
      path: "trips",
      populate: {
        path: "tramline startStop endStop",
      },
    });

    return new Response(JSON.stringify(templates), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch circulation templates:", err);
    return new Response("Failed to fetch circulation templates", {
      status: 500,
    });
  }
}

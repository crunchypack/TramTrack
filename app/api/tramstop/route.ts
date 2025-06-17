import { connectToDB } from "@/utils/database";
import { TramStop } from "@/models";

export async function GET() {
  try {
    await connectToDB();
    const stops = await TramStop.find({}).sort({ name: 1 });
    return new Response(JSON.stringify(stops), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch tram stops:", err);
    return new Response("Failed to fetch tram stops", { status: 500 });
  }
}

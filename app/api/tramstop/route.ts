import { connectToDB } from "@/utils/database";
import TramStop from "@/models/tramStop";

export async function GET() {
  try {
    await connectToDB();
    const stops = await TramStop.find({});
    return new Response(JSON.stringify(stops), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch tram stops:", err);
    return new Response("Failed to fetch tram stops", { status: 500 });
  }
}

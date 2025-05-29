import { connectToDB } from "@/utils/database";
import TripTemplate from "@/models/tripTemplate";

export async function GET() {
  try {
    await connectToDB();
    const trips = await TripTemplate.find({}).populate(
      "tramline startStop endStop"
    );
    return new Response(JSON.stringify(trips), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch trip templates:", err);
    return new Response("Failed to fetch trip templates", { status: 500 });
  }
}

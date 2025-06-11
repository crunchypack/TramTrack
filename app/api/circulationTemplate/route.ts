import { connectToDB } from "@/utils/database";
import { CirculationTemplate } from "@/models";
import "@/models";

export async function GET() {
  try {
    await connectToDB();
    const circulations = await CirculationTemplate.find({}).populate({
      path: "trips",
      populate: {
        path: "tramline startStop endStop",
      },
    });
    return new Response(JSON.stringify(circulations), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch circulation templates:", err);
    return new Response("Failed to fetch circulation templates", {
      status: 500,
    });
  }
}

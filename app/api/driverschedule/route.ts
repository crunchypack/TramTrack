import { connectToDB } from "@/utils/database";
import DriverSchedule from "@/models/driverschedule";

export async function GET() {
  try {
    await connectToDB();
    const schedules = await DriverSchedule.find({})
      .populate({
        path: "circulationTemplate",
        populate: {
          path: "trips",
          populate: {
            path: "tramline startStop endStop",
          },
        },
      })
      .populate("driver");

    return new Response(JSON.stringify(schedules), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch driver schedules:", err);
    return new Response("Failed to fetch driver schedules", { status: 500 });
  }
}

import { DriverSchedule } from "@/models";
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Driver ID from the request
  await connectToDB();

  try {
    const driverSchedule = await DriverSchedule.findOne({
      driver: id,
    }).populate({
      path: "circulationTemplate",
      populate: {
        path: "trips",
        populate: {
          path: "tramline",
        },
      },
    }); // Populate with circulations data
    return NextResponse.json(driverSchedule, { status: 200 });
  } catch (error) {
    console.error("Error fetching driver schedule:", error);
    return NextResponse.json(
      { message: "Error fetching driver schedule" },
      { status: 500 }
    );
  }
}

// Update your API route
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";

// import Trip from "@/models/trip";
// import Circulation from "@/models/circulation";
// import DriverSchedule from "@/models/driverschedule";
// import Driver from "@/models/driver";
import models from "@/models";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const employeeId = params.id;

  if (!employeeId) {
    return NextResponse.json(
      { message: "Employee ID is required" },
      { status: 400 }
    );
  }

  try {
    await connectToDB(); // Connect to the database

    // Find the driver based on employeeId
    const mainDriver = await models.driver.findOne({ employeeId }).exec();
    if (!mainDriver) {
      return NextResponse.json(
        { message: "Driver not found" },
        { status: 404 }
      );
    }

    // Find the driver's schedule using the driver's ObjectId
    const driverSchedule = await models.driverschedule
      .findOne({ driver: mainDriver._id })
      .populate({
        path: "circulationTemplate",
        // model: "Circulation",
        populate: {
          path: "trips",
          // model: "Trip",
          populate: {
            path: "tramline",
            // model: "Tramline",
          },
        },
      })
      .exec();

    if (!driverSchedule) {
      return NextResponse.json(
        { message: "Driver schedule not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(driverSchedule);
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

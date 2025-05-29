import { NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/database";
import Driver from "../../../../models/driver";

export async function POST(req: Request, res: Response) {
  await connectToDB();
  const data = await req.json();

  try {
    const { name, employeeId } = data;

    if (!name || !employeeId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new Driver instance using the Mongoose model
    const newDriver = new Driver({
      name,
      employeeId,
    });

    // Save the newDriver object to the database
    await newDriver.save();

    // Return a success response with the saved newDriver object
    return NextResponse.json(newDriver, { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { message: "Error creating driver" },
      { status: 500 }
    );
  }
}

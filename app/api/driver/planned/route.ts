import { connectToDB } from "@/utils/database";
import { Driver, PlannedWorkday } from "@/models";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId");

  if (!employeeId) {
    return NextResponse.json(
      { message: "Employee ID is required" },
      { status: 400 }
    );
  }

  try {
    const driver = await Driver.findOne({ employeeId });
    if (!driver) {
      return NextResponse.json(
        { message: "Driver not found" },
        { status: 404 }
      );
    }

    const plannedWorkdays = await PlannedWorkday.find({ driver: driver._id });
    return NextResponse.json(plannedWorkdays);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  await connectToDB();
  const { employeeId, date } = await req.json();

  if (!employeeId || !date) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const driver = await Driver.findOne({ employeeId });
  if (!driver || driver.email !== session.user.email) {
    console.log(driver, session.user.email);
    return new Response("Forbidden", { status: 403 });
  }
  if (!driver) {
    return NextResponse.json({ message: "Driver not found" }, { status: 404 });
  }

  const existing = await PlannedWorkday.findOne({
    driver: driver._id,
    date: new Date(date),
  });

  if (existing) {
    return NextResponse.json({ message: "Already planned" }, { status: 409 });
  }

  const planned = new PlannedWorkday({ driver: driver._id, date });
  await planned.save();
  return NextResponse.json({ message: "Planned workday saved", planned });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  await connectToDB();
  const { employeeId, date } = await req.json();

  const driver = await Driver.findOne({ employeeId });
  if (!driver || driver.email !== session.user.email) {
    return new Response("Forbidden", { status: 403 });
  }
  if (!driver) {
    return NextResponse.json({ message: "Driver not found" }, { status: 404 });
  }

  await PlannedWorkday.deleteOne({ driver: driver._id, date: new Date(date) });
  return NextResponse.json({ message: "Planned workday removed" });
}
/*
export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    await connectToDB();
    const driver = await Driver.findOne({ employeeId: params.employeeId });
    if (!driver) {
      return NextResponse.json(
        { message: "Driver not found" },
        { status: 404 }
      );
    }

    const query: any = { driver: driver._id };
    if (start && end) {
      query.date = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const plannedWorkdays = await PlannedWorkday.find(query);
    return NextResponse.json(plannedWorkdays);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


*/

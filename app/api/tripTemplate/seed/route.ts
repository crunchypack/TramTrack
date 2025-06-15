// /app/api/tripTemplate/seed/route.ts
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";
import { seedTripTemplates } from "@/scripts/tripSeeder"; // adjust the path if needed

export async function POST(req: Request) {
  await connectToDB();
  const body = await req.json();

  try {
    const result = await seedTripTemplates(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Trip seeding failed:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

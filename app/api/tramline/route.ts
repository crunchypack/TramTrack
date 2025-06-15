import { connectToDB } from "../../../utils/database";
import { TramLine } from "@/models";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const tramlines = await TramLine.find({}).populate("route", "name");
    return new Response(JSON.stringify(tramlines), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch tramlines", { status: 500 });
  }
}

import { connectToDB } from "../../../utils/database";
import driver from "@/models/driver";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const drivers = await driver.find({});
    return new Response(JSON.stringify(drivers), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch circulations", { status: 500 });
  }
}

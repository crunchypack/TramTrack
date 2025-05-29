import { connectToDB } from "../../../utils/database";
import Tramline from "../../../models/tramline";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const tramlines = await Tramline.find({});
    return new Response(JSON.stringify(tramlines), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch tramlines", { status: 500 });
  }
}

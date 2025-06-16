import { connectToDB } from "@/utils/database";
import { TripTemplate, TramLine } from "@/models";
import { NextRequest } from "next/server";
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = req.nextUrl;

    const tramline = searchParams.get("tramline");
    const heading = searchParams.get("heading");
    const dayType = searchParams.get("dayType");
    const season = searchParams.get("season");

    const filter: Record<string, any> = {};

    if (heading) filter.heading = heading;
    if (dayType) filter.dayType = dayType;
    if (season) filter.season = season;

    if (tramline && heading) {
      const tramlineDoc = await TramLine.findOne({
        number: parseInt(tramline),
        direction: heading,
      });
      if (!tramlineDoc) {
        return new Response(
          JSON.stringify({ message: "TramLine not found for direction" }),
          { status: 404 }
        );
      }
      filter.tramline = tramlineDoc._id;
    } else if (tramline) {
      // fallback: filter by number only (fetch all directions)
      const lines = await TramLine.find({ number: parseInt(tramline) });
      filter.tramline = { $in: lines.map((t) => t._id) };
    }

    const trips = await TripTemplate.find(filter).populate(
      "tramline startStop endStop"
    );
    return new Response(JSON.stringify(trips), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch trip templates:", err);
    return new Response("Failed to fetch trip templates", { status: 500 });
  }
}

// import { connectToDB } from "@/utils/database";
// import TripTemplate from "@/models/tripTemplate";
// import "@/models/tramStop";

// export async function GET(req: Request) {
//   try {
//     await connectToDB();

//     const { searchParams } = new URL(req.url);

//     const tramline = searchParams.get("tramline"); // number as string
//     const heading = searchParams.get("heading");
//     const dayType = searchParams.get("dayType");
//     const season = searchParams.get("season");

//     const filter: Record<string, any> = {};

//     if (heading) filter.heading = heading;
//     if (dayType) filter.dayType = dayType;
//     if (season) filter.season = season;

//     // If tramline number is provided, filter by tramline reference
//     if (tramline) {
//       const tramlineDoc = await import("@/models/tramline")
//         .then((mod) => mod.default)
//         .then((TramLine) =>
//           TramLine.findOne({ number: parseInt(tramline) }).exec()
//         );

//       if (tramlineDoc) {
//         filter.tramline = tramlineDoc._id;
//       } else {
//         return new Response(
//           JSON.stringify({ message: `TramLine ${tramline} not found.` }),
//           { status: 404 }
//         );
//       }
//     }

//     const trips = await TripTemplate.find(filter).populate(
//       "tramline startStop endStop"
//     );

//     return new Response(JSON.stringify(trips), { status: 200 });
//   } catch (err) {
//     console.error("Failed to fetch trip templates:", err);
//     return new Response("Failed to fetch trip templates", { status: 500 });
//   }
// }

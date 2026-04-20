import { connectToDB } from "@/utils/database";
import { DriverSchedule, CirculationTemplate, Driver } from "@/models";
import { getVasttrafikToken } from "@/lib/vasttrafik";

// --- Types for TypeScript Safety ---
interface LiveStatus {
  delayMinutes: number;
  estimatedTime: string;
  isCancelled: boolean;
}

export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  const { searchParams } = new URL(req.url);
  const dateQuery = searchParams.get("date");

  if (!dateQuery) {
    return new Response("Missing 'date' query param", { status: 400 });
  }

  try {
    await connectToDB();

    // 1. Find the Driver
    const driver = await Driver.findOne({ employeeId: params.employeeId });
    if (!driver) {
      return new Response("Driver not found", { status: 404 });
    }

    // 2. Fetch the Schedule from MongoDB
    const schedule = await DriverSchedule.findOne({
      driver: driver._id,
      date: new Date(dateQuery),
    })
      .populate({
        path: "circulations.circulationTemplate",
        model: CirculationTemplate,
        populate: { path: "trips", populate: "tramline" },
      })
      .populate("circulations.startStop")
      .populate("circulations.endStop");

    if (!schedule) {
      return new Response("Schedule not found", { status: 404 });
    }

    // 3. Get Västtrafik Token for live data enrichment
    const token = await getVasttrafikToken();

    // 4. Enrich each circulation with Live Data
    const enrichedCirculations = await Promise.all(
      schedule.circulations.map(async (circ: any) => {
        const gid = circ.startStop?.vasttrafikGid;
        
        // If there's no GID, we can't fetch live data, return static object
        if (!gid) return circ.toObject();

        try {
          // Fetch live departures from Västtrafik
          const res = await fetch(
            `https://ext-api.vasttrafik.se/pr/v4/stop-areas/${gid}/departures?limit=10`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (!res.ok) throw new Error("VT API reached but failed");
          
          const liveData = await res.json();

          // Try to match the tram line number (designation)
          // We look into the populated circulationTemplate to find the tramline number
          const lineNumber = circ.circulationTemplate?.trips[0]?.tramline?.number?.toString();

          const liveMatch = liveData.results?.find(
            (d: any) => d.line.designation === lineNumber
          );

          // Return the original circulation data + the liveStatus object
          return {
            ...circ.toObject(),
            liveStatus: liveMatch
              ? {
                  delayMinutes: (liveMatch.delay || 0) / 60,
                  estimatedTime: liveMatch.estimatedTime || liveMatch.plannedTime,
                  isCancelled: liveMatch.isCancelled || false,
                }
              : null,
          };
        } catch (error) {
          console.error(`Live data fetch failed for GID ${gid}:`, error);
          return circ.toObject(); // Fallback to static data on API error
        }
      })
    );

    // 5. Final Assembly: Merge enriched circulations back into the schedule
    const finalResponse = {
      ...schedule.toObject(),
      circulations: enrichedCirculations,
    };

    return new Response(JSON.stringify(finalResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Failed to fetch driver schedule:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
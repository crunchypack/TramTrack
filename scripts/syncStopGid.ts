import dns from "node:dns";
// 1. FORCE DNS TO GOOGLE 
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { connectToDB } from "../utils/database"; // Use relative path for scripts
import TramStop from "../models/TramStop";      // Use relative path for scripts
import { findGidForStop, getVasttrafikToken } from "../lib/vasttrafik";
import mongoose from "mongoose";

export async function runSync() {
  console.log("🚀 Starting Sync...");
  await connectToDB();

  const token = await getVasttrafikToken();

  // Find stops that don't have a GID yet
  const stops = await TramStop.find({ 
    $or: [{ vasttrafikGid: { $exists: false } }, { vasttrafikGid: "" }] 
  });

  console.log(`Found ${stops.length} stops to sync...`);

  for (const stop of stops) {
    try {
      const officialGid = await findGidForStop(stop.name, token);
      if (officialGid) {
        stop.vasttrafikGid = officialGid;
        await stop.save();
        console.log(`✅ Linked: ${stop.name} -> ${officialGid}`);
      } else {
        console.log(`⚠️ No GID found for: ${stop.name}`);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.error(`❌ Error syncing ${stop.name}:`, err);
    }
  }

  console.log("🏁 Sync complete. Closing connection...");
  await mongoose.disconnect();
  process.exit(0);
}

// This line actually executes the function when you run the file
runSync();
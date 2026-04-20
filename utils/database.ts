import mongoose from "mongoose";
import dns from "node:dns";

// FIX 1: Solve the ECONNREFUSED / DNS issue
// Force Node to use Google DNS for SRV record resolution
if (process.env.NODE_ENV === "development") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

let isConnected = false;

export const connectToDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in .env");
    return;
  }

  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  try {
    console.log("=> Attempting fresh MongoDB connection...");
    
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "sparvagen",
      // FIX 2: Modern connection options
      bufferCommands: false, 
    });

    isConnected = !!db.connections[0].readyState;
    console.log("✅ Connected to database: sparvagen");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // If it fails, make sure we don't think we're connected
    isConnected = false; 
  }
};
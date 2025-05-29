import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async (): Promise<void> => {
  console.log("trying to connect...");
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected!");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "sparvagen",
    });

    isConnected = true;
    console.log("Connected to database");
  } catch (err) {
    console.log(err);
  }
};

import mongoose, { Schema, Document } from "mongoose";

interface ITripTemplate extends Document {
  tramline: mongoose.Types.ObjectId;
  startTime: string;
  endTime: string;
  heading: string;
  startStop: mongoose.Types.ObjectId;
  endStop: mongoose.Types.ObjectId;
  dayType: "weekday" | "saturday" | "sunday";
  isWeekend: boolean;
}

const tripTemplateSchema = new Schema<ITripTemplate>({
  tramline: { type: Schema.Types.ObjectId, ref: "TramLine", required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  heading: { type: String, required: true },
  startStop: { type: Schema.Types.ObjectId, ref: "TramStop", required: true },
  endStop: { type: Schema.Types.ObjectId, ref: "TramStop", required: true },
  dayType: { type: String, required: true },
  isWeekend: { type: Boolean, required: true },
});

export default mongoose.models.TripTemplate ||
  mongoose.model<ITripTemplate>("TripTemplate", tripTemplateSchema);

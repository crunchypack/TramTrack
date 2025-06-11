// models/tramStop.ts
import mongoose, { Schema, Document } from "mongoose";

interface ITramStop extends Document {
  name: string;
  location?: {
    lat: number;
    lng: number;
  };
}

const tramStopSchema = new Schema<ITramStop>({
  name: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
});

export default mongoose.models.TramStop ||
  mongoose.model<ITramStop>("TramStop", tramStopSchema);

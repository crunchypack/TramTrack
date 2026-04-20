import mongoose, { Schema, Document } from "mongoose";
/**
 * Schema for tramstops
 */
interface ITramStop extends Document {
  name: string;
  vasttrafikGid: string,
  location?: {
    lat: number;
    lng: number;
  };
}

const tramStopSchema = new Schema<ITramStop>({
  name: { type: String, required: true },
  vasttrafikGid: { type: String, unique: true, sparse: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
});

export default mongoose.models.TramStop ||
  mongoose.model<ITramStop>("TramStop", tramStopSchema);

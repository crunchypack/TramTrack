import mongoose, { Document, Schema } from "mongoose";

interface ITramLine extends Document {
  number: number;
  direction: string;
  route: mongoose.Types.ObjectId[];
  timeBetweenStops: number[];
}

const tramLineSchema = new Schema<ITramLine>({
  number: { type: Number, required: true },
  direction: { type: String, required: true }, // e.g., "Östra Sjukhuset or Tynnered"
  route: [{ type: Schema.Types.ObjectId, ref: "TramStop" }],
  timeBetweenStops: [{ type: Number, required: true }],
});

export default mongoose.models.TramLine ||
  mongoose.model<ITramLine>("TramLine", tramLineSchema);

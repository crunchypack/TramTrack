import mongoose, { Schema, Document } from "mongoose";

interface ITramLine extends Document {
  number: number;
  direction: string;

  // Keep this for backward compatibility.
  // It now represents the actual in-service stop sequence.
  route: mongoose.Types.ObjectId[];

  // Used for Västtrafik trip discovery / import logic
  searchRoute: mongoose.Types.ObjectId[];

  // Stops where takeover / handover / depot-adjacent operations are relevant
  reliefPoints: mongoose.Types.ObjectId[];
}

const tramLineSchema = new Schema<ITramLine>(
  {
    number: { type: Number, required: true },
    direction: { type: String, required: true },

    route: [
      {
        type: Schema.Types.ObjectId,
        ref: "TramStop",
        required: true,
      },
    ],

    searchRoute: [
      {
        type: Schema.Types.ObjectId,
        ref: "TramStop",
        default: [],
      },
    ],

    reliefPoints: [
      {
        type: Schema.Types.ObjectId,
        ref: "TramStop",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

tramLineSchema.index({ number: 1, direction: 1 }, { unique: true });

export default mongoose.models.TramLine ||
  mongoose.model<ITramLine>("TramLine", tramLineSchema);
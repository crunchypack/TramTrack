import mongoose, { Schema, Document } from "mongoose";

interface ICirculationTemplate extends Document {
  trips: mongoose.Types.ObjectId[];

  dayType: "weekday" | "saturday" | "sunday";
  season: "standard" | "summer";
}

const circulationTemplateSchema = new Schema<ICirculationTemplate>({
  trips: [{ type: Schema.Types.ObjectId, ref: "TripTemplate", required: true }],
  dayType: {
    type: String,
    enum: ["weekday", "saturday", "sunday"],
    required: true,
  },
  season: { type: String, enum: ["standard", "summer"], default: "standard" },
});

export default mongoose.models.CirculationTemplate ||
  mongoose.model<ICirculationTemplate>(
    "CirculationTemplate",
    circulationTemplateSchema
  );

import mongoose, { Schema, Document } from "mongoose";

const tripSchema = new Schema(
  {
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    originName: { type: String, required: true, trim: true },
    originGid: { type: String, required: true, trim: true },
    destinationName: { type: String, required: true, trim: true },
    destinationGid: { type: String, required: true, trim: true },
    line: { type: Number, required: true },
    heading: { type: String, required: true, trim: true },

    // Västtrafik API v4 integration fields
    detailsReference: { type: String, trim: true },
    serviceJourneyGid: { type: String, trim: true },
  },
  { _id: false },
);

export interface ITrip {
  startTime: string;
  endTime: string;
  originName: string;
  originGid: string;
  destinationName: string;
  destinationGid: string;
  line: number;
  heading: string;
  detailsReference?: string;
  serviceJourneyGid?: string;
}

export interface ICirculationTemplate extends Document {
  designation: number;
  dayType: "weekday" | "saturday" | "sunday";
  season: "standard" | "summer";
  trips: ITrip[];
}

const circulationTemplateSchema = new Schema<ICirculationTemplate>(
  {
    designation: { type: Number, required: true },
    dayType: {
      type: String,
      enum: ["weekday", "saturday", "sunday"],
      required: true,
    },
    season: {
      type: String,
      enum: ["standard", "summer"],
      default: "standard",
    },
    trips: [tripSchema],
  },
  { timestamps: true },
);

// Allows identical shift numbers on different day schedules or seasons
circulationTemplateSchema.index(
  { designation: 1, dayType: 1, season: 1 },
  { unique: true },
);

export default mongoose.models.CirculationTemplate ||
  mongoose.model<ICirculationTemplate>(
    "CirculationTemplate",
    circulationTemplateSchema,
  );
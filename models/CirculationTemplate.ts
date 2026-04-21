import mongoose, { Schema, Document } from "mongoose";

// This is a sub-document. It doesn't need its own collection.
const tripSchema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  originName: { type: String, required: true },
  originGid: { type: String, required: true },
  destinationName: { type: String, required: true },
  destinationGid: { type: String, required: true },
  line: { type: Number, required: true },
  heading: { type: String, required: true },
});

interface ITrip {
  startTime: string;
  endTime: string;

  originName: string;
  originGid: string;

  destinationName: string;
  destinationGid: string;

  line: number;
  heading: string;
}

interface ICirculationTemplate extends Document {
  designation:number;
  dayType:"weekday"|"saturday"|"sunday";
  season:"standard"|"summer";
  trips:ITrip[];
}

const circulationTemplateSchema = new Schema<ICirculationTemplate>({
  designation: { type: Number, required: true, unique: true },
  dayType: { 
    type: String, 
    enum: ["weekday", "saturday", "sunday"], 
    required: true 
  },
  season: { 
    type: String, 
    enum: ["standard", "summer"], 
    default: "standard" 
  },
  // All trips for this shift live right here:
  trips: [tripSchema], 
});

export default mongoose.models.CirculationTemplate ||
  mongoose.model<ICirculationTemplate>("CirculationTemplate", circulationTemplateSchema);
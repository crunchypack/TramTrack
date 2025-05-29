import mongoose, { Schema, Document } from "mongoose";

interface ICirculationTemplate extends Document {
  name: string;
  trips: mongoose.Types.ObjectId[];
}

const circulationTemplateSchema = new Schema<ICirculationTemplate>({
  name: { type: String, required: true },
  trips: [{ type: Schema.Types.ObjectId, ref: "TripTemplate", required: true }],
});

export default mongoose.models.CirculationTemplate ||
  mongoose.model<ICirculationTemplate>(
    "CirculationTemplate",
    circulationTemplateSchema
  );

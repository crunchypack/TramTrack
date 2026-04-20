import mongoose, { Schema, Document } from "mongoose";
/**
 * Schema for Planed workday, document to track drivers that are booked
 */
interface IPlannedWorkday extends Document {
  driver: mongoose.Types.ObjectId;
  date: Date;
}
const PlannedWorkdaySchema: Schema = new Schema<IPlannedWorkday>({
  driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
  date: { type: Date, required: true },
});

export default mongoose.models.PlannedWorkday ||
  mongoose.model<IPlannedWorkday>("PlannedWorkday", PlannedWorkdaySchema);

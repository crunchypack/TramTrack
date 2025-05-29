import mongoose, { Schema, Document } from "mongoose";

interface IDriverSchedule extends Document {
  driver: mongoose.Types.ObjectId;
  date: Date;
  circulationTemplate: mongoose.Types.ObjectId;
}

const driverScheduleSchema = new Schema<IDriverSchedule>({
  driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
  date: { type: Date, required: true },
  circulationTemplate: {
    type: Schema.Types.ObjectId,
    ref: "CirculationTemplate",
    required: true,
  },
});

export default mongoose.models.DriverSchedule ||
  mongoose.model<IDriverSchedule>("DriverSchedule", driverScheduleSchema);

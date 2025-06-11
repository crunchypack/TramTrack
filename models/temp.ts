import mongoose, { Schema, Document } from "mongoose";

interface ICirculationAssignment {
  circulationTemplate: mongoose.Types.ObjectId;
  startTime: string; // ISO time (e.g. "08:00")
  endTime: string;
  startStop: mongoose.Types.ObjectId;
  endStop: mongoose.Types.ObjectId;
}

interface IDriverSchedule extends Document {
  driver: mongoose.Types.ObjectId;
  date: Date;
  circulations: ICirculationAssignment[];
}

const circulationAssignmentSchema = new Schema<ICirculationAssignment>({
  circulationTemplate: {
    type: Schema.Types.ObjectId,
    ref: "CirculationTemplate",
    required: true,
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  startStop: { type: Schema.Types.ObjectId, ref: "TramStop", required: true },
  endStop: { type: Schema.Types.ObjectId, ref: "TramStop", required: true },
});

const driverScheduleSchema = new Schema<IDriverSchedule>({
  driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
  date: { type: Date, required: true },
  circulations: [circulationAssignmentSchema], // 👈 array of blocks
});

export default mongoose.models.DriverSchedule ||
  mongoose.model<IDriverSchedule>("DriverSchedule", driverScheduleSchema);
// This schema defines a driver schedule that includes multiple circulations for a specific date.

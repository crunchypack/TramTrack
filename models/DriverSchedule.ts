import mongoose, { Schema, Document } from "mongoose";

export interface ICirculationAssignment {
  circulationTemplate: mongoose.Types.ObjectId;
  startTime: string;
  endTime: string;
  startStop: string;
  endStop: string;
}

export interface IDriverSchedule extends Document {
  driver: mongoose.Types.ObjectId;
  date: Date;
  circulations: ICirculationAssignment[];
}

const circulationAssignmentSchema = new Schema<ICirculationAssignment>(
  {
    circulationTemplate: {
      type: Schema.Types.ObjectId,
      ref: "CirculationTemplate",
      required: true,
    },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    startStop: { type: String, required: true, trim: true },
    endStop: { type: String, required: true, trim: true },
  },
  { _id: true },
);

const driverScheduleSchema = new Schema<IDriverSchedule>(
  {
    driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    date: { type: Date, required: true },
    circulations: [circulationAssignmentSchema],
  },
  { timestamps: true },
);

// Compound index for real-time polling lookups
driverScheduleSchema.index({ driver: 1, date: 1 });

export default mongoose.models.DriverSchedule ||
  mongoose.model<IDriverSchedule>("DriverSchedule", driverScheduleSchema);
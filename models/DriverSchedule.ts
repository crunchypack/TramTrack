import mongoose, { Schema, Document } from "mongoose";

interface ICirculationAssignment {
  circulationTemplate: mongoose.Types.ObjectId;
  startTime: string; // e.g. "11:03"
  endTime: string;   // e.g. "15:21"
  startStop: string; // Changed to string for manual name entry
  endStop: string;   // Changed to string for manual name entry
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
  // Changed these to String to support the manual text inputs in your form
  startStop: { type: String, required: true },
  endStop: { type: String, required: true },
});

const driverScheduleSchema = new Schema<IDriverSchedule>({
  driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
  date: { type: Date, required: true },
  circulations: [circulationAssignmentSchema], 
});

export default mongoose.models.DriverSchedule ||
  mongoose.model<IDriverSchedule>("DriverSchedule", driverScheduleSchema);
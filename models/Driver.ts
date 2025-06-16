// models/Driver.ts
import mongoose, { Document, Schema } from "mongoose";

interface IDriver extends Document {
  name: string;
  employeeId: string;
  email: string;
}

const driverSchema: Schema<IDriver> = new Schema({
  name: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
});

export default mongoose.models.Driver ||
  mongoose.model<IDriver>("Driver", driverSchema);

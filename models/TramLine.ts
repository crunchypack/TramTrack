import mongoose, { Schema, Document } from "mongoose";

interface IRouteStop {
  stop: mongoose.Types.ObjectId;
  minutesFromStart: number;
}

interface ITramLine extends Document {
  number: number;
  direction: string;
  route: IRouteStop[];
  searchRoute: mongoose.Types.ObjectId[];
  reliefPoints: mongoose.Types.ObjectId[];
}

const routeStopSchema = new Schema<IRouteStop>(
  {
    stop: {
      type: Schema.Types.ObjectId,
      ref: "TramStop",
      required: true,
    },
    minutesFromStart: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const tramLineSchema = new Schema<ITramLine>(
  {
    number: { type: Number, required: true },
    direction: { type: String, required: true },

    route: {
      type: [routeStopSchema],
      required: true,
      default: [],
    },

    searchRoute: [
      {
        type: Schema.Types.ObjectId,
        ref: "TramStop",
        default: [],
      },
    ],

    reliefPoints: [
      {
        type: Schema.Types.ObjectId,
        ref: "TramStop",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

tramLineSchema.index({ number: 1, direction: 1 }, { unique: true });

export default mongoose.models.TramLine ||
  mongoose.model<ITramLine>("TramLine", tramLineSchema);
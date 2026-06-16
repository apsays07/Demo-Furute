import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: string; // Stored as a date string e.g. YYYY-MM-DD
  location: string;
  image?: string;
  registrationLink?: string;
  status: "upcoming" | "past" | "active";
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    image: {
      type: String, // Can store base64 or public url
      trim: true,
    },
    registrationLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "past", "active"],
      default: "upcoming",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ status: 1 });
EventSchema.index({ featured: 1 });

export default (mongoose.models.Event as mongoose.Model<IEvent>) || mongoose.model<IEvent>("Event", EventSchema);

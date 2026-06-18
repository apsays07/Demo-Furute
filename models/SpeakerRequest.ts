import mongoose, { Schema, Document } from "mongoose";

export interface ISpeakerRequest extends Document {
  name: string;
  email: string;
  organization: string;
  phone?: string;
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
  audienceSize?: number;
  eventFormat?: string;
  message?: string;
  status: "pending" | "accepted" | "replied" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const SpeakerRequestSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    organization: {
      type: String,
      required: [true, "Organization is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    eventName: {
      type: String,
      trim: true,
    },
    eventDate: {
      type: String,
      trim: true,
    },
    eventLocation: {
      type: String,
      trim: true,
    },
    audienceSize: {
      type: Number,
    },
    eventFormat: {
      type: String,
      enum: ["In-person", "Virtual", "Hybrid"],
      default: "In-person",
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "replied", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: "speakerinvites",
  }
);

SpeakerRequestSchema.index({ status: 1 });
SpeakerRequestSchema.index({ email: 1 });

export default (mongoose.models.SpeakerRequest as mongoose.Model<ISpeakerRequest>) ||
  mongoose.model<ISpeakerRequest>("SpeakerRequest", SpeakerRequestSchema);

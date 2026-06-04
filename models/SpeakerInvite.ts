import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript Interface: Defines the structure of the SpeakerInvite document.
 * We include all original fields: name, email, organization, phone, eventName,
 * eventDate, eventLocation, audienceSize, eventFormat, and message.
 */
export interface ISpeakerInvite extends Document {
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
  createdAt: Date;
}

/**
 * Mongoose Schema: Defines the database structure for the entries.
 * Includes validation and settings for both required and optional fields.
 */
const SpeakerInviteSchema: Schema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Export the Mongoose model.
 * Next.js hot-reloads models in development; checking mongoose.models.SpeakerInvite
 * prevents recompilation errors.
 */
export default mongoose.models.SpeakerInvite ||
  mongoose.model<ISpeakerInvite>("SpeakerInvite", SpeakerInviteSchema);
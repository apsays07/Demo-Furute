import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript Interface: Defines the structure of the ContactInquiry document.
 */
export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  subject: string;
  message: string;
  createdAt: Date;
}

/**
 * Mongoose Schema: Defines the database structure for Contact Inquiries.
 */
const ContactInquirySchema: Schema = new Schema({
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
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  organization: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Export the Mongoose model.
 * Next.js hot-reloads models in development; checking mongoose.models.ContactInquiry
 * prevents recompilation errors.
 */
export default mongoose.models.ContactInquiry ||
  mongoose.model<IContactInquiry>("ContactInquiry", ContactInquirySchema);

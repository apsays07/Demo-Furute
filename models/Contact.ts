import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  subject: string;
  message: string;
  status: "pending" | "replied";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
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
    status: {
      type: String,
      enum: ["pending", "replied"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: "contactinquiries",
  }
);

ContactSchema.index({ status: 1 });
ContactSchema.index({ email: 1 });

export default (mongoose.models.Contact as mongoose.Model<IContact>) || mongoose.model<IContact>("Contact", ContactSchema);

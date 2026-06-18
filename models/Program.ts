import mongoose, { Schema, Document } from "mongoose";

export interface IProgram extends Document {
  title: string;
  description: string;
  duration: string;
  category: string;
  image?: string;
  pdf?: string; // Stored as base64 or url
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema: Schema = new Schema(
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
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    image: {
      type: String, // Can store base64 or public url
      trim: true,
    },
    pdf: {
      type: String, // Can store base64 or public url
      trim: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ProgramSchema.index({ category: 1 });
ProgramSchema.index({ visible: 1 });

export default (mongoose.models.Program as mongoose.Model<IProgram>) || mongoose.model<IProgram>("Program", ProgramSchema);

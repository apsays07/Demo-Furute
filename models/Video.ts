import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  description?: string;
  youtubeUrl: string;
  thumbnail?: string;
  category: string;
  featured: boolean;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      required: [true, "YouTube URL is required"],
      trim: true,
    },
    thumbnail: {
      type: String, // Can store base64 or public url
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "General",
    },
    featured: {
      type: Boolean,
      default: false,
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

VideoSchema.index({ category: 1 });
VideoSchema.index({ featured: 1 });
VideoSchema.index({ visible: 1 });

export default (mongoose.models.Video as mongoose.Model<IVideo>) || mongoose.model<IVideo>("Video", VideoSchema);

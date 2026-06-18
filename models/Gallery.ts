import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  imageUrl: string;
  category: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
  {
    imageUrl: {
      type: String, // Can store base64 or public url
      required: [true, "Image URL/Base64 is required"],
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
  },
  {
    timestamps: true,
  }
);

GallerySchema.index({ category: 1 });
GallerySchema.index({ featured: 1 });

export default (mongoose.models.Gallery as mongoose.Model<IGallery>) || mongoose.model<IGallery>("Gallery", GallerySchema);

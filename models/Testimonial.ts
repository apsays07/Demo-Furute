import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  designation: string;
  company: string;
  review: string;
  image?: string;
  rating: number;
  featured: boolean;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    review: {
      type: String,
      required: [true, "Review content is required"],
      trim: true,
    },
    image: {
      type: String, // Can store public url or Base64 URI
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
      default: 5,
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

TestimonialSchema.index({ featured: 1 });
TestimonialSchema.index({ visible: 1 });

export default (mongoose.models.Testimonial as mongoose.Model<ITestimonial>) ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

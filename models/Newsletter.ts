import mongoose, { Schema, Document } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);
export default (mongoose.models.Newsletter as mongoose.Model<INewsletter>) ||
  mongoose.model<INewsletter>("Newsletter", NewsletterSchema);

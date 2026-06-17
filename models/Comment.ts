import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  postSlug: string;
  name: string;
  email: string;
  website?: string;
  comment: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    postSlug: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Comment as mongoose.Model<IComment>) ||
  mongoose.model<IComment>("Comment", CommentSchema);

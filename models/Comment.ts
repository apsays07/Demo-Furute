import mongoose, { Schema, models, model } from "mongoose";

const CommentSchema = new Schema(
  {
    postSlug: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Comment || model("Comment", CommentSchema);
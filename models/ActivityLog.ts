import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  adminName: string;
  adminRole: string;
  action: string;
  module: string;
  targetTitle: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    adminName: {
      type: String,
      required: true,
      trim: true,
    },
    adminRole: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    module: {
      type: String,
      required: true,
      trim: true,
    },
    targetTitle: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

ActivityLogSchema.index({ createdAt: -1 });

export default (mongoose.models.ActivityLog as mongoose.Model<IActivityLog>) ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

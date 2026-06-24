import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  jobTitle?: string;
  photoUrl?: string;
  otpCode?: string;
  otpExpires?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  tempTwoFactorSecret?: string | null;
  backupCodes: string[];
  loginAttempts: number;
  lockUntil?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "editor"],
      default: "admin",
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    otpCode: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      default: null,
    },
    tempTwoFactorSecret: {
      type: String,
      default: null,
    },
    backupCodes: {
      type: [String],
      default: [],
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient searching
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

import mongoose, { Schema } from "mongoose";
import UserSchema from "../types/userSchema";

const userSchema = new Schema<UserSchema>(
  {
    email: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    googleId: String,
    profilePicture: String,
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", userSchema);

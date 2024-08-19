import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
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

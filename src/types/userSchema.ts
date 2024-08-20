import mongoose, { Document } from "mongoose";

interface UserSchema extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  profilePicture?: string;
  googleId?: string;
  refreshToken?: string;
}

export default UserSchema;

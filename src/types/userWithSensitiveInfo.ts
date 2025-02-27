import mongoose from "mongoose";

interface UserWithSensitiveInfo {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  profilePicture?: string;
  googleId?: string;
}

export default UserWithSensitiveInfo;

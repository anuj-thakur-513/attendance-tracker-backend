import mongoose, { Document } from "mongoose";
import { timeTable } from "./timeTable";

interface SubjectSchema extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  subjectTitle: string;
  timeTable: timeTable[];
}

export default SubjectSchema;

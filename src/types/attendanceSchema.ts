import mongoose, { Document, Types } from "mongoose";
import { lecture } from "./lecture";

interface AttendanceSchema extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  subjectId: Types.ObjectId;
  lectures: lecture[];
  totalLectures: Number;
  totalLecturesAttended: Number;
}

export default AttendanceSchema;

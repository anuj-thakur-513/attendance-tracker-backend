import mongoose, { Schema } from "mongoose";
import AttendanceSchema from "../types/attendanceSchema";

const attendanceSchema = new Schema<AttendanceSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "subject",
    },
    lectures: [
      {
        date: String,
        lectureHappened: Boolean,
        lectureAttended: Boolean,
      },
    ],
    totalLectures: Number,
    totalLecturesAttended: Number,
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("attendance", attendanceSchema);

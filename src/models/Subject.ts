import mongoose, { Schema } from "mongoose";
import SubjectSchema from "../types/subjectSchema";

const subjectSchema = new Schema<SubjectSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    subjectTitle: String,
    timeTable: [
      {
        day: String,
        time: String,
      },
    ],
  },
  { timestamps: true }
);

export const Subject = mongoose.model("subject", subjectSchema);

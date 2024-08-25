import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../core/ApiError";
import { Subject } from "../models/Subject";
import ApiResponse from "../core/ApiResponse";
import { timeTable } from "../types/timeTable";

const handleAddSubject = asyncHandler(async (req: Request, res: Response) => {
  const { subject } = req.body;
  const user = req.user;
  if (
    !subject ||
    subject?.schedule.length === 0 ||
    subject?.name.trim() === ""
  ) {
    throw new ApiError(
      400,
      "Subject details along with schedule and title are required"
    );
  }

  const existingSubjects = await Subject.find({
    userId: user?._id,
  });

  if (
    existingSubjects.some(
      (sub) => sub.subjectTitle === subject.name.trim().toLowerCase()
    )
  ) {
    throw new ApiError(409, "Subject with name already exists");
  }

  const isDuplicateTimeTable = existingSubjects.some((sub) =>
    sub.timeTable.some((timeTableEntry) =>
      subject.schedule.some(
        (scheduleEntry: timeTable) =>
          timeTableEntry.day === scheduleEntry.day &&
          timeTableEntry.time === scheduleEntry.time
      )
    )
  );

  if (isDuplicateTimeTable) {
    throw new ApiError(400, "A subject with the same timetable already exists");
  }

  const createdSubject = await Subject.create({
    userId: user?._id,
    subjectTitle: subject.name.trim().toLowerCase(),
    timeTable: subject.schedule,
  });

  if (!createdSubject) {
    throw new ApiError(
      500,
      "Error while adding subject, Please try again later!"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(createdSubject, "subject added successfully"));
});

const handleGetAllSubjects = asyncHandler(
  async (req: Request, res: Response) => {
    const subjects = await Subject.find({ userId: req.user?._id });
    if (!subjects) {
      return res.status(200).json(new ApiResponse(null, "no subjects found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(subjects, "subjects sent successfully"));
  }
);

const handleDeleteSubject = asyncHandler(
  async (req: Request, res: Response) => {
    const subjectId = req.params.id;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      throw new ApiError(404, "no subject found");
    }

    try {
      await Subject.deleteOne({ _id: subjectId });
    } catch (error) {
      throw new ApiError(500, "error deleting the subject");
    }

    return res.status(200).json("subject deleted successfully");
  }
);

export { handleAddSubject, handleGetAllSubjects, handleDeleteSubject };

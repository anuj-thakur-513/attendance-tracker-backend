import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../core/ApiError";
import { Subject } from "../models/Subject";
import ApiResponse from "../core/ApiResponse";

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

  const existingSubject = await Subject.findOne({
    userId: user?._id,
    subjectTitle: subject.name.trim().toLowerCase(),
  });

  if (existingSubject) {
    throw new ApiError(409, "Subject with name already exists");
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
  async (req: Request, res: Response) => {}
);

export { handleAddSubject, handleGetAllSubjects };

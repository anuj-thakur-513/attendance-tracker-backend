import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../core/ApiError";
import { Attendance } from "../models/Attendance";
import ApiResponse from "../core/ApiResponse";
import { Subject } from "../models/Subject";
import {
  calculateLecturesCanSkip,
  calculateLecturesNeeded,
} from "../utils/additionalClassesRequired";

const handleAddAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const { lectureData } = req.body;
    const { subjectId } = req.params;
    console.log(lectureData);
    const user = req.user;
    if (
      !lectureData ||
      !lectureData.subjectId ||
      !lectureData.date ||
      lectureData?.happened === null ||
      lectureData?.attended === null
    ) {
      throw new ApiError(400, "all lecture details are required");
    }

    let subjectAttendance = await Attendance.findOne({
      userId: user?._id,
      subjectId: subjectId,
    });

    if (!subjectAttendance) {
      subjectAttendance = await Attendance.create({
        userId: user?._id,
        subjectId: lectureData.subjectId,
        lectures: [
          {
            date: lectureData.date,
            lectureHappened: lectureData.happened,
            lectureAttended: lectureData.attended,
          },
        ],
        totalLectures: 1,
        totalLecturesAttended: lectureData.attended ? 1 : 0,
      });
    } else {
      subjectAttendance = await Attendance.findOneAndUpdate(
        { userId: user?._id, subjectId: subjectId },
        {
          $push: {
            lectures: {
              date: lectureData.date,
              lectureHappened: lectureData.happened,
              lectureAttended: lectureData.attended ? true : false,
            },
          },
          $inc: {
            totalLectures: 1,
            totalLecturesAttended: lectureData.attended ? 1 : 0,
          },
        },
        { upsert: true, new: true }
      );
    }

    return res.status(200).json(
      new ApiResponse(
        {
          totalLectures: subjectAttendance?.totalLectures,
          totalLecturesAttended: subjectAttendance?.totalLecturesAttended,
        },
        "attendance updated successfully"
      )
    );
  }
);

const handleGetAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { date } = req.query;
    if (!date) {
      throw new ApiError(400, "date is required to get attendance");
    }

    const subjects = await Subject.find({ userId: req.user?._id });

    if (!subjects || subjects.length === 0) {
      return res.status(200).json(new ApiResponse(null, "No subjects found"));
    }

    const attendanceRecords = await Attendance.find({
      userId: user?._id,
      lectures: { $elemMatch: { date: date } },
    }).select("subjectId");

    // Extract subject IDs that have attendance records for today
    const attendedSubjectIds = attendanceRecords.map((record) =>
      record.subjectId.toString()
    );

    // Separate subjects into those that have been marked and those that haven't
    const attendanceAdded = subjects.filter((subject) => {
      {
        return attendedSubjectIds.includes(subject._id.toString());
      }
    });

    const finalData = {
      attendanceAdded,
      subjects,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(finalData, "Subjects and attendance data retrieved")
      );
  }
);

const handleGetDetailedAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    const attendance = await Attendance.find({ userId: user?._id })
      .populate({
        path: "subjectId",
        select: "subjectTitle",
      })
      .select("subjectId totalLectures totalLecturesAttended -_id");

    const finalData = attendance.map((item) => {
      return {
        subjectId: item.subjectId,
        totalLectures: item.totalLectures,
        totalLecturesAttended: item.totalLecturesAttended,
        attendancePercentage: (
          ((item.totalLecturesAttended as number) /
            (item.totalLectures as number)) *
          100
        ).toFixed(1),
        lecturesRequiredForNecessaryAttendance: calculateLecturesNeeded(
          item.totalLectures as number,
          item.totalLecturesAttended as number,
          75
        ),
        lecturesCanBeSkipped: calculateLecturesCanSkip(
          item.totalLectures as number,
          item.totalLecturesAttended as number,
          75
        ),
      };
    });

    return res
      .status(200)
      .json(
        new ApiResponse(finalData, "detailed attendance sent successfully")
      );
  }
);

export {
  handleAddAttendance,
  handleGetAttendance,
  handleGetDetailedAttendance,
};

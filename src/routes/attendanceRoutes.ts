import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  handleAddAttendance,
  handleGetAttendance,
} from "../controllers/attendanceController";

const attendanceRouter = Router();

attendanceRouter.get("/today", [authMiddleware, handleGetAttendance]);
attendanceRouter.post("/:subjectId", [authMiddleware, handleAddAttendance]);

export default attendanceRouter;

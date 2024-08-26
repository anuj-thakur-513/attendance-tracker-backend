import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  handleAddAttendance,
  handleGetAttendance,
  handleGetDetailedAttendance,
} from "../controllers/attendanceController";

const attendanceRouter = Router();

attendanceRouter.get("/today", [authMiddleware, handleGetAttendance]);
attendanceRouter.get("/detailed", [
  authMiddleware,
  handleGetDetailedAttendance,
]);
attendanceRouter.post("/:subjectId", [authMiddleware, handleAddAttendance]);

export default attendanceRouter;

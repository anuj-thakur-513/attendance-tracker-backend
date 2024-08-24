import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  handleAddSubject,
  handleGetAllSubjects,
} from "../controllers/subjectController";

const subjectRouter = Router();

subjectRouter.post("/add", [authMiddleware, handleAddSubject]);
subjectRouter.get("/all", [authMiddleware, handleGetAllSubjects]);

export default subjectRouter;

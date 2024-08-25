import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  handleAddSubject,
  handleDeleteSubject,
  handleGetAllSubjects,
} from "../controllers/subjectController";

const subjectRouter = Router();

subjectRouter.post("/add", [authMiddleware, handleAddSubject]);
subjectRouter.get("/all", [authMiddleware, handleGetAllSubjects]);
subjectRouter.delete("/:id", [authMiddleware, handleDeleteSubject]);

export default subjectRouter;

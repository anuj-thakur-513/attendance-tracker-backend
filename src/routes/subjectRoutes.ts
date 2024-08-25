import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  handleAddSubject,
  handleDeleteSubject,
  handleEditSubject,
  handleGetAllSubjects,
} from "../controllers/subjectController";

const subjectRouter = Router();

subjectRouter.post("/add", [authMiddleware, handleAddSubject]);
subjectRouter.get("/all", [authMiddleware, handleGetAllSubjects]);

subjectRouter.patch("/:id", [authMiddleware, handleEditSubject]);
subjectRouter.delete("/:id", [authMiddleware, handleDeleteSubject]);

export default subjectRouter;

import { Router } from "express";
import authRouter from "./authRoutes";
import subjectRouter from "./subjectRoutes";
import attendanceRouter from "./attendanceRoutes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/subject", subjectRouter);
v1Router.use("/attendance", attendanceRouter);

export default v1Router;

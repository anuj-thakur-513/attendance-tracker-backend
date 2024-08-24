import { Router } from "express";
import authRouter from "./authRoutes";
import subjectRouter from "./subjectRoutes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/subject", subjectRouter);

export default v1Router;

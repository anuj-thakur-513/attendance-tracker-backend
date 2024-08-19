import { Router } from "express";
import { handleGoogleAuth } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", handleGoogleAuth);

export default authRouter;

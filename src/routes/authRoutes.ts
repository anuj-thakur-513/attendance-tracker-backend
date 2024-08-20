import { Router } from "express";
import {
  handleGetUser,
  handleGoogleAuth,
  handleLogout,
} from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/signup", handleGoogleAuth);
authRouter.patch("/logout", [authMiddleware, handleLogout]);
authRouter.get("/user", [authMiddleware, handleGetUser]);

export default authRouter;

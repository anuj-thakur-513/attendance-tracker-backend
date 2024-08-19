import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import v1Router from "./routes/v1Router";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to Attendance-Tracker API</h1>");
});

app.use("/api/v1", v1Router);

export default app;

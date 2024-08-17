import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to Attendance-Tracker API</h1>");
});

export default app;

import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import v1Router from "./routes/v1Router";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://myattendance-tracker.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http:", "https:"], // This allows mixed content
      upgradeInsecureRequests: null, // This disables automatic upgrades
    },
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to Attendance-Tracker API</h1>");
});

app.use("/api/v1", v1Router);

export default app;

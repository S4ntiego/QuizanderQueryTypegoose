require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/connectDB";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import quizRouter from "./routes/quiz.route";
import { S3Client } from "@aws-sdk/client-s3";

const app = express();
app.use(cors({ origin: config.get<string>("origin"), credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//s3 bucket
export const s3 = new S3Client({
  credentials: {
    accessKeyId: config.get<string>("accessKey"),
    secretAccessKey: config.get<string>("secretAccessKey"),
  },
  region: config.get<string>("bucketRegion"),
});

// 5. Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);

// Unknown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

//retrieved value should be a number
const port = config.get<number>("port");
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  connectDB();
});

require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import config from "config";
import quizModel from "../models/quiz.model";
import { DeleteQuizInput, UpdateQuizInput } from "../schema/quiz.schema";
import { s3 } from "../app";
import crypto from "crypto";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  findQuizzes,
  deleteQuiz,
  findQuizById,
} from "../services/quiz.service";
import AppError from "../utils/appError";
import checkPermissions from "../utils/checkPermissions";
import finishedQuizModel from "../models/finishedQuiz.model";
import { finished } from "stream";

//CREATE QUIZ
export const createQuizHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const coverImageName = crypto.randomBytes(32).toString("hex");

  const params = {
    Bucket: config.get<string>("bucketName"),
    Key: coverImageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const putCommand = new PutObjectCommand(params);
  const { title, description, questions, category } = req.body;
  try {
    if (!title || !description || !questions || !category) {
      next(new AppError("Please provide all values", 400));
    }
    await s3.send(putCommand);
    const quiz = await quizModel.create({
      title: JSON.parse(title),
      category: JSON.parse(category),
      description: JSON.parse(description),
      questions: JSON.parse(questions),
      coverImage: coverImageName,
      createdBy: res.locals.user._id,
    });
    res.status(200).json({
      status: "success",
      data: {
        quiz,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//GET QUIZ BY ID
export const getQuizHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await findQuizById(req.params._id);

    if (!quiz) {
      return next(new AppError("Quiz with that ID not found", 404));
    }

    quiz.coverImage =
      "https://d16toh0t29dtt4.cloudfront.net/" + quiz.coverImage;

    res.status(200).json({
      status: "success",
      data: {
        quiz,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

//GET ALL QUIZZES
export const getAllQuizzesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quizzes = await findQuizzes();
    const totalQuizzes = await quizModel.countDocuments();
    for (const quiz of quizzes) {
      quiz.coverImage =
        "https://d16toh0t29dtt4.cloudfront.net/" + quiz.coverImage;
    }
    res.status(200).json({
      status: "success",
      result: totalQuizzes,
      data: {
        quizzes,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

//UPDATE QUIZ
export const updateQuizHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const coverImageName = crypto.randomBytes(32).toString("hex");

  try {
    const quiz = await findQuizById(req.params._id);
    if (!quiz) {
      return next(new AppError("Quiz with that ID not found", 404));
    }
    checkPermissions(res.locals.user._id, quiz.createdBy._id);
    const { title, description, category, questions } = req.body;
    if (req.file) {
      const createObjectParams = {
        Bucket: config.get<string>("bucketName"),
        Key: coverImageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const putCommand = new PutObjectCommand(createObjectParams);
      await s3.send(putCommand);
      const deleteObjectParams = {
        Bucket: config.get<string>("bucketName"),
        Key: quiz.coverImage,
      };
      const updatedQuiz = await quizModel.findByIdAndUpdate(
        req.params._id,
        {
          title: JSON.parse(title),
          category: JSON.parse(category),
          description: JSON.parse(description),
          questions: JSON.parse(questions),
          coverImage: coverImageName,
        },
        { new: true, runValidators: true }
      );
      const deleteCommand = new DeleteObjectCommand(deleteObjectParams);
      await s3.send(deleteCommand);
      return res.status(200).json({
        status: "success",
        data: {
          quiz: updatedQuiz,
        },
      });
    } else {
      const updatedQuiz = await quizModel.findByIdAndUpdate(
        req.params._id,
        {
          title: JSON.parse(title),
          category: JSON.parse(category),
          description: JSON.parse(description),
          questions: JSON.parse(questions),
        },
        { new: true, runValidators: true }
      );
      res.status(200).json({
        status: "success",
        data: {
          quiz: updatedQuiz,
        },
      });
    }
  } catch (err: any) {
    next(err);
  }
};

//SAVE QUIZ RESULTS
export const quizResultsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedResults = await finishedQuizModel.findOneAndUpdate(
      { finishedBy: res.locals.user._id, relatedQuiz: req.params._id },
      {
        title: req.body.quizTitle,
        $push: { scores: req.body.score },
        $inc: { takes: 1 },
      },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        results: updatedResults,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

//DELETE QUIZ
export const deleteQuizHandler = async (
  req: Request<DeleteQuizInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await findQuizById(req.params._id);

    if (!quiz) {
      return next(new AppError("Quiz with that ID not found", 404));
    }

    // check permissions
    checkPermissions(res.locals.user._id, quiz.createdBy._id);

    const deleteObjectParams = {
      Bucket: config.get<string>("bucketName"),
      Key: quiz.coverImage,
    };

    const deleteCommand = new DeleteObjectCommand(deleteObjectParams);
    await s3.send(deleteCommand);

    await deleteQuiz(req.params._id, {});

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};

//PARSE FORM DATA
export const parseQuizFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) return next();
    const parsedBody = { ...JSON.parse(req.body.data) };
    if (req.body.coverImage) {
      parsedBody["coverImage"] = req.body.coverImage;
    }

    next();
  } catch (err: any) {
    next(err);
  }
};

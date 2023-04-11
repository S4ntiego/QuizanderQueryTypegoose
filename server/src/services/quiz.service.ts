require("dotenv").config();
import quizModel from "../models/quiz.model";
import { QueryOptions } from "mongoose";

// Get all quizzes
export const findQuizzes = async () => {
  return await quizModel.find();
};

// Find quiz by Id
export const findQuizById = async (_id: string) => {
  return await quizModel.findById(_id).lean();
};

//Delete quiz
export const deleteQuiz = async (_id: string, options: QueryOptions) => {
  return await quizModel.findByIdAndDelete(_id);
};

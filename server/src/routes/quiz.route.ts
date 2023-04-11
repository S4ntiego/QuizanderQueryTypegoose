import express from "express";
import {
  createQuizHandler,
  deleteQuizHandler,
  getAllQuizzesHandler,
  getQuizHandler,
  parseQuizFormData,
  updateQuizHandler,
  quizResultsHandler,
} from "../controllers/quiz.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createQuizSchema,
  deleteQuizSchema,
  updateQuizSchema,
} from "../schema/quiz.schema";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Get quizzes route
router.get("/", getAllQuizzesHandler);

// Get quiz by id
router.get("/:_id", getQuizHandler);

router.use(deserializeUser, requireUser);

// Delete quiz route
router.delete(`/:_id`, validate(deleteQuizSchema), deleteQuizHandler);

// Patch quiz route
router.patch(
  `/:_id`,
  validate(updateQuizSchema),
  upload.single("coverImage"),
  updateQuizHandler
);

// Save quiz results
router.patch(`/save/:_id`, quizResultsHandler);

// Create quiz route
router.post("/", upload.single("coverImage"), createQuizHandler);

export default router;

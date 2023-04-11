import express from "express";
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
} from "../controllers/auth.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { createUserSchema, loginUserSchema } from "../schema/user.schema";
import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: "Too many requests from this IP, please try again after 1 minute",
});

const router = express.Router();

// Register user route
router.post(
  "/register",
  apiLimiter,
  validate(createUserSchema),
  registerHandler
);

// Login user route
router.post("/login", apiLimiter, validate(loginUserSchema), loginHandler);

//Refresh access token route
router.get("/refresh", refreshAccessTokenHandler);

router.use(deserializeUser, requireUser);
//Logout User
router.get("/logout", logoutHandler);

export default router;

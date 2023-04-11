import { NextFunction, Request, Response } from "express";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import { verifyJwt } from "../utils/jwt";
import redisClient from "../utils/connectRedis";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new AppError("You are not logged in", 401));
    }

    // Validate Access Token

    //The <> is a way to define a type for the function, which in this case is {userId: string}. This tells TypeScript that the function verifyJwt should return an object that has a property userId of type string. The returned object is then assigned to the variable decoded.
    const decoded = verifyJwt<{ userId: string }>(
      access_token,
      "accessTokenPublicKey"
    );

    if (!decoded) {
      return next(new AppError(`Invalid token or user doesn't exist`, 401));
    }

    const session = await redisClient.get(JSON.stringify(decoded.userId));

    if (!session) {
      return next(new AppError(`User session has expired`, 401));
    }

    // Check if user still exist
    const user = await findUserById(JSON.parse(session)._id);

    if (!user) {
      return next(new AppError(`User with that token no longer exist`, 401));
    }

    // This is really important (Helps us know if the user is logged in from other controllers)
    // You can do: (req.user or res.locals.user)
    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};

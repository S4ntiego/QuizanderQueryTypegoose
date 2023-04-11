import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import { findAllUsers, findUser, findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import checkPermissions from "../utils/checkPermissions";

export const getMeHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findAllUsers();
    res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

//UPDATE USER
export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the collection
    const user = await findUserById(res.locals.user._id);

    // Check if user exist and password is correct
    if (!user) {
      return next(new AppError("User doesn't exist"));
    }

    if (user.email !== req.body.email) {
      const userWithNewEmail = await findUser({ email: req.body.email });

      if (userWithNewEmail) {
        return next(new AppError("That email is already taken"));
      }
    }

    checkPermissions(res.locals.user._id, user._id);

    const { name, email } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        name,
        email,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

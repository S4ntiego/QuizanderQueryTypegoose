import { ObjectId } from "mongoose";
import AppError from "./appError";

const checkPermissions = (
  resLocalsUserId: ObjectId,
  resourceUserId: ObjectId
) => {
  if (resLocalsUserId.toString() === resourceUserId.toString()) return;

  throw new AppError("Not authorized to access this route", 403);
};

export default checkPermissions;

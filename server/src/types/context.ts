import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";

export type Context = {
  req: Request;
  res: Response;
  next: NextFunction;
  deserializeUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<User | undefined>;
};

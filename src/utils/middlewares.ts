import { NextFunction, Request, Response } from "express";
import CustomError from "./error_handler";
import * as jwt from "jsonwebtoken";
import HttpStatusCode from "./http_status_code";

export const errorMiddlware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode: number = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    type: err.type,
  });
};

export const validateUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    const err = new CustomError(
      "Unable to authorize the user",
      HttpStatusCode.UNAUTHORIZED,
      "UNAUTHORIZED"
    );
    return next(err);
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      const err = new CustomError(
        "Unable to authorize the user",
        HttpStatusCode.UNAUTHORIZED,
        "UNAUTHORIZED"
      );
      return next(err);
    }
    // setting the value of user in req to user that we get
    req.user = user;
    next();
  });
};

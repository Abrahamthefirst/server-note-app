import { NextFunction, Request, Response } from "express";
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
  GoneError,
  UnauthorizedError,
  ForbiddenError,
} from "./error";
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = "Internal server error";
  let statusCode = 500;

  if (
    err instanceof ConflictError ||
    err instanceof NotFoundError ||
    err instanceof BadRequestError ||
    err instanceof GoneError ||
    err instanceof UnauthorizedError ||
    ForbiddenError
  ) {
    statusCode = err.status;
    message = err.message;
  }
  res.status(statusCode).json({ message });
};

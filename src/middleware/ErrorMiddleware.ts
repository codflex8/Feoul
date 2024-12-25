import { NextFunction, Response, Request } from "express";
import multer from "multer";
import ApiError from "../utils/ApiError";
import { httpLogger } from "../utils/logger";

const sendErrorForDev = (err: any, res: Response) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForProd = (err: any, res: Response) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again..", 401);

export const globalError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("ddddddd", err);
  err.statusCode = err.statusCode || 500;
  httpLogger.error(err.message, { error: err.stack });
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    sendErrorForProd(err, res);
  }
};

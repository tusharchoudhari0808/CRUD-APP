import { Response } from "express";

// Success response helper
export const success = <T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error response helper
export const error = (
  res: Response,
  message: string = "Internal Server Error",
  statusCode: number = 500,
  details?: unknown
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: details ?? null,
  });
};
































































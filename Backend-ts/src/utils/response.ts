import { Response } from "express";

// Success response helper
export const success = (
  res: Response,
  data: any = {},
  message = "Success",
  status = 200
) => {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
};

// Error response helper
export const error = (
  res: Response,
  message = "Internal Server Error",
  status = 500,
  details: any = null
) => {
  return res.status(status).json({
    success: false,
    message,
    error: details,
  });
};

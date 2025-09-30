import { Response } from "express";

/* ============================================================
   Success Response Helper
   - Standardizes successful API responses
   - Generic type <T> ensures type safety for `data`
============================================================ */
export const success = <T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,   // flag indicating request succeeded
    message,         // human-readable message
    data,            // payload returned to client
  });
};

/* ============================================================
   Error Response Helper
   - Standardizes error responses
   - Optional `details` can provide additional debugging info
============================================================ */
export const error = (
  res: Response,
  message: string = "Internal Server Error",
  statusCode: number = 500,
  details?: unknown
) => {
  return res.status(statusCode).json({
    success: false,  // flag indicating request failed
    message,         // human-readable error message
    error: details ?? null,  // optional error details
  });
};

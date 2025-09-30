import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

/**
 * Validation Middleware Factory
 * -----------------------------
 * Creates an Express middleware that validates the incoming request
 * against a given Joi schema. If validation fails, it sends a 400 response.
 *
 * @param schema - Joi validation schema to validate the request data.
 * @param property - The part of the request object to validate.
 *                   Defaults to "body". Can be "body", "query", or "params".
 *
 * @returns Express middleware function.
 */
export const validate =
  (schema: ObjectSchema, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    // Validate the specified request property using Joi
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      // If validation fails, return 400 Bad Request with details
      res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.details.map((d) => d.message), // Extract error messages
      });
      return;
    }

    // If validation passes, continue to the next middleware/handler
    next();
  };

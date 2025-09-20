import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtPayload } from "../Types/types";

const SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: jwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    
    const decoded = jwt.verify(token, SECRET) as jwtPayload & JwtPayload;

    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("Token verification failed:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

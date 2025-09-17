import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../Types/types";

const SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: jwtPayload; // attach decoded payload to request
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // 2️ Verify token
    const decoded = jwt.verify(token, SECRET) as jwtPayload;

    // 3️ Attach decoded payload to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

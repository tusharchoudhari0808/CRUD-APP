import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { decryptToken } from "../utils/crypto";

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const encryptedToken = req.cookies?.token; // encrypted cookie

    if (!encryptedToken) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    //  Decrypt token from cookie
    const decrypted = decryptToken(encryptedToken);

    //  Verify JWT after decryption
    const decoded = jwt.verify(decrypted, process.env.JWT_SECRET || "secret") as JwtPayload;

    req.user = decoded; // attach decoded payload
    next();
  } catch (err) {
    console.error("Token verification   error:", err);

    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: "Token has expired" });
    }

    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

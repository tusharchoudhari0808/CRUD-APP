import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { decryptToken } from "../utils/crypto";
import { AuthRequest } from "../Types/types";

const SECRET = process.env.JWT_SECRET!;

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const encryptionToken = req.cookies?.token;
    if (!encryptionToken) return res.status(401).json({ message: "No token provided" });

    // Decrypt + verify
    const decrypted = decryptToken(encryptionToken);
    const decoded = jwt.verify(decrypted, SECRET) as JwtPayload;


    // Attach user info
    req.user = {
      id: decoded.adminId,
      email: decoded.email,
      role: decoded.role, 
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

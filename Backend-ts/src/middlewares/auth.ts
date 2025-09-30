import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { decryptToken } from "../utils/crypto";   // Custom decryption util
import { AuthRequest } from "../Types/types";     // Extended Request type

//  Load JWT secret (must exist, else throw)
const SECRET = process.env.JWT_SECRET!;

/* ============================================================
   VERIFY TOKEN MIDDLEWARE
   - Read JWT from cookie
   - Decrypt and verify token
   - Attach decoded user payload to req.user
   - Deny access if invalid or missing
============================================================ */
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️ Extract encrypted token from cookie
    const encryptionToken = req.cookies?.token;
    if (!encryptionToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2️ Decrypt stored token (since you encrypted before saving in cookie)
    const decrypted = decryptToken(encryptionToken);

    // 3️ Verify JWT signature & expiry
    const decoded = jwt.verify(decrypted, SECRET) as JwtPayload;

    // 4️ Attach user info to request object (for downstream use)
    req.user = {
      id: decoded.adminId,
      email: decoded.email,
      role_id: decoded.role_id,
    };

    // 5️ Continue to next middleware/route
    next();
  } catch (err) {
    console.error(" Token verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

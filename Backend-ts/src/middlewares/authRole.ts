import {  Response, NextFunction } from "express";
import { AuthRequest } from "../Types/types";
import Roles from "../utils/role.json";

function authorisePermission(permission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized: No role found" });
    }

    // find role in roles.json
    const roleConfig = Roles.roles.find((r) => r.name === userRole);

    if (!roleConfig) {
      return res.status(403).json({ message: "Access denied. Role not recognized" });
    }

    // check if permission is in this role's permissions
    if (!roleConfig.permissions.includes(permission)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
}

export default authorisePermission;







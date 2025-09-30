import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

/* ============================================================
   Base User Interface
   - Common fields for all users
============================================================ */
export interface User {
  first_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  address: string;
}

/* ============================================================
   Admin Interfaces
============================================================ */
export interface Admin {
  name: string;
  email: string;
  password: string;
}

// Payload for admin login request
export interface AdminLogin {
  email: string;
  password: string;
}

/* ============================================================
   JWT Payload
   - Extends jsonwebtoken's JwtPayload
   - Includes adminId, email, and role_id
============================================================ */
export interface jwtPayload extends JwtPayload {
  adminId: number;
  email: string;
  role_id: number;
}

/* ============================================================
   User Record
   - Represents a user stored in the database
============================================================ */
export interface UserRecord extends User {
  user_id: number;
}

/* ============================================================
   Request Body Types
   - For creating and updating users
============================================================ */
export interface CreateUserBody extends User {}
export interface UpdateUserBody extends User {}

/* ============================================================
   Pagination Query Parameters
   - Used for querying paginated user lists
============================================================ */
export interface PaginationQuery {
  page?: string;       // current page number
  limit?: string;      // items per page
  first_name?: string; // optional filter by first name
  sortKey?: string;    // column to sort by
  order?: string;      // 'ASC' or 'DESC'
}

/* ============================================================
   Pagination Response Structure
============================================================ */
export interface PaginatedResult {
  page: number;          // current page number
  limit: number;         // items per page
  total: number;         // total matching items
  totalPages: number;    // total pages available
  data: UserRecord[];    // array of users for current page
}

/* ============================================================
   Extended Request Interface
   - Adds authenticated user info (from JWT) to Express Request
============================================================ */
export interface AuthRequest extends Request {
  user?: {
    id: number;         // matches jwtPayload.adminId
    email?: string;
    role_id: number;    // user's role
  };
}

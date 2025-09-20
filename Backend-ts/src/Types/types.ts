import { JwtPayload } from "jsonwebtoken";

// Base User 
export interface User {
  first_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  address: string;
}

//Admin types
export interface Admin {
  name: string;
  email: string;
  password: string;
}

export interface AdminLogin {
  email: string;
  password: string;
}

//  JWT Payload extends JsonWebToken's payload
export interface jwtPayload extends JwtPayload {
  adminId: number;
  email: string;
}

// User record
export interface UserRecord extends User {
  user_id: number;
}

// Request bodies
export interface CreateUserBody extends User {}
export interface UpdateUserBody extends User {}

// Pagination query params
export interface PaginationQuery {
  page?: string;
  limit?: string;
  first_name?: string;
  sortKey?: string;
  order?: string;
}

// Pagination response
export interface PaginatedResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: UserRecord[];
}

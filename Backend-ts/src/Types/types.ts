
// Base User 
export interface User {
  first_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  address: string;
}

// user_id
export interface UserRecord extends User {
  user_id: number;
}

// Request bodys
export interface CreateUserBody extends User {}
export interface UpdateUserBody extends User {}

// Request params
export interface UserIdParam {
  id: string;
}

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

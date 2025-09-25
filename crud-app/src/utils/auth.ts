// import { jwtDecode } from "jwt-decode";

// interface JWTPayload {
//   exp: number;
// }

// export function isTokenExpired(token: string): boolean {
//   try {
//     const decoded = jwtDecode<JWTPayload>(token);
//     const now = Date.now() / 1000;
//     return decoded.exp < now;
//   } catch {
//     return true; // invalid token
//   }
// }

// export function autoLogoutAtExpiry(token: string) {
//   const decoded = jwtDecode<JWTPayload>(token);
//   const delay = decoded.exp * 1000 - Date.now();
//   console.log(`Token expires in ${delay / 1000} seconds`);

//   if (delay > 0) {
//     setTimeout(() => {
//       localStorage.removeItem("token");
//       alert("Session expired. Please login again.");
//       window.location.href = "/login";
//     }, delay);
//   }
// }

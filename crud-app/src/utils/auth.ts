
import {jwtDecode} from "jwt-decode";

interface JWTPayload {
  exp: number; // expiry timestamp in seconds
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const now = Date.now() / 1000; // seconds
    return decoded.exp < now;
  } catch {
    return true; // invalid token
  }
}

export function autoLogoutAtExpiry(token: string) {
  const decoded = jwtDecode<JWTPayload>(token);
  const delay = decoded.exp * 1000 - Date.now(); // ms left

  if (delay > 0) {
    setTimeout(() => {
      localStorage.removeItem("token");
      alert("Session expired. Please login again.");
      window.location.href = "/login";
    }, delay);
  }
}

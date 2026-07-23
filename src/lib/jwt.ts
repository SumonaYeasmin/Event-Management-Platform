import { jwtDecode } from "jwt-decode";

export interface DecodedUser {
  email: string;
  role: string;
}

// Reusable token decoding helper function
export function decodeToken(token: string): DecodedUser | null {
  try {
    return jwtDecode<DecodedUser>(token);
  } catch (error) {
    console.error("JWT Decode error:", error);
    return null;
  }
}

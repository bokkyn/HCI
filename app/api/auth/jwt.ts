// app/lib/auth/jwt.ts
// @ts-nocheck
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-this";

export interface DecodedToken {
  userId: string;
  email: string;
  ime: string;
  prezime: string;
  iat: number;
  exp: number;
}

// Funkcija za provjeru tokena iz cookija
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Funkcija za dekodiranje tokena iz headera
export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

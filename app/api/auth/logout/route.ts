// app/api/auth/logout/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";

export async function POST() {
  // Kreiraj response
  const response = NextResponse.json({
    success: true,
    message: "Uspješno odjavljen",
  });

  // Obriši cookie
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    expires: new Date(0), // Postavi u prošlost da se obriše
    path: "/",
  });

  return response;
}

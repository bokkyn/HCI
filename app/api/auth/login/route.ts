// app/api/auth/login/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-this";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("Login attempt for:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email i lozinka su obavezni" },
        { status: 400 },
      );
    }

    await connectDB();

    // Pronađi korisnika
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json(
        { error: "Netočan email ili lozinka" },
        { status: 401 },
      );
    }

    // Provjeri lozinku
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log("Invalid password for:", email);
      return NextResponse.json(
        { error: "Netočan email ili lozinka" },
        { status: 401 },
      );
    }

    // Kreiraj JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        ime: user.ime,
        prezime: user.prezime,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("Login successful for:", email);

    // Kreiraj user response sa SVIM podacima
    const userResponse = {
      id: user._id.toString(),
      ime: user.ime,
      prezime: user.prezime,
      puno_ime: `${user.ime} ${user.prezime}`,
      email: user.email,
      spol: user.spol || "",
      datum_rodenja: user.datum_rodenja || null,
      lokacija: user.lokacija || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
      xp_total: user.xp_total || 0,
      xp_kategorije: {
        hrana: user.xp_hrana || 0,
        sport: user.xp_sport || 0,
        urbano: user.xp_urbano || 0,
        priroda: user.xp_priroda || 0,
        art: user.xp_art || 0,
        misterija: user.xp_misterija || 0,
        ostalo: user.xp_ostalo || 0,
      },
      ukupno_tura: user.ukupno_tura || 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Kreiraj response sa cookie
    const response = NextResponse.json({
      success: true,
      message: "Uspješna prijava",
      user: userResponse,
      token,
    });

    // Postavi cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 dana
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Greška pri prijavi:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { 
        error: "Došlo je do greške pri prijavi",
        details: error?.message 
      },
      { status: 500 }
    );
  }
}

// app/api/auth/me/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-this";

export async function GET() {
  try {
    // Provjeri cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    // Verificiraj token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Nevažeći token" }, { status: 401 });
    }

    await connectDB();

    // Pronađi korisnika
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 },
      );
    }

    // Kreiraj response sa SVIM podacima
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

    return NextResponse.json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Greška u /me endpointu:", error);
    return NextResponse.json({ error: "Došlo je do greške" }, { status: 500 });
  }
}

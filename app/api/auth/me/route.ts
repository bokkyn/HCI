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
    const user = await User.findById(decoded.userId).lean();

    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 },
      );
    }

    // Debug: Provjeri što dolazi iz baze
    console.log("User from DB:", {
      id: user._id,
      xp_total: user.xp_total,
      xp_kategorije: user.xp_kategorije,
      xp_kategorije_type: typeof user.xp_kategorije,
      xp_kategorije_isMap: user.xp_kategorije instanceof Map,
    });

    // PRAVILNO: Konvertiraj Map u običan objekt sa HRVATSKIM KLJUČEVIMA
    let xpKategorije = {};

    if (user.xp_kategorije) {
      if (user.xp_kategorije instanceof Map) {
        // Ako je Map, pretvori u objekt
        xpKategorije = Object.fromEntries(user.xp_kategorije);
      } else if (typeof user.xp_kategorije === "object") {
        // Ako je već objekt, koristi ga
        xpKategorije = user.xp_kategorije;
      }
    }

    // Osiguraj da sve kategorije imaju vrijednost
    const defaultKategorije = {
      Hrana: 0,
      Sport: 0,
      Urbano: 0,
      Priroda: 0,
      Povijest: 0,
      Kultura: 0,
      Misterija: 0,
      Zabava: 0,
    };

    // Spoji defaultne sa stvarnim vrijednostima
    xpKategorije = { ...defaultKategorije, ...xpKategorije };

    console.log("Formatted xpKategorije:", xpKategorije);

    // Kreiraj response sa SVIM podacima - koristi HRVATSKE KLJUČEVE
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
      cover_slika: user.cover_slika || "",
      xp_total: user.xp_total || 0,
      xp_kategorije: xpKategorije, // Ovo je sada objekt sa hrvatskim ključevima
      ukupno_tura: user.ukupno_tura || 0,
      ukupno_ocjena: user.ukupno_ocjena || 0,
      prosjecna_ocjena: user.prosjecna_ocjena || 0,
      postavke: user.postavke || {
        privatnost_profila: "javno",
        email_obavijesti: true,
        push_obavijesti: true,
      },
      email_verificiran: user.email_verificiran || false,
      verificiran_korisnik: user.verificiran_korisnik || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      user: userResponse,
    });
  } catch (error: any) {
    console.error("Greška u /me endpointu:", error);
    console.error("Error details:", error?.message, error?.stack);
    return NextResponse.json(
      { error: "Došlo je do greške", details: error?.message },
      { status: 500 },
    );
  }
}

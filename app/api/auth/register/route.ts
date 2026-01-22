// app/api/auth/register/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ime, prezime, email, password } = body;

    // Validacija obaveznih polja
    if (!ime || !prezime || !email || !password) {
      return NextResponse.json(
        { error: "Ime, prezime, email i lozinka su obavezni" },
        { status: 400 },
      );
    }

    // Validacija emaila
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Unesite validnu email adresu" },
        { status: 400 },
      );
    }

    // Validacija lozinke
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Lozinka mora imati najmanje 6 znakova" },
        { status: 400 },
      );
    }

    await connectDB();

    // Provjeri da li korisnik već postoji
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Korisnik s ovom email adresom već postoji" },
        { status: 409 },
      );
    }

    // Hash lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kreiraj korisnika sa password_hash
    const user = await User.create({
      ime: ime.trim(),
      prezime: prezime.trim(),
      email: email.toLowerCase().trim(),
      password_hash: hashedPassword, // Ovo je bitno - koristi password_hash
      spol: body.spol || null,
      datum_rodenja: body.datum_rodenja || null,
      lokacija: body.lokacija || "",
      bio: body.bio || "",
      avatar:
        body.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(`${ime}+${prezime}`)}&background=2b946f&color=fff`,
    });

    // Konvertiraj Map u običan objekt
    const xpKategorijeObj = {};
    user.xp_kategorije.forEach((value, key) => {
      xpKategorijeObj[key] = value;
    });

    // Kreiraj response bez osjetljivih podataka
    const userResponse = {
      id: user._id.toString(),
      ime: user.ime,
      prezime: user.prezime,
      puno_ime: `${user.ime} ${user.prezime}`,
      email: user.email,
      spol: user.spol,
      datum_rodenja: user.datum_rodenja,
      lokacija: user.lokacija,
      bio: user.bio,
      avatar: user.avatar,
      xp_total: user.xp_total,
      xp_kategorije: xpKategorijeObj,
      ukupno_tura: user.ukupno_tura,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        message: "Korisnik uspješno registriran",
        user: userResponse,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Greška pri registraciji:", error);

    let errorMessage = "Došlo je do greške pri registraciji";
    let statusCode = 500;

    if (error.name === "ValidationError") {
      errorMessage = "Podaci nisu validni";
      statusCode = 400;
    } else if (error.code === 11000) {
      errorMessage = "Email adresa već postoji";
      statusCode = 409;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: statusCode },
    );
  }
}

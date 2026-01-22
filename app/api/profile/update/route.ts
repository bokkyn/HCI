// app/api/profile/update/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper funkcija
function authenticateUser(req: Request) {
  try {
    // Provjeri cookie
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const tokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
      if (tokenMatch) {
        const decoded = jwt.verify(tokenMatch[1], JWT_SECRET) as any;
        return decoded.userId;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function PUT(req: Request) {
  try {
    const userId = authenticateUser(req);

    if (!userId) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Received update data:", body);

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 },
      );
    }

    // Ažuriraj polja - POPRAVLJENO za datum_rodenja
    if (body.ime !== undefined) user.ime = body.ime;
    if (body.prezime !== undefined) user.prezime = body.prezime;
    if (body.spol !== undefined) user.spol = body.spol || null;
    if (body.lokacija !== undefined) user.lokacija = body.lokacija;
    if (body.bio !== undefined) user.bio = body.bio;
    if (body.avatar !== undefined) user.avatar = body.avatar;

    // POPRAVLJENO: Ako je prazan string, postavi na null
    if (body.datum_rodenja !== undefined) {
      if (body.datum_rodenja && body.datum_rodenja.trim() !== "") {
        const birthDate = new Date(body.datum_rodenja);
        if (birthDate > new Date()) {
          return NextResponse.json(
            { error: "Datum rođenja ne može biti u budućnosti" },
            { status: 400 },
          );
        }
        user.datum_rodenja = birthDate;
      } else {
        user.datum_rodenja = null; // Ako je prazan string
      }
    }

    await user.save();
    console.log("User updated successfully");

    // Kreiraj response
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
      xp_hrana: user.xp_hrana || 0,
      xp_sport: user.xp_sport || 0,
      xp_urbano: user.xp_urbano || 0,
      xp_priroda: user.xp_priroda || 0,
      xp_art: user.xp_art || 0,
      xp_misterija: user.xp_misterija || 0,
      xp_ostalo: user.xp_ostalo || 0,
      ukupno_tura: user.ukupno_tura || 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "Profil uspješno ažuriran",
      user: userResponse,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    // Bolji error messages
    let errorMessage = "Došlo je do greške pri ažuriranju profila";
    if (error.name === "ValidationError") {
      errorMessage =
        "Podaci nisu validni: " +
        Object.values(error.errors)
          .map((e: any) => e.message)
          .join(", ");
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

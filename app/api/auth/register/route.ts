import { supabase } from "@/app/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, ime, prezime } = body;

    if (!email || !password || !ime || !prezime) {
      return NextResponse.json(
        { error: "Sva polja su obavezna" },
        { status: 400 }
      );
    }

    // 1. Registruj korisnika
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          ime: ime.trim(),
          prezime: prezime.trim(),
        },
      },
    });

    if (authError) {
      console.error("Register auth error:", authError);
      return NextResponse.json(
        {
          error: authError.message.includes("already registered")
            ? "Email je već registriran"
            : authError.message,
        },
        { status: 400 }
      );
    }

    // 2. Kreiraj profil
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: email.trim().toLowerCase(),
        ime: ime.trim(),
        prezime: prezime.trim(),
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Ne vraćamo grešku jer je korisnik već registrovan
      }
    }

    return NextResponse.json({
      success: true,
      message: authData.session
        ? "Registracija uspješna"
        : "Provjerite email za verifikaciju",
      user: authData.user,
      requiresEmailConfirmation: !authData.session,
    });
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json({ error: "Došlo je do greške" }, { status: 500 });
  }
}

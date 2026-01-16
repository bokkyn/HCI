import { supabase } from "@/app/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, ime, prezime } = body;

    if (!action || !email || !password) {
      return NextResponse.json(
        { error: "Email i lozinka su obavezni" },
        { status: 400 }
      );
    }

    switch (action) {
      case "login":
        return await handleLogin(email, password);

      case "register":
        if (!ime || !prezime) {
          return NextResponse.json(
            { error: "Ime i prezime su obavezni" },
            { status: 400 }
          );
        }
        return await handleRegister(email, password, ime, prezime);

      case "logout":
        return await handleLogout();

      default:
        return NextResponse.json(
          { error: "Nepoznata akcija" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Došlo je do greške" },
      { status: 500 }
    );
  }
}

// Login handler
async function handleLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Ako koristimo profiles tabelu, dohvati podatke
  let userData = data.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user?.id)
    .single();

  if (profile) {
    userData = { ...data.user, ...profile };
  }

  return NextResponse.json({
    success: true,
    user: userData,
    session: data.session,
  });
}

// Register handler
async function handleRegister(
  email: string,
  password: string,
  ime: string,
  prezime: string
) {
  // 1. Registruj korisnika
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // 2. Kreiraj profil ako korisnik postoji
  if (authData.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      ime,
      prezime,
    });

    if (profileError) {
      console.error("Greška pri kreiranju profila:", profileError);
      // Ne vraćamo grešku jer je korisnik već registrovan
    }
  }

  return NextResponse.json({
    success: true,
    message: "Registracija uspješna",
    user: authData.user,
  });
}

// Logout handler
async function handleLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Odjavljeni ste",
  });
}

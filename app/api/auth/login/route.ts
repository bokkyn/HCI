import { supabase } from "@/app/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email i lozinka su obavezni" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return NextResponse.json(
        {
          error: error.message.includes("Invalid")
            ? "Pogrešan email ili lozinka"
            : error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Došlo je do greške" }, { status: 500 });
  }
}

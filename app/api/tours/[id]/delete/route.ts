// app/api/tours/[id]/delete/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import { Tour } from "@/app/models/Tour";
import { User } from "@/app/models/User";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-this";

// Helper funkcija za autentikaciju
function authenticateUser(req: Request) {
  try {
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // PROMJENA OVDJE
) {
  try {
    const { id } = await params; // PROMJENA OVDJE - await params
    const tourId = id;

    const userId = authenticateUser(req);

    if (!userId) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    if (!ObjectId.isValid(tourId)) {
      return NextResponse.json(
        { error: `Nevažeći ID ture: ${tourId}` },
        { status: 400 },
      );
    }

    await connectDB();

    // Pronađi turu
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return NextResponse.json(
        { error: "Tura nije pronađena" },
        { status: 404 },
      );
    }

    // Provjeri vlasništvo
    if (tour.guide_id.toString() !== userId) {
      return NextResponse.json(
        { error: "Nemate ovlasti za brisanje ove ture" },
        { status: 403 },
      );
    }

    // Obriši turu
    await Tour.findByIdAndDelete(tourId);

    // Ažuriraj korisnikov broj tura
    await User.findByIdAndUpdate(userId, {
      $inc: { ukupno_tura: -1 },
    });

    console.log("Tour deleted successfully:", tourId);

    return NextResponse.json({
      success: true,
      message: "Tura je uspješno obrisana",
    });
  } catch (error: any) {
    console.error("Tour delete error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške pri brisanju ture" },
      { status: 500 },
    );
  }
}

// app/api/tours/create/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import { Tour } from "@/app/models/Tour";
import { User } from "@/app/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-this";

// Helper funkcija za autentikaciju (isti kao u profile/update)
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

export async function POST(req: Request) {
  try {
    const userId = authenticateUser(req);

    if (!userId) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Tour creation data:", body);

    // Validacija obaveznih polja
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: "Naslov je obavezan" },
        { status: 400 },
      );
    }

    if (!body.description || !body.description.trim()) {
      return NextResponse.json({ error: "Opis je obavezan" }, { status: 400 });
    }

    await connectDB();

    // Provjeri da li korisnik postoji
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 },
      );
    }

    // Kreiraj turu
    const newTour = new Tour({
      guide_id: userId,
      title: body.title.trim(),
      description: body.description.trim(),
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      meeting_point: body.meeting_point || "",
      price_per_group: body.price_per_group || 0,
      max_people: body.max_people || 1,
      duration: body.duration || "",
      location: body.location || "",
      image_urls: Array.isArray(body.image_urls) ? body.image_urls : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      language_offered: Array.isArray(body.language_offered)
        ? body.language_offered.length > 0
          ? body.language_offered
          : ["Hrvatski"]
        : ["Hrvatski"],
      is_featured: body.is_featured || false,
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      rating: 0,
      reviews_count: 0,
      status: "active",
    });

    await newTour.save();

    // Ažuriraj korisnikov broj tura
    user.ukupno_tura = (user.ukupno_tura || 0) + 1;
    await user.save();

    console.log("Tour created successfully:", newTour._id);

    // Kreiraj response sa detaljima ture
    const tourResponse = {
      id: newTour._id.toString(),
      guide_id: newTour.guide_id.toString(),
      title: newTour.title,
      description: newTour.description,
      highlights: newTour.highlights,
      meeting_point: newTour.meeting_point,
      price_per_group: newTour.price_per_group,
      max_people: newTour.max_people,
      duration: newTour.duration,
      location: newTour.location,
      image_urls: newTour.image_urls,
      tags: newTour.tags,
      language_offered: newTour.language_offered,
      is_featured: newTour.is_featured,
      benefits: newTour.benefits,
      rating: newTour.rating,
      reviews_count: newTour.reviews_count,
      status: newTour.status,
      guide: {
        name: `${user.ime} ${user.prezime}`,
        avatar: user.avatar || "",
        rating: 0, // Možeš dodati rating za vodiča kasnije
        tours_led: user.ukupno_tura || 0,
      },
      createdAt: newTour.createdAt,
      updatedAt: newTour.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "Tura je uspješno kreirana",
      tour: tourResponse,
    });
  } catch (error: any) {
    console.error("Tour creation error:", error);

    let errorMessage = "Došlo je do greške pri kreiranju ture";
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

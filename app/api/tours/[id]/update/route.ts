// app/api/tours/[id]/update/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import { Tour } from "@/app/models/Tour";
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

// PUT ruta za ažuriranje ture
export async function PUT(
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

    // Provjeri validnost ObjectId
    if (!ObjectId.isValid(tourId)) {
      return NextResponse.json(
        { error: `Nevažeći ID izleta: ${tourId}` },
        { status: 400 },
      );
    }

    const body = await req.json();
    console.log("Update tour data for tour:", tourId, "by user:", userId);

    await connectDB();

    // Pronađi turu
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return NextResponse.json(
        { error: "Izlet nije pronađen" },
        { status: 404 },
      );
    }

    // Provjeri vlasništvo - samo vlasnik može ažurirati
    if (tour.guide_id.toString() !== userId) {
      return NextResponse.json(
        { error: "Nemate ovlasti za ažuriranje ovog izleta" },
        { status: 403 },
      );
    }

    // Ažuriraj polja
    if (body.title !== undefined && body.title.trim() !== "") {
      tour.title = body.title.trim();
    }

    if (body.description !== undefined && body.description.trim() !== "") {
      tour.description = body.description.trim();
    }

    // Optional fields - ažuriraj samo ako su poslani
    if (body.highlights !== undefined) {
      tour.highlights = Array.isArray(body.highlights) ? body.highlights : [];
    }

    if (body.meeting_point !== undefined) {
      tour.meeting_point = body.meeting_point;
    }

    if (body.price_per_group !== undefined) {
      const price = Number(body.price_per_group);
      if (!isNaN(price) && price >= 0) {
        tour.price_per_group = price;
      }
    }

    if (body.max_people !== undefined) {
      const maxPeople = Number(body.max_people);
      if (!isNaN(maxPeople) && maxPeople >= 1) {
        tour.max_people = maxPeople;
      }
    }

    if (body.duration !== undefined) {
      tour.duration = body.duration;
    }

    if (body.location !== undefined) {
      tour.location = body.location;
    }

    if (body.image_urls !== undefined) {
      tour.image_urls = Array.isArray(body.image_urls) ? body.image_urls : [];
    }

    if (body.tags !== undefined) {
      tour.tags = Array.isArray(body.tags) ? body.tags : [];
    }

    if (body.language_offered !== undefined) {
      tour.language_offered =
        Array.isArray(body.language_offered) && body.language_offered.length > 0
          ? body.language_offered
          : ["Hrvatski"];
    }

    if (body.is_featured !== undefined) {
      tour.is_featured = Boolean(body.is_featured);
    }

    if (body.benefits !== undefined) {
      tour.benefits = Array.isArray(body.benefits) ? body.benefits : [];
    }

    if (body.status !== undefined) {
      const validStatuses = ["active", "inactive", "pending"];
      if (validStatuses.includes(body.status)) {
        tour.status = body.status;
      }
    }

    await tour.save();
    console.log("Tour updated successfully:", tourId);

    // Dohvati guide podatke za response
    const { User } = await import("@/app/models/User");
    const user = await User.findById(userId);

    // Kreiraj response
    const tourResponse = {
      id: tour._id.toString(),
      guide_id: tour.guide_id.toString(),
      title: tour.title,
      description: tour.description,
      highlights: tour.highlights,
      meeting_point: tour.meeting_point,
      price_per_group: tour.price_per_group,
      max_people: tour.max_people,
      duration: tour.duration,
      location: tour.location,
      image_urls: tour.image_urls,
      tags: tour.tags,
      language_offered: tour.language_offered,
      is_featured: tour.is_featured,
      benefits: tour.benefits,
      rating: tour.rating,
      reviews_count: tour.reviews_count,
      status: tour.status,
      guide: user
        ? {
            name: `${user.ime} ${user.prezime}`,
            avatar: user.avatar || "",
            rating: 0,
            tours_led: user.ukupno_tura || 0,
          }
        : null,
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "Izlet je uspješno ažuriran",
      tour: tourResponse,
    });
  } catch (error: any) {
    console.error("Tour update error:", error);

    let errorMessage = "Došlo je do greške pri ažuriranju izleta";
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

// PATCH ruta za parcijalno ažuriranje
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // PROMJENA OVDJE
) {
  return PUT(req, { params });
}

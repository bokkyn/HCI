// app/api/tours/[id]/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { Tour } from "@/app/models/Tour";
import { User } from "@/app/models/User";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // VAŽNO: U Next.js 14, params je Promise
    const { id } = await params;
    const tourId = id;

    console.log("Fetching tour with ID:", tourId);

    if (!ObjectId.isValid(tourId)) {
      return NextResponse.json({ error: "Nevažeći ID izleta" }, { status: 400 });
    }

    await connectDB();

    // Get tour - OBAVEZNO uključite categories
    const tour = await Tour.findById(tourId).lean();

    if (!tour) {
      return NextResponse.json(
        { error: "Izlet nije pronađen" },
        { status: 404 },
      );
    }

    // Debug: Provjeri kategorije iz MongoDB-a
    console.log("Tour data from DB:", {
      id: tour._id.toString(),
      title: tour.title,
      categories: tour.categories,
      categoriesType: typeof tour.categories,
      isArray: Array.isArray(tour.categories),
      tags: tour.tags,
      tagsType: typeof tour.tags,
      isTagsArray: Array.isArray(tour.tags),
    });

    // Get guide info
    const guide = await User.findById(tour.guide_id, {
      ime: 1,
      prezime: 1,
      avatar: 1,
      ukupno_tura: 1,
      bio: 1,
      xp_total: 1,
      lokacija: 1,
      // Dodaj i rating ako imaš
    }).lean();

    // OBAVEZNO: Osiguraj da su kategorije array
    let categoriesArray = [];
    if (Array.isArray(tour.categories)) {
      categoriesArray = tour.categories;
    } else if (tour.categories) {
      // Ako nije array, a postoji, pretvori u array
      categoriesArray = [tour.categories];
    }

    // OBAVEZNO: Osiguraj da su tagovi array
    let tagsArray = [];
    if (Array.isArray(tour.tags)) {
      tagsArray = tour.tags;
    } else if (tour.tags) {
      // Ako nije array, a postoji, pretvori u array
      tagsArray = [tour.tags];
    }

    // OBAVEZNO: Osiguraj da su ostali array polja ispravna
    const highlightsArray = Array.isArray(tour.highlights)
      ? tour.highlights
      : [];
    const imageUrlsArray = Array.isArray(tour.image_urls)
      ? tour.image_urls
      : [];
    const benefitsArray = Array.isArray(tour.benefits) ? tour.benefits : [];
    const languageOfferedArray = Array.isArray(tour.language_offered)
      ? tour.language_offered
      : ["Hrvatski"];

    // Format response
    const tourResponse = {
      id: tour._id.toString(),
      guide_id: tour.guide_id.toString(),
      title: tour.title,
      description: tour.description,
      highlights: highlightsArray,
      meeting_point: tour.meeting_point || "",
      price_per_group: tour.price_per_group || 0,
      max_people: tour.max_people || 1,
      duration: tour.duration || "",
      location: tour.location || "",
      image_urls: imageUrlsArray,
      categories: categoriesArray, // OBAVEZNO: Koristi osigurani array
      tags: tagsArray, // OBAVEZNO: Koristi osigurani array
      language_offered: languageOfferedArray,
      is_featured: tour.is_featured || false,
      benefits: benefitsArray,
      rating: tour.rating || 0,
      reviews_count: tour.reviews_count || 0,
      reservations_count: tour.reservations_count || 0, // DODANO: Broj rezervacija
      status: tour.status || "active",
      guide: guide
        ? {
            id: guide._id.toString(),
            name: `${guide.ime || ""} ${guide.prezime || ""}`.trim() || "Vodič",
            avatar: guide.avatar || "",
            bio: guide.bio || "",
            location: guide.lokacija || "",
            rating: 0, // Dodaj kasnije rating sistem
            tours_led: guide.ukupno_tura || 0,
            xp: guide.xp_total || 0,
          }
        : {
            name: "Nepoznati vodič",
            avatar: "",
            bio: "",
            location: "",
            rating: 0,
            tours_led: 0,
            xp: 0,
          },
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
    };

    console.log("Formatted tour response:", {
      id: tourResponse.id,
      title: tourResponse.title,
      categories: tourResponse.categories,
      categoriesLength: tourResponse.categories.length,
      tags: tourResponse.tags,
      tagsLength: tourResponse.tags.length,
    });

    return NextResponse.json({
      success: true,
      data: tourResponse,
    });
  } catch (error: any) {
    console.error("Get tour by ID error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške pri dohvaćanju izleta" },
      { status: 500 },
    );
  }
}

// Dodajte i PUT metodu za ažuriranje ture ako treba
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tourId = id;

    if (!ObjectId.isValid(tourId)) {
      return NextResponse.json({ error: "Nevažeći ID izleta" }, { status: 400 });
    }

    const body = await req.json();
    await connectDB();

    // Provjeri da li izlet postoji
    const existingTour = await Tour.findById(tourId);
    if (!existingTour) {
      return NextResponse.json(
        { error: "Izlet nije pronađen" },
        { status: 404 },
      );
    }

    // Ažuriraj izlet
    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      { $set: body },
      { new: true, runValidators: true },
    );

    return NextResponse.json({
      success: true,
      message: "Izlet je uspješno ažuriran",
      data: updatedTour,
    });
  } catch (error: any) {
    console.error("Update tour error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške pri ažuriranju izleta" },
      { status: 500 },
    );
  }
}

// Dodajte i DELETE metodu ako treba
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tourId = id;

    if (!ObjectId.isValid(tourId)) {
      return NextResponse.json({ error: "Nevažeći ID izleta" }, { status: 400 });
    }

    await connectDB();

    // Provjeri da li izlet postoji
    const existingTour = await Tour.findById(tourId);
    if (!existingTour) {
      return NextResponse.json(
        { error: "Izlet nije pronađen" },
        { status: 404 },
      );
    }

    // Obriši izlet
    await Tour.findByIdAndDelete(tourId);

    return NextResponse.json({
      success: true,
      message: "Izlet je uspješno obrisan",
    });
  } catch (error: any) {
    console.error("Delete tour error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške pri brisanju izleta" },
      { status: 500 },
    );
  }
}

// app/api/reservations/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { Reservation } from "@/app/models/Reservation";
import { Tour } from "@/app/models/Tour";
import { User } from "@/app/models/User";

export async function GET(req: Request) {
  console.log("=== API REZERVACIJE POKRENUT (GET) ===");

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    const status = searchParams.get("status");

    console.log("Parametri:", { userId, status });

    // Build query
    const query: any = {};
    if (userId) query.user_id = userId;
    if (status) query.status = status;

    console.log("MongoDB query:", JSON.stringify(query, null, 2));

    // Dohvati rezervacije
    const reservations = await Reservation.find(query)
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Pronađeno ${reservations.length} rezervacija`);

    // Ako nema rezervacija, vrati prazan array
    if (reservations.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          reservations: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      });
    }

    // Dohvati sve tour ID-ove
    const tourIds = reservations
      .map((r) => r.tour_id?.toString())
      .filter(Boolean);

    // Dohvati ture
    const tours = await Tour.find({ _id: { $in: tourIds } }).lean();

    // Map za brži pristup
    const tourMap = new Map();
    tours.forEach((tour) => {
      tourMap.set(tour._id.toString(), {
        title: tour.title,
        location: tour.location,
        image_urls: tour.image_urls || [],
        duration: tour.duration,
        price_per_group: tour.price_per_group,
      });
    });

    // Formatiraj rezervacije
    const formattedReservations = reservations.map((res) => {
      const tourInfo = tourMap.get(res.tour_id?.toString()) || {};

      return {
        id: res._id.toString(),
        tour_id: res.tour_id?.toString(),
        user_id: res.user_id?.toString(),
        guide_id: res.guide_id?.toString(),
        booking_date: res.booking_date,
        booking_time: res.booking_time,
        number_of_people: res.number_of_people,
        total_price: res.total_price,
        status: res.status,
        completed_at: res.completed_at || res.updatedAt,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        tour_title: tourInfo.title || "Nepoznata tura",
        location: tourInfo.location || "Lokacija nije dostupna",
        image_urls: tourInfo.image_urls || [],
        duration: tourInfo.duration || "Nepoznato",
        price_per_group: tourInfo.price_per_group || 0,
        guide_name: "Vodič", // Ovo možeš naknadno dohvatiti
      };
    });

    console.log(`Formatirano ${formattedReservations.length} rezervacija`);

    return NextResponse.json({
      success: true,
      data: {
        reservations: formattedReservations,
        pagination: {
          page: 1,
          limit: 20,
          total: formattedReservations.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    });
  } catch (error: any) {
    console.error("Greška u GET /api/reservations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Došlo je do greške pri dohvaćanju rezervacija",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

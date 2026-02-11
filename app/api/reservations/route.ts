//@ts-nocheck
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import { Reservation } from "@/app/models/Reservation";
import { Tour } from "@/app/models/Tour";
import { User } from "@/app/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-this";

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

export async function GET(req: Request) {
  try {
    const userId = authenticateUser(req);
    const { searchParams } = new URL(req.url);

    const requestedUserId = searchParams.get("user_id");
    const status = searchParams.get("status");
    const guideId = searchParams.get("guide_id");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 20;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page"))
      : 1;
    const skip = (page - 1) * limit;

    // Ako se dohvaća za drugog korisnika, provjeri autentikaciju
    if (requestedUserId && requestedUserId !== userId) {
      return NextResponse.json(
        { error: "Nemate dozvolu za pristup" },
        { status: 403 },
      );
    }

    await connectDB();

    // Build query
    const query: any = {};

    if (requestedUserId) {
      query.user_id = requestedUserId;
    }

    if (guideId) {
      query.guide_id = guideId;
    }

    if (status) {
      // Podrška za više statusa odvojenih zarezom
      const statuses = status.split(",");
      query.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
    }

    // Dohvati rezervacije
    const reservations = await Reservation.find(query)
      .sort({ booking_date: -1, booking_time: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Dohvati ukupan broj za paginaciju
    const total = await Reservation.countDocuments(query);

    // Dohvati dodatne podatke za svaku rezervaciju
    const enrichedReservations = await Promise.all(
      reservations.map(async (res) => {
        const tour = await Tour.findById(res.tour_id).lean();
        const guide = await User.findById(res.guide_id).lean();

        return {
          id: res._id.toString(),
          tour_id: res.tour_id.toString(),
          user_id: res.user_id.toString(),
          guide_id: res.guide_id.toString(),
          booking_date: res.booking_date,
          booking_time: res.booking_time,
          number_of_people: res.number_of_people,
          total_price: res.total_price,
          special_notes: res.special_notes,
          requirements: res.requirements,
          status: res.status,
          contact_phone: res.contact_phone,
          contact_email: res.contact_email,
          completed_at: res.completed_at,
          cancelled_at: res.cancelled_at,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
          tour_title: tour?.title || "Obrisana tura",
          location: tour?.location || "Lokacija nedostupna",
          duration: tour?.duration || "Nepoznato",
          image_urls: tour?.image_urls || [],
          guide_name: guide
            ? `${guide.ime} ${guide.prezime}`
            : "Nepoznat vodič",
          guide_email: guide?.email,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: {
        reservations: enrichedReservations,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Došlo je do greške pri dohvaćanju rezervacija" },
      { status: 500 },
    );
  }
}

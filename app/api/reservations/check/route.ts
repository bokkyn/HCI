// app/api/reservations/check/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { Reservation } from "@/app/models/Reservation";
import { Tour } from "@/app/models/Tour";
import { User } from "@/app/models/User";

export async function GET() {
  console.log("=== REZERVACIJE CHECK API ===");

  try {
    await connectDB();

    // 1. Ukupan broj rezervacija
    const totalReservations = await Reservation.countDocuments();
    console.log("Ukupan broj rezervacija u bazi:", totalReservations);

    // 2. Sve rezervacije (ograničeno na 20)
    const allReservations = await Reservation.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    console.log("Zadnjih 20 rezervacija:", allReservations.length);

    // 3. Statusi rezervacija - koliko ima pending, confirmed, completed, cancelled
    const statusCounts = await Reservation.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    console.log("Statusi rezervacija:", statusCounts);

    // 4. Rezervacije po korisnicima
    const userReservations = await Reservation.aggregate([
      { $group: { _id: "$user_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    console.log("Top 10 korisnika po broju rezervacija:", userReservations);

    // 5. Dohvati detalje za prikaz
    const formattedReservations = await Promise.all(
      allReservations.map(async (res) => {
        let tourTitle = "Nepoznata tura";
        let userName = "Nepoznati korisnik";

        if (res.tour_id) {
          const tour = await Tour.findById(res.tour_id).lean();
          tourTitle = tour?.title || "Nepoznata tura";
        }

        if (res.user_id) {
          const user = await User.findById(res.user_id).lean();
          userName = user
            ? `${user.ime || ""} ${user.prezime || ""}`.trim()
            : "Nepoznati korisnik";
        }

        return {
          id: res._id.toString(),
          user_id: res.user_id?.toString(),
          user_name: userName,
          tour_id: res.tour_id?.toString(),
          tour_title: tourTitle,
          status: res.status,
          booking_date: res.booking_date,
          booking_time: res.booking_time,
          number_of_people: res.number_of_people,
          total_price: res.total_price,
          created_at: res.createdAt,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      stats: {
        total_reservations: totalReservations,
        status_counts: statusCounts,
        user_reservations: userReservations,
      },
      recent_reservations: formattedReservations,
    });
  } catch (error: any) {
    console.error("Greška u check endpointu:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}

//@ts-nocheck
// app/api/reservations/create/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import { Reservation } from "@/app/models/Reservation";
import { Tour } from "@/app/models/Tour";
import { User } from "@/app/models/User";

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

export async function POST(req: Request) {
  try {
    const userId = authenticateUser(req);

    if (!userId) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Reservation creation data:", body);

    // Validacija obaveznih polja
    if (!body.tour_id) {
      return NextResponse.json(
        { error: "ID ture je obavezan" },
        { status: 400 },
      );
    }

    if (!body.booking_date) {
      return NextResponse.json(
        { error: "Datum rezervacije je obavezan" },
        { status: 400 },
      );
    }

    if (!body.booking_time) {
      return NextResponse.json(
        { error: "Vrijeme rezervacije je obavezno" },
        { status: 400 },
      );
    }

    if (!body.number_of_people || body.number_of_people < 1) {
      return NextResponse.json(
        { error: "Broj osoba mora biti barem 1" },
        { status: 400 },
      );
    }

    // Validacija formata vremena
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(body.booking_time)) {
      return NextResponse.json(
        { error: "Vrijeme mora biti u formatu HH:MM (npr. 14:30)" },
        { status: 400 },
      );
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

    // Provjeri da li tura postoji
    const tour = await Tour.findById(body.tour_id);
    if (!tour) {
      return NextResponse.json(
        { error: "Tura nije pronađena" },
        { status: 404 },
      );
    }

    // Provjeri da li je tura aktivna
    if (tour.status !== "active") {
      return NextResponse.json(
        { error: "Tura nije dostupna za rezervaciju" },
        { status: 400 },
      );
    }

    // Provjeri maksimalan broj ljudi
    if (body.number_of_people > tour.max_people) {
      return NextResponse.json(
        { error: `Maksimalan broj osoba za ovu turu je ${tour.max_people}` },
        { status: 400 },
      );
    }

    // Provjeri da li korisnik već ima rezervaciju za ovu turu na isti datum
    const existingReservation = await Reservation.findOne({
      tour_id: body.tour_id,
      user_id: userId,
      booking_date: new Date(body.booking_date),
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "Već imate rezervaciju za ovu turu na odabrani datum" },
        { status: 400 },
      );
    }

    // Izračunaj ukupnu cijenu (cijena po grupi * broj osoba, ali ako je cijena po grupi, onda samo ta cijena)
    let totalPrice = tour.price_per_group;
    // Ako je cijena po osobi, onda: totalPrice = tour.price_per_group * body.number_of_people
    // Ovako je postavljeno da cijena po grupi pokriva cijelu grupu

    // Provjeri datum - ne može rezervirati u prošlosti
    const bookingDate = new Date(body.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return NextResponse.json(
        { error: "Ne možete rezervirati u prošlosti" },
        { status: 400 },
      );
    }

    // Kreiraj rezervaciju
    const newReservation = new Reservation({
      tour_id: body.tour_id,
      user_id: userId,
      guide_id: tour.guide_id,
      booking_date: bookingDate,
      booking_time: body.booking_time,
      number_of_people: body.number_of_people,
      total_price: totalPrice,
      special_notes: body.special_notes || "",
      requirements: body.requirements || [],
      status: "pending",
      contact_phone: body.contact_phone || "",
      contact_email: body.contact_email || user.email,
    });

    await newReservation.save();

    // Ažuriraj broj rezervacija za turu
    await Tour.findByIdAndUpdate(body.tour_id, {
      $inc: { reservations_count: 1 },
    });

    // Ažuriraj korisnikovu statistiku
    await User.findByIdAndUpdate(tour.guide_id, {
      $inc: { ukupno_tura: 0.1 }, // Malo povećaj broj tura za vodiča
    });

    console.log("Reservation created successfully:", newReservation._id);

    // Kreiraj response
    const reservationResponse = {
      id: newReservation._id.toString(),
      tour_id: newReservation.tour_id.toString(),
      user_id: newReservation.user_id.toString(),
      guide_id: newReservation.guide_id.toString(),
      booking_date: newReservation.booking_date,
      booking_time: newReservation.booking_time,
      number_of_people: newReservation.number_of_people,
      total_price: newReservation.total_price,
      special_notes: newReservation.special_notes,
      requirements: newReservation.requirements,
      status: newReservation.status,
      contact_phone: newReservation.contact_phone,
      contact_email: newReservation.contact_email,
      createdAt: newReservation.createdAt,
      updatedAt: newReservation.updatedAt,
      tour_title: tour.title,
      guide_name: `${user.ime} ${user.prezime}`, // Ovo će se kasnije dohvatiti iz vodiča
    };

    return NextResponse.json({
      success: true,
      message: "Rezervacija je uspješno kreirana",
      reservation: reservationResponse,
    });
  } catch (error: any) {
    console.error("Reservation creation error:", error);

    let errorMessage = "Došlo je do greške pri kreiranju rezervacije";
    if (error.name === "ValidationError") {
      errorMessage =
        "Podaci nisu validni: " +
        Object.values(error.errors)
          .map((e: any) => e.message)
          .join(", ");
    } else if (error.name === "CastError") {
      errorMessage = "Nevalidan format podataka";
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

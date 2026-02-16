//@ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import { Tour } from "@/app/models/Tour";
import { User } from "@/app/models/User";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-this";

function authenticateUser(req: NextRequest) {
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
  } catch {
    return null;
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const tourId = id;

    const userId = authenticateUser(request);

    if (!userId) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    if (!ObjectId.isValid(tourId)) {
      return NextResponse.json(
        { error: `Nevažeći ID izleta: ${tourId}` },
        { status: 400 },
      );
    }

    await connectDB();

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return NextResponse.json(
        { error: "Izlet nije pronađen" },
        { status: 404 },
      );
    }

    if (tour.guide_id.toString() !== userId) {
      return NextResponse.json(
        { error: "Nemate ovlasti za brisanje ovog izleta" },
        { status: 403 },
      );
    }

    await Tour.findByIdAndDelete(tourId);

    await User.findByIdAndUpdate(userId, {
      $inc: { ukupno_tura: -1 },
    });

    console.log("Tour deleted successfully:", tourId);

    return NextResponse.json({
      success: true,
      message: "Izlet je uspješno obrisan",
    });
  } catch (error: any) {
    console.error("Tour delete error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške pri brisanju izleta" },
      { status: 500 },
    );
  }
}

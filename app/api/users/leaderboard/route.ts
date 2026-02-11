// app/api/users/leaderboard/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Dohvati sve korisnike sortirane po XP-u silazno
    const users = await User.find({})
      .select("ime prezime avatar xp_total")
      .sort({ xp_total: -1 })
      .lean();

    console.log(`Leaderboard: Dohvaćeno ${users.length} korisnika`);

    // Formatiraj podatke
    const formattedUsers = users.map((user, index) => ({
      id: user._id.toString(),
      rank: index + 1,
      name: `${user.ime || ""} ${user.prezime?.[0] || ""}.` || "Korisnik",
      fullName: `${user.ime || ""} ${user.prezime || ""}`,
      xp: user.xp_total || 0,
      avatar: user.avatar || "",
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error: any) {
    console.error("Greška u leaderboard API-ju:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Došlo je do greške pri dohvaćanju leaderboarda",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

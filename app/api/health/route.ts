// app/api/health/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const mongoState = mongoose.connection.readyState;
    const states = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
    };

    return NextResponse.json({
      status: "healthy",
      mongodb: {
        connected: mongoState === 1,
        state: states[mongoState as keyof typeof states] || "Unknown",
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        mongodb: {
          connected: false,
          state: mongoose.connection.readyState,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

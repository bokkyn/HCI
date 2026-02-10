// app/models/Reservation.ts
import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    tour_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guide_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Detalji rezervacije
    booking_date: {
      type: Date,
      required: true,
    },
    booking_time: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          // Validacija formata vremena HH:MM
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "Vrijeme mora biti u formatu HH:MM",
      },
    },
    number_of_people: {
      type: Number,
      required: true,
      min: 1,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Dodatne informacije
    special_notes: {
      type: String,
      default: "",
      maxlength: 500,
    },
    requirements: {
      type: [String],
      default: [],
    },

    // Status rezervacije
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    // Datumi
    cancelled_at: {
      type: Date,
      default: null,
    },
    completed_at: {
      type: Date,
      default: null,
    },

    // Dodatni podaci
    meeting_point_notes: {
      type: String,
      default: "",
    },
    contact_phone: {
      type: String,
      default: "",
    },
    contact_email: {
      type: String,
      default: "",
    },

    // Review
    review_left: {
      type: Boolean,
      default: false,
    },
    review_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexi za brže pretraživanje
ReservationSchema.index({ tour_id: 1, status: 1 });
ReservationSchema.index({ user_id: 1, createdAt: -1 });
ReservationSchema.index({ guide_id: 1, status: 1 });
ReservationSchema.index({ booking_date: 1, booking_time: 1 });

export const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);

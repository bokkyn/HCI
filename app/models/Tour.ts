// app/models/Tour.ts
import mongoose from "mongoose";

const TourSchema = new mongoose.Schema(
  {
    guide_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },
    highlights: {
      type: [String],
      default: [],
    },
    meeting_point: {
      type: String,
      default: "",
    },
    price_per_group: {
      type: Number,
      min: 0,
      default: 0,
    },
    max_people: {
      type: Number,
      min: 1,
      default: 1,
    },
    duration: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    image_urls: {
      type: [String],
      default: [],
    },
    // Kategorije
    categories: {
      type: [String],
      required: true,
      validate: {
        validator: function (categories: string[]) {
          return categories.length >= 1 && categories.length <= 3;
        },
        message: "Tura mora imati 1-3 kategorije",
      },
      enum: {
        values: [
          "Hrana",
          "Kultura",
          "Priroda",
          "Urbano",
          "Sport",
          "Misterija",
          "Povijest",
          "Zabava",
        ],
        message:
          "Kategorija mora biti jedna od: Hrana, Kultura, Priroda, Urbano, Sport, Misterija, Povijest, Zabava",
      },
    },
    // Tagovi (opcionalno)
    tags: {
      type: [String],
      default: [],
    },
    language_offered: {
      type: [String],
      default: ["Hrvatski"],
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    benefits: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews_count: {
      type: Number,
      default: 0,
    },
    reservations_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Index za brže pretraživanje
TourSchema.index({ guide_id: 1, createdAt: -1 });
TourSchema.index({ is_featured: 1, rating: -1 });
TourSchema.index({ categories: 1 });
TourSchema.index({ reservations_count: -1 });
TourSchema.index({ tags: 1 }); // Dodan index za tagove

export const Tour = mongoose.models.Tour || mongoose.model("Tour", TourSchema);

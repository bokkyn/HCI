// app/api/tours/route.ts
// @ts-nocheck
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { Tour } from "@/app/models/Tour";
import { User } from "@/app/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const location = searchParams.get("location");
    const guideId = searchParams.get("guide_id");
    const featured = searchParams.get("featured");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const sortBy = searchParams.get("sort_by") || "createdAt";
    const sortOrder = searchParams.get("sort_order") || "desc";
    const status = searchParams.get("status") || "active";

    // Build query
    const query: any = {};

    // Filter by status (default: active tours only)
    if (status) {
      query.status = status;
    }

    // Filter by guide
    if (guideId) {
      query.guide_id = guideId;
    }

    // Filter by featured
    if (featured === "true") {
      query.is_featured = true;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price_per_group = {};
      if (minPrice) {
        query.price_per_group.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price_per_group.$lte = parseFloat(maxPrice);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get total count for pagination
    const totalTours = await Tour.countDocuments(query);
    const totalPages = Math.ceil(totalTours / limit);

    // Get tours with populated guide info
    const tours = await Tour.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get guide IDs
    const guideIds = tours.map((tour) => tour.guide_id);

    // Get all guides in one query
    const guides = await User.find(
      { _id: { $in: guideIds } },
      { ime: 1, prezime: 1, avatar: 1, ukupno_tura: 1, xp_total: 1 },
    ).lean();

    // Create guide map for quick lookup
    const guideMap = new Map();
    guides.forEach((guide) => {
      guideMap.set(guide._id.toString(), {
        name: `${guide.ime} ${guide.prezime}`,
        avatar: guide.avatar || "",
        rating: 0, // Možeš dodati rating sistem kasnije
        tours_led: guide.ukupno_tura || 0,
        xp: guide.xp_total || 0,
      });
    });

    // Format tours with guide info
    const formattedTours = tours.map((tour) => ({
      id: tour._id.toString(),
      guide_id: tour.guide_id.toString(),
      title: tour.title,
      description: tour.description,
      highlights: tour.highlights || [],
      meeting_point: tour.meeting_point || "",
      price_per_group: tour.price_per_group || 0,
      max_people: tour.max_people || 1,
      duration: tour.duration || "",
      location: tour.location || "",
      image_urls: tour.image_urls || [],
      tags: tour.tags || [],
      language_offered: tour.language_offered || ["Hrvatski"],
      is_featured: tour.is_featured || false,
      benefits: tour.benefits || [],
      rating: tour.rating || 0,
      reviews_count: tour.reviews_count || 0,
      status: tour.status || "active",
      guide: guideMap.get(tour.guide_id.toString()) || {
        name: "Nepoznati vodič",
        avatar: "",
        rating: 0,
        tours_led: 0,
        xp: 0,
      },
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
    }));

    console.log(`Fetched ${formattedTours.length} tours (page ${page})`);

    return NextResponse.json({
      success: true,
      data: {
        tours: formattedTours,
        pagination: {
          page,
          limit,
          total: totalTours,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          location: location || null,
          guide_id: guideId || null,
          featured: featured === "true",
          tag: tag || null,
          search: search || null,
          minPrice: minPrice ? parseFloat(minPrice) : null,
          maxPrice: maxPrice ? parseFloat(maxPrice) : null,
          status,
        },
      },
    });
  } catch (error: any) {
    console.error("Get tours error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške pri dohvaćanju tura" },
      { status: 500 },
    );
  }
}

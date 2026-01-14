"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Grid,
  Map as MapIcon,
  Search,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import { Footer } from "@/components/Footer";

interface Tour {
  id: number;
  title: string;
  location: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  guide: string;
  durationHours: number;
  category: string;
  tags: string[];
  languages: string[];
  maxPeople: number;
  isFeatured: boolean;
}

const tours: Tour[] = [
  {
    id: 1,
    title: "Planinski Uspon Velebit",
    location: "Zadar, Hrvatska",
    lat: 44.1194,
    lng: 15.2314,
    price: 120,
    rating: 4.9,
    reviews: 127,
    image:
      "https://images.unsplash.com/photo-1471240840307-485d3bc42300?w=800",
    guide: "Marko Kovač",
    durationHours: 6,
    category: "Priroda",
    tags: ["Planinarenje", "Priroda", "Avantura"],
    languages: ["Hrvatski", "Engleski", "Njemački"],
    maxPeople: 8,
    isFeatured: true,
  },
  {
    id: 2,
    title: "Street Food Aventura",
    location: "Zagreb, Hrvatska",
    lat: 45.815,
    lng: 15.9819,
    price: 80,
    rating: 5.0,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1762674462382-6ea7fb670032?w=800",
    guide: "Ana Jurić",
    durationHours: 3,
    category: "Hrana",
    tags: ["Hrana", "Street Food", "Zagreb"],
    languages: ["Hrvatski", "Engleski"],
    maxPeople: 12,
    isFeatured: true,
  },
  {
    id: 3,
    title: "Kulturna Šetnja Starim Gradom",
    location: "Split, Hrvatska",
    lat: 43.5081,
    lng: 16.4402,
    price: 60,
    rating: 4.8,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1765266958853-5c6ae343a711?w=800",
    guide: "Ivana Marić",
    durationHours: 2,
    category: "Kultura",
    tags: ["Kultura", "Povijest", "Arhitektura"],
    languages: ["Hrvatski", "Engleski", "Talijanski"],
    maxPeople: 15,
    isFeatured: false,
  },
  {
    id: 4,
    title: "Kayaking Jadranska Avantura",
    location: "Dubrovnik, Hrvatska",
    lat: 42.6507,
    lng: 18.0944,
    price: 95,
    rating: 4.9,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1631165538791-295d382f5edd?w=800",
    guide: "Petar Novak",
    durationHours: 4,
    category: "Sport",
    tags: ["Sport", "Kayaking", "More"],
    languages: ["Hrvatski", "Engleski"],
    maxPeople: 10,
    isFeatured: false,
  },
  {
    id: 5,
    title: "Street Art & Urbana Kultura",
    location: "Rijeka, Hrvatska",
    lat: 45.3271,
    lng: 14.4422,
    price: 50,
    rating: 4.7,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1607220868624-dd855c2839be?w=800",
    guide: "Luka Horvat",
    durationHours: 2.5,
    category: "Kultura",
    tags: ["Umjetnost", "Street Art", "Urbano"],
    languages: ["Hrvatski"],
    maxPeople: 12,
    isFeatured: false,
  },
  {
    id: 6,
    title: "Wine Tasting Istra Tour",
    location: "Pula, Hrvatska",
    lat: 44.8666,
    lng: 13.8496,
    price: 140,
    rating: 5.0,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1537932155948-d391809047d5?w=800",
    guide: "Petra Babić",
    durationHours: 5,
    category: "Hrana",
    tags: ["Vino", "Degustacija", "Gastro"],
    languages: ["Hrvatski", "Engleski", "Talijanski"],
    maxPeople: 8,
    isFeatured: true,
  },
];

const categories = ["Sve", "Priroda", "Hrana", "Kultura", "Sport"] as const;
const allLanguages = [
  "Hrvatski",
  "Engleski",
  "Njemački",
  "Talijanski",
  "Španjolski",
] as const;

export default function ToursPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [selectedCategory, setSelectedCategory] = useState("Sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hoveredTour, setHoveredTour] = useState<number | null>(null);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      if (selectedCategory !== "Sve" && tour.category !== selectedCategory)
        return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !tour.title.toLowerCase().includes(q) &&
          !tour.tags.some((t) => t.toLowerCase().includes(q))
        )
          return false;
      }

      if (tour.price < priceRange[0] || tour.price > priceRange[1])
        return false;

      if (
        selectedLanguages.length &&
        !tour.languages.some((l) => selectedLanguages.includes(l))
      )
        return false;

      if (selectedDuration) {
        const h = tour.durationHours;
        if (selectedDuration === "short" && h > 3) return false;
        if (selectedDuration === "medium" && (h <= 3 || h > 5)) return false;
        if (selectedDuration === "long" && h <= 5) return false;
      }

      if (showFeaturedOnly && !tour.isFeatured) return false;

      return true;
    });
  }, [
    selectedCategory,
    searchQuery,
    priceRange,
    selectedLanguages,
    selectedDuration,
    showFeaturedOnly,
  ]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Sve");
    setPriceRange([0, 200]);
    setSelectedLanguages([]);
    setSelectedDuration("");
    setShowFeaturedOnly(false);
  };

  const getMapPosition = (lat: number, lng: number) => {
    const latPercent = ((lat - 42.4) / (46.5 - 42.4)) * 100;
    const lngPercent = ((lng - 13.5) / (19.5 - 13.5)) * 100;
    return { top: `${100 - latPercent}%`, left: `${lngPercent}%` };
  };

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        {/* HEADER */}
        <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl mb-4">Sve Ture</h1>
            <p className="text-lg text-white/90">
              Otkrijte {filteredTours.length} unikatnih iskustava
            </p>
          </div>
        </section>

        {/* SEARCH */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pretraži ture..."
              className="w-full pl-12 pr-4 py-4 rounded-xl shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X />
              </button>
            )}
          </div>

          {/* GRID */}
          {viewMode === "grid" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Link key={tour.id} href={`/tours/${tour.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                    <div className="relative h-48">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl mb-2">{tour.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {tour.location}
                      </p>
                      <p className="text-sm mb-4">
                        Trajanje: {tour.durationHours}h
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl text-[#2b946f]">
                          €{tour.price}
                        </span>
                        <button className="bg-[#ff6309] text-white px-4 py-2 rounded-full">
                          Rezerviraj
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

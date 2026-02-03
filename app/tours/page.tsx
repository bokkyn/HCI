"use client";

import { useState, useMemo, useEffect } from "react";
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
  Users,
  Clock,
  Award,
  Loader2,
} from "lucide-react";

interface Tour {
  id: string;
  title: string;
  location: string;
  price_per_group: number;
  rating: number;
  reviews_count: number;
  image_urls: string[];
  guide: {
    name: string;
    avatar: string;
    rating: number;
    tours_led: number;
  };
  duration: string;
  tags: string[];
  language_offered: string[];
  max_people: number;
  is_featured: boolean;
  highlights: string[];
  description: string;
  meeting_point: string;
  benefits: string[];
}

export default function ToursPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [selectedCategory, setSelectedCategory] = useState("Sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hoveredTour, setHoveredTour] = useState<string | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Dohvati ture s API-ja
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tours");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setTours(data.data.tours);
        } else {
          throw new Error(data.error || "Greška pri dohvaćanju tura");
        }
      } catch (err: any) {
        console.error("Error fetching tours:", err);
        setError(err.message || "Došlo je do greške pri učitavanju tura");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Ekstrakt kategorije iz tagova
  const allCategories = useMemo(() => {
    const categories = new Set<string>(["Sve"]);
    tours.forEach((tour) => {
      if (tour.tags && tour.tags.length > 0) {
        tour.tags.forEach((tag) => {
          const mainTag = tag.split(" ")[0]; // Uzmi prvu riječ kao kategoriju
          categories.add(mainTag);
        });
      }
    });
    return Array.from(categories);
  }, [tours]);

  // Ekstrakt sve jezike
  const allLanguages = useMemo(() => {
    const languages = new Set<string>();
    tours.forEach((tour) => {
      if (tour.language_offered) {
        tour.language_offered.forEach((lang) => languages.add(lang));
      }
    });
    return Array.from(languages);
  }, [tours]);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      // Filter po kategoriji
      if (selectedCategory !== "Sve") {
        if (
          !tour.tags ||
          !tour.tags.some((tag) =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase()),
          )
        ) {
          return false;
        }
      }

      // Filter po pretrazi
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !tour.title.toLowerCase().includes(q) &&
          !tour.location.toLowerCase().includes(q) &&
          !(tour.tags && tour.tags.some((tag) => tag.toLowerCase().includes(q)))
        ) {
          return false;
        }
      }

      // Filter po cijeni
      if (
        tour.price_per_group < priceRange[0] ||
        tour.price_per_group > priceRange[1]
      ) {
        return false;
      }

      // Filter po jezicima
      if (
        selectedLanguages.length > 0 &&
        (!tour.language_offered ||
          !tour.language_offered.some((lang) =>
            selectedLanguages.includes(lang),
          ))
      ) {
        return false;
      }

      // Filter po trajanju
      if (selectedDuration) {
        const durationStr = tour.duration || "";
        const hoursMatch = durationStr.match(/(\d+)/);
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;

        if (selectedDuration === "short" && hours > 3) return false;
        if (selectedDuration === "medium" && (hours <= 3 || hours > 5))
          return false;
        if (selectedDuration === "long" && hours <= 5) return false;
      }

      // Filter po featured
      if (showFeaturedOnly && !tour.is_featured) {
        return false;
      }

      return true;
    });
  }, [
    tours,
    selectedCategory,
    searchQuery,
    priceRange,
    selectedLanguages,
    selectedDuration,
    showFeaturedOnly,
  ]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
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

  // Formatiraj trajanje
  const formatDuration = (duration: string) => {
    if (!duration) return "Nije navedeno";
    return duration;
  };

  // Formatiraj cijenu
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-[#2b946f] animate-spin" />
          <p className="text-gray-600">Učitavanje tura...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-4">
            <h2 className="text-xl font-bold text-red-800 mb-2">Greška</h2>
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Pokušaj ponovno
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        {/* HEADER */}
        <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sve Ture</h1>
            <p className="text-lg text-white/90">
              Otkrijte {filteredTours.length} unikatnih iskustava
            </p>
          </div>
        </section>

        {/* CONTROLS */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* SEARCH BAR */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pretraži ture po naslovu, lokaciji ili tagovima..."
              className="w-full pl-12 pr-12 py-4 rounded-xl shadow border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* CATEGORIES */}
          <div className="flex flex-wrap gap-2 mb-6">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-[#2b946f] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* ADVANCED FILTERS TOGGLE */}
          <div className="mb-6">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Napredni filteri</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  showAdvancedFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* ADVANCED FILTERS PANEL */}
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Cijena (€{priceRange[0]} - €{priceRange[1]})
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2b946f]"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2b946f] mt-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>€0</span>
                    <span>€500</span>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Jezici</h3>
                  <div className="flex flex-wrap gap-2">
                    {allLanguages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedLanguages.includes(lang)
                            ? "bg-[#2b946f] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration & Featured */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Trajanje</h3>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    >
                      <option value="">Sve trajanje</option>
                      <option value="short">Do 3 sata</option>
                      <option value="medium">3-5 sati</option>
                      <option value="long">Preko 5 sati</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFeaturedOnly}
                      onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                      className="w-4 h-4 text-[#2b946f] rounded focus:ring-[#2b946f]"
                    />
                    <span className="text-gray-700">Samo istaknute ture</span>
                    <Award className="h-4 w-4 text-[#ff6309]" />
                  </label>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Očisti filtere
                </button>
              </div>
            </motion.div>
          )}

          {/* VIEW MODE TOGGLE */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">
                {filteredTours.length} rezultata
              </span>
            </div>
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "map"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <MapIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* TOURS GRID */}
          {viewMode === "grid" && (
            <>
              {filteredTours.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow border border-gray-200">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nema pronađenih tura
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Pokušajte promijeniti filtere ili pretragu
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Očisti filtere
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTours.map((tour) => (
                    <Link key={tour.id} href={`/tours/${tour.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredTour(tour.id)}
                        onMouseLeave={() => setHoveredTour(null)}
                      >
                        {/* Featured Badge */}
                        {tour.is_featured && (
                          <div className="absolute top-4 left-4 z-10">
                            <div className="flex items-center gap-1 bg-gradient-to-r from-[#ff6309] to-[#ff9e5e] text-white px-3 py-1 rounded-full text-xs font-medium">
                              <Award className="h-3 w-3" />
                              Istaknuto
                            </div>
                          </div>
                        )}

                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          {tour.image_urls && tour.image_urls.length > 0 ? (
                            <Image
                              src={tour.image_urls[0]}
                              alt={tour.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center">
                              <span className="text-white text-2xl font-bold">
                                {tour.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-gray-900">
                              {tour.rating.toFixed(1)}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ({tour.reviews_count} recenzija)
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                            {tour.title}
                          </h3>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{tour.location}</span>
                          </div>

                          {/* Highlights */}
                          {tour.highlights && tour.highlights.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {tour.highlights[0]}
                              </p>
                            </div>
                          )}

                          {/* Details */}
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDuration(tour.duration)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>Do {tour.max_people} osoba</span>
                              </div>
                            </div>
                          </div>

                          {/* Guide */}
                          <div className="flex items-center gap-3 mb-4 pt-4 border-t border-gray-100">
                            {tour.guide?.avatar ? (
                              <Image
                                src={tour.guide.avatar}
                                alt={tour.guide.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {tour.guide?.name?.charAt(0) || "V"}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {tour.guide?.name || "Vodič"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {tour.guide?.tours_led || 0} tura
                              </p>
                            </div>
                          </div>

                          {/* Price & Button */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-[#2b946f]">
                                {formatPrice(tour.price_per_group)}
                              </div>
                              <div className="text-xs text-gray-500">
                                po grupi
                              </div>
                            </div>
                            <button
                              className="bg-gradient-to-r from-[#ff6309] to-[#ff9e5e] text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all"
                              onClick={(e) => {
                                e.preventDefault();
                                // Handler za rezervaciju
                              }}
                            >
                              Rezerviraj
                            </button>
                          </div>

                          {/* Tags */}
                          {tour.tags && tour.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t border-gray-100">
                              {tour.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {tour.tags.length > 3 && (
                                <span className="px-2 py-1 text-gray-400 text-xs">
                                  +{tour.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* MAP VIEW */}
          {viewMode === "map" && (
            <div className="relative h-[600px] bg-white rounded-2xl shadow border border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {filteredTours.length} tura pronađeno
                  </h3>
                  <p className="text-gray-600">Prikažite ture na karti</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

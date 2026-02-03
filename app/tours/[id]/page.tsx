"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Languages,
  Award,
  Check,
  Share2,
  Heart,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Tour {
  id: string;
  guide_id: string;
  title: string;
  highlights: string[];
  description: string;
  meeting_point: string;
  price_per_group: number;
  max_people: number;
  duration: string;
  location: string;
  image_urls: string[];
  tags: string[];
  language_offered: string[];
  is_featured: boolean;
  benefits: string[];
  rating: number;
  reviews_count: number;
  guide: {
    name: string;
    avatar: string;
    rating: number;
    tours_led: number;
    bio?: string;
    xp?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tours/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Tura nije pronađena");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setTour(data.data);

          // Set default selected people to 1 or half of max_people
          const maxPeople = data.data.max_people || 1;
          setSelectedPeople(Math.min(2, maxPeople));

          // Set default date to tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          setSelectedDate(tomorrow.toISOString().split("T")[0]);
        } else {
          throw new Error(data.error || "Greška pri dohvaćanju ture");
        }
      } catch (err: any) {
        console.error("Error fetching tour:", err);
        setError(err.message || "Došlo je do greške pri učitavanju ture");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id]);

  const handleBookNow = () => {
    if (!tour) return;

    const bookingData = {
      tourId: tour.id,
      tourTitle: tour.title,
      date: selectedDate,
      people: selectedPeople,
      price: tour.price_per_group,
      totalPrice: tour.price_per_group, // Po grupi, ne po osobi
      guideId: tour.guide_id,
    };

    console.log("Booking data:", bookingData);
    alert(
      `Rezervacija uspješna!\n\nTura: ${tour.title}\nDatum: ${selectedDate}\nBroj osoba: ${selectedPeople}\nCijena: ${tour.price_per_group}€`,
    );

    // Ovdje bi išao API poziv za kreiranje rezervacije
    // await fetch('/api/bookings/create', { method: 'POST', body: JSON.stringify(bookingData) });
  };

  const handleShare = () => {
    if (navigator.share && tour) {
      navigator.share({
        title: tour.title,
        text: `Pogledaj ovu turu: ${tour.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link je kopiran u clipboard!");
    }
  };

  const calculateTotalPrice = () => {
    if (!tour) return 0;
    return tour.price_per_group; // Cijena je po grupi, ne po osobi
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-[#2b946f] animate-spin" />
          <p className="text-gray-600">Učitavanje ture...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-6">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Greška</h2>
            <p className="text-red-600 mb-4">
              {error || "Tura nije pronađena"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              <ArrowLeft size={20} />
              Natrag
            </button>
            <Link
              href="/tours"
              className="bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium text-center"
            >
              Pregled svih tura
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Safe access functions
  const getTitle = () => tour?.title || "Tura";
  const getFirstImage = () => tour?.image_urls?.[0] || "";
  const getGuideName = () => tour?.guide?.name || "Vodič";
  const getGuideAvatar = () => tour?.guide?.avatar || "";
  const getLocation = () => tour?.location || "Nije navedeno";
  const getDuration = () => tour?.duration || "Nije navedeno";

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Natrag na ture</span>
          </button>
        </div>

        {/* Hero Image Gallery */}
        <section className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-[600px]">
            {/* Main Image */}
            <div className="relative h-[400px] lg:h-[600px]">
              {tour.image_urls && tour.image_urls.length > 0 ? (
                <img
                  src={getFirstImage()}
                  alt={getTitle()}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {getTitle()?.charAt(0) || "T"}
                  </span>
                </div>
              )}

              {tour.is_featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#ff6309] to-[#ff9e5e] text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <Award size={20} />
                  <span className="font-semibold">Istaknuto</span>
                </div>
              )}

              {tour.image_urls && tour.image_urls.length > 1 && (
                <button
                  onClick={() =>
                    setSelectedImage(
                      (prev) => (prev + 1) % tour.image_urls.length,
                    )
                  }
                  className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
                >
                  Sljedeća slika
                </button>
              )}
            </div>

            {/* Thumbnail Images */}
            {tour.image_urls && tour.image_urls.length > 1 && (
              <div className="hidden lg:grid grid-cols-2 gap-2 h-[600px]">
                {tour.image_urls.slice(1, 3).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative cursor-pointer overflow-hidden"
                    onClick={() => setSelectedImage(idx + 1)}
                  >
                    <img
                      src={img}
                      alt={`${getTitle()} ${idx + 2}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h1 className="text-[#104d2f] mb-4 text-3xl md:text-4xl font-bold">
                  {getTitle()}
                </h1>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={20} className="text-[#ff6309]" />
                    <span className="font-medium">{getLocation()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={20} className="text-[#2b946f]" />
                    <span className="font-medium">{getDuration()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={20} className="text-[#2b946f]" />
                    <span className="font-medium">
                      Do {tour.max_people || 1} osoba
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star
                      size={20}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-medium">
                      {tour.rating?.toFixed(1) || "0.0"} (
                      {tour.reviews_count || 0} recenzija)
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tour.tags &&
                    tour.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-[#2b946f]/10 text-[#104d2f] rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-[#104d2f] mb-4 text-2xl font-bold">Opis</h3>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {tour.description || "Nema opisa."}
                </p>
              </motion.div>

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h3 className="text-[#104d2f] mb-4 text-2xl font-bold">
                    Značajke
                  </h3>
                  <ul className="space-y-3">
                    {tour.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check
                          className="text-[#2b946f] flex-shrink-0 mt-1"
                          size={20}
                        />
                        <span className="text-gray-700 text-lg">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Benefits */}
              {tour.benefits && tour.benefits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10 rounded-2xl p-8"
                >
                  <h3 className="text-[#104d2f] mb-4 text-2xl font-bold">
                    Što je uključeno
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tour.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-gray-700 text-lg"
                      >
                        <Check className="text-[#2b946f]" size={18} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Meeting Point */}
              {tour.meeting_point && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h3 className="text-[#104d2f] mb-4 text-2xl font-bold">
                    Mjesto susreta
                  </h3>
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="text-[#ff6309] flex-shrink-0 mt-1"
                      size={24}
                    />
                    <p className="text-gray-700 text-lg">
                      {tour.meeting_point}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Guide Info */}
              {tour.guide && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h3 className="text-[#104d2f] mb-6 text-2xl font-bold">
                    Tvoj vodič
                  </h3>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      {getGuideAvatar() ? (
                        <img
                          src={getGuideAvatar()}
                          alt={getGuideName()}
                          className="w-24 h-24 rounded-full object-cover ring-4 ring-[#2b946f]/20"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center ring-4 ring-[#2b946f]/20">
                          <span className="text-white text-2xl font-bold">
                            {getGuideName()?.charAt(0) || "V"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#104d2f] mb-2 text-xl font-bold">
                        {getGuideName()}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span>{tour.guide.rating || "N/A"} ocjena</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{tour.guide.tours_led || 0} tura vodio/la</span>
                        </div>
                        {tour.guide.xp && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-[#2b946f]">
                              {tour.guide.xp} XP
                            </span>
                          </div>
                        )}
                      </div>
                      {tour.guide.bio && (
                        <p className="text-gray-600 text-sm">
                          {tour.guide.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg sticky top-24"
              >
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl text-[#2b946f] font-bold">
                      {formatPrice(tour.price_per_group || 0)}
                    </span>
                    <span className="text-gray-600 text-lg">po grupi</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Do {tour.max_people || 1} osoba
                  </p>
                </div>

                {/* Languages */}
                {tour.language_offered && tour.language_offered.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Languages size={20} className="text-[#2b946f]" />
                      <span className="text-gray-700 font-medium">
                        Dostupni jezici
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tour.language_offered.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Picker */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Odaberi datum
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] font-medium"
                    />
                  </div>
                </div>

                {/* Number of People */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Broj osoba
                  </label>
                  <select
                    value={selectedPeople}
                    onChange={(e) => setSelectedPeople(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] font-medium"
                  >
                    {Array.from(
                      { length: tour.max_people || 1 },
                      (_, i) => i + 1,
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "osoba" : "osobe"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Price */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Ukupno:</span>
                    <span className="text-2xl font-bold text-[#2b946f]">
                      {formatPrice(calculateTotalPrice())}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Cijena je po grupi, neovisno o broju osoba
                  </p>
                </div>

                {/* Buttons */}
                <button
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-[#ff6309] to-[#ff9e5e] text-white py-4 rounded-lg hover:shadow-lg transition-all mb-3 font-bold text-lg shadow-md"
                >
                  Rezerviraj sada
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 border-2 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium ${
                      isFavorite
                        ? "border-[#ff6309] text-[#ff6309] bg-[#ff6309]/10"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Heart
                      size={20}
                      className={isFavorite ? "fill-[#ff6309]" : ""}
                    />
                    {isFavorite ? "Spremljeno" : "Spremi"}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Share2 size={20} />
                    Podijeli
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Besplatno otkazivanje do 24h prije</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Instant potvrda rezervacije</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Podrška 24/7</span>
                  </div>
                </div>

                {/* Tour Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
                  <p>ID ture: {tour.id}</p>
                  {tour.createdAt && (
                    <p>Dodano: {formatDate(tour.createdAt)}</p>
                  )}
                  {tour.updatedAt && (
                    <p>Ažurirano: {formatDate(tour.updatedAt)}</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Languages,
  Award,
  Check,
  Share2,
  Heart,
  ArrowLeft,
  Loader2,
  AlertCircle,
  LogIn,
  Tag,
} from "lucide-react";
import Link from "next/link";
import ReservationModal from "@/components/ReservationModal";
import ShareModal from "@/components/ShareModal";
import { useAuth } from "@/components/AuthProvider";
import LoginModal from "@/components/LoginModal";

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
  categories: string[]; // Ovo treba biti array
  tags: string[];
  language_offered: string[];
  is_featured: boolean;
  benefits: string[];
  rating: number;
  reviews_count: number;
  reservations_count: number;
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

  // Auth hook
  const { user, loading: authLoading } = useAuth();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
          console.log("Tour data received:", data.data);
          // OBAVEZNO: Provjeri da li categories postoji i konvertiraj u array ako treba
          const tourData = {
            ...data.data,
            categories: Array.isArray(data.data.categories)
              ? data.data.categories
              : data.data.categories
                ? [data.data.categories]
                : [],
            tags: Array.isArray(data.data.tags) ? data.data.tags : [],
            highlights: Array.isArray(data.data.highlights)
              ? data.data.highlights
              : [],
            image_urls: Array.isArray(data.data.image_urls)
              ? data.data.image_urls
              : [],
            benefits: Array.isArray(data.data.benefits)
              ? data.data.benefits
              : [],
            language_offered: Array.isArray(data.data.language_offered)
              ? data.data.language_offered
              : ["Hrvatski"],
          };

          setTour(tourData);
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

  const handleReservationClick = () => {
    if (!user) {
      // Nije logiran - pokaži login modal
      setShowLoginModal(true);
    } else {
      // Logiran je - otvori modal za rezervaciju
      setReservationModalOpen(true);
    }
  };

  const handleReservationSuccess = () => {
    // Osvježi podatke o turi da se vidi ažurirani reservations_count
    if (id) {
      fetchTour();
    }

    // Prikazivanje poruke o uspjehu
    alert("Rezervacija uspješno kreirana! Provjerite svoj email za potvrdu.");
  };

  const fetchTour = async () => {
    try {
      const response = await fetch(`/api/tours/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTour({
            ...data.data,
            categories: Array.isArray(data.data.categories)
              ? data.data.categories
              : data.data.categories
                ? [data.data.categories]
                : [],
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing tour:", error);
    }
  };

  // Helper funkcija za siguran pristup array-ima
  const getCategories = () => {
    if (!tour) return [];
    if (Array.isArray(tour.categories)) return tour.categories;
    if (tour.categories) return [tour.categories];
    return [];
  };

  const getTags = () => {
    if (!tour) return [];
    if (Array.isArray(tour.tags)) return tour.tags;
    if (tour.tags) return [tour.tags];
    return [];
  };

  const getHighlights = () => {
    if (!tour) return [];
    if (Array.isArray(tour.highlights)) return tour.highlights;
    return [];
  };

  const getImageUrls = () => {
    if (!tour) return [];
    if (Array.isArray(tour.image_urls)) return tour.image_urls;
    return [];
  };

  const getBenefits = () => {
    if (!tour) return [];
    if (Array.isArray(tour.benefits)) return tour.benefits;
    return [];
  };

  const getLanguages = () => {
    if (!tour) return ["Hrvatski"];
    if (Array.isArray(tour.language_offered)) return tour.language_offered;
    return ["Hrvatski"];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading || authLoading) {
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
              className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium cursor-pointer"
            >
              <ArrowLeft size={20} />
              Natrag
            </button>
            <Link
              href="/tours"
              className="bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium text-center cursor-pointer"
            >
              Pregled svih tura
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categories = getCategories();
  const tags = getTags();
  const highlights = getHighlights();
  const imageUrls = getImageUrls();
  const benefits = getBenefits();
  const languages = getLanguages();

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>Natrag na ture</span>
          </button>
        </div>

        {/* Hero Image */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              {imageUrls.length > 0 ? (
                <img
                  src={imageUrls[0] || ""}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center">
                  <span className="text-white text-5xl font-bold">
                    {tour.title?.charAt(0) || "T"}
                  </span>
                </div>
              )}

              {tour.is_featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#ff6309] to-[#ff9e5e] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <Award size={20} />
                  <span className="font-semibold">Istaknuto</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Title & Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-[#104d2f] mb-3 text-2xl md:text-3xl lg:text-4xl font-bold">
                      {tour.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 md:gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin
                          size={18}
                          className="text-[#ff6309] flex-shrink-0"
                        />
                        <span className="font-medium text-sm md:text-base">
                          {tour.location || "Nije navedeno"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock
                          size={18}
                          className="text-[#2b946f] flex-shrink-0"
                        />
                        <span className="font-medium text-sm md:text-base">
                          {tour.duration || "Nije navedeno"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users
                          size={18}
                          className="text-[#2b946f] flex-shrink-0"
                        />
                        <span className="font-medium text-sm md:text-base">
                          Do {tour.max_people || 1} osoba
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar
                          size={18}
                          className="text-[#2b946f] flex-shrink-0"
                        />
                        <span className="font-medium text-sm md:text-base">
                          {tour.reservations_count || 0} rezervacija
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-3 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
                        isFavorite
                          ? "border-2 border-[#ff6309] text-[#ff6309] bg-[#ff6309]/10"
                          : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Heart
                        size={20}
                        className={isFavorite ? "fill-[#ff6309]" : ""}
                      />
                    </button>

                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="p-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Kategorije */}
                {categories.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={18} className="text-[#2b946f]" />
                      <span className="font-medium text-gray-700">
                        Kategorije:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#2b946f]/20 to-[#0f6659]/20 text-[#104d2f] rounded-full text-sm font-medium border border-[#2b946f]/30"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tagovi */}
                {tags.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Tagovi:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
              >
                <h3 className="text-[#104d2f] mb-4 text-xl md:text-2xl font-bold">
                  Opis
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {tour.description || "Nema opisa."}
                </p>
              </motion.div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
                >
                  <h3 className="text-[#104d2f] mb-4 text-xl md:text-2xl font-bold">
                    Značajke
                  </h3>
                  <ul className="space-y-3">
                    {highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check
                          className="text-[#2b946f] flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10 rounded-2xl p-6 md:p-8"
                >
                  <h3 className="text-[#104d2f] mb-4 text-xl md:text-2xl font-bold">
                    Što je uključeno
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Check className="text-[#2b946f]" size={16} />
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
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
                >
                  <h3 className="text-[#104d2f] mb-4 text-xl md:text-2xl font-bold">
                    Mjesto susreta
                  </h3>
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="text-[#ff6309] flex-shrink-0 mt-1"
                      size={20}
                    />
                    <p className="text-gray-700">{tour.meeting_point}</p>
                  </div>
                </motion.div>
              )}

              {/* Guide Info */}
              {tour.guide && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
                >
                  <h3 className="text-[#104d2f] mb-6 text-xl md:text-2xl font-bold">
                    Tvoj vodič
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                      {tour.guide.avatar ? (
                        <img
                          src={tour.guide.avatar}
                          alt={tour.guide.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-[#2b946f]/20"
                        />
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center ring-4 ring-[#2b946f]/20">
                          <span className="text-white text-xl md:text-2xl font-bold">
                            {tour.guide.name?.charAt(0) || "V"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#104d2f] mb-2 text-lg md:text-xl font-bold">
                        {tour.guide.name}
                      </h4>
                      <div className="flex flex-wrap gap-3 md:gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{tour.guide.tours_led || 0} tura vodio/la</span>
                        </div>
                        {tour.guide.xp && (
                          <div className="flex items-center gap-1">
                            <Award size={16} className="text-[#2b946f]" />
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
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg sticky top-24"
              >
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl md:text-4xl text-[#2b946f] font-bold">
                      {formatPrice(tour.price_per_group || 0)}
                    </span>
                    <span className="text-gray-600 text-base md:text-lg">
                      po grupi
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Do {tour.max_people || 1} osoba
                  </p>
                </div>

                {/* Languages */}
                {languages.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Languages size={18} className="text-[#2b946f]" />
                      <span className="text-gray-700 font-medium">
                        Dostupni jezici
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tour Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#2b946f]">
                      {tour.reservations_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Rezervacija</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#2b946f]">
                      {tour.max_people || 1}
                    </div>
                    <div className="text-xs text-gray-600">Max osoba</div>
                  </div>
                </div>

                {/* Login Status */}
                <div className="mb-4">
                  {user ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <p className="text-sm text-green-700">
                          Prijavljeni ste. Možete rezervirati turu.
                        </p>
                      </div>
                      {user.ime && (
                        <p className="text-xs text-green-600 mt-1">
                          Dobrodošli, {user.ime}!
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <p className="text-sm text-amber-700">
                          Za rezervaciju ture morate biti prijavljeni.
                        </p>
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        Prijavite se da biste mogli rezervirati ovu turu.
                      </p>
                    </div>
                  )}
                </div>

                {/* Main Booking/Login Button */}
                {user ? (
                  // Logiran korisnik - gumb za rezervaciju
                  <button
                    onClick={() => setReservationModalOpen(true)}
                    className="w-full bg-gradient-to-r from-[#ff6309] to-[#ff9e5e] text-white py-3 md:py-4 rounded-lg hover:shadow-lg transition-all mb-3 font-bold text-base md:text-lg shadow-md flex items-center justify-center gap-2"
                  >
                    Rezerviraj sada
                  </button>
                ) : (
                  // Nije logiran - gumb za prijavu
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3 md:py-4 rounded-lg hover:shadow-lg transition-all mb-3 font-bold text-base md:text-lg shadow-md flex items-center justify-center gap-2"
                  >
                    <LogIn size={20} />
                    Prijavi se za rezervaciju
                  </button>
                )}

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

      {/* Reservation Modal (samo ako je korisnik logiran) */}
      {user && (
        <ReservationModal
          isOpen={reservationModalOpen}
          onClose={() => setReservationModalOpen(false)}
          tourId={tour.id}
          tourTitle={tour.title}
          price={tour.price_per_group}
          maxPeople={tour.max_people}
          onSuccess={handleReservationSuccess}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        tourTitle={tour.title}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}

//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Receipt,
} from "lucide-react";

interface PastTour {
  id: string;
  reservation_id: string;
  tour_id: string;
  title: string;
  location: string;
  price_per_group: number;
  total_price: number;
  image_urls: string[];
  duration: string;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  status: string;
  completed_at: string;
  guide_name: string;
  guide_id: string;
}

interface MyPastToursSectionProps {
  userId: string;
}

export default function MyPastToursSection({
  userId,
}: MyPastToursSectionProps) {
  const [tours, setTours] = useState<PastTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginacija
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 3;

  const fetchPastTours = async () => {
    try {
      setLoading(true);
      // Fetchaj sve rezervacije korisnika sa statusom "completed"
      const response = await fetch(
        `/api/reservations?user_id=${userId}&status=completed`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Transformiraj podatke u format koji nam treba
        const formattedTours = data.data.reservations.map((res: any) => ({
          id: res.tour_id,
          reservation_id: res.id,
          tour_id: res.tour_id,
          title: res.tour_title,
          location: res.location || "Lokacija nije dostupna",
          price_per_group: res.total_price,
          total_price: res.total_price,
          image_urls: res.image_urls || [],
          duration: res.duration || "Nepoznato",
          booking_date: res.booking_date,
          booking_time: res.booking_time,
          number_of_people: res.number_of_people,
          status: res.status,
          completed_at: res.completed_at || res.updatedAt,
          guide_name: res.guide_name || "Vodič",
          guide_id: res.guide_id,
        }));

        setTours(formattedTours);
      } else {
        throw new Error(data.error || "Greška pri dohvaćanju rezervacija");
      }
    } catch (err: any) {
      console.error("Error fetching past tours:", err);
      setError(err.message || "Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPastTours();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string, time: string) => {
    return `${formatDate(date)} u ${time}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Paginacija logika
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(tours.length / toursPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-[#ff6309] animate-spin" />
          <span className="ml-3 text-gray-600">Učitavanje prošlih tura...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchPastTours}
            className="mt-4 text-[#ff6309] hover:text-[#e55500] font-medium cursor-pointer"
          >
            Pokušaj ponovno
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Moje prošle ture</h2>
          <p className="text-gray-600 mt-1">
            {tours.length}{" "}
            {tours.length === 1 ? "posjećena tura" : "posjećenih tura"}
          </p>
        </div>
        {tours.length > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg">
            <CheckCircle size={20} className="text-[#ff6309]" />
            <span className="text-sm font-medium text-gray-700">
              Ukupno potrošeno:{" "}
              {formatPrice(
                tours.reduce((sum, tour) => sum + tour.total_price, 0),
              )}
            </span>
          </div>
        )}
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-[#ff6309]/10 to-[#ff6309]/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="h-8 w-8 text-[#ff6309]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Još nisi bio/la ni na jednoj turi
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Rezerviraj svoju prvu turu i započni avanturu!
          </p>
          <Link
            href="/tours"
            className="inline-flex bg-gradient-to-r from-[#ff6309] to-[#ff8c42] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer"
          >
            Pogledaj dostupne ture
          </Link>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6"
            >
              {currentTours.map((tour, index) => (
                <motion.div
                  key={tour.reservation_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/tours/${tour.tour_id}`} className="block">
                    <div className="group bg-gradient-to-br from-orange-50/30 to-white border border-orange-200 rounded-xl hover:border-[#ff6309] hover:shadow-xl transition-all overflow-hidden cursor-pointer">
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Tour Image */}
                          <div className="flex-shrink-0">
                            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                              {tour.image_urls && tour.image_urls.length > 0 ? (
                                <img
                                  src={tour.image_urls[0]}
                                  alt={tour.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#ff6309] to-[#ff8c42] flex items-center justify-center">
                                  <span className="text-white text-4xl font-bold">
                                    {tour.title.charAt(0)}
                                  </span>
                                </div>
                              )}
                              {/* Badge za završenu turu */}
                              <div className="absolute top-3 right-3 bg-green-500 rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
                                <CheckCircle className="h-3 w-3 text-white" />
                                <span className="text-xs font-semibold text-white">
                                  Završeno
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Tour Info */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-[#ff6309] transition-colors">
                                  {tour.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                  <MapPin
                                    size={16}
                                    className="text-[#ff6309]"
                                  />
                                  <span>{tour.location}</span>
                                </div>

                                {/* Informacije o rezervaciji */}
                                <div className="flex flex-wrap items-center gap-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar
                                      size={16}
                                      className="text-[#ff6309]"
                                    />
                                    <span className="text-gray-700">
                                      {formatDateTime(
                                        tour.booking_date,
                                        tour.booking_time,
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Users
                                      size={16}
                                      className="text-[#ff6309]"
                                    />
                                    <span className="text-gray-700">
                                      {tour.number_of_people}{" "}
                                      {tour.number_of_people === 1
                                        ? "osoba"
                                        : "osoba"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock
                                      size={16}
                                      className="text-[#ff6309]"
                                    />
                                    <span className="text-gray-700">
                                      {tour.duration}
                                    </span>
                                  </div>
                                </div>

                                {/* Vodič info */}
                                <div className="mt-3 text-sm text-gray-500">
                                  Vodič:{" "}
                                  <span className="font-medium text-gray-700">
                                    {tour.guide_name}
                                  </span>
                                </div>
                              </div>

                              {/* Cijena */}
                              <div className="flex flex-col items-end gap-1">
                                <div className="text-right">
                                  <div className="text-3xl font-bold text-[#ff6309]">
                                    {formatPrice(tour.total_price)}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    za {tour.number_of_people}{" "}
                                    {tour.number_of_people === 1
                                      ? "osobu"
                                      : "osoba"}
                                  </span>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                  Rezervirano: {formatDate(tour.completed_at)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Paginacija */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Prikazano {indexOfFirstTour + 1} -{" "}
                {Math.min(indexOfLastTour, tours.length)} od {tours.length} tura
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-[#ff6309] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-gradient-to-r from-[#ff6309] to-[#ff8c42] text-white"
                            : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-[#ff6309] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EditTourModal from "./EditTourModal";

interface Tour {
  id: string;
  title: string;
  location: string;
  price_per_group: number;
  rating: number;
  reviews_count: number;
  image_urls: string[];
  duration: string;
  max_people: number;
  is_featured: boolean;
  createdAt: string;
}

interface MyToursSectionProps {
  userId: string;
  onAddTourClick: () => void;
}

export default function MyToursSection({
  userId,
  onAddTourClick,
}: MyToursSectionProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Paginacija
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 3;

  const fetchMyTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/tours?guide_id=${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // ISPRAVKA: Provjeri strukturu podataka
        let toursData = [];
        if (data.data && data.data.tours) {
          toursData = data.data.tours;
        } else if (Array.isArray(data.data)) {
          toursData = data.data;
        } else if (Array.isArray(data.tours)) {
          toursData = data.tours;
        } else if (Array.isArray(data.data)) {
          toursData = data.data;
        }

        setTours(toursData);
      } else {
        throw new Error(data.error || "Greška pri dohvaćanju izleta");
      }
    } catch (err: any) {
      console.error("Error fetching my tours:", err);
      setError(err.message || "Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMyTours();
    }
  }, [userId]);

  const handleDeleteTour = async (tourId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Spriječi otvaranje izleta

    if (
      !confirm(
        "Jeste li sigurni da želite obrisati ovaj izlet? Ova akcija je nepovratna.",
      )
    ) {
      return;
    }

    try {
      setDeletingId(tourId);
      const response = await fetch(`/api/tours/${tourId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Došlo je do greške pri brisanju");
      }

      setTours((prev) => prev.filter((tour) => tour.id !== tourId));
      // Resetiraj na prvu stranicu ako smo obrisali zadnji izlet na trenutnoj stranici
      if (indexOfLastTour - 1 >= tours.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (err: any) {
      alert(err.message || "Došlo je do greške pri brisanju izleta");
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (tour: Tour, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Spriječi otvaranje izleta
    setEditingTour(tour);
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nepoznato";
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
          <Loader2 className="h-8 w-8 text-[#2b946f] animate-spin" />
          <span className="ml-3 text-gray-600">Učitavanje izleta...</span>
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
            onClick={fetchMyTours}
            className="mt-4 text-[#2b946f] hover:text-[#104d2f] font-medium cursor-pointer"
          >
            Pokušaj ponovno
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Moji izleti</h2>
            <p className="text-gray-600 mt-1">
              {tours.length} {tours.length === 1 ? "izlet" : "izleta"} kreirano
            </p>
          </div>
          <button
            onClick={onAddTourClick}
            className="flex items-center gap-2 bg-[#2b946f] hover:bg-[#247c5d] text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium cursor-pointer"
          >
            <Plus size={20} />
            Dodaj novi izlet
          </button>
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-[#2b946f]/10 to-[#0f6659]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-[#2b946f]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Još nemaš izleta
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Kreiraj svoj prvi izlet i podijeli svoje znanje s drugima
            </p>
            <button
              onClick={onAddTourClick}
              className="bg-[#2b946f] hover:bg-[#247c5d] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer"
            >
              Kreiraj prvi izlet
            </button>
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
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative">
                      {/* Link koji omotava cijeli div osim akcijskih gumbiju */}
                      <Link
                        href={`/tours/${tour.id}`}
                        className="absolute inset-0 z-0"
                      >
                        <span className="sr-only">
                          Pogledaj izlet {tour.title}
                        </span>
                      </Link>

                      {/* Vizualni prikaz - nije link, ali prima klikove preko absolute linka */}
                      <div className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#2b946f]/50 hover:shadow-xl transition-all overflow-hidden relative z-0 pointer-events-none">
                        <div className="p-6 pointer-events-none">
                          <div className="flex flex-col sm:flex-row gap-6">
                            {/* Tour Image */}
                            <div className="flex-shrink-0 pointer-events-none">
                              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                {tour.image_urls &&
                                tour.image_urls.length > 0 ? (
                                  <img
                                    src={tour.image_urls[0]}
                                    alt={tour.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-[#2b946f] to-[#0f6659] flex items-center justify-center">
                                    <span className="text-white text-4xl font-bold">
                                      {tour.title?.charAt(0) || "T"}
                                    </span>
                                  </div>
                                )}
                                {tour.is_featured && (
                                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                                    <Award className="h-5 w-5 text-[#ff6309]" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Tour Info */}
                            <div className="flex-1 flex flex-col justify-between pointer-events-none">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-[#2b946f] transition-colors">
                                    {tour.title || "Bez naslova"}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <MapPin
                                      size={16}
                                      className="text-[#2b946f]"
                                    />
                                    <span>
                                      {tour.location ||
                                        "Lokacija nije navedena"}
                                    </span>
                                  </div>

                                  {/* Informacije u kompaktnom formatu */}
                                  <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock
                                        size={16}
                                        className="text-[#2b946f]"
                                      />
                                      <span className="text-gray-700">
                                        {tour.duration || "Nepoznato"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar
                                        size={16}
                                        className="text-[#2b946f]"
                                      />
                                      <span className="text-gray-700">
                                        {formatDate(tour.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Cijena i akcijski gumbi */}
                                <div className="flex flex-col items-end gap-3">
                                  <div className="text-right pointer-events-none">
                                    <div className="text-3xl font-bold text-[#2b946f]">
                                      {formatPrice(tour.price_per_group || 0)}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      po grupi
                                    </span>
                                  </div>

                                  {/* Akcijski gumbi - Edit i Delete */}
                                  <div className="flex gap-2 relative z-20 pointer-events-auto">
                                    <button
                                      onClick={(e) => handleEditClick(tour, e)}
                                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2b946f] text-white rounded-lg hover:bg-[#0f6659] transition-all font-medium text-sm cursor-pointer"
                                    >
                                      <Edit size={16} />
                                      Uredi
                                    </button>
                                    <button
                                      onClick={(e) =>
                                        handleDeleteTour(tour.id, e)
                                      }
                                      disabled={deletingId === tour.id}
                                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm disabled:opacity-50 cursor-pointer"
                                    >
                                      {deletingId === tour.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 size={16} />
                                      )}
                                      {deletingId === tour.id
                                        ? "Brisanje..."
                                        : "Obriši"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Paginacija */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Prikazano {indexOfFirstTour + 1} -{" "}
                  {Math.min(indexOfLastTour, tours.length)} od {tours.length}{" "}
                  izleta
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-[#2b946f] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                              ? "bg-[#2b946f] text-white"
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
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-[#2b946f] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Tour Modal */}
      {editingTour && (
        <EditTourModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingTour(null);
          }}
          tour={editingTour}
          onSuccess={() => {
            fetchMyTours();
            setShowEditModal(false);
            setEditingTour(null);
          }}
        />
      )}
    </>
  );
}

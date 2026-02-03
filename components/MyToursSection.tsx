//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Edit,
  Trash2,
  Eye,
  Plus,
  Loader2,
  Award,
  Calendar,
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

  const fetchMyTours = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tours?guide_id=${userId}`);

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

  const handleDeleteTour = async (tourId: string) => {
    if (
      !confirm(
        "Jeste li sigurni da želite obrisati ovu turu? Ova akcija je nepovratna.",
      )
    ) {
      return;
    }

    try {
      setDeletingId(tourId);
      const response = await fetch(`/api/tours/${tourId}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Došlo je do greške pri brisanju");
      }

      // Ukloni turu iz state
      setTours((prev) => prev.filter((tour) => tour.id !== tourId));
      alert("Tura je uspješno obrisana");
    } catch (err: any) {
      alert(err.message || "Došlo je do greške pri brisanju ture");
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-[#2b946f] animate-spin" />
          <span className="ml-3 text-gray-600">Učitavanje tura...</span>
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
            className="mt-4 text-[#2b946f] hover:text-[#104d2f] font-medium"
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
            <h2 className="text-2xl font-bold text-gray-900">Moje ture</h2>
            <p className="text-gray-600 mt-1">
              {tours.length} {tours.length === 1 ? "tura" : "tura"} kreirano
            </p>
          </div>
          <button
            onClick={onAddTourClick}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium"
          >
            <Plus size={20} />
            Dodaj novu turu
          </button>
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-[#2b946f]/10 to-[#0f6659]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-[#2b946f]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Još nemaš tura
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Kreiraj svoju prvu turu i podijeli svoje znanje s drugima
            </p>
            <button
              onClick={onAddTourClick}
              className="bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Kreiraj prvu turu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {tours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group border border-gray-200 rounded-xl hover:border-[#2b946f]/30 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Tour Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                        {tour.image_urls && tour.image_urls.length > 0 ? (
                          <img
                            src={tour.image_urls[0]}
                            alt={tour.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                              {tour.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        {tour.is_featured && (
                          <div className="absolute top-2 right-2">
                            <Award className="h-4 w-4 text-[#ff6309]" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tour Info */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {tour.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            {tour.location && (
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>{tour.location}</span>
                              </div>
                            )}
                            {tour.duration && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{tour.duration}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              <span>Do {tour.max_people} osoba</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500" />
                              <span>{tour.rating.toFixed(1)}</span>
                              <span className="text-gray-400">
                                ({tour.reviews_count})
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="text-2xl font-bold text-[#2b946f]">
                              {formatPrice(tour.price_per_group)}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Calendar size={14} />
                              <span>Dodano: {formatDate(tour.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                          <Link
                            href={`/tours/${tour.id}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                          >
                            <Eye size={16} />
                            Pregled
                          </Link>
                          <button
                            onClick={() => {
                              setEditingTour(tour);
                              setShowEditModal(true);
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2b946f]/10 text-[#2b946f] rounded-lg hover:bg-[#2b946f]/20 transition-colors font-medium text-sm"
                          >
                            <Edit size={16} />
                            Uredi
                          </button>
                          <button
                            onClick={() => handleDeleteTour(tour.id)}
                            disabled={deletingId === tour.id}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
                          >
                            {deletingId === tour.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            {deletingId === tour.id ? "Brisanje..." : "Obriši"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

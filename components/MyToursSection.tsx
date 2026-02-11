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
            <h2 className="text-2xl font-bold text-gray-900">Moje ture</h2>
            <p className="text-gray-600 mt-1">
              {tours.length} {tours.length === 1 ? "tura" : "tura"} kreirano
            </p>
          </div>
          <button
            onClick={onAddTourClick}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium cursor-pointer"
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
              className="bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer"
            >
              Kreiraj prvu turu
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {tours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#2b946f]/50 hover:shadow-xl transition-all overflow-hidden"
              >
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
                          <div className="w-full h-full bg-gradient-to-br from-[#2b946f] to-[#0f6659] flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">
                              {tour.title.charAt(0)}
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
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {tour.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin size={16} className="text-[#2b946f]" />
                              <span>{tour.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-[#2b946f]">
                              {formatPrice(tour.price_per_group)}
                            </div>
                            <span className="text-xs text-gray-500">po grupi</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 pb-4 border-b border-gray-200">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock size={16} className="text-[#2b946f]" />
                            <div>
                              <div className="text-xs text-gray-500">Trajanje</div>
                              <div className="font-semibold text-gray-900">{tour.duration}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users size={16} className="text-[#2b946f]" />
                            <div>
                              <div className="text-xs text-gray-500">Kapacitet</div>
                              <div className="font-semibold text-gray-900">{tour.max_people} osoba</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star size={16} className="text-yellow-500" />
                            <div>
                              <div className="text-xs text-gray-500">Ocjena</div>
                              <div className="font-semibold text-gray-900">{tour.rating.toFixed(1)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-[#2b946f]" />
                            <div>
                              <div className="text-xs text-gray-500">Dodano</div>
                              <div className="font-semibold text-gray-900 whitespace-nowrap">{formatDate(tour.createdAt)}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col xs:flex-row gap-3">
                        <Link
                          href={`/tours/${tour.id}`}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-[#2b946f] transition-all font-medium text-sm flex-1 cursor-pointer"
                        >
                          <Eye size={16} />
                          Pregled
                        </Link>
                        <button
                          onClick={() => {
                            setEditingTour(tour);
                            setShowEditModal(true);
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2b946f] text-white rounded-lg hover:bg-[#0f6659] transition-all font-medium text-sm flex-1 cursor-pointer"
                        >
                          <Edit size={16} />
                          Uredi
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour.id)}
                          disabled={deletingId === tour.id}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm flex-1 disabled:opacity-50 cursor-pointer"
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

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  Users,
  Phone,
  MessageSquare,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: string;
  tourTitle: string;
  price: number;
  maxPeople: number;
  onSuccess: (message: string) => void;
}

export default function ReservationModal({
  isOpen,
  onClose,
  tourId,
  tourTitle,
  price,
  maxPeople,
  onSuccess,
}: ReservationModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    people: 1,
    phone: "",
    email: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: "",
        time: "",
        people: 1,
        phone: "",
        email: "",
        notes: "",
      });
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: tourId,
          booking_date: formData.date,
          booking_time: formData.time,
          number_of_people: formData.people,
          contact_phone: formData.phone,
          contact_email: formData.email,
          special_notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Greška pri rezervaciji");

      onSuccess("Uspješno ste rezervirali izlet!");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header - Contrast & Branding */}
            <div className="bg-[#104d2f] p-6 text-white flex justify-between items-start flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold pr-8">{tourTitle}</h2>
                <p className="text-white/80 text-sm mt-1">
                  Potvrdite detalje rezervacije
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body - Scrollable Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form
                id="reservation-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Section 1: Termin (Proximity & Alignment) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={16} className="text-[#2b946f]" />
                    Termin
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">
                        Datum
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2b946f] outline-none transition-all"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">
                        Vrijeme
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2b946f] outline-none transition-all"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Sudionici (Contrast for input) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} className="text-[#2b946f]" />
                    Sudionici
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Broj osoba <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">
                        Max: {maxPeople}
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        required
                        value={formData.people}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            people: parseInt(e.target.value),
                          })
                        }
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2b946f] outline-none transition-all appearance-none"
                      >
                        {Array.from({ length: maxPeople }, (_, i) => i + 1).map(
                          (num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ),
                        )}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Kontakt (Proximity) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={16} className="text-[#2b946f]" />
                    Kontakt
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">
                        Broj telefona <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+385..."
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2b946f] outline-none transition-all"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="primjer@email.com"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2b946f] outline-none transition-all"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                    <MessageSquare size={12} />
                    Posebne napomene
                  </label>
                  <textarea
                    rows={2}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2b946f] outline-none transition-all resize-none"
                    placeholder="Alergije, posebni zahtjevi..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </form>
            </div>

            {/* Footer - Fixed Action Area (Contrast) */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">
                  Ukupno za platiti:
                </span>
                <span className="text-2xl font-bold text-[#104d2f]">
                  {new Intl.NumberFormat("hr-HR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(price)}
                </span>
              </div>
              <button
                type="submit"
                form="reservation-form"
                disabled={loading}
                className="w-full bg-[#ff6309] hover:bg-[#e55808] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Potvrdi rezervaciju"
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
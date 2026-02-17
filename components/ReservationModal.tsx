"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  Check,
  Users,
  ChevronDown,
  Info,
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

interface UserProfile {
  email: string;
  phone: string;
  ime: string;
  prezime: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    tour_id: tourId,
    booking_date: "",
    booking_time: "10:00",
    number_of_people: 1,
    special_notes: "",
    contact_email: "",
    contact_phone: "",
  });

  // Generate time options from 8:00 to 20:00
  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  // Validacija telefona - samo brojevi, +, /, -, i razmak
  const validatePhone = (phone: string) => {
    if (!phone) return true;
    const phoneRegex = /^[\d\s\+\/\-]{6,20}$/;
    return phoneRegex.test(phone);
  };

  // Validacija emaila
  const validateEmail = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Provjeri da li je forma validna
  const isFormValid = () => {
    const errors = [];

    if (!formData.booking_date) {
      errors.push("Datum je obavezan");
    }

    if (!formData.booking_time) {
      errors.push("Vrijeme je obavezno");
    }

    if (formData.number_of_people < 1) {
      errors.push("Broj osoba mora biti barem 1");
    }

    if (formData.number_of_people > maxPeople) {
      errors.push(`Maksimalan broj osoba za ovu turu je ${maxPeople}`);
    }

    if (!formData.contact_email) {
      errors.push("Email je obavezan");
    } else if (!validateEmail(formData.contact_email)) {
      errors.push("Unesite validnu email adresu");
    }

    if (formData.contact_phone && !validatePhone(formData.contact_phone)) {
      errors.push("Telefon može sadržavati samo brojeve, +, /, - i razmak");
    }

    if (formData.booking_date) {
      const bookingDate = new Date(formData.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (bookingDate < today) {
        errors.push("Ne možete rezervirati u prošlosti");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Učitaj podatke korisnika prilikom otvaranja modala
  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
      setError("");

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData((prev) => ({
        ...prev,
        tour_id: tourId,
        booking_date: tomorrow.toISOString().split("T")[0],
        number_of_people: Math.min(2, maxPeople),
      }));
    }
  }, [isOpen, tourId, maxPeople]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserProfile({
            email: data.user.email || "",
            phone: data.user.phone || "",
            ime: data.user.ime || "",
            prezime: data.user.prezime || "",
          });

          setFormData((prev) => ({
            ...prev,
            contact_email: data.user.email || "",
            contact_phone: data.user.phone || "",
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "contact_phone") {
      const filteredValue = value.replace(/[^\d\s\+\/\-]/g, "");
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = isFormValid();

    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reservationData = {
        tour_id: formData.tour_id,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        number_of_people: formData.number_of_people,
        special_notes: formData.special_notes.trim() || "",
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone.trim() || "",
      };

      const response = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Došlo je do greške pri rezervaciji");
      }

      // Uspješno kreiranje
      onClose();
      onSuccess(
        `Uspješno ste rezervirali turu "${tourTitle}" za ${formData.booking_date} u ${formData.booking_time} sati.`,
      );
      resetForm();
    } catch (err: any) {
      setError(err.message);
      console.error("Reservation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tour_id: tourId,
      booking_date: "",
      booking_time: "10:00",
      number_of_people: 1,
      special_notes: "",
      contact_email: userProfile?.email || "",
      contact_phone: userProfile?.phone || "",
    });
    setError("");
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validation = isFormValid();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Potvrda rezervacije
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">Još samo par koraka do avanture</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-500"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Tour Details Section */}
              
              {/* Tour Summary Card */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{tourTitle}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <Users size={14} />
                    <span>Max {maxPeople} osoba</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Cijena</p>
                  <p className="text-xl font-bold text-[#2b946f]">{formatPrice(price)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Datum
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="date"
                        name="booking_date"
                        value={formData.booking_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Vrijeme
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <select
                        name="booking_time"
                        value={formData.booking_time}
                        onChange={handleChange}
                        className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent appearance-none text-sm bg-white"
                        required
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Broj osoba
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <select
                        name="number_of_people"
                        value={formData.number_of_people}
                        onChange={handleChange}
                        className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent appearance-none text-sm bg-white"
                        required
                      >
                        {Array.from({ length: maxPeople }, (_, i) => i + 1).map(
                          (num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "osoba" : "osobe"}
                            </option>
                          ),
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>
                  </div>
              </div>

              <div className="border-t border-gray-100"></div>

              {/* 2. Contact Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User size={18} className="text-[#2b946f]" />
                  Vaši podaci
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent text-sm ${
                          formData.contact_email &&
                          !validateEmail(formData.contact_email)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="vas@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">
                      Telefon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent text-sm ${
                          formData.contact_phone &&
                          !validatePhone(formData.contact_phone)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="0991234567"
                      />
                    </div>
                    {formData.contact_phone &&
                      !validatePhone(formData.contact_phone) && (
                        <p className="text-xs text-red-500 mt-1">
                          Dozvoljeni samo brojevi, +, /, - i razmak
                        </p>
                      )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <Info size={14} className="text-[#2b946f]" />
                  <span>Podaci su automatski popunjeni iz vašeg profila.</span>
                </div>
              </div>

              {/* 3. Notes Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  Napomene (opcionalno)
                </label>
                <textarea
                  name="special_notes"
                  value={formData.special_notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all resize-none text-sm"
                  placeholder="Imate li posebne zahtjeve, alergije, ograničenja?"
                  maxLength={500}
                />
              </div>

              {/* Terms & Conditions */}
              <div className="bg-[#2b946f]/5 rounded-xl p-4 border border-[#2b946f]/10">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-[#2b946f] mt-0.5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      Rezervacijom potvrđujete da ste pročitali i prihvaćate{" "}
                      <a
                        href="/terms"
                        className="text-[#2b946f] hover:underline font-medium"
                      >
                        uvjete pružanja usluge
                      </a>
                      .
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Rezervaciju možete besplatno otkazati do 24h prije početka
                      ture. Nakon toga naplaćuje se 50% cijene.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-medium">Greška:</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !validation.isValid}
                  className="w-full bg-[#ff6309] hover:bg-[#e55808] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Rezerviranje...
                    </>
                  ) : (
                    <>
                      Potvrdi rezervaciju
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="w-full text-gray-500 text-sm mt-3 hover:text-gray-700 font-medium cursor-pointer"
                >
                  Odustani
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

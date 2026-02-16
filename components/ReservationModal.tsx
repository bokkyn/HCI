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
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#104d2f]/5 to-[#0f6659]/5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Rezerviraj turu
              </h2>
              <p className="text-gray-600 mt-1">{tourTitle}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Tour Details Section */}
              <div className="space-y-6">
                {/* Header with Price */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{tourTitle}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                      <Users size={16} />
                      <span>Maksimalno {maxPeople} osoba</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right bg-gray-50 px-4 py-2 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Cijena grupe</p>
                    <p className="text-xl font-bold text-[#2b946f]">{formatPrice(price)}</p>
                  </div>
                </div>

                {/* Booking Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Datum <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="date"
                        name="booking_date"
                        value={formData.booking_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b946f]/20 focus:border-[#2b946f] transition-all bg-gray-50/50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Vrijeme <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        name="booking_time"
                        value={formData.booking_time}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b946f]/20 focus:border-[#2b946f] transition-all bg-gray-50/50 hover:bg-white appearance-none"
                        required
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Broj osoba <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        name="number_of_people"
                        value={formData.number_of_people}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b946f]/20 focus:border-[#2b946f] transition-all bg-gray-50/50 hover:bg-white appearance-none"
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
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Contact Section */}
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px flex-1 bg-gray-100"></div>
                  <h3 className="text-lg font-bold text-gray-900">Kontakt podaci</h3>
                  <div className="h-px flex-1 bg-gray-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Email adresa <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b946f]/20 focus:border-[#2b946f] transition-all bg-gray-50/50 hover:bg-white ${
                          formData.contact_email &&
                          !validateEmail(formData.contact_email)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200"
                        }`}
                        placeholder="vas@email.com"
                        required
                      />
                    </div>
                    {userProfile?.email && (
                      <p className="text-xs text-blue-600 mt-1">
                        Vaš profilni email: {userProfile.email} (možete
                        promijeniti za ovu rezervaciju)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Telefon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b946f]/20 focus:border-[#2b946f] transition-all bg-gray-50/50 hover:bg-white ${
                          formData.contact_phone &&
                          !validatePhone(formData.contact_phone)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200"
                        }`}
                        placeholder="0991234567"
                      />
                    </div>
                    {userProfile?.phone && (
                      <p className="text-xs text-blue-600 mt-1">
                        Vaš profilni telefon: {userProfile.phone}
                      </p>
                    )}
                    {formData.contact_phone &&
                      !validatePhone(formData.contact_phone) && (
                        <p className="text-xs text-red-500 mt-1">
                          Dozvoljeni samo brojevi, +, /, - i razmak
                        </p>
                      )}
                  </div>
                </div>

                {/* User Info */}
                {userProfile && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                    <User size={18} className="text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Prijavljeni ste kao {userProfile.ime} {userProfile.prezime}</p>
                      <p className="text-blue-600/80 text-xs mt-1">Podaci su automatski popunjeni iz vašeg profila.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Notes Section */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText size={16} />
                  Posebne napomene
                </label>
                <textarea
                  name="special_notes"
                  value={formData.special_notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b946f]/20 focus:border-[#2b946f] transition-all resize-none bg-gray-50/50 hover:bg-white"
                  placeholder="Imate li posebne zahtjeve, alergije, ograničenja?"
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 text-right">
                  {formData.special_notes.length}/500 znakova
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-gray-50 rounded-xl p-4">
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
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 cursor-pointer"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  disabled={loading || !validation.isValid}
                  className="flex-1 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3.5 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Rezerviranje...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Potvrdi rezervaciju
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

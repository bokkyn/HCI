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
  DollarSign,
} from "lucide-react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: string;
  tourTitle: string;
  price: number;
  maxPeople: number;
  onSuccess: () => void;
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
  const [success, setSuccess] = useState("");
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

  // Učitaj podatke korisnika prilikom otvaranja modala
  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();

      // Postavi default datum na sutra
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
      const response = await fetch("/api/auth/profile", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUserProfile({
            email: data.user.email || "",
            phone: data.user.phone || "",
            ime: data.user.ime || "",
            prezime: data.user.prezime || "",
          });

          // Popuni formu s podacima korisnika
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validacija
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
      } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
        errors.push("Unesite validnu email adresu");
      }

      if (errors.length > 0) {
        throw new Error(errors.join(", "));
      }

      // Provjeri datum - ne može rezervirati u prošlosti
      const bookingDate = new Date(formData.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (bookingDate < today) {
        throw new Error("Ne možete rezervirati u prošlosti");
      }

      // Pripremi podatke
      const reservationData = {
        tour_id: formData.tour_id,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        number_of_people: formData.number_of_people,
        special_notes: formData.special_notes.trim() || "",
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone.trim() || "",
      };

      console.log("Sending reservation data:", reservationData);

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
      setSuccess("Rezervacija je uspješno kreirana!");
      setTimeout(() => {
        onClose();
        onSuccess();
        resetForm();
      }, 2000);
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
    setSuccess("");
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 font-medium">Greška:</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-700 font-medium">Uspjeh!</p>
                  <p className="text-green-600 text-sm mt-1">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tour Info Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{tourTitle}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Cijena: {formatPrice(price)} po grupi
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users size={16} />
                      <span className="text-sm">Maks: {maxPeople} osoba</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} />
                    Datum <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="booking_date"
                    value={formData.booking_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} />
                    Vrijeme <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="booking_time"
                    value={formData.booking_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all bg-white"
                    required
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Number of People */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Users size={16} />
                  Broj osoba <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <select
                    name="number_of_people"
                    value={formData.number_of_people}
                    onChange={handleChange}
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
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
                  <span className="text-sm text-gray-500">
                    Ukupno: {formatPrice(price)}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  Kontakt informacije
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} />
                      Email adresa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                      placeholder="vas@email.com"
                      required
                    />
                    {userProfile?.email && (
                      <p className="text-xs text-gray-500 mt-1">
                        Vaš profilni email: {userProfile.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                      placeholder="+385 99 123 4567"
                    />
                    {userProfile?.phone && (
                      <p className="text-xs text-gray-500 mt-1">
                        Vaš profilni telefon: {userProfile.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* User Info */}
                {userProfile && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={16} className="text-blue-600" />
                      <p className="text-sm text-blue-700 font-medium">
                        Prijavljeni ste kao: {userProfile.ime}{" "}
                        {userProfile.prezime}
                      </p>
                    </div>
                    <p className="text-xs text-blue-600">
                      Kontakt informacije su automatski popunjene iz vašeg
                      profila. Možete ih promijeniti ako želite koristiti
                      drugačije podatke.
                    </p>
                  </div>
                )}
              </div>

              {/* Special Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} />
                  Posebne napomene za vodiča
                </label>
                <textarea
                  name="special_notes"
                  value={formData.special_notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all resize-none"
                  placeholder="Imate li posebne zahtjeve, alergije, ograničenja? Javite vodiču što bi trebao znati..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.special_notes.length}/500 znakova
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
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

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3.5 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

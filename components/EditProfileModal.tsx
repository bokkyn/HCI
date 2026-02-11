// app/components/EditProfileModal.tsx
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  User,
  MapPin,
  Cake,
  Venus,
  Mars,
  Image,
  FileText,
} from "lucide-react";

interface UserData {
  id: string;
  ime: string;
  prezime: string;
  email: string;
  spol?: string;
  datum_rodenja?: string;
  lokacija?: string;
  bio?: string;
  avatar?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUpdate: (updatedUser: UserData) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    spol: "",
    datum_rodenja: "",
    lokacija: "",
    bio: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Inicijaliziraj formu kada se otvori
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        ime: user.ime || "",
        prezime: user.prezime || "",
        spol: user.spol || "",
        datum_rodenja: user.datum_rodenja
          ? new Date(user.datum_rodenja).toISOString().split("T")[0]
          : "",
        lokacija: user.lokacija || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
      setError("");
      setSuccess("");
    }
  }, [user, isOpen]);

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
      if (!formData.ime.trim() || !formData.prezime.trim()) {
        throw new Error("Ime i prezime su obavezni");
      }

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // Pošalji prazan string ako je datum_rodenja prazan
          datum_rodenja: formData.datum_rodenja.trim() || "",
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Došlo je do greške");
      }

      // Uspješno ažuriranje
      setSuccess("Profil uspješno ažuriran!");
      onUpdate(data.user);

      // Zatvori modal nakon 2 sekunde
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#104d2f]/5 to-[#0f6659]/5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Uredi profil</h2>
              <p className="text-gray-600 mt-1">
                Ažurirajte svoje osobne podatke
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ime i Prezime */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    Ime *
                  </label>
                  <input
                    type="text"
                    name="ime"
                    value={formData.ime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    Prezime *
                  </label>
                  <input
                    type="text"
                    name="prezime"
                    value={formData.prezime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Spol i Datum rođenja */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Venus size={16} />
                    <Mars size={16} />
                    Spol
                  </label>
                  <select
                    name="spol"
                    value={formData.spol}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Odaberite spol</option>
                    <option value="muško">Muško</option>
                    <option value="žensko">Žensko</option>
                    <option value="drugo">Drugo</option>
                    <option value="ne želim reći">Ne želim reći</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Cake size={16} />
                    Datum rođenja
                  </label>
                  <input
                    type="date"
                    name="datum_rodenja"
                    value={formData.datum_rodenja}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ostavite prazno ako ne želite navesti
                  </p>
                </div>
              </div>

              {/* Lokacija */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} />
                  Lokacija
                </label>
                <input
                  type="text"
                  name="lokacija"
                  value={formData.lokacija}
                  onChange={handleChange}
                  placeholder="npr. Zagreb, Hrvatska"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} />
                  Opis o sebi
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Napišite nešto o sebi, svojim interesima, hobijima..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    Maksimalno 500 znakova
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.bio.length}/500
                  </p>
                </div>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Image size={16} />
                  URL profila slike
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://primjer.com/slika.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ostavite prazno za default avatar
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 cursor-pointer"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3.5 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Spremanje...
                    </>
                  ) : (
                    "Spremi promjene"
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

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  MapPin,
  Clock,
  Users,
  Image as ImageIcon,
  FileText,
  Award,
  Check,
  Globe,
  DollarSign,
  AlertCircle,
  ChevronDown,
  Edit,
  Search,
  Plus,
} from "lucide-react";

interface Tour {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  meeting_point: string;
  price_per_group: number;
  max_people: number;
  duration: string;
  location: string;
  image_urls: string[];
  tags: string[];
  categories: string[];
  language_offered: string[];
  is_featured: boolean;
  benefits: string[];
}

interface EditTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour;
  onSuccess: () => void;
}

const AVAILABLE_LANGUAGES = [
  "Hrvatski",
  "Engleski",
  "Njemački",
  "Talijanski",
  "Španjolski",
  "Francuski",
  "Ruski",
  "Kineski",
];

export default function EditTourModal({
  isOpen,
  onClose,
  tour,
  onSuccess,
}: EditTourModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const languageRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Tour>({
    id: "",
    title: "",
    description: "",
    highlights: [],
    meeting_point: "",
    price_per_group: 0,
    max_people: 8,
    duration: "",
    location: "",
    image_urls: [],
    tags: [],
    categories: [], // Ostaje u stateu, ali se NE PRIKAZUJE
    language_offered: ["Hrvatski"],
    is_featured: false,
    benefits: [],
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Zatvori dropdown kada se klikne izvan
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setLanguageDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Resetiraj pretragu kada se otvori dropdown
  useEffect(() => {
    if (languageDropdownOpen) {
      setLanguageSearch("");
    }
  }, [languageDropdownOpen]);

  // Inicijaliziraj formu kada se otvori modal
  useEffect(() => {
    if (tour && isOpen) {
      setFormData({
        id: tour.id,
        title: tour.title || "",
        description: tour.description || "",
        highlights: tour.highlights || [],
        meeting_point: tour.meeting_point || "",
        price_per_group: tour.price_per_group || 0,
        max_people: tour.max_people || 8,
        duration: tour.duration || "",
        location: tour.location || "",
        image_urls: tour.image_urls || [],
        tags: tour.tags || [],
        categories: tour.categories || [], // Zadržavamo originalne kategorije, ali ih ne prikazujemo
        language_offered: tour.language_offered || ["Hrvatski"],
        is_featured: tour.is_featured || false,
        benefits: tour.benefits || [],
      });
      setError("");
      setSuccess("");
      setShowSuccessToast(false);
      setFieldErrors({});
      setLanguageDropdownOpen(false);
      setLanguageSearch("");
    }
  }, [tour, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Očisti grešku za polje kada se počne unositi
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addLanguage = (language: string) => {
    if (!formData.language_offered.includes(language)) {
      setFormData((prev) => ({
        ...prev,
        language_offered: [...prev.language_offered, language],
      }));
    }
    setLanguageDropdownOpen(false);
    setLanguageSearch("");
  };

  const removeLanguage = (languageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      language_offered: prev.language_offered.filter(
        (lang) => lang !== languageToRemove,
      ),
    }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }));
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const setImageUrl = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: url.trim() ? [url.trim()] : [],
    }));
  };

  const removeImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      image_urls: [],
    }));
    setImageUrlInput("");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Naslov je obavezan";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Naslov mora imati barem 5 znakova";
    }

    if (!formData.description.trim()) {
      errors.description = "Opis je obavezan";
    } else if (formData.description.trim().length < 20) {
      errors.description = "Opis mora imati barem 20 znakova";
    }

    // NE validiramo kategorije - one se ne mijenjaju!

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        // NE šaljemo categories - ostaju nepromijenjene!
        categories: formData.categories, // Šaljemo originalne kategorije
        highlights: formData.highlights.filter((h) => h.trim()),
        meeting_point: formData.meeting_point,
        price_per_group: formData.price_per_group,
        max_people: formData.max_people,
        duration: formData.duration,
        location: formData.location,
        image_urls: formData.image_urls.filter((img) => img.trim()),
        tags: formData.tags.filter((t) => t.trim()),
        language_offered: formData.language_offered,
        is_featured: formData.is_featured,
        benefits: formData.benefits.filter((b) => b.trim()),
      };

      const response = await fetch(`/api/tours/${formData.id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          throw new Error(data.error);
        }
        throw new Error("Došlo je do greške pri ažuriranju izleta");
      }

      setShowSuccessToast(true);
      setSuccess("Izlet je uspješno ažuriran!");

      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtriraj jezike
  const availableLanguages = AVAILABLE_LANGUAGES.filter(
    (lang) => !formData.language_offered.includes(lang),
  );
  const filteredLanguages = availableLanguages.filter((lang) =>
    lang.toLowerCase().includes(languageSearch.toLowerCase()),
  );

  const hasErrors = Object.keys(fieldErrors).length > 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#104d2f]/5 to-[#0f6659]/5">
            <div className="flex items-center gap-3">
              <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-[#2b946f]" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Uredi izlet
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Ažurirajte podatke o izletu{" "}
                  <span className="text-red-500 font-medium">*</span> označava
                  obavezna polja
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Success Toast */}
          <AnimatePresence>
            {showSuccessToast && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-auto"
              >
                <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 font-medium">
                    Izlet je uspješno ažuriran!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form - skrolajući sadržaj */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Osnovne informacije - BREZ KATEGORIJ! */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  Osnovne informacije <span className="text-red-500">*</span>
                </h3>

                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} />
                    Naslov izleta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all ${
                      fieldErrors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="npr. Zagrebački gradski izlet"
                  />
                  {fieldErrors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} />
                    Opis izleta <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all resize-none ${
                      fieldErrors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Detaljan opis izleta, što će se događati, što će sudionici naučiti..."
                  />
                  {fieldErrors.description ? (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.description}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 20 znakova, maksimum 2000 znakova
                    </p>
                  )}
                </div>

                {/* PRIKAZ POSTOJEĆIH KATEGORIJA - SAMO ZA ČITANJE */}
                {formData.categories.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <span>Kategorije (nije moguće mijenjati)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Kategorije se ne mogu mijenjati prilikom uređivanja
                      izleta.
                    </p>
                  </div>
                )}
              </div>

              {/* Detalji izleta */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  Detalji izleta
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} />
                      Lokacija
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                      placeholder="npr. Zagreb, Hrvatska"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} />
                      Trajanje
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                      placeholder="npr. 3 sata, 1 dan, 2h 30min"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} />
                      Cijena po grupi (€)
                    </label>
                    <input
                      type="number"
                      name="price_per_group"
                      value={formData.price_per_group}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} />
                      Maksimalan broj osoba
                    </label>
                    <input
                      type="number"
                      name="max_people"
                      value={formData.max_people}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} />
                    Mjesto susreta
                  </label>
                  <input
                    type="text"
                    name="meeting_point"
                    value={formData.meeting_point}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    placeholder="npr. Trg bana Jelačića, ispod konja"
                  />
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Award size={16} />
                  Značajke (highlights)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addHighlight())
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent"
                    placeholder="npr. Panoramski pogled na more..."
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Dodaj</span>
                  </button>
                </div>
                {formData.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {formData.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#2b946f] mt-1 flex-shrink-0" />
                        <span className="flex-1 text-gray-700 text-sm sm:text-base">
                          {highlight}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="text-gray-400 hover:text-gray-700 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Check size={16} />
                  Što je uključeno
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addBenefit())
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent"
                    placeholder="npr. Vodič s licencom, Osiguranje..."
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Dodaj</span>
                  </button>
                </div>
                {formData.benefits.length > 0 && (
                  <ul className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#2b946f] mt-1 flex-shrink-0" />
                        <span className="flex-1 text-gray-700 text-sm sm:text-base">
                          {benefit}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="text-gray-400 hover:text-gray-700 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Image URL - SAMO JEDNA SLIKA */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ImageIcon size={16} />
                  URL slike
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={formData.image_urls[0] || ""}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  {formData.image_urls[0] && (
                    <button
                      type="button"
                      onClick={removeImageUrl}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      <span className="hidden sm:inline">Ukloni</span>
                    </button>
                  )}
                </div>
                {formData.image_urls[0] && (
                  <div className="relative w-full sm:w-1/2 md:w-1/3">
                    <img
                      src={formData.image_urls[0]}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%239ca3af'%3ENevažeći URL%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Jezici - VIŠEJEZIČNI IZBOR */}
              <div className="space-y-4" ref={languageRef}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Globe size={16} />
                  Dostupni jezici
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setLanguageDropdownOpen(!languageDropdownOpen)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-all cursor-pointer bg-white"
                  >
                    <span
                      className={
                        formData.language_offered.length === 0
                          ? "text-gray-500"
                          : "text-gray-900"
                      }
                    >
                      {formData.language_offered.length === 0
                        ? "Odaberite jezike..."
                        : `Odabrano: ${formData.language_offered.length} jezika`}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${languageDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {languageDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
                      >
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative">
                            <Search
                              size={16}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="text"
                              value={languageSearch}
                              onChange={(e) =>
                                setLanguageSearch(e.target.value)
                              }
                              placeholder="Pretraži jezike..."
                              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                          {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((language) => (
                              <button
                                key={language}
                                type="button"
                                onClick={() => addLanguage(language)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer"
                              >
                                <span>{language}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              {availableLanguages.length === 0
                                ? "Svi jezici su odabrani"
                                : "Nema rezultata"}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Odabrani jezici */}
                {formData.language_offered.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.language_offered.map((language) => (
                      <span
                        key={language}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => removeLanguage(language)}
                          className="text-blue-400 hover:text-blue-700 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Istaknuti izlet */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#2b946f] rounded focus:ring-[#2b946f]"
                />
                <label
                  htmlFor="is_featured"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  <Award size={16} className="text-[#ff6309]" />
                  Istaknuti izlet
                </label>
              </div>
            </form>
          </div>

          {/* GREŠKE I TIPKE - fiksni footer */}
          <div className="border-t border-gray-200 bg-white p-4 sm:p-6 space-y-4">
            <AnimatePresence>
              {hasErrors && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-800 mb-1">
                        Molimo ispravite sljedeće greške:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {Object.entries(fieldErrors).map(([field, message]) => (
                          <li key={field} className="text-sm text-red-700">
                            {message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4">
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
                onClick={handleSubmit}
                disabled={loading || hasErrors}
                className={`flex-1 bg-[#2b946f] hover:bg-[#247c5d] text-white py-3.5 rounded-lg transition-all font-medium flex items-center justify-center gap-2 ${
                  loading || hasErrors
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg cursor-pointer"
                }`}
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

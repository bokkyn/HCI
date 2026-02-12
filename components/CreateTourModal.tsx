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
  Tag,
  Plus,
  Search,
} from "lucide-react";

interface CreateTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ALLOWED_CATEGORIES = [
  "Hrana",
  "Kultura",
  "Priroda",
  "Urbano",
  "Sport",
  "Misterija",
  "Povijest",
  "Zabava",
];

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

export default function CreateTourModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTourModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [availableCategories, setAvailableCategories] =
    useState<string[]>(ALLOWED_CATEGORIES);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const categoryRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    // OBVEZNA polja
    title: "",
    description: "",

    // Kategorije
    categories: [] as string[],

    // Opcionalna polja
    highlights: [""],
    meeting_point: "",
    price_per_group: 0 as number | string,
    max_people: 8 as number | string,
    duration: "",
    location: "",
    image_url: "", // Promijenjeno iz niza u jedan URL
    language_offered: ["Hrvatski"] as string[],
    is_featured: false,
    benefits: [""],
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  // Zatvori dropdown kada se klikne izvan
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
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

  // Ažuriraj dostupne kategorije kada se promijene odabrane kategorije
  useEffect(() => {
    const selected = formData.categories;
    const filtered = ALLOWED_CATEGORIES.filter(
      (cat) => !selected.includes(cat),
    );
    setAvailableCategories(filtered);
  }, [formData.categories]);

  // Resetiraj pretragu kada se otvori dropdown
  useEffect(() => {
    if (categoryDropdownOpen) {
      setCategorySearch("");
    }
  }, [categoryDropdownOpen]);

  useEffect(() => {
    if (languageDropdownOpen) {
      setLanguageSearch("");
    }
  }, [languageDropdownOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      categories: [],
      highlights: [""],
      meeting_point: "",
      price_per_group: 0,
      max_people: 8,
      duration: "",
      location: "",
      image_url: "", // Reset na prazan string
      language_offered: ["Hrvatski"],
      is_featured: false,
      benefits: [""],
    });
    setError("");
    setSuccess("");
    setShowSuccessToast(false);
    setFieldErrors({});
    setCategoryDropdownOpen(false);
    setLanguageDropdownOpen(false);
    setCategorySearch("");
    setLanguageSearch("");
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

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
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseFloat(value),
      }));
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

  const addCategory = (category: string) => {
    if (formData.categories.length >= 3) {
      setFieldErrors((prev) => ({
        ...prev,
        categories: "Maksimalno 3 kategorije su dozvoljene",
      }));
      return;
    }

    if (!formData.categories.includes(category)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    }

    setCategoryDropdownOpen(false);
    setCategorySearch("");
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
    }));
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
        highlights: [
          ...prev.highlights.filter((h) => h),
          highlightInput.trim(),
        ],
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
        benefits: [...prev.benefits.filter((b) => b), benefitInput.trim()],
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

    if (formData.categories.length === 0) {
      errors.categories = "Barem jedna kategorija je obavezna";
    }

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
      // Pripremi podatke
      const tourData = {
        ...formData,
        price_per_group: Number(formData.price_per_group) || 0,
        max_people: Number(formData.max_people) || 1,
        image_urls: formData.image_url ? [formData.image_url] : [], // Pretvori u niz za backend
        highlights: formData.highlights.filter((h) => h.trim()),
        benefits: formData.benefits.filter((b) => b.trim()),
      };

      const response = await fetch("/api/tours/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tourData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          throw new Error(data.error);
        }
        throw new Error("Došlo je do greške pri kreiranju izleta");
      }

      // Uspješno kreiranje - prikaži toast
      setShowSuccessToast(true);
      setSuccess("Izlet je uspješno kreiran!");

      // Zatvori modal nakon 2 sekunde
      setTimeout(() => {
        onClose();
        onSuccess();
        resetForm();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtriraj kategorije prema pretrazi
  const filteredCategories = availableCategories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  // Filtriraj jezike prema pretrazi
  const availableLanguages = AVAILABLE_LANGUAGES.filter(
    (lang) => !formData.language_offered.includes(lang),
  );
  const filteredLanguages = availableLanguages.filter((lang) =>
    lang.toLowerCase().includes(languageSearch.toLowerCase()),
  );

  // Provjeri ima li grešaka u formi
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
          {/* Header - fiksni */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#104d2f]/5 to-[#0f6659]/5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Dodaj novi izlet
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                <span className="text-red-500 font-medium">*</span> označava
                obavezna polja
              </p>
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
                    Izlet je uspješno kreiran!
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
              {/* OBVEZNA polja */}
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

                {/* Categories - dropdown s pretragom */}
                <div className="space-y-4" ref={categoryRef}>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Tag size={16} />
                    Kategorije <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">
                      (Odaberite 1-3 kategorije)
                    </span>
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setCategoryDropdownOpen(!categoryDropdownOpen)
                      }
                      disabled={formData.categories.length >= 3}
                      className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition-all ${
                        fieldErrors.categories
                          ? "border-red-500"
                          : "border-gray-300 hover:border-gray-400"
                      } ${
                        formData.categories.length >= 3
                          ? "opacity-50 cursor-not-allowed bg-gray-50"
                          : "cursor-pointer bg-white"
                      }`}
                    >
                      <span
                        className={`${formData.categories.length === 0 ? "text-gray-500" : "text-gray-900"}`}
                      >
                        {formData.categories.length === 0
                          ? "Odaberite kategoriju..."
                          : `Odabrano: ${formData.categories.length} kategorija(e)`}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown menu s pretragom */}
                    <AnimatePresence>
                      {categoryDropdownOpen &&
                        formData.categories.length < 3 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
                          >
                            {/* Polje za pretragu */}
                            <div className="p-2 border-b border-gray-200">
                              <div className="relative">
                                <Search
                                  size={16}
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                  type="text"
                                  value={categorySearch}
                                  onChange={(e) =>
                                    setCategorySearch(e.target.value)
                                  }
                                  placeholder="Pretraži kategorije..."
                                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>

                            {/* Lista kategorija */}
                            <div className="max-h-60 overflow-y-auto">
                              {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                  <button
                                    key={category}
                                    type="button"
                                    onClick={() => addCategory(category)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer"
                                  >
                                    <span>{category}</span>
                                    {formData.categories.includes(category) && (
                                      <Check
                                        size={16}
                                        className="text-[#2b946f]"
                                      />
                                    )}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                  Nema rezultata
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>

                  {fieldErrors.categories && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.categories}
                    </p>
                  )}

                  {/* Prikaz odabranih kategorija */}
                  {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#2b946f]/10 text-[#2b946f] rounded-full text-sm font-medium"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="text-[#2b946f]/70 hover:text-[#2b946f] cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {formData.categories.length >= 3 && (
                    <p className="text-sm text-amber-600 mt-1">
                      Dostigli ste maksimalan broj kategorija (3)
                    </p>
                  )}
                </div>
              </div>

              {/* Detalji */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  Detalji izleta
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Location */}
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

                  {/* Duration */}
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

                  {/* Price */}
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

                  {/* Max People */}
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

                {/* Meeting Point */}
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
                {formData.highlights.filter((h) => h).length > 0 && (
                  <ul className="space-y-2">
                    {formData.highlights
                      .filter((h) => h)
                      .map((highlight, index) => (
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
                {formData.benefits.filter((b) => b).length > 0 && (
                  <ul className="space-y-2">
                    {formData.benefits
                      .filter((b) => b)
                      .map((benefit, index) => (
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

              {/* Image URL - SAMO JEDAN */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ImageIcon size={16} />
                  URL slike
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                {formData.image_url && (
                  <div className="relative w-full sm:w-1/2 md:w-1/3">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%239ca3af'%3ENevažeći URL%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Languages - višejezični izbor */}
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
                    <span className="text-gray-500">
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
                        {/* Polje za pretragu jezika */}
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

                        {/* Lista jezika */}
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
                              Nema rezultata
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Prikaz odabranih jezika */}
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

              {/* Featured checkbox */}
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
            {/* Prikaz grešaka na dnu */}
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

            {/* Tipke */}
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
                className={`flex-1 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3.5 rounded-lg transition-all font-medium flex items-center justify-center gap-2 ${
                  loading || hasErrors
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Kreiranje...
                  </>
                ) : (
                  "Kreiraj izlet"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

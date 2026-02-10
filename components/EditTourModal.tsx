"use client";

import { useState, useEffect } from "react";
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
  Edit,
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

export default function EditTourModal({
  isOpen,
  onClose,
  tour,
  onSuccess,
}: EditTourModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [availableCategories, setAvailableCategories] =
    useState<string[]>(ALLOWED_CATEGORIES);

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
    categories: [],
    language_offered: ["Hrvatski"],
    is_featured: false,
    benefits: [],
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Ažuriraj dostupne kategorije kada se promijene odabrane kategorije
  useEffect(() => {
    const selected = formData.categories;
    const filtered = ALLOWED_CATEGORIES.filter(
      (cat) => !selected.includes(cat),
    );
    setAvailableCategories(filtered);
  }, [formData.categories]);

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
        categories: tour.categories || [],
        language_offered: tour.language_offered || ["Hrvatski"],
        is_featured: tour.is_featured || false,
        benefits: tour.benefits || [],
      });
      setError("");
      setSuccess("");
      setFieldErrors({});
      setCategoryDropdownOpen(false);
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
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
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

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        image_urls: [
          ...prev.image_urls.filter((img) => img),
          imageUrlInput.trim(),
        ],
      }));
      setImageUrlInput("");
    }
  };

  const removeImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      // Validacija
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

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        throw new Error("Ispravite greške u obrascu");
      }

      // Pripremi podatke za update
      const updateData = {
        title: formData.title,
        description: formData.description,
        categories: formData.categories,
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
        throw new Error("Došlo je do greške pri ažuriranju ture");
      }

      // Uspješno ažuriranje
      setSuccess("Tura je uspješno ažurirana!");
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1500);
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
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#104d2f]/5 to-[#0f6659]/5">
            <div className="flex items-center gap-3">
              <Edit className="h-6 w-6 text-[#2b946f]" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Uredi turu</h2>
                <p className="text-gray-600 mt-1">
                  Ažurirajte podatke o turi{" "}
                  <span className="text-red-500 font-medium">*</span> označava
                  obavezna polja
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
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
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-700">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title & Description */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  Osnovne informacije <span className="text-red-500">*</span>
                </h3>

                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} />
                    Naslov ture <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all ${
                      fieldErrors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    required
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
                    Opis ture <span className="text-red-500">*</span>
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
                    required
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

                {/* Categories */}
                <div className="space-y-4">
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
                      disabled={
                        availableCategories.length === 0 ||
                        formData.categories.length >= 3
                      }
                      className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition-all ${
                        fieldErrors.categories
                          ? "border-red-500"
                          : "border-gray-300 hover:border-gray-400"
                      } ${
                        availableCategories.length === 0 ||
                        formData.categories.length >= 3
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <span className="text-gray-500">
                        {formData.categories.length === 0
                          ? "Odaberite kategoriju..."
                          : `Odabrano: ${formData.categories.length} kategorija(e)`}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {fieldErrors.categories && (
                      <p className="mt-1 text-sm text-red-600">
                        {fieldErrors.categories}
                      </p>
                    )}

                    {/* Dropdown menu */}
                    <AnimatePresence>
                      {categoryDropdownOpen &&
                        availableCategories.length > 0 &&
                        formData.categories.length < 3 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                          >
                            {availableCategories.map((category) => (
                              <button
                                key={category}
                                type="button"
                                onClick={() => addCategory(category)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                              >
                                <span>{category}</span>
                                {formData.categories.includes(category) && (
                                  <Check size={16} className="text-[#2b946f]" />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>

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
                            className="text-[#2b946f]/70 hover:text-[#2b946f]"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Info o maksimalnom broju kategorija */}
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
                  Detalji ture
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addHighlight())
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent"
                    placeholder="npr. Panoramski pogled na more, Degustacija lokalnih specijaliteta..."
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Dodaj
                  </button>
                </div>
                {formData.highlights.filter((h) => h).length > 0 && (
                  <ul className="space-y-2">
                    {formData.highlights
                      .filter((h) => h)
                      .map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-[#2b946f] mt-1 flex-shrink-0" />
                          <span className="flex-1 text-gray-700">
                            {highlight}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeHighlight(index)}
                            className="text-gray-400 hover:text-gray-700"
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addBenefit())
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent"
                    placeholder="npr. Vodič s licencom, Osiguranje, Snack i voda..."
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Dodaj
                  </button>
                </div>
                {formData.benefits.filter((b) => b).length > 0 && (
                  <ul className="space-y-2">
                    {formData.benefits
                      .filter((b) => b)
                      .map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-[#2b946f] mt-1 flex-shrink-0" />
                          <span className="flex-1 text-gray-700">
                            {benefit}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeBenefit(index)}
                            className="text-gray-400 hover:text-gray-700"
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {/* Image URLs */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ImageIcon size={16} />
                  URL-ovi slika
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addImageUrl())
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Dodaj
                  </button>
                </div>
                {formData.image_urls.filter((img) => img).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {formData.image_urls
                      .filter((img) => img)
                      .map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%239ca3af'%3ENevažeći URL%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Tags (zaostalo polje za kompatibilnost) */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Tag size={16} />
                  Tagovi (dodatne oznake)
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: prev.tags.filter((_, i) => i !== index),
                          }))
                        }
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages & Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Globe size={16} />
                    Dostupni jezici
                  </label>
                  <select
                    name="language_offered"
                    value={formData.language_offered[0]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        language_offered: [e.target.value],
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all bg-white"
                  >
                    <option value="Hrvatski">Hrvatski</option>
                    <option value="Engleski">Engleski</option>
                    <option value="Njemački">Njemački</option>
                    <option value="Talijanski">Talijanski</option>
                    <option value="Španjolski">Španjolski</option>
                  </select>
                </div>

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
                    Istaknuta tura
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
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

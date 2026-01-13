"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Calendar,
  Users,
  Filter,
  Mountain,
  Utensils,
  Landmark,
  Dumbbell,
  Languages,
} from "lucide-react";

export function TourSearch() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <section
      id="tour-search"
      className="py-16 px-4 bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10 -mt-20 relative z-20"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Lokacija"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Users
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:border-transparent appearance-none">
                <option>1 osoba</option>
                <option>2 osobe</option>
                <option>3-5 osoba</option>
                <option>6+ osoba</option>
              </select>
            </div>

            <button className="bg-[#ff6309] text-white py-3 rounded-lg hover:bg-[#e55808] transition-colors">
              Pretraži
            </button>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 text-[#104d2f] hover:text-[#ff6309] transition-colors"
          >
            <Filter size={18} />
            Napredni filteri
          </button>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Themes */}
                <div>
                  <label className="block text-gray-700 mb-3">Teme</label>
                  <div className="space-y-2">
                    {[
                      { icon: Dumbbell, label: "Sport" },
                      { icon: Landmark, label: "Kultura" },
                      { icon: Mountain, label: "Priroda" },
                      { icon: Utensils, label: "Hrana" },
                    ].map((theme) => (
                      <label
                        key={theme.label}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded text-[#ff6309] focus:ring-[#ff6309]"
                        />
                        <theme.icon size={18} className="text-gray-500" />
                        <span className="text-gray-700">{theme.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-gray-700 mb-3">Težina</label>
                  <div className="space-y-2">
                    {["Lako", "Srednje", "Teško"].map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="difficulty"
                          className="text-[#ff6309] focus:ring-[#ff6309]"
                        />
                        <span className="text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-gray-700 mb-3">
                    Jezik vodiča
                  </label>
                  <div className="relative">
                    <Languages
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:border-transparent">
                      <option>Hrvatski</option>
                      <option>Engleski</option>
                      <option>Njemački</option>
                      <option>Talijanski</option>
                      <option>Španjolski</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

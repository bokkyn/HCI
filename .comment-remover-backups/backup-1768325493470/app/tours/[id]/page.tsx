"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Languages,
  Award,
  Check,
  Share2,
  Heart,
} from "lucide-react";
import Image from "next/image";

interface Tour {
  id: number;
  guide_id: string;
  title: string;
  highlights: string[];
  description: string;
  meeting_point: string;
  price_per_group: number;
  max_people: number;
  duration: string;
  location_id: string;
  location: string;
  image_urls: string[];
  tags: string[];
  language_offered: string[];
  is_featured: boolean;
  benefits: string[];
  guide: {
    name: string;
    avatar: string;
    rating: number;
    tours_led: number;
  };
  rating: number;
  reviews: number;
}

const tourData: Record<number, Tour> = {
  1: {
    id: 1,
    guide_id: "guide-001",
    title: "Planinski Uspon Velebit",
    highlights: [
      "Spektakularan pogled na Jadransko more",
      "Upoznavanje endemskih biljnih vrsta",
      "Profesionalni planinski vodič",
      "Mala grupa do 8 ljudi",
    ],
    description:
      "Doživite nezaboravnu avanturu u srcu hrvatskih planina! Ova tura vodi vas kroz najljepše dijelove Velebita, gdje ćete uživati u spektakularnim pogledima, svježem planinskom zraku i bogatoj flori i fauni. Naš iskusni vodič podijelit će s vama priče o povijesti regije, lokalnim legendama i tajnama prirode. Tura je prilagođena svim razinama iskustva, ali je potrebna osnovna kondicija.",
    meeting_point: "Parkiralište Nacionalnog parka Paklenica, ulaz Starigrad",
    price_per_group: 120,
    max_people: 8,
    duration: "6 sati",
    location_id: "loc-zadar",
    location: "Zadar, Hrvatska",
    image_urls: [
      "https://images.unsplash.com/photo-1471240840307-485d3bc42300?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    ],
    tags: ["Planinarenje", "Priroda", "Avantura", "Fotografija"],
    language_offered: ["Hrvatski", "Engleski", "Njemački"],
    is_featured: true,
    benefits: [
      "Oprema za planinarenje (štapovi, karte)",
      "Voda i energetski snack",
      "Osiguranje",
      "Fotograf za grupne slike",
    ],
    guide: {
      name: "Marko Kovač",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 4.9,
      tours_led: 127,
    },
    rating: 4.9,
    reviews: 127,
  },
  2: {
    id: 2,
    guide_id: "guide-002",
    title: "Street Food Aventura",
    highlights: [
      "10+ lokalnih street food destinacija",
      "Degustacija autentičnih specijaliteta",
      "Priče o zagrebačkoj gastro sceni",
      "Skrivena mjesta koja turisti ne znaju",
    ],
    description:
      "Otkrijte pravu zagrebačku street food scenu s našim lokalnim gastro vodičem! Ova tura nije samo o hrani - to je putovanje kroz kulturu, povijest i dušu grada. Posjetit ćemo najpoznatije street food destinacije, ali i skrivene dragulje koje znaju samo lokalci. Od ćevapa do strukli, od craft pive do domaćih sokova - iskusite Zagreb svim osjetilima!",
    meeting_point: "Trg bana Jelačića, ispred fontane",
    price_per_group: 80,
    max_people: 12,
    duration: "3 sata",
    location_id: "loc-zagreb",
    location: "Zagreb, Hrvatska",
    image_urls: [
      "https://images.unsplash.com/photo-1762674462382-6ea7fb670032?w=1200",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
    ],
    tags: ["Hrana", "Kultura", "Street Food", "Zagreb"],
    language_offered: ["Hrvatski", "Engleski"],
    is_featured: true,
    benefits: [
      "Degustacija na 10+ lokacija",
      "Sve degustacije uključene u cijenu",
      "Lokalni gastro vodič",
      "Mapa s preporukama za kasnije",
    ],
    guide: {
      name: "Ana Jurić",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5.0,
      tours_led: 89,
    },
    rating: 5.0,
    reviews: 89,
  },
};

 function TourDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  const tour = tourData[Number(id)] || tourData[1];

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        {/* Hero Image Gallery */}
        <section className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-[600px]">
            {/* Main Image */}
            <div className="relative h-[400px] lg:h-[600px]">
              <Image
                src={tour.image_urls[selectedImage]}
                alt={tour.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              {tour.is_featured && (
                <div className="absolute top-4 left-4 bg-[#ff6309] text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <Award size={20} />
                  <span className="font-semibold">Featured</span>
                </div>
              )}
              <button
                onClick={() => setShowAllImages(true)}
                className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Prikaži sve slike ({tour.image_urls.length})
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="hidden lg:grid grid-cols-2 gap-2 h-[600px]">
              {tour.image_urls.slice(1, 3).map((img, idx) => (
                <div
                  key={idx}
                  className="relative cursor-pointer overflow-hidden"
                  onClick={() => setSelectedImage(idx + 1)}
                >
                  <Image
                    src={img}
                    alt={`${tour.title} ${idx + 2}`}
                    fill
                    sizes="50vw"
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h1 className="text-[#104d2f] mb-4 text-3xl md:text-4xl font-bold">
                  {tour.title}
                </h1>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={20} className="text-[#ff6309]" />
                    <span className="font-medium">{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={20} className="text-[#2b946f]" />
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={20} className="text-[#2b946f]" />
                    <span className="font-medium">
                      Do {tour.max_people} osoba
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star
                      size={20}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-medium">
                      {tour.rating} ({tour.reviews} recenzija)
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tour.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-[#2b946f]/10 text-[#104d2f] rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-[#104d2f] mb-4 text-2xl font-bold">Opis</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {tour.description}
                </p>
              </motion.div>

              {/* Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-[#104d2f] mb-4 text-2xl font-bold">
                  Highlights
                </h3>
                <ul className="space-y-3">
                  {tour.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check
                        className="text-[#2b946f] flex-shrink-0 mt-1"
                        size={20}
                      />
                      <span className="text-gray-700 text-lg">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10 rounded-2xl p-8"
              >
                <h3 className="text-[#104d2f] mb-4 text-2xl font-bold">
                  Što je uključeno
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-gray-700 text-lg"
                    >
                      <Check className="text-[#2b946f]" size={18} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Meeting Point */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-[#104d2f] mb-4 text-2xl font-bold">
                  Mjesto susreta
                </h3>
                <div className="flex items-start gap-3">
                  <MapPin
                    className="text-[#ff6309] flex-shrink-0 mt-1"
                    size={24}
                  />
                  <p className="text-gray-700 text-lg">{tour.meeting_point}</p>
                </div>
              </motion.div>

              {/* Guide Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-[#104d2f] mb-6 text-2xl font-bold">
                  Tvoj vodič
                </h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <Image
                      src={tour.guide.avatar}
                      alt={tour.guide.name}
                      fill
                      className="rounded-full object-cover ring-4 ring-[#2b946f]/20"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#104d2f] mb-2 text-xl font-bold">
                      {tour.guide.name}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span>{tour.guide.rating} ocjena</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{tour.guide.tours_led} tura vodio/la</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg sticky top-24"
              >
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl text-[#2b946f] font-bold">
                      €{tour.price_per_group}
                    </span>
                    <span className="text-gray-600 text-lg">po grupi</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Do {tour.max_people} osoba
                  </p>
                </div>

                {/* Languages */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Languages size={20} className="text-[#2b946f]" />
                    <span className="text-gray-700 font-medium">
                      Dostupni jezici
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tour.language_offered.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Date Picker */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Odaberi datum
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] font-medium"
                    />
                  </div>
                </div>

                {/* Number of People */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Broj osoba
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] font-medium">
                    {Array.from(
                      { length: tour.max_people },
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "osoba" : "osobe"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <button className="w-full bg-[#ff6309] text-white py-4 rounded-lg hover:bg-[#e55808] transition-colors mb-3 font-bold text-lg">
                  Rezerviraj sada
                </button>

                <div className="flex gap-2">
                  <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
                    <Heart size={20} />
                    Spremi
                  </button>
                  <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
                    <Share2 size={20} />
                    Podijeli
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4 font-medium">
                  Besplatno otkazivanje do 24h prije
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TourDetailPage;
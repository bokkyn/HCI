// "use client";

// import { useState, useMemo } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "motion/react";
// import {
//   MapPin,
//   Star,
//   Grid,
//   Map as MapIcon,
//   Search,
//   Filter,
//   ChevronDown,
//   X,
// } from "lucide-react";
// import { Footer } from "@/components/Footer";

// interface Tour {
//   id: number;
//   title: string;
//   location: string;
//   lat: number;
//   lng: number;
//   price: number;
//   rating: number;
//   reviews: number;
//   image: string;
//   guide: string;
//   duration: string;
//   category: string;
//   tags: string[];
//   languages: string[];
//   maxPeople: number;
//   isFeatured: boolean;
// }

// const tours: Tour[] = [
//   {
//     id: 1,
//     title: "Planinski Uspon Velebit",
//     location: "Zadar, Hrvatska",
//     lat: 44.1194,
//     lng: 15.2314,
//     price: 120,
//     rating: 4.9,
//     reviews: 127,
//     image: "https://images.unsplash.com/photo-1471240840307-485d3bc42300?w=400",
//     guide: "Marko Kovač",
//     duration: "6 sati",
//     category: "Priroda",
//     tags: ["Planinarenje", "Priroda", "Avantura"],
//     languages: ["Hrvatski", "Engleski", "Njemački"],
//     maxPeople: 8,
//     isFeatured: true,
//   },
//   {
//     id: 2,
//     title: "Street Food Aventura",
//     location: "Zagreb, Hrvatska",
//     lat: 45.815,
//     lng: 15.9819,
//     price: 80,
//     rating: 5.0,
//     reviews: 89,
//     image: "https://images.unsplash.com/photo-1762674462382-6ea7fb670032?w=400",
//     guide: "Ana Jurić",
//     duration: "3 sata",
//     category: "Hrana",
//     tags: ["Hrana", "Street Food", "Zagreb"],
//     languages: ["Hrvatski", "Engleski"],
//     maxPeople: 12,
//     isFeatured: true,
//   },
//   {
//     id: 3,
//     title: "Kulturna Šetnja Starim Gradom",
//     location: "Split, Hrvatska",
//     lat: 43.5081,
//     lng: 16.4402,
//     price: 60,
//     rating: 4.8,
//     reviews: 156,
//     image: "https://images.unsplash.com/photo-1765266958853-5c6ae343a711?w=400",
//     guide: "Ivana Marić",
//     duration: "2 sata",
//     category: "Kultura",
//     tags: ["Kultura", "Povijest", "Arhitektura"],
//     languages: ["Hrvatski", "Engleski", "Talijanski"],
//     maxPeople: 15,
//     isFeatured: false,
//   },
//   {
//     id: 4,
//     title: "Kayaking Jadranska Avantura",
//     location: "Dubrovnik, Hrvatska",
//     lat: 42.6507,
//     lng: 18.0944,
//     price: 95,
//     rating: 4.9,
//     reviews: 203,
//     image: "https://images.unsplash.com/photo-1631165538791-295d382f5edd?w=400",
//     guide: "Petar Novak",
//     duration: "4 sata",
//     category: "Sport",
//     tags: ["Sport", "Kayaking", "More"],
//     languages: ["Hrvatski", "Engleski"],
//     maxPeople: 10,
//     isFeatured: false,
//   },
//   {
//     id: 5,
//     title: "Street Art & Urbana Kultura",
//     location: "Rijeka, Hrvatska",
//     lat: 45.3271,
//     lng: 14.4422,
//     price: 50,
//     rating: 4.7,
//     reviews: 94,
//     image: "https://images.unsplash.com/photo-1607220868624-dd855c2839be?w=400",
//     guide: "Luka Horvat",
//     duration: "2.5 sata",
//     category: "Kultura",
//     tags: ["Umjetnost", "Street Art", "Urbano"],
//     languages: ["Hrvatski"],
//     maxPeople: 12,
//     isFeatured: false,
//   },
//   {
//     id: 6,
//     title: "Wine Tasting Istra Tour",
//     location: "Pula, Hrvatska",
//     lat: 44.8666,
//     lng: 13.8496,
//     price: 140,
//     rating: 5.0,
//     reviews: 167,
//     image: "https://images.unsplash.com/photo-1537932155948-d391809047d5?w=400",
//     guide: "Petra Babić",
//     duration: "5 sati",
//     category: "Hrana",
//     tags: ["Vino", "Degustacija", "Gastro"],
//     languages: ["Hrvatski", "Engleski", "Talijanski"],
//     maxPeople: 8,
//     isFeatured: true,
//   },
// ];

// const categories = ["Sve", "Priroda", "Hrana", "Kultura", "Sport"] as const;
// const allLanguages = [
//   "Hrvatski",
//   "Engleski",
//   "Njemački",
//   "Talijanski",
//   "Španjolski",
// ] as const;

// export function ToursPage() {
//   const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
//   const [selectedCategory, setSelectedCategory] = useState<string>("Sve");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
//   const [hoveredTour, setHoveredTour] = useState<number | null>(null);

//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
//   const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
//   const [selectedDuration, setSelectedDuration] = useState<string>("");
//   const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

//   const filteredTours = useMemo(() => {
//     return tours.filter((tour) => {

//       if (selectedCategory !== "Sve" && tour.category !== selectedCategory)
//         return false;

//       if (searchQuery) {
//         const query = searchQuery.toLowerCase();
//         const matchesTitle = tour.title.toLowerCase().includes(query);
//         const matchesTags = tour.tags.some((tag) =>
//           tag.toLowerCase().includes(query)
//         );
//         if (!matchesTitle && !matchesTags) return false;
//       }

//       if (tour.price < priceRange[0] || tour.price > priceRange[1])
//         return false;

//       if (selectedLanguages.length > 0) {
//         if (!tour.languages.some((lang) => selectedLanguages.includes(lang)))
//           return false;
//       }

//       if (selectedDuration) {
//         const hours = parseInt(tour.duration);
//         if (selectedDuration === "short" && hours > 3) return false;
//         if (selectedDuration === "medium" && (hours <= 3 || hours > 5))
//           return false;
//         if (selectedDuration === "long" && hours <= 5) return false;
//       }

//       if (showFeaturedOnly && !tour.isFeatured) return false;

//       return true;
//     });
//   }, [
//     selectedCategory,
//     searchQuery,
//     priceRange,
//     selectedLanguages,
//     selectedDuration,
//     showFeaturedOnly,
//   ]);

//   const getMapPosition = (lat: number, lng: number) => {
//     const latPercent = ((lat - 42.4) / (46.5 - 42.4)) * 100;
//     const lngPercent = ((lng - 13.5) / (19.5 - 13.5)) * 100;
//     return {
//       top: `${100 - latPercent}%`,
//       left: `${lngPercent}%`,
//     };
//   };

//   const toggleLanguage = (lang: string) => {
//     setSelectedLanguages((prev) =>
//       prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
//     );
//   };

//   const clearFilters = () => {
//     setSearchQuery("");
//     setSelectedCategory("Sve");
//     setPriceRange([0, 200]);
//     setSelectedLanguages([]);
//     setSelectedDuration("");
//     setShowFeaturedOnly(false);
//   };

//   return (
//     <>
//       <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
//         {/* Header */}
//         <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-12 md:py-20 px-4">
//           <div className="max-w-7xl mx-auto">
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-4 text-3xl md:text-5xl"
//             >
//               Sve Ture
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-lg md:text-xl text-white/90"
//             >
//               Otkrijte {filteredTours.length} unikatnih iskustava s lokalnim
//               vodičima
//             </motion.p>
//           </div>
//         </section>

//         <div className="max-w-7xl mx-auto px-4 py-8">
//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative">
//               <Search
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 placeholder="Pretraži po imenu ili tagovima..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={20} />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Filters & View Toggle */}
//           <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
//             {/* Category Filters */}
//             <div className="flex flex-wrap gap-2">
//               {categories.map((category) => (
//                 <button
//                   key={category}
//                   onClick={() => setSelectedCategory(category)}
//                   className={`px-4 md:px-6 py-2 rounded-full transition-all text-sm md:text-base ${
//                     selectedCategory === category
//                       ? "bg-[#2b946f] text-white shadow-lg"
//                       : "bg-white text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>

//             {/* View Mode Toggle */}
//             <div className="flex gap-2 bg-white rounded-full p-1 shadow-md">
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`px-3 md:px-4 py-2 rounded-full flex items-center gap-2 transition-all text-sm md:text-base ${
//                   viewMode === "grid"
//                     ? "bg-[#2b946f] text-white"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <Grid size={18} />
//                 <span className="hidden sm:inline">Grid</span>
//               </button>
//               <button
//                 onClick={() => setViewMode("map")}
//                 className={`px-3 md:px-4 py-2 rounded-full flex items-center gap-2 transition-all text-sm md:text-base ${
//                   viewMode === "map"
//                     ? "bg-[#2b946f] text-white"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <MapIcon size={18} />
//                 <span className="hidden sm:inline">Karta</span>
//               </button>
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           <div className="mb-8">
//             <button
//               onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//               className="flex items-center gap-2 text-[#2b946f] hover:text-[#104d2f] transition-colors mb-4"
//             >
//               <Filter size={18} />
//               Dodatni filteri
//               <ChevronDown
//                 size={18}
//                 className={`transition-transform ${
//                   showAdvancedFilters ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {showAdvancedFilters && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="bg-white rounded-xl p-6 shadow-md"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {/* Price Range */}
//                   <div>
//                     <label className="block text-gray-700 mb-3">
//                       Cijena (€{priceRange[0]} - €{priceRange[1]})
//                     </label>
//                     <input
//                       type="range"
//                       min="0"
//                       max="200"
//                       value={priceRange[1]}
//                       onChange={(e) =>
//                         setPriceRange([0, Number(e.target.value)])
//                       }
//                       className="w-full"
//                     />
//                   </div>

//                   {/* Duration */}
//                   <div>
//                     <label className="block text-gray-700 mb-3">Trajanje</label>
//                     <select
//                       value={selectedDuration}
//                       onChange={(e) => setSelectedDuration(e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
//                     >
//                       <option value="">Sve</option>
//                       <option value="short">Kratko (do 3h)</option>
//                       <option value="medium">Srednje (3-5h)</option>
//                       <option value="long">Dugo (5h+)</option>
//                     </select>
//                   </div>

//                   {/* Languages */}
//                   <div>
//                     <label className="block text-gray-700 mb-3">Jezici</label>
//                     <div className="flex flex-wrap gap-2">
//                       {allLanguages.map((lang) => (
//                         <button
//                           key={lang}
//                           onClick={() => toggleLanguage(lang)}
//                           className={`px-3 py-1 rounded-full text-sm transition-all ${
//                             selectedLanguages.includes(lang)
//                               ? "bg-[#2b946f] text-white"
//                               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                           }`}
//                         >
//                           {lang}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Featured Toggle */}
//                 <div className="mt-4 flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     id="featured"
//                     checked={showFeaturedOnly}
//                     onChange={(e) => setShowFeaturedOnly(e.target.checked)}
//                     className="w-5 h-5 text-[#2b946f] rounded focus:ring-[#2b946f]"
//                   />
//                   <label
//                     htmlFor="featured"
//                     className="text-gray-700 cursor-pointer"
//                   >
//                     Prikaži samo istaknute ture
//                   </label>
//                 </div>

//                 {/* Clear Filters */}
//                 <button
//                   onClick={clearFilters}
//                   className="mt-4 text-[#ff6309] hover:text-[#e55808] transition-colors"
//                 >
//                   Očisti sve filtere
//                 </button>
//               </motion.div>
//             )}
//           </div>

//           {/* Results Count */}
//           <p className="text-gray-600 mb-6">
//             Pronađeno {filteredTours.length}{" "}
//             {filteredTours.length === 1 ? "tura" : "tura"}
//           </p>

//           {/* Grid View */}
//           {viewMode === "grid" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredTours.map((tour, index) => (
//                 <Link key={tour.id} href={`/tours/${tour.id}`}>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     whileHover={{
//                       y: -8,
//                       boxShadow: "0 20px 40px rgba(43, 148, 111, 0.3)",
//                     }}
//                     className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer"
//                   >
//                     <div className="relative h-48">
//                       <Image
//                         src={tour.image}
//                         alt={tour.title}
//                         fill
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                         className="object-cover"
//                         priority={index < 3}
//                       />
//                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
//                         <Star
//                           size={16}
//                           className="fill-yellow-400 text-yellow-400"
//                         />
//                         <span className="text-sm">{tour.rating}</span>
//                       </div>
//                       <div className="absolute top-4 left-4 bg-[#2b946f] text-white px-3 py-1 rounded-full text-sm">
//                         {tour.category}
//                       </div>
//                       {tour.isFeatured && (
//                         <div className="absolute bottom-4 left-4 bg-[#ff6309] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
//                           <Star size={14} />
//                           Featured
//                         </div>
//                       )}
//                     </div>

//                     <div className="p-6">
//                       <h3 className="text-xl text-[#104d2f] mb-2">
//                         {tour.title}
//                       </h3>

//                       <div className="flex items-center gap-2 text-gray-600 mb-3">
//                         <MapPin size={16} className="text-[#ff6309]" />
//                         <span className="text-sm">{tour.location}</span>
//                       </div>

//                       <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
//                         <span>Vodič: {tour.guide}</span>
//                         <span>{tour.duration}</span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <span className="text-2xl text-[#2b946f]">
//                           €{tour.price}
//                         </span>
//                         <button className="bg-[#ff6309] text-white px-6 py-2 rounded-full hover:bg-[#e55808] transition-colors">
//                           Rezerviraj
//                         </button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 </Link>
//               ))}
//             </div>
//           )}

//           {/* Map View */}
//           {viewMode === "map" && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="relative bg-gradient-to-br from-[#e8f5f1] to-[#d4ebe5] rounded-2xl overflow-hidden shadow-2xl p-4 md:p-8"
//               style={{ height: "700px" }}
//             >
//               <div className="absolute inset-0">
//                 <svg
//                   viewBox="0 0 600 800"
//                   className="w-full h-full opacity-20"
//                   style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
//                 >
//                   <path
//                     d="M 150 100 L 400 100 L 450 200 L 480 300 L 470 400 L 450 500 L 400 600 L 350 700 L 250 650 L 200 550 L 150 450 L 120 350 L 130 250 Z"
//                     fill="#2b946f"
//                     stroke="#104d2f"
//                     strokeWidth="3"
//                   />
//                 </svg>
//               </div>

//               {filteredTours.map((tour) => {
//                 const position = getMapPosition(tour.lat, tour.lng);
//                 return (
//                   <motion.div
//                     key={tour.id}
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ delay: 0.1 * tour.id }}
//                     className="absolute cursor-pointer"
//                     style={{
//                       top: position.top,
//                       left: position.left,
//                       transform: "translate(-50%, -50%)",
//                     }}
//                     onMouseEnter={() => setHoveredTour(tour.id)}
//                     onMouseLeave={() => setHoveredTour(null)}
//                   >
//                     <motion.div
//                       whileHover={{ scale: 1.2 }}
//                       className="relative"
//                     >
//                       <MapPin
//                         size={40}
//                         className="text-[#ff6309] drop-shadow-lg"
//                         fill="#ff6309"
//                       />

//                       {hoveredTour === tour.id && (
//                         <motion.div
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-10"
//                         >
//                           <div className="relative w-full h-32">
//                             <Image
//                               src={tour.image}
//                               alt={tour.title}
//                               fill
//                               sizes="256px"
//                               className="object-cover"
//                             />
//                           </div>
//                           <div className="p-4">
//                             <h4 className="text-[#104d2f] mb-2">
//                               {tour.title}
//                             </h4>
//                             <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
//                               <MapPin size={14} className="text-[#ff6309]" />
//                               {tour.location}
//                             </p>
//                             <div className="flex items-center justify-between">
//                               <span className="text-[#2b946f]">
//                                 €{tour.price}
//                               </span>
//                               <div className="flex items-center gap-1">
//                                 <Star
//                                   size={14}
//                                   className="fill-yellow-400 text-yellow-400"
//                                 />
//                                 <span className="text-sm">{tour.rating}</span>
//                               </div>
//                             </div>
//                             <Link href={`/tours/${tour.id}`}>
//                               <button className="w-full mt-3 bg-[#ff6309] text-white py-2 rounded-full text-sm hover:bg-[#e55808] transition-colors">
//                                 Rezerviraj
//                               </button>
//                             </Link>
//                           </div>
//                         </motion.div>
//                       )}
//                     </motion.div>
//                   </motion.div>
//                 );
//               })}

//               <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 bg-white rounded-xl shadow-lg p-4">
//                 <h4 className="text-[#104d2f] mb-3 text-sm md:text-base">
//                   Legenda
//                 </h4>
//                 <div className="space-y-2">
//                   {categories.slice(1).map((category) => (
//                     <div
//                       key={category}
//                       className="flex items-center gap-2 text-xs md:text-sm"
//                     >
//                       <div className="w-3 h-3 rounded-full bg-[#ff6309]"></div>
//                       <span className="text-gray-700">{category}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="absolute top-4 md:top-8 left-4 md:left-8 bg-white rounded-xl shadow-lg p-4">
//                 <h4 className="text-[#104d2f] mb-2 text-sm md:text-base">
//                   Interaktivna Karta
//                 </h4>
//                 <p className="text-xs md:text-sm text-gray-600">
//                   Pređi mišem preko markera za više informacija
//                 </p>
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }

export default function ToursPage() {
  return null;
}

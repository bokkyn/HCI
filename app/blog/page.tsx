"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Search, X } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "10 Skrivenih Dragulja Hrvatske Koje Morate Posjetiti",
    excerpt:
      "Otkrijte najljepša mjesta koja turisti ne znaju - od tajnih plaža do lokalnih konoba.",
    image: "https://images.unsplash.com/photo-1537932155948-d391809047d5?w=800",
    author: "Ana Jurić",
    date: "10. Prosinac 2024",
    readTime: "5 min",
    category: "Putovanja",
  },
  {
    id: 2,
    title: "Kako Postati Uspješan Lokalni Vodič",
    excerpt:
      "Sve što trebate znati o pokretanju vlastite turističke ture i dijeljenju lokalne kulture.",
    image: "https://images.unsplash.com/photo-1641749621450-9ce997284397?w=800",
    author: "Marko Kovač",
    date: "5. Prosinac 2024",
    readTime: "8 min",
    category: "Vodič",
  },
  {
    id: 3,
    title: "Street Food Zagreb: Lokalna Gastro Scena",
    excerpt:
      "Istražite najbolje street food destinacije u Zagrebu s našim lokalnim vodičima.",
    image: "https://images.unsplash.com/photo-1762674462382-6ea7fb670032?w=800",
    author: "Petar Novak",
    date: "1. Prosinac 2024",
    readTime: "6 min",
    category: "Hrana",
  },
  {
    id: 4,
    title: "Planinarski Vodič: Velebit za Početnike",
    excerpt:
      "Sve što trebate znati prije vašeg prvog planinskog uspona na Velebit.",
    image: "https://images.unsplash.com/photo-1471240840307-485d3bc42300?w=800",
    author: "Ivana Marić",
    date: "28. Studeni 2024",
    readTime: "10 min",
    category: "Avantura",
  },
  {
    id: 5,
    title: "Kultura i Povijest: Split kroz Stoljeća",
    excerpt:
      "Šetnja kroz 1700 godina povijesti Splita s našim stručnim vodičima.",
    image: "https://images.unsplash.com/photo-1765266958853-5c6ae343a711?w=800",
    author: "Luka Horvat",
    date: "25. Studeni 2024",
    readTime: "7 min",
    category: "Kultura",
  },
  {
    id: 6,
    title: "Održivi Turizam: Kako Putovati Odgovorno",
    excerpt: "Savjeti za putovanje koje poštuje lokalnu zajednicu i okoliš.",
    image: "https://images.unsplash.com/photo-1631165538791-295d382f5edd?w=800",
    author: "Petra Babić",
    date: "20. Studeni 2024",
    readTime: "5 min",
    category: "Održivost",
  },
];

 function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Sve");

  const categories = [
    "Sve",
    "Putovanja",
    "Vodič",
    "Hrana",
    "Avantura",
    "Kultura",
    "Održivost",
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Sve" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        {/* Header */}
        <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-4xl md:text-5xl font-bold"
            >
              Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/90"
            >
              Priče, savjeti i inspiracija za vaša lokalna iskustva
            </motion.p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Pretraži po imenu članka..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#2b946f] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            Pronađeno {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "članak" : "članaka"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                >
                  {/* Image */} 
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-[#2b946f] text-white px-4 py-1 rounded-full text-sm">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl text-[#104d2f] mb-3 group-hover:text-[#ff6309] transition-colors font-semibold">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <div className="px-2 py-1 bg-[#2b946f]/10 text-[#2b946f] rounded text-xs font-medium">
                        Uredničko
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Calendar size={16} />
                        <span>{post.date}</span>
                      </div>
                      <span className="flex items-center gap-2 text-[#2b946f] group-hover:text-[#ff6309] transition-colors">
                        Čitaj više
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
    </>
  );
}

export default BlogPage;
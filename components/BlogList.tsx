"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Search, X } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
};

export default function BlogList({ posts }: { posts: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
          <div className="mb-8">
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

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            Pronađeno {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "članak" : "članaka"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
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
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <h3 className="text-xl text-[#104d2f] mb-3 group-hover:text-[#ff6309] transition-colors font-semibold">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.subtitle}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <div className="px-2 py-1 bg-[#2b946f]/10 text-[#2b946f] rounded text-xs font-medium">
                        Uredničko
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Calendar size={16} />
                        <span>{formatDate(post.date)}</span>
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
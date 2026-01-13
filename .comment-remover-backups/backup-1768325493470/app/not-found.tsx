"use client"; 

import { motion } from "motion/react";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[120px] md:text-[200px] text-[#2b946f] mb-4">
            404
          </h1>
          <h2 className="text-[#104d2f] mb-4">Stranica nije pronađena</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Izgleda da ste zalutali. Stranica koju tražite ne postoji ili je
            premještena.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white px-8 py-3 rounded-full hover:shadow-lg transition-all"
            >
              <Home size={20} />
              Početna stranica
            </Link>
            <Link
              href="/tours" 
              className="inline-flex items-center gap-2 bg-white text-[#2b946f] px-8 py-3 rounded-full hover:shadow-lg transition-all border-2 border-[#2b946f]"
            >
              <Search size={20} />
              Istražite ture
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"
            alt="Lost"
            width={800}
            height={600}
            className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </div>
  );
}

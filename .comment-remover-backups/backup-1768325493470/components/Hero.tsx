"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { Search } from "lucide-react";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToSearch = () => {
    const searchSection = document.getElementById("tour-search");
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">

      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="https://images.unsplash.com/photo-1762174947626-96f76955cd74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMHRyYXZlbCUyMGd1aWRlJTIwYWR2ZW50dXJlfGVufDF8fHx8MTc2NTUwMTQ0OHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Adventure"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#104d2f]/70 via-[#0f6659]/50 to-[#104d2f]/80"></div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={{ opacity }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white mb-6"
        >
          Discover Unique Tours
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/90 text-xl mb-8 max-w-2xl mx-auto"
        >
          Otključaj lokalna iskustva, skupljaj uspomene i postignuća
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToSearch}
            className="bg-[#ff6309] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#e55808] transition-colors shadow-lg"
          >
            <Search size={20} />
            Pronađi iskustvo
          </motion.button>

          <motion.a
            href="/profile"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#2b946f] text-white px-8 py-4 rounded-full hover:bg-[#267d5e] transition-colors shadow-lg inline-block"
          >
            Postani vodič
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform } from "motion/react";
import {
  MapPin,
  Compass,
  Users,
  Camera,
  Medal,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { HowItWorks } from "@/components/HowItWorks";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import HomeLeaderboard from "@/components/ui/HomeLeaderboard";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <HowItWorks />
      <CommunitySection />
      <FinalCTA />
    </>
  );
}

function HeroSection() {
  const heroRef = useRef(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = (heroRef.current as HTMLElement).getBoundingClientRect();
        const distance = Math.hypot(
          e.clientX - (rect.left + rect.width / 2),
          e.clientY - (rect.top + rect.height / 2),
        );
        setIsNear(distance < 300);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen md:h-screen flex items-center justify-center overflow-hidden bg-[#104d2f] pt-28 md:pt-0"
    >
      {/* Pozadina */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#104d2f]/95 via-[#104d2f]/85 to-[#104d2f]" />
      </div>

      {/* Floating elementi */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-[15%] opacity-20 hidden lg:block"
      >
        <Compass size={100} className="text-[#ff6309]" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-[10%] opacity-20 hidden lg:block"
      >
        <MapPin size={80} className="text-[#2b946f]" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto py-8 md:py-0">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white text-6xl sm:text-6xl sm:pt-0 md:text-7xl md:pt-15 lg:text-8xl lg:pt-28 font-black leading-[1.1] md:leading-[1.1] mb-4 tracking-tight"
        >
          Otkrivaj. Istražuj. Osvajaj.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-white/90 text-base sm:text-lg md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed font-light px-2"
        >
          Ovo nije još jedna aplikacija za izlete. Ovo je igra izlaska iz zone
          komfora koja se igra vani, gdje ti biraš avanturu, a mi pratimo tvoj
          put. Istražite Hrvatsku na autentičan način.
        </motion.p>

        {/* Logo animacija ispod naslova */}
        <div className="flex justify-center mb-8 md:mb-10">
          <AnimatedLogo isNear={isNear} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center px-2"
        >
          <Link href="/tours" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-[#ff6309] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full flex items-center justify-center gap-3 hover:bg-[#e55808] transition-all shadow-2xl text-base sm:text-lg font-semibold w-full sm:min-w-[260px]"
            >
              <span>Istraži avanture</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
          </Link>

          <Link href="/become-guide" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 backdrop-blur-md text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full hover:bg-white/20 transition-all text-base sm:text-lg font-semibold border-2 border-white/30 w-full sm:min-w-[260px]"
            >
              Postani vodič
            </motion.button>
          </Link>
        </motion.div>

        {/* Blog link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 md:mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <BookOpen size={18} />
            <span className="text-sm font-medium">
              Potraži inspiraciju na našem blogu
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedLogo({ isNear }: { isNear: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldAnimate = isHovered || isNear;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="inline-block cursor-pointer"
    >
      <div className="relative overflow-hidden px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight relative flex items-center justify-center">
          {/* Cover - ide lijevo */}
          <motion.span
            animate={{
              x: shouldAnimate ? "-120%" : "0%",
              opacity: shouldAnimate ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="inline-block text-white relative z-10"
          >
            Cover
          </motion.span>

          {/* Dis - ide desno */}
          <motion.span
            animate={{
              x: shouldAnimate ? "120%" : "0%",
              opacity: shouldAnimate ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="inline-block text-[#ff6309] ml-2 relative z-10"
          >
            Dis
          </motion.span>

          {/* DisCover - Dis dolazi s lijeva, Cover s desna */}
          <motion.span
            animate={{
              opacity: shouldAnimate ? 1 : 0,
            }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.span
              animate={{
                x: shouldAnimate ? "0%" : "-150%",
              }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
              className="text-[#ff6309]"
            >
              Dis
            </motion.span>
            <motion.span
              animate={{
                x: shouldAnimate ? "0%" : "150%",
              }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
              className="ml-1 text-white"
            >
              Cover
            </motion.span>
          </motion.span>
        </h2>
      </div>
    </motion.div>
  );
}

function StorySection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#2b946f] font-semibold text-sm uppercase tracking-wider mb-4 block">
              tko smo mi?
            </span>

            <h2 className="text-[#104d2f] text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Agencije su dosadne.
              <br />
              Vrijeme je za promjenu.
            </h2>

            <div className="space-y-4 md:space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
              <p>
                Turističke agencije ti prodaju iste ture. Influenceri ti prodaju
                iste destinacije. Sve je unaprijed isplanirano, sterilno, bez
                duše.
              </p>
              <p className="font-medium text-[#104d2f]">
                CoverDis je drugačiji.
              </p>
              <p>
                Mi smo platforma koja spaja lokalce koji poznaju svaki skriveni
                kutak svog grada i putnike koji žele nešto autentično. Ali to
                nije sve.
              </p>
              <p>
                Zamisli da ti svaki obilazak, svaka fotografija, svaka nova
                priča donosi bodove. Penješ se na rang listama, otključavaš
                značke, postaješ legenda u zajednici.
              </p>
              <p className="text-[#2b946f] font-semibold">
                To je turizam. To je društvena mreža. To je igra.
              </p>
            </div>

            <div className="mt-8 md:mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[#104d2f] font-medium hover:text-[#2b946f] transition-colors group"
              >
                <BookOpen size={20} />
                <span>Inspiraciju potraži na blogu</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop"
                alt="Lokalni vodič pokazuje skrivena mjesta"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#104d2f]/60 to-transparent" />

              {/* Kartica s iskustvom */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2b946f] flex items-center justify-center flex-shrink-0">
                    <Medal size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-[#104d2f] text-sm sm:text-base">
                        Marko, 27
                      </span>
                      <span className="text-xs bg-[#2b946f]/10 text-[#2b946f] px-2 py-1 rounded-full">
                        Legend vodič
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      "Pokažem ti šta ne piše u vodičima. Ručamo kod moje none,
                      penjemo se na krov stare tvornice."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  const features = [
    {
      icon: MapPin,
      title: "Autentičnost > Instagram",
      description:
        "Bez namještenih fotografija. Vodiči ti pokazuju stvarni život, ne ono što izgleda dobro na feedu.",
      color: "#ff6309",
    },
    {
      icon: Medal,
      title: "Napreduješ kroz avanture",
      description:
        "Svaka tura donosi XP. Što više istražuješ, više otključavaš. Ekskluzivne ture, popusti, priznanja.",
      color: "#2b946f",
    },
    {
      icon: Users,
      title: "Nisi sam",
      description:
        "Poveži se s putnicima koji su bili prije tebe. Pitaj za savjet, podijeli iskustvo, nađi društvo.",
      color: "#ff6309",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-[#104d2f] text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Igra počinje
            <span className="text-[#ff6309]"> SADA</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl px-2">
            Nema pay-to-win. Tvoj trud, tvoja avantura, tvoj rang.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon
                  size={24}
                  style={{ color: feature.color }}
                  className="md:w-7 md:h-7"
                />
              </div>
              <h3 className="text-[#104d2f] text-lg md:text-xl font-bold mb-2 md:mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 md:mt-12 px-2 md:px-0">
          <HomeLeaderboard />
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-16 md:py-24 px-4 bg-[#104d2f]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Tvoja prva avantura
            <br />
            <span className="text-[#ff6309]">čeka te</span>
          </h2>

          <p className="text-white/80 text-lg md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Bez dosadnih formulara. Bez čekanja. Odaberi destinaciju i kreni.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-2">
            <Link href="/tours" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#ff6309] text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-base md:text-lg font-bold hover:bg-[#e55808] transition-all shadow-2xl shadow-[#ff6309]/20 w-full sm:min-w-[260px]"
              >
                Istraži ture
              </motion.button>
            </Link>

            <Link href="/how-it-works" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-md text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-base md:text-lg font-bold border-2 border-white/30 hover:bg-white/20 transition-all w-full sm:min-w-[260px]"
              >
                Kako funkcionira?
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

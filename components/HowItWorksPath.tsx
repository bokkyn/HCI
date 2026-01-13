"use client";

import { motion } from "framer-motion";
import { Users, Search, Calendar, Sparkles } from "lucide-react";

export function HowItWorksPath() {
  const steps = [
    {
      icon: Search,
      title: "Problem",
      description:
        "Turisti su umorni od klasičnih komercijalnih tura koje nude generička iskustva bez osobnog dodira",
      color: "#2b946f",
    },
    {
      icon: Users,
      title: "Tko smo mi",
      description:
        "Putnici koji žele autentična iskustva, lokalna mjesta i priče koje ne možete pronaći u vodiču",
      color: "#0f6659",
    },
    {
      icon: Calendar,
      title: "Rješenje",
      description:
        "CoverDis povezuje putnike s lokalnim vodičima koji nude unikatne ture prilagođene vašim interesima",
      color: "#104d2f",
    },
    {
      icon: Sparkles,
      title: "Rezultat",
      description:
        "Autentična iskustva, nova prijateljstva i nezaboravne uspomene s lokalnim vodičima",
      color: "#ff6309",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[#104d2f] mb-4">Kako Radi CoverDis</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Revolucioniramo način na koji ljudi doživljavaju nova mjesta
          </p>
        </motion.div>

        {/* Path visualization */}
        <div className="relative">
          {/* Curved path line for desktop */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1">
            <svg
              className="w-full h-32"
              viewBox="0 0 1200 128"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 64 Q 300 0, 600 64 T 1200 64"
                stroke="url(#pathGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="8,8"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="pathGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#2b946f" />
                  <stop offset="50%" stopColor="#0f6659" />
                  <stop offset="100%" stopColor="#ff6309" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center relative"
              >
                {/* Connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute top-24 left-1/2 w-0.5 h-16 bg-gradient-to-b from-[#2b946f] to-[#0f6659] opacity-30"></div>
                )}

                {/* Icon Circle with pulsing effect */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-md relative"
                  style={{ backgroundColor: step.color }}
                >
                  <step.icon size={40} className="text-white" />

                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: `2px solid ${step.color}` }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                {/* Content */}
                <h4 className="text-[#104d2f] mb-3">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {step.description}
                </p>

                {/* Step Number */}
                <div className="mt-6">
                  <span
                    className="inline-block w-8 h-8 rounded-full text-white flex items-center justify-center text-sm"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom decorative path */}
        <div className="mt-16 flex justify-center">
          <svg className="w-64 h-2" viewBox="0 0 256 8">
            <path
              d="M0 4 Q64 0, 128 4 T256 4"
              stroke="#ff6309"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

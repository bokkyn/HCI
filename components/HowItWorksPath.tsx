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
                
              </motion.div>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  );
}

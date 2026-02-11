"use client";

import { motion } from "motion/react";
import { Check, Users, DollarSign, Calendar, Star } from "lucide-react";
import Link from "next/link";

function Page() {
  const benefits = [
    "Fleksibilno radno vrijeme - vi određujete svoj raspored",
    "Zarađujte radeći ono što volite",
    "Upoznajte ljude iz cijelog svijeta",
    "Dijelite svoju strast i znanje",
    "Pristup alatima za upravljanje izletima",
    "Marketing i promocijska podrška",
    "24/7 tehnička i korisnička podrška",
    "Osiguranje za sve izlete",
  ];

  const requirements = [
    "Odlično poznavanje lokalne destinacije",
    "Komunikacijske vještine i strast za dijeljenje priča",
    "Osnovno znanje engleskog jezika (poželjno)",
    "Sposobnost rada s različitim skupinama ljudi",
    "Pouzdanost i profesionalnost",
  ];

  const steps = [
    {
      title: "1. Registracija",
      description: "Ispunite registracijski obrazac s osnovnim podacima",
    },
    {
      title: "2. Kreiranje izleta",
      description: "Kreirajte svoj prvi izlet s detaljnim opisom, u izborniku na profilu",
    },
    {
      title: "3. Prva rezervacija",
      description: "Pričekajte da privugnete prve putnike i ostvarite svoju prvu rezervaciju",
    },
    {
      title: "4. Gotovo",
      description: "Njihovi kontakt podaci se šalju vama i rezervacija je spremna",
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
      <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-3xl md:text-5xl"
          >
            Postani CoverDis vodič
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90"
          >
            Dijeli svoju strast, zarađuj i poveži se s putnicima iz cijelog
            svijeta
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
          >
            <h2 className="text-[#104d2f] mb-6">Prednosti</h2>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check
                    className="text-[#2b946f] flex-shrink-0 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
          >
            <h2 className="text-[#104d2f] mb-6">Što očekujemo</h2>
            <ul className="space-y-3">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check
                    className="text-[#ff6309] flex-shrink-0 mt-1"
                    size={20}
                  />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-12"
        >
          <h2 className="text-[#104d2f] mb-6">Kako početi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2b946f] to-[#0f6659] rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-[#104d2f] mb-2 text-lg">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#2b946f] to-[#0f6659] rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="mb-4">Spreman/na za početak?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Pridruži se našoj zajednici vodiča i počni dijeliti svoju strast s
            putnicima iz cijelog svijeta
          </p>
          <Link
            href="/profile"
            className="inline-block bg-[#ff6309] text-white px-8 py-3 rounded-full hover:bg-[#e55808] transition-colors"
          >
            Registriraj se kao vodič
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Page;

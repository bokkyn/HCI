"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Opće",
    question: "Što je CoverDis?",
    answer:
      "CoverDis je platforma koja povezuje putnike s lokalnim vodičima i kreatorima unikatnih izleta. Naša misija je omogućiti autentična lokalna iskustva koja prelaze klasične turističke rute.",
  },
  {
    category: "Opće",
    question: "Kako mogu postati vodič?",
    answer:
      "Jednostavno kliknite na 'Postani vodič' gumb, ispunite registracijski obrazac, kreirajte svoj prvi izlet i nakon verifikacije možete početi dijeliti svoja lokalna iskustva s putnicima.",
  },
  {
    category: "Rezervacije",
    question: "Kako rezervirati izlet?",
    answer:
      "Pretražite dostupne izlete, odaberite željeni izlet, kliknite 'Rezerviraj', odaberite datum i broj osoba, te dovršite proces plaćanja. Dobit ćete potvrdu putem emaila.",
  },
  {
    category: "Rezervacije",
    question: "Mogu li otkazati rezervaciju?",
    answer:
      "Da, rezervacije možete otkazati do 24 sata prije početka izleta i dobiti puni povrat novca. Otkazivanja unutar 24 sata nisu prihvatljiva za povrat novca.",
  },
  {
    category: "Plaćanje",
    question: "Koji načini plaćanja su dostupni?",
    answer:
      "Prihvaćamo kartice (Visa, Mastercard, AmEx), PayPal i direktno bankovne uplate. Sva plaćanja su sigurna i enkriptirana.",
  },
  {
    category: "Plaćanje",
    question: "Kada se naplaćuje izlet?",
    answer:
      "Plaćanje se procesira odmah nakon potvrde rezervacije. Za neke izlete vodič može zatražiti predujam, dok se preostali iznos plaća na licu mjesta.",
  },
  {
    category: "Gamifikacija",
    question: "Što su značke i kako ih dobivam?",
    answer:
      "Značke su nagrade koje dobivate završavanjem izleta, istraživanjem novih lokacija ili postizanjem određenih ciljeva. Svaka značka donosi dodatne XP bodove.",
  },
  {
    category: "Gamifikacija",
    question: "Što mogu napraviti s XP bodovima?",
    answer:
      "XP bodovi vam omogućuju napredovanje kroz razine, otključavanje posebnih ponuda, popusta i pristup ekskluzivnim izletima.",
  },
  {
    category: "Sigurnost",
    question: "Kako CoverDis osigurava sigurnost korisnika?",
    answer:
      "Svi naši vodiči prolaze kroz verifikacijski proces, a korisnici mogu ocjenjivati izlete. Također imamo 24/7 podršku i osiguranje za sve izlete.",
  },
  {
    category: "Sigurnost",
    question: "Što ako imam problema tijekom izleta?",
    answer:
      "Možete nas kontaktirati 24/7 putem hitne linije ili kroz aplikaciju. Naš tim će vam odmah pružiti potrebnu pomoć.",
  },
];

 function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Sve");

  const categories = [
    "Sve",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ];

  const filteredFaqs =
    selectedCategory === "Sve"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        {/* Header */}
        <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-4"
            >
              <HelpCircle size={64} className="text-[#ff6309]" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 text-4xl md:text-5xl font-bold"
            >
              Često Postavljana Pitanja
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90"
            >
              Pronađite odgovore na najčešća pitanja
            </motion.p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-lg text-[#104d2f] pr-4 font-medium">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="text-[#2b946f]" size={24} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center bg-gradient-to-br from-[#2b946f] to-[#0f6659] rounded-2xl p-8 text-white shadow-lg"
          >
            <h3 className="mb-4 text-2xl font-bold">Niste pronašli odgovor?</h3>
            <p className="text-white/90 mb-6 text-lg">
              Naš tim je tu da vam pomogne s bilo kojim pitanjem
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#ff6309] text-white px-8 py-3 rounded-full hover:bg-[#e55808] transition-colors font-medium"
            >
              Kontaktirajte nas
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default FAQPage;
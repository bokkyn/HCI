"use client";

import { motion } from "motion/react";
import { Users, Target, Heart, Award } from "lucide-react";
import Link from "next/link";

function Page() {
  const values = [
    {
      icon: Heart,
      title: "Autentičnost",
      description:
        "Vjerujemo u autentična iskustva koja spajaju ljude i kulturu",
    },
    {
      icon: Users,
      title: "Zajednica",
      description: "Gradimo zajednicu putnika i vodiča koji dijele istu strast",
    },
    {
      icon: Target,
      title: "Kvaliteta",
      description: "Svaka tura prolazi kroz naš proces provjere kvalitete",
    },
    {
      icon: Award,
      title: "Izvrsnost",
      description: "Težimo izvrsnosti u svakom aspektu našeg poslovanja",
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
      <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            O nama
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90"
          >
            Povezujemo putnike s lokalnim vodičima za autentična iskustva
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-12"
        >
          <h2 className="text-[#104d2f] mb-6">Naša priča</h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              CoverDis je nastao iz jednostavne ideje – omogućiti putnicima da
              dožive destinacije kao lokalci, a lokalnim vodičima da podijele
              svoju strast i znanje sa svijetom.
            </p>
            <p>
              Umorni od generičkih turističkih tura koje nude ista iskustva
              svima, odlučili smo stvoriti platformu gdje autentičnost i osobni
              pristup dolaze na prvo mjesto. Svaki vodič na našoj platformi
              donosi svoju jedinstvenu perspektivu i priču.
            </p>
            <p>
              Danas smo ponosna zajednica od preko 500 vodiča i 10,000+ putnika
              koji su proživjeli nezaboravna iskustva širom Hrvatske i regije.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#2b946f] to-[#0f6659] rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="text-white" size={32} />
              </div>
              <h3 className="text-[#104d2f] mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#2b946f] to-[#0f6659] rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="mb-4">Pridruži se našoj zajednici</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Bilo da si putnik koji traži autentična iskustva ili lokalni vodič
            koji želi dijeliti svoju strast, CoverDis je pravo mjesto za tebe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tours"
              className="bg-white text-[#2b946f] px-8 py-3 rounded-full hover:shadow-lg transition-all inline-block"
            >
              Istraži ture
            </Link>
            <Link
              href="/become-guide"
              className="bg-[#ff6309] text-white px-8 py-3 rounded-full hover:bg-[#e55808] transition-colors inline-block"
            >
              Postani vodič
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


export default Page;
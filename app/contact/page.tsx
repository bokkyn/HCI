"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Send, HelpCircle } from "lucide-react";


export default function ContactPage() {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-3xl md:text-5xl"
          >
            Kontakt
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90"
          >
            Javite nam se - tu smo da vam pomognemo
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
          >
            <h3 className="text-[#104d2f] mb-6">Pošaljite nam poruku</h3>

            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Ime i prezime
                </label>
                <input
                  type="text"
                  placeholder="Vaše ime"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="vasa.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Predmet</label>
                <input
                  type="text"
                  placeholder="O čemu se radi?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Poruka</label>
                <textarea
                  rows={6}
                  placeholder="Vaša poruka..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent resize-none"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={20} />
                Pošalji poruku
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Email Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2b946f] to-[#0f6659] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-[#104d2f] mb-2">Email</h4>
                  <a
                    href="mailto:info@coverdis.com"
                    className="text-gray-600 hover:text-[#2b946f] transition-colors cursor-pointer"
                  >
                    info@coverdis.com
                  </a>
                  <br />
                  <a
                    href="mailto:support@coverdis.com"
                    className="text-gray-600 hover:text-[#2b946f] transition-colors cursor-pointer"
                  >
                    support@coverdis.com
                  </a>
                </div>
              </div>
            </div>


            {/* FAQ Link */}
            <div className="bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="text-[#2b946f] flex-shrink-0" size={32} />
                <div>
                  <h4 className="text-[#104d2f] mb-2">Često postavljana pitanja</h4>
                  <p className="text-gray-600 mb-4">
                    Možda vaše pitanje već ima odgovor u našoj FAQ sekciji
                  </p>
                  <Link
                    href="/faq"
                    className="inline-block text-[#2b946f] hover:text-[#104d2f] transition-colors cursor-pointer"
                  >
                    Pogledaj FAQ →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}

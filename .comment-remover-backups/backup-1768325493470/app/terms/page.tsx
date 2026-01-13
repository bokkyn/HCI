"use client";

import { motion } from "motion/react";
import { Shield } from "lucide-react";

function TermsPage() {
  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-4"
            >
              <Shield size={64} className="text-[#ff6309]" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 text-4xl md:text-5xl font-bold"
            >
              Pravila korištenja i privatnost
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90"
            >
              Posljednje ažurirano: 20. Prosinac 2024
            </motion.p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-8"
          >
            <section>
              <h2 className="text-[#104d2f] mb-4 text-2xl font-bold">
                1. Opći uvjeti
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Dobrodošli na CoverDis platformu. Korištenjem naših usluga
                prihvaćate ove uvjete korištenja. Molimo vas da ih pažljivo
                pročitate prije korištenja platforme.
              </p>
            </section>

            <section>
              <h2 className="text-[#104d2f] mb-4 text-2xl font-bold">
                2. Registracija i račun
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Za korištenje određenih funkcionalnosti platforme potrebno je
                kreirati račun. Vi ste odgovorni za:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg pl-4">
                <li className="mb-2">Održavanje sigurnosti vašeg računa</li>
                <li className="mb-2">Točnost podataka koje unesete</li>
                <li className="mb-2">
                  Sve aktivnosti koje se dešavaju putem vašeg računa
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-[#104d2f] mb-4 text-2xl font-bold">
                3. Rezervacije i plaćanja
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Prilikom rezervacije ture obvezujete se na plaćanje dogovorenog
                iznosa. Politike otkazivanja ovise o pojedinačnoj turi i vodiču.
              </p>
            </section>

            <section>
              <h2 className="text-[#104d2f] mb-4 text-2xl font-bold">
                4. Politika privatnosti
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Poštujemo vašu privatnost i obvezujemo se na zaštitu vaših
                osobnih podataka:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg pl-4">
                <li className="mb-2">
                  Prikupljamo samo nužne podatke za pružanje usluga
                </li>
                <li className="mb-2">
                  Ne prodajemo vaše podatke trećim stranama
                </li>
                <li className="mb-2">
                  Koristimo enkriptovan sustav za zaštitu podataka
                </li>
                <li className="mb-2">
                  Možete zatražiti brisanje svojih podataka u bilo kojem
                  trenutku
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-[#104d2f] mb-4 text-2xl font-bold">
                5. Pravila ponašanja
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Od svih korisnika očekujemo poštivanje i profesionalnost.
                Zabranjeno je uznemiravanje, diskriminacija ili bilo kakvo
                neprikladno ponašanje.
              </p>
            </section>

            <section>
              <h2 className="text-[#104d2f] mb-4 text-2xl font-bold">
                6. Odgovornost
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                CoverDis djeluje kao posrednička platforma između putnika i
                vodiča. Nismo odgovorni za kvalitetu tura, ali nastojimo
                osigurati siguran i kvalitetan doživljaj za sve korisnike.
              </p>
            </section>

            <section>
              <h2 className="text-[#104d2f] mb-4 text-2xl font-bold">
                7. Kolačići
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Koristimo kolačiće za poboljšanje korisničkog iskustva, analizu
                prometa i personalizaciju sadržaja. Možete kontrolirati upotrebu
                kolačića kroz postavke vašeg preglednika.
              </p>
            </section>

            <section>
              <h2 className="text-[#104d2f] mb-4 text-2xl font-bold">
                8. Kontakt
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Za pitanja vezana uz ove uvjete možete nas kontaktirati na
                <a
                  href="mailto:info@coverdis.hr"
                  className="text-[#2b946f] hover:text-[#0f6659] ml-2 font-medium"
                >
                  info@coverdis.hr
                </a>
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
}
export default TermsPage;
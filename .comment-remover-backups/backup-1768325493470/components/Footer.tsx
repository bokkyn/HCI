"use client";

import { useState } from "react";
import { Mail, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");



  return (
    <form  className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Mail
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tvoj email"
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6309]"
          required
          disabled={status === "loading"}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#ff6309] text-white px-6 py-2 rounded-lg hover:bg-[#e55808] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Šalje se..." : "Pretplati se"}
      </button>
      {status === "success" && (
        <p className="text-green-400 text-sm mt-2">Uspješno ste pretplaćeni!</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2">
          Došlo je do greške. Pokušajte ponovno.
        </p>
      )}
    </form>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo i opis */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Vaš Brand</h2>
            <p className="text-gray-400 mb-6">
              Kratak opis vaše kompanije ili web stranice. Podelite svoju misiju
              i vrijednosti.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#ff6309] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#ff6309] transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#ff6309] transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Brzi linkovi */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Brzi linkovi</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/o-nama"
                  className="text-gray-400 hover:text-[#ff6309] transition-colors"
                >
                  O nama
                </Link>
              </li>
              <li>
                <Link
                  href="/usluge"
                  className="text-gray-400 hover:text-[#ff6309] transition-colors"
                >
                  Usluge
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-[#ff6309] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="text-gray-400 hover:text-[#ff6309] transition-colors"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt informacije */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Primjer adrese 123</li>
              <li>10000 Zagreb, Hrvatska</li>
              <li>+385 1 234 5678</li>
              <li>info@vasbrand.com</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pretplati se</h3>
            <p className="text-gray-400 mb-4">
              Budite u toku s najnovijim vijestima i ponudama.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Vaš Brand. Sva prava pridržana.</p>
          <div className="mt-2 text-sm">
            <Link
              href="/privacy-policy"
              className="hover:text-[#ff6309] transition-colors mx-4"
            >
              Politika privatnosti
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#ff6309] transition-colors mx-4"
            >
              Uvjeti korištenja
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-[#ff6309] transition-colors mx-4"
            >
              Mapa stranice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

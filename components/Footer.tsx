"use client";

import Link from "next/link";
import { MapPin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Glavni sadržaj */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#2b946f] text-white px-2 py-1 rounded text-sm font-bold">
                Cover
              </span>
              <span className="font-bold">Dis</span>
            </div>
            <p className="text-gray-400 text-xs">
              Otkrij autentična iskustva s lokalnim vodičima.
            </p>
            <p className="text-gray-400 text-xs">
              Budi avanturist, a ne turist!
            </p>
          </div>

          {/* Linkovi */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">
              Navigacija
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/tours"
                className="text-gray-400 hover:text-[#ff6309] text-xs transition-colors"
              >
                Svi izleti
              </Link>
              <Link
                href="/faq"
                className="text-gray-400 hover:text-[#ff6309] text-xs transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/blog"
                className="text-gray-400 hover:text-[#ff6309] text-xs transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-gray-400 hover:text-[#ff6309] text-xs transition-colors"
              >
                O nama
              </Link>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Kontakt</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <MapPin size={12} />
                <span>21000 Split, Hrvatska</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Mail size={12} />
                <a
                  href="mailto:info@coverdis.com"
                  className="hover:text-[#ff6309] transition-colors"
                >
                  info@coverdis.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Donji dio */}
        <div className="mt-6 pt-4 border-t border-gray-800/30 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © {currentYear} CoverDis. Sva prava pridržana.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Uvjeti korištenja
            </Link>
            <Link
              href="/contact"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

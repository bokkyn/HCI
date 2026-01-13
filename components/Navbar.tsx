"use client"; 

import { useState } from "react";
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Mail, Lock, User as UserIcon } from "lucide-react";

export function Navbar() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const pathname = usePathname(); 

  const navLinks = [
    { name: "Ture", href: "/tours" },
    { name: "Blog", href: "/blog" },
    { name: "Profil", href: "/profile" },
    { name: "Kontakt", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "O nama", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#104d2f]/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
         
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link href="/" className="text-white text-2xl tracking-tight">
              {" "}
          
              Cover<span className="text-[#ff6309]">Dis</span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href} 
                  className={`text-white hover:text-[#ff6309] transition-colors duration-200 relative ${
                    pathname === link.href ? "text-[#ff6309]" : ""
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#ff6309]"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.1 }}
            >
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsRegisterMode(false);
                }}
                className="bg-[#ff6309] text-white px-6 py-2 rounded-full hover:bg-[#e55808] transition-colors duration-200"
              >
                Login
              </button>
            </motion.div>
          </div>

       
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#104d2f] border-t border-[#2b946f]"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href} 
                  className={`block text-white hover:text-[#ff6309] transition-colors py-2 ${
                    pathname === link.href ? "text-[#ff6309]" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsRegisterMode(false);
                  setMobileMenuOpen(false);
                }}
                className="block w-full bg-[#ff6309] text-white px-6 py-2 rounded-full hover:bg-[#e55808] transition-colors text-center"
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login/Register Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-8 mx-4"
              onClick={(e) => e.stopPropagation()} 
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-[#104d2f] text-2xl mb-2">
                  Cover<span className="text-[#ff6309]">Dis</span>
                </h3>
                <p className="text-gray-600">
                  {isRegisterMode ? "Kreiraj svoj račun" : "Dobrodošli natrag!"}
                </p>
              </div>

              <form className="space-y-4 mb-6">
                {isRegisterMode && (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm">
                        Ime
                      </label>
                      <div className="relative">
                        <UserIcon
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Vaše ime"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm">
                        Prezime
                      </label>
                      <div className="relative">
                        <UserIcon
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Vaše prezime"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      placeholder="vasa.email@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Lozinka
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {isRegisterMode && (
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      Potvrdi lozinku
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}

                <Link
                  href="/profile" 
                  onClick={() => setShowLoginModal(false)}
                  className="block w-full bg-[#ff6309] text-white py-3 rounded-lg hover:bg-[#e55808] transition-colors text-center"
                >
                  {isRegisterMode ? "Registriraj se" : "Prijavi se"}
                </Link>
              </form>

              {!isRegisterMode && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        ili nastavi s
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </button>

                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                          d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                          fill="currentColor"
                        />
                      </svg>
                      Apple
                    </button>
                  </div>
                </>
              )}

              <p className="text-center text-gray-600">
                {isRegisterMode ? (
                  <>
                    Već imaš račun?{" "}
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="text-[#ff6309] hover:underline"
                    >
                      Prijavi se
                    </button>
                  </>
                ) : (
                  <>
                    Nemaš račun?{" "}
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(true)}
                      className="text-[#ff6309] hover:underline"
                    >
                      Registriraj se
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

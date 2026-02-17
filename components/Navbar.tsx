"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Home,
  Map,
  Book,
  Mail,
  HelpCircle,
  Info,
  Award,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import LoginModal from "./LoginModal";
import CreateTourModal from "./CreateTourModal";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateTourModal, setShowCreateTourModal] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { name: "Početna", href: "/", icon: <Home size={18} /> },
    { name: "Izleti", href: "/tours", icon: <Map size={18} /> },
    { name: "Blog", href: "/blog", icon: <Book size={18} /> },
    { name: "Kontakt", href: "/contact", icon: <Mail size={18} /> },
    { name: "FAQ", href: "/faq", icon: <HelpCircle size={18} /> },
    { name: "Mi", href: "/about", icon: <Info size={18} /> },
  ];

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    router.push("/");
  };

  const handleCreateTour = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setShowCreateTourModal(true);
  };

  const handleCreateTourSuccess = () => {
    router.refresh();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-dropdown")) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#104d2f]/95 backdrop-blur-md shadow-lg border-b border-[#2b946f]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center h-full group">
              <div className="flex items-center gap-2 text-white text-2xl font-bold tracking-tight px-4 py-2 rounded-lg transition-all duration-200 group-hover:text-[#ff6309] group-hover:bg-white/5">
                <img src="/logo.png" alt="CoverDis" className="h-10 w-auto" />
              </div>
            </Link>

            {/* Desktop Navigation - vidljiv do 970px */}
            <div className="desktop-nav items-center gap-8 hidden h-full">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center h-full group"
                >
                  <div
                    className={`
                      flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 text-base xl:text-lg whitespace-nowrap font-medium
                      ${
                        pathname === link.href
                          ? "text-[#ff6309] bg-white/10"
                          : "text-white group-hover:text-[#ff6309] group-hover:bg-white/5"
                      }
                    `}
                  >
                    <span className="nav-text">{link.name}</span>
                  </div>
                </Link>
              ))}

              {/* User/Login Section */}
              <div className="ml-6 relative user-dropdown whitespace-nowrap h-full flex items-center">
                {loading ? (
                  <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
                ) : user ? (
                  <div className="relative h-full flex items-center">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center h-full group"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white group-hover:bg-white/15 transition-all duration-200 cursor-pointer text-base xl:text-lg">
                        <div className="flex items-center gap-1.5">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.ime}
                              className="w-7 h-7 xl:w-8 xl:h-8 rounded-full object-cover border-2 border-white/30"
                            />
                          ) : (
                            <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-gradient-to-r from-[#2b946f] to-[#ff6309] flex items-center justify-center border-2 border-white/30">
                              <span className="text-white font-bold text-xs xl:text-sm">
                                {user.ime?.[0] || "U"}
                                {user.prezime?.[0] || "S"}
                              </span>
                            </div>
                          )}
                          <div className="text-left">
                            <div className="font-medium text-sm">
                              {user.ime}
                            </div>
                          </div>
                        </div>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            userDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {userDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                        >
                          <div className="px-4 py-4 bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white">
                            <div className="flex items-center gap-3 mb-2">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.ime}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2b946f] to-[#ff6309] flex items-center justify-center border-2 border-white/30">
                                  <span className="text-white font-bold text-lg">
                                    {user.ime?.[0] || "U"}
                                    {user.prezime?.[0] || "S"}
                                  </span>
                                </div>
                              )}
                              <div>
                                <p className="font-bold">
                                  {user.ime} {user.prezime}
                                </p>
                                <p className="text-sm text-white/80 truncate max-w-[180px]">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-around mt-3">
                              <div className="text-center">
                                <div className="text-xl font-bold">
                                  {user.xp_total || 0}
                                </div>
                                <div className="text-xs opacity-80">XP</div>
                              </div>
                            </div>
                          </div>

                          <div className="py-2">
                            <Link
                              href="/profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <User size={18} />
                              <div>
                                <div className="font-medium">Moj profil</div>
                                <div className="text-xs text-gray-500">
                                  Pregledaj i uredi svoj profil
                                </div>
                              </div>
                            </Link>

                            <button
                              onClick={handleCreateTour}
                              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                            >
                              <PlusCircle size={18} />
                              <div>
                                <div className="font-medium">Kreiraj izlet</div>
                                <div className="text-xs text-gray-500">
                                  Podijeli svoj izlet
                                </div>
                              </div>
                            </button>

                            <div className="border-t border-gray-100 mx-4 my-2" />

                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <LogOut size={18} />
                              <div>
                                <div className="font-medium">Odjavi se</div>
                                <div className="text-xs text-red-500">
                                  Završi trenutnu sesiju
                                </div>
                              </div>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center h-full group"
                  >
                    <div className="bg-gradient-to-r from-[#ff7a2f] to-[#ff6309] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium shadow-md cursor-pointer text-base xl:text-lg whitespace-nowrap">
                      Prijavi se
                    </div>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="desktop-nav-hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer h-full flex items-center"
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
              className="bg-[#104d2f] border-t border-[#2b946f]"
            >
              <div className="px-4 py-3 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}

                <div className="pt-4 border-t border-[#2b946f]/50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 mb-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.ime}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2b946f] to-[#ff6309] flex items-center justify-center border-2 border-white/30">
                              <span className="text-white font-bold">
                                {user.ime?.[0] || "U"}
                                {user.prezime?.[0] || "S"}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white">
                              {user.ime} {user.prezime}
                            </p>
                            <p className="text-sm text-white/70 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-center mt-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              {user.xp_total || 0}
                            </div>
                            <div className="text-xs text-white/70">XP</div>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User size={18} />
                        Moj profil
                      </Link>

                      <button
                        onClick={handleCreateTour}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                      >
                        <PlusCircle size={18} />
                        Kreiraj izlet
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 transition-colors mt-1 cursor-pointer"
                      >
                        <LogOut size={18} />
                        Odjavi se
                      </button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowLoginModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-[#ff7a2f] to-[#ff6309] text-white px-6 py-3.5 rounded-lg font-medium shadow-md cursor-pointer"
                    >
                      Prijavi se
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* CSS za responzivno ponašanje - hamburger na 970px */}
      <style jsx>{`
        @media (max-width: 970px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-nav-hidden {
            display: block !important;
          }
        }
        @media (min-width: 971px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-nav-hidden {
            display: none !important;
          }
        }
      `}</style>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {showCreateTourModal && (
        <CreateTourModal
          isOpen={showCreateTourModal}
          onClose={() => setShowCreateTourModal(false)}
          onSuccess={handleCreateTourSuccess}
        />
      )}

      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-40 cursor-pointer"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </>
  );
}

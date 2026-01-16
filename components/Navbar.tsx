"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { useUser } from "@/app/lib/auth/get-user";
import LoginPage from "@/app/login/page";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Koristi hook za korisnika
  const { user, loading, logout } = useUser();

  const navLinks = [
    { name: "Ture", href: "/tours" },
    { name: "Blog", href: "/blog" },
    { name: "Profil", href: "/profile" },
    { name: "Kontakt", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "O nama", href: "/about" },
  ];

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    router.refresh();
  };

  // Ako je login otvoren, prikaži login komponentu
  if (showLogin) {
    return <LoginPage />;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#104d2f]/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-white text-2xl tracking-tight hover:text-[#ff6309] transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
              aria-label="Početna stranica"
            >
              Cover<span className="text-[#ff6309]">Dis</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Link
                  href={link.href}
                  className={`
                    flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200
                    ${
                      pathname === link.href
                        ? "text-[#ff6309] bg-white/10"
                        : "text-white hover:text-[#ff6309] hover:bg-white/5"
                    }
                    active:scale-95 active:bg-white/15
                  `}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-lg border border-[#ff6309]/30 pointer-events-none"
                    />
                  )}
                </Link>

                {/* Hover Effect */}
                {hoveredLink === link.name && pathname !== link.href && (
                  <motion.div
                    layoutId="hover-effect"
                    className="absolute inset-0 rounded-lg bg-white/5 pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}

            {/* User/Login Button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.1 }}
              className="ml-2 relative"
            >
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
              ) : user ? (
                // Korisnik je logiran - prikaži user dropdown
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="
                      flex items-center gap-2 px-4 py-2.5 rounded-lg
                      bg-white/10 text-white
                      hover:bg-white/15 hover:shadow-lg
                      active:scale-95 active:shadow-md
                      transition-all duration-200
                      font-medium
                      focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:ring-offset-2 focus:ring-offset-[#104d2f]
                    "
                    aria-label="Korisnički meni"
                    aria-expanded={userDropdownOpen}
                  >
                    <User size={18} />
                    <span className="max-w-[120px] truncate">
                      {user.full_name || user.email.split("@")[0]}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="
                          absolute right-0 mt-2 w-48
                          bg-[#104d2f] border border-[#2b946f]
                          rounded-lg shadow-xl overflow-hidden
                          z-50
                        "
                      >
                        <div className="p-2">
                          {/* User info */}
                          <div className="px-3 py-2 border-b border-[#2b946f]/50">
                            <p className="font-medium text-white truncate">
                              {user.full_name || "Korisnik"}
                            </p>
                            <p className="text-sm text-white/70 truncate">
                              {user.email}
                            </p>
                          </div>

                          {/* Dropdown links */}
                          <Link
                            href="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="
                              flex items-center gap-2 w-full px-3 py-2.5 rounded
                              text-white hover:bg-white/10
                              transition-colors duration-200
                            "
                          >
                            <User size={16} />
                            Moj profil
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="
                              flex items-center gap-2 w-full px-3 py-2.5 rounded
                              text-red-300 hover:bg-red-500/20 hover:text-red-200
                              transition-colors duration-200
                              mt-1
                            "
                          >
                            <LogOut size={16} />
                            Odjavi se
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Korisnik nije logiran - prikaži login button
                <button
                  onClick={() => setShowLogin(true)}
                  className="
                    bg-[#ff6309] text-white px-6 py-2.5 rounded-lg
                    hover:bg-[#e55808] hover:shadow-lg
                    active:scale-95 active:shadow-md
                    transition-all duration-200
                    font-medium
                    focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:ring-offset-2 focus:ring-offset-[#104d2f]
                  "
                  aria-label="Prijavi se"
                >
                  Login
                </button>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="
              md:hidden text-white p-2 rounded-lg
              hover:bg-white/5 active:bg-white/10
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#ff6309]
            "
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Zatvori meni" : "Otvori meni"}
            aria-expanded={mobileMenuOpen}
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
            <div className="px-4 py-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      pathname === link.href
                        ? "text-[#ff6309] bg-white/10"
                        : "text-white hover:text-[#ff6309] hover:bg-white/5"
                    }
                    active:scale-[0.98] active:bg-white/15
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  <span>{link.name}</span>
                  {pathname === link.href && (
                    <div className="w-2 h-2 rounded-full bg-[#ff6309]" />
                  )}
                </Link>
              ))}

              {/* Mobile Login/User */}
              {loading ? (
                <div className="px-4 py-3">
                  <div className="h-10 rounded-lg bg-white/10 animate-pulse" />
                </div>
              ) : user ? (
                <>
                  <div className="px-4 py-3 border-t border-[#2b946f]/50 mt-2 pt-4">
                    <div className="mb-2">
                      <p className="font-medium text-white">
                        {user.full_name || "Korisnik"}
                      </p>
                      <p className="text-sm text-white/70">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        flex items-center gap-2 w-full px-3 py-2.5 rounded-lg
                        text-white bg-white/10
                        hover:bg-white/15
                        transition-colors duration-200
                        mb-1
                      "
                    >
                      <User size={16} />
                      Moj profil
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="
                        flex items-center gap-2 w-full px-3 py-2.5 rounded-lg
                        text-red-300 bg-red-500/10
                        hover:bg-red-500/20 hover:text-red-200
                        transition-colors duration-200
                      "
                    >
                      <LogOut size={16} />
                      Odjavi se
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setMobileMenuOpen(false);
                  }}
                  className="
                    w-full flex items-center justify-center
                    bg-[#ff6309] text-white px-6 py-3.5 rounded-lg
                    hover:bg-[#e55808] active:scale-[0.98]
                    transition-all duration-200
                    font-medium
                    mt-2
                    focus:outline-none focus:ring-2 focus:ring-[#ff6309] focus:ring-offset-2 focus:ring-offset-[#104d2f]
                  "
                  aria-label="Prijavi se"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop za dropdown (zatvara dropdown kada se klikne izvan) */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </nav>
  );
}

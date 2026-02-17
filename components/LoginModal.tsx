// app/components/LoginModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "./AuthProvider";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    lozinka: "",
  });

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // LOGIN
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.lozinka,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Došlo je do greške pri prijavi");
        }

        // Uspješna prijava
        login(data.user);
        onClose();
        window.location.reload();
      } else {
        // REGISTER
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ime: formData.ime.trim(),
            prezime: formData.prezime.trim(),
            email: formData.email.trim(),
            password: formData.lozinka,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Došlo je do greške pri registraciji");
        }

        // Uspješna registracija, automatski login
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.lozinka,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          login(loginData.user);
          onClose();
          window.location.reload();
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Prijava" : "Registracija"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ime"
                      value={formData.ime}
                      onChange={(e) =>
                        setFormData({ ...formData, ime: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#2b946f] focus:ring-2 focus:ring-[#2b946f]/30"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Prezime"
                      value={formData.prezime}
                      onChange={(e) =>
                        setFormData({ ...formData, prezime: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#ff6309] focus:ring-2 focus:ring-[#ff6309]/30"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#2b946f] focus:ring-2 focus:ring-[#2b946f]/30"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Lozinka"
                  value={formData.lozinka}
                  onChange={(e) =>
                    setFormData({ ...formData, lozinka: e.target.value })
                  }
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:border-[#ff6309] focus:ring-2 focus:ring-[#ff6309]/30"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 transition-colors cursor-pointer"
                  title={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0 0 2.5 4 9 4s9-4 9-4" />
                    </svg>
                  )}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff6309] hover:bg-[#e55808] text-white py-4 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading
                  ? isLogin
                    ? "PRIJAVA..."
                    : "REGISTRACIJA..."
                  : isLogin
                    ? "PRIJAVI SE"
                    : "REGISTRIRAJ SE"}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                  setFormData({ ime: "", prezime: "", email: "", lozinka: "" });
                }}
                className="text-[#2b946f] hover:text-[#104d2f] font-medium cursor-pointer"
              >
                {isLogin
                  ? "Nemate račun? Registrirajte se"
                  : "Već imate račun? Prijavite se"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

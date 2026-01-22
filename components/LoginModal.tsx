// app/components/LoginModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "./AuthProvider";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

              <div>
                <input
                  type="password"
                  placeholder="Lozinka"
                  value={formData.lozinka}
                  onChange={(e) =>
                    setFormData({ ...formData, lozinka: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#ff6309] focus:ring-2 focus:ring-[#ff6309]/30"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#2b946f] to-[#ff6309] text-white py-3.5 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading
                  ? isLogin
                    ? "PRIJAVA..."
                    : "REGISTRACIJA..."
                  : isLogin
                    ? "PRIJAVI SE"
                    : "REGISTRIRAJ SE"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                  setFormData({ ime: "", prezime: "", email: "", lozinka: "" });
                }}
                className="text-[#2b946f] hover:text-[#104d2f] font-medium"
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

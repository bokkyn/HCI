"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    lozinka: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.lozinka,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const full_name =
          `${formData.ime.trim()} ${formData.prezime.trim()}`.trim();
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: formData.email.trim(),
            password: formData.lozinka,
            options: {
              data: { full_name },
            },
          }
        );
        if (authError) throw authError;
        if (authData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: authData.user.id,
              email: formData.email.trim(),
              full_name,
            });
          if (profileError)
            console.error("Greška pri kreiranju profila:", profileError);
        }
        if (authData.session) {
          router.push("/");
          router.refresh();
        } else {
          alert("Registracija uspješna! Provjerite email za potvrdu računa.");
          setIsLogin(true);
          setFormData({ ime: "", prezime: "", email: "", lozinka: "" });
        }
      }
    } catch (err: any) {
      let errorMessage = err.message;
      if (err.message.includes("Invalid login credentials"))
        errorMessage = "Netočna email adresa ili lozinka";
      else if (err.message.includes("already registered"))
        errorMessage = "Ovaj email je već registriran";
      else if (err.message.includes("Email not confirmed"))
        errorMessage = "Email nije potvrđen. Provjerite svoj inbox.";
      else if (err.message.includes("Password should be at least"))
        errorMessage = "Lozinka mora imati najmanje 6 znakova";
      else if (err.message.includes("valid email address"))
        errorMessage = "Unesite valjanu email adresu";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-[var(--footer-gray)]/30">
          <div
            className="h-2"
            style={{
              background:
                "linear-gradient(to right, var(--primary-green-light), var(--accent-orange))",
            }}
          />
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[var(--primary-green-dark)] mb-2">
                {isLogin ? "Dobrodošli natrag" : "Kreirajte račun"}
              </h1>
              <p className="text-[var(--footer-gray)]">
                {isLogin
                  ? "Prijavite se da nastavite"
                  : "Registrirajte se u nekoliko sekundi"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Ime"
                    value={formData.ime}
                    onChange={(e) =>
                      setFormData({ ...formData, ime: e.target.value })
                    }
                    className="w-full p-3 border-2 border-[var(--footer-gray)] rounded-xl focus:border-[var(--primary-green-light)] focus:ring-2 focus:ring-[var(--primary-green-light)]/30 transition duration-200"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Prezime"
                    value={formData.prezime}
                    onChange={(e) =>
                      setFormData({ ...formData, prezime: e.target.value })
                    }
                    className="w-full p-3 border-2 border-[var(--footer-gray)] rounded-xl focus:border-[var(--accent-orange)] focus:ring-2 focus:ring-[var(--accent-orange)]/30 transition duration-200"
                    required
                  />
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border-2 border-[var(--footer-gray)] rounded-xl focus:border-[var(--primary-green-light)] focus:ring-2 focus:ring-[var(--primary-green-light)]/30 transition duration-200"
                required
              />

              <input
                type="password"
                placeholder="Lozinka"
                value={formData.lozinka}
                onChange={(e) =>
                  setFormData({ ...formData, lozinka: e.target.value })
                }
                className="w-full p-3 border-2 border-[var(--footer-gray)] rounded-xl focus:border-[var(--accent-orange)] focus:ring-2 focus:ring-[var(--accent-orange)]/30 transition duration-200"
                required
                minLength={6}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[var(--primary-green-light)] to-[var(--accent-orange)] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--primary-green-light)]/30 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isLogin
                    ? "PRIJAVA U TOKU..."
                    : "REGISTRACIJA U TOKU..."
                  : isLogin
                  ? "PRIJAVI SE"
                  : "REGISTRIRAJ SE"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--footer-gray)] text-center">
              <p className="text-[var(--footer-gray)] mb-4">
                {isLogin ? "Nemate račun?" : "Već imate račun?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({ ime: "", prezime: "", email: "", lozinka: "" });
                }}
                className="inline-flex items-center text-[var(--primary-green-dark)] hover:text-[var(--primary-green-teal)] font-semibold transition duration-200"
              >
                {isLogin ? "Registrirajte se ovdje" : "Prijavite se ovdje"}
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

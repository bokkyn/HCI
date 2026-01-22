// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
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
    setSuccess("");

    try {
      if (isLogin) {
        // LOGIN API poziv
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        console.log("Prijava uspješna:", data);

        // Osvježi stranicu i redirect
        router.refresh();
        router.push("/");
      } else {
        // REGISTER API poziv
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

        // Uspješna registracija
        setSuccess("Registracija uspješna! Sada se možete prijaviti.");
        setIsLogin(true); // Prebaci na login
        setFormData({ ime: "", prezime: "", email: "", lozinka: "" });

        console.log("Registracija uspješna:", data);
      }
    } catch (err: any) {
      let errorMessage = err.message;

      // Prevedi common greške
      if (
        err.message.includes("already registered") ||
        err.message.includes("već postoji")
      ) {
        errorMessage = "Ovaj email je već registriran";
      } else if (
        err.message.includes("Invalid") ||
        err.message.includes("Netočan")
      ) {
        errorMessage = "Netočan email ili lozinka";
      } else if (err.message.includes("at least")) {
        errorMessage = "Lozinka mora imati najmanje 6 znakova";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/30">
          <div
            className="h-2"
            style={{
              background: "linear-gradient(to right, #2b946f, #ff6309)",
            }}
          />
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#104d2f] mb-2">
                {isLogin ? "Dobrodošli natrag" : "Kreirajte račun"}
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? "Prijavite se da nastavite"
                  : "Registrirajte se u nekoliko sekundi"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center animate-fadeIn">
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

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center animate-fadeIn">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-700 font-medium">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2b946f] focus:ring-2 focus:ring-[#2b946f]/30 transition duration-200"
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
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6309] focus:ring-2 focus:ring-[#ff6309]/30 transition duration-200"
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
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2b946f] focus:ring-2 focus:ring-[#2b946f]/30 transition duration-200"
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
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6309] focus:ring-2 focus:ring-[#ff6309]/30 transition duration-200"
                  required
                  minLength={6}
                />
                {!isLogin && (
                  <p className="mt-1 text-xs text-gray-500">
                    Lozinka mora imati najmanje 6 znakova
                  </p>
                )}
              </div>

              {isLogin && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#2b946f] hover:text-[#104d2f] transition-colors"
                  >
                    Zaboravili ste lozinku?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#2b946f] to-[#ff6309] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#2b946f]/30 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isLogin ? "PRIJAVA..." : "REGISTRACIJA..."}
                  </span>
                ) : isLogin ? (
                  "PRIJAVI SE"
                ) : (
                  "REGISTRIRAJ SE"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                {isLogin ? "Nemate račun?" : "Već imate račun?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                  setFormData({ ime: "", prezime: "", email: "", lozinka: "" });
                }}
                className="inline-flex items-center text-[#2b946f] hover:text-[#104d2f] font-semibold transition duration-200 group"
              >
                {isLogin ? "Registrirajte se ovdje" : "Prijavite se ovdje"}
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
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

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Prijavom pristajete na naše{" "}
                <Link href="/terms" className="text-[#2b946f] hover:underline">
                  Uvjete korištenja
                </Link>{" "}
                i{" "}
                <Link
                  href="/privacy"
                  className="text-[#2b946f] hover:underline"
                >
                  Politiku privatnosti
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

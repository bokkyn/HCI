// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import EditProfileModal from "@/components/EditProfileModal";
import CreateTourModal from "@/components/CreateTourModal"; // DODAJ
import MyToursSection from "@/components/MyToursSection"; // DODAJ
import {
  MapPin,
  Calendar,
  Users,
  Camera,
  Edit,
  User,
  Mail,
  X,
  Loader2,
  Award,
  Globe,
  Cake,
  Sparkles,
  Plus, // DODAJ
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateTourModal, setShowCreateTourModal] = useState(false); // DODAJ
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    ime: "",
    prezime: "",
    spol: "",
    datum_rodenja: "",
    lokacija: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
      setEditForm({
        ime: currentUser.ime || "",
        prezime: currentUser.prezime || "",
        spol: currentUser.spol || "",
        datum_rodenja: currentUser.datum_rodenja
          ? new Date(currentUser.datum_rodenja).toISOString().split("T")[0]
          : "",
        lokacija: currentUser.lokacija || "",
        bio: currentUser.bio || "",
        avatar: currentUser.avatar || "",
      });
      setLoading(false);
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  const handleSaveProfile = async () => {
    if (!userData) return;

    setSaving(true);
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Došlo je do greške");
      }

      setUserData(data.user);
      setShowEditModal(false);
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Došlo je do greške pri spremanju");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nije postavljeno";
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return "Nije postavljeno";
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      month: "long",
      year: "numeric",
    });
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (authLoading || loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-[#2b946f] animate-spin" />
          <p className="text-gray-600">Učitavanje profila...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Niste prijavljeni
          </h2>
          <p className="text-gray-600 mb-6">
            Prijavite se kako biste vidjeli svoj profil
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-[#2b946f] to-[#ff6309] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Početna stranica
          </button>
        </div>
      </div>
    );
  }

  const age = calculateAge(userData.datum_rodenja);
  const totalXP = userData.xp_total || 0;
  const level = Math.floor(totalXP / 1000) + 1;
  const xpToNextLevel = level * 1000 - totalXP;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Gradient stripe under navbar */}
        <div className="h-16 bg-gradient-to-r from-[#104d2f] to-[#0f6659]"></div>
        
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 md:h-64 bg-white relative">
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Profile Info */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={`${userData.ime} ${userData.prezime}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#2b946f] to-[#ff6309] flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {userData.ime?.[0]}
                        {userData.prezime?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="absolute bottom-2 right-2 bg-[#ff6309] text-white p-2 rounded-full hover:bg-[#e55808] transition-colors shadow-lg"
                >
                  <Camera size={18} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {userData.ime} {userData.prezime}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      {userData.lokacija && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{userData.lokacija}</span>
                        </div>
                      )}
                      {userData.datum_rodenja && (
                        <div className="flex items-center gap-2">
                          <Cake size={16} />
                          <span>{age} godina</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          Član od {formatDateShort(userData.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCreateTourModal(true)}
                      className="flex items-center gap-2 bg-[#ff6309] text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      <Plus size={18} />
                      Dodaj turu
                    </button>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all font-medium"
                    >
                      <Edit size={18} />
                      Uredi profil
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#104d2f]">
                      {userData.ukupno_tura || 0}
                    </div>
                    <div className="text-sm text-gray-600">Ture</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#104d2f]">
                      Lvl {level}
                    </div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#104d2f]">
                      {totalXP}
                    </div>
                    <div className="text-sm text-gray-600">XP</div>
                  </div>
                  {xpToNextLevel > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ff6309]">
                        {xpToNextLevel}
                      </div>
                      <div className="text-sm text-gray-600">
                        XP do sljedećeg levela
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Bio & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">O meni</h2>
                  <Sparkles className="text-[#ff6309]" size={20} />
                </div>
                <div className="prose max-w-none">
                  {userData.bio ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {userData.bio}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        Još niste dodali opis o sebi
                      </p>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="text-[#2b946f] hover:text-[#104d2f] font-medium"
                      >
                        Dodaj opis
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Moje ture Section - ZAMIJENJENO UMJESTO XP Categories */}
              <MyToursSection
                userId={userData.id}
                onAddTourClick={() => setShowCreateTourModal(true)}
              />
            </div>

            {/* Right Column - Info & Stats */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Kontakt informacije
                  </h2>
                  <User className="text-[#2b946f]" size={20} />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Mail size={16} />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-gray-900 font-medium break-all">
                      {userData.email}
                    </p>
                  </div>

                  {userData.lokacija && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <MapPin size={16} />
                        <span className="text-sm font-medium">Lokacija</span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {userData.lokacija}
                      </p>
                    </div>
                  )}

                  {userData.spol && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Globe size={16} />
                        <span className="text-sm font-medium">Spol</span>
                      </div>
                      <p className="text-gray-900 font-medium capitalize">
                        {userData.spol}
                      </p>
                    </div>
                  )}

                  {userData.datum_rodenja && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm font-medium">
                          Datum rođenja
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {formatDate(userData.datum_rodenja)}
                        {age && ` (${age} godina)`}
                      </p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">Član od</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {formatDate(userData.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full mt-6 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Uredi informacije
                </button>
              </div>

              {/* Level Progress */}
              <div className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Napredak</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level {level}</span>
                    <span>
                      {xpToNextLevel} XP do Level {level + 1}
                    </span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff6309] to-[#ff9e5e] rounded-full"
                      style={{ width: `${(totalXP % 1000) / 10}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-white/80">
                  Ukupno ste skupili {totalXP} XP bodova i dosegli Level {level}
                  !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Tour Modal */}
      {showCreateTourModal && (
        <CreateTourModal
          isOpen={showCreateTourModal}
          onClose={() => setShowCreateTourModal(false)}
          onSuccess={() => {
            // Osvježi stranicu da se vide nove ture
            window.location.reload();
          }}
        />
      )}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={userData}
            onUpdate={(updatedUser) => {
              setUserData(updatedUser);
              window.location.reload();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

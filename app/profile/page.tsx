// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import EditProfileModal from "@/components/EditProfileModal";
import CreateTourModal from "@/components/CreateTourModal";
import MyToursSection from "@/components/MyToursSection";
import MyPastToursSection from "@/components/MyPastToursSection";
import {
  MapPin,
  Calendar,
  Users,
  Camera,
  Edit,
  User,
  Mail,
  Loader2,
  Award,
  Globe,
  Cake,
  Sparkles,
  Plus,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateTourModal, setShowCreateTourModal] = useState(false);
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
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-[#2b946f] animate-spin" />
          <p className="text-gray-600">Učitavanje profila...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4 bg-white p-8 rounded-2xl shadow-lg">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Niste prijavljeni
          </h2>
          <p className="text-gray-600 mb-6">
            Prijavite se kako biste vidjeli svoj profil
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-[#2b946f] to-[#ff6309] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer"
          >
            Početna stranica
          </button>
        </div>
      </div>
    );
  }

  const age = calculateAge(userData.datum_rodenja);
  const totalXP = userData.xp_total || 0;
  const LEVEL_XP = 40;
  const level = Math.floor(totalXP / LEVEL_XP) + 1;
  const xpToNextLevel = level * LEVEL_XP - totalXP;

  const xpKategorije = userData.xp_kategorije || {};
  const kategorije = [
    { key: "Hrana", label: "Hrana", color: "#ffb347" },
    { key: "Sport", label: "Sport", color: "#1a1a1a" },
    { key: "Urbano", label: "Urbano", color: "#6b7280" },
    { key: "Priroda", label: "Priroda", color: "#2b946f" },
    { key: "Povijest", label: "Povijest", color: "#8b5a2b" },
    { key: "Kultura", label: "Kultura", color: "#b87333" },
    { key: "Misterija", label: "Misterija", color: "#8e44ad" },
    { key: "Zabava", label: "Zabava", color: "#e83e8c" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Gradient stripe under navbar */}
        <div className="h-12 bg-gradient-to-r from-[#104d2f] to-[#0f6659]"></div>

        {/* Profile Header */}
        <div className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative">
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
                    <div className="w-full h-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {userData.ime?.[0]}
                        {userData.prezime?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="absolute bottom-2 right-2 bg-[#ff6309] text-white p-2 rounded-full hover:bg-[#e55808] transition-colors shadow-lg cursor-pointer"
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
                          <MapPin size={16} className="text-[#ff6309]" />
                          <span>{userData.lokacija}</span>
                        </div>
                      )}
                      {userData.datum_rodenja && (
                        <div className="flex items-center gap-2">
                          <Cake size={16} className="text-[#2b946f]" />
                          <span>{age} godina</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#2b946f]" />
                        <span>
                          Član od {formatDateShort(userData.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCreateTourModal(true)}
                      className="flex items-center gap-2 bg-[#ff6309] text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium cursor-pointer"
                    >
                      <Plus size={18} />
                      Dodaj izlet
                    </button>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all font-medium cursor-pointer"
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
                    <div className="text-sm text-gray-600">Izleti</div>
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
            {/* Left Column - Bio & Tours */}
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
                        className="text-[#2b946f] hover:text-[#104d2f] font-medium cursor-pointer"
                      >
                        Dodaj opis
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Moji izleti Section */}
              <MyToursSection
                userId={userData.id}
                onAddTourClick={() => setShowCreateTourModal(true)}
              />
              <MyPastToursSection userId={userData.id} />
            </div>

            {/* Right Column - XP Progress (sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Level Progress */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Award className="text-gray-700" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Napredak
                    </h2>
                  </div>

                  {/* Ukupni level */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        Level {level}
                      </span>
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                        {totalXP} XP ukupno
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] rounded-full"
                        style={{
                          width: `${((totalXP % LEVEL_XP) / LEVEL_XP) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-right">
                      {xpToNextLevel} XP do levela {level + 1}
                    </p>
                  </div>

                  {/* XP po kategorijama */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 px-1">
                      XP po kategorijama
                    </h3>
                    <div className="space-y-4">
                      {kategorije.map(({ key, label, color }) => {
                        const xp = xpKategorije[key] || 0;
                        const katLevel = Math.floor(xp / LEVEL_XP) + 1;
                        const progress = ((xp % LEVEL_XP) / LEVEL_XP) * 100;

                        return (
                          <div key={key} className="group">
                            <div className="flex justify-between items-center mb-1 px-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs font-medium text-gray-800">
                                  {label}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-900">
                                  Lvl {katLevel}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {xp} XP
                                </span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300 group-hover:opacity-80"
                                style={{
                                  width: `${progress}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                            <div className="text-right mt-1">
                              <span className="text-[10px] text-gray-500">
                                {LEVEL_XP - (xp % LEVEL_XP)} XP do sljedećeg
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
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

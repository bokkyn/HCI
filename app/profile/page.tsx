"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Calendar,
  Users,
  Camera,
  Edit,
  User,
  Mail,
  X,
  Plus,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const userId = (params?.userId as string) || "me";
  const isOwnProfile = !userId || userId === "me";

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTours, setLoadingTours] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddTour, setShowAddTour] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);

  const [toursAsGuide, setToursAsGuide] = useState<any[]>([]);
  const [completedTours, setCompletedTours] = useState<any[]>([]);
  const [showAllTours, setShowAllTours] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchUserTours();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const endpoint = isOwnProfile ? "/api/profile" : `/api/profile/${userId}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setEditForm({
          name: data.name || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
          location: data.location || "",
          avatar: data.avatar || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTours = async () => {
    setLoadingTours(true);
    try {
      const endpoint = isOwnProfile
        ? "/api/profile/tours"
        : `/api/profile/${userId}/tours`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setToursAsGuide(data.toursAsGuide || []);
        setCompletedTours(data.completedTours || []);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoadingTours(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data.profile);
        setShowEditProfile(false);
        alert("Profil uspješno ažuriran!");
      } else {
        const error = await res.json();
        alert(error.error || "Greška pri ažuriranju profila");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Došlo je do greške");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nedefinirano";
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      month: "long",
      year: "numeric",
    });
  };

  const formatTourDate = (dateString: string) => {
    if (!dateString) return "Nedefinirano";
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const displayedToursAsGuide = showAllTours
    ? toursAsGuide
    : toursAsGuide.slice(0, 3);
  const displayedCompletedTours = showAllTours
    ? completedTours
    : completedTours.slice(0, 3);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-[#104d2f] animate-spin" />
          <div className="text-[#104d2f]">Učitavanje profila...</div>
        </div>
      </div>
    );
  }

  const userStats = userData || {
    name: "Korisnik",
    avatar: "https://i.pravatar.cc/150?img=8",
    location: "Unesite lokaciju",
    member_since: new Date().toISOString(),
    tours_completed: 0,
    xp: 0,
    level: 1,
    tours_as_guide: 0,
    bio: "Dodajte opis o sebi...",
    email: "",
  };

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-12 md:py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#ff6309] rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="relative">
                <div
                  onClick={() => setShowProfileImageModal(true)}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white/30 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={userStats.avatar || "https://i.pravatar.cc/150?img=8"}
                    alt={userStats.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="absolute bottom-2 right-2 bg-[#ff6309] text-white p-2 rounded-full hover:bg-[#e55808] transition-colors"
                  >
                    <Camera size={18} />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-2 text-3xl md:text-5xl">{userStats.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/90 mb-4">
                  {userStats.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>{userStats.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Član od {formatDate(userStats.member_since)}</span>
                  </div>
                  {userStats.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={18} />
                      <span>{userStats.email}</span>
                    </div>
                  )}
                </div>

                {userStats.bio && (
                  <p className="text-white/80 mb-6 max-w-2xl line-clamp-2">
                    {userStats.bio}
                  </p>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                  <div className="text-center hover:opacity-80 transition-opacity">
                    <p className="text-2xl md:text-3xl text-[#ff6309]">
                      {userStats.tours_completed || 0}
                    </p>
                    <p className="text-xs md:text-sm text-white/70">Ture</p>
                  </div>
                  <div className="text-center hover:opacity-80 transition-opacity">
                    <p className="text-2xl md:text-3xl text-[#ff6309]">
                      Lvl {userStats.level || 1}
                    </p>
                    <p className="text-xs md:text-sm text-white/70">
                      {userStats.xp || 0} XP
                    </p>
                  </div>
                  {userStats.tours_as_guide > 0 && (
                    <div className="text-center hover:opacity-80 transition-opacity">
                      <p className="text-2xl md:text-3xl text-[#ff6309]">
                        {userStats.tours_as_guide}
                      </p>
                      <p className="text-xs md:text-sm text-white/70">
                        Kao vodič
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors whitespace-nowrap"
                  >
                    <Edit size={18} />
                    <span className="hidden md:inline">Uredi profil</span>
                  </button>
                  <button
                    onClick={() => setShowAddTour(true)}
                    className="flex items-center gap-2 bg-[#ff6309] text-white px-4 py-2 rounded-lg hover:bg-[#e55808] transition-colors whitespace-nowrap"
                  >
                    <Plus size={18} />
                    <span className="hidden md:inline">Dodaj turu</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {(toursAsGuide.length > 0 || loadingTours) && (
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#104d2f] text-xl md:text-2xl">
                      Ture kao vodič
                    </h3>
                    {toursAsGuide.length > 3 && (
                      <button
                        onClick={() => setShowAllTours(!showAllTours)}
                        className="flex items-center gap-2 text-[#2b946f] hover:text-[#104d2f] transition-colors text-sm"
                      >
                        {showAllTours ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                        <span>
                          {showAllTours ? "Prikaži manje" : "Prikaži sve"}
                        </span>
                      </button>
                    )}
                  </div>

                  {loadingTours ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 text-[#104d2f] animate-spin" />
                    </div>
                  ) : toursAsGuide.length > 0 ? (
                    <div className="space-y-4">
                      {displayedToursAsGuide.map((tour, index) => (
                        <Link key={index} href={`/tours/${tour.id}`}>
                          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gradient-to-r from-[#ff6309]/5 to-[#2b946f]/5 hover:shadow-md transition-all cursor-pointer">
                            {tour.image && (
                              <img
                                src={tour.image}
                                alt={tour.title}
                                className="w-full sm:w-24 h-24 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="text-[#104d2f] mb-1">
                                {tour.title}
                              </h4>
                              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                <MapPin size={14} className="text-[#ff6309]" />
                                <span>{tour.location}</span>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                {tour.date && (
                                  <span className="text-sm text-gray-500">
                                    {formatTourDate(tour.date)}
                                  </span>
                                )}
                                {tour.participants && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Users size={14} />
                                    <span>{tour.participants} sudionika</span>
                                  </div>
                                )}
                                {tour.price && (
                                  <span className="text-[#2b946f] font-medium">
                                    €{tour.price}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      {isOwnProfile
                        ? "Još niste vodili nijednu turu."
                        : "Korisnik još nije vodio nijednu turu."}
                    </p>
                  )}
                </div>
              )}

              {(completedTours.length > 0 || loadingTours) && (
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#104d2f] text-xl md:text-2xl">
                      Sudjelovao/la na turi
                    </h3>
                    {completedTours.length > 3 && (
                      <button
                        onClick={() => setShowAllTours(!showAllTours)}
                        className="flex items-center gap-2 text-[#2b946f] hover:text-[#104d2f] transition-colors text-sm"
                      >
                        {showAllTours ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                        <span>
                          {showAllTours ? "Prikaži manje" : "Prikaži sve"}
                        </span>
                      </button>
                    )}
                  </div>

                  {loadingTours ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 text-[#104d2f] animate-spin" />
                    </div>
                  ) : completedTours.length > 0 ? (
                    <div className="space-y-4">
                      {displayedCompletedTours.map((tour, index) => (
                        <Link key={index} href={`/tours/${tour.id}`}>
                          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gradient-to-r from-[#2b946f]/5 to-[#0f6659]/5 hover:shadow-md transition-all cursor-pointer">
                            {tour.image && (
                              <img
                                src={tour.image}
                                alt={tour.title}
                                className="w-full sm:w-24 h-24 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="text-[#104d2f] mb-1">
                                {tour.title}
                              </h4>
                              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                <MapPin size={14} className="text-[#ff6309]" />
                                <span>{tour.location}</span>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                {tour.date && (
                                  <span className="text-sm text-gray-500">
                                    {formatTourDate(tour.date)}
                                  </span>
                                )}
                                {tour.participants && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Users size={14} />
                                    <span>{tour.participants} sudionika</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      {isOwnProfile
                        ? "Još niste sudjelovali na nijednoj turi."
                        : "Korisnik još nije sudjelovao na nijednoj turi."}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <h3 className="text-[#104d2f] mb-6 text-xl md:text-2xl">
                  O meni
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {userStats.bio || "Korisnik još nije dodao opis o sebi."}
                </p>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <h3 className="text-[#104d2f] mb-6 text-xl md:text-2xl">
                  Statistika
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#2b946f]/10 to-[#0f6659]/10 rounded-xl">
                    <span className="text-gray-700">Ukupno tura</span>
                    <span className="text-2xl font-bold text-[#104d2f]">
                      {userStats.tours_completed || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#ff6309]/10 to-[#e55808]/10 rounded-xl">
                    <span className="text-gray-700">Level</span>
                    <span className="text-2xl font-bold text-[#104d2f]">
                      {userStats.level || 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#2b946f]/10 to-[#0f6659]/10 rounded-xl">
                    <span className="text-gray-700">XP bodovi</span>
                    <span className="text-2xl font-bold text-[#104d2f]">
                      {userStats.xp || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[#104d2f] text-xl md:text-2xl">Podaci</h3>
                  <User className="text-[#2b946f]" size={24} />
                </div>

                <div className="space-y-4">
                  {userStats.email && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="text-gray-800 break-all">
                        {userStats.email}
                      </p>
                    </div>
                  )}
                  {userStats.location && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Lokacija</p>
                      <p className="text-gray-800">{userStats.location}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Član od</p>
                    <p className="text-gray-800">
                      {formatDate(userStats.member_since)}
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="w-full mt-6 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    Uredi profil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditProfile(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 md:p-8 mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#104d2f] text-xl md:text-2xl">
                  Uredi profil
                </h2>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ime i prezime
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    placeholder="Ime i prezime"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ime
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={editForm.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                      placeholder="Ime"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prezime
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={editForm.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                      placeholder="Prezime"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokacija
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    placeholder="Grad, Država"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opis o sebi
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all resize-none"
                    placeholder="Napišite nešto o sebi..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    name="avatar"
                    value={editForm.avatar}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                    placeholder="https://primjer.com/slika.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ostavite prazno za default avatar
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Odustani
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Spremanje...
                      </span>
                    ) : (
                      "Spremi promjene"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {showAddTour && <AddTourModal onClose={() => setShowAddTour(false)} />}

        {showProfileImageModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileImageModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={userStats.avatar || "https://i.pravatar.cc/150?img=8"}
                alt="Profile"
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function AddTourModal({ onClose }: { onClose: () => void }) {
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    maxPeople: "",
    duration: "",
    meetingPoint: "",
    highlights: "",
    benefits: "",
    tags: "",
    image: "",
    category: "adventure",
  });

  const categories = [
    { value: "adventure", label: "Avantura" },
    { value: "culture", label: "Kultura" },
    { value: "food", label: "Hrana" },
    { value: "nature", label: "Priroda" },
    { value: "city", label: "Grad" },
  ];

  const allFieldsFilled =
    formData.title &&
    formData.description &&
    formData.price &&
    formData.maxPeople &&
    formData.duration &&
    formData.meetingPoint;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, featured: isFeatured }),
      });

      if (res.ok) {
        alert("Tura uspješno dodana!");
        onClose();
      } else {
        const error = await res.json();
        alert(error.error || "Greška pri dodavanju ture");
      }
    } catch (error) {
      console.error("Error adding tour:", error);
      alert("Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 p-6 md:p-8 overflow-y-auto mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#104d2f] text-xl md:text-2xl">
              Dodaj novu turu
            </h2>
            <p className="text-gray-600 text-sm">* Označava obavezna polja</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Naziv ture *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
              placeholder="Naziv ture"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Opis *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all resize-none"
              placeholder="Opis ture..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Cijena (€) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Max osoba *
              </label>
              <input
                type="number"
                name="maxPeople"
                value={formData.maxPeople}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                placeholder="10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Trajanje *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                placeholder="npr. 3 sata"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Mjesto susreta *
              </label>
              <input
                type="text"
                name="meetingPoint"
                value={formData.meetingPoint}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
                placeholder="Adresa ili lokacija"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Kategorija
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Highlights (opciono)
            </label>
            <textarea
              name="highlights"
              value={formData.highlights}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all resize-none"
              placeholder="Svaki red = jedan highlight"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Što je uključeno (opciono)
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all resize-none"
              placeholder="Svaki red = jedan benefit"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Tagovi (opciono)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
              placeholder="Odvojeno zarezom (npr. planinarenje, priroda, hiking)"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              URL slike (opciono)
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f] focus:border-transparent transition-all"
              placeholder="https://primjer.com/slika.jpg"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              disabled={!allFieldsFilled}
              className="w-5 h-5 text-[#2b946f] rounded focus:ring-[#2b946f]"
            />
            <label
              htmlFor="featured"
              className={`${
                !allFieldsFilled ? "text-gray-400" : "text-gray-700"
              } cursor-pointer select-none`}
            >
              Označi kao istaknuto (Featured)
              {!allFieldsFilled && (
                <span className="text-xs block text-gray-500 mt-1">
                  Dostupno samo ako su svi obavezni podaci popunjeni
                </span>
              )}
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Odustani
            </button>
            <button
              type="submit"
              disabled={!allFieldsFilled || loading}
              className="flex-1 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Dodavanje...
                </span>
              ) : (
                "Objavi turu"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

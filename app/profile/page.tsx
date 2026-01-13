"use client"; 

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Calendar,
  Trophy,
  Star,
  Award,
  Target,
  Users,
  Camera,
  Edit,
  Plus,
  X,
  Upload,
  Bookmark,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

const dummyUserData: Record<string, any> = {
  me: {
    name: "Marko Petković",
    avatar: "https://i.pravatar.cc/150?img=8",
    location: "Zagreb, Hrvatska",
    memberSince: "Siječanj 2024",
    toursCompleted: 12,
    xp: 8750,
    level: 12,
    badges: 6,
    friends: 24,
    toursAsGuide: 0,
    blogPosts: 0,
  },
  "1": {
    name: "Ana Jurić",
    avatar: "https://i.pravatar.cc/150?img=5",
    location: "Zagreb, Hrvatska",
    memberSince: "Ožujak 2023",
    toursCompleted: 28,
    xp: 15200,
    level: 18,
    badges: 12,
    friends: 45,
    toursAsGuide: 2,
    blogPosts: 1,
  },
  "2": {
    name: "Petar Novak",
    avatar: "https://i.pravatar.cc/150?img=12",
    location: "Dubrovnik, Hrvatska",
    memberSince: "Lipanj 2023",
    toursCompleted: 18,
    xp: 9800,
    level: 14,
    badges: 8,
    friends: 32,
    toursAsGuide: 1,
    blogPosts: 1,
  },
  "3": {
    name: "Ivana Marić",
    avatar: "https://i.pravatar.cc/150?img=10",
    location: "Split, Hrvatska",
    memberSince: "Rujan 2023",
    toursCompleted: 11,
    xp: 6200,
    level: 9,
    badges: 5,
    friends: 18,
    toursAsGuide: 1,
    blogPosts: 1,
  },
  "4": {
    name: "Luka Horvat",
    avatar: "https://i.pravatar.cc/150?img=1",
    location: "Rijeka, Hrvatska",
    memberSince: "Kolovoz 2024",
    toursCompleted: 9,
    xp: 4500,
    level: 7,
    badges: 4,
    friends: 12,
    toursAsGuide: 1,
    blogPosts: 1,
  },
};

 function ProfilePage() {
  const params = useParams();
  const userId = (params?.userId as string) || "me"; 
  const isOwnProfile = !userId || userId === "me";
  const userStats = dummyUserData[userId || "me"] || dummyUserData["me"];

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditPersonal, setShowEditPersonal] = useState(false);
  const [showAddTour, setShowAddTour] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showAddFriendsModal, setShowAddFriendsModal] = useState(false);

  const completedTours = [
    {
      id: 1,
      title: "Planinski Uspon Velebit",
      location: "Zadar, Hrvatska",
      date: "10. Prosinac 2024",
      image:
        "https://images.unsplash.com/photo-1471240840307-485d3bc42300?w=400",
      participants: 8,
    },
    {
      id: 2,
      title: "Street Food Aventura",
      location: "Zagreb, Hrvatska",
      date: "5. Studeni 2024",
      image:
        "https://images.unsplash.com/photo-1762674462382-6ea7fb670032?w=400",
      participants: 12,
    },
  ];

  const toursAsGuide: Record<string, any[]> = {
    "1": [
      {
        id: 2,
        title: "Street Food Aventura",
        location: "Zagreb, Hrvatska",
        image:
          "https://images.unsplash.com/photo-1762674462382-6ea7fb670032?w=400",
        participants: 89,
      },
      {
        id: 6,
        title: "Wine Tasting Istra Tour",
        location: "Pula, Hrvatska",
        image:
          "https://images.unsplash.com/photo-1537932155948-d391809047d5?w=400",
        participants: 167,
      },
    ],
    "2": [
      {
        id: 4,
        title: "Kayaking Jadranska Avantura",
        location: "Dubrovnik, Hrvatska",
        image:
          "https://images.unsplash.com/photo-1631165538791-295d382f5edd?w=400",
        participants: 203,
      },
    ],
    "3": [
      {
        id: 3,
        title: "Kulturna Šetnja Starim Gradom",
        location: "Split, Hrvatska",
        image:
          "https://images.unsplash.com/photo-1765266958853-5c6ae343a711?w=400",
        participants: 156,
      },
    ],
    "4": [
      {
        id: 5,
        title: "Street Art & Urbana Kultura",
        location: "Rijeka, Hrvatska",
        image:
          "https://images.unsplash.com/photo-1607220868624-dd855c2839be?w=400",
        participants: 94,
      },
    ],
  };

  const blogPostsByUser: Record<string, any[]> = {
    "1": [
      {
        id: 1,
        title: "10 Skrivenih Dragulja Hrvatske Koje Morate Posjetiti",
        excerpt: "Otkrijte najljepša mjesta koja turisti ne znaju...",
        date: "10. Prosinac 2024",
        category: "Putovanja",
        image:
          "https://images.unsplash.com/photo-1537932155948-d391809047d5?w=400",
      },
    ],
    "2": [
      {
        id: 3,
        title: "Street Food Zagreb: Lokalna Gastro Scena",
        excerpt: "Istražite najbolje street food destinacije...",
        date: "1. Prosinac 2024",
        category: "Hrana",
        image:
          "https://images.unsplash.com/photo-1762674462382-6ea7fb670032?w=400",
      },
    ],
    "3": [
      {
        id: 4,
        title: "Planinarski Vodič: Velebit za Početnike",
        excerpt: "Sve što trebate znati prije vašeg prvog uspona...",
        date: "28. Studeni 2024",
        category: "Avantura",
        image:
          "https://images.unsplash.com/photo-1471240840307-485d3bc42300?w=400",
      },
    ],
    "4": [
      {
        id: 5,
        title: "Kultura i Povijest: Split kroz Stoljeća",
        excerpt: "Šetnja kroz 1700 godina povijesti...",
        date: "25. Studeni 2024",
        category: "Kultura",
        image:
          "https://images.unsplash.com/photo-1765266958853-5c6ae343a711?w=400",
      },
    ],
  };

  const savedTours = [
    {
      id: 3,
      title: "Kulturna Šetnja Starim Gradom",
      location: "Split, Hrvatska",
      image:
        "https://images.unsplash.com/photo-1765266958853-5c6ae343a711?w=400",
      price: 60,
    },
    {
      id: 4,
      title: "Kayaking Jadranska Avantura",
      location: "Dubrovnik, Hrvatska",
      image:
        "https://images.unsplash.com/photo-1631165538791-295d382f5edd?w=400",
      price: 95,
    },
  ];

  const allBadges = [
    {
      icon: Trophy,
      name: "Prvi Put",
      color: "#ff6309",
      unlocked: true,
      xp: 100,
      description: "Završi svoju prvu turu",
    },
    {
      icon: Star,
      name: "Gradski Istraživač",
      color: "#2b946f",
      unlocked: true,
      xp: 250,
      description: "Posjeti 5 različitih gradova",
    },
    {
      icon: Award,
      name: "Kulturnjaković",
      color: "#0f6659",
      unlocked: true,
      xp: 300,
      description: "Završi 3 kulturne ture",
    },
    {
      icon: Target,
      name: "Avanturista",
      color: "#104d2f",
      unlocked: true,
      xp: 400,
      description: "Završi avanturu s 4+ zvijezde",
    },
    {
      icon: Trophy,
      name: "Globtroter",
      color: "#ff6309",
      unlocked: true,
      xp: 500,
      description: "Posjeti 10 različitih lokacija",
    },
    {
      icon: Star,
      name: "Social Butterfly",
      color: "#2b946f",
      unlocked: true,
      xp: 200,
      description: "Dodaj 20 prijatelja",
    },
    {
      icon: Award,
      name: "Gastro Lover",
      color: "#0f6659",
      unlocked: false,
      xp: 350,
      description: "Završi 5 gastro tura",
    },
    {
      icon: Target,
      name: "Planinarski Pro",
      color: "#104d2f",
      unlocked: false,
      xp: 600,
      description: "Završi 5 planinskih tura",
    },
  ];

  const friends = [
    {
      id: "1",
      name: "Ana Jurić",
      avatar: "https://i.pravatar.cc/150?img=5",
      tours: 28,
    },
    {
      id: "2",
      name: "Petar Novak",
      avatar: "https://i.pravatar.cc/150?img=12",
      tours: 18,
    },
    {
      id: "3",
      name: "Ivana Marić",
      avatar: "https://i.pravatar.cc/150?img=10",
      tours: 11,
    },
    {
      id: "4",
      name: "Luka Horvat",
      avatar: "https://i.pravatar.cc/150?img=1",
      tours: 9,
    },
  ];

  const userGuideTours = toursAsGuide[userId || "me"] || [];
  const userBlogPosts = blogPostsByUser[userId || "me"] || [];

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        {/* Profile Header */}
        <section className="bg-gradient-to-r from-[#104d2f] to-[#0f6659] text-white py-12 md:py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#ff6309] rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Avatar */}
              <div className="relative">
                <div
                  onClick={() => setShowProfileImageModal(true)}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white/30 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={userStats.avatar}
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

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-2 text-3xl md:text-5xl">{userStats.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/90 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{userStats.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Član od {userStats.memberSince}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                  <Link
                    href="#tours"
                    className="text-center hover:opacity-80 transition-opacity"
                  >
                    <p className="text-2xl md:text-3xl text-[#ff6309]">
                      {userStats.toursCompleted}
                    </p>
                    <p className="text-xs md:text-sm text-white/70">Ture</p>
                  </Link>
                  <button
                    onClick={() => setShowBadgesModal(true)}
                    className="text-center hover:opacity-80 transition-opacity"
                  >
                    <p className="text-2xl md:text-3xl text-[#ff6309]">
                      {userStats.badges}
                    </p>
                    <p className="text-xs md:text-sm text-white/70">Značke</p>
                  </button>
                  <Link
                    href="#friends"
                    className="text-center hover:opacity-80 transition-opacity"
                  >
                    <p className="text-2xl md:text-3xl text-[#ff6309]">
                      {userStats.friends}
                    </p>
                    <p className="text-xs md:text-sm text-white/70">
                      Prijatelji
                    </p>
                  </Link>
                  <button
                    onClick={() => setShowLevelModal(true)}
                    className="text-center hover:opacity-80 transition-opacity"
                  >
                    <p className="text-2xl md:text-3xl text-[#ff6309]">
                      Lvl {userStats.level}
                    </p>
                    <p className="text-xs md:text-sm text-white/70">
                      {userStats.xp} XP
                    </p>
                  </button>
                  {userStats.toursAsGuide > 0 && (
                    <Link
                      href="#guide-tours"
                      className="text-center hover:opacity-80 transition-opacity"
                    >
                      <p className="text-2xl md:text-3xl text-[#ff6309]">
                        {userStats.toursAsGuide}
                      </p>
                      <p className="text-xs md:text-sm text-white/70">
                        Kao vodič
                      </p>
                    </Link>
                  )}
                  {userStats.blogPosts > 0 && (
                    <Link
                      href="#blog-posts"
                      className="text-center hover:opacity-80 transition-opacity"
                    >
                      <p className="text-2xl md:text-3xl text-[#ff6309]">
                        {userStats.blogPosts}
                      </p>
                      <p className="text-xs md:text-sm text-white/70">
                        Blog postovi
                      </p>
                    </Link>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isOwnProfile && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowEditPersonal(true)}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors whitespace-nowrap"
                  >
                    <Edit size={18} />
                    <span className="hidden md:inline">Uredi podatke</span>
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

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Completed Tours */}
              <div
                id="tours"
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
              >
                <h3 className="text-[#104d2f] mb-6">Dosadašnja Iskustva</h3>
                <div className="space-y-4">
                  {completedTours.map((tour) => (
                    <Link key={tour.id} href={`/tours/${tour.id}`}>
                      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gradient-to-r from-[#2b946f]/5 to-[#0f6659]/5 hover:shadow-md transition-all cursor-pointer">
                        <img
                          src={tour.image}
                          alt={tour.title}
                          className="w-full sm:w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-[#104d2f] mb-1">{tour.title}</h4>
                          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                            <MapPin size={14} className="text-[#ff6309]" />
                            <span>{tour.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {tour.date}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users size={14} />
                              <span>{tour.participants} sudionika</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tours as Guide */}
              {userGuideTours.length > 0 && (
                <div
                  id="guide-tours"
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
                >
                  <h3 className="text-[#104d2f] mb-6">Ture kao vodič</h3>
                  <div className="space-y-4">
                    {userGuideTours.map((tour) => (
                      <Link key={tour.id} href={`/tours/${tour.id}`}>
                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gradient-to-r from-[#ff6309]/5 to-[#2b946f]/5 hover:shadow-md transition-all cursor-pointer">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-full sm:w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-[#104d2f] mb-1">
                              {tour.title}
                            </h4>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                              <MapPin size={14} className="text-[#ff6309]" />
                              <span>{tour.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users size={14} />
                              <span>
                                {tour.participants} sudionika vodio/la
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Posts */}
              {userBlogPosts.length > 0 && (
                <div
                  id="blog-posts"
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
                >
                  <h3 className="text-[#104d2f] mb-6">Blog postovi</h3>
                  <div className="space-y-4">
                    {userBlogPosts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.id}`}>
                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gradient-to-r from-[#0f6659]/5 to-[#104d2f]/5 hover:shadow-md transition-all cursor-pointer">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full sm:w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="inline-block bg-[#2b946f] text-white px-3 py-1 rounded-full text-xs mb-2">
                              {post.category}
                            </div>
                            <h4 className="text-[#104d2f] mb-1">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                              {post.excerpt}
                            </p>
                            <span className="text-xs text-gray-500">
                              {post.date}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Tours (only for own profile) */}
              {isOwnProfile && (
                <div
                  id="saved-tours"
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Bookmark className="text-[#ff6309]" size={24} />
                    <h3 className="text-[#104d2f]">Spremljene ture</h3>
                  </div>
                  <div className="space-y-4">
                    {savedTours.map((tour) => (
                      <Link key={tour.id} href={`/tours/${tour.id}`}>
                        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gradient-to-r from-[#ff6309]/5 to-[#0f6659]/5 hover:shadow-md transition-all cursor-pointer">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-full sm:w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-[#104d2f] mb-1">
                              {tour.title}
                            </h4>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                              <MapPin size={14} className="text-[#ff6309]" />
                              <span>{tour.location}</span>
                            </div>
                            <span className="text-[#2b946f]">
                              €{tour.price}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges Preview */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[#104d2f]">Tvoje Značke</h3>
                  <button
                    onClick={() => setShowBadgesModal(true)}
                    className="text-[#2b946f] hover:text-[#104d2f] transition-colors text-sm"
                  >
                    Vidi sve →
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {allBadges.slice(0, 6).map((badge, index) => (
                    <div
                      key={index}
                      className={`relative p-4 rounded-xl text-center ${
                        badge.unlocked
                          ? "bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10"
                          : "bg-gray-100 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                          badge.unlocked ? "shadow-lg" : "grayscale"
                        }`}
                        style={{
                          backgroundColor: badge.unlocked
                            ? badge.color
                            : "#9CA3AF",
                        }}
                      >
                        <badge.icon size={24} className="text-white" />
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-1">
                        {badge.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Friends */}
            <div>
              <div
                id="friends"
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg sticky top-24"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[#104d2f]">Prijatelji</h3>
                  <Users className="text-[#2b946f]" size={24} />
                </div>

                <div className="space-y-3">
                  {friends.map((friend) => (
                    <Link key={friend.id} href={`/profile/${friend.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-[#2b946f]/5 hover:to-[#0f6659]/5 transition-all cursor-pointer">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#2b946f]/20"
                        />
                        <div className="flex-1">
                          <p className="text-gray-800">{friend.name}</p>
                          <p className="text-sm text-gray-500">
                            {friend.tours} tura
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => setShowAddFriendsModal(true)}
                    className="w-full mt-6 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3 rounded-full hover:shadow-lg transition-all"
                  >
                    Dodaj prijatelje
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showBadgesModal && (
            <BadgesModal
              badges={allBadges}
              onClose={() => setShowBadgesModal(false)}
            />
          )}
          {showLevelModal && (
            <LevelModal
              level={userStats.level}
              xp={userStats.xp}
              onClose={() => setShowLevelModal(false)}
            />
          )}
          {showAddTour && (
            <AddTourModal onClose={() => setShowAddTour(false)} />
          )}
          {showProfileImageModal && (
            <ProfileImageModal
              avatar={userStats.avatar}
              onClose={() => setShowProfileImageModal(false)}
            />
          )}
          {showAddFriendsModal && (
            <AddFriendsModal onClose={() => setShowAddFriendsModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function BadgesModal({
  badges,
  onClose,
}: {
  badges: any[];
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 p-6 md:p-8 overflow-y-auto mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#104d2f]">Sve Značke</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-xl text-center ${
                badge.unlocked
                  ? "bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10"
                  : "bg-gray-100"
              }`}
            >
              <div
                className={`w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  badge.unlocked ? "shadow-lg" : "grayscale opacity-50"
                }`}
                style={{ backgroundColor: badge.color }}
              >
                <badge.icon size={32} className="text-white" />
              </div>
              <p
                className={`mb-1 ${
                  badge.unlocked ? "text-[#104d2f]" : "text-gray-500"
                }`}
              >
                {badge.name}
              </p>
              <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
              <p className="text-xs text-[#2b946f]">+{badge.xp} XP</p>
              {badge.unlocked && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function LevelModal({
  level,
  xp,
  onClose,
}: {
  level: number;
  xp: number;
  onClose: () => void;
}) {
  const xpForNextLevel = level * 1000;
  const progress = (xp % 1000) / 10;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-8 mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#104d2f]">Level Sustav</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-[#2b946f] to-[#0f6659] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl text-white">{level}</span>
          </div>
          <p className="text-gray-700 mb-2">Trenutni XP: {xp}</p>
          <p className="text-gray-500 text-sm">
            Do sljedeće razine: {xpForNextLevel - (xp % 1000)} XP
          </p>
        </div>
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2b946f] to-[#ff6309] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="bg-[#2b946f]/10 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            Svaka značka donosi XP bodove. Skupljaj značke i napreduj kroz
            razine za posebne nagrade i popuste!
          </p>
        </div>
      </motion.div>
    </>
  );
}

function AddTourModal({ onClose }: { onClose: () => void }) {
  const [isFeatured, setIsFeatured] = useState(false);
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
    languages: [] as string[],
  });

  const allFieldsFilled =
    formData.title &&
    formData.description &&
    formData.price &&
    formData.maxPeople &&
    formData.duration &&
    formData.meetingPoint;

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
            <h2 className="text-[#104d2f]">Dodaj novu turu</h2>
            <p className="text-gray-600 text-sm">* Označava obavezna polja</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Naziv ture *</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Opis *</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Cijena (€) *</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Max osoba *</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
                onChange={(e) =>
                  setFormData({ ...formData, maxPeople: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Trajanje *</label>
              <input
                type="text"
                placeholder="npr. 3 sata"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Mjesto susreta *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
                onChange={(e) =>
                  setFormData({ ...formData, meetingPoint: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Highlights (opciono)
            </label>
            <textarea
              rows={3}
              placeholder="Svaki red = jedan highlight"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
              onChange={(e) =>
                setFormData({ ...formData, highlights: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Što je uključeno (opciono)
            </label>
            <textarea
              rows={3}
              placeholder="Svaki red = jedan benefit"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
              onChange={(e) =>
                setFormData({ ...formData, benefits: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Tagovi (opciono)</label>
            <input
              type="text"
              placeholder="Odvojeno zarezom"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Slike</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2b946f] transition-colors cursor-pointer">
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-600">Klikni ili povuci slike ovdje</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              disabled={!allFieldsFilled}
              className="w-5 h-5 text-[#2b946f]"
            />
            <label
              htmlFor="featured"
              className={`${
                !allFieldsFilled ? "text-gray-400" : "text-gray-700"
              } cursor-pointer`}
            >
              Označi kao istaknuto (Featured) - Dostupno samo ako su svi podaci
              popunjeni
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Odustani
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#2b946f] to-[#0f6659] text-white py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Objavi turu
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

function ProfileImageModal({
  avatar,
  onClose,
}: {
  avatar: string;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.img
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          src={avatar}
          alt="Profile"
          className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </>
  );
}

function AddFriendsModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const allUsers = [
    {
      id: "5",
      name: "Marta Kovač",
      avatar: "https://i.pravatar.cc/150?img=20",
      location: "Zagreb",
    },
    {
      id: "6",
      name: "Filip Jurić",
      avatar: "https://i.pravatar.cc/150?img=13",
      location: "Split",
    },
    {
      id: "7",
      name: "Katarina Novak",
      avatar: "https://i.pravatar.cc/150?img=25",
      location: "Rijeka",
    },
    {
      id: "8",
      name: "Tomislav Babić",
      avatar: "https://i.pravatar.cc/150?img=33",
      location: "Dubrovnik",
    },
  ];

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 md:p-8 mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#104d2f]">Dodaj prijatelje</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Pretraži po imenu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b946f]"
          />
        </div>

        {/* Results */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.location}</p>
              </div>
              <button className="bg-[#2b946f] text-white px-4 py-2 rounded-full hover:bg-[#267d5e] transition-colors text-sm">
                Dodaj
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default ProfilePage;
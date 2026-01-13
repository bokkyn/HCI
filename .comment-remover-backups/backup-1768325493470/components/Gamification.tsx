"use client"; 

import { motion } from "motion/react";
import Link from "next/link";
import { Trophy, Zap, Medal, Star, Award, Target } from "lucide-react";
import Image from "next/image";

export default function Gamification() {

  const badges = [
    { icon: Trophy, name: "Prvi Put", color: "#ff6309", unlocked: true },
    {
      icon: Medal,
      name: "Gradski Istraživač",
      color: "#2b946f",
      unlocked: true,
    },
    { icon: Star, name: "Kulturnjaković", color: "#0f6659", unlocked: true },
    { icon: Award, name: "Avanturista", color: "#104d2f", unlocked: false },
    { icon: Target, name: "Globtroter", color: "#ff6309", unlocked: false },
    { icon: Zap, name: "Speed Runner", color: "#2b946f", unlocked: false },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: "Marko K.",
      xp: 12450,
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      rank: 2,
      name: "Ana J.",
      xp: 11230,
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      rank: 3,
      name: "Petar N.",
      xp: 10890,
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      rank: 4,
      name: "Ti",
      xp: 8750,
      avatar: "https://i.pravatar.cc/150?img=8",
      highlight: true,
    },
    {
      rank: 5,
      name: "Ivana M.",
      xp: 7620,
      avatar: "https://i.pravatar.cc/150?img=10",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#104d2f]/5 to-[#ff6309]/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-[#104d2f] mb-4">Skupljaj Postignuća</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Istražuj više, osvoji značke i postani dio zajednice avanturista
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* XP Progress & Badges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-md"
          >
            <Link href="/profile" className="block">
              {" "}
              {/* Promijenjeno to u href */}
              <div className="flex items-center justify-between mb-6 cursor-pointer hover:opacity-80 transition-opacity">
                <div>
                  <h4 className="text-[#104d2f] mb-1">Tvoj Progres</h4>
                  <p className="text-gray-600">Razina 12</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-[#ff6309]">8,750 XP</p>
                  <p className="text-sm text-gray-500">
                    1,250 do sljedeće razine
                  </p>
                </div>
              </div>
            </Link>

            {/* XP Bar */}
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-8">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "87.5%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2b946f] to-[#ff6309] rounded-full"
              />
            </div>

            {/* Badges Grid */}
            <h5 className="text-[#104d2f] mb-4">Tvoje Značke</h5>
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`relative p-4 rounded-xl text-center cursor-pointer ${
                    badge.unlocked
                      ? "bg-gradient-to-br from-gray-50 to-gray-100"
                      : "bg-gray-100 opacity-50"
                  }`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      badge.unlocked ? "shadow-md" : "grayscale"
                    }`}
                    style={{
                      backgroundColor: badge.unlocked ? badge.color : "#9CA3AF",
                    }}
                  >
                    <badge.icon size={28} className="text-white" />
                  </div>
                  <p className="text-xs text-gray-700">{badge.name}</p>
                  {badge.unlocked && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-md"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="text-[#ff6309]" size={32} />
              <h4 className="text-[#104d2f]">Leaderboard</h4>
            </div>

            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <Link
                  key={index}
                  href={user.highlight ? "/profile" : `/profile/${index + 1}`} // Promijenjeno to u href
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                      user.highlight
                        ? "bg-gradient-to-r from-[#ff6309]/10 to-[#2b946f]/10 ring-2 ring-[#ff6309]"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {user.rank <= 3 ? (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor:
                              user.rank === 1
                                ? "#FFD700"
                                : user.rank === 2
                                ? "#C0C0C0"
                                : "#CD7F32",
                          }}
                        >
                          <span className="text-white">{user.rank}</span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-700">{user.rank}</span>
                        </div>
                      )}
                    </div>

                    {/* Avatar - Koristite Next.js Image za bolje performanse */}
                    <div className="relative w-12 h-12">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="rounded-full object-cover ring-2 ring-white"
                        sizes="48px"
                      />
                    </div>

                    {/* Name */}
                    <div className="flex-1">
                      <p className="text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">
                        {user.xp.toLocaleString()} XP
                      </p>
                    </div>

                    {/* Badge for top 3 */}
                    {user.rank <= 3 && (
                      <Trophy className="text-[#ff6309]" size={20} />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/profile"
                className="text-[#ff6309] hover:text-[#e55808] transition-colors"
              >
                {" "}
                {/* Promijenjeno to u href */}
                Vidi cijeli leaderboard →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

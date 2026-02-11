// components/HomeLeaderboard.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  rank: number;
  name: string;
  fullName: string;
  xp: number;
  avatar: string;
}

export default function HomeLeaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/users/leaderboard");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška pri dohvaćanju leaderboarda");
      }

      if (data.success) {
        setUsers(data.data.slice(0, 5));
      }
    } catch (err: any) {
      console.error("Error fetching leaderboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-700";
      case 2:
        return "bg-gray-100 text-gray-700";
      case 3:
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#ff6309]/10 rounded-lg">
            <Trophy className="text-[#ff6309]" size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Top 5 avanturista</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-[#2b946f] animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#ff6309]/10 rounded-lg">
            <Trophy className="text-[#ff6309]" size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Top 5 avanturista</h3>
        </div>
        <div className="flex items-center gap-2 text-red-600 py-4">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-[#ff6309]/10 rounded-lg">
          <Trophy className="text-[#ff6309]" size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Top 5 avanturista</h3>
      </div>

      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getRankColor(
                  user.rank,
                )}`}
              >
                {user.rank}
              </div>
            </div>

            {/* Avatar */}
            <div className="relative w-10 h-10 flex-shrink-0">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.fullName}
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.fullName?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>

            {/* Name & XP */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500">
                {user.xp.toLocaleString()} XP
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Registriraj se, putuj, skupljaj XP i osvoji svoje mjesto na ljestvici!
        </p>
      </div>
    </div>
  );
}

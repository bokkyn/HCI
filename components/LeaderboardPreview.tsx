// components/LeaderboardPreview.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import LeaderboardModal from "./LeaderboardModal";

interface User {
  id: string;
  rank: number;
  name: string;
  fullName: string;
  xp: number;
  avatar: string;
}

interface LeaderboardPreviewProps {
  currentUserId: string;
}

export default function LeaderboardPreview({
  currentUserId,
}: LeaderboardPreviewProps) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [previewUsers, setPreviewUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setAllUsers(data.data);

        // Pronađi trenutnog korisnika u listi
        const currentUserIndex = data.data.findIndex(
          (u: User) => u.id === currentUserId,
        );

        if (currentUserIndex === -1) {
          // Ako korisnik nije u listi (nema XP), prikaži prvih 5
          setPreviewUsers(data.data.slice(0, 5));
          return;
        }

        // Izračunaj 2 iznad i 2 ispod
        const startIndex = Math.max(0, currentUserIndex - 2);
        const endIndex = Math.min(data.data.length - 1, currentUserIndex + 2);

        // Osiguraj da uvijek prikažemo 5 korisnika ako ih ima dovoljno
        let previewIndices = [];
        for (let i = startIndex; i <= endIndex; i++) {
          previewIndices.push(i);
        }

        // Ako nemamo 5 korisnika, dodaj još
        while (previewIndices.length < 5 && previewIndices[0] > 0) {
          previewIndices.unshift(previewIndices[0] - 1);
        }
        while (
          previewIndices.length < 5 &&
          previewIndices[previewIndices.length - 1] < data.data.length - 1
        ) {
          previewIndices.push(previewIndices[previewIndices.length - 1] + 1);
        }

        setPreviewUsers(previewIndices.map((i) => data.data[i]));
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Trophy className="text-gray-500" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
          </div>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Trophy className="text-gray-500" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-red-600 py-4">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#ff6309]/10 rounded-lg">
              <Trophy className="text-[#ff6309]" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-sm text-[#2b946f] hover:text-[#0f6659] transition-colors font-medium"
          >
            Prikaži više
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {previewUsers.map((user) => {
            const isCurrentUser = user.id === currentUserId;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (user.rank - 1) * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isCurrentUser
                    ? "bg-gradient-to-r from-[#ff6309]/5 to-[#2b946f]/5 ring-1 ring-[#ff6309]"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
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
                      className="rounded-full object-cover ring-2 ring-white"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center ring-2 ring-white">
                      <span className="text-white font-bold text-sm">
                        {user.fullName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isCurrentUser ? "text-[#ff6309]" : "text-gray-900"
                    }`}
                  >
                    {user.fullName}
                    {isCurrentUser && (
                      <span className="ml-2 text-[10px] bg-[#ff6309] text-white px-1.5 py-0.5 rounded-full">
                        Ti
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.xp.toLocaleString()} XP
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Ukupno {allUsers.length} avanturista
          </p>
        </div>
      </div>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={allUsers}
        currentUserId={currentUserId}
      />
    </>
  );
}

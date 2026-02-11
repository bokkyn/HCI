// components/LeaderboardModal.tsx
"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Trophy, Crown, Medal, Award } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  rank: number;
  name: string;
  fullName: string;
  xp: number;
  avatar: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string;
}

export default function LeaderboardModal({
  isOpen,
  onClose,
  users,
  currentUserId,
}: LeaderboardModalProps) {
  if (!isOpen) return null;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Medal className="text-amber-600" size={20} />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-700 border-gray-300";
      case 3:
        return "bg-amber-100 text-amber-700 border-amber-300";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#104d2f]/5 to-[#0f6659]/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ff6309]/10 rounded-lg">
                <Trophy className="text-[#ff6309]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Leaderboard
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Najbolji avanturisti zajednice
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Leaderboard List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {users.map((user) => {
                const isCurrentUser = user.id === currentUserId;

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (user.rank - 1) * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-[#ff6309]/5 to-[#2b946f]/5 border-[#ff6309] ring-1 ring-[#ff6309]"
                        : "bg-white border-gray-200 hover:border-[#2b946f]/30 hover:shadow-md"
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${getRankColor(
                          user.rank,
                        )}`}
                      >
                        {user.rank <= 3 ? (
                          getRankIcon(user.rank)
                        ) : (
                          <span>{user.rank}</span>
                        )}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.fullName}
                          fill
                          className="rounded-full object-cover ring-2 ring-white"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2b946f] to-[#0f6659] flex items-center justify-center ring-2 ring-white">
                          <span className="text-white font-bold text-lg">
                            {user.fullName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          isCurrentUser ? "text-[#ff6309]" : "text-gray-900"
                        }`}
                      >
                        {user.fullName}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-[#ff6309] text-white px-2 py-0.5 rounded-full">
                            Ti
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.xp.toLocaleString()} XP
                      </p>
                    </div>

                    {/* Trophy za top 3 */}
                    {user.rank <= 3 && (
                      <div className="flex-shrink-0">
                        {user.rank === 1 && (
                          <div className="bg-yellow-100 p-2 rounded-full">
                            <Crown className="text-yellow-600" size={18} />
                          </div>
                        )}
                        {user.rank === 2 && (
                          <div className="bg-gray-100 p-2 rounded-full">
                            <Medal className="text-gray-600" size={18} />
                          </div>
                        )}
                        {user.rank === 3 && (
                          <div className="bg-amber-100 p-2 rounded-full">
                            <Award className="text-amber-600" size={18} />
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-[#ff6309] to-[#2b946f] rounded-full"></div>
                <span>Označeni ste žutim rubom</span>
              </div>
              <span className="font-medium">{users.length} avanturista</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

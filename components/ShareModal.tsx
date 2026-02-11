"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Facebook, Twitter, Check } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  tourTitle,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Pogledaj ovu turu: ${tourTitle}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  const handleShareFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleShareTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#104d2f]/5 to-[#0f6659]/5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Podijeli turu</h2>
              <p className="text-gray-600 mt-1 text-sm">{tourTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {copied && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-green-700 text-sm">Link je kopiran!</p>
              </div>
            )}

            {/* Share Options */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                Odaberi način dijeljenja
              </h3>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Copy className="h-6 w-6 text-gray-700" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-gray-900">Kopiraj link</p>
                  <p className="text-sm text-gray-500">
                    Kopiraj vezu u međuspremnik
                  </p>
                </div>
              </button>

              {/* Facebook */}
              <button
                onClick={handleShareFacebook}
                className="w-full flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Facebook className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-gray-900">
                    Podijeli na Facebooku
                  </p>
                  <p className="text-sm text-gray-500">
                    Otvori Facebook za dijeljenje
                  </p>
                </div>
              </button>

              {/* Twitter/X */}
              <button
                onClick={handleShareTwitter}
                className="w-full flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-black/5 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                  <Twitter className="h-6 w-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-gray-900">Podijeli na X-u</p>
                  <p className="text-sm text-gray-500">
                    Otvori X za dijeljenje
                  </p>
                </div>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Dijeljenjem pomažete vodiču i drugima da otkriju ovu ponudu!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={onClose}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
            >
              Zatvori
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

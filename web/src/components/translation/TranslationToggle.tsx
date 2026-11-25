"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export interface TranslationToggleProps {
  englishText: string;
  tamilText?: string;
  className?: string;
  tamilClassName?: string;
  inline?: boolean;
  label?: string;
  variant?: "dark" | "light";
  compact?: boolean;
}

export const TranslationToggle: React.FC<TranslationToggleProps> = ({
  englishText,
  tamilText,
  className = "",
  tamilClassName = "",
  inline = false,
  label = "தமிழ்",
  variant = "dark",
  compact = false,
}) => {
  const { isTamil } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const safeEnglish = englishText || "";
  const hasTamil = Boolean(tamilText && tamilText.trim().length > 0 && tamilText.trim() !== safeEnglish.trim());

  // Global Tamil mode: replace text globally when Tamil translation exists; otherwise fall back to English
  if (isTamil) {
    if (hasTamil) {
      return (
        <span className={`font-tamil text-base leading-relaxed block ${tamilClassName || className}`}>
          {tamilText}
        </span>
      );
    }
    return <span className={className}>{safeEnglish}</span>;
  }

  // Default English mode: if no Tamil translation exists, gracefully render English only
  if (!hasTamil) {
    return <span className={className}>{safeEnglish}</span>;
  }

  const isLight = variant === "light";

  return (
    <div className={`relative ${inline ? "inline-block" : "block"} ${className}`}>
      {/* English Text Content with On-Demand Translation Trigger */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span>{safeEnglish}</span>
        </div>

        {/* Translation Trigger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          aria-label={isExpanded ? "Hide Tamil translation" : "View Tamil translation"}
          aria-expanded={isExpanded}
          className={`shrink-0 ml-1 rounded-full font-ui font-black flex items-center gap-1 border transition-all cursor-pointer active:scale-95 shadow-sm ${
            compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"
          } ${
            isExpanded
              ? isLight
                ? "bg-emerald-100 border-emerald-600 text-emerald-900 ring-1 ring-emerald-500/40"
                : "bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/50"
              : isLight
              ? "bg-amber-100/90 hover:bg-amber-200 border-amber-700/40 text-amber-950"
              : "bg-[#200438]/90 hover:bg-[#6A0DAD]/60 border-[#FFD700]/60 text-[#FFD700]"
          }`}
          title={isExpanded ? "Hide Tamil translation" : "See Tamil translation"}
        >
          <Languages className={`w-3 h-3 ${isLight ? "text-amber-800" : "text-[#FFD700]"}`} />
          <span>{label}</span>
          {isExpanded ? <EyeOff className="w-2.5 h-2.5 opacity-75" /> : <Eye className="w-2.5 h-2.5 opacity-75" />}
        </button>
      </div>

      {/* Smooth Expandable Tamil Helper Tray (Zero CLS height animation, 16px+ mobile legibility) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={`mt-2 p-3 rounded-xl border text-base font-tamil italic leading-relaxed shadow-inner ${
                isLight
                  ? "bg-amber-50/95 border-amber-500/50 text-emerald-900"
                  : "bg-emerald-950/50 border-[#FFD700]/35 text-emerald-300"
              }`}
            >
              <p className="font-medium text-base leading-relaxed">{tamilText}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

"use client";

import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { audioEngine } from "../../lib/audioEngine";

export const GlobalLanguageToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { isTamil, setLanguage } = useLanguage();

  const handleToggle = () => {
    audioEngine.playButtonClick();
    setLanguage(isTamil ? "en" : "ta");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      data-testid="global-language-toggle"
      aria-label={`Language mode: currently ${isTamil ? "Tamil" : "English"}. Click to toggle language`}
      aria-pressed={isTamil}
      className={`px-2.5 py-1 rounded-full border-2 transition-all flex items-center gap-1.5 font-ui text-[11px] font-black cursor-pointer shadow active:scale-95 ${
        isTamil
          ? "bg-emerald-950/90 border-[#2ECC71] text-emerald-300 shadow-[0_0_10px_rgba(46,204,113,0.4)]"
          : "bg-[#0F0320]/90 border-[#FFD700]/70 text-[#FFD700] hover:bg-[#6A0DAD]/40"
      } ${className}`}
      title={isTamil ? "Switch to English default mode" : "Switch to Tamil global mode"}
    >
      <Languages className={`w-3.5 h-3.5 ${isTamil ? "text-[#2ECC71]" : "text-[#FFD700]"}`} />
      <span className="tracking-wider">
        {isTamil ? "TA (தமிழ்)" : "EN / TA"}
      </span>
    </button>
  );
};

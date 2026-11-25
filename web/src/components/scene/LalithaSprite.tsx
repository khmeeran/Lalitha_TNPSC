"use client";

import React, { useState } from "react";
import { triggerRewardParticles } from "../../utils/particleEngine";

export type LalithaExpression = "HAPPY" | "THINKING" | "CONFUSED" | "CELEBRATING";

interface LalithaSpriteProps {
  expression?: LalithaExpression;
  size?: number; // 120 to 180px default 144
  className?: string;
  onClick?: () => void;
  showShadow?: boolean;
  isSpeaking?: boolean;
  use3dRender?: boolean;
}

export const LalithaSprite: React.FC<LalithaSpriteProps> = ({
  expression = "HAPPY",
  size = 144,
  className = "",
  onClick,
  showShadow = true,
  isSpeaking = false,
  use3dRender = true,
}) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setIsBouncing(true);
    triggerRewardParticles({
      type: "STAR",
      originX: e.clientX,
      originY: e.clientY,
      count: 12,
    });
    setTimeout(() => setIsBouncing(false), 900);
    onClick?.();
  };

  const getAnimationClass = () => {
    if (isSpeaking) return "animate-bounce";
    if (isBouncing) return "animate-bounce";
    switch (expression) {
      case "CELEBRATING":
        return "animate-lalitha-bounce";
      case "THINKING":
        return "animate-lalitha-thinking";
      case "CONFUSED":
        return "animate-lalitha-nod";
      case "HAPPY":
      default:
        return "animate-lalitha-breathing";
    }
  };

  // If 3D render is enabled and image loads cleanly
  if (use3dRender && !imgError) {
    return (
      <div
        className={`relative inline-flex flex-col items-center select-none cursor-pointer group ${
          isSpeaking ? "scale-105" : ""
        } ${className}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Lalitha the Hero Wizard. Expression: ${expression}`}
      >
        {/* Magical Purple & Gold Aura */}
        <div className="absolute inset-0 bg-[#6A0DAD]/30 rounded-full blur-xl group-hover:bg-[#FFD700]/30 transition-colors" />

        <div
          style={{ width: size, height: size * 1.33 }}
          className={`relative z-10 transition-transform duration-300 group-hover:scale-105 active:scale-95 ${getAnimationClass()}`}
        >
          <img
            src="/assets/lalitha_wizard_hero.png"
            alt="Lalitha Wizard Hero"
            width={size}
            height={Math.round(size * 1.33)}
            className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(106,13,173,0.7)]"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Ground Shadow */}
        {showShadow && (
          <div className="w-24 h-4 bg-black/60 rounded-full blur-xs -mt-2 group-hover:scale-110 transition-transform" />
        )}
      </div>
    );
  }

  // Fallback: High-Fantasy Wizard SVG with Royal Purple Hat and Gold Trim
  return (
    <div
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group ${
        isSpeaking ? "animate-talking-lalitha scale-105" : ""
      } ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Lalitha the Hero Wizard. Expression: ${expression}`}
    >
      {/* Ground Shadow */}
      {showShadow && (
        <div
          className="absolute bottom-1 w-20 h-4 bg-slate-950/60 rounded-full blur-sm transition-all duration-300 group-hover:scale-110"
        />
      )}

      {/* SVG Character Sprite */}
      <svg
        width={size}
        height={size * 1.33}
        viewBox="0 0 120 160"
        className={`overflow-visible transition-transform duration-300 group-hover:scale-105 active:scale-95 ${getAnimationClass()}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lalithaPurpleWizardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8E24AA" />
            <stop offset="50%" stopColor="#6A0DAD" />
            <stop offset="100%" stopColor="#3F0569" />
          </linearGradient>
          <linearGradient id="lalithaGoldTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE566" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="lalithaSkinGradSprite" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F5D0A9" />
          </linearGradient>
          <filter id="lalithaWizardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#6A0DAD" floodOpacity="0.6" />
          </filter>
        </defs>

        <g id="lalitha-wizard-master" filter="url(#lalithaWizardGlow)">
          {/* Boots */}
          <rect x="47" y="128" width="10" height="22" rx="4" fill="#3E1E04" />
          <rect x="63" y="128" width="10" height="22" rx="4" fill="#3E1E04" />
          <ellipse cx="52" cy="150" rx="8" ry="4" fill="#FFD700" stroke="#7A5805" strokeWidth="1" />
          <ellipse cx="68" cy="150" rx="8" ry="4" fill="#FFD700" stroke="#7A5805" strokeWidth="1" />

          {/* Royal Purple Wizard Tunic */}
          <path
            d="M 42 74 L 78 74 L 88 128 L 32 128 Z"
            fill="url(#lalithaPurpleWizardGrad)"
            stroke="#FFD700"
            strokeWidth="2.5"
          />
          {/* Gold Filigree Hem Trim */}
          <path d="M 32 124 L 88 124 L 88 128 L 32 128 Z" fill="url(#lalithaGoldTrimGrad)" />

          {/* Glowing Ancient Palm-Leaf Scroll (Olaichuvadi) */}
          <rect x="68" y="98" width="22" height="18" rx="3" fill="#FFF8DC" stroke="#B8860B" strokeWidth="1.5" />
          <line x1="72" y1="103" x2="86" y2="103" stroke="#B8860B" strokeWidth="1" />
          <line x1="72" y1="107" x2="86" y2="107" stroke="#B8860B" strokeWidth="1" />
          <line x1="72" y1="111" x2="82" y2="111" stroke="#B8860B" strokeWidth="1" />
          {/* Scroll Glow Sparkle */}
          <circle cx="88" cy="98" r="3" fill="#FFD700" className="animate-ping" />

          {/* Arms */}
          <rect x="33" y="78" width="9" height="26" rx="4" fill="#F5D0A9" transform="rotate(10 38 90)" />
          <rect x="76" y="80" width="9" height="24" rx="4" fill="#F5D0A9" transform="rotate(-15 80 92)" />

          {/* Head & Neck */}
          <rect x="55" y="66" width="10" height="10" rx="3" fill="#F5D0A9" />
          <circle cx="60" cy="50" r="21" fill="url(#lalithaSkinGradSprite)" />

          {/* Eyes & Smile */}
          <circle cx="53" cy="48" r="4.5" fill="#1E293B" />
          <circle cx="54.5" cy="46.5" r="1.8" fill="#FFFFFF" />
          <circle cx="67" cy="48" r="4.5" fill="#1E293B" />
          <circle cx="68.5" cy="46.5" r="1.8" fill="#FFFFFF" />
          <path d="M 54 56 Q 60 63 66 56" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="47" cy="54" r="3" fill="#F87171" fillOpacity="0.45" />
          <circle cx="73" cy="54" r="3" fill="#F87171" fillOpacity="0.45" />

          {/* Red Saffron Bindi */}
          <circle cx="60" cy="42" r="1.8" fill="#DC2626" />

          {/* Hair */}
          <path d="M 40 45 C 38 28 82 28 80 45 C 75 35 45 35 40 45 Z" fill="#1E293B" />

          {/* =================================================================
              ROYAL PURPLE WIZARD HAT WITH GOLD TRIM & GOLD STAR
              ================================================================= */}
          {/* Hat Brim */}
          <ellipse cx="60" cy="36" rx="34" ry="9" fill="url(#lalithaPurpleWizardGrad)" stroke="#FFD700" strokeWidth="2" />
          {/* Hat Cone */}
          <path
            d="M 38 34 Q 58 10 74 -2 Q 72 15 82 34 Z"
            fill="url(#lalithaPurpleWizardGrad)"
            stroke="#FFD700"
            strokeWidth="2"
          />
          {/* Gold Star Charm at Tip */}
          <circle cx="74" cy="-2" r="4" fill="#FFD700" stroke="#FFF8DC" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};

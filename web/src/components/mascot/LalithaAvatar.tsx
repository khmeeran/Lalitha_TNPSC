"use client";

import React from "react";
import { LalithaMood } from "../../types/adventureMap";

interface LalithaAvatarProps {
  mood?: LalithaMood;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  showSpeechBubble?: boolean;
  speechText?: string;
}

export const LalithaAvatar: React.FC<LalithaAvatarProps> = ({
  mood = "CURIOUS_EXPLORER",
  size = "md",
  className = "",
  onClick,
  showSpeechBubble = false,
  speechText,
}) => {
  // Dimension scales
  const dimensions = {
    sm: { width: 72, height: 96 },
    md: { width: 100, height: 133 },
    lg: { width: 128, height: 170 },
  }[size];

  // Posture-specific animation CSS classes
  const getMoodAnimationClass = () => {
    switch (mood) {
      case "CURIOUS_EXPLORER":
        return "animate-lalitha-breathing";
      case "DEEP_THINKING":
        return "animate-lalitha-thinking";
      case "TRIUMPHANT_JOY":
        return "animate-lalitha-bounce";
      case "DETERMINED":
        return "animate-lalitha-nod";
      case "SCHOLAR_STUDY":
        return "animate-lalitha-breathing";
      case "RESTING_CHAI":
        return "animate-lalitha-breathing";
      default:
        return "animate-lalitha-breathing";
    }
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Lalitha the Aspirant Protagonist. Current state: ${mood.replace(/_/g, " ")}`}
      data-testid="lalitha-avatar"
    >
      {/* Optional Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div
          role="status"
          aria-live="polite"
          className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 bg-white text-slate-800 text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-amber-200 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
        >
          <span>{speechText}</span>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-amber-200 rotate-45" />
        </div>
      )}

      {/* Multi-Layer Vector SVG */}
      <svg
        id="lalitha-avatar-svg"
        viewBox="0 0 120 160"
        width={dimensions.width}
        height={dimensions.height}
        className={`overflow-visible filter drop-shadow-md transition-transform duration-200 ${
          onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""
        }`}
      >
        <defs>
          {/* Subtle skin & kurti gradients */}
          <linearGradient id="lalithaKurtiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="lalithaSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F5D0A9" />
          </linearGradient>
          <filter id="lalithaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#B45309" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse
          id="lalitha-shadow"
          cx="60"
          cy="154"
          rx="26"
          ry="5"
          fill="rgba(15, 23, 42, 0.18)"
        />

        {/* Master Animatable Body Group */}
        <g id="lalitha-body" className={getMoodAnimationClass()}>
          {/* Legs & Comfortable Kolhapuri/Dhoti styling */}
          <g id="lalitha-legs">
            <rect x="47" y="126" width="9" height="24" rx="4" fill="#78350F" />
            <rect x="64" y="126" width="9" height="24" rx="4" fill="#78350F" />
            {/* Sandals */}
            <ellipse cx="51.5" cy="151" rx="6.5" ry="3" fill="#451A03" />
            <ellipse cx="68.5" cy="151" rx="6.5" ry="3" fill="#451A03" />
          </g>

          {/* Contemporary Indian Kurti Dress */}
          <g id="lalitha-kurti" filter="url(#lalithaGlow)">
            {/* Kurti Body (A-line flare) */}
            <path
              d="M 45 74 L 75 74 L 84 130 L 36 130 Z"
              fill="url(#lalithaKurtiGrad)"
              stroke="#78350F"
              strokeWidth="1.5"
            />
            {/* Olive Green Border Trim */}
            <path
              d="M 36 126 L 84 126 L 84 130 L 36 130 Z"
              fill="#4D7C0F"
            />
            {/* Neckline Embroidery */}
            <path
              d="M 52 74 Q 60 84 68 74"
              stroke="#FEF3C7"
              strokeWidth="2"
              fill="none"
            />
          </g>

          {/* Cross-Body Explorer Satchel */}
          <g id="lalitha-satchel">
            {/* Satchel Strap */}
            <path
              d="M 44 76 L 78 114 L 74 118 L 40 80 Z"
              fill="#5A3311"
            />
            {/* Satchel Bag (Resting near left hip) */}
            <rect
              x="68"
              y="106"
              width="20"
              height="18"
              rx="4"
              fill="#78350F"
              stroke="#451A03"
              strokeWidth="1"
            />
            <path
              d="M 68 112 L 88 112"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
            {/* Brass Compass Pin (Mastery Badge) */}
            <circle cx="78" cy="116" r="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="78" cy="116" r="1.2" fill="#FEF3C7" />
          </g>

          {/* Left & Right Arms (State-Dependent) */}
          <g id="lalitha-arms">
            {mood === "TRIUMPHANT_JOY" ? (
              // Joyful raised cheer
              <>
                <path
                  d="M 45 78 Q 30 60 32 44"
                  stroke="url(#lalithaSkinGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="32" cy="42" r="4.5" fill="#F5D0A9" />
                <path
                  d="M 75 78 Q 90 60 88 44"
                  stroke="url(#lalithaSkinGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="88" cy="42" r="4.5" fill="#F5D0A9" />
              </>
            ) : mood === "DEEP_THINKING" ? (
              // Hand on chin, thoughtful
              <>
                <path
                  d="M 45 78 Q 36 94 44 108"
                  stroke="url(#lalithaSkinGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Right hand touching chin */}
                <path
                  d="M 75 78 Q 84 72 68 62"
                  stroke="url(#lalithaSkinGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="67" cy="61" r="4.2" fill="#F5D0A9" />
              </>
            ) : mood === "DETERMINED" ? (
              // Resolute, gripping satchel strap
              <>
                <path
                  d="M 45 78 Q 38 95 44 110"
                  stroke="url(#lalithaSkinGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 75 78 Q 74 95 72 108"
                  stroke="url(#lalithaSkinGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="72" cy="108" r="4.5" fill="#F5D0A9" />
              </>
            ) : (
              // Default Explorer (Hand shading brow or resting comfortably)
              <>
                <path
                  d="M 45 78 Q 35 94 40 108"
                  stroke="url(#lalithaSkinGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Hand shading brow */}
                <path
                  d="M 75 78 Q 90 66 76 44"
                  stroke="url(#lalithaSkinGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="74" cy="42" r="4.5" fill="#F5D0A9" />
              </>
            )}
          </g>

          {/* Head, Hair Braid & Expressive Face */}
          <g id="lalitha-head">
            {/* Neck */}
            <rect x="55" y="65" width="10" height="12" rx="3" fill="#F5D0A9" />

            {/* Back Hair Braid (Side-swept over shoulder) */}
            <path
              d="M 42 45 Q 36 68 40 90 Q 42 100 40 108"
              stroke="#1E293B"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Golden Braid Tie */}
            <rect x="37" y="102" width="7" height="3" rx="1.5" fill="#F59E0B" />

            {/* Face Base */}
            <circle cx="60" cy="50" r="21" fill="url(#lalithaSkinGrad)" />

            {/* Soft Peach Cheek Blush */}
            <ellipse cx="48" cy="56" rx="3" ry="1.8" fill="#F87171" opacity="0.35" />
            <ellipse cx="72" cy="56" rx="3" ry="1.8" fill="#F87171" opacity="0.35" />

            {/* Expressive Almond Eyes & Eyebrows */}
            <g id="lalitha-eyes" className="animate-blink">
              {mood === "TRIUMPHANT_JOY" ? (
                // Sparkling closed smiling arcs
                <>
                  <path d="M 48 48 Q 52 44 56 48" stroke="#0F172A" strokeWidth="2.2" fill="none" />
                  <path d="M 64 48 Q 68 44 72 48" stroke="#0F172A" strokeWidth="2.2" fill="none" />
                  {/* Micro Golden Sparkles */}
                  <circle cx="52" cy="43" r="1.2" fill="#F59E0B" />
                  <circle cx="68" cy="43" r="1.2" fill="#F59E0B" />
                </>
              ) : mood === "DEEP_THINKING" ? (
                // Searching upward
                <>
                  <ellipse cx="52" cy="47" rx="3.5" ry="4.5" fill="#0F172A" />
                  <circle cx="53" cy="46" r="1.2" fill="#FFFFFF" />
                  <ellipse cx="68" cy="47" rx="3.5" ry="4.5" fill="#0F172A" />
                  <circle cx="69" cy="46" r="1.2" fill="#FFFFFF" />
                  {/* Eyebrows raised */}
                  <path d="M 47 41 Q 52 39 56 42" stroke="#0F172A" strokeWidth="1.8" fill="none" />
                  <path d="M 64 42 Q 68 39 73 41" stroke="#0F172A" strokeWidth="1.8" fill="none" />
                </>
              ) : (
                // Standard bright almond eyes
                <>
                  <ellipse cx="52" cy="49" rx="3.5" ry="4.5" fill="#0F172A" />
                  <circle cx="53.2" cy="47.5" r="1.4" fill="#FFFFFF" />
                  <ellipse cx="68" cy="49" rx="3.5" ry="4.5" fill="#0F172A" />
                  <circle cx="69.2" cy="47.5" r="1.4" fill="#FFFFFF" />
                  {/* Natural Eyebrows */}
                  <path d="M 47 42 Q 52 40 56 43" stroke="#0F172A" strokeWidth="1.8" fill="none" />
                  <path d="M 64 43 Q 68 40 73 42" stroke="#0F172A" strokeWidth="1.8" fill="none" />
                </>
              )}
            </g>

            {/* Nose */}
            <path d="M 59 51 L 61 54 L 58.5 54.5" stroke="#D97706" strokeWidth="1.2" fill="none" />

            {/* Mouth (State-Specific) */}
            {mood === "TRIUMPHANT_JOY" ? (
              <path d="M 52 59 Q 60 69 68 59 Z" fill="#DC2626" />
            ) : mood === "DETERMINED" ? (
              <path d="M 54 60 L 66 60" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M 54 59 Q 60 64 66 59" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
            )}

            {/* Front Hair, Parting & Playful Determined Curl */}
            <path
              d="M 39 44 C 42 32, 54 30, 60 30 C 66 30, 78 32, 81 44 C 76 36, 68 35, 60 37 C 52 35, 44 36, 39 44 Z"
              fill="#0F172A"
            />
            {/* Playful stray curl on forehead */}
            <path
              d="M 58 35 Q 63 40 60 44"
              stroke="#0F172A"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

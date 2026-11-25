import React from "react";
import { VelanMood } from "../types/dashboard";

interface VelanMascotSvgProps {
  mood?: VelanMood;
  isFlapping?: boolean;
  className?: string;
  size?: number;
}

export const VelanMascotSvg: React.FC<VelanMascotSvgProps> = ({
  mood = "GREETING",
  isFlapping = false,
  className = "",
  size = 96,
}) => {
  // Dynamic transform calculations based on mood
  const getWingTransforms = () => {
    if (isFlapping) {
      return {
        left: "rotate(-25 35 65)",
        right: "rotate(25 85 65)",
      };
    }
    switch (mood) {
      case "CELEBRATING":
        return {
          left: "rotate(-32 35 60)",
          right: "rotate(32 85 60)",
        };
      case "STUDY":
        return {
          left: "rotate(10 35 65)",
          right: "rotate(-12 85 65)",
        };
      case "ENCOURAGING":
        return {
          left: "rotate(-4 35 65)",
          right: "rotate(6 85 65)",
        };
      default:
        return {
          left: "rotate(0 35 65)",
          right: "rotate(0 85 65)",
        };
    }
  };

  const getHeadTransform = () => {
    switch (mood) {
      case "GREETING":
        return "rotate(4 60 40)";
      case "ENCOURAGING":
        return "rotate(-5 60 40)";
      case "CELEBRATING":
        return "translate(0, -3)";
      case "STUDY":
        return "rotate(2 60 42)";
      case "RESTING":
      default:
        return "rotate(0 60 40)";
    }
  };

  const wing = getWingTransforms();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 select-none ${
        mood === "RESTING" ? "animate-velan-breathing" : ""
      } ${isFlapping ? "animate-wing-flutter" : ""} ${className}`}
      role="img"
      aria-label={`Velan the Green Parrot - Mood: ${mood}`}
    >
      <defs>
        {/* Plumage Gradients */}
        <linearGradient id="velanEmerald" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="0.6" stopColor="#059669" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>

        <linearGradient id="velanWing" x1="10" y1="40" x2="60" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="beakCoral" x1="50" y1="40" x2="70" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F43F5E" />
          <stop offset="0.7" stopColor="#E11D48" />
          <stop offset="1" stopColor="#BE123C" />
        </linearGradient>

        <linearGradient id="goldSpectacles" x1="30" y1="30" x2="90" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="palmSash" x1="40" y1="50" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF3C7" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>

        <filter id="velanGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#047857" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Shadow under perch */}
      <ellipse cx="60" cy="112" rx="28" ry="4" fill="#E2E8F0" />

      {/* Perch branch */}
      <rect x="24" y="106" width="72" height="6" rx="3" fill="#78350F" />
      <path d="M48 106L44 112M72 106L76 112" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />

      {/* Claws */}
      <path d="M46 104C46 107 48 108 50 108M52 104C52 107 53 108 54 108" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 104C66 107 68 108 70 108M72 104C72 107 73 108 74 108" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Body & Plumage Container */}
      <g filter="url(#velanGlow)">
        {/* Tail feathers */}
        <path
          d="M56 86C54 98 48 108 44 114C48 112 58 102 60 88C62 102 72 112 76 114C72 108 66 98 64 86Z"
          fill="#047857"
        />

        {/* Main Body */}
        <ellipse cx="60" cy="74" rx="24" ry="28" fill="url(#velanEmerald)" />

        {/* Chest highlight / plumage */}
        <path
          d="M44 68C48 84 56 94 60 94C64 94 72 84 76 68C72 62 48 62 44 68Z"
          fill="#34D399"
          fillOpacity="0.35"
        />

        {/* Palm Leaf Sash (Olaichuvadi) */}
        <path
          d="M42 62C52 68 68 78 76 90L72 92C64 80 48 70 38 64Z"
          fill="url(#palmSash)"
          stroke="#B45309"
          strokeWidth="0.75"
        />
        {/* Palm Leaf lines */}
        <line x1="48" y1="68" x2="52" y2="72" stroke="#78350F" strokeWidth="0.75" />
        <line x1="56" y1="74" x2="60" y2="78" stroke="#78350F" strokeWidth="0.75" />
        <line x1="64" y1="80" x2="68" y2="84" stroke="#78350F" strokeWidth="0.75" />

        {/* Left Wing */}
        <g id="left-wing" transform={wing.left} className="transition-transform duration-200">
          <path
            d="M38 56C28 62 20 78 26 92C32 88 38 80 42 68C44 64 42 58 38 56Z"
            fill="url(#velanWing)"
            stroke="#047857"
            strokeWidth="1"
          />
        </g>

        {/* Right Wing */}
        <g id="right-wing" transform={wing.right} className="transition-transform duration-200">
          <path
            d="M82 56C92 62 100 78 94 92C88 88 82 80 78 68C76 64 78 58 82 56Z"
            fill="url(#velanWing)"
            stroke="#047857"
            strokeWidth="1"
          />
        </g>

        {/* Head Group with dynamic tilt */}
        <g id="head" transform={getHeadTransform()} className="transition-transform duration-300">
          {/* Head base */}
          <circle cx="60" cy="40" r="18" fill="url(#velanEmerald)" />

          {/* Red neck ring (signature rose-ringed parakeet characteristic) */}
          <path
            d="M46 48C52 53 68 53 74 48"
            stroke="#E11D48"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M48 49C54 54 66 54 72 49"
            stroke="#0F172A"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Beak */}
          <path
            d="M54 39C54 34 66 34 66 39C66 45 61 50 60 52C59 50 54 45 54 39Z"
            fill="url(#beakCoral)"
          />
          <path d="M57 39C59 36 61 36 63 39" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

          {/* Eyes */}
          {mood === "RESTING" ? (
            // Relaxed / sleeping eyes
            <g id="eyes">
              <path d="M49 35C51 37 54 37 56 35" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M64 35C66 37 69 37 71 35" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          ) : mood === "CELEBRATING" ? (
            // Joyful smiling curved eyes
            <g id="eyes">
              <path d="M49 36C51 33 54 33 56 36" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M64 36C66 33 69 33 71 36" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            // Open, bright, scholarly eyes
            <g id="eyes">
              <circle cx="52" cy="35" r="4.5" fill="#FFF" />
              <circle cx="52" cy="35" r="2.5" fill="#0F172A" />
              <circle cx="53" cy="34" r="1" fill="#FFF" />

              <circle cx="68" cy="35" r="4.5" fill="#FFF" />
              <circle cx="68" cy="35" r="2.5" fill="#0F172A" />
              <circle cx="69" cy="34" r="1" fill="#FFF" />
            </g>
          )}

          {/* Golden Scholarly Spectacles */}
          <g id="spectacles" className={isFlapping ? "animate-spectacles-bounce" : ""}>
            {/* Left rim */}
            <circle cx="52" cy="35" r="7" stroke="url(#goldSpectacles)" strokeWidth="1.8" fill="rgba(255,255,255,0.15)" />
            {/* Right rim */}
            <circle cx="68" cy="35" r="7" stroke="url(#goldSpectacles)" strokeWidth="1.8" fill="rgba(255,255,255,0.15)" />
            {/* Bridge */}
            <path d="M59 34C60 32 60 32 61 34" stroke="url(#goldSpectacles)" strokeWidth="1.8" fill="none" />
            {/* Glint on spectacles */}
            <line x1="48" y1="31" x2="52" y2="31" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* Feather crest on top of head */}
          <path
            d="M58 23C56 16 50 14 46 16C50 18 54 22 56 25Z"
            fill="#34D399"
          />
          <path
            d="M61 22C61 14 65 11 70 12C66 15 63 19 62 25Z"
            fill="#10B981"
          />
        </g>
      </g>

      {/* Celebration Sparkles (when CELEBRATING) */}
      {mood === "CELEBRATING" && (
        <g id="sparkles" className="animate-pulse">
          <path d="M22 28L25 24L28 28L25 32Z" fill="#F59E0B" />
          <path d="M96 22L98 18L100 22L98 26Z" fill="#F59E0B" />
          <path d="M18 64L20 60L22 64L20 68Z" fill="#10B981" />
          <circle cx="102" cy="52" r="2" fill="#F59E0B" />
        </g>
      )}
    </svg>
  );
};

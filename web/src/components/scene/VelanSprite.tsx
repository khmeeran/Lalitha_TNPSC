"use client";

import React, { useState } from "react";
import { triggerRewardParticles } from "../../utils/particleEngine";

interface VelanSpriteProps {
  size?: number; // 90 to 140px default 100
  className?: string;
  onClick?: () => void;
  isFloating?: boolean;
  isSpeaking?: boolean;
  use3dRender?: boolean;
}

export const VelanSprite: React.FC<VelanSpriteProps> = ({
  size = 100,
  className = "",
  onClick,
  isFloating = true,
  isSpeaking = false,
  use3dRender = true,
}) => {
  const [isFlapping, setIsFlapping] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setIsFlapping(true);
    triggerRewardParticles({
      type: "COIN",
      originX: e.clientX,
      originY: e.clientY,
      count: 10,
    });
    setTimeout(() => setIsFlapping(false), 800);
    onClick?.();
  };

  // If 3D render is enabled and image loads cleanly
  if (use3dRender && !imgError) {
    return (
      <div
        className={`relative inline-flex flex-col items-center select-none cursor-pointer group ${
          isSpeaking ? "scale-105" : isFloating ? "animate-bounce" : ""
        } ${className}`}
        style={{ animationDuration: "2.4s" }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Velan the Wise Mentor Parrot Companion"
      >
        {/* Floating Emerald Aura */}
        <div className="absolute -inset-2 bg-[#2ECC71]/30 rounded-full blur-lg group-hover:bg-[#FFD700]/30 transition-colors" />

        <div
          style={{ width: size, height: size }}
          className="relative z-10 transition-transform duration-200 group-hover:scale-110 active:scale-95"
        >
          <img
            src="/assets/velan_wizard_companion.png"
            alt="Velan the Parrot Companion with tiny wizard hat"
            width={size}
            height={size}
            className="w-full h-full object-contain filter drop-shadow-[0_0_14px_rgba(46,204,113,0.8)]"
            onError={() => setImgError(true)}
          />
        </div>
      </div>
    );
  }

  // Fallback: High-Fantasy Emerald Parrot with tiny purple wizard hat
  return (
    <div
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group ${
        isSpeaking ? "animate-talking-velan scale-105" : isFloating ? "animate-velan-float" : ""
      } ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Velan the Wise Mentor Parrot"
    >
      {/* Floating Feather Aura */}
      <div className="absolute -inset-2 bg-[#2ECC71]/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* SVG Parrot Sprite */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`overflow-visible transition-transform duration-200 group-hover:scale-110 active:scale-95 ${
          isFlapping ? "animate-velan-flap-continuous" : ""
        }`}
      >
        <defs>
          <linearGradient id="velanEmeraldGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#58E293" />
            <stop offset="0.5" stopColor="#2ECC71" />
            <stop offset="1" stopColor="#1E8449" />
          </linearGradient>

          <linearGradient id="velanWizardHatGrad" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8E24AA" />
            <stop offset="0.6" stopColor="#6A0DAD" />
            <stop offset="1" stopColor="#3F0569" />
          </linearGradient>

          <filter id="velanWizardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2ECC71" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter="url(#velanWizardGlow)">
          {/* Tail Feathers */}
          <path
            d="M56 86C54 100 46 112 40 118C46 114 58 102 60 88C62 102 74 114 80 118C74 112 66 100 64 86Z"
            fill="#145A32"
          />

          {/* Main Emerald Body */}
          <ellipse cx="60" cy="72" rx="26" ry="30" fill="url(#velanEmeraldGrad)" />

          {/* Mint Chest Highlight */}
          <path
            d="M44 66C48 84 56 94 60 94C64 94 72 84 76 66C72 60 48 60 44 66Z"
            fill="#D4EFDF"
            fillOpacity="0.55"
          />

          {/* Wings */}
          <path
            d="M36 62C22 68 18 86 28 94C38 100 44 88 44 74Z"
            fill="#27AE60"
            stroke="#1E8449"
            strokeWidth="1.5"
          />
          <path
            d="M84 62C98 68 102 86 92 94C82 100 76 88 76 74Z"
            fill="#27AE60"
            stroke="#1E8449"
            strokeWidth="1.5"
          />

          {/* Golden Palm-Leaf Sash */}
          <path
            d="M40 60C50 66 70 78 80 90L76 93C66 81 46 69 36 63Z"
            fill="#FFF8DC"
            stroke="#B8860B"
            strokeWidth="1"
          />

          {/* Head */}
          <circle cx="60" cy="46" r="18" fill="url(#velanEmeraldGrad)" />

          {/* Beak */}
          <path d="M 52 48 Q 42 54 44 62 Q 52 60 55 54 Z" fill="#E74C3C" stroke="#922B21" strokeWidth="1" />

          {/* Scholarly Golden Glasses */}
          <circle cx="50" cy="44" r="6" stroke="#FFD700" strokeWidth="2" fill="none" />
          <circle cx="64" cy="44" r="6" stroke="#FFD700" strokeWidth="2" fill="none" />
          <line x1="56" y1="44" x2="58" y2="44" stroke="#FFD700" strokeWidth="2" />

          {/* Mischievous Eyes inside spectacles */}
          <circle cx="50" cy="44" r="2.5" fill="#1C2833" />
          <circle cx="64" cy="44" r="2.5" fill="#1C2833" />
          <circle cx="51" cy="43" r="1" fill="#FFFFFF" />
          <circle cx="65" cy="43" r="1" fill="#FFFFFF" />

          {/* =================================================================
              TINY WIZARD HAT FOR VELAN WITH GOLD STAR
              ================================================================= */}
          {/* Hat Brim */}
          <ellipse cx="62" cy="30" rx="18" ry="5" fill="url(#velanWizardHatGrad)" stroke="#FFD700" strokeWidth="1.5" />
          {/* Hat Cone */}
          <path
            d="M 50 29 Q 62 10 74 2 Q 70 16 74 29 Z"
            fill="url(#velanWizardHatGrad)"
            stroke="#FFD700"
            strokeWidth="1.5"
          />
          {/* Tiny Golden Star Charm at Hat Tip */}
          <circle cx="74" cy="2" r="2.5" fill="#FFD700" />
        </g>
      </svg>
    </div>
  );
};

"use client";

import React from "react";
import { Flame, Volume2, VolumeX } from "lucide-react";
import { useLearning } from "../../context/LearningContext";
import { triggerRewardParticles } from "../../utils/particleEngine";
import { playCoinSound, playButtonClick } from "../../utils/soundEffects";

interface KidTopBarProps {
  className?: string;
  onOpenProfile?: () => void;
}

export const KidTopBar: React.FC<KidTopBarProps> = ({
  className = "",
  onOpenProfile,
}) => {
  const { state, toggleAudioNarration } = useLearning();

  const totalCompleted = state.completedNodeIds.length;
  const starsEarned = totalCompleted * 3; // 3 stars per completed adventure
  const totalStarsTarget = 24;

  const handleCoinClick = (e: React.MouseEvent) => {
    playCoinSound();
    triggerRewardParticles({
      type: "COIN",
      originX: e.clientX,
      originY: e.clientY,
      count: 14,
    });
  };

  const handleStarClick = (e: React.MouseEvent) => {
    playButtonClick();
    triggerRewardParticles({
      type: "STAR",
      originX: e.clientX,
      originY: e.clientY,
      count: 14,
    });
  };

  // XP Progress in current level (scale 0-100%)
  const xpPercent = Math.min(100, Math.round(((state.user.currentXp % 500) / 500) * 100));

  return (
    <header
      className={`w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 pb-2 flex items-center justify-between gap-2 sm:gap-4 select-none ${className}`}
      role="banner"
    >
      {/* 1. Level & Avatar Pill */}
      <div
        onClick={onOpenProfile}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 border-2 border-amber-500/50 hover:border-amber-400 cursor-pointer shadow-lg shadow-black/40 transition-transform active:scale-95"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-black text-slate-950 text-sm shadow">
          {state.user.level}
        </div>
        <div className="hidden xs:flex flex-col">
          <span className="text-[11px] font-black text-amber-300 leading-tight">
            Level {state.user.level}
          </span>
          <span className="text-[9px] font-bold text-slate-400 leading-tight">
            VAO Quest
          </span>
        </div>
      </div>

      {/* 2. Middle Stats: Coins 🪙 | Stars ⭐ | Streak 🔥 */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Coins Badge with ComfyUI 3D Rendered Coin */}
        <button
          onClick={handleCoinClick}
          aria-label={`Gold Coins: ${state.user.coins}`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-950/80 border-2 border-amber-400 hover:border-amber-300 shadow-md shadow-amber-900/30 transition-transform active:scale-95 cursor-pointer"
        >
          <img
            src="/assets/ui_gold_coin.png"
            alt="Chola Gold Coin"
            width={24}
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain inline-block drop-shadow animate-coin-spin"
          />
          <span className="text-xs sm:text-sm font-black text-amber-200">
            {state.user.coins}
          </span>
        </button>

        {/* Stars Badge with ComfyUI 3D Rendered Victory Star */}
        <button
          onClick={handleStarClick}
          aria-label={`Stars Earned: ${starsEarned}`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-indigo-950/80 border-2 border-indigo-400 hover:border-indigo-300 shadow-md shadow-indigo-900/30 transition-transform active:scale-95 cursor-pointer"
        >
          <img
            src="/assets/ui_victory_star.png"
            alt="Victory Star"
            width={24}
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain inline-block drop-shadow animate-soft-pulse"
          />
          <span className="text-xs sm:text-sm font-black text-indigo-200">
            {starsEarned}
          </span>
        </button>

        {/* Flaming Streak Badge */}
        <div
          aria-label={`Day ${state.user.streakDays} Streak`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-950/80 border-2 border-orange-500 shadow-md shadow-orange-900/30"
        >
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-torch-flicker" />
          <span className="text-xs sm:text-sm font-black text-orange-200">
            {state.user.streakDays} Days
          </span>
        </div>
      </div>

      {/* 3. Audio Narration Toggle */}
      <button
        onClick={toggleAudioNarration}
        aria-label={state.settings.audioNarrationEnabled ? "Mute audio narration" : "Enable audio narration"}
        className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-transform active:scale-95 shadow-md ${
          state.settings.audioNarrationEnabled
            ? "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-emerald-900/40"
            : "bg-slate-900/90 border-slate-700 text-slate-500"
        }`}
      >
        {state.settings.audioNarrationEnabled ? (
          <Volume2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </button>
    </header>
  );
};

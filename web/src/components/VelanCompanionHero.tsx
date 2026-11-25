import React, { useState } from "react";
import { Sparkles, Lightbulb, RefreshCw, HeartHandshake, Smile, Coffee, BookOpen } from "lucide-react";
import { VelanMascotSvg } from "./VelanMascotSvg";
import { VelanMood } from "../types/dashboard";

interface VelanCompanionHeroProps {
  mood: VelanMood;
  greeting: string;
  tips: string[];
  userName: string;
  className?: string;
  size?: "compact" | "normal" | "large";
}

const moodLabels: Record<VelanMood, { label: string; icon: React.ElementType; color: string }> = {
  GREETING: { label: "Welcoming", icon: Sparkles, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  STUDY: { label: "Focused Study", icon: BookOpen, color: "text-blue-700 bg-blue-50 border-blue-200" },
  CELEBRATING: { label: "Celebrating", icon: Smile, color: "text-amber-700 bg-amber-50 border-amber-200" },
  ENCOURAGING: { label: "Empathetic Guide", icon: HeartHandshake, color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  RESTING: { label: "Resting & Calm", icon: Coffee, color: "text-slate-600 bg-slate-100 border-slate-200" },
};

export const VelanCompanionHero: React.FC<VelanCompanionHeroProps> = ({
  mood,
  greeting,
  tips,
  className = "",
  size = "normal",
}) => {
  const [isFlapping, setIsFlapping] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(-1);
  const [tapCount, setTapCount] = useState(0);

  // Reset to greeting whenever the scenario or greeting prop updates
  React.useEffect(() => {
    setCurrentTipIndex(-1);
  }, [greeting, mood]);

  const handleVelanTap = () => {
    setIsFlapping(true);
    setTapCount((prev) => prev + 1);

    // Cycle to next tip on tap
    if (tips.length > 0) {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }

    setTimeout(() => {
      setIsFlapping(false);
    }, 400);
  };

  const activeText = currentTipIndex >= 0 ? tips[currentTipIndex] : greeting;
  const isShowingTip = currentTipIndex >= 0;

  const mascotSize = size === "compact" ? 76 : size === "large" ? 110 : 88;
  const currentMoodInfo = moodLabels[mood] || moodLabels.GREETING;
  const MoodIcon = currentMoodInfo.icon;

  return (
    <section className={`relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-xs transition-all ${className}`}>
      {/* Interactive Mascot Container */}
      <div
        onClick={handleVelanTap}
        data-testid="interactive-velan-mascot"
        className="relative shrink-0 cursor-pointer group select-none transition-transform active:scale-95"
        title="Tap Velan for study tips & motivation!"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleVelanTap();
          }
        }}
        aria-label="Interactive Velan Mascot. Tap for study insights."
      >
        <div className="relative">
          <VelanMascotSvg
            mood={mood}
            isFlapping={isFlapping}
            size={mascotSize}
            className="drop-shadow-sm group-hover:scale-105 transition-transform"
          />

          {/* Floating Tap Hint Pill */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-emerald-600/90 text-[9px] font-bold text-white tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xs">
            TAP ME
          </div>
        </div>
      </div>

      {/* Speech Balloon */}
      <div className="flex-1 relative min-w-0">
        <div className="relative p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed shadow-2xs">
          {/* Pointer tail pointing to Velan */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-slate-200" />
          <div className="absolute top-1/2 -left-[7px] -translate-y-1/2 w-0 h-0 border-t-7 border-t-transparent border-b-7 border-b-transparent border-r-7 border-r-slate-50" />

          {/* Header row in speech balloon */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider truncate">
                {isShowingTip ? "Velan's Exam Tip" : "Velan"}
              </span>
              {/* Mood Badge */}
              <span
                data-testid="velan-mood-badge"
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md border flex items-center gap-1 shrink-0 ${currentMoodInfo.color}`}
              >
                <MoodIcon className="w-2.5 h-2.5" />
                <span>{currentMoodInfo.label}</span>
              </span>
            </div>

            {/* Quick Tip Cycler button */}
            <button
              onClick={handleVelanTap}
              data-testid="velan-tip-cycler-btn"
              className="text-[10px] text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-200/50"
              title="Next study tip"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isFlapping ? "animate-spin" : ""}`} />
              <span>{isShowingTip ? "Next Tip" : "Tip"}</span>
            </button>
          </div>

          {/* Dialogue Text */}
          <p
            data-testid="velan-dialogue-text"
            className="text-slate-700 font-medium line-clamp-3 sm:line-clamp-none transition-all"
          >
            {activeText}
          </p>
        </div>
      </div>
    </section>
  );
};

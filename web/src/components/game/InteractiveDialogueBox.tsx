"use client";

import React, { useState } from "react";
import { LalithaAvatar } from "../mascot/LalithaAvatar";
import { ChevronRight, Sparkles, Volume2 } from "lucide-react";
import { speakNarration } from "../../utils/speechSynthesis";
import { useLearning } from "../../context/LearningContext";

export interface DialogueChoice {
  textTa: string;
  textEn: string;
  action: () => void;
  xpReward?: number;
}

interface InteractiveDialogueBoxProps {
  speaker: "VELAN" | "LALITHA";
  textTa: string;
  textEn: string;
  contextTag?: string;
  choices?: DialogueChoice[];
  onContinue?: () => void;
  className?: string;
}

export const InteractiveDialogueBox: React.FC<InteractiveDialogueBoxProps> = ({
  speaker,
  textTa,
  textEn,
  contextTag = "Historical Lore",
  choices = [],
  onContinue,
  className = "",
}) => {
  const { state } = useLearning();
  const [hasSpoken, setHasSpoken] = useState(false);

  const handleSpeak = () => {
    speakNarration(`${textTa}. ${textEn}`, { speaker });
    setHasSpoken(true);
  };

  return (
    <div
      data-testid="interactive-dialogue-box"
      className={`relative w-full bg-slate-900/95 border-2 border-amber-600/50 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200 ${className}`}
      role="region"
      aria-label="Character Dialogue Box"
    >
      {/* Decorative Golden Corner Flourishes */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

      {/* Speaker Tag & Audio Trigger */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-800/30">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {contextTag}
          </span>
          <span className="text-xs font-bold text-slate-300">
            {speaker === "VELAN" ? "🦜 Mentor Velan" : "🎒 Lalitha"}
          </span>
        </div>

        <button
          onClick={handleSpeak}
          className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/40 text-amber-300 text-xs flex items-center gap-1 transition-colors"
          title="Listen in Tamil"
          aria-label="Narrate dialogue"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-bold">Listen</span>
        </button>
      </div>

      <div className="flex gap-4 items-start">
        {/* Speaker Portrait */}
        <div className="shrink-0">
          {speaker === "VELAN" ? (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 border-2 border-emerald-500/60 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950/50">
              🦜
            </div>
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-900 to-slate-900 border-2 border-amber-500/60 overflow-hidden flex items-center justify-center p-1">
              <LalithaAvatar mood="CURIOUS_EXPLORER" size="sm" />
            </div>
          )}
        </div>

        {/* Dialogue Speech Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-semibold text-amber-100 leading-relaxed">
            {textTa}
          </p>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 italic font-serif">
            {textEn}
          </p>

          {/* Interactive Player Choices */}
          {choices.length > 0 ? (
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-4 pt-3 border-t border-amber-800/30">
              {choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={choice.action}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/50 text-amber-200 text-xs font-bold transition-all active:scale-95 text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  <div>
                    <div>{choice.textTa}</div>
                    <div className="text-[10px] opacity-75">{choice.textEn}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : onContinue ? (
            <div className="mt-3 flex justify-end">
              <button
                onClick={onContinue}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
              >
                <span>Continue ›</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

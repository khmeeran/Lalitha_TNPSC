"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, ArrowRight, ChevronDown } from "lucide-react";
import { speakNarration, stopNarration } from "../../utils/speechSynthesis";
import { playBubblePop, playTypewriterTick, playButtonClick } from "../../utils/soundEffects";
import { triggerRewardParticles } from "../../utils/particleEngine";

export type SpeakerType = "VELAN" | "LALITHA";

export interface SpeechOption {
  labelTa: string;
  labelEn: string;
  onClick: () => void;
}

interface ComicSpeechBubbleProps {
  speaker: SpeakerType;
  textTa: string;
  textEn?: string;
  options?: SpeechOption[];
  className?: string;
  autoPlayAudio?: boolean;
  autoAdvanceDelay?: number; // In ms, auto advances after speech finishes
  onAdvance?: () => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export const ComicSpeechBubble: React.FC<ComicSpeechBubbleProps> = ({
  speaker,
  textTa,
  textEn,
  options = [],
  className = "",
  autoPlayAudio = false,
  autoAdvanceDelay,
  onAdvance,
  onSpeakingChange,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const prevTextRef = useRef<string>("");
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isVelan = speaker === "VELAN";

  // Typewriter effect + Bubble Pop sound on new text
  useEffect(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    if (prevTextRef.current !== textTa) {
      playBubblePop();
      prevTextRef.current = textTa;
    }

    setDisplayedText("");
    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setDisplayedText(textTa.slice(0, index));
      playTypewriterTick();

      if (index >= textTa.length) {
        setIsTyping(false);
        clearInterval(interval);

        // Auto-play narration if enabled
        if (autoPlayAudio) {
          triggerSpeech();
        } else if (autoAdvanceDelay && onAdvance) {
          autoAdvanceTimerRef.current = setTimeout(() => {
            onAdvance();
          }, autoAdvanceDelay);
        }
      }
    }, 24);

    return () => clearInterval(interval);
  }, [textTa, autoPlayAudio, autoAdvanceDelay]);

  // Clean up narration and timers on unmount
  useEffect(() => {
    return () => {
      stopNarration();
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      onSpeakingChange?.(false);
    };
  }, [onSpeakingChange]);

  const triggerSpeech = () => {
    setIsSpeaking(true);
    onSpeakingChange?.(true);

    speakNarration(textTa, {
      speaker,
      onEnd: () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
        if (autoAdvanceDelay && onAdvance) {
          autoAdvanceTimerRef.current = setTimeout(() => {
            onAdvance();
          }, autoAdvanceDelay);
        }
      },
      onError: () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      },
    });
  };

  const handleListenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playButtonClick();

    if (isSpeaking) {
      stopNarration();
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    } else {
      triggerSpeech();
    }
  };

  // Click bubble handler: skip typing if typing, or advance if finished
  const handleBubbleClick = () => {
    if (isTyping) {
      setDisplayedText(textTa);
      setIsTyping(false);
    } else if (onAdvance && options.length === 0) {
      playButtonClick();
      onAdvance();
    }
  };

  return (
    <div
      className={`relative z-30 max-w-xl w-full animate-comic-pop select-none cursor-pointer ${className}`}
      role="region"
      aria-label={`Comic dialogue from ${isVelan ? "Velan the Parrot" : "Lalitha"}`}
      onClick={handleBubbleClick}
    >
      {/* Comic Speech Bubble Container */}
      <div
        className={`relative p-3.5 sm:p-4 rounded-3xl shadow-2xl border-3 sm:border-4 transition-all duration-300 ${
          isVelan
            ? "bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950/90 border-emerald-400 text-emerald-50 shadow-emerald-900/50"
            : "bg-gradient-to-br from-amber-950 via-slate-950 to-amber-950/90 border-amber-400 text-amber-50 shadow-amber-900/50"
        } ${isSpeaking ? (isVelan ? "ring-4 ring-emerald-400/40" : "ring-4 ring-amber-400/40") : ""}`}
      >
        {/* Comic Tail Pointer — Dynamically points to active speaker */}
        <div
          className={`absolute -bottom-3 w-6 h-6 rotate-45 border-r-3 sm:border-r-4 border-b-3 sm:border-b-4 z-10 transition-all duration-300 ${
            isVelan
              ? "right-16 bg-slate-950 border-emerald-400"
              : "left-16 bg-slate-950 border-amber-400"
          }`}
        />

        {/* Top Header Strip: Speaker Badge + Equalizer / Listen Voice Button */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {/* Speaker Badge with Speaking Wave / Lip-Sync Pulse */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase border flex items-center gap-1.5 shadow-sm transition-transform ${
                isVelan
                  ? "bg-emerald-500 text-slate-950 border-emerald-300"
                  : "bg-amber-500 text-slate-950 border-amber-300"
              } ${isSpeaking ? "scale-105" : ""}`}
            >
              <span>{isVelan ? "🦜 Velan" : "🎒 Lalitha"}</span>
            </span>

            {/* Speaking State Pulsing Chip with Mouth/Speech Indicator */}
            {isSpeaking && (
              <span className="hidden xs:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/15 text-white animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Speaking...</span>
              </span>
            )}
          </div>

          {/* 🔊 Voice Audio Control Button with Live Soundwave Equalizer */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleListenToggle}
              aria-label={isSpeaking ? "Stop voice narration" : "Listen to dialogue voice in Tamil"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer ${
                isSpeaking
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40"
                  : isVelan
                  ? "bg-emerald-400/20 hover:bg-emerald-400/35 text-emerald-300 border border-emerald-400/60 shadow-emerald-950/40"
                  : "bg-amber-400/20 hover:bg-amber-400/35 text-amber-300 border border-amber-400/60 shadow-amber-950/40"
              }`}
            >
              {isSpeaking ? (
                <>
                  {/* Dynamic Soundwave Equalizer Bars */}
                  <div className="flex items-end gap-0.5 h-3.5 px-0.5" aria-hidden="true">
                    <span className="w-1 bg-white rounded-full animate-wave-bar-1" />
                    <span className="w-1 bg-white rounded-full animate-wave-bar-2" />
                    <span className="w-1 bg-white rounded-full animate-wave-bar-3" />
                    <span className="w-1 bg-white rounded-full animate-wave-bar-4" />
                  </div>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>🔊 Listen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dialogue Body: Strictly Max 2 Lines — Show, Don't Tell */}
        <div className="my-1.5 cursor-pointer" title={isTyping ? "Click to skip typing" : "Click to continue"}>
          <p className="text-base sm:text-lg md:text-xl font-black leading-snug tracking-tight text-white drop-shadow-sm line-clamp-2">
            {displayedText}
            {isTyping && (
              <span
                className={`inline-block w-2 h-4 ml-1 rounded-xs animate-pulse align-middle ${
                  isVelan ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
            )}
          </p>
          {textEn && (
            <p className="text-xs sm:text-sm font-semibold opacity-85 mt-1 italic line-clamp-1 text-slate-300">
              "{textEn}"
            </p>
          )}
        </div>

        {/* Quick Decision Action Buttons or Tap to Continue Indicator */}
        {options.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-white/10">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  playButtonClick();
                  triggerRewardParticles({
                    type: "STAR",
                    originX: e.clientX,
                    originY: e.clientY,
                    count: 8,
                  });
                  opt.onClick();
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer ${
                  isVelan
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30"
                }`}
              >
                <span>{opt.labelTa}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        ) : onAdvance && !isTyping ? (
          <div className="flex items-center justify-end gap-1 mt-1 text-[11px] font-bold text-amber-300/80 animate-bounce">
            <span>Tap to continue ›</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

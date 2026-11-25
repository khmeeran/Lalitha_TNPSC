"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { CharacterSpeaker, speakSmartNarration, stopNarration } from "../../utils/speechSynthesis";
import { playButtonClick } from "../../utils/soundEffects";

export interface AudioSpeakButtonProps {
  textEn?: string;
  textTa?: string;
  tamilClipKey?: string;
  speaker?: CharacterSpeaker;
  /** Force Tamil voice regardless of current global UI language */
  forceTamil?: boolean;
  labelEn?: string;
  labelTa?: string;
  stopLabelEn?: string;
  stopLabelTa?: string;
  size?: "xs" | "sm" | "icon";
  variant?: "gold" | "purple" | "emerald" | "light" | "dark";
  className?: string;
  ariaLabel?: string;
}

const VARIANT_CLASSES: Record<NonNullable<AudioSpeakButtonProps["variant"]>, string> = {
  gold: "bg-[#FFD700]/20 hover:bg-[#FFD700]/30 border-[#FFD700]/60 text-[#FFD700]",
  purple: "bg-[#6A0DAD] hover:bg-[#7e19c9] border-[#FFD700]/50 text-[#FFF8DC]",
  emerald: "bg-emerald-950/80 hover:bg-emerald-900/80 border-emerald-400/60 text-emerald-300",
  light: "bg-amber-100/90 hover:bg-amber-200 border-amber-700/40 text-amber-950",
  dark: "bg-slate-900/90 hover:bg-slate-800 border-amber-600/50 text-amber-200",
};

export const AudioSpeakButton: React.FC<AudioSpeakButtonProps> = ({
  textEn,
  textTa,
  tamilClipKey,
  speaker = "VELAN",
  forceTamil,
  labelEn = "Listen",
  labelTa = "கேட்க",
  stopLabelEn = "Stop",
  stopLabelTa = "நிறுத்து",
  size = "xs",
  variant = "gold",
  className = "",
  ariaLabel,
}) => {
  const { isTamil } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = React.useRef(false);
  isSpeakingRef.current = isSpeaking;

  const useTamilAudio = forceTamil !== undefined ? forceTamil : isTamil;

  useEffect(() => {
    return () => {
      if (isSpeakingRef.current) {
        stopNarration();
      }
    };
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playButtonClick();

    if (isSpeaking) {
      stopNarration();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speakSmartNarration({
      textEn,
      textTa,
      isTamil,
      preferTamil: forceTamil,
      tamilClipKey,
      speaker,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const sizeClass =
    size === "icon"
      ? "p-1.5 rounded-full"
      : size === "sm"
      ? "px-3 py-1 rounded-full text-xs"
      : "px-2 py-0.5 rounded-full text-xs";

  const activeText = isSpeaking
    ? useTamilAudio
      ? stopLabelTa
      : stopLabelEn
    : useTamilAudio
    ? labelTa
    : labelEn;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={ariaLabel || (isSpeaking ? "Stop voice narration" : useTamilAudio ? "Listen in Tamil" : "Listen")}
      title={isSpeaking ? "Stop voice narration" : useTamilAudio ? "தமிழில் கேட்க (Listen in Tamil)" : "Listen"}
      className={`inline-flex items-center gap-1 border font-ui font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 shadow-sm shrink-0 ${sizeClass} ${
        isSpeaking
          ? "bg-rose-600 border-rose-300 text-white ring-1 ring-rose-300/60"
          : VARIANT_CLASSES[variant]
      } ${className}`}
    >
      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 shrink-0" /> : <Volume2 className="w-3.5 h-3.5 shrink-0" />}
      {size !== "icon" && <span>{activeText}</span>}
    </button>
  );
};

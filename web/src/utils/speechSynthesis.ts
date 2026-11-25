// TNPSC Quest - Browser-Native Audio Narration Utility
// Uses the Web Speech API (window.speechSynthesis) with character voice profiles,
// graceful fallback, and zero paid dependencies.

import { playVoiceStartChirp } from "./soundEffects";

export type CharacterSpeaker = "VELAN" | "LALITHA";

export interface SpeechOptions {
  speaker?: CharacterSpeaker;
  rate?: number;
  pitch?: number;
  lang?: string;
  playChirp?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Remove markdown symbols and UI emojis before speaking so TTS reads cleanly.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\[|\]/g, "") // strip markdown brackets
    .replace(/[*_#`~]/g, "") // strip markdown styling
    // Remove common UI emojis so speech doesn't awkwardly pronounce them
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "")
    .trim();
}

/**
 * Find the optimal voice for Tamil or Indian English based on browser voice catalogue.
 */
function pickBestVoice(targetLang: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Direct match for exact locale (e.g. "ta-IN")
  const exactMatch = voices.find((v) => v.lang === targetLang);
  if (exactMatch) return exactMatch;

  // 2. Language prefix match (e.g. starts with "ta")
  const langPrefix = targetLang.split("-")[0];
  const langMatch = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix.toLowerCase()));
  if (langMatch) return langMatch;

  // 3. Indian English fallback ("en-IN") for natural Indian accent pronunciation
  const indianEn = voices.find((v) => v.lang === "en-IN");
  if (indianEn) return indianEn;

  // 4. Default system voice
  const defaultVoice = voices.find((v) => v.default);
  return defaultVoice || voices[0] || null;
}

export function speakNarration(text: string, options: SpeechOptions = {}): boolean {
  if (!isSpeechSynthesisSupported()) {
    console.warn("SpeechSynthesis not supported on this browser.");
    options.onError?.(new Error("SpeechSynthesis not supported"));
    return false;
  }

  try {
    // Cancel any previous utterance
    window.speechSynthesis.cancel();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) {
      options.onEnd?.();
      return true;
    }

    if (options.playChirp !== false) {
      playVoiceStartChirp();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Apply Character Persona Vocal Profiles
    const speaker = options.speaker || "VELAN";
    if (speaker === "VELAN") {
      // Wise mentor parrot: slightly animated pitch with measured, clear teaching cadence
      utterance.pitch = options.pitch ?? 1.25;
      utterance.rate = options.rate ?? 0.95;
    } else {
      // Lalitha: Bright, curious young student cadence
      utterance.pitch = options.pitch ?? 1.15;
      utterance.rate = options.rate ?? 1.05;
    }

    // Determine target language (Tamil if script detected, else en-IN)
    const hasTamil = /[\u0B80-\u0BFF]/.test(cleanText);
    const targetLang = options.lang || (hasTamil ? "ta-IN" : "en-IN");
    utterance.lang = targetLang;

    // Pick best matching voice
    const voice = pickBestVoice(targetLang);
    if (voice) {
      utterance.voice = voice;
    }

    // Event hooks
    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      // Ignore interruption/cancel errors
      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.warn("Speech utterance error:", e.error);
        options.onError?.(e);
      } else {
        options.onEnd?.();
      }
    };

    if (options.onBoundary) {
      utterance.onboundary = (e) => options.onBoundary?.(e);
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("Audio narration playback error:", err);
    options.onError?.(err);
    return false;
  }
}

export function stopNarration(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignored
    }
  }
}

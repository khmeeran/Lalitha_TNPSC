// TNPSC Quest - Smart Hybrid Bilingual Audio Narration Engine
// Combines studio-generated Tamil MP3 clips (gTTS/offline-cached) with
// browser-native Web Speech API (ta-IN / en-IN) and zero paid cloud runtime APIs.

import { getTamilClipUrl } from "../data/tamilAudioManifest";
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

export interface SmartSpeechParams extends SpeechOptions {
  textEn?: string;
  textTa?: string;
  isTamil?: boolean;
  preferTamil?: boolean;
  tamilClipKey?: string;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesListenerAttached = false;
let activeAudioEl: HTMLAudioElement | null = null;
let currentPlaybackToken = 0;
let activeEndNotifier: (() => void) | null = null;

function ensureVoicesLoaded(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];

  if (!voicesListenerAttached) {
    voicesListenerAttached = true;
    try {
      window.speechSynthesis.addEventListener?.("voiceschanged", () => {
        cachedVoices = window.speechSynthesis.getVoices() || [];
      });
    } catch {
      // Ignore Safari listener quirks
    }
  }

  const fresh = window.speechSynthesis.getVoices();
  if (fresh && fresh.length > 0) {
    cachedVoices = fresh;
  }
  return cachedVoices;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Remove markdown symbols and UI emojis before speaking so TTS reads cleanly.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\[|\]/g, "")
    .replace(/[*_#`~]/g, "")
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasTamilScript(text?: string | null): boolean {
  return Boolean(text && /[\u0B80-\u0BFF]/.test(text));
}

/**
 * Find the optimal matching voice strictly for the requested language family.
 * Avoids forcing an English voice object onto a ta-IN utterance on Android/iOS.
 */
function pickBestVoice(targetLang: string): SpeechSynthesisVoice | null {
  const voices = ensureVoicesLoaded();
  if (!voices || voices.length === 0) return null;

  const targetLower = targetLang.toLowerCase();
  const langPrefix = targetLower.split("-")[0];

  // Filter voices matching this exact language family (e.g. "ta" or "en")
  const familyVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
  if (familyVoices.length === 0) {
    return null;
  }

  // Prefer exact locale match (e.g. ta-IN / en-IN)
  const exactMatches = familyVoices.filter((v) => v.lang.toLowerCase().replace("_", "-") === targetLower);
  const pool = exactMatches.length > 0 ? exactMatches : familyVoices;

  // Prefer natural/Google/Microsoft voices first
  const preferred = pool.find((v) => /google|natural|valluvar|pallavi|microsoft|apple|siri/i.test(v.name));
  return preferred || pool[0] || null;
}

function stopActiveAudioElement(): void {
  if (activeAudioEl) {
    try {
      activeAudioEl.pause();
      activeAudioEl.currentTime = 0;
      activeAudioEl.src = "";
    } catch {
      // Ignore cleanup errors
    }
    activeAudioEl = null;
  }
}

export function stopNarration(): void {
  currentPlaybackToken += 1;
  stopActiveAudioElement();

  if (activeEndNotifier) {
    const notify = activeEndNotifier;
    activeEndNotifier = null;
    notify();
  }

  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignored
    }
  }
}

export function speakNarration(text: string, options: SpeechOptions = {}): boolean {
  stopNarration();
  const token = currentPlaybackToken;

  if (!isSpeechSynthesisSupported()) {
    console.warn("SpeechSynthesis not supported on this browser.");
    options.onError?.(new Error("SpeechSynthesis not supported"));
    return false;
  }

  try {
    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) {
      options.onEnd?.();
      return true;
    }

    if (options.playChirp !== false) {
      playVoiceStartChirp();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const speaker = options.speaker || "VELAN";
    const isTamilUtterance = options.lang?.toLowerCase().startsWith("ta") || hasTamilScript(cleanText);

    if (speaker === "VELAN") {
      utterance.pitch = options.pitch ?? (isTamilUtterance ? 1.05 : 1.25);
      utterance.rate = options.rate ?? (isTamilUtterance ? 0.96 : 0.95);
    } else {
      utterance.pitch = options.pitch ?? 1.12;
      utterance.rate = options.rate ?? 1.0;
    }

    const targetLang = options.lang || (isTamilUtterance ? "ta-IN" : "en-IN");
    utterance.lang = targetLang;

    const voice = pickBestVoice(targetLang);
    if (voice) {
      utterance.voice = voice;
    }

    activeEndNotifier = () => {
      options.onEnd?.();
    };

    utterance.onstart = () => {
      if (token === currentPlaybackToken) {
        options.onStart?.();
      }
    };

    utterance.onend = () => {
      if (token === currentPlaybackToken) {
        activeEndNotifier = null;
        options.onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      if (token !== currentPlaybackToken) return;
      activeEndNotifier = null;
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
    activeEndNotifier = null;
    options.onError?.(err);
    return false;
  }
}

/**
 * Smart Hybrid Audio Playback:
 * - In Tamil mode (or when preferTamil is true):
 *   1) If a studio pre-rendered Tamil MP3 exists for tamilClipKey, play it cleanly via <audio>.
 *   2) If MP3 playback fails (or no static clip exists), speak textTa in ta-IN via Web Speech API.
 *   3) If Tamil text doesn't exist yet for an item, gracefully speak textEn in en-IN.
 * - In English mode: speaks textEn in en-IN.
 */
export function speakSmartNarration(params: SmartSpeechParams): boolean {
  const {
    textEn = "",
    textTa = "",
    isTamil = false,
    preferTamil,
    tamilClipKey,
    ...speechOptions
  } = params;

  const wantTamil = preferTamil !== undefined ? preferTamil : isTamil;
  const cleanTa = textTa.trim();
  const cleanEn = textEn.trim();

  if (wantTamil) {
    const clipUrl = getTamilClipUrl(tamilClipKey);
    if (clipUrl && typeof window !== "undefined") {
      stopNarration();
      const token = currentPlaybackToken;

      if (speechOptions.playChirp !== false) {
        playVoiceStartChirp();
      }

      try {
        const audio = new Audio(clipUrl);
        activeAudioEl = audio;
        activeEndNotifier = () => {
          speechOptions.onEnd?.();
        };

        audio.onplay = () => {
          if (token === currentPlaybackToken) {
            speechOptions.onStart?.();
          }
        };

        audio.onended = () => {
          if (token === currentPlaybackToken) {
            activeAudioEl = null;
            activeEndNotifier = null;
            speechOptions.onEnd?.();
          }
        };

        audio.onerror = () => {
          if (token !== currentPlaybackToken) return;
          activeAudioEl = null;
          activeEndNotifier = null;
          const fallback = cleanTa || cleanEn;
          speakNarration(fallback, {
            ...speechOptions,
            lang: hasTamilScript(fallback) ? "ta-IN" : "en-IN",
          });
        };

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            if (token !== currentPlaybackToken) return;
            activeAudioEl = null;
            activeEndNotifier = null;
            const fallback = cleanTa || cleanEn;
            speakNarration(fallback, {
              ...speechOptions,
              lang: hasTamilScript(fallback) ? "ta-IN" : "en-IN",
            });
          });
        }
        return true;
      } catch {
        // Fallback to Web Speech below
      }
    }

    if (cleanTa && hasTamilScript(cleanTa)) {
      return speakNarration(cleanTa, { ...speechOptions, lang: "ta-IN" });
    }
  }

  const chosen = cleanEn || cleanTa;
  const chosenLang = hasTamilScript(chosen) ? "ta-IN" : speechOptions.lang || "en-IN";
  return speakNarration(chosen, { ...speechOptions, lang: chosenLang });
}

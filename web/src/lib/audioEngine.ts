"use client";

import { Howl, Howler } from "howler";

/**
 * =========================================================================
 * TNPSC WIZARD PEDAGOGICAL AUDIO & HAPTIC ENGINE (PHASE 3)
 * Core Principle: "Every sound and vibration must serve a cognitive purpose.
 * If it doesn't aid memory encoding or error signaling, DELETE IT."
 * =========================================================================
 */

export type CognitiveEventType =
  | "RETRIEVAL_FOCUS"
  | "CORRECT_RECALL"
  | "DISTRACTOR_TRAP"
  | "CURSE_DISPELLED"
  | "BOSS_METRONOME_TICK"
  | "STREAK_MOMENTUM";

export interface AudioEngineSettings {
  masterMuted: boolean;
  reducedSound: boolean;
  hapticsEnabled: boolean;
  volume: number;
}

class PedagogicalAudioEngine {
  private static instance: PedagogicalAudioEngine;
  private audioCtx: AudioContext | null = null;
  private focusDroneOsc: OscillatorNode | null = null;
  private focusDroneGain: GainNode | null = null;
  private isFocusDroneActive = false;

  private settings: AudioEngineSettings = {
    masterMuted: false,
    reducedSound: false,
    hapticsEnabled: true,
    volume: 0.85,
  };

  private constructor() {
    if (typeof window !== "undefined") {
      // Load saved settings if any
      const savedMute = localStorage.getItem("tnpsc_wizard_audio_muted");
      if (savedMute) this.settings.masterMuted = savedMute === "true";

      const savedReduced = localStorage.getItem("tnpsc_wizard_reduced_sound");
      if (savedReduced) this.settings.reducedSound = savedReduced === "true";

      // Initialize Howler global volume
      Howler.volume(this.settings.volume);
    }
  }

  public static getInstance(): PedagogicalAudioEngine {
    if (!PedagogicalAudioEngine.instance) {
      PedagogicalAudioEngine.instance = new PedagogicalAudioEngine();
    }
    return PedagogicalAudioEngine.instance;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // =========================================================================
  // 1. MOBILE HAPTIC FEEDBACK (navigator.vibrate)
  // =========================================================================
  public triggerHaptic(pattern: number | number[]): void {
    if (typeof window === "undefined") return;
    if (!this.settings.hapticsEnabled) return;

    // Avoid Chrome intervention error if user activation has not occurred yet
    const userActivation = (navigator as { userActivation?: { hasBeenActive?: boolean } }).userActivation;
    if (userActivation && !userActivation.hasBeenActive) return;

    // Check if device supports navigator.vibrate
    if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Silently fail on permission restrictions
      }
    }
  }

  // =========================================================================
  // 2. PEDAGOGICAL SOUND MAPPINGS (Exact Frequencies & Cognitive Harmonics)
  // =========================================================================

  /**
   * Event 1: Retrieval Attempt (Focus Mode Active)
   * Visual: Focus Mode Active
   * Audio: Near-silence subtle 40Hz focus drone (gamma wave concentration stimulation)
   * Haptic: None (Zero distraction during memory retrieval)
   */
  public startRetrievalFocusDrone(): void {
    if (this.settings.masterMuted) return;
    if (this.isFocusDroneActive) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // 40Hz pure sine wave (gamma concentration frequency)
      osc.type = "sine";
      osc.frequency.setValueAtTime(40, ctx.currentTime);

      // Low-pass filter to ensure soft non-intrusive ambient presence
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(100, ctx.currentTime);

      // Ultra-gentle volume (0.04 master)
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.focusDroneOsc = osc;
      this.focusDroneGain = gain;
      this.isFocusDroneActive = true;
    } catch (e) {
      console.warn("Could not start focus drone", e);
    }
  }

  public stopRetrievalFocusDrone(): void {
    if (!this.isFocusDroneActive || !this.focusDroneGain || !this.focusDroneOsc) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.focusDroneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      const osc = this.focusDroneOsc;
      setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      }, 350);
      this.isFocusDroneActive = false;
      this.focusDroneOsc = null;
      this.focusDroneGain = null;
    } catch (e) {}
  }

  /**
   * Event 2: Correct Recall (Memory Schema Consolidation)
   * Visual: Emerald glow + XP popup
   * Audio: Ascending D5 (587.33Hz) -> A5 (880.00Hz) major fifth interval
   * Haptic: Crisp 30ms single pulse
   */
  public playCorrectRecall(): void {
    this.stopRetrievalFocusDrone();
    this.triggerHaptic(30);

    if (this.settings.masterMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Primary Oscillator: Ascending D5 -> A5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.14); // A5

      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      // Shimmer Overtone: D6 (1174.66Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1174.66, now + 0.08);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.12, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.45);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn("Audio synthesis error", e);
    }
  }

  /**
   * Event 3: Distractor Trap (Cognitive Error Signal)
   * Visual: Red vignette + Post-Mortem Modal
   * Audio: Minor 2nd dissonance (D4: 293.66Hz + Eb4: 311.13Hz) resolving to Minor 3rd (F4: 349.23Hz)
   * Haptic: Double 50ms buzz (alerting without frustration)
   */
  public playDistractorTrap(): void {
    this.stopRetrievalFocusDrone();
    this.triggerHaptic([50, 40, 50]);

    if (this.settings.masterMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Voice 1: Root Tone (D4: 293.66Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(293.66, now);

      // Voice 2: Clash Tone (Minor 2nd Eb4: 311.13Hz resolving to F4: 349.23Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(311.13, now); // Eb4 (harsh clash)
      osc2.frequency.exponentialRampToValueAtTime(349.23, now + 0.18); // F4 (minor resolution)

      // Warm low-pass filter to avoid abrasive clicks
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.45);

      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      gain2.gain.setValueAtTime(0.18, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.45);
      osc2.start(now);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn("Audio synthesis error", e);
    }
  }

  /**
   * Event 4: Curse Dispelled (Schema Mastery & Topic Purification)
   * Visual: Skull icon dispelled / shattered
   * Audio: Harmonious Tibetan temple bell chime (528Hz Solfeggio with rich resonant shimmering release)
   * Haptic: Medium 80ms satisfying release pulse
   */
  public playCurseDispelled(): void {
    this.stopRetrievalFocusDrone();
    this.triggerHaptic(80);

    if (this.settings.masterMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const fundamental = 528.0; // 528 Hz Transformation / Repair Solfeggio frequency

      // 3 Harmonic bell partials
      const partials = [1, 2.02, 3.01, 4.15];
      const gains = [0.22, 0.12, 0.08, 0.04];

      partials.forEach((mult, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(fundamental * mult, now);

        gain.gain.setValueAtTime(gains[idx], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.6);
      });
    } catch (e) {
      console.warn("Audio synthesis error", e);
    }
  }

  /**
   * Event 5: Boss Multi-Step Metronome Tick (Forces Deliberate Pacing)
   * Visual: G1 Multi-Statement Matrix
   * Audio: Precision woodblock tick (forces slow reading)
   * Haptic: Subtle 15ms tick
   */
  public playMetronomeTick(): void {
    this.triggerHaptic(15);
    if (this.settings.masterMuted || this.settings.reducedSound) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.035);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  /**
   * UI Micro-Interaction Click
   */
  public playButtonClick(): void {
    this.playMetronomeTick();
  }

  /**
   * Event 6: Streak Momentum (3+ Consecutive Correct Recalls)
   * Visual: Golden aura around characters
   * Audio: Orchestral swell + timpani resonance
   * Haptic: Triple 20ms rapid pulses [20, 20, 20, 20, 20]
   */
  public playStreakMomentum(): void {
    this.stopRetrievalFocusDrone();
    this.triggerHaptic([20, 20, 20, 20, 20]);

    if (this.settings.masterMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Timpani Low Resonance (110Hz -> 65Hz)
      const timpani = ctx.createOscillator();
      const timpaniGain = ctx.createGain();
      timpani.type = "sine";
      timpani.frequency.setValueAtTime(120, now);
      timpani.frequency.exponentialRampToValueAtTime(65, now + 0.35);

      timpaniGain.gain.setValueAtTime(0.35, now);
      timpaniGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      timpani.connect(timpaniGain);
      timpaniGain.connect(ctx.destination);

      timpani.start(now);
      timpani.stop(now + 0.55);

      // Brass Orchestral Swell Chord (D4 + F#4 + A4 + D5)
      const chord = [293.66, 369.99, 440.0, 587.33];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + 0.05);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + 0.05);
        osc.stop(now + 0.75);
      });
    } catch (e) {
      console.warn("Audio synthesis error", e);
    }
  }

  // =========================================================================
  // 3. VOLUME DUCKING & ACCESSIBILITY SETTINGS
  // =========================================================================

  /**
   * When Velan narrates or speaks, duck background ambience/drone to 20%
   */
  public duckAudio(isSpeaking: boolean): void {
    if (this.focusDroneGain && this.isFocusDroneActive) {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const targetGain = isSpeaking ? 0.008 : 0.04;
      this.focusDroneGain.gain.exponentialRampToValueAtTime(targetGain, ctx.currentTime + 0.2);
    }
    Howler.volume(isSpeaking ? this.settings.volume * 0.2 : this.settings.volume);
  }

  public setMasterMuted(muted: boolean): void {
    this.settings.masterMuted = muted;
    if (muted) {
      this.stopRetrievalFocusDrone();
    }
    Howler.mute(muted);
    if (typeof window !== "undefined") {
      localStorage.setItem("tnpsc_wizard_audio_muted", String(muted));
    }
  }

  public toggleMasterMute(): boolean {
    const next = !this.settings.masterMuted;
    this.setMasterMuted(next);
    return next;
  }

  public isMuted(): boolean {
    return this.settings.masterMuted;
  }

  public setReducedSound(reduced: boolean): void {
    this.settings.reducedSound = reduced;
    if (typeof window !== "undefined") {
      localStorage.setItem("tnpsc_wizard_reduced_sound", String(reduced));
    }
  }

  public isReducedSound(): boolean {
    return this.settings.reducedSound;
  }
}

export const audioEngine = PedagogicalAudioEngine.getInstance();

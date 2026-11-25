"use client";

import React, { useState, useEffect } from "react";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Sparkles, Scroll as ScrollIcon, Compass, Award, X, CheckCircle2, ChevronRight, Volume2, Shield } from "lucide-react";
import { playButtonClick, playCoinSound } from "@/utils/soundEffects";
import { triggerCoinRain, triggerRewardParticles, confetti } from "@/utils/particleEngine";
import { TranslationToggle } from "../translation/TranslationToggle";
import { GlobalLanguageToggle } from "../translation/GlobalLanguageToggle";
import { AudioSpeakButton } from "../audio/AudioSpeakButton";
import { useLanguage } from "@/context/LanguageContext";

// Audio synthesized web-audio helpers for friction-free feedback
function playChimeSound() {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Audio context may require user gesture
  }
}

function playImpactSound() {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio fallback
  }
}

export const WizardOathOnboarding: React.FC = () => {
  const { isTamil } = useLanguage();
  const isOnboardingActive = useOnboardingStore((s) => s.isOnboardingActive);
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);
  const hydrateOath = useOnboardingStore((s) => s.hydrateOath);
  const completeOath = useOnboardingStore((s) => s.completeOath);
  const skipOath = useOnboardingStore((s) => s.skipOath);

  useEffect(() => {
    hydrateOath();
  }, [hydrateOath]);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [hasAnsweredMock, setHasAnsweredMock] = useState(false);
  const [hasSelectedMapNode, setHasSelectedMapNode] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [xpAmount, setXpAmount] = useState(10);

  // If not yet hydrated, already completed, or dismissed, do not render
  if (!hasHydrated || !isOnboardingActive) {
    return null;
  }

  const handleStep1Accept = () => {
    try { playChimeSound(); } catch (e) {}
    try {
      triggerRewardParticles({ type: "STAR", originX: window.innerWidth * 0.5, originY: window.innerHeight * 0.5, count: 12 });
    } catch (e) {}
    setCurrentStep(2);
  };

  const handleStep2ClickOptionA = () => {
    if (hasAnsweredMock) return;
    try { playChimeSound(); } catch (e) {}
    setHasAnsweredMock(true);
    setShowXpPopup(true);
    setXpAmount(10);
    try {
      triggerRewardParticles({ type: "STAR", originX: window.innerWidth * 0.4, originY: window.innerHeight * 0.6, count: 16 });
    } catch (e) {}

    // Transition smoothly to Step 3 after 1.2 seconds
    setTimeout(() => {
      setCurrentStep(3);
      setShowXpPopup(false);
    }, 1200);
  };

  const handleStep3ClickHistoryHighlands = () => {
    if (hasSelectedMapNode) return;
    try { playChimeSound(); } catch (e) {}
    setHasSelectedMapNode(true);
    try {
      triggerRewardParticles({ type: "COIN", originX: window.innerWidth * 0.5, originY: window.innerHeight * 0.5, count: 15 });
    } catch (e) {}

    // Transition to Step 4 after 1.2 seconds
    setTimeout(() => {
      setCurrentStep(4);
    }, 1200);
  };

  const handleStep4Begin = () => {
    try { playImpactSound(); } catch (e) {}
    try { triggerCoinRain(3000); } catch (e) {}
    completeOath();
  };

  return (
    <div className="wizard-oath-container p-4 select-none">
      {/* Top HUD Controls: Progress Dots & Skip Button */}
      <div className="fixed top-4 left-0 right-0 px-4 sm:px-8 flex items-center justify-between z-70 pointer-events-auto">
        {/* Step Indicator Badges */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F0320]/80 border border-[#FFD700]/50 backdrop-blur-md shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
          <span className="font-fantasy-header text-[10px] sm:text-xs text-[#FFD700] tracking-wider">
            THE WIZARD'S OATH • STEP {currentStep} OF 4
          </span>
          <div className="flex items-center gap-1 ml-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentStep === stepNum
                    ? "bg-[#FFD700] ring-2 ring-[#FFD700]/60 scale-125"
                    : currentStep > stepNum
                    ? "bg-[#2ECC71]"
                    : "bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Top-Right Controls: Global EN/TA Switch & Skip Tutorial Button */}
        <div className="flex items-center gap-2">
          <GlobalLanguageToggle />
          <button
            onClick={skipOath}
            className="px-3 py-1 rounded-full bg-[#0F0320]/90 border border-slate-500 hover:border-[#FFD700] text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1 shadow-lg"
            title="Skip tutorial and begin immediate trial"
          >
            <span>{isTamil ? "பயிற்சியைத் தவிர்" : "Skip Tutorial"}</span>
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Floating XP Reward Popup */}
      {showXpPopup && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-80 pointer-events-none xp-float-popup flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFD700] text-[#1E053A] font-fantasy-header text-sm sm:text-base font-extrabold shadow-2xl">
          <Sparkles className="w-4 h-4 fill-[#1E053A]" />
          <span>+{xpAmount} XP SPELL UNLOCKED!</span>
        </div>
      )}

      {/* =========================================================================
          STEP 1: THE WELCOME (0-10s)
          ========================================================================= */}
      {currentStep === 1 && (
        <div className="wizard-oath-card p-6 sm:p-8 text-center animate-in fade-in duration-300">
          <div className="ornate-corner-gem ornate-corner-tl" />
          <div className="ornate-corner-gem ornate-corner-tr" />
          <div className="ornate-corner-gem ornate-corner-bl" />
          <div className="ornate-corner-gem ornate-corner-br" />

          {/* Character Stage Showcase */}
          <div className="relative w-full h-44 sm:h-52 flex items-end justify-center mb-4">
            {/* Velan with Ancient Scroll */}
            <div className="absolute left-1/4 sm:left-1/3 top-2 z-20 animate-bounce" style={{ animationDuration: "2.5s" }}>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-[0_0_15px_rgba(46,204,113,0.9)]">
                <img
                  src="/assets/velan_wizard_companion.webp"
                  alt="Velan with wizard hat"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/assets/velan_wizard_companion.png";
                  }}
                />
              </div>
            </div>

            {/* Lalitha Hero Wizard */}
            <div className="relative z-10">
              <div className="w-36 h-40 sm:w-44 sm:h-48 filter drop-shadow-[0_0_25px_rgba(106,13,173,0.9)]">
                <img
                  src="/assets/lalitha_wizard_hero.webp"
                  alt="Lalitha Hero Wizard"
                  width={176}
                  height={192}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/assets/lalitha_wizard_hero.png";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Single-Sentence Dialogue */}
          <div className="comic-speech-bubble-rpg max-w-lg mx-auto mb-6 text-left space-y-2">
            <div className="flex items-center justify-end gap-1.5">
              <AudioSpeakButton
                textEn="Welcome, Apprentice! I am Velan. Together, we shall master the TNPSC realms!"
                textTa="வணக்கம் இளம் வித்தைக்காரரே! நான் வேலன். ஒன்றாக இணைந்து TNPSC உலகங்களை வெல்வோம்!"
                tamilClipKey="onboarding_step1"
                labelEn="Listen"
                labelTa="கேட்க"
                variant="light"
              />
              {!isTamil && (
                <AudioSpeakButton
                  forceTamil
                  textEn="Welcome, Apprentice! I am Velan. Together, we shall master the TNPSC realms!"
                  textTa="வணக்கம் இளம் வித்தைக்காரரே! நான் வேலன். ஒன்றாக இணைந்து TNPSC உலகங்களை வெல்வோம்!"
                  tamilClipKey="onboarding_step1"
                  labelTa="தமிழ்"
                  variant="emerald"
                />
              )}
            </div>
            <TranslationToggle
              englishText="Welcome, Apprentice! I am Velan. Together, we shall master the TNPSC realms!"
              tamilText="வணக்கம் இளம் வித்தைக்காரரே! நான் வேலன். ஒன்றாக இணைந்து TNPSC உலகங்களை வெல்வோம்!"
              tamilClipKey="onboarding_step1"
              variant="light"
              className="font-body font-bold text-sm sm:text-base text-[#1E053A] leading-relaxed"
            />
          </div>

          {/* Singular Golden Call-To-Action */}
          <button
            onClick={handleStep1Accept}
            data-testid="accept-oath-btn"
            className="magic-button magic-button-gold px-8 py-3 text-sm sm:text-base font-fantasy-header flex items-center justify-center gap-2 mx-auto shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ScrollIcon className="w-4 h-4 text-[#3E1E04]" />
            <span>{isTamil ? "உறுதிமொழியை ஏற்கவும்" : "Accept the Oath"}</span>
            <ChevronRight className="w-4 h-4 text-[#3E1E04]" />
          </button>
        </div>
      )}

      {/* =========================================================================
          STEP 2: THE FIRST LESSON (10-25s)
          Teach the Click-to-Cast loop with guaranteed success
          ========================================================================= */}
      {currentStep === 2 && (
        <div className="wizard-oath-card p-5 sm:p-7 text-center animate-in fade-in duration-300">
          <div className="ornate-corner-gem ornate-corner-tl" />
          <div className="ornate-corner-gem ornate-corner-tr" />
          <div className="ornate-corner-gem ornate-corner-bl" />
          <div className="ornate-corner-gem ornate-corner-br" />

          {/* Mentor Instruction (Strictly 1 sentence) */}
          <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
            <span className="text-xl shrink-0">🦜</span>
            <TranslationToggle
              englishText="Tap the correct answer to cast your first spell!"
              tamilText="உங்கள் முதல் மந்திரத்தை வீச சரியான விடையைத் தட்டவும்!"
              tamilClipKey="onboarding_step2"
              className="font-fantasy-header text-xs sm:text-sm text-[#FFD700] text-left"
            />
            <AudioSpeakButton
              forceTamil
              textEn="Tap the correct answer to cast your first spell! What sacred river nourished the Imperial Chola capital at Thanjavur?"
              textTa="உங்கள் முதல் மந்திரத்தை வீச சரியான விடையைத் தட்டவும்! தஞ்சாவூரில் இருந்த சோழப் பேரரசின் தலைநகரை வளமாக்கிய புனித நதி எது?"
              tamilClipKey="onboarding_step2"
              labelTa="தமிழ்"
              variant="gold"
            />
          </div>

          {/* Mock Question Card */}
          <div className="p-4 rounded-2xl bg-[#1C053A] border-2 border-[#FFD700]/70 text-left mb-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded bg-[#FFD700]/20 border border-[#FFD700] text-[#FFD700] text-[10px] font-black">
                MOCK TRIAL • SANGAM ROOTS
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">Reward: +10 XP</span>
            </div>
            <div className="mb-3">
              <TranslationToggle
                englishText="What sacred river nourished the Imperial Chola capital at Thanjavur?"
                tamilText="தஞ்சாவூரில் இருந்த சோழப் பேரரசின் தலைநகரை வளமாக்கிய புனித நதி எது?"
                className="font-bold text-base sm:text-lg text-[#FFF8DC] leading-snug"
              />
            </div>

            {/* Options Matrix: ONLY Option A is Interactive and Glowing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option A (TARGET ACTION) */}
              <button
                onClick={handleStep2ClickOptionA}
                data-testid="option-a-btn"
                className={`p-3 rounded-xl text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  hasAnsweredMock
                    ? "bg-[#D1F2D9] border-2 border-[#2ECC71] text-[#0E5E30] ring-4 ring-[#2ECC71]/40"
                    : "bg-[#FFFDF0] border-2 border-[#FFD700] text-[#2A1200] pulsing-action-target"
                }`}
              >
                <div className="w-7 h-7 rounded-md bg-[#6A0DAD] text-[#FFD700] font-ui font-extrabold text-xs flex items-center justify-center shrink-0 shadow">
                  A
                </div>
                <div className="flex-1">
                  <span className="text-[15px] font-bold block">River Cauvery (Ponni)</span>
                  <span className="text-xs text-[#1E8449] font-bold">
                    {hasAnsweredMock ? "✓ Spell Cast! +10 XP" : "👈 Tap to Cast Spell!"}
                  </span>
                </div>
              </button>

              {/* Option B (Dimmed) */}
              <button
                disabled
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 text-slate-400 text-left flex items-center gap-2.5 opacity-45 cursor-not-allowed"
              >
                <div className="w-7 h-7 rounded-md bg-slate-700 text-slate-300 font-ui font-bold text-xs flex items-center justify-center shrink-0">
                  B
                </div>
                <span className="text-[15px] font-semibold">River Vaigai</span>
              </button>

              {/* Option C (Dimmed) */}
              <button
                disabled
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 text-slate-400 text-left flex items-center gap-2.5 opacity-45 cursor-not-allowed"
              >
                <div className="w-7 h-7 rounded-md bg-slate-700 text-slate-300 font-ui font-bold text-xs flex items-center justify-center shrink-0">
                  C
                </div>
                <span className="text-[15px] font-semibold">River Palar</span>
              </button>

              {/* Option D (Dimmed) */}
              <button
                disabled
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 text-slate-400 text-left flex items-center gap-2.5 opacity-45 cursor-not-allowed"
              >
                <div className="w-7 h-7 rounded-md bg-slate-700 text-slate-300 font-ui font-bold text-xs flex items-center justify-center shrink-0">
                  D
                </div>
                <span className="text-[15px] font-semibold">River Thamirabarani</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            {hasAnsweredMock ? "✨ Brilliant cast! Preparing your expedition atlas..." : "Tapping Option A triggers your first spell."}
          </p>
        </div>
      )}

      {/* =========================================================================
          STEP 3: THE MAP REVEAL (25-40s)
          Teach the Realm Expedition & Gatekeeper loop
          ========================================================================= */}
      {currentStep === 3 && (
        <div className="wizard-oath-card p-5 sm:p-7 text-center animate-in fade-in duration-300">
          <div className="ornate-corner-gem ornate-corner-tl" />
          <div className="ornate-corner-gem ornate-corner-tr" />
          <div className="ornate-corner-gem ornate-corner-bl" />
          <div className="ornate-corner-gem ornate-corner-br" />

          {/* Mentor Instruction (Strictly 1 sentence) */}
          <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
            <Compass className="w-4 h-4 text-[#2ECC71] shrink-0" />
            <TranslationToggle
              englishText="Your journey begins at History Highlands. Tap to unlock your first realm!"
              tamilText="உங்கள் பயணம் வரலாற்றுச் சிகரங்களில் தொடங்குகிறது. உங்கள் முதல் உலகத்தைத் திறக்கத் தட்டவும்!"
              tamilClipKey="onboarding_step3"
              className="font-fantasy-header text-xs sm:text-sm text-[#FFD700] text-left"
            />
            <AudioSpeakButton
              forceTamil
              textEn="Your journey begins at History Highlands. Tap to unlock your first realm!"
              textTa="உங்கள் பயணம் வரலாற்றுச் சிகரங்களில் தொடங்குகிறது. உங்கள் முதல் உலகத்தைத் திறக்கத் தட்டவும்!"
              tamilClipKey="onboarding_step3"
              labelTa="தமிழ்"
              variant="gold"
            />
          </div>

          {/* Interactive Mock Map Canvas */}
          <div className="relative w-full h-48 sm:h-56 rounded-2xl bg-gradient-to-b from-[#A3E4D7] via-[#D5F5E3] to-[#FADBD8] overflow-hidden border-2 border-[#D1AC69] p-3 shadow-inner mb-4">
            {/* Stylized Terrain Vectors */}
            <svg className="w-full h-full" viewBox="0 0 320 180" fill="none">
              <path
                d="M10 80 Q 50 30 90 80 Q 140 20 190 80 Q 240 35 290 80 L 310 140 L 10 140 Z"
                fill="#82E0AA"
                fillOpacity="0.5"
              />
              <path
                d="M30 110 Q 80 80 140 100 Q 200 70 260 100 L 290 140 L 10 140 Z"
                fill="#58D68D"
                fillOpacity="0.6"
              />
              {/* Connecting Trail */}
              <line x1="60" y1="110" x2="160" y2="70" stroke="#FFD700" strokeWidth="3" strokeDasharray="5,5" className="golden-trail-animated" />
              <line x1="160" y1="70" x2="260" y2="90" stroke="#718096" strokeWidth="2.5" strokeDasharray="4,4" opacity="0.4" />
            </svg>

            {/* Node 1: History Highlands (TARGET ACTION) */}
            <button
              onClick={handleStep3ClickHistoryHighlands}
              data-testid="history-highlands-btn"
              className={`absolute left-8 bottom-8 p-2 rounded-xl bg-[#0F0320] border-2 text-left flex items-center gap-2 transition-all cursor-pointer ${
                hasSelectedMapNode
                  ? "border-[#2ECC71] ring-4 ring-[#2ECC71]/50 bg-emerald-950/80 shadow-[0_0_20px_rgba(46,204,113,0.8)]"
                  : "border-[#FFD700] pulsing-action-target shadow-xl"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#FFD700] text-[#0F0320] font-black text-xs flex items-center justify-center">
                🏛️
              </div>
              <div>
                <span className="font-fantasy-header text-[10px] sm:text-xs text-[#FFD700] block">
                  {isTamil ? "வரலாற்றுச் சிகரங்கள்" : "History Highlands"}
                </span>
                <span className="text-[9px] font-bold text-[#2ECC71]">
                  {hasSelectedMapNode
                    ? isTamil ? "✓ திறக்கப்பட்டது!" : "✓ Unlocked & Claimed!"
                    : isTamil ? "👈 தட்டவும்!" : "👈 Tap to Claim Realm!"}
                </span>
              </div>
            </button>

            {/* Node 2: Polity Peak (Locked) */}
            <div className="absolute top-10 left-36 p-1.5 rounded-lg bg-slate-900/80 border border-slate-600 flex items-center gap-1.5 opacity-50 cursor-not-allowed">
              <span className="text-xs">🔒</span>
              <span className="font-fantasy-header text-[9px] text-slate-300">
                {isTamil ? "ஆட்சியியல் முகடு" : "Polity Peak"}
              </span>
            </div>

            {/* Node 3: Aptitude Arena (Locked) */}
            <div className="absolute top-16 right-8 p-1.5 rounded-lg bg-slate-900/80 border border-slate-600 flex items-center gap-1.5 opacity-50 cursor-not-allowed">
              <span className="text-xs">🔒</span>
              <span className="font-fantasy-header text-[9px] text-slate-300">
                {isTamil ? "திறனறிவுக் களம்" : "Aptitude Arena"}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            {hasSelectedMapNode ? "✨ Realm claimed! Sealing your wizard's oath..." : "Every realm maps 1:1 to an official TNPSC Syllabus Unit."}
          </p>
        </div>
      )}

      {/* =========================================================================
          STEP 4: THE OATH SEAL (40-60s)
          Magical seal stamp + "First Oath" Badge reward
          ========================================================================= */}
      {currentStep === 4 && (
        <div className="wizard-oath-card p-6 sm:p-8 text-center animate-in zoom-in-95 duration-400">
          <div className="ornate-corner-gem ornate-corner-tl" />
          <div className="ornate-corner-gem ornate-corner-tr" />
          <div className="ornate-corner-gem ornate-corner-bl" />
          <div className="ornate-corner-gem ornate-corner-br" />

          {/* Royal Seal Stamp Animation */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FFD700] via-[#E6B800] to-[#7A5805] p-1 shadow-2xl wizard-seal-stamp flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#1C053A] border-4 border-[#FFD700] flex flex-col items-center justify-center text-center p-2 shadow-inner">
                <span className="text-2xl sm:text-3xl">⚔️</span>
                <span className="font-fantasy-header text-[8px] sm:text-[9px] text-[#FFD700] tracking-tighter">
                  TNPSC WIZARD
                </span>
                <span className="text-[7px] text-[#2ECC71] font-bold">SEALED</span>
              </div>
            </div>
          </div>

          {/* Single-Sentence Dialogue */}
          <div className="comic-speech-bubble-rpg max-w-md mx-auto mb-4 text-left space-y-2">
            <div className="flex items-center justify-end gap-1.5">
              <AudioSpeakButton
                forceTamil
                textEn="Your Oath is sealed! May wisdom guide your path to Rank 1."
                textTa="உங்கள் உறுதிமொழி பொறிக்கப்பட்டது! முதல் தரவரிசைக்கான பாதையில் ஞானம் வழிகாட்டட்டும்."
                tamilClipKey="onboarding_step4"
                labelTa="தமிழ்"
                variant="light"
              />
            </div>
            <TranslationToggle
              englishText="Your Oath is sealed! May wisdom guide your path to Rank 1."
              tamilText="உங்கள் உறுதிமொழி பொறிக்கப்பட்டது! முதல் தரவரிசைக்கான பாதையில் ஞானம் வழிகாட்டட்டும்."
              tamilClipKey="onboarding_step4"
              variant="light"
              className="font-body font-bold text-sm sm:text-base text-[#1E053A] leading-relaxed"
            />
          </div>

          {/* Bonus Reward Badge Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/80 via-[#6A0DAD]/30 to-purple-950/80 border border-[#FFD700]/60 max-w-sm mx-auto mb-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#FFD700] text-black flex items-center justify-center text-lg font-black shadow">
                🏆
              </div>
              <div className="text-left">
                <h4 className="font-fantasy-header text-xs text-[#FFD700]">"First Oath" Badge</h4>
                <p className="text-[10px] text-slate-300">Core Loop Mastery Confirmed</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71] text-[#2ECC71] font-fantasy-header text-xs font-black">
              +50 XP
            </span>
          </div>

          {/* Grand Finale Button */}
          <button
            onClick={handleStep4Begin}
            data-testid="begin-adventure-btn"
            className="magic-button magic-button-emerald px-10 py-3.5 text-sm sm:text-base font-fantasy-header flex items-center justify-center gap-2 mx-auto shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>{isTamil ? "சாகசத்தைத் தொடங்கு" : "Begin Adventure"}</span>
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { TranslationToggle } from "../translation/TranslationToggle";
import { GlobalLanguageToggle } from "../translation/GlobalLanguageToggle";
import { AudioSpeakButton } from "../audio/AudioSpeakButton";

interface CodexChapter {
  id: string;
  titleEn: string;
  titleTa: string;
  bodyEn: string;
  bodyTa: string;
}

const CODEX_CHAPTERS: CodexChapter[] = [
  {
    id: "intro",
    titleEn: "Velan's Opening Blessing",
    titleTa: "வேலனின் தொடக்க வாழ்த்து",
    bodyEn:
      "Vanakkam, brave Lalitha! Listen well. The Tamil Nadu Public Service Commission is not merely an examination hall—it is a vast, ancient empire waiting for its next champion. Together, we shall wield authentic past-paper questions like magical spells, shatter cursed scrolls, and ascend to Rank 1.",
    bodyTa:
      "வணக்கம் வீர லலிதா! தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையத் தேர்வு என்பது ஒரு பெருங்கடலைப் போன்றது. கவலை வேண்டாம், உனது வழிகாட்டியாக நான் இருக்கிறேன். கடந்த 10 ஆண்டுகளின் அசல் வினாக்களை மந்திர ஆயுதங்களாகப் பயன்படுத்தி, சவாலான தலைப்புகளை முறியடித்து முதல் தரவரிசையை அடைவோம்!",
  },
  {
    id: "pwa",
    titleEn: "Chapter I: Installing the App (Offline PWA)",
    titleTa: "அத்தியாயம் I: உங்கள் மொபைலில் நிறுவும் முறை (PWA)",
    bodyEn:
      "Inscribe TNPSC Wizard onto your home screen via Chrome ('Install app') or Safari ('Add to Home Screen'). All verified questions, audio effects, and artwork are cached offline so you can practice even in airplane mode.",
    bodyTa:
      "குரோம் ('Install app') அல்லது சஃபாரி ('Add to Home Screen') வழியாக செயலியை உங்கள் முகப்புத் திரையில் நிறுவலாம். அனைத்து வினாக்களும் ஒலி விளைவுகளும் இணையம் இல்லாமலேயே (Offline) இயங்கும்.",
  },
  {
    id: "rules",
    titleEn: "Chapter II: The Sacred Rules of the Realm",
    titleTa: "அத்தியாயம் II: விளையாட்டு மற்றும் கல்வி விதிகள்",
    bodyEn:
      "Spell Power tracks your unit mastery; Cursed Scrolls flag Spaced Repetition items you missed until you achieve 2 consecutive correct recalls; Mana Reserves track your daily streak; and Realm Conquests require >80% accuracy in Group 1 Boss Trials.",
    bodyTa:
      "மந்திர ஆற்றல் (Spell Power) பாடத்திட்டத் தேர்ச்சியைக் காட்டுகிறது; சவாலான சுருள்கள் (Cursed Scrolls) நீங்கள் தவறவிட்ட வினாக்களைத் தொடர்ந்து 2 முறை சரியாக விடையளிக்கும் வரை நினைவூட்டும்; மன ஆற்றல் (Mana) தினசரி தொடர்ச்சியைக் குறிக்கும்; இறுதித் தேர்வில் 80%-க்கு மேல் பெற்றால் அடுத்த உலகம் திறக்கும்.",
  },
  {
    id: "trial",
    titleEn: "Chapter III: How to Conduct a Daily Trial",
    titleTa: "அத்தியாயம் III: தினசரி வினாத் தேர்வை மேற்கொள்ளும் முறை",
    bodyEn:
      "Every trial displays its official TNPSC year and tier badge (G4, G2, G1). Choose an option to cast your spell. If you miss a question, the Post-Mortem Grimoire explains the exact distractor trap and core syllabus anchor.",
    bodyTa:
      "ஒவ்வொரு வினாவிலும் அதன் TNPSC தேர்வு ஆண்டு மற்றும் தரம் (G4, G2, G1) குறிக்கப்பட்டிருக்கும். தவறான விடையைத் தேர்ந்தெடுத்தால், வினாப் பிழை பகுப்பாய்வு (Post-Mortem) ஏன் அந்தத் தேர்வு தவறானது என்பதையும் சரியான பாடக் கருத்தையும் விளக்கும்.",
  },
  {
    id: "oracle",
    titleEn: "Chapter IV: The Daily Oracle & Friction Quill",
    titleTa: "அத்தியாயம் IV: தினசரி அறிவு வாக்கு & குறைப் புகார் இறகு",
    bodyEn:
      "Check Velan's Daily Oracle in the Reliquary (/progress) for your countdown, schema health, and prioritized next action. Tap the bottom-right Golden Quill anytime to log confusing questions or UI friction.",
    bodyTa:
      "உங்கள் தேர்வு நாட்கள் எண்ணிக்கை மற்றும் அடுத்து படிக்க வேண்டிய தலைப்பை அறிய 'தினசரி வாக்கு' (/progress) பகுதியைப் பார்க்கவும். ஏதேனும் வினா குழப்பமாக இருந்தால் கீழ்-வலது மூலையில் உள்ள தங்க இறகு பொத்தானைத் தட்டிப் பதிவு செய்யலாம்.",
  },
  {
    id: "reset",
    titleEn: "Chapter V: Clean Slate Charm (Ctrl + Shift + D)",
    titleTa: "அத்தியாயம் V: மறுசீரமைப்பு மந்திரம் (Ctrl + Shift + D)",
    bodyEn:
      "Press Ctrl + Shift + D on desktop or tap 'Clean Slate Reset' to cleanse local ink and restart your Day 1 Wizard's Oath onboarding anytime.",
    bodyTa:
      "விசைப்பலகையில் Ctrl + Shift + D ஐ அழுத்தினால் அல்லது 'Clean Slate Reset' பொத்தானைத் தட்டினால் உங்கள் பயிற்சி நிலை சீரமைக்கப்பட்டு முதல் நாளிலிருந்து மீண்டும் தொடங்கலாம்.",
  },
];

export const VelanCodexButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isTamil } = useLanguage();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        data-testid="velan-codex-btn"
        className={`px-2.5 py-1 rounded-full bg-[#0F0320]/90 border-2 border-[#FFD700]/60 text-[#FFD700] hover:bg-[#6A0DAD]/40 transition-all flex items-center gap-1.5 font-ui text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer shadow active:scale-95 ${className}`}
        title="Open Velan's Codex (Bilingual User Manual)"
        aria-label="Open Velan's Codex User Manual"
      >
        <BookOpen className="w-3.5 h-3.5 text-[#FFD700]" />
        <span className="hidden sm:inline">{isTamil ? "கையேடு" : "Codex"}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Velan's Codex User Manual"
        >
          <div className="ornate-frame ornate-frame-purple max-w-2xl w-full max-h-[85vh] flex flex-col bg-gradient-to-b from-[#2D084F] to-[#0F0320] shadow-2xl overflow-hidden">
            <div className="ornate-corner-gem ornate-corner-tl" />
            <div className="ornate-corner-gem ornate-corner-tr" />
            <div className="ornate-corner-gem ornate-corner-bl" />
            <div className="ornate-corner-gem ornate-corner-br" />

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#FFD700]/40 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📜</span>
                <div>
                  <h2 className="font-fantasy-header text-sm sm:text-base text-[#FFD700]">
                    {isTamil ? "வேலனின் வழிகாட்டி கையேடு" : "Velan's Codex: Grand Tome"}
                  </h2>
                  <p className="text-[11px] text-amber-200/80">
                    {isTamil ? "முழு இருமொழிப் பயனர் கையேடு" : "Bilingual Field Guide for Lalitha"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <GlobalLanguageToggle />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Velan's Codex"
                  className="p-1.5 rounded-full bg-[#0F0320] border border-[#FFD700]/50 text-[#FFD700] hover:bg-purple-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {CODEX_CHAPTERS.map((chap) => (
                <div
                  key={chap.id}
                  className="p-4 rounded-2xl bg-[#1C053A]/85 border border-[#FFD700]/30 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="font-fantasy-header text-xs sm:text-sm text-[#FFD700]">
                      {isTamil ? chap.titleTa : chap.titleEn}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <AudioSpeakButton
                        textEn={chap.bodyEn}
                        textTa={chap.bodyTa}
                        tamilClipKey={`codex_${chap.id}`}
                        labelEn="Listen"
                        labelTa="கேட்க"
                        variant="gold"
                      />
                      {!isTamil && (
                        <AudioSpeakButton
                          forceTamil
                          textEn={chap.bodyEn}
                          textTa={chap.bodyTa}
                          tamilClipKey={`codex_${chap.id}`}
                          labelTa="தமிழ்"
                          variant="emerald"
                        />
                      )}
                    </div>
                  </div>
                  <TranslationToggle
                    englishText={chap.bodyEn}
                    tamilText={chap.bodyTa}
                    tamilClipKey={`codex_${chap.id}`}
                    className="text-xs sm:text-sm text-[#FFF8DC]/90 leading-relaxed font-body"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

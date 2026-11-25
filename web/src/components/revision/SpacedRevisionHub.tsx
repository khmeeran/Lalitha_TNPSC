"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Brain,
  Sparkles,
  Rotate3d,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  TrendingUp,
  Flame,
  Scroll,
} from "lucide-react";
import { useLearning } from "../../context/LearningContext";
import { useLanguage } from "../../context/LanguageContext";
import { TranslationToggle } from "../translation/TranslationToggle";
import { AudioSpeakButton } from "../audio/AudioSpeakButton";
import { FlashcardItem, SM2QualityGrade } from "../../types/learning";
import { getDailyRevisionQueue, computeQueueStats } from "../../utils/sm2Algorithm";
import { LalithaAvatar } from "../mascot/LalithaAvatar";
import { VelanMascotSvg } from "../VelanMascotSvg";
import { GameShell } from "../game/GameShell";

export const SpacedRevisionHub: React.FC = () => {
  const { state, gradeFlashcard } = useLearning();
  const { isTamil } = useLanguage();

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const todayStr = "2026-11-23";
  const dailyQueue = getDailyRevisionQueue(state.flashcards, todayStr, 10);
  const stats = computeQueueStats(state.flashcards, todayStr);

  const currentCard: FlashcardItem | undefined = dailyQueue[activeCardIndex];

  const handleGrade = (grade: SM2QualityGrade) => {
    if (!currentCard) return;

    gradeFlashcard(currentCard.id, grade);
    setIsCardFlipped(false);

    if (activeCardIndex < dailyQueue.length - 1) {
      setActiveCardIndex((prev) => prev + 1);
    } else {
      setIsSessionComplete(true);
    }
  };

  const handleResetSession = () => {
    setActiveCardIndex(0);
    setIsCardFlipped(false);
    setIsSessionComplete(false);
  };

  return (
    <GameShell
      activeRealmTitleTa="Memory Sanctum • Spaced Repetition"
      activeRealmTitleEn="Memory Sanctum • SM-2 Palm-Leaf Archives"
      companionSnippet="10 flashcards are due for review today. Prevent memory decay with SM-2!"
    >
      <div data-testid="spaced-revision-hub" className="max-w-4xl mx-auto px-3 sm:px-6 py-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Top: 10-Card Daily Policy Header */}
        <section className="bg-slate-900/90 rounded-3xl border-2 border-amber-600/40 p-4 sm:p-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-400 bg-slate-950 shadow-md shrink-0">
                <img src="/assets/prop_revision_chest.png" alt="Palm-Leaf Memory Chest" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-amber-100">
                  10-Card Daily Policy
                </h2>
                <span className="text-[11px] text-slate-400 font-semibold block">
                  Precisely 10 cards daily to prevent cognitive overload and reinforce long-term memory.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                SM-2 Algorithm
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-amber-800/30">
            <div className="p-2 sm:p-3 rounded-xl bg-slate-950 border border-amber-700/40 text-center">
              <span className="block text-lg sm:text-xl font-black text-amber-400">
                {dailyQueue.length}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Due Today</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-slate-950 border border-amber-700/40 text-center">
              <span className="block text-lg sm:text-xl font-black text-amber-300">
                {stats.matureCardsCount}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Retained</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-slate-950 border border-amber-700/40 text-center">
              <span className="block text-lg sm:text-xl font-black text-emerald-400">
                {stats.retentionRatePercent}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Retention Rate</span>
            </div>
          </div>
        </section>

        {/* Center: The Palm-Leaf Interactive 3D Flip Card */}
        {!isSessionComplete && currentCard ? (
          <div className="space-y-4">
            <div
              data-testid="flashcard-3d"
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="cursor-pointer relative w-full min-h-[300px] sm:min-h-[340px] rounded-3xl bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950 border-2 border-amber-500/60 p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-amber-400 flex flex-col justify-between"
            >
              {/* Card Meta Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-800/40">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Card {activeCardIndex + 1} / {dailyQueue.length}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    🏛️ {currentCard.provenance}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <AudioSpeakButton
                    textEn={isCardFlipped ? currentCard.backEn : currentCard.frontEn}
                    textTa={isCardFlipped ? currentCard.backTa : currentCard.frontTa}
                    labelEn="Listen"
                    labelTa="கேட்க"
                    variant="gold"
                  />
                  {!isTamil && (
                    <AudioSpeakButton
                      forceTamil
                      textEn={isCardFlipped ? currentCard.backEn : currentCard.frontEn}
                      textTa={isCardFlipped ? currentCard.backTa : currentCard.frontTa}
                      labelTa="தமிழ்"
                      variant="emerald"
                    />
                  )}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Rotate3d className="w-4 h-4" />
                    <span>{isCardFlipped ? "Flip to Front" : "Flip to Reveal"}</span>
                  </div>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="my-auto py-4 text-center">
                {!isCardFlipped ? (
                  /* FRONT: Inscription Query */
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      [ Historical Query ]
                    </span>
                    <h3 className={`text-lg sm:text-2xl font-black text-amber-100 max-w-2xl mx-auto leading-relaxed ${isTamil ? "font-tamil" : ""}`}>
                      {isTamil && currentCard.frontTa !== currentCard.frontEn ? currentCard.frontTa : currentCard.frontEn}
                    </h3>
                    <div className="pt-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-slate-950 border border-amber-700/40 text-amber-300 text-xs font-bold">
                        Node: {currentCard.nodeId} • Interval: {currentCard.intervalDays}d
                      </span>
                    </div>
                  </div>
                ) : (
                  /* BACK: Official Inscription Answer & Epigraphical Fact */
                  <div className="space-y-3 animate-in zoom-in-95 duration-150">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      [ Verified Official Key ]
                    </span>
                    <h3 className={`text-lg sm:text-2xl font-black text-emerald-300 max-w-2xl mx-auto leading-relaxed ${isTamil ? "font-tamil" : ""}`}>
                      {isTamil && currentCard.backTa !== currentCard.backEn ? currentCard.backTa : currentCard.backEn}
                    </h3>
                    <div className="pt-2 text-xs text-amber-200/90 max-w-lg mx-auto bg-slate-950/80 p-3 rounded-xl border border-amber-800/40">
                      💡 <span className="font-bold">Exam Note:</span> This concept appears frequently in TNPSC examinations.
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Indicator */}
              <div className="pt-3 border-t border-amber-800/40 text-center text-[11px] text-slate-400">
                {isCardFlipped ? "Rate your recall quality below" : "Click anywhere on the card to flip"}
              </div>
            </div>

            {/* SM-2 Quality Grading Bar */}
            {isCardFlipped && (
              <div className="bg-slate-900/90 rounded-2xl border-2 border-amber-600/40 p-4 shadow-xl animate-in slide-in-from-bottom-2 duration-150">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block text-center mb-3">
                  Rate Your Cognitive Recall:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => handleGrade(0)}
                    className="p-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-red-200 text-xs font-bold transition-all text-center"
                  >
                    <div className="text-base mb-0.5">❌</div>
                    <div>Again</div>
                    <div className="text-[10px] text-red-400">Interval: 1d</div>
                  </button>

                  <button
                    onClick={() => handleGrade(3)}
                    className="p-3 rounded-xl bg-orange-950/60 hover:bg-orange-900/60 border border-orange-500/50 text-orange-200 text-xs font-bold transition-all text-center"
                  >
                    <div className="text-base mb-0.5">⚠️</div>
                    <div>Hard</div>
                    <div className="text-[10px] text-orange-400">Interval: 3d</div>
                  </button>

                  <button
                    onClick={() => handleGrade(4)}
                    className="p-3 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/50 text-amber-200 text-xs font-bold transition-all text-center"
                  >
                    <div className="text-base mb-0.5">👍</div>
                    <div>Good</div>
                    <div className="text-[10px] text-amber-400">Interval: 6d</div>
                  </button>

                  <button
                    onClick={() => handleGrade(5)}
                    className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold transition-all text-center"
                  >
                    <div className="text-base mb-0.5">🌟</div>
                    <div>Easy</div>
                    <div className="text-[10px] text-emerald-400">Interval: 12d</div>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SESSION COMPLETED SANCTUM SEAL */
          <div className="bg-slate-900/95 rounded-3xl border-2 border-amber-600/40 p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20">
              📜
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Memory Sanctum Cleared!
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-amber-100 mt-2">
                All 10 daily revision cards have been reinforced!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                Next review intervals have been calculated and scheduled via SuperMemo SM-2.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleResetSession}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-600/40 text-amber-200 text-xs sm:text-sm font-bold transition-colors"
              >
                Practice Queue
              </button>
              <Link
                href="/realms"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-600/40 text-amber-200 text-xs sm:text-sm font-bold transition-colors"
              >
                World Atlas
              </Link>
              <Link
                href="/pyq"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                PYQ Vault →
              </Link>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

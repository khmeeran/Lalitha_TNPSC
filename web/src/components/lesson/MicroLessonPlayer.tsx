"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { MicroLessonPayload, LessonCard } from "../../types/learning";
import { LalithaAvatar } from "../mascot/LalithaAvatar";
import { VelanMascotSvg } from "../VelanMascotSvg";
import { useLearning } from "../../context/LearningContext";
import { useLanguage } from "../../context/LanguageContext";
import { TranslationToggle } from "../translation/TranslationToggle";
import { AudioSpeakButton } from "../audio/AudioSpeakButton";
import { speakSmartNarration, stopNarration } from "../../utils/speechSynthesis";
import { GameShell } from "../game/GameShell";
import { confetti } from "../../utils/particleEngine";
import { playCoinSound } from "../../utils/soundEffects";
import { AmbientSceneParticles } from "../scene/AmbientSceneParticles";

interface MicroLessonPlayerProps {
  lesson: MicroLessonPayload;
}

export const MicroLessonPlayer: React.FC<MicroLessonPlayerProps> = ({ lesson }) => {
  const router = useRouter();
  const { state, completeLesson, toggleAudioNarration } = useLearning();
  const { isTamil } = useLanguage();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerVerified, setIsAnswerVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const isActionDebouncedRef = useRef(false);

  const currentCard: LessonCard = lesson.cards[activeStep] || lesson.cards[0];
  const totalCards = lesson.cards.length; // strictly 6
  const isCheckpointCard = currentCard.cardType === "CHECKPOINT_CHALLENGE";
  const isVictoryCard = currentCard.cardType === "VICTORY_CELEBRATION";
  const isAlreadyMastered = state.completedNodeIds.includes(lesson.nodeId);

  // Stop ongoing narration on unmount or card step change
  useEffect(() => {
    stopNarration();
    setIsSpeaking(false);
    setShowHint(false);
    setActiveGlossaryTerm(null);

    // If audio narration is enabled, trigger bilingual speech for the new card
    if (state.settings.audioNarrationEnabled) {
      const textEn = currentCard.velanDialogueEn
        ? `${currentCard.velanDialogueEn}. ${currentCard.bodyEn}`
        : `${currentCard.headlineEn}. ${currentCard.bodyEn}`;
      const textTa = currentCard.velanDialogueTa
        ? `${currentCard.velanDialogueTa}. ${currentCard.bodyTa}`
        : `${currentCard.headlineTa}. ${currentCard.bodyTa}`;
      setIsSpeaking(true);
      speakSmartNarration({
        textEn,
        textTa,
        isTamil,
        speaker: "VELAN",
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }

    if (cardRef.current) {
      cardRef.current.focus();
    }
  }, [activeStep, state.settings.audioNarrationEnabled, isTamil]);

  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && activeStep < totalCards - 1 && (!isCheckpointCard || isAnswerVerified)) {
        handleNextStep();
      } else if (e.key === "ArrowLeft" && activeStep > 0) {
        handlePrevStep();
      } else if (e.key === "h" || e.key === "H") {
        if (isCheckpointCard) setShowHint((prev) => !prev);
      } else if (["1", "2", "3", "4"].includes(e.key) && isCheckpointCard && !isAnswerVerified) {
        const optionMap: Record<string, string> = { "1": "A", "2": "B", "3": "C", "4": "D" };
        setSelectedOption(optionMap[e.key]);
      } else if (e.key === "Escape") {
        router.push("/realms");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStep, isCheckpointCard, isAnswerVerified, totalCards]);

  const handleNextStep = () => {
    if (isActionDebouncedRef.current) return;
    if (activeStep < totalCards - 1) {
      isActionDebouncedRef.current = true;
      setActiveStep((prev) => prev + 1);
      setTimeout(() => {
        isActionDebouncedRef.current = false;
      }, 300);
    }
  };

  const handlePrevStep = () => {
    if (isActionDebouncedRef.current) return;
    if (activeStep > 0) {
      isActionDebouncedRef.current = true;
      setActiveStep((prev) => prev - 1);
      setTimeout(() => {
        isActionDebouncedRef.current = false;
      }, 300);
    }
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerVerified && isCorrect) return;
    setSelectedOption(optId);
  };

  const handleVerifyAnswer = () => {
    if (!selectedOption || !currentCard.checkpoint) return;
    const correct = selectedOption === currentCard.checkpoint.correctOptionId;
    setIsCorrect(correct);
    setIsAnswerVerified(true);

    if (correct) {
      completeLesson(lesson.nodeId, lesson.xpRewardBase + lesson.xpRewardCheckpoint);
      playCoinSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#FF6347"],
      });
      if (state.settings.audioNarrationEnabled) {
        speakSmartNarration({
          textEn: "Splendid Lalitha! Correct answer!",
          textTa: "அருமை லலிதா! சரியான விடை!",
          tamilClipKey: "feedback_correct",
          isTamil,
          speaker: "VELAN",
        });
      }
    } else {
      if (state.settings.audioNarrationEnabled) {
        speakSmartNarration({
          textEn: "Let us try again Lalitha. Note the hint.",
          textTa: "மீண்டும் முயற்சி செய் லலிதா. குறிப்பைப் பார்க்கவும்.",
          tamilClipKey: "feedback_wrong",
          isTamil,
          speaker: "VELAN",
        });
      }
    }
  };

  const progressPercentage = Math.round(((activeStep + 1) / totalCards) * 100);

  return (
    <GameShell
      activeRealmTitleTa="Chamber of Inscriptions • Field Investigation"
      activeRealmTitleEn="Chamber of Inscriptions • Field Investigation"
      companionSnippet={currentCard.velanDialogueEn || "Velan: 'Lalitha! The Kalinga War's aftermath...'"}
    >
      <div
        data-testid="micro-lesson-player"
        className="relative max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-between space-y-4"
      >
        {/* Cinematic ComfyUI 3D Background & Temple Dust Motes */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden -z-10 opacity-35">
          <img
            src="/assets/chola_temple_sanctum_bg.png"
            alt="Ancient Inscription Chamber Sanctum"
            width={1920}
            height={1080}
            className="w-full h-full object-cover filter brightness-85 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/90" />
          <AmbientSceneParticles type="DUST" />
        </div>
        {/* TOP: Archaeological Progress & Chamber Badge */}
        <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-900/90 border border-amber-600/40 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/realms"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-700/40 text-amber-300 text-xs font-bold transition-colors"
            >
              ← Atlas
            </Link>
            <div>
              <div className="text-xs font-bold text-amber-200">Public Forum — Ashoka's Rock Edicts</div>
              <div className="text-[10px] text-amber-400 font-serif italic">{lesson.subClause}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              className="flex items-center gap-1.5"
            >
              <div className="w-24 sm:w-32 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-amber-800/40">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-amber-400">{activeStep + 1}/{totalCards}</span>
            </div>
          </div>
        </div>

        {/* MENTOR GUIDANCE STAGE: Lalitha & Velan Archaeological Stance */}
        <section
          className="bg-slate-900/90 rounded-2xl border border-amber-600/40 p-4 sm:p-5 shadow-xl"
          aria-label="Mentor Guidance"
        >
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400 bg-slate-950 shadow" data-testid="lalitha-avatar">
                <img src="/assets/lalitha_character.png" alt="Lalitha Explorer" width={48} height={48} className="w-full h-full object-cover object-top" />
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-400 bg-slate-950 shadow">
                <img src="/assets/velan_parrot.png" alt="Velan the Wise Parrot" width={48} height={48} className="w-full h-full object-cover object-center" />
              </div>
            </div>

            <div className="flex-1 bg-amber-950/40 border border-amber-700/40 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-amber-100">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <span>🦉</span>
                  <span>VELAN'S GUIDANCE</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Card {activeStep + 1}
                </span>
              </div>
              <TranslationToggle
                englishText={currentCard.velanDialogueEn || currentCard.bodyEn}
                tamilText={
                  currentCard.velanDialogueTa && currentCard.velanDialogueTa !== currentCard.velanDialogueEn
                    ? currentCard.velanDialogueTa
                    : undefined
                }
                className="font-semibold text-amber-100 leading-relaxed font-sans"
              />
            </div>
          </div>
        </section>

        {/* ACTIVE INSCRIPTION CARD (Field Deck) */}
        <section
          ref={cardRef}
          tabIndex={-1}
          className="flex-1 bg-slate-900/95 rounded-2xl border-2 border-amber-600/40 p-5 sm:p-7 shadow-2xl flex flex-col justify-between focus:outline-none"
          aria-live="polite"
        >
          <div>
            {/* Metadata Badges + Lesson Card Audio Controls */}
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentCard.cardType.replace(/_/g, " ")}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <AudioSpeakButton
                  textEn={`${currentCard.headlineEn}. ${currentCard.bodyEn}`}
                  textTa={`${currentCard.headlineTa || currentCard.headlineEn}. ${currentCard.bodyTa || currentCard.bodyEn}`}
                  speaker="VELAN"
                  labelEn="Listen"
                  labelTa="பாடம் கேட்க"
                  variant="gold"
                />
                {!isTamil && (currentCard.bodyTa || currentCard.headlineTa) && (
                  <AudioSpeakButton
                    forceTamil
                    textEn={`${currentCard.headlineEn}. ${currentCard.bodyEn}`}
                    textTa={`${currentCard.headlineTa || currentCard.headlineEn}. ${currentCard.bodyTa || currentCard.bodyEn}`}
                    speaker="VELAN"
                    labelTa="தமிழ்"
                    variant="emerald"
                  />
                )}
                <span className="text-xs font-semibold text-slate-400">
                  {lesson.subClause}
                </span>
              </div>
            </div>

            {/* Headline */}
            <h2 className={`text-base sm:text-xl font-extrabold text-amber-100 leading-snug mb-3 ${isTamil ? "font-tamil" : ""}`}>
              {isTamil ? (currentCard.headlineTa || currentCard.headlineEn) : (currentCard.headlineEn || currentCard.headlineTa)}
            </h2>

            {/* Body Text */}
            <div className={`text-sm sm:text-base text-slate-200 leading-relaxed mb-5 font-normal ${isTamil ? "font-tamil" : ""}`}>
              <p>{isTamil ? (currentCard.bodyTa || currentCard.bodyEn) : (currentCard.bodyEn || currentCard.bodyTa)}</p>
            </div>

            {/* Key Terms Highlight (Card 2) */}
            {currentCard.highlightedTerms && currentCard.highlightedTerms.length > 0 && (
              <div className="mt-4 pt-4 border-t border-amber-900/40">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Key Terms:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentCard.highlightedTerms.map((term, tIdx) => {
                    const isSelected = activeGlossaryTerm === term.termEn;
                    return (
                      <button
                        key={tIdx}
                        onClick={() => setActiveGlossaryTerm(isSelected ? null : term.termEn)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md"
                            : "bg-slate-950 border-amber-700/40 text-amber-300 hover:border-amber-500"
                        }`}
                        aria-expanded={isSelected}
                      >
                        🔍 {term.termEn}
                      </button>
                    );
                  })}
                </div>

                {activeGlossaryTerm && (
                  <div className="mt-3 p-3 bg-amber-950/60 rounded-xl border border-amber-600/40 text-xs text-amber-100 animate-in fade-in duration-150">
                    {(() => {
                      const item = currentCard.highlightedTerms.find((t) => t.termEn === activeGlossaryTerm || t.termTa === activeGlossaryTerm);
                      if (!item) return null;
                      return (
                        <>
                          <div className="font-bold text-amber-300 mb-0.5">
                            {item.termEn}
                          </div>
                          <div>{item.definitionEn || item.definitionTa}</div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Fact Pillars (Card 3) */}
            {currentCard.factPillars && currentCard.factPillars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                {currentCard.factPillars.map((pillar, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3.5 bg-slate-950/80 rounded-xl border border-amber-800/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-200 mb-1">{pillar.titleEn}</div>
                      <div className="text-xs text-slate-300 leading-relaxed">{pillar.descriptionEn}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Exam Mnemonic (Card 4) */}
            {currentCard.examMnemonicEn && (
              <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-500/50 text-amber-100">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Exam Mnemonic</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold">{currentCard.examMnemonicEn}</div>
              </div>
            )}

            {/* Checkpoint Challenge (Card 5) */}
            {isCheckpointCard && currentCard.checkpoint && (
              <div className="mt-4">
                <div className="p-3.5 bg-amber-950/40 border border-amber-600/40 rounded-xl mb-3">
                  <div className="text-xs font-bold text-amber-200 mb-1">
                    {currentCard.checkpoint.questionEn || currentCard.checkpoint.questionTa}
                  </div>
                  {currentCard.checkpoint.pyqProvenanceBadge && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      🏛️ {currentCard.checkpoint.pyqProvenanceBadge}
                    </span>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                  {currentCard.checkpoint.options.map((opt) => {
                    const isSelected = selectedOption === opt.optionId;
                    const isThisCorrect = isAnswerVerified && opt.optionId === currentCard.checkpoint?.correctOptionId;
                    const isThisWrong = isAnswerVerified && isSelected && !isCorrect;

                    let btnClass = "bg-slate-950 border-amber-800/40 text-slate-200 hover:border-amber-500";
                    if (isSelected) {
                      btnClass = "bg-amber-950/80 border-amber-400 text-amber-200 ring-2 ring-amber-400/30";
                    }
                    if (isThisCorrect) {
                      btnClass = "bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/30";
                    } else if (isThisWrong) {
                      btnClass = "bg-red-950/90 border-red-400 text-red-200";
                    }

                    return (
                      <button
                        key={opt.optionId}
                        onClick={() => handleSelectOption(opt.optionId)}
                        disabled={isAnswerVerified && isCorrect}
                        className={`p-3 rounded-xl border text-left transition-all font-medium text-xs sm:text-sm flex items-start gap-2.5 ${btnClass}`}
                        aria-pressed={isSelected}
                      >
                        <span className="w-5 h-5 rounded-lg bg-slate-900 border border-amber-700/40 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-amber-300">
                          {opt.optionId}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold">{opt.textEn || opt.textTa}</div>
                        </div>
                        {isThisCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        {isThisWrong && (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Socratic Hint */}
                {showHint && (
                  <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-600/40 text-xs text-amber-200 mb-3 animate-in fade-in duration-150">
                    <span className="font-bold flex items-center gap-1 mb-1 text-amber-300">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      Velan's Socratic Hint:
                    </span>
                    <p>{currentCard.checkpoint.socraticHintEn || currentCard.checkpoint.socraticHintTa}</p>
                  </div>
                )}

                {/* Feedback */}
                {isAnswerVerified && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm animate-in fade-in duration-200 ${
                      isCorrect
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                        : "bg-red-950/80 border-red-500 text-red-200"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Splendid! Correct Answer!</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 text-red-400" />
                          <span>Let's Try Again!</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed font-sans">{currentCard.checkpoint.explanationEn || currentCard.checkpoint.explanationTa}</p>
                  </div>
                )}
              </div>
            )}

            {/* Victory Celebration (Card 6) */}
            {isVictoryCard && (
              <div className="my-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="inline-flex p-4 rounded-3xl bg-amber-500/20 border-2 border-amber-400 shadow-xl text-3xl">
                  ✨ 🏆 ✨
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg sm:text-2xl font-black text-amber-100">
                    Lesson Completed Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    You have mastered this concept and unlocked the next trail milestone.
                  </p>
                </div>

                <div className="max-w-md mx-auto grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl border border-amber-600/40">
                  <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/30 shadow-xs">
                    <span className="block text-2xl font-black text-amber-400">
                      {isAlreadyMastered ? "+0 XP" : `+${lesson.xpRewardBase + lesson.xpRewardCheckpoint} XP`}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {isAlreadyMastered ? "Replay (0 XP)" : "Academic Reward"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/30 shadow-xs">
                    <span className="block text-2xl font-black text-amber-300">
                      🧠 SM-2
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Enrolled in Vault
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic font-serif">
                  Next review scheduled automatically in 24 hours under the 10-card daily policy.
                </p>
              </div>
            )}
          </div>

          {/* Action Dock */}
          <div className="mt-6 pt-4 border-t border-amber-900/40 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevStep}
              disabled={activeStep === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                activeStep === 0
                  ? "opacity-30 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-600"
                  : "bg-slate-900 border-amber-700/40 text-amber-200 hover:bg-slate-800"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>‹ Prev</span>
            </button>

            {isCheckpointCard && !isAnswerVerified && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-950/60 border border-amber-600/40 text-amber-300 hover:bg-amber-900/60 transition-colors"
                aria-expanded={showHint}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? "Close Hint" : "Velan's Hint"}</span>
              </button>
            )}

            {isCheckpointCard && !isAnswerVerified ? (
              <button
                onClick={handleVerifyAnswer}
                disabled={!selectedOption}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all ${
                  selectedOption
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 font-black shadow-amber-500/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>Verify</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : isVictoryCard ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/realms"
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-700/40 transition-colors"
                >
                  Atlas
                </Link>
                <Link
                  href="/quiz"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
                >
                  <span>Quiz Arena ›</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <span>Continue ›</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </GameShell>
  );
};

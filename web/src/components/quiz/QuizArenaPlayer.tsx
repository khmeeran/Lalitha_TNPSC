"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sword,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
} from "lucide-react";
import { QuizPayload, QuizQuestionItem, QuizOption } from "../../types/learning";
import { LalithaAvatar } from "../mascot/LalithaAvatar";
import { VelanMascotSvg } from "../VelanMascotSvg";
import { useLearning } from "../../context/LearningContext";
import { useLanguage } from "../../context/LanguageContext";
import { TranslationToggle } from "../translation/TranslationToggle";
import { speakNarration } from "../../utils/speechSynthesis";
import { GameShell } from "../game/GameShell";
import { confetti, triggerCoinRain, triggerRewardParticles } from "../../utils/particleEngine";
import { playCoinSound } from "../../utils/soundEffects";

interface QuizArenaPlayerProps {
  quiz: QuizPayload;
}

export const QuizArenaPlayer: React.FC<QuizArenaPlayerProps> = ({ quiz }) => {
  const router = useRouter();
  const { state, recordQuizScore } = useLearning();
  const { isTamil } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [verifiedQuestions, setVerifiedQuestions] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(quiz.timeLimitSeconds || 600);

  const currentQuestion: QuizQuestionItem = quiz.questions[currentIndex] || quiz.questions[0];
  const totalQuestions = quiz.questions.length;
  const selectedOption = selectedAnswers[currentQuestion.id];
  const isCurrentVerified = !!verifiedQuestions[currentQuestion.id];
  const isCurrentCorrect = selectedOption === currentQuestion.correctOptionId;

  // Countdown timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const handleSelectOption = (optId: string) => {
    if (isCurrentVerified) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optId,
    }));
  };

  const handleVerifyCurrent = () => {
    if (!selectedOption) return;
    setVerifiedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
    setShowExplanation(true);

    if (selectedOption === currentQuestion.correctOptionId) {
      playCoinSound();
      triggerRewardParticles({ type: "STAR", count: 20 });
    }

    if (state.settings.audioNarrationEnabled) {
      if (selectedOption === currentQuestion.correctOptionId) {
        speakNarration("Splendid! Your strike shattered the temple seal!", { speaker: "VELAN" });
      } else {
        speakNarration("Attention Lalitha! Read the explanation and try again.", { speaker: "VELAN" });
      }
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setIsFinished(true);

    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });

    const percent = Math.round((correct / totalQuestions) * 100);
    const passed = percent >= quiz.targetPassScore;
    const xpToAward = passed ? quiz.xpReward : Math.round(quiz.xpReward * 0.3);

    if (passed) {
      playCoinSound();
      triggerCoinRain(3200);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#FFD700", "#FFA500", "#FF6347", "#10B981"],
      });
    }

    recordQuizScore(quiz.id, percent, passed, xpToAward);
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setVerifiedQuestions({});
    setIsFinished(false);
    setShowExplanation(false);
    setTimeRemaining(quiz.timeLimitSeconds || 600);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  const correctCount = Object.keys(selectedAnswers).filter(
    (qId) => selectedAnswers[qId] === quiz.questions.find((q) => q.id === qId)?.correctOptionId
  ).length;

  return (
    <GameShell
      activeRealmTitleTa={`Temple Boss Battle • ${quiz.titleEn || quiz.titleTa}`}
      activeRealmTitleEn={quiz.titleEn}
      companionSnippet="To breach Rajaraja Chola's architectural seal, your knowledge is the ultimate weapon!"
    >
      <div data-testid="quiz-arena" className="relative max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Cinematic ComfyUI 3D Background */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden -z-10 opacity-35">
          <img
            src="/assets/chola_battle_arena_bg.png"
            alt="Chola Battle Arena"
            width={1920}
            height={1080}
            className="w-full h-full object-cover filter brightness-85 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/90" />
        </div>
        {!isFinished ? (
          <>
            {/* Top Bar: Boss Health & Seals */}
            <div className="bg-slate-900/90 rounded-2xl border-2 border-red-600/40 p-4 shadow-xl mb-2">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden border border-rose-500/60 bg-slate-950 shrink-0 shadow-md">
                    <img src="/assets/prop_boss_gate.png" alt="Chola Temple Boss Portal" width={44} height={44} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-200 block uppercase tracking-wider">
                      {quiz.isBossBattle ? "Temple Boss Battle" : "Practice Arena"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Passing Target: {quiz.targetPassScore}% ({Math.ceil((quiz.targetPassScore / 100) * totalQuestions)} Correct Answers Required)
                    </span>
                  </div>
                </div>

                {/* Timer Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-600/40 text-amber-300 text-xs font-mono font-bold">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Boss Challenge Seals Progress */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden border border-red-900/50 flex">
                  {quiz.questions.map((q, idx) => {
                    const isAnswered = !!verifiedQuestions[q.id];
                    const isCorrect = selectedAnswers[q.id] === q.correctOptionId;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 border-r border-slate-950 last:border-0 transition-colors ${
                          !isAnswered
                            ? idx === currentIndex
                              ? "bg-amber-400 animate-pulse"
                              : "bg-slate-800"
                            : isCorrect
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-amber-300">
                  {currentIndex + 1}/{totalQuestions}
                </span>
              </div>
            </div>

            {/* Main Battle Card: Question Deck */}
            <div className="flex-1 bg-slate-900/95 rounded-2xl border-2 border-amber-600/40 p-5 sm:p-7 shadow-2xl flex flex-col justify-between">
              <div>
                {/* Topic & Syllabus Provenance Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                    Battle Question {currentIndex + 1}
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    🏛️ {currentQuestion.provenance || "Unit VIII: Tamil Heritage"}
                  </span>
                </div>

                {/* Question Prompt */}
                <div className="mb-5">
                  <TranslationToggle
                    englishText={currentQuestion.questionEn || currentQuestion.questionTa}
                    tamilText={currentQuestion.questionTa !== currentQuestion.questionEn ? currentQuestion.questionTa : undefined}
                    className="text-base sm:text-lg font-bold text-amber-100 leading-snug"
                  />
                </div>

                {/* MCQ Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {(currentQuestion.options || []).map((opt: QuizOption) => {
                    const isSelected = selectedOption === opt.id;
                    const isThisCorrect = isCurrentVerified && opt.id === currentQuestion.correctOptionId;
                    const isThisWrong = isCurrentVerified && isSelected && !isCurrentCorrect;

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
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        disabled={isCurrentVerified}
                        className={`p-3.5 rounded-xl border text-left transition-all font-medium text-xs sm:text-sm flex items-start gap-3 ${btnClass}`}
                      >
                        <span className="w-5 h-5 rounded-lg bg-slate-900 border border-amber-700/40 flex items-center justify-center text-[10px] font-bold text-amber-300 shrink-0 mt-0.5">
                          {opt.id}
                        </span>
                        <div className="flex-1">
                          <div className={`font-semibold text-amber-100 ${isTamil ? "font-tamil text-base" : ""}`}>
                            {isTamil && opt.textTa && opt.textTa !== opt.textEn ? opt.textTa : opt.textEn}
                          </div>
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

                {/* Explanation Feedback Card */}
                {showExplanation && (
                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm animate-in fade-in duration-200 ${
                      isCurrentCorrect
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                        : "bg-red-950/80 border-red-500 text-red-200"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-2 mb-1">
                      {isCurrentCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Seal Shattered!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span>Strike Deflected!</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed font-sans">{currentQuestion.explanationTa}</p>
                    <p className="text-slate-400 italic mt-0.5 font-serif">{currentQuestion.explanationEn}</p>
                  </div>
                )}
              </div>

              {/* Bottom Action Controls */}
              <div className="mt-6 pt-4 border-t border-amber-900/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Correct Answers: {correctCount}/{totalQuestions}</span>
                </div>

                {!isCurrentVerified ? (
                  <button
                    onClick={handleVerifyCurrent}
                    disabled={!selectedOption}
                    className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                      selectedOption
                        ? "bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow-lg shadow-amber-500/20"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Verify Strike
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-95 shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <span>{currentIndex < totalQuestions - 1 ? "Next Question ›" : "Finish Battle ›"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* VICTORY / DEFEAT SCORECARD */
          <div className="bg-slate-900/95 rounded-2xl border-2 border-amber-600/40 p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            {correctCount >= Math.ceil((quiz.targetPassScore / 100) * totalQuestions) ? (
              <>
                <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20">
                  👑
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Victory • Chapter Boss Defeated
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-amber-100 mt-2">
                    Thanjavur Brihadisvara Temple Seal Shattered!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    You scored over 80% on Emperor Rajaraja Chola's art and architectural history!
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/20 border-2 border-red-400 flex items-center justify-center text-4xl shadow-xl shadow-red-500/20">
                  ⚔️
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40">
                    Trial Unfinished
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-amber-100 mt-2">
                    The temple fortress remains sealed!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    80% score required to clear the trial. Review the material and try again!
                  </p>
                </div>
              </>
            )}

            {/* Score Stats */}
            <div className="max-w-md mx-auto grid grid-cols-3 gap-3 p-4 bg-slate-950 rounded-2xl border border-amber-700/40">
              <div className="p-3 bg-slate-900 rounded-xl border border-amber-600/30">
                <span className="block text-2xl font-black text-amber-400">
                  {Math.round((correctCount / totalQuestions) * 100)}%
                </span>
                <span className="text-[11px] font-bold text-slate-400">Score</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-amber-600/30">
                <span className="block text-2xl font-black text-amber-300">
                  {correctCount}/{totalQuestions}
                </span>
                <span className="text-[11px] font-bold text-slate-400">Correct</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-amber-600/30">
                <span className="block text-2xl font-black text-amber-400">
                  +{correctCount >= Math.ceil((quiz.targetPassScore / 100) * totalQuestions) ? quiz.xpReward : Math.round(quiz.xpReward * 0.3)}
                </span>
                <span className="text-[11px] font-bold text-slate-400">XP Essence</span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestartQuiz}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-600/40 text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Trial</span>
              </button>
              <Link
                href="/realms"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-600/40 text-amber-200 text-xs sm:text-sm font-bold transition-colors"
              >
                World Atlas
              </Link>
              <Link
                href="/revision"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                Memory Sanctum →
              </Link>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

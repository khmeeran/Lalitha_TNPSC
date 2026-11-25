"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Send,
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useLearning } from "../../context/LearningContext";
import { useLanguage } from "../../context/LanguageContext";
import { TranslationToggle } from "../translation/TranslationToggle";
import {
  MOCK_EXAM_QUESTIONS,
  MOCK_EXAM_SECTIONS,
  calculateExamScorecard,
} from "../../data/mockMockExamData";
import { MockExamScorecard } from "../../types/learning";
import { VelanMascotSvg } from "../VelanMascotSvg";
import { GameShell } from "../game/GameShell";

export const MockExamArena: React.FC = () => {
  const router = useRouter();
  const { state, submitMockExamScorecard } = useLearning();
  const { isTamil } = useLanguage();

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(35 * 60); // 35 minutes
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [scorecard, setScorecard] = useState<MockExamScorecard | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const questions = MOCK_EXAM_QUESTIONS;
  const totalQuestions = questions.length;
  const currentQ = questions[activeQuestionIndex] || questions[0];

  // Timer countdown
  useEffect(() => {
    if (isExamSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamSubmitted]);

  const handleSelectOption = (optId: string) => {
    if (isExamSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.index]: optId,
    }));
  };

  const handleToggleMarkReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.index]: !prev[currentQ.index],
    }));
  };

  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.index];
      return copy;
    });
  };

  const handleNext = () => {
    if (activeQuestionIndex < totalQuestions - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    setShowSubmitModal(false);
    const timeSpent = 35 * 60 - timeRemainingSeconds;
    const computedScorecard = calculateExamScorecard(selectedAnswers, timeSpent);
    setScorecard(computedScorecard);
    setIsExamSubmitted(true);
    submitMockExamScorecard(computedScorecard);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const markedCount = Object.keys(markedForReview).filter((k) => markedForReview[Number(k)]).length;

  return (
    <GameShell
      activeRealmTitleTa="Commission Examination Hall • Full Mock Simulation"
      activeRealmTitleEn="The Great Commission Examination Hall • CCSE Simulation"
      companionSnippet="With a calm mind and keen precision, face the full examination!"
    >
      <div data-testid="mock-exam-arena" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col justify-between space-y-4">
        {!isExamSubmitted ? (
          <>
            {/* Top Bar: Section Badge, Timer & Submit */}
            <div className="bg-slate-900/90 rounded-2xl border-2 border-amber-600/40 p-4 shadow-xl mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-lg shrink-0">
                  🏛️
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-amber-100">
                    TNPSC Group 4 & Group 2 Model Exam Simulation
                  </h2>
                  <span className="text-[11px] text-amber-300/80 font-serif italic block">
                    Marks: +1.5 per correct answer • Zero negative marking • Total: {totalQuestions * 1.5} Marks
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Timer Clock */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-amber-600/40 text-amber-300 text-xs sm:text-sm font-mono font-black">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{formatTimer(timeRemainingSeconds)}</span>
                </div>

                {/* Submit Exam Button */}
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Exam</span>
                </button>
              </div>
            </div>

            {/* Layout Grid: Left Question Sheet + Right OMR Palette */}
            <div className="flex flex-col lg:flex-row gap-4 items-start flex-1">
              {/* Left Column: Active Question Workspace */}
              <div className="flex-1 w-full bg-slate-900/95 rounded-3xl border-2 border-amber-600/40 p-5 sm:p-7 shadow-2xl flex flex-col justify-between min-h-[460px]">
                <div>
                  {/* Question Sub-Header */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-amber-800/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        Question {currentQ.index}
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        {currentQ.subjectTitle}
                      </span>
                    </div>

                    <button
                      onClick={handleToggleMarkReview}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        markedForReview[currentQ.index]
                          ? "bg-purple-950/80 border-purple-400 text-purple-200"
                          : "bg-slate-950 border-amber-800/40 text-slate-400 hover:text-amber-300"
                      }`}
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>{markedForReview[currentQ.index] ? "Marked" : "Mark for Review"}</span>
                    </button>
                  </div>

                  {/* Question Statement */}
                  <div className="mb-5">
                    <TranslationToggle
                      englishText={currentQ.questionEn || currentQ.questionTa}
                      tamilText={currentQ.questionTa !== currentQ.questionEn ? currentQ.questionTa : undefined}
                      className="text-sm sm:text-base font-bold text-amber-100 leading-relaxed"
                    />
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt) => {
                      const isSelected = selectedAnswers[currentQ.index] === opt.id;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(opt.id)}
                          className={`w-full p-3 sm:p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${
                            isSelected
                              ? "bg-amber-950/80 border-amber-400 text-amber-200 font-bold ring-2 ring-amber-400/30 shadow-md"
                              : "bg-slate-950/80 border-amber-800/40 text-slate-200 hover:border-amber-500 hover:bg-slate-900"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                              isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-900 border border-amber-700/40 text-amber-300"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <div className={`flex-1 ${isTamil ? "font-tamil text-base" : ""}`}>
                            <div>{isTamil && opt.textTa && opt.textTa !== opt.textEn ? opt.textTa : opt.textEn}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="mt-6 pt-4 border-t border-amber-900/40 flex items-center justify-between gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={activeQuestionIndex === 0}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                      activeQuestionIndex === 0
                        ? "opacity-30 cursor-not-allowed bg-slate-950 text-slate-600 border-slate-800"
                        : "bg-slate-900 border-amber-700/40 text-amber-200 hover:bg-slate-800"
                    }`}
                  >
                    ‹ Prev
                  </button>

                  <button
                    onClick={handleClearResponse}
                    disabled={!selectedAnswers[currentQ.index]}
                    className="text-xs font-semibold text-slate-400 hover:text-amber-300 px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    Clear Response
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={activeQuestionIndex === totalQuestions - 1}
                    className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all active:scale-95 ${
                      activeQuestionIndex === totalQuestions - 1 ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                  >
                    <span>Next ›</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: OMR-Style Question Palette */}
              <div className="w-full lg:w-72 bg-slate-900/95 rounded-3xl border-2 border-amber-600/40 p-4 sm:p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-800/30 pb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-200">
                    OMR Question Palette
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-700" />
                    <span>Unvisited ({totalQuestions - answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    <span>Review ({markedCount})</span>
                  </div>
                </div>

                {/* 25-Question Numerical Grid */}
                <div className="grid grid-cols-5 gap-2 pt-2 border-t border-amber-800/30">
                  {questions.map((q, idx) => {
                    const isAns = !!selectedAnswers[q.index];
                    const isMarked = !!markedForReview[q.index];
                    const isCurrent = idx === activeQuestionIndex;

                    let bubbleColor = "bg-slate-950 text-slate-400 border-slate-800";
                    if (isAns) {
                      bubbleColor = "bg-emerald-500 text-slate-950 border-emerald-400 font-black";
                    }
                    if (isMarked) {
                      bubbleColor = "bg-purple-600 text-white border-purple-400 font-bold";
                    }
                    if (isCurrent) {
                      bubbleColor += " ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-950";
                    }

                    return (
                      <button
                        key={q.index}
                        onClick={() => setActiveQuestionIndex(idx)}
                        className={`h-9 rounded-xl border text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${bubbleColor}`}
                        aria-label={`Jump to Question ${q.index}`}
                      >
                        {q.index}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Comprehensive Final Exam Scorecard */
          scorecard && (
            <div className="bg-slate-900/95 rounded-3xl border-2 border-amber-600/40 p-6 sm:p-9 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 my-auto text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20">
                🎓
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  Official Scorecard
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-amber-100 mt-2">
                  Examination Results
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Official performance evaluation calculated with Commission standard marks.
                </p>
              </div>

              {/* Scorecard Tally Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="p-4 bg-slate-950 rounded-2xl border border-amber-700/40">
                  <span className="block text-2xl sm:text-3xl font-black text-amber-400">
                    {scorecard.totalMarksEarned} / {scorecard.maxMarks}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Score Obtained
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-amber-700/40">
                  <span className="block text-2xl sm:text-3xl font-black text-emerald-400">
                    {scorecard.percentage}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Accuracy Rate
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-amber-700/40">
                  <span className="block text-2xl sm:text-3xl font-black text-amber-300">
                    {scorecard.percentileRank}%ile
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Rank Estimate
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-amber-700/40">
                  <span className="block text-2xl sm:text-3xl font-black text-amber-100">
                    {scorecard.correctCount}/{scorecard.totalQuestions}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Correct Answers
                  </span>
                </div>
              </div>

              {/* Sectional Breakdown */}
              <div className="max-w-2xl mx-auto p-4 bg-slate-950 rounded-2xl border border-amber-800/40 text-left space-y-2">
                <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider block mb-2">
                  Sectional Performance:
                </span>
                {MOCK_EXAM_SECTIONS.map((sec) => {
                  const perf = scorecard.sectionalPerformance[sec.id] || { correct: 0, total: sec.questionCount, marks: 0 };
                  const pct = Math.round((perf.correct / perf.total) * 100);

                  return (
                    <div key={sec.id} className="flex items-center justify-between text-xs p-2.5 bg-slate-900 rounded-xl border border-amber-900/40">
                      <div>
                        <span className="font-bold text-amber-100">{sec.titleTa}</span>
                        <span className="block text-[10px] text-slate-400 font-serif italic">{sec.titleEn}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-amber-300">{perf.correct}/{perf.total} correct</span>
                        <span className="block text-[10px] text-slate-400">{pct}% accuracy</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <Link
                  href="/realms"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  Return to Atlas
                </Link>
                <Link
                  href="/progress"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 border border-amber-600/40 text-amber-200 transition-colors"
                >
                  View Milestones
                </Link>
              </div>
            </div>
          )
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Submit Examination Confirmation"
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div className="bg-slate-900 rounded-3xl border-2 border-amber-600/40 p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-lg">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-100">
                    Are you sure you want to submit the exam?
                  </h3>
                  <p className="text-xs text-slate-400 font-serif italic">
                    Are you ready to submit your model examination?
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-amber-800/40 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">Answered:</span>
                  <span className="font-bold text-emerald-400">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Marked for Review:</span>
                  <span className="font-bold text-purple-400">{markedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Unanswered:</span>
                  <span className="font-bold text-slate-500">{totalQuestions - answeredCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Resume Exam
                </button>
                <button
                  onClick={handleSubmitExam}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
                >
                  Confirm Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

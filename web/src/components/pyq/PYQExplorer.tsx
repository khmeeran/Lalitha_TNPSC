"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Archive,
  Search,
  Filter,
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLearning } from "../../context/LearningContext";
import { useLanguage } from "../../context/LanguageContext";
import { TranslationToggle } from "../translation/TranslationToggle";
import { AudioSpeakButton } from "../audio/AudioSpeakButton";
import { MOCK_PYQS } from "../../data/mockPYQData";
import { PYQQuestion } from "../../types/learning";
import { GameShell } from "../game/GameShell";

export const PYQExplorer: React.FC = () => {
  const { state, togglePYQBookmark } = useLearning();
  const { isTamil } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [userSelections, setUserSelections] = useState<Record<string, string>>({});
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  const filteredQuestions = MOCK_PYQS.filter((q) => {
    if (selectedGroup !== "ALL" && q.examGroup !== selectedGroup) return false;
    if (selectedYear !== "ALL" && q.year.toString() !== selectedYear) return false;
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      const matchTa = (q.questionTa || "").toLowerCase().includes(qLower);
      const matchEn = (q.questionEn || "").toLowerCase().includes(qLower);
      const matchTopic = q.topicTitle.toLowerCase().includes(qLower);
      const matchNum = q.questionNumber.toString().includes(qLower);
      if (!matchTa && !matchEn && !matchTopic && !matchNum) return false;
    }
    return true;
  });

  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserSelections((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleToggleReveal = (questionId: string) => {
    setRevealedKeys((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  return (
    <GameShell
      activeRealmTitleTa="Royal Archives • Previous Years Question Bank"
      activeRealmTitleEn="Royal Commission Archives • PYQ Investigation Vault"
      companionSnippet="Test your mastery against authentic Tamil Nadu Commission questions!"
    >
      <div data-testid="pyq-explorer" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. Header & Archival Filter Bar */}
        <section className="bg-slate-900/90 rounded-3xl border-2 border-amber-600/40 p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-amber-100 flex items-center gap-2">
                <span>📜</span>
                <span>Verified Previous Year Questions (PYQs)</span>
              </h2>
              <p className="text-xs text-amber-300/80 font-serif italic">
                Official questions curated from genuine TNPSC Group 1, 2, 4 and VAO examination papers.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 self-start sm:self-auto">
              {filteredQuestions.length} Archive Questions
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, keywords, concepts or citations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-amber-700/40 text-amber-100 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
          </div>

          {/* Group & Year Filter Tags */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-800/30">
            {/* Exam Group Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-amber-300 mr-1">Exam:</span>
              {[
                { id: "ALL", label: "All" },
                { id: "GROUP_4_VAO", label: "Group 4" },
                { id: "GROUP_2_2A", label: "Group 2" },
                { id: "GROUP_1", label: "Group 1" },
              ].map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGroup === grp.id
                      ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                      : "bg-slate-950 text-slate-400 border border-amber-800/40 hover:text-amber-200"
                  }`}
                >
                  {grp.label}
                </button>
              ))}
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-300 mr-1">Year:</span>
              {["ALL", "2024", "2022"].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedYear === yr
                      ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                      : "bg-slate-950 text-slate-400 border border-amber-800/40 hover:text-amber-200"
                  }`}
                >
                  {yr === "ALL" ? "All" : yr}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Questions List Deck */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isRevealed = !!revealedKeys[q.id];
            const userChoice = userSelections[q.id];
            const isBookmarked = state.pyqBookmarks.includes(q.id);

            return (
              <article
                key={q.id}
                data-testid="pyq-item"
                className="bg-slate-900/90 rounded-2xl border-2 border-amber-600/30 hover:border-amber-500/60 p-5 sm:p-6 shadow-xl transition-all space-y-4"
              >
                {/* Question Header & Official Provenance */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-800/30">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {q.examGroup.replace(/_/g, " ")} • {q.year}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      Q.{q.questionNumber}
                    </span>
                    <span className="text-xs font-mono text-amber-400">
                      [{q.paperName}]
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <AudioSpeakButton
                      textEn={`${q.questionEn || q.questionTa}. ${q.options.map((o) => `Option ${o.id}: ${o.textEn}`).join(". ")}`}
                      textTa={`${q.questionTa || q.questionEn}. ${q.options.map((o) => `விருப்பம் ${o.id}: ${o.textTa || o.textEn}`).join(". ")}`}
                      labelEn="Listen"
                      labelTa="கேட்க"
                      variant="gold"
                    />
                    {!isTamil && (
                      <AudioSpeakButton
                        forceTamil
                        textEn={q.questionEn}
                        textTa={`${q.questionTa || q.questionEn}. ${q.options.map((o) => `விருப்பம் ${o.id}: ${o.textTa || o.textEn}`).join(". ")}`}
                        labelTa="தமிழ்"
                        variant="emerald"
                      />
                    )}
                    <button
                      onClick={() => togglePYQBookmark(q.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? "bg-amber-500 text-slate-950 border-amber-400"
                          : "bg-slate-950 border-amber-800/40 text-slate-400 hover:text-amber-300"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleReveal(q.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-amber-700/40 text-amber-300 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isRevealed ? "Hide Answer" : "Reveal Answer"}</span>
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div>
                  <TranslationToggle
                    englishText={q.questionEn || q.questionTa}
                    tamilText={q.questionTa !== q.questionEn ? q.questionTa : undefined}
                    className="text-sm sm:text-base font-bold text-amber-100 leading-snug"
                  />
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = userChoice === opt.id;
                    const isCorrect = opt.id === q.correctOptionId;
                    const showResult = isRevealed || isSelected;

                    let btnClass = "bg-slate-950 border-amber-800/40 text-slate-300 hover:border-amber-500";
                    if (isRevealed && isCorrect) {
                      btnClass = "bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/40";
                    } else if (isSelected && !isCorrect && isRevealed) {
                      btnClass = "bg-red-950/90 border-red-400 text-red-200";
                    } else if (isSelected) {
                      btnClass = "bg-amber-950/80 border-amber-400 text-amber-200";
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all text-xs sm:text-sm flex items-start gap-2.5 ${btnClass}`}
                      >
                        <span className="w-5 h-5 rounded-lg bg-slate-900 border border-amber-700/40 flex items-center justify-center text-[10px] font-bold text-amber-300 shrink-0 mt-0.5">
                          {opt.id}
                        </span>
                        <div className="flex-1">
                          <div className={`font-semibold text-amber-100 ${isTamil ? "font-tamil text-base" : ""}`}>
                            {isTamil && opt.textTa && opt.textTa !== opt.textEn ? opt.textTa : opt.textEn}
                          </div>
                        </div>
                        {isRevealed && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isRevealed && (
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-100 space-y-1 animate-in fade-in duration-150">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Official Commission Annotation:</span>
                    </div>
                    <TranslationToggle
                      englishText={q.explanationEn || q.explanationTa}
                      tamilText={q.explanationTa !== q.explanationEn ? q.explanationTa : undefined}
                      className="leading-relaxed font-sans"
                    />
                    <div className="pt-1 text-[11px] text-amber-400 font-mono">
                      Source: {q.officialCitation}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};

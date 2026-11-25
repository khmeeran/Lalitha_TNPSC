"use client";

import React, { useState } from "react";
import { Feather, X, Check, MessageSquare, AlertCircle, Sparkles } from "lucide-react";
import { audioEngine } from "../../lib/audioEngine";

export interface FrictionFeedbackEntry {
  id: string;
  category: "TOO_HARD" | "TOO_EASY" | "CONFUSING_UI";
  comment: string;
  timestamp: string;
  route: string;
  viewport: {
    width: number;
    height: number;
  };
}

const STORAGE_KEY = "beta_feedback_logs";

export const FrictionReporter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"TOO_HARD" | "TOO_EASY" | "CONFUSING_UI">("CONFUSING_UI");
  const [commentText, setCommentText] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const categories: Array<{ id: "TOO_HARD" | "TOO_EASY" | "CONFUSING_UI"; label: string; icon: string; color: string }> = [
    {
      id: "TOO_HARD",
      label: "Too Hard",
      icon: "🔺",
      color: "border-red-500/50 text-red-200 bg-red-950/40",
    },
    {
      id: "TOO_EASY",
      label: "Too Easy",
      icon: "🔻",
      color: "border-yellow-500/50 text-yellow-200 bg-yellow-950/40",
    },
    {
      id: "CONFUSING_UI",
      label: "Confusing UI",
      icon: "❓",
      color: "border-purple-500/50 text-purple-200 bg-purple-950/40",
    },
  ];

  const handleOpen = () => {
    audioEngine.playCorrectRecall();
    setSubmittedSuccess(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: FrictionFeedbackEntry = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      category: selectedCategory,
      comment: commentText.trim(),
      timestamp: new Date().toISOString(),
      route: typeof window !== "undefined" ? window.location.pathname + window.location.search : "/",
      viewport: {
        width: typeof window !== "undefined" ? window.innerWidth : 390,
        height: typeof window !== "undefined" ? window.innerHeight : 844,
      },
    };

    if (typeof window !== "undefined") {
      try {
        const existingRaw = localStorage.getItem(STORAGE_KEY);
        const existing: FrictionFeedbackEntry[] = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      } catch (err) {
        console.warn("[Feedback] Could not write to localStorage:", err);
      }
    }

    // Audio & Haptic confirmation
    audioEngine.playCurseDispelled();
    audioEngine.triggerHaptic([30, 40, 30]);

    setSubmittedSuccess(true);
    setTimeout(() => {
      setCommentText("");
      setIsOpen(false);
      setSubmittedSuccess(false);
    }, 1500);
  };

  return (
    <>
      {/* 1. Subtle, Glowing Floating Quill Button (Bottom-Right) */}
      <button
        onClick={handleOpen}
        data-testid="friction-report-button"
        aria-label="Report friction or confusion"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-900 via-indigo-900 to-amber-700 border-2 border-amber-400 shadow-2xl flex items-center justify-center text-amber-300 hover:scale-110 active:scale-95 transition-all group"
        title="Sister Test: Report Friction or Confusion"
      >
        <span className="text-xl group-hover:rotate-12 transition-transform">🪶</span>
        <span className="sr-only">Report Friction</span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping pointer-events-none" />
      </button>

      {/* 2. Sister Test Friction Modal */}
      {isOpen && (
        <div
          data-testid="friction-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            data-testid="friction-modal"
            className="w-full max-w-sm rounded-3xl bg-slate-950 border-2 border-amber-500/80 p-6 shadow-2xl relative text-white space-y-4"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Close friction feedback modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
                  <Check className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-base font-black text-amber-200">
                  Inscribed into Velan&apos;s Codex!
                </h3>
                <p className="text-xs text-slate-300 font-serif italic max-w-xs mx-auto">
                  &ldquo;Thank you, Lalitha. Your feedback directly shapes our spellcraft.&rdquo;
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-xl">
                    🪶
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-amber-200">
                      What felt weird or confusing?
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      The Sister Test • Zero friction beta audit
                    </p>
                  </div>
                </div>

                {/* 3 Quick-Tap Choice Chips */}
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          audioEngine.playButtonClick();
                          setSelectedCategory(cat.id);
                        }}
                        className={`py-2 px-1.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? "border-amber-400 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/20 scale-[1.03]"
                            : `${cat.color} opacity-70 hover:opacity-100`
                        }`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-[10px] uppercase tracking-wider">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Optional elaboration text box */}
                <div className="space-y-1">
                  <label htmlFor="friction-comment" className="text-[11px] font-bold text-slate-300">
                    Tell Velan what happened (optional):
                  </label>
                  <textarea
                    id="friction-comment"
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="e.g., The answer button was hard to tap, or the question was too wordy..."
                    className="w-full rounded-xl bg-slate-900 border border-amber-900/50 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Send to Velan&apos;s Codex</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

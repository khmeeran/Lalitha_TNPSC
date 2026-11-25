import React from "react";
import { Zap, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { SpacedRevisionState } from "../types/dashboard";

interface SpacedRevisionBannerProps {
  revision: SpacedRevisionState;
  onStartReview: () => void;
  className?: string;
}

export const SpacedRevisionBanner: React.FC<SpacedRevisionBannerProps> = ({
  revision,
  onStartReview,
  className = "",
}) => {
  const { cardsDueCount, estimatedMinutes, lastReviewedDate } = revision;
  const hasCardsDue = cardsDueCount > 0;

  if (!hasCardsDue) {
    return (
      <section
        className={`rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs transition-all ${className}`}
        aria-label="Spaced Repetition Memory Bank"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Memory Bank Up to Date
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.2 rounded-full">
                0 Due
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {lastReviewedDate
                ? `Last reviewed ${lastReviewedDate}. Next batch scheduled for tomorrow.`
                : "Complete more lessons to unlock fresh spaced repetition flashcards."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/40 to-orange-50 border border-amber-300/80 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs transition-all hover:border-amber-400 ${className}`}
      aria-label="Spaced Repetition Flashcards Due"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center shrink-0 shadow-xs">
          <Zap className="w-5 h-5 fill-slate-900" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-amber-950 truncate">
              {cardsDueCount} Flashcards Due for Review
            </h4>
            <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
              <Clock className="w-2.5 h-2.5" /> ~{estimatedMinutes}m
            </span>
          </div>
          <p className="text-[11px] text-amber-900/80 truncate">
            Strengthen your memory retention before forgetting sets in.
          </p>
        </div>
      </div>

      <button
        onClick={onStartReview}
        className="shrink-0 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
      >
        <span>Review Now</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </section>
  );
};

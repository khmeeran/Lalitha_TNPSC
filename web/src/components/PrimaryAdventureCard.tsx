import React from "react";
import { Clock, Star, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { ActiveAdventure } from "../types/dashboard";

interface PrimaryAdventureCardProps {
  adventure: ActiveAdventure;
  onContinue: () => void;
  className?: string;
}

export const PrimaryAdventureCard: React.FC<PrimaryAdventureCardProps> = ({
  adventure,
  onContinue,
  className = "",
}) => {
  const {
    realmIcon,
    realmName,
    subTopic,
    topicTitle,
    topicSubtitle,
    estimatedMinutes,
    xpReward,
    currentStep,
    totalSteps,
    isBonus,
  } = adventure;

  const isCompleted = currentStep >= totalSteps;

  return (
    <article
      className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between transition-all hover:shadow-md ${className}`}
      style={{ minHeight: "210px", maxHeight: "245px" }}
      aria-label="Active Learning Adventure"
    >
      {/* Background Decorative Gradient Wash */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-indigo-50 via-amber-50/40 to-transparent pointer-events-none rounded-tr-2xl" />

      {/* Row 1: Top Breadcrumb & Metadata Pill (24px) */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100/90 border border-slate-200/70 px-2.5 py-0.5 rounded-full">
          <span className="text-sm">{realmIcon}</span>
          <span className="truncate max-w-[140px] sm:max-w-none">{realmName}</span>
          <span className="text-slate-400">•</span>
          <span className="text-indigo-600 font-bold truncate max-w-[100px] sm:max-w-none">{subTopic}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{estimatedMinutes}m</span>
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>+{xpReward} XP</span>
          </span>
        </div>
      </div>

      {/* Row 2 & 3: Lesson Title & Subtitle */}
      <div className="relative z-10 my-1">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
          {topicTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 mt-0.5 font-normal">
          {topicSubtitle}
        </p>
      </div>

      {/* Row 4: Segmented Step Progress Bar */}
      <div className="relative z-10 mb-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
          <span>
            {isBonus ? "Bonus Lore" : `Step ${currentStep} of ${totalSteps}`}
          </span>
          <span className="text-indigo-600 font-bold">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>

        {/* Segmented Pill Bars */}
        <div className="flex gap-1.5 h-1.5 sm:h-2 w-full">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1;
            const isDone = stepNum <= currentStep;
            return (
              <div
                key={index}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  isDone
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600"
                    : "bg-slate-200"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Row 5: High-Contrast Primary CTA Button (48px Touch Target) */}
      <div className="relative z-10 pt-1">
        <button
          onClick={onContinue}
          className={`w-full h-11 sm:h-12 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isCompleted
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : isBonus
              ? "bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
          aria-label={isCompleted ? "Revisit Completed Adventure" : "Continue Learning Adventure"}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>REVISIT LESSON</span>
            </>
          ) : isBonus ? (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>EXPLORE BONUS LORE</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>CONTINUE ADVENTURE</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </article>
  );
};

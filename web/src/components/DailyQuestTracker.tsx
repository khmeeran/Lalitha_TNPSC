import React from "react";
import { CheckCircle2, Circle, Gift, Sparkles, Check } from "lucide-react";
import { DailyQuestItem, BonusChestState } from "../types/dashboard";

interface DailyQuestTrackerProps {
  quests: DailyQuestItem[];
  bonusChest: BonusChestState;
  onToggleQuest: (id: string) => void;
  onClaimBonus: () => void;
  className?: string;
}

export const DailyQuestTracker: React.FC<DailyQuestTrackerProps> = ({
  quests,
  bonusChest,
  onToggleQuest,
  onClaimBonus,
  className = "",
}) => {
  const completedCount = quests.filter((q) => q.isCompleted).length;
  const totalCount = quests.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <section
      aria-label="Today's Quest"
      className={`rounded-2xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 transition-all ${className}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Today&apos;s Quest
            </h3>
            <span data-testid="quest-progress-ratio" className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {completedCount}/{totalCount} Done
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Consistent micro-wins lock in knowledge for the exam.
          </p>
        </div>

        {/* Progress % Tag */}
        <div className="text-right">
          <span className="text-xs sm:text-sm font-extrabold text-indigo-600">
            {percent}%
          </span>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-3.5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Task Checklist Items */}
      <div className="space-y-2 mb-3.5">
        {quests.map((quest) => (
          <div
            key={quest.id}
            data-testid={`quest-item-${quest.id}`}
            onClick={() => onToggleQuest(quest.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onToggleQuest(quest.id);
            }}
            className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
              quest.isCompleted
                ? "bg-emerald-50/50 border-emerald-200/80 text-emerald-950"
                : "bg-slate-50/70 hover:bg-slate-100/70 border-slate-200/70 text-slate-800"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleQuest(quest.id);
                }}
                className="shrink-0 focus:outline-none"
                aria-label={`Mark ${quest.label} as ${quest.isCompleted ? "incomplete" : "complete"}`}
              >
                {quest.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 fill-emerald-100 transition-transform" />
                ) : (
                  <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 hover:text-slate-400" />
                )}
              </button>
              <span
                className={`text-xs sm:text-sm font-medium truncate ${
                  quest.isCompleted ? "line-through text-slate-500" : "text-slate-800"
                }`}
              >
                {quest.label}
              </span>
            </div>

            <span
              className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                quest.isCompleted
                  ? "bg-emerald-100/70 text-emerald-800"
                  : "bg-slate-200/60 text-slate-600"
              }`}
            >
              +{quest.xp} XP
            </span>
          </div>
        ))}
      </div>

      {/* Bonus Reward Chest Banner */}
      <div
        className={`relative overflow-hidden rounded-xl border p-3 flex items-center justify-between gap-3 transition-all ${
          bonusChest.isClaimed
            ? "bg-slate-50 border-slate-200 text-slate-500"
            : allCompleted || bonusChest.isAvailable
            ? "bg-gradient-to-r from-amber-50 to-amber-100/80 border-amber-300 text-amber-950 shadow-xs"
            : "bg-slate-50/60 border-slate-200/80 text-slate-600"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
              bonusChest.isClaimed
                ? "bg-slate-200 text-slate-400"
                : allCompleted || bonusChest.isAvailable
                ? "bg-amber-500 text-white shadow-xs animate-bounce"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight">
                {bonusChest.isClaimed
                  ? "Daily Bonus Claimed"
                  : allCompleted || bonusChest.isAvailable
                  ? "Quest Complete Chest Unlocked!"
                  : "Daily Bonus Reward"}
              </span>
              {(allCompleted || bonusChest.isAvailable) && !bonusChest.isClaimed && (
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              )}
            </div>
            <p className="text-[10px] text-slate-500">
              {bonusChest.isClaimed
                ? "You earned +100 bonus XP today!"
                : allCompleted || bonusChest.isAvailable
                ? "Tap to claim your +100 XP bonus chest"
                : "Complete all 3 quests to unlock +100 Bonus XP"}
            </p>
          </div>
        </div>

        <div>
          {bonusChest.isClaimed ? (
            <span
              data-testid="claimed-bonus-tag"
              className="text-xs font-bold text-slate-400 flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Claimed
            </span>
          ) : allCompleted || bonusChest.isAvailable ? (
            <button
              onClick={onClaimBonus}
              data-testid="claim-bonus-btn"
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs shadow-xs active:scale-95 transition-all"
            >
              CLAIM +100 XP
            </button>
          ) : (
            <span className="text-xs font-semibold text-slate-400">
              🔒 Locked
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

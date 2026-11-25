import React from "react";
import { Flame, Check, Info } from "lucide-react";
import { DayStreakStatus } from "../types/dashboard";

interface WeeklyStreakWidgetProps {
  streakDays: number;
  weeklyStreak: DayStreakStatus[];
  onStreakClick?: () => void;
  className?: string;
}

export const WeeklyStreakWidget: React.FC<WeeklyStreakWidgetProps> = ({
  streakDays,
  weeklyStreak,
  onStreakClick,
  className = "",
}) => {
  return (
    <section
      className={`rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs transition-all hover:border-slate-300 ${
        onStreakClick ? "cursor-pointer group select-none" : ""
      } ${className}`}
      onClick={onStreakClick}
      role={onStreakClick ? "button" : undefined}
      tabIndex={onStreakClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onStreakClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onStreakClick();
        }
      }}
      aria-label={`Weekly momentum tracker. Current streak: ${streakDays} days.`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Weekly Momentum
            </h4>
            <span className="text-[10px] text-slate-500 font-medium">
              {streakDays > 0 ? `${streakDays} Days Consistent` : "Start today's streak"}
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          {streakDays}d Streak
        </span>
      </div>

      {/* 7-Day Dots Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {weeklyStreak.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className={`text-[10px] font-bold ${day.isToday ? "text-indigo-600" : "text-slate-400"}`}>
              {day.dayShort}
            </span>

            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                day.isCompleted
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-2xs"
                  : day.isToday
                  ? "border-2 border-dashed border-indigo-400 bg-indigo-50 text-indigo-700"
                  : "bg-slate-100 text-slate-300"
              }`}
            >
              {day.isCompleted ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

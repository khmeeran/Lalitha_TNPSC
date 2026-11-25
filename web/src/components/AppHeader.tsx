import React, { useState, useEffect, useRef } from "react";
import { Flame, Star, ChevronDown, Check } from "lucide-react";
import { ExamTarget, UserStats } from "../types/dashboard";

interface AppHeaderProps {
  user: UserStats;
  onExamChange: (newExam: ExamTarget) => void;
  onProfileClick: () => void;
  onStreakClick?: () => void;
}

const examLabels: Record<ExamTarget, string> = {
  GROUP_4_VAO: "Group 4 / VAO",
  GROUP_2_2A: "Group 2 / 2A",
  GROUP_1: "Group 1 Services",
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  onExamChange,
  onProfileClick,
  onStreakClick,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const exams: ExamTarget[] = ["GROUP_4_VAO", "GROUP_2_2A", "GROUP_1"];

  // Click-outside and Escape key listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-xs">
            <span className="text-lg">🪶</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                TNPSC <span className="text-indigo-600">Quest</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Exam Selector Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            data-testid="exam-selector-pill"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 transition-all active:scale-95"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            aria-label="Select Target Exam"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{examLabels[user.activeExam]}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Exam Switcher Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              role="listbox"
              aria-label="TNPSC Target Exam Selection"
            >
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Target Exam
              </div>
              {exams.map((exam) => (
                <button
                  key={exam}
                  data-testid={`exam-option-${exam}`}
                  onClick={() => {
                    onExamChange(exam);
                    setDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={user.activeExam === exam}
                  className={`w-full px-3 py-2 text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                    user.activeExam === exam
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{examLabels[exam]}</span>
                  {user.activeExam === exam && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Stat Badges & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak Flame Badge */}
          <div
            onClick={onStreakClick}
            data-testid="header-streak-badge"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
              onStreakClick ? "cursor-pointer active:scale-95 hover:border-amber-400" : ""
            } ${
              user.streakDays > 0
                ? "bg-amber-50 text-amber-900 border-amber-200 shadow-xs"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
            title={`${user.streakDays}-day learning streak. Click to view habit momentum.`}
            role={onStreakClick ? "button" : undefined}
            tabIndex={onStreakClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onStreakClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onStreakClick();
              }
            }}
          >
            <Flame className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${user.streakDays > 0 ? "text-amber-500 fill-amber-500 animate-pulse" : "text-slate-400"}`} />
            <span>{user.streakDays > 0 ? user.streakDays : "Rekindle"}</span>
          </div>

          {/* XP Badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-900 border border-amber-200"
            title={`${user.currentXp} Experience Points`}
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
            <span className="hidden xs:inline">{user.currentXp.toLocaleString()}</span>
            <span className="xs:hidden">{(user.currentXp / 1000).toFixed(1)}k</span>
            <span className="text-[10px] text-amber-700 font-medium">XP</span>
          </div>

          {/* Avatar with level badge ring */}
          <button
            onClick={onProfileClick}
            data-testid="header-avatar-btn"
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform active:scale-95"
            aria-label="View Student Profile"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs ring-2 ring-indigo-200">
              {user.displayName.charAt(0)}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-[9px] font-extrabold text-white px-1 rounded-full border border-white">
              {user.level}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

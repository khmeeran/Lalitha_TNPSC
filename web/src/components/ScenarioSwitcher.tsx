import React from "react";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { DashboardScenario, VelanMood } from "../types/dashboard";

interface ScenarioSwitcherProps {
  currentScenario: DashboardScenario;
  currentMood: VelanMood;
  onScenarioChange: (scenario: DashboardScenario) => void;
  onMoodChange: (mood: VelanMood) => void;
}

const scenarioOptions: { id: DashboardScenario; label: string; badge: string }[] = [
  { id: "RETURNING_ACTIVE", label: "Active Student", badge: "5-Day Streak" },
  { id: "NEW_STUDENT", label: "New Student", badge: "Day 1 / 0 XP" },
  { id: "COMPLETED_GOALS", label: "Goals Done", badge: "3/3 Quests + Chest" },
  { id: "MISSED_STREAK", label: "Broken Streak", badge: "Anti-Burnout" },
  { id: "REVISION_CLEARED", label: "Revision Cleared", badge: "0 Cards Due" },
];

const moodOptions: { id: VelanMood; label: string }[] = [
  { id: "GREETING", label: "Welcoming" },
  { id: "STUDY", label: "Study" },
  { id: "CELEBRATING", label: "Celebrating" },
  { id: "ENCOURAGING", label: "Encouraging" },
  { id: "RESTING", label: "Resting" },
];

export const ScenarioSwitcher: React.FC<ScenarioSwitcherProps> = ({
  currentScenario,
  currentMood,
  onScenarioChange,
  onMoodChange,
}) => {
  return (
    <aside
      aria-label="Scenario Preview Toolbar"
      className="bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 px-3 py-2 z-50 text-xs shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Scenario Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 bg-indigo-600/80 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider text-white shrink-0">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Stage 6 Testing</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {scenarioOptions.map((opt) => (
              <button
                key={opt.id}
                data-testid={`scenario-btn-${opt.id}`}
                onClick={() => onScenarioChange(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  currentScenario === opt.id
                    ? "bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-400"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span>{opt.label}</span>
                <span className="ml-1.5 text-[10px] text-indigo-200 opacity-80 hidden md:inline">
                  ({opt.badge})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Velan 5 Moods Preview Pill Group */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 mr-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Velan Mood:
          </span>
          {moodOptions.map((m) => (
            <button
              key={m.id}
              data-testid={`velan-mood-btn-${m.id}`}
              onClick={() => onMoodChange(m.id)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentMood === m.id
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

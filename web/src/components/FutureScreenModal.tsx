import React from "react";
import { X, Sparkles, Map, RefreshCw, BookOpen, User, Flame } from "lucide-react";
import { NavTabId } from "./BottomNavigation";

export type ModalPreviewTab = NavTabId | "lesson" | "streak";

interface FutureScreenModalProps {
  tab: ModalPreviewTab | null;
  onClose: () => void;
}

const screenMeta: Record<ModalPreviewTab, { screenNum: number | string; title: string; desc: string; icon: React.ElementType }> = {
  quest: {
    screenNum: 1,
    title: "Home / Adventure Dashboard",
    desc: "You are currently viewing Screen 1 — The core learning dashboard.",
    icon: Sparkles,
  },
  lesson: {
    screenNum: 3,
    title: "Bite-Sized Micro-Lesson Player",
    desc: "Screen 3 delivers interactive 5–7 minute focused lessons with adaptive flashcards, concept checks, and instant positive feedback.",
    icon: BookOpen,
  },
  realms: {
    screenNum: 2,
    title: "Learning Adventure Map",
    desc: "Screen 2 transforms the vast TNPSC syllabus into an interactive, visual fantasy realm connecting topic nodes from Sangam Literature to Indian Polity.",
    icon: Map,
  },
  revision: {
    screenNum: 6,
    title: "Spaced Repetition Hub (SRS)",
    desc: "Screen 6 features SuperMemo SM-2 smart flashcards, automated review queues, and rapid sub-5-minute active recall sessions.",
    icon: RefreshCw,
  },
  pyq: {
    screenNum: 7,
    title: "Previous-Year Question Vault",
    desc: "Screen 7 offers deep faceted search across official TNPSC Group 1, 2, and 4 questions with verified final answer keys.",
    icon: BookOpen,
  },
  profile: {
    screenNum: 5,
    title: "Aspirant Profile & Achievements",
    desc: "Screen 5 displays collectible cultural medallions, milestone badges, full syllabus analytics, and exam target settings.",
    icon: User,
  },
  streak: {
    screenNum: "Momentum",
    title: "Consistent Momentum & Habit Shield",
    desc: "Tracks your daily micro-habits with non-punitive streak recovery, milestone badges (Chola Warrior, Sangam Scholar), and anti-burnout pauses.",
    icon: Flame,
  },
};

export const FutureScreenModal: React.FC<FutureScreenModalProps> = ({
  tab,
  onClose,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!tab || tab === "quest") return null;

  const meta = screenMeta[tab];
  const Icon = meta.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      data-testid="future-screen-modal-backdrop"
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-5 shadow-2xl animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="future-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          data-testid="future-modal-close-btn"
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {typeof meta.screenNum === "number" ? `Roadmap: Screen ${meta.screenNum}` : meta.screenNum}
            </span>
            <h3 id="future-modal-title" className="text-base font-bold text-slate-900 leading-tight mt-1">
              {meta.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {meta.desc}
        </p>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 mb-4">
          <span className="font-semibold text-slate-700">Phase 1 Boundary Notice:</span> This screen is scheduled in sequence under the One Screen at a Time methodology.
        </div>

        <button
          onClick={onClose}
          data-testid="future-modal-return-btn"
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
        >
          Return to Dashboard (Screen 1)
        </button>
      </div>
    </div>
  );
};

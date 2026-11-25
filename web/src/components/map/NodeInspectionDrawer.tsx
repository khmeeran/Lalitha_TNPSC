"use client";

import React, { useEffect } from "react";
import { X, Sparkles, Clock, BookOpen, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { MapNode, AdventureRealm } from "../../types/adventureMap";

interface NodeInspectionDrawerProps {
  isOpen: boolean;
  node: MapNode | null;
  realm: AdventureRealm;
  onStartLesson: (node: MapNode) => void;
  onClose: () => void;
}

export const NodeInspectionDrawer: React.FC<NodeInspectionDrawerProps> = ({
  isOpen,
  node,
  realm,
  onStartLesson,
  onClose,
}) => {
  // Close on Escape key press for accessible keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !node) return null;

  const isCompleted = node.status === "COMPLETED";
  const isInProgress = node.status === "IN_PROGRESS";
  const isBoss = node.status === "CHAPTER_BOSS";
  const isLocked = node.status === "LOCKED";

  return (
    <>
      {/* Mobile Backdrop (z-40 behind header z-50 and drawer z-50) */}
      <div
        className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Drawer Container:
          - Mobile: Bottom Sheet sliding up (z-50 above backdrop z-40)
          - Desktop (>= 1024px): Docked Right Panel
      */}
      <aside
        className="fixed lg:static bottom-0 left-0 right-0 z-50 lg:z-10 bg-white rounded-t-3xl lg:rounded-2xl border-t lg:border border-slate-200/90 shadow-2xl lg:shadow-sm w-full lg:w-80 shrink-0 max-h-[85vh] lg:max-h-none overflow-y-auto animate-in slide-in-from-bottom lg:animate-none duration-200"
        role="complementary"
        aria-label={`Topic Inspection: ${node.titleEn}`}
        data-testid="node-inspection-drawer"
      >
        <div className="p-4 sm:p-5 space-y-4 pb-[max(env(safe-area-inset-bottom),24px)] lg:pb-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs"
                style={{ backgroundColor: realm.themeColor }}
              >
                Unit {realm.unitNumber}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {node.subClause}
              </span>
            </div>

            {/* Close Button with >= 44x44px visible, 56x56px touch target Option 1 */}
            <button
              onClick={onClose}
              aria-label="Close topic inspection drawer"
              className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target-56"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Topic Meta */}
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug">
              {node.titleTa}
            </h3>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              {node.titleEn}
            </p>
          </div>

          {/* Key Metrics Chips */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Duration</span>
                <span className="block text-xs font-bold text-slate-800">{node.estimatedMinutes} mins</span>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200/70 rounded-xl p-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="block text-[9px] uppercase font-bold text-indigo-400">Reward</span>
                <span className="block text-xs font-bold text-indigo-900">+{node.xpReward} XP</span>
              </div>
            </div>
          </div>

          {/* Official PYQ Provenance Badge if applicable */}
          {node.pyqProvenance && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[9px] font-black uppercase text-amber-600">
                  Past Exam Tested (Verified Crosswalk)
                </span>
                <span className="block text-xs font-bold text-amber-900 truncate">
                  {node.pyqProvenance}
                </span>
              </div>
            </div>
          )}

          {/* Velan's Companion Pedagogical Whisper */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
              <span>🪶 Velan's Exam Tip:</span>
            </div>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              {node.velanTipTa}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium italic">
              "{node.velanTipEn}"
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 pb-safe">
            {isLocked ? (
              <button
                disabled
                className="w-full py-3 px-4 rounded-xl bg-slate-200 text-slate-500 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-90 shadow-2xs"
                title="This lesson is locked. Complete previous topics along the trail to unlock."
              >
                <span>🔒 Complete Previous Node to Unlock</span>
              </button>
            ) : isCompleted ? (
              <div className="space-y-2">
                <button
                  onClick={() => onStartLesson(node)}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-900/10 active:scale-98 transition-transform cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Replay Micro-Lesson (+0 XP)</span>
                </button>
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mastered! Flashcards active in Memory Vault</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onStartLesson(node)}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-98 transition-transform group cursor-pointer"
              >
                <span>{isBoss ? "Begin Chapter Boss Battle" : "Start Quest with Lalitha"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

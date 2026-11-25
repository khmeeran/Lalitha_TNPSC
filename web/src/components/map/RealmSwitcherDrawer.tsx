"use client";

import React, { useEffect, useRef } from "react";
import { X, Check, Lock, Compass, Sparkles } from "lucide-react";
import { AdventureRealm, RealmId } from "../../types/adventureMap";

interface RealmSwitcherDrawerProps {
  isOpen: boolean;
  realms: AdventureRealm[];
  activeRealmId: RealmId;
  onSelectRealm: (realmId: RealmId) => void;
  onClose: () => void;
}

export const RealmSwitcherDrawer: React.FC<RealmSwitcherDrawerProps> = ({
  isOpen,
  realms,
  activeRealmId,
  onSelectRealm,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trapping and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // Focus first focusable element when opened
    const modalEl = modalRef.current;
    if (modalEl) {
      const focusableElements = modalEl.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalEl) {
        const focusables = modalEl.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Clean canonical syllabus order: Unit 1 to Unit 10
  const sortedRealms = [...realms].sort((a, b) => a.unitNumber - b.unitNumber);

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="TNPSC Quest Syllabus Realms Switcher"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                The 10 Realms
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                TNPSC General Studies Product-Level Learning Taxonomy (Prototype Crosswalk)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close realm switcher modal"
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors touch-target-56"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realms Grid List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 sm:space-y-3 flex-1">
          {sortedRealms.map((realm) => {
            const isActive = realm.id === activeRealmId;

            return (
              <button
                key={realm.id}
                onClick={() => {
                  onSelectRealm(realm.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-150 group ${
                  isActive
                    ? "bg-indigo-50/80 border-indigo-500/80 ring-2 ring-indigo-400/30 shadow-xs"
                    : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70"
                }`}
                aria-current={isActive ? "true" : undefined}
                data-testid={`realm-switcher-item-${realm.id}`}
              >
                {/* Unit Color Badge */}
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-black text-xs"
                  style={{ backgroundColor: realm.themeColor }}
                >
                  U{realm.unitNumber}
                </div>

                {/* Realm Titles & Crosswalk Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {realm.nameTa}
                    </span>
                    {isActive && (
                      <span className="text-[10px] bg-indigo-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium truncate">
                    {realm.nameEn}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {realm.officialSourceExam}
                  </p>
                </div>

                {/* Mastery Progress Bar & Stats */}
                <div className="flex flex-col items-end shrink-0 w-20 sm:w-24">
                  <span className="text-xs font-bold text-slate-700">
                    {realm.masteryPercentage}%
                  </span>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${realm.masteryPercentage}%`,
                        backgroundColor: realm.themeColor,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 font-medium">
                    {realm.completedNodes}/{realm.totalNodes} Nodes
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            💡 Tap any realm to travel along its syllabus trail with Lalitha and Velan.
          </p>
        </div>
      </div>
    </div>
  );
};

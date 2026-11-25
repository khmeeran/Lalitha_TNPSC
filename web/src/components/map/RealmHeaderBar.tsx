"use client";

import React from "react";
import { ArrowLeft, ChevronDown, Flame, Zap, Compass } from "lucide-react";
import { AdventureRealm } from "../../types/adventureMap";

interface RealmHeaderBarProps {
  realm: AdventureRealm;
  streakDays: number;
  currentXp: number;
  onBackToDashboard: () => void;
  onOpenRealmSwitcher: () => void;
}

export const RealmHeaderBar: React.FC<RealmHeaderBarProps> = ({
  realm,
  streakDays,
  currentXp,
  onBackToDashboard,
  onOpenRealmSwitcher,
}) => {
  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs px-3 sm:px-6 py-2.5 transition-all"
      role="banner"
      aria-label="Adventure Realm Navigation Header"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Back Button + Realm Title & Unit Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Back to Home Dashboard CTA (min 44x44px visible, 56x56px touch target Option 1) */}
          <button
            onClick={onBackToDashboard}
            aria-label="Back to Adventure Dashboard"
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-transform touch-target-56"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Active Realm Selector Trigger Button */}
          <button
            onClick={onOpenRealmSwitcher}
            aria-label={`Current realm: Unit ${realm.unitNumber} ${realm.nameEn}. Tap to switch realm.`}
            className="flex items-center gap-1.5 sm:gap-2.5 text-left p-1 rounded-xl hover:bg-slate-100/80 transition-colors group min-w-0"
          >
            {/* Unit Indicator Pill */}
            <span
              className="hidden sm:inline-flex shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs"
              style={{ backgroundColor: realm.themeColor }}
            >
              Unit {realm.unitNumber}
            </span>

            {/* Realm Titles */}
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate tracking-tight group-hover:text-indigo-600 transition-colors">
                  {realm.nameTa}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-y-0.5 shrink-0" />
              </div>
              <p className="text-[10px] font-medium text-slate-500 truncate">
                {realm.nameEn} • {realm.masteryPercentage}% Mastered
              </p>
            </div>
          </button>
        </div>

        {/* Right Section: Momentum Badges (Responsive layout for 320px vs 360px+) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Narrow Viewport (320px): Merged Compact Chip */}
          <div className="xs:hidden flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-1 rounded-lg text-[10px] font-extrabold shadow-2xs">
            <span className="flex items-center gap-0.5 text-amber-600">
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              {streakDays}
            </span>
            <span className="text-amber-300">|</span>
            <span className="flex items-center gap-0.5 text-indigo-700">
              <Zap className="w-3 h-3 fill-indigo-500 text-indigo-500" />
              {currentXp > 999 ? `${(currentXp / 1000).toFixed(1)}k` : currentXp}
            </span>
          </div>

          {/* Standard Viewport (>= 360px): Individual Badges */}
          <div className="hidden xs:flex items-center gap-1.5 sm:gap-2">
            {/* Streak Flame */}
            <div
              className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs"
              aria-label={`${streakDays} days streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{streakDays}d</span>
            </div>

            {/* Total XP Pill */}
            <div
              className="flex items-center gap-1 bg-indigo-50 text-indigo-900 border border-indigo-200/80 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs"
              aria-label={`${currentXp} total experience points`}
            >
              <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
              <span>{currentXp} XP</span>
            </div>
          </div>

          {/* Switch Realm Icon Shortcut Button (min 44x44px visible, 56x56px touch target Option 1) */}
          <button
            onClick={onOpenRealmSwitcher}
            aria-label="Open 10 Realms Map Switcher"
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors touch-target-56"
          >
            <Compass className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

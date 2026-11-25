"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useLearning } from "../../context/LearningContext";
import { GameShell } from "../game/GameShell";
import { WizardStats } from "../dashboard/WizardStats";

export const ProgressDashboard: React.FC = () => {
  const { state } = useLearning();

  const totalSyllabusNodes = 39;
  const completedNodesCount = (state.completedNodeIds || []).length;
  const streak = state.user?.streakDays || 1;
  const manaPoints = (state.user as any)?.mana ?? 100;

  return (
    <GameShell
      activeRealmTitleTa="Reliquary • Achievement Sanctum"
      activeRealmTitleEn="Mastery Reliquary & Hall of Chronicles"
      companionSnippet="Lalitha, every spell power crystal you awaken brings you closer to Commission selection!"
    >
      <div data-testid="progress-dashboard" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Navigation Bar to Return to Sanctuary / Trials */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-amber-600/40 text-amber-300 text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sanctuary & Trials</span>
          </Link>
          <span className="text-xs font-serif italic text-amber-300/80">
            TNPSC Wizard Mastery Reliquary • Level {state.user.level} {state.user.levelTitle}
          </span>
        </div>

        {/* 1. Scholar Explorer Credential Pedestal */}
        <section className="bg-slate-900/95 rounded-3xl border-2 border-amber-600/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
            {/* Left: Lalitha & Rank Badge */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950 shadow-xl flex items-center justify-center">
                  <img
                    src="/assets/lalitha_character.png"
                    alt="Lalitha"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 border-slate-950">
                  {state.user.level}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                    Level {state.user.level} • {state.user.levelTitle}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-orange-300 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/40">
                    <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400 animate-pulse" />
                    {streak} Days Streak Surge
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-amber-100">
                  {state.user.name}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-amber-300/80 font-serif italic">
                  {state.user.levelTitle} • TNPSC Commission Aspirant Scholar
                </p>
              </div>
            </div>

            {/* Right: Telemetry Loot Metrics */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-700/40 text-center min-w-[90px]">
                <span className="block text-2xl font-black text-amber-400">{state.user.currentXp}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP ESSENCE</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-700/40 text-center min-w-[90px]">
                <span className="block text-2xl font-black text-cyan-300">{manaPoints}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">COGNITIVE MANA</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-700/40 text-center min-w-[90px]">
                <span className="block text-2xl font-black text-emerald-400">{completedNodesCount}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOMES UNSEALED</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE GAMIFIED WIZARD STATS & DAILY ORACLE ENGINE */}
        <WizardStats />

        {/* 3. PHYSICAL ARTEFACT CABINET (KEELADI THROUGH CHOLA RELICS) */}
        <section className="bg-slate-900/90 rounded-3xl border-2 border-amber-600/40 p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-800/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950 shadow-lg shrink-0">
                <img
                  src="/assets/prop_relic_urn.png"
                  alt="Sacred Keeladi Urn Relic"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-100 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Sacred Relic Pedestals</span>
                </h3>
                <p className="text-xs text-amber-300/80 font-serif italic">
                  Historical insignias earned from Keeladi through the Chola Golden Age
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-400/30">
              {state.badges.filter((b) => b.isUnlocked).length} / {state.badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {state.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[140px] ${
                  badge.isUnlocked
                    ? "bg-slate-950/80 border-amber-400/80 shadow-lg shadow-amber-500/10 scale-[1.02]"
                    : "bg-slate-950/40 border-slate-800 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div>
                  <h4 className="text-xs font-bold text-amber-200">{badge.titleTa}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{badge.descriptionTa}</p>
                </div>
                {badge.isUnlocked ? (
                  <span className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="mt-2 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </GameShell>
  );
};

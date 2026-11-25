"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Map,
  BookOpen,
  Sword,
  Scroll,
  Archive,
  Award,
  FileText,
  Volume2,
  VolumeX,
  Flame,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useLearning } from "../../context/LearningContext";
import { useLanguage } from "../../context/LanguageContext";
import { GlobalLanguageToggle } from "../translation/GlobalLanguageToggle";
import { VelanCodexButton } from "../codex/VelanCodexModal";
import { LalithaAvatar } from "../mascot/LalithaAvatar";
import { VelanMascotSvg } from "../VelanMascotSvg";
import { isSpeechSynthesisSupported, stopNarration } from "../../utils/speechSynthesis";

interface GameShellProps {
  children: React.ReactNode;
  activeRealmTitleTa?: string;
  activeRealmTitleEn?: string;
  companionSnippet?: string;
  showDialogue?: boolean;
}

export const GameShell: React.FC<GameShellProps> = ({
  children,
  activeRealmTitleTa = "Traveler's Sanctuary • Adventure Start",
  activeRealmTitleEn = "Traveler's Sanctuary • Adventure Start",
  companionSnippet,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleAudioNarration } = useLearning();
  const { isTamil } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [velanSnippet, setVelanSnippet] = useState(
    companionSnippet || "Velan: 'Lalitha! The Kalinga War's aftermath...'"
  );

  useEffect(() => {
    if (companionSnippet) {
      setVelanSnippet(companionSnippet);
    }
  }, [companionSnippet]);

  const navItems = [
    { href: "/", labelTa: "Sanctuary", labelEn: "Sanctuary", icon: Compass, id: "home" },
    { href: "/realms", labelTa: "World Atlas", labelEn: "World Atlas", icon: Map, id: "realms" },
    { href: "/lesson/node_hist_3", labelTa: "Chamber", labelEn: "Chamber", icon: BookOpen, id: "lesson" },
    { href: "/quiz", labelTa: "Boss Trials", labelEn: "Boss Trials", icon: Sword, id: "quiz" },
    { href: "/revision", labelTa: "Memory Sanctum", labelEn: "Memory Sanctum", icon: Scroll, id: "revision", badge: state.flashcards.length },
    { href: "/pyq", labelTa: "Royal Archives", labelEn: "Royal Archives", icon: Archive, id: "pyq" },
    { href: "/progress", labelTa: "Reliquary", labelEn: "Reliquary", icon: Award, id: "progress" },
    { href: "/exam", labelTa: "Commission Exam", labelEn: "Commission Exam", icon: FileText, id: "exam" },
  ];

  return (
    <div className="min-h-screen bg-[#0F0320] text-[#FFF8DC] flex flex-col font-game-body selection:bg-[#6A0DAD] selection:text-[#FFD700] relative overflow-x-hidden">
      {/* 1. ATMOSPHERIC CANVAS BACKDROP (Royal Purple & Deep Indigo Ambient Glow) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#6A0DAD]/20 via-[#1C053A] to-[#0F0320]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6A0DAD]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl" />
        {/* Subtle magical grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#FFD700_1px,transparent_1px),linear-gradient(to_bottom,#FFD700_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* 2. TOP ADVENTURE HUD */}
      <header
        role="banner"
        className="sticky top-0 z-40 bg-[#1C053A]/90 backdrop-blur-md border-b-2 border-[#FFD700]/40 shadow-2xl transition-all"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Game Title & Realm Compass */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-hidden focus:ring-2 focus:ring-[#FFD700] rounded-xl p-1"
              aria-label="Return to Sanctuary Campfire"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#B8860B] p-0.5 shadow-lg shadow-[#FFD700]/25 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
                <span className="text-xl">🧙‍♀️</span>
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-fantasy-header text-[#FFD700] text-sm tracking-wider uppercase">
                    TNPSC Wizard
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#6A0DAD]/40 text-[#FFD700] border border-[#FFD700]/40">
                    RPG
                  </span>
                </div>
                <div className="text-[11px] text-[#2ECC71] font-bold">
                  {isTamil ? activeRealmTitleTa : activeRealmTitleEn}
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Velan Lore Whispers (Hidden on small mobile) */}
          <div className="hidden md:flex items-center gap-2.5 max-w-md bg-[#0F0320]/80 border border-[#FFD700]/40 rounded-full px-3.5 py-1.5 shadow-inner">
            <div className="w-7 h-7 shrink-0 rounded-full overflow-hidden border border-[#2ECC71] bg-[#0F0320] flex items-center justify-center">
              <img src="/assets/velan_wizard_companion.png" alt="Velan" width={28} height={28} className="w-full h-full object-contain" />
            </div>
            <div className="text-xs text-[#FFF8DC] truncate font-medium">
              <span className="text-[#FFD700] font-bold mr-1">Velan:</span>
              <span>"{velanSnippet}"</span>
            </div>
          </div>

          {/* Right: Explorer Stats & Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Daily Habit Flame */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0F0320] border border-orange-500/60 text-orange-300 shadow-xs"
              title={`${state.user.streakDays}-Day Momentum Shield Active`}
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
              <span className="text-xs font-black">{state.user.streakDays}d</span>
            </div>

            {/* Knowledge Essence (XP) */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0F0320] border border-[#FFD700]/50 text-[#FFD700]"
              title={`Level ${state.user.level}: ${state.user.levelTitle} (${state.user.currentXp} XP)`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="text-xs font-bold">{state.user.currentXp} XP</span>
            </div>

            {/* Audio Narration Toggle */}
            <button
              onClick={toggleAudioNarration}
              className={`p-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
                state.settings.audioNarrationEnabled
                  ? "bg-[#6A0DAD]/40 border-[#FFD700] text-[#FFD700] shadow-inner"
                  : "bg-[#0F0320] border-[#3F0569] text-slate-400 hover:text-slate-200"
              }`}
              title={state.settings.audioNarrationEnabled ? "Mute Narration" : "Enable Voice Narration"}
              aria-label="Toggle Voice Narration"
            >
              {state.settings.audioNarrationEnabled ? (
                <Volume2 className="w-4 h-4 text-[#FFD700]" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Velan's Codex & Global Bilingual Language Toggle */}
            <VelanCodexButton />
            <GlobalLanguageToggle />

            {/* Mobile Navigation Drawer Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0F0320] border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#1C053A] transition-colors"
              aria-label="Open Game Travel Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. MOBILE GAME TRAVEL DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
            <div className="flex items-center gap-2">
              <span className="text-xl">🗺️</span>
              <span className="font-bold text-amber-300">Travel Guide</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 py-6 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                    isActive
                      ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/10 font-bold"
                      : "bg-slate-900/60 border-amber-900/30 text-slate-300 hover:bg-slate-900 hover:text-amber-300 font-medium"
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span className="text-xs font-bold">{item.labelTa}</span>
                  <span className="text-[10px] text-slate-400">{item.labelEn}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-amber-900/40 text-center text-xs text-slate-400">
            TNPSC Quest • Educational Adventure RPG
          </div>
        </div>
      )}

      {/* 4. MAIN GAMEPLAY VIEWPORT */}
      <main className="flex-1 relative z-10 flex flex-col pb-20 lg:pb-24">
        {children}
      </main>

      {/* 5. CINEMATIC RPG COMMAND DOCK (Desktop & Tablet Persistent Bottom Travel Bar) */}
      <nav
        role="navigation"
        aria-label="Adventure World Command Dock"
        className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-amber-900/50 shadow-2xl py-2 px-3 transition-transform"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-around gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative flex flex-col items-center justify-center py-1.5 px-2 sm:px-3 rounded-xl transition-all duration-150 group min-w-[52px] sm:min-w-[68px] ${
                  isActive
                    ? "text-amber-300 font-bold scale-105"
                    : "text-slate-400 hover:text-amber-200 hover:bg-slate-900/60 font-medium"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active Golden Glow Underlay */}
                {isActive && (
                  <div className="absolute inset-0 bg-amber-500/10 rounded-xl border border-amber-400/30 shadow-xs" />
                )}

                <div className="relative">
                  <Icon className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:scale-110 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-950">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate max-w-[60px] sm:max-w-none">
                  {isTamil ? item.labelTa : item.labelEn}
                </span>

                {isActive && (
                  <span className="absolute bottom-0 w-4 h-0.5 bg-amber-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

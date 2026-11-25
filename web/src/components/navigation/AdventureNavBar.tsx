"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Map,
  BookOpen,
  Swords,
  Award,
  RefreshCw,
  Archive,
  GraduationCap,
  Volume2,
  VolumeX,
  Menu,
  X,
  Flame,
} from "lucide-react";
import { useLearning } from "../../context/LearningContext";

interface NavLinkItem {
  href: string;
  labelTa: string;
  labelEn: string;
  icon: React.ElementType;
  badge?: number;
}

export const AdventureNavBar: React.FC<{ titleTa?: string; titleEn?: string }> = ({
  titleTa,
  titleEn,
}) => {
  const pathname = usePathname();
  const { state, toggleAudioNarration } = useLearning();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cappedDue, setCappedDue] = useState(0);

  // Compute cards due on client mount
  useEffect(() => {
    const todayStr = "2026-11-23";
    const due = state.flashcards.filter((c) => c.dueDate <= todayStr).length;
    setCappedDue(Math.min(10, due));
  }, [state.flashcards]);

  const navLinks: NavLinkItem[] = [
    { href: "/", labelTa: "Sanctuary", labelEn: "Sanctuary", icon: Compass },
    { href: "/realms", labelTa: "Realms Map", labelEn: "Realms Map", icon: Map },
    { href: "/lesson/node_hist_3", labelTa: "Study Chamber", labelEn: "Study Chamber", icon: BookOpen },
    { href: "/quiz", labelTa: "Boss Battles", labelEn: "Boss Battles", icon: Swords },
    { href: "/progress", labelTa: "Milestones", labelEn: "Milestones", icon: Award },
    {
      href: "/revision",
      labelTa: "Memory Sanctum",
      labelEn: "SM-2 Revision",
      icon: RefreshCw,
      badge: cappedDue > 0 ? cappedDue : undefined,
    },
    { href: "/pyq", labelTa: "PYQ Archive", labelEn: "PYQ Archive", icon: Archive },
    { href: "/exam", labelTa: "Mock Exam", labelEn: "Mock Exam", icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Brand & Active Screen Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform active:scale-95"
              aria-label="Return to Adventure Sanctuary"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-base">
                ⚔️
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  TNPSC Quest
                </span>
                <span className="block text-[10px] text-amber-700 font-medium -mt-1">
                  Learning Adventure
                </span>
              </div>
            </Link>

            {(titleTa || titleEn) && (
              <div className="border-l border-slate-300 pl-3">
                <h1 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                  {titleTa}
                </h1>
                {titleEn && (
                  <p className="text-[10px] text-slate-500 hidden md:block line-clamp-1">
                    {titleEn}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Center: Desktop Nav Items (visible on lg screens) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href.startsWith("/lesson") && pathname.startsWith("/lesson"));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.labelEn}</span>
                  {link.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Live Telemetry, Audio Toggle & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Narration Toggle */}
            <button
              onClick={toggleAudioNarration}
              className={`p-2 rounded-xl border transition-all touch-target-56 ${
                state.settings.audioNarrationEnabled
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-slate-100 border-slate-200 text-slate-400"
              }`}
              title={
                state.settings.audioNarrationEnabled
                  ? "Audio Narration Active (Web Speech API)"
                  : "Audio Narration Muted"
              }
              aria-label={
                state.settings.audioNarrationEnabled
                  ? "Audio Narration Active"
                  : "Audio Narration Muted"
              }
            >
              {state.settings.audioNarrationEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Streak & XP Display */}
            <div className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-200 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold text-amber-900 shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{state.user.streakDays}d</span>
            </div>

            <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold text-indigo-900 shadow-2xs">
              <span>⭐</span>
              <span>{state.user.currentXp} XP</span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors touch-target-56"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open adventure navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-xl animate-in slide-in-from-top-2 duration-150"
        >
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
            Adventure Destinations
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href.startsWith("/lesson") && pathname.startsWith("/lesson"));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="truncate">
                    <div className="font-bold truncate">{link.labelTa}</div>
                    <div className={`text-[10px] ${isActive ? "text-indigo-100" : "text-slate-400"}`}>
                      {link.labelEn}
                    </div>
                  </div>
                  {link.badge && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

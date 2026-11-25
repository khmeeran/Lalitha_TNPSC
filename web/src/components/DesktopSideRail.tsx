import React from "react";
import { Compass, Map, RefreshCw, BookOpen, User, Flame } from "lucide-react";
import { NavTabId } from "./BottomNavigation";
import { VelanCompanionHero } from "./VelanCompanionHero";
import { VelanMood, UserStats } from "../types/dashboard";

interface DesktopSideRailProps {
  activeTab: NavTabId;
  revisionBadgeCount?: number;
  onTabSelect: (tab: NavTabId) => void;
  velanMood: VelanMood;
  velanGreeting: string;
  velanTips: string[];
  user: UserStats;
  className?: string;
}

interface NavItem {
  id: NavTabId;
  label: string;
  description: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "quest", label: "Adventure Quest", description: "Home & active lesson", icon: Compass },
  { id: "realms", label: "Syllabus Realms", description: "Knowledge map", icon: Map },
  { id: "revision", label: "Spaced Revision", description: "Flashcard memory bank", icon: RefreshCw },
  { id: "pyq", label: "PYQ Vault", description: "Verified commission keys", icon: BookOpen },
  { id: "profile", label: "Aspirant Profile", description: "Stats & settings", icon: User },
];

export const DesktopSideRail: React.FC<DesktopSideRailProps> = ({
  activeTab,
  revisionBadgeCount = 0,
  onTabSelect,
  velanMood,
  velanGreeting,
  velanTips,
  user,
  className = "",
}) => {
  return (
    <aside
      className={`flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-20 bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs ${className}`}
      aria-label="Desktop Navigation Sidebar"
    >
      <div className="space-y-4">
        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasBadge = item.id === "revision" && revisionBadgeCount > 0;

            return (
              <button
                key={item.id}
                data-testid={`nav-${item.id}-btn`}
                onClick={() => onTabSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? "bg-indigo-50/90 text-indigo-700 font-bold border border-indigo-200/80 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm tracking-tight">{item.label}</div>
                    <div className="text-[10px] text-slate-400 hidden xl:block font-normal">
                      {item.description}
                    </div>
                  </div>
                </div>

                {hasBadge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-extrabold shadow-2xs">
                    {revisionBadgeCount} due
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Velan Interactive Companion on Desktop */}
        <div className="pt-2">
          <VelanCompanionHero
            mood={velanMood}
            greeting={velanGreeting}
            tips={velanTips}
            userName={user.displayName}
            size="compact"
          />
        </div>
      </div>

      {/* Bottom Student Profile Summary Card */}
      <div className="pt-3 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-100 shrink-0">
              {user.displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {user.displayName}
              </div>
              <div className="text-[10px] text-indigo-600 font-semibold truncate">
                Level {user.level}: {user.levelTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{user.streakDays}d</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

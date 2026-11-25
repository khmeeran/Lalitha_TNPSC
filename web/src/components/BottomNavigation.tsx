import React from "react";
import { Compass, Map, RefreshCw, BookOpen, User } from "lucide-react";

export type NavTabId = "quest" | "realms" | "revision" | "pyq" | "profile";

interface BottomNavigationProps {
  activeTab: NavTabId;
  revisionBadgeCount?: number;
  onTabSelect: (tab: NavTabId) => void;
}

interface TabItem {
  id: NavTabId;
  label: string;
  icon: React.ElementType;
}

const tabs: TabItem[] = [
  { id: "quest", label: "Quest", icon: Compass },
  { id: "realms", label: "Realms", icon: Map },
  { id: "revision", label: "Revision", icon: RefreshCw },
  { id: "pyq", label: "PYQ Vault", icon: BookOpen },
  { id: "profile", label: "Profile", icon: User },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  revisionBadgeCount = 0,
  onTabSelect,
}) => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5"
      aria-label="Mobile Navigation Bar"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isRevisionWithBadge = tab.id === "revision" && revisionBadgeCount > 0;

          return (
            <button
              key={tab.id}
              onClick={() => onTabSelect(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? "text-indigo-600 font-bold"
                  : "text-slate-500 hover:text-slate-700 font-medium"
              }`}
              aria-label={`${tab.label} tab`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />

                {/* Badge for Revision cards due */}
                {isRevisionWithBadge && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                    {revisionBadgeCount}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight">
                {tab.label}
              </span>

              {/* Active Pill Indicator Dot */}
              {isActive && (
                <span className="absolute bottom-0 w-3 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

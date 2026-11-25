import React from "react";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { SubjectRealm } from "../types/dashboard";

interface AdventureRealmsGridProps {
  realms: SubjectRealm[];
  onSelectRealm: (realm: SubjectRealm) => void;
  onViewAllRealms: () => void;
  className?: string;
}

export const AdventureRealmsGrid: React.FC<AdventureRealmsGridProps> = ({
  realms,
  onSelectRealm,
  onViewAllRealms,
  className = "",
}) => {
  return (
    <section className={`transition-all ${className}`} aria-label="TNPSC Syllabus Realms">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Explore Realms
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Syllabus worlds waiting to be conquered.
          </p>
        </div>

        <button
          onClick={onViewAllRealms}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-indigo-50"
          aria-label="View Full Learning Adventure Map"
        >
          <span>View Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mobile: Horizontal Snap Scroll Carousel (< 768px) */}
      <div className="md:hidden flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar snap-x snap-mandatory -mx-4 px-4">
        {realms.map((realm) => (
          <div
            key={realm.id}
            onClick={() => onSelectRealm(realm)}
            className={`snap-center shrink-0 w-[210px] p-3.5 rounded-2xl bg-white border transition-all cursor-pointer select-none active:scale-98 shadow-xs ${
              realm.isActive
                ? "border-indigo-400 ring-2 ring-indigo-100 shadow-sm"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <RealmCardContent realm={realm} />
          </div>
        ))}
      </div>

      {/* Tablet & Desktop: Responsive 2-Column / 3-Column Grid (>= 768px) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {realms.map((realm) => (
          <div
            key={realm.id}
            onClick={() => onSelectRealm(realm)}
            className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer select-none hover:shadow-md active:scale-98 ${
              realm.isActive
                ? "border-indigo-400 ring-2 ring-indigo-100 shadow-xs"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <RealmCardContent realm={realm} />
          </div>
        ))}
      </div>
    </section>
  );
};

// Reusable card content
const RealmCardContent: React.FC<{ realm: SubjectRealm }> = ({ realm }) => {
  return (
    <div className="flex flex-col justify-between h-full">
      {/* Top Row: Icon + Active Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-2xs"
          style={{ backgroundColor: `${realm.themeColor}15`, color: realm.themeColor }}
        >
          {realm.icon}
        </div>

        {realm.isActive ? (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
            Active
          </span>
        ) : realm.masteryPercentage >= 100 ? (
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> Mastered
          </span>
        ) : realm.unlockedChapters === 0 ? (
          <span className="text-slate-400 text-xs">
            <Lock className="w-3 h-3" />
          </span>
        ) : null}
      </div>

      {/* Realm Title */}
      <div className="mb-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
          {realm.name}
        </h4>
        <span className="text-[11px] text-slate-500 font-medium">
          {realm.unlockedChapters} / {realm.totalChapters} Units Unlocked
        </span>
      </div>

      {/* Mastery Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
          <span className="text-slate-400">Mastery</span>
          <span style={{ color: realm.themeColor }}>{realm.masteryPercentage}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${realm.masteryPercentage}%`,
              backgroundColor: realm.themeColor,
            }}
          />
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Star,
  Sparkles,
  MapPin,
} from "lucide-react";
import { triggerRewardParticles } from "../../utils/particleEngine";
import { useLearning } from "../../context/LearningContext";

export interface WorldNode {
  id: string;
  route: string;
  titleTa: string;
  titleEn: string;
  icon: string;
  imageSrc?: string;
  stars: number;
  isUnlocked: boolean;
  isBoss?: boolean;
}

export const HorizontalWorldMapNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { state } = useLearning();

  const nodes: WorldNode[] = [
    {
      id: "node_sanctuary",
      route: "/",
      titleTa: "Sanctuary",
      titleEn: "Sanctuary",
      icon: "⛺",
      stars: 3,
      isUnlocked: true,
    },
    {
      id: "node_lesson",
      route: "/lesson/node_hist_3",
      titleTa: "Inscription",
      titleEn: "Study",
      icon: "📜",
      imageSrc: "/assets/prop_study_scroll.png",
      stars: 3,
      isUnlocked: true,
    },
    {
      id: "node_realms",
      route: "/realms",
      titleTa: "10 Realms",
      titleEn: "Atlas",
      icon: "🗺️",
      stars: 2,
      isUnlocked: true,
    },
    {
      id: "node_quiz",
      route: "/quiz",
      titleTa: "Chola Battle",
      titleEn: "Boss Arena",
      icon: "⚔️",
      imageSrc: "/assets/prop_boss_gate.png",
      stars: 1,
      isUnlocked: true,
      isBoss: true,
    },
    {
      id: "node_progress",
      route: "/progress",
      titleTa: "Treasury",
      titleEn: "Relics",
      icon: "🏺",
      imageSrc: "/assets/prop_relic_urn.png",
      stars: 3,
      isUnlocked: true,
    },
    {
      id: "node_revision",
      route: "/revision",
      titleTa: "Memory Sanctum",
      titleEn: "Revision",
      icon: "🧰",
      imageSrc: "/assets/prop_revision_chest.png",
      stars: 2,
      isUnlocked: true,
    },
    {
      id: "node_pyq",
      route: "/pyq",
      titleTa: "Royal Archives",
      titleEn: "PYQ Vault",
      icon: "🏛️",
      stars: 1,
      isUnlocked: true,
    },
    {
      id: "node_exam",
      route: "/exam",
      titleTa: "Exam Arena",
      titleEn: "Exam Hall",
      icon: "👑",
      stars: 0,
      isUnlocked: true,
      isBoss: true,
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleNodeClick = (e: React.MouseEvent, node: WorldNode) => {
    if (!node.isUnlocked) return;

    triggerRewardParticles({
      type: node.isBoss ? "CONFETTI" : "STAR",
      originX: e.clientX,
      originY: e.clientY,
      count: 12,
    });

    router.push(node.route);
  };

  return (
    <nav
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-1 select-none"
      aria-label="World Map Horizontal Level Navigator"
    >
      <div className="relative rounded-3xl bg-slate-900/90 border-2 border-amber-600/40 p-2 sm:p-2.5 shadow-xl backdrop-blur-md">
        {/* Header Label: World Map Pathway */}
        <div className="flex items-center justify-between mb-1 px-2">
          <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs">
            <span>🗺️ Adventure World Path</span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
              • Mario & Candy Crush Map
            </span>
          </div>

          {/* Left/Right Scroll Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 flex items-center justify-center border border-amber-600/30 transition-transform active:scale-90"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 flex items-center justify-center border border-amber-600/30 transition-transform active:scale-90"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 sm:gap-5 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        >
          {nodes.map((node, index) => {
            const isActive = pathname === node.route;

            return (
              <div
                key={node.id}
                className="flex items-center shrink-0 group relative"
              >
                {/* Node Milestone Button */}
                <button
                  onClick={(e) => handleNodeClick(e, node)}
                  disabled={!node.isUnlocked}
                  className={`relative flex flex-col items-center justify-center w-18 sm:w-22 p-1.5 rounded-2xl transition-all duration-200 active:scale-90 ${
                    !node.isUnlocked
                      ? "opacity-50 grayscale cursor-not-allowed bg-slate-800/60 border border-slate-700"
                      : isActive
                      ? "bg-gradient-to-b from-amber-500 to-amber-700 text-slate-950 font-black shadow-lg shadow-amber-500/40 border-2 border-amber-200 scale-105"
                      : node.isBoss
                      ? "bg-gradient-to-b from-rose-950/80 to-slate-900 border-2 border-rose-500/60 hover:border-rose-400 text-rose-200 shadow-md hover:scale-105"
                      : "bg-slate-800/90 border-2 border-amber-600/30 hover:border-amber-400 text-slate-100 shadow-md hover:scale-105"
                  }`}
                >
                  {/* Active Beacon Avatar Pin ("You are Here") */}
                  {isActive && (
                    <div className="absolute -top-3 px-1.5 py-0.2 rounded-full bg-amber-300 text-slate-950 text-[8px] font-black uppercase tracking-wider shadow flex items-center gap-0.5 animate-bounce">
                      <MapPin className="w-2 h-2" />
                      <span>Here</span>
                    </div>
                  )}

                  {/* Icon */}
                  {node.imageSrc ? (
                    <div className="w-8 h-8 rounded-xl overflow-hidden my-0.5 border border-amber-300/40 shadow-sm group-hover:scale-110 transition-transform bg-slate-950">
                      <img src={node.imageSrc} alt={node.titleEn} width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-xl sm:text-2xl my-0.5 group-hover:scale-110 transition-transform">
                      {node.icon}
                    </div>
                  )}

                  {/* Title */}
                  <span
                    className={`text-[10px] sm:text-[11px] font-black truncate max-w-[70px] ${
                      isActive ? "text-slate-950" : "text-slate-200"
                    }`}
                  >
                    {node.titleTa}
                  </span>

                  {/* Star Rating Under Node (⭐⭐⭐) */}
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3].map((starIdx) => (
                      <span
                        key={starIdx}
                        className={`text-[9px] ${
                          starIdx <= node.stars
                            ? "text-yellow-400 drop-shadow"
                            : "text-slate-600 opacity-40"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Lock badge if locked */}
                  {!node.isUnlocked && (
                    <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </button>

                {/* Connecting Stepping Pathway Dots (except last) */}
                {index < nodes.length - 1 && (
                  <div className="hidden sm:flex items-center gap-1 ml-3 text-amber-500/40 font-mono text-xs select-none">
                    <span>•</span>
                    <span>•</span>
                    <span>•</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

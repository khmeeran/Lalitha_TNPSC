"use client";

import React from "react";
import { Check, Lock, Shield, Star, BookOpen, Sparkles } from "lucide-react";
import { MapNode, LalithaMood } from "../../types/adventureMap";
import { LalithaAvatar } from "../mascot/LalithaAvatar";
import { VelanMascotSvg } from "../VelanMascotSvg";

interface MapNodeItemProps {
  node: MapNode;
  isActiveNode: boolean;
  isSelected: boolean;
  lalithaMood?: LalithaMood;
  themeColor?: string;
  onClick: (node: MapNode) => void;
}

export const MapNodeItem: React.FC<MapNodeItemProps> = ({
  node,
  isActiveNode,
  isSelected,
  lalithaMood = "CURIOUS_EXPLORER",
  themeColor = "#B45309",
  onClick,
}) => {
  const isCompleted = node.status === "COMPLETED";
  const isInProgress = node.status === "IN_PROGRESS";
  const isBoss = node.status === "CHAPTER_BOSS";
  const isLocked = node.status === "LOCKED";
  const isUnlocked = node.status === "UNLOCKED";

  // Accessible ARIA label
  const ariaLabel = `Node ${node.orderIndex}: ${node.titleEn}. Status: ${node.status.replace(/_/g, " ")}. Estimated time: ${node.estimatedMinutes} minutes. Reward: ${node.xpReward} XP.`;

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      data-testid={`map-node-${node.id}`}
    >
      {/* 1. Anchored Mascot Companion on Active Node */}
      {isInProgress && (
        <div className="absolute -top-24 sm:-top-28 z-20 flex items-end gap-2 pointer-events-auto">
          {/* Velan Aerial Scout Hovering / Perched */}
          <div className="animate-velan-breathing filter drop-shadow-md">
            <VelanMascotSvg mood="STUDY" size={56} />
          </div>

          {/* Lalitha The Protagonist */}
          <div className="filter drop-shadow-lg">
            <LalithaAvatar mood={lalithaMood} size="sm" />
          </div>
        </div>
      )}

      {/* 2. Double Radar Beacon Ping on Active Node */}
      {isInProgress && (
        <>
          <span
            className="absolute w-20 h-20 rounded-full bg-indigo-500/25 animate-beacon-pulse pointer-events-none"
            aria-hidden="true"
          />
          <span
            className="absolute w-16 h-16 rounded-full border-2 border-indigo-400 animate-ping opacity-60 pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}

      {/* 3. Main Node Interactive Button Target */}
      <button
        onClick={() => onClick(node)}
        aria-label={ariaLabel}
        aria-current={isInProgress ? "step" : undefined}
        className={`group relative z-10 flex items-center justify-center transition-all duration-200 outline-none ${
          isBoss
            ? "w-16 h-16 sm:w-18 sm:h-18 rounded-2xl rotate-45 border-3"
            : "w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 sm:border-3"
        } ${
          // Visual State Styling
          isCompleted
            ? "bg-amber-50 border-amber-600 text-amber-800 shadow-md shadow-amber-900/10 hover:scale-105 active:scale-95 cursor-pointer"
            : isInProgress
            ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-lg shadow-indigo-600/30 scale-105 ring-4 ring-indigo-300/40 cursor-pointer"
            : isBoss
            ? "bg-purple-50 border-purple-600 text-purple-900 shadow-lg shadow-purple-600/25 hover:scale-105 active:scale-95 cursor-pointer"
            : isUnlocked
            ? "bg-white border-slate-300 text-slate-700 shadow-sm hover:border-slate-400 hover:scale-105 active:scale-95 cursor-pointer"
            : "bg-slate-100 border-slate-300 text-slate-400 hover:border-slate-400 cursor-pointer opacity-85 hover:scale-102"
        } ${
          isSelected ? "ring-4 ring-offset-2 ring-indigo-500" : ""
        } focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-indigo-600`}
      >
        {/* Node Center Icon / Glyph */}
        <div className={isBoss ? "-rotate-45 flex items-center justify-center" : ""}>
          {isCompleted ? (
            <div className="flex flex-col items-center">
              <Check className="w-6 h-6 text-emerald-600 stroke-[3]" />
              {/* Golden Mastery Stars */}
              <div className="flex gap-0.5 mt-0.5" aria-hidden="true">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              </div>
            </div>
          ) : isInProgress ? (
            <div className="flex flex-col items-center">
              <Sparkles className="w-6 h-6 text-indigo-600 fill-indigo-200 animate-spin-slow" />
              <span className="text-[9px] font-black tracking-tight text-indigo-600 mt-0.5">
                ACTIVE
              </span>
            </div>
          ) : isBoss ? (
            <div className="flex flex-col items-center">
              <Shield className="w-6 h-6 text-purple-700 fill-purple-200" />
              <span className="text-[8px] font-black uppercase tracking-widest text-purple-700">
                BOSS
              </span>
            </div>
          ) : isUnlocked ? (
            <div className="flex flex-col items-center">
              <BookOpen className="w-5 h-5 text-slate-600" />
              <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                {node.orderIndex}
              </span>
            </div>
          ) : (
            <Lock className="w-5 h-5 text-slate-400" />
          )}
        </div>

        {/* Level / Status Badge Pill */}
        {isCompleted && (
          <span
            className="absolute -bottom-2 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs"
            aria-hidden="true"
          >
            100%
          </span>
        )}
      </button>

      {/* 4. Node Title Banner Label */}
      <div className="mt-2 text-center max-w-[140px] sm:max-w-[160px] pointer-events-none">
        <span
          className={`block text-[11px] sm:text-xs font-bold leading-tight ${
            isInProgress
              ? "text-indigo-900 font-extrabold"
              : isCompleted
              ? "text-slate-800"
              : isLocked
              ? "text-slate-400"
              : "text-slate-700"
          }`}
        >
          {node.titleTa}
        </span>
        <span className="block text-[9px] sm:text-[10px] font-medium text-slate-500 truncate mt-0.5">
          {node.titleEn}
        </span>
      </div>
    </div>
  );
};

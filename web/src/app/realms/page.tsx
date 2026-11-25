"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  MapPin,
  Sparkles,
  BookOpen,
  Sword,
  CheckCircle2,
  Lock,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { GameShell } from "../../components/game/GameShell";
import { LalithaAvatar } from "../../components/mascot/LalithaAvatar";
import { useLearning } from "../../context/LearningContext";
import { useLanguage } from "../../context/LanguageContext";
import { TranslationToggle } from "../../components/translation/TranslationToggle";
import { REALM_PROGRESSION_CHAIN, SYLLABUS_MAPPING, getNodeStoryHook } from "../../data/syllabusMapping";
import { mockAdventureRealms } from "../../data/mockAdventureMapData";
import { AdventureRealm, MapNode, RealmId, LalithaMood } from "../../types/adventureMap";

export default function LivingAtlasWorldMapPage() {
  const router = useRouter();
  const { state } = useLearning();
  const { isTamil } = useLanguage();

  const [realms, setRealms] = useState<AdventureRealm[]>(mockAdventureRealms);
  const [activeRealmId, setActiveRealmId] = useState<RealmId>("realm_4_ancient");
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [lalithaMood, setLalithaMood] = useState<LalithaMood>("CURIOUS_EXPLORER");

  const currentRealm = realms.find((r) => r.id === activeRealmId) || realms[0];
  const syllabusUnit = SYLLABUS_MAPPING.units.find((u) => u.unitNumber === currentRealm.unitNumber);
  const realmChainEntry = REALM_PROGRESSION_CHAIN.find((r) => r.realmId === currentRealm.id);
  const displayRealmName = isTamil
    ? (syllabusUnit?.realmNameTa || realmChainEntry?.nameTa || currentRealm.nameEn)
    : currentRealm.nameEn;

  useEffect(() => {
    const inProgress = currentRealm.nodes.find((n) => n.status === "IN_PROGRESS") || currentRealm.nodes[0];
    setSelectedNode(inProgress);
  }, [activeRealmId]);

  const handleNodeClick = (node: MapNode) => {
    setSelectedNode(node);
    if (node.status === "IN_PROGRESS") {
      setLalithaMood("CURIOUS_EXPLORER");
    } else if (node.status === "COMPLETED") {
      setLalithaMood("TRIUMPHANT_JOY");
    } else if (node.status === "CHAPTER_BOSS") {
      setLalithaMood("DETERMINED");
    } else {
      setLalithaMood("DEEP_THINKING");
    }
  };

  const handleLaunchNode = (node: MapNode) => {
    if (node.status === "LOCKED") return;
    if (node.status === "CHAPTER_BOSS") {
      router.push("/quiz");
    } else {
      router.push(`/lesson/${node.id}`);
    }
  };

  return (
    <GameShell
      activeRealmTitleTa={`உலகம்: ${syllabusUnit?.realmNameTa || realmChainEntry?.nameTa || currentRealm.nameEn}`}
      activeRealmTitleEn={`Realm: ${currentRealm.nameEn}`}
      companionSnippet={`This realm contains ${currentRealm.nodes.length} key historical centers. Let us begin with Ashoka's Rock Edict!`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. REALM SELECTOR STRIP (The 10 Realms Carousel) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="shrink-0 text-xs font-bold text-amber-400 flex items-center gap-1.5 px-2">
            <span>🗺️</span>
            <span>{isTamil ? "உலகங்கள்:" : "Realms:"}</span>
          </div>
          {realms.map((realm) => {
            const isSelected = realm.id === activeRealmId;
            const unitMeta = SYLLABUS_MAPPING.units.find((u) => u.unitNumber === realm.unitNumber);
            const rTitle = isTamil ? (unitMeta?.realmNameTa || realm.nameEn) : realm.nameEn;
            return (
              <button
                key={realm.id}
                onClick={() => setActiveRealmId(realm.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 scale-105"
                    : "bg-slate-900/80 text-slate-300 border-amber-900/40 hover:border-amber-600 hover:text-amber-200"
                }`}
              >
                <span>Unit {realm.unitNumber}</span>
                <span className="truncate max-w-[140px]">{rTitle}</span>
                <span className="text-[10px] opacity-75">{realm.masteryPercentage}%</span>
              </button>
            );
          })}
        </div>

        {/* 2. LIVING MAP CANVAS & INTERACTIVE NODE TRAIL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Map Canvas (2 Columns) */}
          <div className="lg:col-span-2 rounded-3xl bg-slate-900/90 border-2 border-amber-600/40 p-6 shadow-2xl relative overflow-hidden min-h-[480px] flex flex-col justify-between">
            {/* Top Canvas Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                  🏛️
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-amber-100">{displayRealmName}</h2>
                  <p className="text-xs text-amber-300 font-serif">
                    {isTamil && syllabusUnit?.officialTitleTa ? syllabusUnit.officialTitleTa : currentRealm.officialSourceExam} • {currentRealm.syllabusCode}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-400">{currentRealm.masteryPercentage}% Mastered</span>
                <div className="w-28 h-2 bg-slate-950 rounded-full mt-1 overflow-hidden border border-amber-800/40">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                    style={{ width: `${currentRealm.masteryPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Path Nodes Display (Interactive Cartography Grid) */}
            <div className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {currentRealm.nodes.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;
                const isCompleted = node.status === "COMPLETED";
                const isInProgress = node.status === "IN_PROGRESS";
                const isBoss = node.status === "CHAPTER_BOSS";
                const isLocked = node.status === "LOCKED";

                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    data-testid="map-node"
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all relative ${
                      isSelected
                        ? "bg-amber-950/80 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]"
                        : "bg-slate-950/70 border-amber-900/40 hover:border-amber-600 hover:bg-slate-900"
                    }`}
                  >
                    {/* Node Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-amber-800/40 text-amber-300">
                        Level {index + 1}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mastered</span>
                        </span>
                      )}
                      {isInProgress && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 animate-pulse">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      )}
                      {isBoss && (
                        <span className="flex items-center gap-1 text-[11px] font-black text-red-400">
                          <Sword className="w-3.5 h-3.5" />
                          <span>Boss Trial</span>
                        </span>
                      )}
                      {isLocked && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    {(() => {
                      const sNode = syllabusUnit?.nodes?.[index];
                      const titleTa = sNode?.titleTa || (node.titleTa !== node.titleEn ? node.titleTa : undefined);
                      return (
                        <TranslationToggle
                          englishText={node.titleEn}
                          tamilText={titleTa}
                          compact
                          className="text-sm font-bold text-amber-100"
                        />
                      );
                    })()}
                    <p className="text-xs text-slate-400 font-serif italic mt-0.5">{node.subClause}</p>

                    <div className="mt-3 flex items-center justify-between text-xs text-amber-300/80 pt-2 border-t border-amber-900/30">
                      <span>+{node.xpReward} XP</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchNode(node);
                        }}
                        disabled={isLocked}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          isLocked
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : isBoss
                            ? "bg-red-500 hover:bg-red-400 text-slate-950 font-black shadow-md shadow-red-500/20"
                            : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                        }`}
                      >
                        {isLocked ? "Locked" : isBoss ? "Boss Battle" : "Explore"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom World Map Canvas Footer */}
            <div className="pt-4 border-t border-amber-800/30 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>🧭</span>
                <span>Map Navigation: Select the next historical node to start investigating.</span>
              </div>
              <div className="text-amber-400 font-bold">10 Realms Ready</div>
            </div>
          </div>

          {/* Right Inspection Stele / Explorer Drawer */}
          {selectedNode && (
            <div className="rounded-3xl bg-slate-900/90 border-2 border-amber-600/40 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Stele Dossier
                </span>
                <span className="text-xs font-mono text-slate-400">#{selectedNode.id}</span>
              </div>

              {/* Node Title & Lore */}
              {(() => {
                const sNodeIdx = currentRealm.nodes.findIndex((n) => n.id === selectedNode.id);
                const sNode = syllabusUnit?.nodes?.[sNodeIdx];
                const hook = getNodeStoryHook(sNode);
                const nodeTitleTa = sNode?.titleTa || (selectedNode.titleTa !== selectedNode.titleEn ? selectedNode.titleTa : undefined);
                return (
                  <div className="space-y-2">
                    <TranslationToggle
                      englishText={selectedNode.titleEn}
                      tamilText={nodeTitleTa}
                      className="text-lg font-extrabold text-amber-100"
                    />
                    <p className="text-xs text-amber-300 font-serif italic">{selectedNode.subClause}</p>
                    <TranslationToggle
                      englishText={sNode ? hook.narrativeEn : selectedNode.velanTipEn}
                      tamilText={sNode ? hook.narrativeTa : (selectedNode.velanTipTa !== selectedNode.velanTipEn ? selectedNode.velanTipTa : undefined)}
                      className="text-xs text-slate-300 mt-2 leading-relaxed"
                    />
                  </div>
                );
              })()}

              {/* Lalitha Explorer Stance */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-700/40 flex items-center gap-3">
                <div className="w-12 h-14 shrink-0 flex items-center justify-center">
                  <LalithaAvatar mood={lalithaMood} size="sm" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-amber-300 block">Lalitha's Notes:</span>
                  "Every question we master here guarantees higher marks in the TNPSC examination!"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => handleLaunchNode(selectedNode)}
                  disabled={selectedNode.status === "LOCKED"}
                  className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-transform shadow-xl ${
                    selectedNode.status === "LOCKED"
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : selectedNode.status === "CHAPTER_BOSS"
                      ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-red-500/20 active:scale-95"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-95"
                  }`}
                >
                  {selectedNode.status === "LOCKED" ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Locked</span>
                    </>
                  ) : selectedNode.status === "CHAPTER_BOSS" ? (
                    <>
                      <Sword className="w-4 h-4" />
                      <span>Start Boss Battle</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>Enter Chamber</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
}

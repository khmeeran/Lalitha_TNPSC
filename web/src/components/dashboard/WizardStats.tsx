"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Skull,
  Flame,
  Crown,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";
import { useLearning } from "../../context/LearningContext";
import { useLanguage } from "../../context/LanguageContext";
import { getDailyOracle, generateDailyOracleProphecy, OracleProphecy } from "../../lib/dailyOracle";
import { calculateSyllabusCoverage, SYLLABUS_MAPPING } from "../../data/syllabusMapping";
import { audioEngine } from "../../lib/audioEngine";
import { TranslationToggle } from "../translation/TranslationToggle";
import { GlobalLanguageToggle } from "../translation/GlobalLanguageToggle";

// Staff themes and magical names for all 10 TNPSC Syllabus Units
const UNIT_STAFF_METADATA: Record<
  number,
  {
    staffTitle: string;
    affinity: string;
    icon: string;
    bgAccent: string;
    borderAccent: string;
    crystalColor: string;
  }
> = {
  1: {
    staffTitle: "Cosmic Alchemy Staff",
    affinity: "Natural Sciences & Matter",
    icon: "🔬",
    bgAccent: "from-blue-950/60 to-cyan-950/40",
    borderAccent: "border-cyan-500/40",
    crystalColor: "#00F0FF",
  },
  2: {
    staffTitle: "Chrono Codex Staff",
    affinity: "Temporal Events & World News",
    icon: "⏱️",
    bgAccent: "from-amber-950/60 to-yellow-950/40",
    borderAccent: "border-yellow-500/40",
    crystalColor: "#FFD700",
  },
  3: {
    staffTitle: "Terra Leyline Staff",
    affinity: "Monsoons, Minerals & Terrains",
    icon: "🌍",
    bgAccent: "from-emerald-950/60 to-teal-950/40",
    borderAccent: "border-emerald-500/40",
    crystalColor: "#2ECC71",
  },
  4: {
    staffTitle: "Ancient Dynasty Scepter",
    affinity: "Indus Valley, Guptas & Mughals",
    icon: "🏛️",
    bgAccent: "from-purple-950/60 to-amber-950/40",
    borderAccent: "border-amber-500/40",
    crystalColor: "#F39C12",
  },
  5: {
    staffTitle: "Constitution Scepter",
    affinity: "Articles, Writs & Supreme Court",
    icon: "⚖️",
    bgAccent: "from-indigo-950/60 to-purple-950/40",
    borderAccent: "border-indigo-500/40",
    crystalColor: "#9B59B6",
  },
  6: {
    staffTitle: "Fiscal Forge Staff",
    affinity: "RBI, Five-Year Plans & GST",
    icon: "🪙",
    bgAccent: "from-yellow-950/60 to-amber-950/40",
    borderAccent: "border-amber-500/40",
    crystalColor: "#E67E22",
  },
  7: {
    staffTitle: "Freedom Vanguard Staff",
    affinity: "1857 Rising, Tilak & Gandhi",
    icon: "🚩",
    bgAccent: "from-red-950/60 to-orange-950/40",
    borderAccent: "border-orange-500/40",
    crystalColor: "#E74C3C",
  },
  8: {
    staffTitle: "Sangam Epic Staff",
    affinity: "Thirukkural, Keeladi & Periyar",
    icon: "📜",
    bgAccent: "from-rose-950/60 to-purple-950/40",
    borderAccent: "border-rose-500/40",
    crystalColor: "#E91E63",
  },
  9: {
    staffTitle: "Governance Prism Staff",
    affinity: "Tamil Nadu Welfare & E-Governance",
    icon: "🏛️",
    bgAccent: "from-sky-950/60 to-indigo-950/40",
    borderAccent: "border-sky-500/40",
    crystalColor: "#3498DB",
  },
  10: {
    staffTitle: "Logic Artificer Staff",
    affinity: "Percentages, HCF-LCM & Puzzles",
    icon: "🧮",
    bgAccent: "from-violet-950/60 to-fuchsia-950/40",
    borderAccent: "border-fuchsia-500/40",
    crystalColor: "#A55EEA",
  },
};

const DEFAULT_PROPHECY: OracleProphecy = {
  headline: "Aligning Celestial Learning Coordinates...",
  headlineTa: "கற்றல் பாதையின் தரவுகள் ஒருங்கிணைக்கப்படுகின்றன...",
  subheadline: "Velan is analyzing your Spaced Repetition schema and upcoming exam horizon.",
  subheadlineTa: "உங்கள் நினைவாற்றல் பயிற்சி மற்றும் வரவிருக்கும் தேர்வு அட்டவணையை வேலன் ஆய்வு செய்கிறார்.",
  confidencePercentage: 85,
  confidenceRating: "HIGH",
  actionType: "PACE_RETENTION",
  recommendedAction: "Begin daily retrieval quest",
  recommendedActionTa: "தினசரி பயிற்சி வினாக்களைத் தொடங்குங்கள்",
  recommendedRealmId: "realm_4_ancient",
  examCountdownDays: 45,
  examTargetName: "TNPSC Group 1 Combined Prelims",
  analysisDate: "2026-05-15",
  strategicBreakdowns: [
    {
      pillar: "Cognitive Schema Health",
      scoreText: "Analyzing Schema...",
      insight: "Evaluating active misconceptions across syllabus units.",
      trend: "STABLE",
    },
    {
      pillar: "G1 Reasoning Proficiency",
      scoreText: "Degree Standard",
      insight: "Multi-statement assertion-reasoning matrices.",
      trend: "STABLE",
    },
    {
      pillar: "Exam Horizon Alignment",
      scoreText: "45 Days to Exam",
      insight: "Pacing matches syllabus completion velocity.",
      trend: "RISING",
    },
  ],
};

export const WizardStats: React.FC = () => {
  const router = useRouter();
  const { state } = useLearning();
  const { isTamil } = useLanguage();

  const [oracleBreakdownOpen, setOracleBreakdownOpen] = useState(false);
  const [selectedStaffUnit, setSelectedStaffUnit] = useState<number | null>(null);

  // 1. Spaced Repetition (Cursed Topics) analysis
  const cursedItems = useMemo(() => {
    return Object.values(state.questionSrs || {}).filter((item) => item.isCursed);
  }, [state.questionSrs]);

  const cursedCount = cursedItems.length;

  // 2. Syllabus Coverage & Spell Power derivation
  const syllabusData = useMemo(() => {
    return calculateSyllabusCoverage(state.completedNodeIds || []);
  }, [state.completedNodeIds]);

  // Total nodes count across entire syllabus
  const totalSyllabusNodes = useMemo(() => {
    return SYLLABUS_MAPPING.units.reduce((acc, u) => acc + u.nodes.length, 0);
  }, []);

  const completedNodesCount = (state.completedNodeIds || []).length;
  const syllabusCoveragePercent = Math.min(
    100,
    Math.round((completedNodesCount / Math.max(1, totalSyllabusNodes)) * 100)
  );

  // 3. Boss Realm Conquests
  const conqueredRealms = state.bossDefeatedRealms || [];
  const conqueredCount = conqueredRealms.length;

  // 4. Daily Oracle Prophecy Generation (Hydration-safe real-time update)
  const [oracle, setOracle] = useState<OracleProphecy>(DEFAULT_PROPHECY);

  useEffect(() => {
    setOracle(getDailyOracle(state));
  }, [state]);

  // 5. Cognitive Mana Potion Fill calculation
  const streak = state.user?.streakDays || 1;
  const manaPoints = (state.user as any)?.mana ?? 100;
  // Fill percentage calculated from streak (30-day max anchor) and mana level
  const potionFillPercent = Math.min(100, Math.max(18, Math.round((streak / 21) * 70 + (manaPoints / 100) * 30)));

  // Sound handlers
  const handleParchmentToggle = () => {
    audioEngine.playCorrectRecall();
    setOracleBreakdownOpen((prev) => !prev);
  };

  const handleActionClick = (actionType: OracleProphecy["actionType"]) => {
    audioEngine.playCorrectRecall();
    if (actionType === "GRIND_CURSED") {
      router.push("/?tab=GRIND");
    } else {
      router.push("/");
    }
  };

  return (
    <div data-testid="wizard-stats" className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          PILLAR 2: DAILY ORACLE PARCHMENT CARD (AT TOP OF DASHBOARD)
          ========================================================================= */}
      <section
        data-testid="daily-oracle-card"
        className="oracle-parchment-glow p-6 sm:p-8 rounded-3xl text-slate-900 border-2 border-amber-500 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges: Exam Horizon & Daily Prophet Icon */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-amber-900/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-900/10 border-2 border-amber-700/30 flex items-center justify-center text-2xl shadow-inner">
              🔮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-fantasy-header text-xs tracking-wider text-amber-900 font-extrabold uppercase">
                  Velan&apos;s Daily Oracle
                </span>
                <span className="text-[10px] font-ui bg-amber-800/15 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-800/20">
                  {oracle.analysisDate}
                </span>
              </div>
              <h3 className="text-sm font-bold text-amber-950 font-fantasy-header">
                Celestial Cognitive Forecast for Lalitha
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 font-ui">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-600/40 text-amber-950 text-xs font-black tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-amber-800" />
              <span>
                {oracle.examTargetName.split(" ")[0]} {oracle.examTargetName.split(" ")[1]}: {oracle.examCountdownDays} Days Remaining
              </span>
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider tabular-nums ${
                oracle.confidenceRating === "VERY_HIGH"
                  ? "bg-emerald-600/20 text-emerald-950 border-emerald-600/40"
                  : oracle.confidenceRating === "HIGH"
                  ? "bg-amber-600/20 text-amber-950 border-amber-600/40"
                  : "bg-blue-600/20 text-blue-950 border-blue-600/40"
              }`}
            >
              {oracle.confidencePercentage}% Projection Accuracy
            </span>
          </div>
        </div>

        {/* Prophecy Headline & Action */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex-1 min-w-0">
              <TranslationToggle
                englishText={`"${oracle.headline}"`}
                tamilText={oracle.headlineTa ? `"${oracle.headlineTa}"` : undefined}
                variant="light"
                className="text-xl sm:text-2xl font-black text-amber-950 font-fantasy-header tracking-tight leading-snug"
              />
            </div>
            <GlobalLanguageToggle />
          </div>

          <TranslationToggle
            englishText={oracle.subheadline}
            tamilText={oracle.subheadlineTa || oracle.headlineTa}
            variant="light"
            className="text-sm sm:text-base text-amber-900 font-body font-semibold max-w-4xl leading-relaxed"
          />

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleActionClick(oracle.actionType)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-600/30 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <span>{isTamil && oracle.recommendedActionTa ? oracle.recommendedActionTa : oracle.recommendedAction}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleParchmentToggle}
              className="px-4 py-2 rounded-xl bg-amber-900/10 hover:bg-amber-900/15 border border-amber-800/30 text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <span>Strategic Astrological Breakdown</span>
              {oracleBreakdownOpen ? (
                <ChevronUp className="w-4 h-4 text-amber-900" />
              ) : (
                <ChevronDown className="w-4 h-4 text-amber-900" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Strategic Breakdown Drawer */}
        {oracleBreakdownOpen && (
          <div className="mt-5 pt-5 border-t border-amber-900/20 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 animate-in fade-in slide-in-from-top-2 duration-300">
            {oracle.strategicBreakdowns.map((b, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-amber-100/70 border border-amber-800/20 shadow-sm space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-900/70">
                    {b.pillar}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      b.trend === "RISING"
                        ? "bg-emerald-500/20 text-emerald-900"
                        : b.trend === "NEEDS_ATTENTION"
                        ? "bg-rose-500/20 text-rose-900"
                        : "bg-amber-500/20 text-amber-900"
                    }`}
                  >
                    {b.trend.replace("_", " ")}
                  </span>
                </div>
                <div className="text-base font-black text-amber-950">{b.scoreText}</div>
                <TranslationToggle
                  englishText={b.insight}
                  tamilText={b.insightTa}
                  variant="light"
                  compact
                  className="text-xs text-amber-900/80 leading-relaxed"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          PILLAR 1: THE 4 ESSENTIAL GAMIFIED MASTERY PODS (ZERO VANITY NUMBERS)
          ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* POD 1: CURSED SCROLLS (Weak Topics Needing SRS) */}
        <div
          data-testid="cursed-scrolls-card"
          className="cursed-scroll-badge rounded-3xl p-5 border-2 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-ui font-black uppercase tracking-widest text-red-300 flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-red-400" />
                Cursed Scrolls
              </span>
              <h4 className="text-xs font-fantasy-header text-red-200 mt-0.5">Misconceptions Active</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-xl shadow-md">
              💀
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2 font-ui">
              <span className="text-3xl font-ui font-black text-red-100 tabular-nums">{cursedCount}</span>
              <span className="text-xs font-ui font-bold text-red-300">Scrolls Marked</span>
            </div>
            <p className="text-[11px] font-body text-red-200/80 mt-1 line-clamp-2">
              {cursedCount > 0
                ? "Cognitive traps identified by distractor analysis. Dispelled after 2 correct recalls."
                : "Schema is purified! No distractor interference currently haunting Lalitha."}
            </p>
          </div>

          <button
            onClick={() => {
              audioEngine.playDistractorTrap();
              router.push("/?tab=GRIND");
            }}
            disabled={cursedCount === 0}
            className={`w-full py-2 px-3 rounded-xl text-xs font-ui font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              cursedCount > 0
                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/80 active:scale-95"
                : "bg-red-950/40 text-red-400/40 border border-red-900/40 cursor-not-allowed"
            }`}
          >
            <span>{cursedCount > 0 ? "Purify in Grind Mode" : "Schema Pure"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* POD 2: MANA RESERVES (Streak Days & Cognitive Endurance) */}
        <div
          data-testid="mana-reserves-card"
          className="bg-slate-900/90 rounded-3xl p-5 border-2 border-cyan-500/40 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-ui font-black uppercase tracking-widest text-cyan-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
                Mana Reserves
              </span>
              <h4 className="text-xs font-fantasy-header text-cyan-200 mt-0.5">Cognitive Endurance</h4>
            </div>

            {/* Glass Potion Flask Fluid Container */}
            <div className="potion-flask-body shrink-0 scale-75 origin-top-right">
              <div
                className="potion-liquid-fill"
                style={{ height: `${potionFillPercent}%` }}
              >
                <div className="potion-liquid-wave" />
              </div>
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2 font-ui">
              <span className="text-3xl font-ui font-black text-cyan-200 tabular-nums">{streak}</span>
              <span className="text-xs font-ui font-bold text-cyan-400">Day Streak Surge</span>
            </div>
            <p className="text-[11px] font-body text-cyan-200/80 mt-1">
              Active Mana: {manaPoints} MP. Daily study rhythm directly sustains deep memory encoding.
            </p>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-cyan-700/40">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
              style={{ width: `${potionFillPercent}%` }}
            />
          </div>
        </div>

        {/* POD 3: REALM CONQUESTS (Boss Battles Won / G1 Reasoning) */}
        <div
          data-testid="realm-conquests-card"
          className="bg-slate-900/90 rounded-3xl p-5 border-2 border-amber-500/40 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-ui font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Realm Conquests
              </span>
              <h4 className="text-xs font-fantasy-header text-amber-200 mt-0.5">G1 Multi-Statement Power</h4>
            </div>
            <div className="conquest-crown-badge w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md">
              👑
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2 font-ui">
              <span className="text-3xl font-ui font-black text-amber-300 tabular-nums">{conqueredCount}</span>
              <span className="text-xs font-ui font-bold text-amber-400">/ 10 Boss Realms Cleared</span>
            </div>
            <p className="text-[11px] font-body text-amber-200/80 mt-1 line-clamp-2">
              {conqueredCount >= 3
                ? "Commission Degree Standard reasoning validated under timed matrix stress."
                : "Challenge Chapter Bosses to unlock full Group 1 analytical mastery."}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all ${
                  idx < conqueredCount
                    ? "bg-amber-400 shadow-sm shadow-amber-400/80"
                    : "bg-slate-950 border border-amber-900/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* POD 4: ANCIENT KNOWLEDGE (Syllabus & PYQ Coverage %) */}
        <div
          data-testid="ancient-knowledge-card"
          className="bg-slate-900/90 rounded-3xl p-5 border-2 border-emerald-500/40 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-ui font-black uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                Ancient Knowledge
              </span>
              <h4 className="text-xs font-fantasy-header text-emerald-200 mt-0.5">10-Year Commission Archives</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-xl shadow-md">
              📜
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2 font-ui">
              <span className="text-3xl font-ui font-black text-emerald-300 tabular-nums">{syllabusCoveragePercent}%</span>
              <span className="text-xs font-ui font-bold text-emerald-400">
                ({completedNodesCount}/{totalSyllabusNodes} Tomes)
              </span>
            </div>
            <p className="text-[11px] font-body text-emerald-200/80 mt-1 line-clamp-2">
              70%+ authenticated TNPSC past year questions cross-referenced to official units.
            </p>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-emerald-700/40">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${syllabusCoveragePercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          PILLAR 1 (METRIC 1): SPELL POWER STAFF VAULT (5-TIER CRYSTAL STAFFS)
          Replaces traditional "Subject Accuracy %" with pure loot progression!
          ========================================================================= */}
      <section
        data-testid="spell-power-vault"
        className="bg-slate-900/95 rounded-3xl border-2 border-amber-600/40 p-6 sm:p-8 shadow-2xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-800/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center text-2xl shadow-md">
              ⚡
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black title-gold-gradient font-fantasy-header flex items-center gap-2">
                <span>The Spell Power Reliquary</span>
                <span className="text-xs font-ui bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30 font-bold uppercase">
                  10 Unit Staves
                </span>
              </h3>
              <p className="text-xs text-amber-300/80 font-body italic">
                Mastery depth manifested as 5-tier crystalline enchantment staffs. No boring percent bars.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="staff-crystal-gem staff-crystal-lit inline-block scale-75" />
              <span className="font-bold text-amber-300">Lit Crystal (Mastery)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="staff-crystal-gem staff-crystal-unlit inline-block scale-75" />
              <span className="font-bold text-slate-400">Unawakened</span>
            </div>
          </div>
        </div>

        {/* 10-Unit Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syllabusData.unitDetails.map((unit) => {
            const meta = UNIT_STAFF_METADATA[unit.unitNumber] || {
              staffTitle: `Unit ${unit.unitNumber} Staff`,
              affinity: unit.officialTitle,
              icon: "🪄",
              bgAccent: "from-slate-950 to-slate-900",
              borderAccent: "border-amber-700/40",
              crystalColor: "#FFD700",
            };

            // Calculate 5-Tier Crystal staff count:
            // 0-20% = 1 crystal, 21-40% = 2, 41-60% = 3, 61-80% = 4, 81-100% = 5
            const litCrystalsCount =
              unit.masteryPercentage >= 80
                ? 5
                : unit.masteryPercentage >= 60
                ? 4
                : unit.masteryPercentage >= 40
                ? 3
                : unit.masteryPercentage >= 20
                ? 2
                : unit.completedNodes > 0
                ? 1
                : 0;

            const isStaffConquered = conqueredRealms.includes(unit.realmId as any);

            return (
              <div
                key={unit.unitNumber}
                onClick={() => {
                  audioEngine.playCorrectRecall();
                  setSelectedStaffUnit(selectedStaffUnit === unit.unitNumber ? null : unit.unitNumber);
                }}
                className={`p-4 rounded-2xl bg-gradient-to-br ${meta.bgAccent} border-2 ${meta.borderAccent} cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl relative overflow-hidden`}
              >
                {/* Staff Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-950/70 border border-white/10 shadow-inner">
                      {meta.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-ui font-black uppercase tracking-wider text-amber-300">
                          Unit {unit.unitNumber} • {unit.unitCode}
                        </span>
                        {isStaffConquered && (
                          <span className="text-[9px] font-ui bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                            <Crown className="w-2.5 h-2.5 fill-slate-950" /> Boss Conquered
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black font-fantasy-header text-white">{meta.staffTitle}</h4>
                      <p className="text-[11px] text-slate-300 font-body italic line-clamp-1">
                        {unit.officialTitle}
                      </p>
                    </div>
                  </div>

                  {/* Tier Label */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-ui font-black text-amber-300 block">
                      {litCrystalsCount === 5
                        ? "⚡ Apex Transcendent"
                        : litCrystalsCount === 4
                        ? "⚡ Archmage Radiance"
                        : litCrystalsCount === 3
                        ? "⚡ Master Surge"
                        : litCrystalsCount === 2
                        ? "⚡ Adept Spark"
                        : litCrystalsCount === 1
                        ? "⚡ Novice Embers"
                        : "Dormant Staff"}
                    </span>
                    <span className="text-[10px] font-ui text-slate-400 font-bold tabular-nums">
                      {unit.completedNodes}/{unit.totalNodes} Nodes Mastered
                    </span>
                  </div>
                </div>

                {/* The 5-Tier Crystal Inset Staff Display */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Spell Power
                    </span>
                    <div className="flex items-center gap-2.5">
                      {Array.from({ length: 5 }).map((_, crystalIdx) => {
                        const isLit = crystalIdx < litCrystalsCount;
                        return (
                          <div
                            key={crystalIdx}
                            className={`staff-crystal-gem ${
                              isLit ? "staff-crystal-lit" : "staff-crystal-unlit"
                            }`}
                            style={isLit ? { borderColor: meta.crystalColor } : {}}
                            title={`Crystal Tier ${crystalIdx + 1} ${isLit ? "Awakened" : "Locked"}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <span className="text-xs font-black text-amber-300 font-mono">
                    {unit.masteryPercentage}% Depth
                  </span>
                </div>

                {/* Expanded Pedagogical Sub-Clause View */}
                {selectedStaffUnit === unit.unitNumber && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 space-y-1.5 animate-in fade-in duration-200">
                    <div className="text-amber-200 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Curriculum Core: {meta.affinity}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Syllabus Unit Realm: {unit.realmName}. Clear all chapters and defeat the Chapter Boss to reach 5-Tier Apex Transcendent status.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

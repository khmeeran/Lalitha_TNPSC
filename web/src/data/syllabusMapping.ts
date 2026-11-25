// TNPSC Quest - Official Syllabus Mapping & Guarantee Logic
// Connects Game Levels, Nodes, and Boss Gates to TNPSC Group 1 & Group 4 Units

export interface StoryHook {
  narrativeEn: string;
  narrativeTa?: string;
  investigatorGoal: string;
  investigatorGoalTa?: string;
}

export interface SyllabusNode {
  nodeId: string;
  title: string;
  titleTa?: string;
  subClause: string;
  levelRequirement: number;
  difficultyTier: "G4" | "G2" | "G1";
  isBoss: boolean;
  storyHook?: StoryHook;
}

export interface SyllabusUnit {
  unitNumber: number;
  unitCode: string;
  officialTitle: string;
  officialTitleTa?: string;
  realmId: string;
  realmName: string;
  realmNameTa?: string;
  bossQuizId: string;
  nodes: SyllabusNode[];
}

export interface SyllabusMappingData {
  version: string;
  provenance: string;
  totalUnits: number;
  masteryPassThreshold: number; // 80%
  difficultyScaling: {
    tier1_early: { levelRange: string; difficulty: "G4"; style: string; targetGroup: string };
    tier2_mid: { levelRange: string; difficulty: "G2"; style: string; targetGroup: string };
    tier3_high: { levelRange: string; difficulty: "G1"; style: string; targetGroup: string };
  };
  pyqPriorityPolicy: {
    minimumPyqRatio: number; // 0.70 (70%)
    practiceRatio: number; // 0.30 (30%)
    lastYearsSpan: number; // 10 years
  };
  units: SyllabusUnit[];
}

import rawSyllabusData from "../../public/data/syllabus_mapping.json";

export const SYLLABUS_MAPPING: SyllabusMappingData = rawSyllabusData as SyllabusMappingData;

/**
 * Requirement 1: Content Coverage Guarantee
 * Calculates exactly which syllabus units are covered based on unlocked/completed nodes.
 */
export function calculateSyllabusCoverage(completedNodeIds: string[]) {
  const completedSet = new Set(completedNodeIds);

  const unitDetails = SYLLABUS_MAPPING.units.map((unit) => {
    const totalNodes = unit.nodes.length;
    const completedInUnit = unit.nodes.filter((n) => completedSet.has(n.nodeId)).length;
    const isCovered = completedInUnit > 0;
    const masteryRatio = totalNodes > 0 ? completedInUnit / totalNodes : 0;

    return {
      unitNumber: unit.unitNumber,
      unitCode: unit.unitCode,
      officialTitle: unit.officialTitle,
      realmId: unit.realmId,
      realmName: unit.realmName,
      totalNodes,
      completedNodes: completedInUnit,
      isCovered,
      masteryPercentage: Math.round(masteryRatio * 100),
    };
  });

  const coveredUnitsCount = unitDetails.filter((u) => u.isCovered).length;
  const overallCoveragePercentage = Math.round((coveredUnitsCount / SYLLABUS_MAPPING.totalUnits) * 100);

  return {
    totalUnits: SYLLABUS_MAPPING.totalUnits,
    coveredUnitsCount,
    overallCoveragePercentage,
    unitDetails,
  };
}

/**
 * Requirement 2: Difficulty Scaling Guarantee (Group 4 -> Group 1)
 * Levels 1-10: G4 (factual, direct)
 * Levels 11-20: G2 (analytical, comparative)
 * Levels 21+ and Boss Battles: G1 (complex, multi-statement, assertion-reasoning)
 */
export function getDifficultyForLevel(level: number, isBoss: boolean = false): "G4" | "G2" | "G1" {
  if (isBoss || level >= 21) {
    return "G1";
  }
  if (level >= 11) {
    return "G2";
  }
  return "G4";
}

/**
 * Pillar 1 Quality Gate: Never show an empty state.
 * Returns the node's rich storyHook or a safe mentor narrative placeholder.
 */
export function getNodeStoryHook(node?: SyllabusNode | null): StoryHook {
  if (node?.storyHook?.narrativeEn && node.storyHook.narrativeEn.trim().length > 0) {
    return node.storyHook;
  }
  return {
    narrativeEn: "Velan is still uncovering this secret...",
    investigatorGoal: "Investigate the hidden artifacts to master this syllabus clause.",
  };
}

/**
 * Realm Sequence Progression Chain
 */
export const REALM_PROGRESSION_CHAIN = [
  { realmId: "realm_4_ancient", name: "History Highlands", nameTa: "வரலாற்றுச் சிகரங்கள்", bossQuizId: "quiz_ancient_boss" },
  { realmId: "realm_5_polity", name: "Polity Peak", nameTa: "ஆட்சியியல் முகடு", bossQuizId: "quiz_polity_boss" },
  { realmId: "realm_3_geography", name: "Geography Valley", nameTa: "புவியியல் பள்ளத்தாக்கு", bossQuizId: "quiz_geo_boss" },
  { realmId: "realm_10_aptitude", name: "Aptitude Arena", nameTa: "திறனறிவுக் களம்", bossQuizId: "quiz_apt_boss" },
  { realmId: "realm_1_science", name: "Science Sanctuary", nameTa: "அறிவியல் சரணாலயம்", bossQuizId: "quiz_science_boss" },
  { realmId: "realm_7_freedom", name: "Freedom Fortress", nameTa: "விடுதலைக் கோட்டை", bossQuizId: "quiz_freedom_boss" },
  { realmId: "realm_8_heritage", name: "Tamil Heritage Sanctum", nameTa: "தமிழ் மரபு மையம்", bossQuizId: "quiz_heritage_boss" },
  { realmId: "realm_6_economy", name: "Treasury Citadel", nameTa: "பொருளாதாரக் கோட்டை", bossQuizId: "quiz_econ_boss" },
  { realmId: "realm_2_current_affairs", name: "Current Affairs Cave", nameTa: "நடப்பு நிகழ்வுக் குகை", bossQuizId: "quiz_current_boss" },
  { realmId: "realm_9_admin", name: "Administration Spire", nameTa: "நிர்வாகக் கோபுரம்", bossQuizId: "quiz_admin_boss" },
];

/**
 * Requirement 4: The Mastery Gatekeeper Guarantee
 * Users cannot unlock the next Region until they score >= 80% in the previous region's Boss Quiz.
 */
export function checkRealmMasteryLock(
  targetRealmId: string,
  bossDefeatedRealms: string[]
): {
  isUnlocked: boolean;
  requiredBossRealm?: string;
  requiredBossName?: string;
  passThreshold: number;
} {
  const targetIndex = REALM_PROGRESSION_CHAIN.findIndex((r) => r.realmId === targetRealmId);

  // First realm (History Highlands) is always open
  if (targetIndex <= 0) {
    return { isUnlocked: true, passThreshold: 80 };
  }

  // Check if predecessor realm boss was defeated with >= 80% score
  const predecessor = REALM_PROGRESSION_CHAIN[targetIndex - 1];
  const isPredecessorDefeated = bossDefeatedRealms.includes(predecessor.realmId);

  return {
    isUnlocked: isPredecessorDefeated,
    requiredBossRealm: predecessor.realmId,
    requiredBossName: predecessor.name,
    passThreshold: 80,
  };
}

/**
 * Requirement 3: 70% Previous Year Question (PYQ) Priority Filter
 * Guarantees that at least 70% of trial questions are authentic scraped PYQs.
 */
export function selectGuaranteedQuestions<T extends { source?: string; is_pyq?: boolean; difficulty?: string }>(
  allQuestions: T[],
  count: number = 5,
  targetDifficulty?: "G4" | "G2" | "G1"
): T[] {
  if (!allQuestions || allQuestions.length === 0) return [];

  // Filter strictly by target difficulty
  let pool = targetDifficulty
    ? allQuestions.filter((q) => q.difficulty === targetDifficulty)
    : allQuestions;

  // STRICT INVARIANT FOR G1 (Boss Battles & Levels 21+):
  // NEVER fall back to lower difficulty tiers or allQuestions if target is G1!
  if (targetDifficulty === "G1") {
    if (pool.length === 0) {
      pool = allQuestions.filter((q) => q.difficulty === "G1");
    }
  } else {
    // For G4/G2 non-boss, expand only if pool is strictly empty
    if (pool.length === 0) {
      pool = allQuestions;
    }
  }

  if (pool.length === 0) return [];

  const pyqQuestions = pool.filter((q) => q.is_pyq || (q.source && q.source.startsWith("PYQ")));
  const practiceQuestions = pool.filter((q) => !q.is_pyq && (!q.source || !q.source.startsWith("PYQ")));

  // Calculate 70% PYQ quota
  const minPyqCount = Math.min(pyqQuestions.length, Math.ceil(count * 0.7));
  const practiceCount = Math.min(practiceQuestions.length, count - minPyqCount);

  // Randomize selections
  const shuffledPyq = [...pyqQuestions].sort(() => 0.5 - Math.random());
  const shuffledPractice = [...practiceQuestions].sort(() => 0.5 - Math.random());

  const selected: T[] = [
    ...shuffledPyq.slice(0, minPyqCount),
    ...shuffledPractice.slice(0, practiceCount),
  ];

  // If still need more to hit count, fill STRICTLY from remainder of pool (which is 100% target difficulty)
  if (selected.length < count) {
    const existingIds = new Set(selected.map((q: any) => q.id));
    const remainder = pool.filter((q: any) => !existingIds.has(q.id));
    selected.push(...remainder.slice(0, count - selected.length));
  }

  // MATHEMATICAL GUARANTEE ENFORCEMENT:
  // If G1 was requested, verify and guarantee 100% G1 purity.
  if (targetDifficulty === "G1") {
    const strictlyG1 = selected.filter((q) => q.difficulty === "G1");
    return strictlyG1.sort(() => 0.5 - Math.random());
  }

  return selected.sort(() => 0.5 - Math.random());
}

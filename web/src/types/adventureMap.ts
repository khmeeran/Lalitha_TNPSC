// TNPSC Quest - Screen 2 Learning Adventure Map Type Definitions
// Architecture: Strictly decoupled presentation, map data, and interaction states

export type ExamGroup = "GROUP_4_VAO" | "GROUP_2_2A" | "GROUP_1";

export type RealmId =
  | "realm_1_science"
  | "realm_2_chrono"
  | "realm_3_geography"
  | "realm_4_ancient"
  | "realm_5_constitution"
  | "realm_6_economy"
  | "realm_7_freedom"
  | "realm_8_heritage"
  | "realm_9_admin"
  | "realm_10_aptitude";

export type NodeStatus = "COMPLETED" | "IN_PROGRESS" | "UNLOCKED" | "LOCKED" | "CHAPTER_BOSS";

export type NodeType = "CONCEPT" | "MILESTONE" | "BOSS_CHALLENGE" | "CHAPTER_BOSS" | "REVISION_CHECK";

export type LalithaMood =
  | "CURIOUS_EXPLORER"
  | "DEEP_THINKING"
  | "TRIUMPHANT_JOY"
  | "DETERMINED"
  | "SCHOLAR_STUDY"
  | "RESTING_CHAI";

export interface MapNode {
  id: string;
  realmId: RealmId;
  topicId: string;
  titleTa: string;
  titleEn: string;
  subClause: string;
  status: NodeStatus;
  nodeType: NodeType;
  orderIndex: number;
  estimatedMinutes: number;
  xpReward: number;
  masteryScore?: number; // e.g. 100 for completed
  xOscillationRatio: number; // -1 to +1 relative offset from center for sinusoidal trail
  prerequisites: string[];
  pyqProvenance?: string; // e.g. "TNPSC Grp 4 2024 • Q119"
  velanTipTa: string;
  velanTipEn: string;
}

export interface AdventureRealm {
  id: RealmId;
  unitNumber: number;
  nameTa: string;
  nameEn: string;
  syllabusCode: string;
  themeColor: string; // Tailwind hex
  accentColor: string;
  bgGradient: string;
  iconName: string;
  masteryPercentage: number;
  completedNodes: number;
  totalNodes: number;
  isUnlocked: boolean;
  officialSourceExam: string;
  officialSourceRef: string;
  examCrosswalkNote: string;
  nodes: MapNode[];
}

export interface AdventureMapState {
  activeExam: ExamGroup;
  activeRealmId: RealmId;
  selectedNodeId: string | null;
  activeNodeId: string;
  lalithaMood: LalithaMood;
  isInspectionDrawerOpen: boolean;
  isRealmSwitcherOpen: boolean;
  zoomLevel: number;
  userStats: {
    displayName: string;
    level: number;
    levelTitle: string;
    currentXp: number;
    streakDays: number;
  };
}

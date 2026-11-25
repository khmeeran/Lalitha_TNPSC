// TNPSC Quest - Screen 1 Dashboard Type Definitions

export type ExamTarget = "GROUP_4_VAO" | "GROUP_2_2A" | "GROUP_1";

export type VelanMood = "GREETING" | "STUDY" | "CELEBRATING" | "ENCOURAGING" | "RESTING";

export type DashboardScenario = 
  | "NEW_STUDENT" 
  | "RETURNING_ACTIVE" 
  | "COMPLETED_GOALS" 
  | "MISSED_STREAK" 
  | "REVISION_CLEARED";

export interface UserStats {
  displayName: string;
  avatarUrl?: string;
  level: number;
  levelTitle: string;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  isStreakAtRisk?: boolean;
  activeExam: ExamTarget;
  completedQuestsToday: number;
  totalQuestsToday: number;
}

export interface ActiveAdventure {
  realmId: string;
  realmName: string;
  subTopic: string;
  realmIcon: string;
  topicTitle: string;
  topicSubtitle: string;
  estimatedMinutes: number;
  xpReward: number;
  currentStep: number;
  totalSteps: number;
  isCompleted?: boolean;
  isBonus?: boolean;
}

export interface DailyQuestItem {
  id: string;
  label: string;
  xp: number;
  isCompleted: boolean;
  category: "LESSON" | "FLASHCARDS" | "QUIZ" | "ONBOARDING";
}

export interface BonusChestState {
  isAvailable: boolean;
  isClaimed: boolean;
  bonusXp: number;
}

export interface SpacedRevisionState {
  cardsDueCount: number;
  estimatedMinutes: number;
  lastReviewedDate?: string;
}

export interface SubjectRealm {
  id: string;
  name: string;
  icon: string;
  themeColor: string;
  accentBg: string;
  masteryPercentage: number;
  unlockedChapters: number;
  totalChapters: number;
  isActive: boolean;
}

export interface DayStreakStatus {
  dayName: string;
  dayShort: string;
  isCompleted: boolean;
  isToday: boolean;
}

export interface DashboardData {
  scenario: DashboardScenario;
  scenarioLabel: string;
  user: UserStats;
  velanMood: VelanMood;
  velanGreeting: string;
  velanTips: string[];
  activeAdventure: ActiveAdventure;
  dailyQuests: DailyQuestItem[];
  bonusChest: BonusChestState;
  spacedRevision: SpacedRevisionState;
  realms: SubjectRealm[];
  weeklyStreak: DayStreakStatus[];
}

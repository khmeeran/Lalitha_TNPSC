// TNPSC Quest - Master Learning & Curriculum Type System
// Unifies Screens 3 through 8 with typed data contracts, SM-2 algorithms, and provenances

import { RealmId, NodeStatus, ExamGroup, LalithaMood } from "./adventureMap";
import { VelanMood } from "./dashboard";

// ============================================================================
// 1. SCREEN 3: MICRO-LESSON TYPES
// ============================================================================

export type LessonCardType =
  | "STORY_HOOK"
  | "CORE_CONCEPT"
  | "FACT_FLASH"
  | "EXAM_LENS"
  | "CHECKPOINT_CHALLENGE"
  | "VICTORY_CELEBRATION";

export interface HighlightedTerm {
  termTa: string;
  termEn: string;
  definitionTa: string;
  definitionEn: string;
}

export interface FactPillar {
  titleTa: string;
  titleEn: string;
  descriptionTa: string;
  descriptionEn: string;
  iconName?: string;
}

export interface CheckpointQuestion {
  questionId: string;
  questionTa: string;
  questionEn: string;
  options: Array<{
    optionId: "A" | "B" | "C" | "D";
    textTa: string;
    textEn: string;
  }>;
  correctOptionId: "A" | "B" | "C" | "D";
  explanationTa: string;
  explanationEn: string;
  socraticHintTa: string;
  socraticHintEn: string;
  pyqProvenanceBadge?: string;
}

export interface LessonCard {
  stepIndex: number; // 0 to 5 (strictly 6 cards)
  cardType: LessonCardType;
  headlineTa: string;
  headlineEn: string;
  bodyTa: string;
  bodyEn: string;
  lalithaMood: LalithaMood;
  velanMood: VelanMood;
  velanDialogueTa?: string;
  velanDialogueEn?: string;
  highlightedTerms?: HighlightedTerm[];
  factPillars?: FactPillar[];
  checkpoint?: CheckpointQuestion;
  examMnemonicTa?: string;
  examMnemonicEn?: string;
}

export interface MicroLessonPayload {
  nodeId: string;
  realmId: RealmId;
  realmNameTa: string;
  realmNameEn: string;
  unitNumber: number;
  topicId: string;
  topicTitleTa: string;
  topicTitleEn: string;
  subClause: string;
  estimatedMinutes: number;
  xpRewardBase: number;
  xpRewardCheckpoint: number;
  isAlreadyCleared: boolean;
  cards: LessonCard[];
}

// ============================================================================
// 2. SCREEN 4: QUIZ & CHAPTER BOSS TYPES
// ============================================================================

export type QuestionFormat =
  | "STANDARD_MCQ"
  | "MULTI_STATEMENT"
  | "CHRONOLOGICAL_ORDER"
  | "MATCH_FOLLOWING";

export interface QuizOption {
  id: string;
  textTa: string;
  textEn: string;
}

export interface MatchPair {
  leftTa: string;
  leftEn: string;
  rightTa: string;
  rightEn: string;
}

export interface QuizQuestionItem {
  id: string;
  format: QuestionFormat;
  questionTa: string;
  questionEn: string;
  options?: QuizOption[];
  correctOptionId?: string;
  statements?: Array<{ id: number; textTa: string; textEn: string }>;
  chronologicalItems?: Array<{ id: string; textTa: string; textEn: string; correctOrder: number }>;
  matchPairs?: MatchPair[];
  explanationTa: string;
  explanationEn: string;
  provenance: string; // e.g. "TNPSC Group 4 2024 • Q119"
  syllabusClause: string;
  velanRemedialHintTa: string;
  velanRemedialHintEn: string;
}

export interface QuizPayload {
  id: string;
  titleTa: string;
  titleEn: string;
  realmId: RealmId;
  isBossBattle: boolean;
  targetPassScore: number; // 80% (8/10) for Boss Battle
  xpReward: number;
  timeLimitSeconds?: number;
  questions: QuizQuestionItem[];
}

export interface QuizSubmissionResult {
  quizId: string;
  totalQuestions: number;
  correctCount: number;
  percentageScore: number;
  passed: boolean;
  xpEarned: number;
  timeTakenSeconds: number;
  missedConceptClauses: string[];
  remedialTips: string[];
}

// ============================================================================
// 3. SCREEN 5: MILESTONE PROGRESS & READINESS
// ============================================================================

export interface BadgeItem {
  id: string;
  titleTa: string;
  titleEn: string;
  descriptionTa: string;
  descriptionEn: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  category: "HERITAGE" | "POLITY" | "STREAK" | "MASTERY" | "SPECIAL";
}

export interface RealmReadinessItem {
  realmId: RealmId;
  nameTa: string;
  nameEn: string;
  unitNumber: number;
  completedNodes: number;
  totalNodes: number;
  masteryPercentage: number;
  bossDefeated: boolean;
  themeColor: string;
}

export interface ExamReadinessCrosswalk {
  examGroup: ExamGroup;
  examName: string;
  standard: string;
  overallReadinessPercent: number;
  unitsCoverage: Record<number, number>; // Unit 1..10 -> percentage
}

// ============================================================================
// 4. SCREEN 6: SPACED REPETITION (SM-2) TYPES
// ============================================================================

export type SM2QualityGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface FlashcardItem {
  id: string;
  nodeId: string;
  realmId: RealmId;
  frontTa: string;
  frontEn: string;
  backTa: string;
  backEn: string;
  keyFactsTa: string[];
  keyFactsEn: string[];
  mnemonicTa?: string;
  mnemonicEn?: string;
  provenance: string;
  easeFactor: number; // default 2.5, min 1.3
  intervalDays: number; // 0, 1, 6, ...
  repetitions: number;
  dueDate: string; // YYYY-MM-DD
  lastReviewedDate?: string;
  isOverdue: boolean;
}

export interface SM2QueueStats {
  cardsDueTodayCount: number;
  overdueCount: number;
  matureCardsCount: number; // interval > 21 days
  learningCardsCount: number;
  dailyCapLimit: number; // strictly 10 cards/day
  retentionRatePercent: number;
}

// ============================================================================
// 5. SCREEN 7: PYQ EXPLORER TYPES
// ============================================================================

export interface PYQQuestion {
  id: string;
  examGroup: ExamGroup;
  year: number;
  paperName: string;
  questionNumber: number;
  realmId: RealmId;
  unitNumber: number;
  topicTitle: string;
  questionTa: string;
  questionEn: string;
  options: Array<{
    id: "A" | "B" | "C" | "D";
    textTa: string;
    textEn: string;
  }>;
  correctOptionId: "A" | "B" | "C" | "D";
  officialCitation: string;
  explanationTa: string;
  explanationEn: string;
  isBookmarked?: boolean;
  userAttempt?: {
    selectedOption: string;
    isCorrect: boolean;
    attemptedAt: string;
  };
}

// ============================================================================
// 6. SCREEN 8: FULL MOCK EXAMINATION TYPES
// ============================================================================

export type OMRBubbleState = "UNVISITED" | "ANSWERED" | "MARKED_FOR_REVIEW" | "ANSWERED_AND_MARKED";

export interface MockExamSection {
  id: string;
  titleTa: string;
  titleEn: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarks: number;
}

export interface MockExamQuestionItem {
  index: number; // 1 to 200
  sectionId: string;
  questionTa: string;
  questionEn: string;
  options: Array<{ id: "A" | "B" | "C" | "D"; textTa: string; textEn: string }>;
  correctOptionId: "A" | "B" | "C" | "D";
  explanationTa: string;
  explanationEn: string;
  syllabusUnit: number;
  subjectTitle: string;
}

export interface MockExamAttemptState {
  examId: string;
  examTitle: string;
  durationSeconds: number;
  remainingSeconds: number;
  isCompleted: boolean;
  userAnswers: Record<number, "A" | "B" | "C" | "D">;
  bubbleStates: Record<number, OMRBubbleState>;
  startedAt: string;
  completedAt?: string;
}

export interface MockExamScorecard {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalMarksEarned: number;
  maxMarks: number;
  percentage: number;
  percentileRank: number;
  sectionalPerformance: Record<string, { correct: number; total: number; marks: number }>;
  timeSpentMinutes: number;
  velanFinalAssessmentTa: string;
  velanFinalAssessmentEn: string;
}

// ============================================================================
// 7. GLOBAL PERSISTED APPLICATION STATE & SRS (SPACED REPETITION)
// ============================================================================

export interface QuestionSRSItem {
  questionId: string;
  errorCount: number;
  isCursed: boolean;
  intervalDays: number; // 1, 3, 7
  repetitions: number;
  lastReviewedDate: string; // ISO YYYY-MM-DD
  nextReviewDate: string; // ISO YYYY-MM-DD
}

export interface GlobalLearningState {
  user: {
    name: string;
    level: number;
    levelTitle: string;
    currentXp: number;
    coins: number;
    streakDays: number;
    activeExamGroup: ExamGroup;
  };
  completedNodeIds: string[];
  activeNodeId: string;
  bookmarkedNodeIds: string[];
  bossDefeatedRealms: RealmId[];
  flashcards: FlashcardItem[];
  badges: BadgeItem[];
  settings: {
    audioNarrationEnabled: boolean;
    speechRate: number; // 0.8 to 1.2
    preferredLanguage: "BILINGUAL" | "TAMIL_ONLY" | "ENGLISH_ONLY";
  };
  pyqBookmarks: string[];
  lastExamScorecard?: MockExamScorecard;
  masteryGate?: {
    lastBossQuizId?: string;
    lastScore?: number;
    passed?: boolean; // requires >= 80
    failedRealmId?: string;
    showReviewMode?: boolean;
    reviewTopic?: string;
  };
  syllabusCoverage?: {
    coveredUnits: number[];
    coveragePercentage: number;
  };
  questionSrs: Record<string, QuestionSRSItem>;
}

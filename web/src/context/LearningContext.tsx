"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GlobalLearningState,
  FlashcardItem,
  BadgeItem,
  SM2QualityGrade,
  MockExamScorecard,
  QuestionSRSItem,
} from "../types/learning";
import { MOCK_FLASHCARDS } from "../data/mockRevisionData";
import { calculateSM2 } from "../utils/sm2Algorithm";

const INITIAL_BADGES: BadgeItem[] = [
  {
    id: "badge_first_step",
    titleTa: "First Step",
    titleEn: "First Step",
    descriptionTa: "Awarded for completing the first micro-lesson",
    descriptionEn: "Awarded for completing your first micro-lesson quest",
    icon: "👣",
    isUnlocked: true,
    unlockedAt: "2026-11-20",
    category: "SPECIAL",
  },
  {
    id: "badge_keeladi_scholar",
    titleTa: "Keeladi Explorer",
    titleEn: "Keeladi Archaeologist",
    descriptionTa: "Awarded for mastering all Keeladi heritage modules",
    descriptionEn: "Awarded for mastering all Keeladi archaeological concepts",
    icon: "🏺",
    isUnlocked: true,
    unlockedAt: "2026-11-21",
    category: "HERITAGE",
  },
  {
    id: "badge_chola_conqueror",
    titleTa: "Chola Conqueror",
    titleEn: "Chola Empire Conqueror",
    descriptionTa: "Awarded for scoring 80%+ in the Chola Boss Trial",
    descriptionEn: "Awarded for conquering the Imperial Cholas Chapter Boss Challenge",
    icon: "⚔️",
    isUnlocked: false,
    category: "MASTERY",
  },
  {
    id: "badge_constitution_sentinel",
    titleTa: "Constitution Guardian",
    titleEn: "Constitutional Sentinel",
    descriptionTa: "Awarded for mastering the Preamble & Fundamental Rights",
    descriptionEn: "Awarded for mastering Indian Polity Part III concepts",
    icon: "⚖️",
    isUnlocked: false,
    category: "POLITY",
  },
  {
    id: "badge_flaming_streak",
    titleTa: "7-Day Streak Shield",
    titleEn: "7-Day Flaming Streak",
    descriptionTa: "Awarded for maintaining a 7-day study momentum",
    descriptionEn: "Awarded for maintaining 7 consecutive days of active learning",
    icon: "🔥",
    isUnlocked: true,
    unlockedAt: "2026-11-22",
    category: "STREAK",
  },
  {
    id: "badge_mock_veteran",
    titleTa: "Model Exam Pioneer",
    titleEn: "Mock Exam Veteran",
    descriptionTa: "Awarded for completing a full Commission mock exam",
    descriptionEn: "Awarded for completing a full Commission mock examination",
    icon: "🏛️",
    isUnlocked: false,
    category: "SPECIAL",
  },
];

const INITIAL_STATE: GlobalLearningState = {
  user: {
    name: "Lalitha",
    level: 4,
    levelTitle: "VAO Aspirant",
    currentXp: 1840,
    coins: 350,
    streakDays: 7,
    activeExamGroup: "GROUP_4_VAO",
  },
  completedNodeIds: ["node_hist_1", "node_hist_2", "node_tamil_1"],
  activeNodeId: "node_hist_3",
  bookmarkedNodeIds: [],
  bossDefeatedRealms: [],
  flashcards: MOCK_FLASHCARDS,
  badges: INITIAL_BADGES,
  settings: {
    audioNarrationEnabled: true,
    speechRate: 1.0,
    preferredLanguage: "BILINGUAL",
  },
  pyqBookmarks: ["pyq_g4_2024_1"],
  questionSrs: {},
};

interface LearningContextType {
  state: GlobalLearningState;
  completeLesson: (nodeId: string, xpEarned: number) => void;
  recordQuizScore: (quizId: string, score: number, passed: boolean, xpEarned: number) => void;
  recordBossAttempt: (
    realmId: string,
    quizId: string,
    scorePercentage: number,
    xpEarned: number
  ) => { passed: boolean; unlockedNextRealm: boolean; showReviewMode: boolean };
  dismissReviewMode: () => void;
  gradeFlashcard: (cardId: string, grade: SM2QualityGrade) => void;
  togglePYQBookmark: (pyqId: string) => void;
  submitMockExamScorecard: (scorecard: MockExamScorecard) => void;
  toggleAudioNarration: () => void;
  setExamGroup: (group: any) => void;
  resetAllProgress: () => void;
  recordQuestionAttempt: (questionId: string, isCorrect: boolean) => {
    isCursed: boolean;
    errorCount: number;
    intervalDays: number;
  };
  getCursedQuestions: () => QuestionSRSItem[];
  dispelCurse: (questionId: string) => void;
  scrollRestoredNotice: boolean;
  dismissRestoredNotice: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

const STORAGE_KEY = "tnpsc_quest_global_state_v1";

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalLearningState>(INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [scrollRestoredNotice, setScrollRestoredNotice] = useState(false);

  // Hydrate from localStorage on client mount with corruption recovery
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || !parsed.user) {
          throw new Error("Invalid schema structure in stored state");
        }
        setState((prev) => ({
          ...prev,
          ...parsed,
          user: { ...prev.user, ...parsed.user },
          settings: { ...prev.settings, ...parsed.settings },
        }));
      }
    } catch (e) {
      console.warn("Corrupted or invalid localStorage state detected. Velan is restoring clean scroll...", e);
      setState(INITIAL_STATE);
      setScrollRestoredNotice(true);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
      } catch {}
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn("Failed to write learning state to localStorage", e);
      }
    }
  }, [state, isHydrated]);

  const completeLesson = (nodeId: string, xpEarned: number) => {
    setState((prev) => {
      const alreadyCompleted = prev.completedNodeIds.includes(nodeId);
      const newCompleted = alreadyCompleted
        ? prev.completedNodeIds
        : [...prev.completedNodeIds, nodeId];

      const newXp = alreadyCompleted ? prev.user.currentXp : prev.user.currentXp + xpEarned;
      const newLevel = Math.floor(newXp / 500) + 1;

      return {
        ...prev,
        completedNodeIds: newCompleted,
        user: {
          ...prev.user,
          currentXp: newXp,
          level: newLevel,
        },
      };
    });
  };

  const recordQuizScore = (
    quizId: string,
    score: number,
    passed: boolean,
    xpEarned: number
  ) => {
    setState((prev) => {
      const updatedBoss = [...prev.bossDefeatedRealms];
      let updatedBadges = [...prev.badges];

      if (quizId === "quiz_ancient_boss" && passed) {
        if (!updatedBoss.includes("realm_4_ancient")) {
          updatedBoss.push("realm_4_ancient");
        }
        updatedBadges = updatedBadges.map((b) =>
          b.id === "badge_chola_conqueror"
            ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString().split("T")[0] }
            : b
        );
      }

      return {
        ...prev,
        bossDefeatedRealms: updatedBoss,
        badges: updatedBadges,
        user: {
          ...prev.user,
          currentXp: passed ? prev.user.currentXp + xpEarned : prev.user.currentXp,
        },
      };
    });
  };

  const recordBossAttempt = (
    realmId: string,
    quizId: string,
    scorePercentage: number,
    xpEarned: number
  ) => {
    const passed = scorePercentage >= 80;
    const showReviewMode = !passed;

    setState((prev) => {
      const updatedBoss = [...prev.bossDefeatedRealms];
      let updatedBadges = [...prev.badges];

      if (passed) {
        if (!updatedBoss.includes(realmId as any)) {
          updatedBoss.push(realmId as any);
        }
        if (quizId === "quiz_ancient_boss") {
          updatedBadges = updatedBadges.map((b) =>
            b.id === "badge_chola_conqueror"
              ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString().split("T")[0] }
              : b
          );
        }
      }

      const newXp = passed ? prev.user.currentXp + xpEarned : prev.user.currentXp;
      const newLevel = Math.floor(newXp / 500) + 1;

      return {
        ...prev,
        bossDefeatedRealms: updatedBoss,
        badges: updatedBadges,
        user: {
          ...prev.user,
          currentXp: newXp,
          level: newLevel,
        },
        masteryGate: {
          lastBossQuizId: quizId,
          lastScore: scorePercentage,
          passed,
          failedRealmId: passed ? undefined : realmId,
          showReviewMode,
          reviewTopic: realmId,
        },
      };
    });

    return {
      passed,
      unlockedNextRealm: passed,
      showReviewMode,
    };
  };

  const dismissReviewMode = () => {
    setState((prev) => ({
      ...prev,
      masteryGate: prev.masteryGate ? { ...prev.masteryGate, showReviewMode: false } : undefined,
    }));
  };

  const gradeFlashcard = (cardId: string, grade: SM2QualityGrade) => {
    setState((prev) => {
      const card = prev.flashcards.find((c) => c.id === cardId);
      if (!card) return prev;

      const result = calculateSM2(card, grade);
      const updatedCards = prev.flashcards.map((c) =>
        c.id === cardId
          ? {
              ...c,
              easeFactor: result.newEaseFactor,
              intervalDays: result.newIntervalDays,
              repetitions: result.newRepetitions,
              dueDate: result.newDueDate,
              isOverdue: false,
              lastReviewedDate: new Date().toISOString().split("T")[0],
            }
        : c
      );

      return {
        ...prev,
        flashcards: updatedCards,
        user: {
          ...prev.user,
          currentXp: grade >= 3 ? prev.user.currentXp + 5 : prev.user.currentXp,
        },
      };
    });
  };

  const togglePYQBookmark = (pyqId: string) => {
    setState((prev) => {
      const exists = prev.pyqBookmarks.includes(pyqId);
      return {
        ...prev,
        pyqBookmarks: exists
          ? prev.pyqBookmarks.filter((id) => id !== pyqId)
          : [...prev.pyqBookmarks, pyqId],
      };
    });
  };

  const submitMockExamScorecard = (scorecard: MockExamScorecard) => {
    setState((prev) => {
      const updatedBadges = prev.badges.map((b) =>
        b.id === "badge_mock_veteran"
          ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString().split("T")[0] }
          : b
      );

      return {
        ...prev,
        lastExamScorecard: scorecard,
        badges: updatedBadges,
        user: {
          ...prev.user,
          currentXp: prev.user.currentXp + Math.round(scorecard.totalMarksEarned),
        },
      };
    });
  };

  const toggleAudioNarration = () => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        audioNarrationEnabled: !prev.settings.audioNarrationEnabled,
      },
    }));
  };

  const setExamGroup = (group: any) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        activeExamGroup: group,
      },
    }));
  };

  const resetAllProgress = () => {
    setState(INITIAL_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  /**
   * Pillar 3 SRS & Cursed Topics Engine
   * Wrong answers automatically tag questions as "Cursed", increment errorCount,
   * and schedule them for 1-day, 3-day, and 7-day review intervals.
   */
  const recordQuestionAttempt = (questionId: string, isCorrect: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    let resultStatus = { isCursed: false, errorCount: 0, intervalDays: 1 };

    setState((prev) => {
      const currentSrs = prev.questionSrs || {};
      const existing = currentSrs[questionId];

      if (isCorrect) {
        if (existing && existing.isCursed) {
          const newReps = (existing.repetitions || 0) + 1;
          const isNowCursed = newReps < 2; // 2 consecutive correct retrievals dispels curse
          const newInterval = existing.intervalDays === 1 ? 3 : existing.intervalDays === 3 ? 7 : 14;
          const nextDateObj = new Date();
          nextDateObj.setDate(nextDateObj.getDate() + newInterval);
          const nextReviewDate = nextDateObj.toISOString().split("T")[0];

          resultStatus = {
            isCursed: isNowCursed,
            errorCount: existing.errorCount,
            intervalDays: newInterval,
          };

          return {
            ...prev,
            questionSrs: {
              ...currentSrs,
              [questionId]: {
                ...existing,
                isCursed: isNowCursed,
                repetitions: newReps,
                intervalDays: newInterval,
                lastReviewedDate: today,
                nextReviewDate,
              },
            },
          };
        }
        return prev;
      } else {
        // Tagged as CURSED topic for SRS review
        const newErrorCount = (existing?.errorCount || 0) + 1;
        const nextDateObj = new Date();
        nextDateObj.setDate(nextDateObj.getDate() + 1);
        const nextReviewDate = nextDateObj.toISOString().split("T")[0];

        resultStatus = {
          isCursed: true,
          errorCount: newErrorCount,
          intervalDays: 1,
        };

        return {
          ...prev,
          questionSrs: {
            ...currentSrs,
            [questionId]: {
              questionId,
              errorCount: newErrorCount,
              isCursed: true,
              intervalDays: 1,
              repetitions: 0,
              lastReviewedDate: today,
              nextReviewDate,
            },
          },
        };
      }
    });

    return resultStatus;
  };

  const getCursedQuestions = (): QuestionSRSItem[] => {
    if (!state.questionSrs) return [];
    return Object.values(state.questionSrs).filter((item) => item.isCursed);
  };

  const dispelCurse = (questionId: string) => {
    setState((prev) => {
      if (!prev.questionSrs?.[questionId]) return prev;
      return {
        ...prev,
        questionSrs: {
          ...prev.questionSrs,
          [questionId]: {
            ...prev.questionSrs[questionId],
            isCursed: false,
            repetitions: (prev.questionSrs[questionId].repetitions || 0) + 2,
          },
        },
      };
    });
  };

  return (
    <LearningContext.Provider
      value={{
        state,
        completeLesson,
        recordQuizScore,
        recordBossAttempt,
        dismissReviewMode,
        gradeFlashcard,
        togglePYQBookmark,
        submitMockExamScorecard,
        toggleAudioNarration,
        setExamGroup,
        resetAllProgress,
        recordQuestionAttempt,
        getCursedQuestions,
        dispelCurse,
        scrollRestoredNotice,
        dismissRestoredNotice: () => setScrollRestoredNotice(false),
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
};

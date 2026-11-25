// TNPSC Quest - SuperMemo SM-2 Spaced Repetition Algorithm Implementation
// Formally compliant with Section 4.2 of TNPSC_QUEST_PRODUCT_BLUEPRINT.md

import { FlashcardItem, SM2QualityGrade, SM2QueueStats } from "../types/learning";

export interface SM2CalculationResult {
  newEaseFactor: number;
  newIntervalDays: number;
  newRepetitions: number;
  newDueDate: string;
}

/**
 * Calculates next SM-2 interval and ease factor
 */
export function calculateSM2(
  card: FlashcardItem,
  grade: SM2QualityGrade,
  todayStr: string = "2026-11-23"
): SM2CalculationResult {
  const q = grade;
  const ef = card.easeFactor || 2.5;
  const n = card.repetitions || 0;
  const i = card.intervalDays || 0;

  // 1. Calculate new Ease Factor (EF')
  // EF' = max(1.3, EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
  const delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  let newEf = Math.max(1.3, ef + delta);

  // Check days overdue
  const today = new Date(todayStr);
  const due = new Date(card.dueDate || todayStr);
  const diffTime = today.getTime() - due.getTime();
  const daysOverdue = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  let newInterval: number;
  let newRepetitions: number;

  if (q < 3) {
    // Recall failure: Reset interval and repetitions
    newRepetitions = 0;
    newInterval = 1;
    if (daysOverdue > 0) {
      newEf = Math.max(1.3, newEf - 0.2);
    }
  } else {
    // Successful recall (q >= 3)
    newRepetitions = n + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      if (daysOverdue > 0) {
        // Rewarded retention over elongated interval
        newInterval = Math.ceil((i + daysOverdue / 2) * newEf);
      } else {
        newInterval = Math.ceil(i * newEf);
      }
    }
  }

  // Calculate new due date
  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + newInterval);
  const newDueDate = nextDate.toISOString().split("T")[0];

  return {
    newEaseFactor: Math.round(newEf * 100) / 100,
    newIntervalDays: newInterval,
    newRepetitions: newRepetitions,
    newDueDate,
  };
}

/**
 * Filter and sort flashcards strictly adhering to the 10-Card Daily Limit Policy
 */
export function getDailyRevisionQueue(
  cards: FlashcardItem[],
  todayStr: string = "2026-11-23",
  maxDailyCap: number = 10
): FlashcardItem[] {
  const today = new Date(todayStr);

  // Cards due on or before today
  const eligible = cards.filter((card) => {
    const due = new Date(card.dueDate);
    return due <= today;
  });

  // Prioritization sorting:
  // 1. Overdue cards (due date < today), sorted by days overdue descending
  // 2. Fragile cards (EF < 1.8)
  // 3. Regular cards due today
  eligible.sort((a, b) => {
    const dueA = new Date(a.dueDate).getTime();
    const dueB = new Date(b.dueDate).getTime();
    const todayTime = today.getTime();

    const isOverdueA = dueA < todayTime;
    const isOverdueB = dueB < todayTime;

    if (isOverdueA && !isOverdueB) return -1;
    if (!isOverdueA && isOverdueB) return 1;
    if (isOverdueA && isOverdueB) return dueA - dueB; // earlier date is more overdue

    // Fragile cards
    const isFragileA = a.easeFactor < 1.8;
    const isFragileB = b.easeFactor < 1.8;
    if (isFragileA && !isFragileB) return -1;
    if (!isFragileA && isFragileB) return 1;

    return a.easeFactor - b.easeFactor;
  });

  return eligible.slice(0, maxDailyCap);
}

/**
 * Computes memory vault retention and queue statistics
 */
export function computeQueueStats(
  cards: FlashcardItem[],
  todayStr: string = "2026-11-23"
): SM2QueueStats {
  const today = new Date(todayStr);
  let dueCount = 0;
  let overdueCount = 0;
  let matureCount = 0;
  let learningCount = 0;

  for (const card of cards) {
    const due = new Date(card.dueDate);
    if (due <= today) {
      dueCount++;
      if (due < today) overdueCount++;
    }
    if (card.intervalDays >= 21) {
      matureCount++;
    } else {
      learningCount++;
    }
  }

  const total = cards.length;
  const retention = total > 0 ? Math.round((matureCount / total) * 100) : 85;

  return {
    cardsDueTodayCount: Math.min(10, dueCount),
    overdueCount,
    matureCardsCount: matureCount,
    learningCardsCount: learningCount,
    dailyCapLimit: 10,
    retentionRatePercent: retention,
  };
}

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Sword,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Compass,
  Scroll as ScrollIcon,
  HelpCircle,
  Menu,
  X,
  ShieldCheck,
  Target,
} from "lucide-react";
import { playButtonClick, playBubblePop, playTypewriterTick, playCoinSound } from "../../utils/soundEffects";
import { triggerCoinRain, triggerRewardParticles, confetti } from "../../utils/particleEngine";
import { speakNarration, stopNarration } from "../../utils/speechSynthesis";
import { useLearning } from "../../context/LearningContext";
import { loadMasterTNPSCQuestions, QuestionItem } from "../../utils/tnpscDataLoader";
import {
  calculateSyllabusCoverage,
  getDifficultyForLevel,
  checkRealmMasteryLock,
  selectGuaranteedQuestions,
  getNodeStoryHook,
  SYLLABUS_MAPPING,
  REALM_PROGRESSION_CHAIN,
} from "../../data/syllabusMapping";
import { WizardOathOnboarding } from "./WizardOathOnboarding";
import { audioEngine } from "../../lib/audioEngine";
import { useLanguage } from "../../context/LanguageContext";
import { TranslationToggle } from "../translation/TranslationToggle";
import { GlobalLanguageToggle } from "../translation/GlobalLanguageToggle";
import { VelanCodexButton } from "../codex/VelanCodexModal";
import { motion, AnimatePresence } from "framer-motion";

interface ActiveQuestionView {
  id: string;
  realm: string;
  syllabusUnit: string;
  topic: string;
  question: string;
  questionTa?: string;
  options: { id: string; text: string; textTa?: string; isCorrect: boolean }[];
  optionsTa?: string[];
  explanation: string;
  explanationTa?: string;
  difficulty: "G4" | "G2" | "G1";
  source: string;
  isPyq: boolean;
  goldReward: number;
  xpReward: number;
  errorAnalysis?: Record<string, string>;
  errorAnalysisTa?: Record<string, string>;
  correctAnswerIndex?: number;
}

// Fallback seed if loading is in flight
const FALLBACK_QUESTION: ActiveQuestionView = {
  id: "q_0001",
  realm: "History Highlands",
  syllabusUnit: "UNIT_IV",
  topic: "Ashoka's Edicts & Mauryan Dynasty",
  question: "Which of the following rock edicts of Ashoka mentions the Kalinga war and his remorse?",
  questionTa: "அசோகரின் பின்வரும் எந்த பாறை கல்வெட்டு கலிங்கப் போரையும் அவரது மனவருத்தத்தையும் குறிப்பிடுகிறது?",
  options: [
    { id: "A", text: "Rock Edict I", textTa: "பாறை கல்வெட்டு I", isCorrect: false },
    { id: "B", text: "Rock Edict XIII", textTa: "பாறை கல்வெட்டு XIII", isCorrect: true },
    { id: "C", text: "Rock Edict V", textTa: "பாறை கல்வெட்டு V", isCorrect: false },
    { id: "D", text: "Rock Edict II", textTa: "பாறை கல்வெட்டு II", isCorrect: false },
  ],
  explanation: "Rock Edict XIII contains the vivid description of the Kalinga war and Ashoka's remorse.",
  explanationTa: "பாறை கல்வெட்டு XIII கலிங்கப் போர் மற்றும் அதனால் அசோகர் அடைந்த துயரத்தை விவரிக்கிறது.",
  difficulty: "G4",
  source: "PYQ_2018_G2",
  isPyq: true,
  goldReward: 50,
  xpReward: 120,
  correctAnswerIndex: 1,
  errorAnalysis: {
    "0": "Rock Edict I prohibits animal sacrifice; it does not mention the Kalinga war.",
    "2": "Rock Edict V concerns the appointment of Dhamma Mahamattas.",
    "3": "Rock Edict II mentions medical care for Cholas and Pandyas, not the Kalinga war remorse.",
  },
  errorAnalysisTa: {
    "0": "பாறை கல்வெட்டு I விலங்கு பலியிடுதலைத் தடை செய்கிறது; கலிங்கப் போரைக் குறிப்பிடவில்லை.",
    "2": "பாறை கல்வெட்டு V தர்ம மகாமாத்திரர்கள் நியமனம் பற்றியது.",
    "3": "பாறை கல்வெட்டு II சோழர்கள் மற்றும் பாண்டியர்களுக்கான மருத்துவ வசதிகளைக் குறிப்பிடுகிறது.",
  },
};

/**
 * Pillar 5: Pedagogical Dialogue Engine
 * Replaces generic strings with cognitively grounded reinforcement, scaffolding, and motivation.
 */
function getPedagogicalDialogue(params: {
  pedagogicalState: "CORRECT" | "WRONG" | "STREAK" | "CURSED_DISPELLED" | "STORY_HOOK";
  question: ActiveQuestionView;
  userAnswerIndex?: number;
  streakCount?: number;
  storyHookNarrative?: string;
  storyHookNarrativeTa?: string;
}): { speaker: "VELAN" | "LALITHA"; text: string; textTa?: string } {
  const { pedagogicalState, question, userAnswerIndex, streakCount, storyHookNarrative, storyHookNarrativeTa } = params;

  if (pedagogicalState === "STORY_HOOK" && storyHookNarrative) {
    return {
      speaker: "VELAN",
      text: storyHookNarrative,
      textTa: storyHookNarrativeTa,
    };
  }

  if (pedagogicalState === "CORRECT") {
    const correctOpt = question.options.find((o) => o.isCorrect);
    const correctOptTa = correctOpt?.textTa || correctOpt?.text;
    return {
      speaker: "VELAN",
      text: `Flawless recall, Lalitha! You locked "${correctOpt?.text}". Provenance: ${question.source}. Concept insight: ${question.explanation}`,
      textTa: question.explanationTa
        ? `அருமை லலிதா! சரியான விடை: "${correctOptTa}". கருத்து விளக்கம்: ${question.explanationTa}`
        : undefined,
    };
  }

  if (pedagogicalState === "WRONG") {
    const distractorKey = userAnswerIndex !== undefined ? String(userAnswerIndex) : "0";
    const specificDistractorAnalysis =
      question.errorAnalysis?.[distractorKey] ||
      `Exam Pitfall: That choice confuses related syllabus terminology.`;
    const specificDistractorAnalysisTa =
      question.errorAnalysisTa?.[distractorKey] ||
      `கவனம்! இந்தத் தேர்வு தொடர்புடைய பாடக் கருத்துகளுடன் குழப்பத்தை ஏற்படுத்தும்.`;
    return {
      speaker: "VELAN",
      text: `Cognitive Trap Alert! ${specificDistractorAnalysis} Key takeaway: ${question.explanation}`,
      textTa: question.explanationTa
        ? `கவனப் பொறி எச்சரிக்கை! ${specificDistractorAnalysisTa} முதன்மை விளக்கம்: ${question.explanationTa}`
        : undefined,
    };
  }

  if (pedagogicalState === "STREAK") {
    return {
      speaker: "VELAN",
      text: `Your mental mana surges! ${streakCount} consecutive correct retrievals. The Commission's Rank 1 is within grasp!`,
      textTa: `உங்கள் மன ஆற்றல் பெருகுகிறது! தொடர்ந்து ${streakCount} சரியான விடைகள். முதல் தரவரிசை மிக அருகில் உள்ளது!`,
    };
  }

  return {
    speaker: "LALITHA",
    text: "Investigating the next syllabus trial...",
    textTa: "அடுத்த பாடத்திட்ட வினாவை ஆராய்கிறேன்...",
  };
}

export const TNPSCWizardGameInterface: React.FC = () => {
  const router = useRouter();
  const {
    state,
    completeLesson,
    recordBossAttempt,
    dismissReviewMode,
    recordQuestionAttempt,
    getCursedQuestions,
    dispelCurse,
    scrollRestoredNotice,
    dismissRestoredNotice,
  } = useLearning();

  // Anti-Chaos Gating: Prevents duplicate XP and race conditions from rapid-fire clicking
  const isAnsweringRef = useRef(false);
  const isNavigatingRef = useRef(false);

  // Active Realm
  const [currentRealmId, setCurrentRealmId] = useState<string>("realm_4_ancient");
  const [currentRealmName, setCurrentRealmName] = useState<string>("History Highlands");

  // Raw loaded items (fetched once on mount) + active question pool
  const [rawQuestionItems, setRawQuestionItems] = useState<QuestionItem[]>([]);
  const [questionPool, setQuestionPool] = useState<ActiveQuestionView[]>([FALLBACK_QUESTION]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [streak, setStreak] = useState(0);

  // Language context
  const { isTamil } = useLanguage();
  const [showOptionsTa, setShowOptionsTa] = useState(false);

  // Pillar 4: Metacognitive Post-Mortem Analysis Modal State
  const [postMortemModal, setPostMortemModal] = useState<{
    isOpen: boolean;
    chosenOptionId: string;
    chosenOptionText: string;
    chosenOptionTextTa?: string;
    correctOptionId: string;
    correctOptionText: string;
    correctOptionTextTa?: string;
    distractorReason: string;
    distractorReasonTa?: string;
    coreExplanation: string;
    coreExplanationTa?: string;
    isCursed: boolean;
    intervalDays: number;
  } | null>(null);

  // Local HUD stats
  const [mana, setMana] = useState(85);
  const [xp, setXp] = useState(state.user.currentXp || 640);
  const [goldCoins, setGoldCoins] = useState(state.user.coins || 380);
  const userLevel = state.user.level || 4;
  const [activeTab, setActiveTab] = useState<"QUEST" | "GRIND" | "REVIEW" | "TABS">("QUEST");
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  // Character Dialogue State
  const [speaker, setSpeaker] = useState<"LALITHA" | "VELAN">("VELAN");
  const [dialogueText, setDialogueText] = useState(
    "Lalitha! Sourced directly from TNPSC past papers! Notice the Group tier tag—let's conquer this question!"
  );
  const [dialogueTextTa, setDialogueTextTa] = useState<string | undefined>(
    "லலிதா! இது TNPSC முந்தைய ஆண்டு வினாத்தாளிலிருந்து நேரடியாக எடுக்கப்பட்டது! தேர்வுத் தரத்தைக் கவனித்து விடையளிப்போம்!"
  );
  const [displayedText, setDisplayedText] = useState(
    "Lalitha! Sourced directly from TNPSC past papers! Notice the Group tier tag—let's conquer this question!"
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Mobile Quest Log Drawer
  const [isMobileParchmentOpen, setIsMobileParchmentOpen] = useState(false);

  // Pillar 2: Cognitive Load Optimization & Contextual UI Dimming ("Focus Mode")
  const [focusMode, setFocusMode] = useState<"TRIAL" | "MAP">("TRIAL");

  // Requirement 4: Gatekeeper Modal State
  const [gatekeeperNotice, setGatekeeperNotice] = useState<{
    targetRealmName: string;
    requiredBossName: string;
    threshold: number;
    currentScore?: number;
  } | null>(null);

  // Interactive Boss Challenge Modal (>80% Mastery Check)
  const [isBossChallengeActive, setIsBossChallengeActive] = useState(false);
  const [bossScore, setBossScore] = useState<number | null>(null);

  // Calculate Syllabus Coverage (Requirement 1)
  const coverage = useMemo(() => {
    return calculateSyllabusCoverage(state.completedNodeIds || ["node_hist_1", "node_hist_2"]);
  }, [state.completedNodeIds]);

  // Check URL query params for initial tab (e.g. ?tab=GRIND from Daily Oracle)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get("tab");
      if (tabParam === "GRIND") {
        setActiveTab("GRIND");
      }
    }
  }, []);

  // Difficulty Tier based on User Level (Requirement 2)
  const currentDifficultyTier = useMemo(() => {
    return getDifficultyForLevel(userLevel, isBossChallengeActive);
  }, [userLevel, isBossChallengeActive]);

  // 1. Load raw TNPSC questions ONCE on mount with hard 1500ms preloader unlock guarantee
  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) setIsAppLoaded(true);
    }, 1500);

    async function loadQuestionsOnce() {
      try {
        const result = await loadMasterTNPSCQuestions();
        if (!isMounted) return;

        const allItems: QuestionItem[] = [];
        (result.data?.subjects || []).forEach((s) => {
          (s.topics || []).forEach((t) => {
            (t.questions || []).forEach((q) => {
              if (q && Array.isArray(q.options) && q.options.length > 0) {
                allItems.push(q);
              }
            });
          });
        });

        setRawQuestionItems(allItems);
      } catch (err) {
        console.error("Failed to load authentic questions:", err);
      } finally {
        if (isMounted) {
          clearTimeout(safetyTimer);
          setIsAppLoaded(true);
        }
      }
    }

    loadQuestionsOnce();
    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  // 2. Build active questionPool when raw items, realm, difficulty tier, or tab change
  useEffect(() => {
    if (rawQuestionItems.length === 0) return;

    let targetPool = rawQuestionItems;
    if (activeTab === "GRIND") {
      const cursedIds = new Set(
        Object.values(state.questionSrs || {})
          .filter((item) => item.isCursed)
          .map((item) => item.questionId)
      );
      const cursedItems = rawQuestionItems.filter((q) => cursedIds.has(q.id));
      if (cursedItems.length > 0) {
        targetPool = cursedItems;
      }
    }

    const filtered =
      activeTab === "GRIND"
        ? targetPool
        : selectGuaranteedQuestions(targetPool, 12, currentDifficultyTier);

    const mapped: ActiveQuestionView[] = filtered.map((q, idx) => {
      const optLetters = ["A", "B", "C", "D"];
      return {
        id: q.id || `q_${idx}`,
        realm: currentRealmName,
        syllabusUnit: q.syllabus_unit || "UNIT_IV",
        topic: q.group || "TNPSC General Studies",
        question: q.question,
        questionTa: q.questionTa,
        options: q.options.map((optText, i) => ({
          id: optLetters[i] || `${i}`,
          text: optText,
          textTa: q.optionsTa && q.optionsTa[i] ? q.optionsTa[i] : undefined,
          isCorrect: i === q.correct_answer,
        })),
        optionsTa: q.optionsTa,
        explanation: q.explanation || "Official TNPSC Answer Key standard explanation.",
        explanationTa: q.explanationTa,
        difficulty: q.difficulty || currentDifficultyTier,
        source: q.source || `PYQ_${q.year || 2022}_G1`,
        isPyq: q.is_pyq ?? true,
        goldReward: q.difficulty === "G1" ? 80 : q.difficulty === "G2" ? 60 : 40,
        xpReward: q.difficulty === "G1" ? 180 : q.difficulty === "G2" ? 140 : 100,
        errorAnalysis: q.error_analysis,
        errorAnalysisTa: q.error_analysisTa,
        correctAnswerIndex: q.correct_answer,
      };
    });

    if (mapped.length > 0) {
      setQuestionPool(mapped);
      setCurrentQIndex(0);
    }
  }, [rawQuestionItems, currentRealmId, currentDifficultyTier, activeTab]);

  const activeQuestion = questionPool[currentQIndex] || FALLBACK_QUESTION;
  const activeRealmObj = useMemo(
    () => REALM_PROGRESSION_CHAIN.find((r) => r.realmId === currentRealmId),
    [currentRealmId]
  );
  const activeUnitStoryHook = useMemo(() => {
    const activeUnit = SYLLABUS_MAPPING.units.find((u) => u.realmId === currentRealmId);
    return getNodeStoryHook(activeUnit?.nodes?.[0]);
  }, [currentRealmId]);

  const activeDialogueSource = isTamil && dialogueTextTa ? dialogueTextTa : dialogueText;

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let charIdx = 0;
    playBubblePop();

    const timer = setInterval(() => {
      charIdx++;
      setDisplayedText(activeDialogueSource.slice(0, charIdx));
      playTypewriterTick();

      if (charIdx >= activeDialogueSource.length) {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [activeDialogueSource]);

  // Audio speech narration toggle with volume ducking (Phase 3 Audio Engine)
  const handleToggleAudio = () => {
    playButtonClick();
    if (isSpeakingAudio) {
      stopNarration();
      setIsSpeakingAudio(false);
      audioEngine.duckAudio(false);
    } else {
      setIsSpeakingAudio(true);
      audioEngine.duckAudio(true);
      speakNarration(dialogueText, {
        speaker,
        lang: "en-IN",
        onEnd: () => {
          setIsSpeakingAudio(false);
          audioEngine.duckAudio(false);
        },
        onError: () => {
          setIsSpeakingAudio(false);
          audioEngine.duckAudio(false);
        },
      });
    }
  };

  // Option Click Handler with Pedagogical Scaffolding, SRS Tracking & Phase 3 Sensory Cues
  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    // Anti-Chaos Lock: Guarantee zero duplicate execution or XP duplication under rapid clicks
    if (hasAnswered || isAnsweringRef.current) return;
    isAnsweringRef.current = true;

    playButtonClick();
    setSelectedOption(optionId);
    setHasAnswered(true);
    setIsAnswerCorrect(isCorrect);

    // Silence focus drone upon retrieval attempt completion
    audioEngine.stopRetrievalFocusDrone();

    const optionLetters = ["A", "B", "C", "D"];
    const chosenIdx = optionLetters.indexOf(optionId);

    // Pillar 3: Spaced Repetition System (SRS) State Record
    const srsOutcome = recordQuestionAttempt(activeQuestion.id, isCorrect);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Phase 3 Sensory Feedback: Correct Recall / Streak / Curse Dispelled
      if (newStreak >= 3) {
        audioEngine.playStreakMomentum();
      } else if (!srsOutcome.isCursed && state.questionSrs?.[activeQuestion.id]?.isCursed) {
        audioEngine.playCurseDispelled();
      } else {
        audioEngine.playCorrectRecall();
      }

      triggerRewardParticles({
        type: "STAR",
        originX: window.innerWidth * 0.35,
        originY: window.innerHeight * 0.7,
        count: 18,
      });
      confetti({ particleCount: 50, spread: 60 });
      setGoldCoins((prev) => prev + activeQuestion.goldReward);
      setXp((prev) => prev + activeQuestion.xpReward);
      setMana((prev) => Math.min(100, prev + 15));

      const dialogue = getPedagogicalDialogue({
        pedagogicalState: newStreak >= 3 ? "STREAK" : "CORRECT",
        question: activeQuestion,
        userAnswerIndex: chosenIdx,
        streakCount: newStreak,
      });
      setSpeaker(dialogue.speaker);
      setDialogueText(dialogue.text);
      setDialogueTextTa(dialogue.textTa);
    } else {
      setStreak(0);
      setMana((prev) => Math.max(10, prev - 20));

      // Phase 3 Sensory Feedback: Distractor Trap (Minor 2nd dissonance + double 50ms buzz)
      audioEngine.playDistractorTrap();

      const distractorReason =
        activeQuestion.errorAnalysis?.[String(chosenIdx)] ||
        `Confusing this option with the correct concept is a frequent exam pitfall.`;

      const distractorReasonTa =
        activeQuestion.errorAnalysisTa?.[String(chosenIdx)] ||
        `விருப்பம் ${optionId} என்பது தொடர்புடைய பாடக் கருத்துகளுடன் குழப்பமடைய வைக்கும் விடையாகும்.`;

      const dialogue = getPedagogicalDialogue({
        pedagogicalState: "WRONG",
        question: activeQuestion,
        userAnswerIndex: chosenIdx,
      });
      setSpeaker(dialogue.speaker);
      setDialogueText(dialogue.text);
      setDialogueTextTa(dialogue.textTa);

      const chosenOpt = activeQuestion.options.find((o) => o.id === optionId);
      const correctOpt = activeQuestion.options.find((o) => o.isCorrect);

      // Pillar 4: Metacognition & Post-Mortem Analysis Modal Trigger
      setPostMortemModal({
        isOpen: true,
        chosenOptionId: optionId,
        chosenOptionText: chosenOpt?.text || "",
        chosenOptionTextTa: chosenOpt?.textTa,
        correctOptionId: correctOpt?.id || "Key",
        correctOptionText: correctOpt?.text || "",
        correctOptionTextTa: correctOpt?.textTa,
        distractorReason,
        distractorReasonTa,
        coreExplanation: activeQuestion.explanation,
        coreExplanationTa: activeQuestion.explanationTa,
        isCursed: srsOutcome.isCursed,
        intervalDays: srsOutcome.intervalDays,
      });
    }
  };

  // Phase 3: Focus Drone during Retrieval Phase (Silence Test: 40Hz focus drone only)
  useEffect(() => {
    if (!hasAnswered && focusMode === "TRIAL" && !isBossChallengeActive && !isSpeakingAudio) {
      audioEngine.startRetrievalFocusDrone();
    } else {
      audioEngine.stopRetrievalFocusDrone();
    }
    return () => {
      audioEngine.stopRetrievalFocusDrone();
    };
  }, [hasAnswered, focusMode, isBossChallengeActive, isSpeakingAudio]);

  // Phase 3: Boss Battle Metronome Effect (Forces deliberate pacing on G1 multi-statements)
  useEffect(() => {
    if (!isBossChallengeActive) return;
    const interval = setInterval(() => {
      audioEngine.playMetronomeTick();
    }, 1000); // 60 BPM precision metronome
    return () => clearInterval(interval);
  }, [isBossChallengeActive]);

  // Navigate Questions (Anti-Chaos Debounced)
  const handleNextQuest = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 200);
    isAnsweringRef.current = false;

    playButtonClick();
    if (currentQIndex < questionPool.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      setIsAnswerCorrect(false);
      setShowOptionsTa(false);
      setSpeaker("VELAN");
      setDialogueText(`Next trial! Notice the difficulty rating: ${activeQuestion.difficulty}. Let's examine it carefully!`);
      setDialogueTextTa(`அடுத்த வினா! இதன் தேர்வுத் தரம் ${activeQuestion.difficulty}. கவனமாகப் படித்து விடையளிப்போம்!`);
    } else {
      triggerCoinRain(2000);
      setSpeaker("LALITHA");
      setDialogueText("You have completed all trials in this circuit! Challenge the Region Boss to prove mastery!");
      setDialogueTextTa("இந்தச் சுற்றின் அனைத்து வினாக்களையும் முடித்துவிட்டீர்கள்! இறுதித் தேர்வை எதிர்கொண்டு தேர்ச்சியை நிரூபியுங்கள்!");
    }
  };

  const handlePrevQuest = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 200);
    isAnsweringRef.current = false;

    playButtonClick();
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
      setSelectedOption(null);
      setHasAnswered(false);
      setIsAnswerCorrect(false);
      setShowOptionsTa(false);
      setSpeaker("LALITHA");
      setDialogueText("Reviewing the previous trial. Consistent recall builds Civil Service rank!");
      setDialogueTextTa("முந்தைய வினாவை மீள்பார்வை செய்கிறோம். தொடர் பயிற்சியே வெற்றியைத் தரும்!");
    }
  };

  // Realm Node Selection (Requirement 4: Mastery Gatekeeper)
  const handleSelectRealmNode = (targetRealmId: string, targetRealmName: string) => {
    playButtonClick();
    const lockCheck = checkRealmMasteryLock(targetRealmId, state.bossDefeatedRealms || []);

    if (!lockCheck.isUnlocked) {
      // Gatekeeper Lock Triggers
      setGatekeeperNotice({
        targetRealmName,
        requiredBossName: lockCheck.requiredBossName || "History Highlands",
        threshold: lockCheck.passThreshold,
        currentScore: 60, // Socratic diagnostic signal
      });
      setSpeaker("VELAN");
      setDialogueText(
        `Halt Lalitha! ${targetRealmName} is locked by the Commission! You must clear the ${lockCheck.requiredBossName} Boss Trial with >${lockCheck.passThreshold}% score first!`
      );
      setDialogueTextTa(
        `நில்லுங்கள் லலிதா! ${targetRealmName} பூட்டப்பட்டுள்ளது. முதலில் ${lockCheck.requiredBossName} இறுதித் தேர்வில் >${lockCheck.passThreshold}% மதிப்பெண் பெற வேண்டும்!`
      );
      return;
    }

    // Unlocked: Navigate with Pillar 1 Story Hook
    setCurrentRealmId(targetRealmId);
    setCurrentRealmName(targetRealmName);
    setGatekeeperNotice(null);

    const activeUnit = SYLLABUS_MAPPING.units.find((u) => u.realmId === targetRealmId);
    const firstNode = activeUnit?.nodes?.[0];
    const hook = getNodeStoryHook(firstNode);

    setSpeaker("VELAN");
    setDialogueText(`"${hook.narrativeEn}" Quest Goal: ${hook.investigatorGoal}`);
    setDialogueTextTa(
      hook.narrativeTa
        ? `"${hook.narrativeTa}" இலக்கு: ${hook.investigatorGoalTa || hook.investigatorGoal}`
        : undefined
    );
  };

  // Trigger Boss Trial (>80% Gatekeeper Evaluation)
  const handleStartBossTrial = () => {
    playButtonClick();
    setIsBossChallengeActive(true);
    setGatekeeperNotice(null);
  };

  // Submit Boss Trial Result
  const handleCompleteBossEvaluation = (scorePercent: number) => {
    const result = recordBossAttempt(currentRealmId, `quiz_${currentRealmId}_boss`, scorePercent, 250);
    setBossScore(scorePercent);
    setIsBossChallengeActive(false);

    if (result.passed) {
      playCoinSound();
      triggerCoinRain(3000);
      confetti({ particleCount: 100, spread: 80 });
      setSpeaker("LALITHA");
      setDialogueText(
        `VICTORY! Scored ${scorePercent}% (Threshold: 80%)! The Commission has unlocked the next map region for us!`
      );
    } else {
      setSpeaker("VELAN");
      setDialogueText(
        `Mastery Check Failed (Score: ${scorePercent}% < 80%). The Commission mandates >80% accuracy! Entering Grind & Review Mode to reinforce your weak concepts!`
      );
      setActiveTab("REVIEW");
    }
  };

  return (
    <div className="relative w-full max-w-full h-screen overflow-hidden bg-[#0F0320] text-[#FFF8DC] flex flex-col font-game-body select-none">
      {/* Zero-CLS Preloader Overlay (Game layout mounts underneath instantly) */}
      {!isAppLoaded && (
        <div
          data-testid="wizards-oath-preloader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F0320] text-[#FFF8DC] p-6 text-center space-y-5 animate-in fade-in"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-900 to-amber-600 border-4 border-[#FFD700] shadow-[0_0_35px_rgba(255,215,0,0.6)] flex items-center justify-center text-3xl animate-pulse">
              ⚡
            </div>
            <div
              className="absolute -inset-2 rounded-full border-2 border-dashed border-[#FFD700]/40 animate-spin"
              style={{ animationDuration: "12s" }}
            />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h2 className="font-fantasy-header text-lg sm:text-xl text-[#FFD700] tracking-wider font-extrabold uppercase">
              Inscribing 401 Spells
            </h2>
            <p className="text-xs text-amber-200/80 font-serif italic">
              Velan & Lalitha are preparing the Sanctuary...
            </p>
          </div>
          <div className="w-48 h-2 bg-slate-950 rounded-full overflow-hidden border border-amber-600/40">
            <div className="h-full bg-gradient-to-r from-purple-600 via-amber-500 to-yellow-400 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* LocalStorage Corruption Recovery Notice */}
      {scrollRestoredNotice && (
        <div
          data-testid="scroll-restored-banner"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] p-3.5 rounded-2xl bg-gradient-to-r from-amber-900 to-purple-950 border-2 border-[#FFD700] text-[#FFF8DC] shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl shrink-0">📜</span>
            <div>
              <h4 className="font-fantasy-header text-xs text-[#FFD700]">Velan has restored your scroll!</h4>
              <p className="text-[11px] font-body text-amber-200/90 leading-tight">
                Corrupted memory ink was cleansed and your Day 1 progress is secured.
              </p>
            </div>
          </div>
          <button
            onClick={dismissRestoredNotice}
            className="p-1 rounded-full bg-[#FFD700]/20 hover:bg-[#FFD700]/40 text-[#FFD700] shrink-0"
            aria-label="Dismiss restored scroll notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          TOP GAME HUD (Responsive 2-row on Mobile, 1-row on Desktop — Zero Clipping)
          ========================================================================= */}
      <header className="relative z-30 px-3 sm:px-6 py-2 sm:py-0 sm:h-16 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-b-2 border-[#FFD700]/50 bg-[#1C053A]/95 backdrop-blur-md shadow-xl shrink-0">
        {/* Left: Title & Active Realm */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#B8860B] p-0.5 shadow-lg shadow-[#FFD700]/20 flex items-center justify-center shrink-0">
            <span className="text-xl">🧙‍♀️</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-fantasy-header title-gold-gradient text-sm sm:text-base font-extrabold leading-tight truncate">
              {isTamil ? "TNPSC வித்தைக்காரர்" : "TNPSC WIZARD"}
            </h1>
            <p className="text-xs text-[#2ECC71] font-bold tracking-wide font-ui flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-ping shrink-0" />
              <span className="truncate">{isTamil ? (activeRealmObj?.nameTa || currentRealmName) : currentRealmName}</span>
            </p>
          </div>
        </div>

        {/* Center: Cognitive Load Switcher & Secondary Potions */}
        <div className="order-3 sm:order-2 w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 pt-1 sm:pt-0 border-t border-white/10 sm:border-t-0">
          {/* Focus Mode Contextual Switcher Pill */}
          <div className="focus-switcher-pill p-0.5 rounded-full flex items-center gap-1 shadow-md">
            <button
              onClick={() => {
                playButtonClick();
                setFocusMode("TRIAL");
              }}
              className={`px-3 py-1 rounded-full text-xs font-ui font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                focusMode === "TRIAL"
                  ? "bg-gradient-to-r from-[#FFD700] to-[#E6B800] !text-[#1E053A] shadow-sm"
                  : "text-[#FFF8DC]/90 hover:text-[#FFF8DC]"
              }`}
              title="Trial Focus Mode: Highlights active trial card for deep concentration"
            >
              <Sparkles className={`w-3.5 h-3.5 ${focusMode === "TRIAL" ? "text-[#3F0569]" : "text-[#FFD700]"}`} />
              <span>Trial Focus</span>
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setFocusMode("MAP");
              }}
              className={`px-3 py-1 rounded-full text-xs font-ui font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                focusMode === "MAP"
                  ? "bg-gradient-to-r from-[#2ECC71] to-[#27AE60] !text-[#062915] shadow-sm"
                  : "text-[#FFF8DC]/90 hover:text-[#FFF8DC]"
              }`}
              title="Atlas Map Mode: Elevates World Map and Quest Atlas into 100% focus"
            >
              <Compass className={`w-3.5 h-3.5 ${focusMode === "MAP" ? "text-[#062915]" : "text-[#2ECC71]"}`} />
              <span>Atlas Map</span>
            </button>
          </div>

          {/* Mobile Quick Quest Log Button (Row 2 Right on < sm) */}
          <button
            onClick={() => setIsMobileParchmentOpen(!isMobileParchmentOpen)}
            className="sm:hidden magic-button magic-button-gold px-3 py-1.5 text-xs font-bold whitespace-nowrap flex items-center gap-1"
            aria-label="Toggle Quest Log"
          >
            <ScrollIcon className="w-3.5 h-3.5" />
            <span>Quest Log</span>
          </button>

          {/* Secondary HUD Stats */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Requirement 2: Dynamic Difficulty Tag */}
            <div
              className={`px-2.5 py-0.5 rounded-full border text-xs font-bold uppercase flex items-center gap-1 ${
                currentDifficultyTier === "G1"
                  ? "bg-purple-900/60 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(156,57,238,0.5)]"
                  : currentDifficultyTier === "G2"
                  ? "bg-amber-900/60 border-amber-400 text-amber-200"
                  : "bg-emerald-900/60 border-emerald-400 text-emerald-200"
              }`}
              title="Difficulty scales dynamically: Levels 1-10 (G4), 11-20 (G2), 21+ & Boss (G1)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {currentDifficultyTier === "G1"
                  ? "G1 Degree"
                  : currentDifficultyTier === "G2"
                  ? "G2 Analytical"
                  : "G4 Factual"}
              </span>
            </div>

            {/* Mana Potion Bar */}
            <div className="flex items-center gap-1.5 font-ui">
              <span className="text-xs font-ui font-bold text-[#2ECC71] tracking-wide">💧 MANA</span>
              <div className="w-20 h-4 potion-glass-tube">
                <div className="liquid-fill-emerald" style={{ width: `${mana}%` }} />
              </div>
              <span className="text-xs font-ui font-bold text-[#2ECC71] tabular-nums">{mana}%</span>
            </div>

            {/* XP Gem Bar */}
            <div className="flex items-center gap-1.5 font-ui">
              <span className="text-xs font-ui font-bold text-[#FFD700] tracking-wide">✨ LVL {userLevel}</span>
              <div className="w-22 h-4 potion-glass-tube">
                <div className="liquid-fill-gold" style={{ width: `${(xp % 1000) / 10}%` }} />
              </div>
              <span className="text-xs font-ui font-bold text-[#FFD700] tabular-nums">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Right: Currency Pouch, Streak, Codex, Language & Tablet Quest Log */}
        <div className="order-2 sm:order-3 flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Gold Coin Pouch */}
          <div className="px-2.5 py-1 rounded-full bg-[#0F0320] border-2 border-[#FFD700] flex items-center gap-1 shadow-md shadow-[#FFD700]/20">
            <span className="text-sm">🪙</span>
            <span className="font-ui font-extrabold text-xs sm:text-sm text-[#FFD700] tabular-nums">
              {goldCoins}
            </span>
          </div>

          {/* Streak Flame */}
          <div className="hidden md:flex px-2.5 py-1 rounded-full bg-[#0F0320] border-2 border-orange-500/80 items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-500 animate-bounce" />
            <span className="font-ui font-bold text-xs text-orange-300 tabular-nums">7 Day</span>
          </div>

          {/* Phase 3 Accessibility & Sensory Audio Toggle */}
          <button
            onClick={() => {
              playButtonClick();
              const nextMuted = audioEngine.toggleMasterMute();
              setIsAudioMuted(nextMuted);
            }}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-[#0F0320] border-2 border-[#FFD700]/70 flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow"
            title={isAudioMuted ? "Sensory Audio Muted (Click to Unmute)" : "Sensory Audio Active (Click to Mute)"}
            aria-label="Toggle Sensory Audio"
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden md:inline text-xs font-ui font-bold text-red-400">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#FFD700]" />
                <span className="hidden md:inline text-xs font-ui font-bold text-[#FFD700]">Audio</span>
              </>
            )}
          </button>

          {/* Velan's Codex Manual & Master Bilingual Support Toggle */}
          <VelanCodexButton />
          <GlobalLanguageToggle />

          {/* Tablet Quest Log Toggle Button (hidden on mobile <sm and desktop >=lg) */}
          <div className="hidden sm:block lg:hidden">
            <button
              onClick={() => setIsMobileParchmentOpen(!isMobileParchmentOpen)}
              className="magic-button magic-button-gold px-2.5 py-1 text-xs font-bold whitespace-nowrap flex items-center gap-1"
              aria-label="Toggle Quest Log"
            >
              <ScrollIcon className="w-3.5 h-3.5" />
              <span>Quest Log</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN GAME VIEWPORT: 60% CINEMATIC STAGE + 40% QUEST LOG PARCHMENT
          ========================================================================= */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* =======================================================================
            LEFT PANEL (60% Desktop, Full Scrollable on Mobile): THE CINEMATIC STAGE
            ======================================================================= */}
        <section className="relative w-full lg:w-[60%] h-full flex flex-col justify-between overflow-y-auto lg:overflow-hidden pb-6 lg:pb-0">
          {/* 1. Atmospheric Temple Arches Background */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <img
              src="/assets/comfyui_wizard_bg.webp"
              alt="Fantasy RPG Tamil Temple Arches with Glowing Purple and Gold Atmosphere"
              fetchPriority="high"
              width={1920}
              height={1080}
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/comfyui_wizard_bg.png";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0320] via-transparent to-[#1C053A]/60" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#0F0320]/25 to-[#0F0320]/80" />
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#6A0DAD]/25 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-[#FFD700]/15 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* 2. Top Character Arena & Speech Bubble */}
          <div className="relative z-10 p-2 sm:p-4 flex flex-col items-center shrink-0">
            {/* Comic-Book Style Speech Bubble */}
            <div className="w-full max-w-xl mb-1 sm:mb-2 comic-speech-bubble-rpg flex flex-col min-h-[96px] sm:min-h-[104px]">
              <div className="flex items-center justify-between border-b-2 border-[#200438]/20 pb-1.5 mb-1.5 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{speaker === "VELAN" ? "🦜" : "✨"}</span>
                  <span className="font-fantasy-header-dark text-sm font-extrabold text-[#2E1503]">
                    {speaker === "VELAN" ? "Velan the Wise Mentor" : "Lalitha the Hero"}
                  </span>
                </div>
                {/* Audio Narration Button */}
                <button
                  onClick={handleToggleAudio}
                  aria-label={isSpeakingAudio ? "Stop Velan audio narration" : "Listen to Velan audio narration"}
                  className="px-2.5 py-1 rounded-full bg-[#6A0DAD] text-[#FFF8DC] text-xs font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow"
                >
                  {isSpeakingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dialogue Text with Typewriter & On-Demand Tamil Translation */}
              <div className="min-h-[46px] sm:min-h-[52px] flex flex-col justify-start">
                {isTamil ? (
                  <p className="text-base text-[#1A082E] leading-relaxed font-tamil font-semibold">
                    &ldquo;{displayedText}&rdquo;
                    {isTyping && <span className="inline-block w-1.5 h-3.5 bg-[#6A0DAD] ml-0.5 animate-pulse" />}
                  </p>
                ) : (
                  <TranslationToggle
                    englishText={`"${displayedText}"`}
                    tamilText={!isTyping ? dialogueTextTa : undefined}
                    variant="light"
                    compact
                    className="text-[15px] sm:text-base text-[#1A082E] leading-relaxed font-body font-semibold"
                  />
                )}
              </div>
            </div>

            {/* 3D Characters (Lalitha Hero + Velan Parrot Companion) */}
            <div className="relative w-full max-w-md h-24 sm:h-36 flex items-end justify-center shrink-0">
              {/* Velan Parrot */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Interact with Velan the Wise Mentor parrot"
                  onClick={() => {
                    playButtonClick();
                    triggerRewardParticles({ type: "COIN", originX: window.innerWidth * 0.25, originY: window.innerHeight * 0.3, count: 10 });
                    setSpeaker("VELAN");
                    setDialogueText("70% of questions here come from the last 10 years of TNPSC exams! Authentic PYQs are your key to Rank 1!");
                    setDialogueTextTa("இங்குள்ள 70% வினாக்கள் கடந்த 10 ஆண்டு TNPSC தேர்வுகளிலிருந்து எடுக்கப்பட்டவை! முந்தைய வினாக்களே முதல் தரவரிசைக்கான திறவுகோல்!");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      playButtonClick();
                      triggerRewardParticles({ type: "COIN", originX: window.innerWidth * 0.25, originY: window.innerHeight * 0.3, count: 10 });
                      setSpeaker("VELAN");
                      setDialogueText("70% of questions here come from the last 10 years of TNPSC exams! Authentic PYQs are your key to Rank 1!");
                      setDialogueTextTa("இங்குள்ள 70% வினாக்கள் கடந்த 10 ஆண்டு TNPSC தேர்வுகளிலிருந்து எடுக்கப்பட்டவை! முந்தைய வினாக்களே முதல் தரவரிசைக்கான திறவுகோல்!");
                    }
                  }}
                className="absolute left-10 sm:left-16 top-1 sm:top-2 z-20 cursor-pointer group transition-transform hover:scale-110 active:scale-95 animate-bounce focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded-full"
                style={{ animationDuration: "2.8s" }}
                title="Velan the Parrot Companion (Click or press Enter to interact!)"
              >
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 filter drop-shadow-[0_0_12px_rgba(46,204,113,0.7)]">
                  <img
                    src="/assets/velan_wizard_companion.webp"
                    alt="Velan the companion parrot"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/velan_wizard_companion.png";
                    }}
                  />
                </div>
              </div>

              {/* Lalitha Wizard Hero */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Interact with Lalitha the Hero Wizard"
                onClick={() => {
                  playButtonClick();
                  triggerRewardParticles({ type: "STAR", originX: window.innerWidth * 0.35, originY: window.innerHeight * 0.35, count: 12 });
                  setSpeaker("LALITHA");
                  setDialogueText("I am ready! Every trial question mastered brings me closer to the Sub-Collector appointment!");
                  setDialogueTextTa("நான் தயார்! ஒவ்வொரு வினாவிலும் தேர்ச்சி பெறுவது என்னைத் துணை ஆட்சியர் பதவிக்கு நெருக்கமாகக் கொண்டு செல்கிறது!");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    playButtonClick();
                    triggerRewardParticles({ type: "STAR", originX: window.innerWidth * 0.35, originY: window.innerHeight * 0.35, count: 12 });
                    setSpeaker("LALITHA");
                    setDialogueText("I am ready! Every trial question mastered brings me closer to the Sub-Collector appointment!");
                    setDialogueTextTa("நான் தயார்! ஒவ்வொரு வினாவிலும் தேர்ச்சி பெறுவது என்னைத் துணை ஆட்சியர் பதவிக்கு நெருக்கமாகக் கொண்டு செல்கிறது!");
                  }
                }}
                className="relative z-10 cursor-pointer group transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded-full"
                title="Lalitha the Hero Wizard (Click or press Enter to interact!)"
              >
                <div className="w-24 h-24 sm:w-40 sm:h-40 filter drop-shadow-[0_0_20px_rgba(106,13,173,0.8)]">
                  <img
                    src="/assets/lalitha_wizard_hero.webp"
                    alt="Lalitha Hero Wizard"
                    width={176}
                    height={176}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/lalitha_wizard_hero.png";
                    }}
                  />
                </div>
                <div className="w-24 sm:w-32 h-3 bg-black/60 rounded-full blur-xs mx-auto -mt-1.5" />
              </div>
            </div>
          </div>

          {/* 3. Bottom Question Card in Ornate Purple Frame */}
          <div className="relative z-20 px-3 sm:px-6 pb-2 sm:pb-3 flex-1 flex flex-col justify-end">
            {questionPool.length === 0 ? (
              <div
                data-testid="empty-trials-state"
                className="ornate-frame ornate-frame-purple p-6 max-w-2xl mx-auto w-full text-center space-y-3 shadow-2xl animate-in fade-in"
              >
                <div className="ornate-corner-gem ornate-corner-tl" />
                <div className="ornate-corner-gem ornate-corner-tr" />
                <div className="ornate-corner-gem ornate-corner-bl" />
                <div className="ornate-corner-gem ornate-corner-br" />

                <div className="w-12 h-12 rounded-full bg-amber-900/40 border-2 border-[#FFD700] mx-auto flex items-center justify-center text-2xl animate-pulse">
                  📜
                </div>
                <h3 className="font-fantasy-header text-base text-[#FFD700]">
                  Velan is forging new trials...
                </h3>
                <p className="text-xs text-[#FFF8DC]/80 font-body max-w-md mx-auto leading-relaxed">
                  The Commission archives for this realm are currently being inscribed. Choose another realm or return to the active syllabus expedition!
                </p>
                <button
                  onClick={() => handleSelectRealmNode("realm_4_ancient", "History Highlands")}
                  className="magic-button magic-button-gold px-4 py-2 text-xs font-ui"
                >
                  Return to History Highlands
                </button>
              </div>
            ) : (
              <div
                className={`ornate-frame ornate-frame-purple p-3 sm:p-4 max-w-2xl mx-auto w-full shadow-2xl min-h-[260px] transition-all duration-500 ${
                  focusMode === "TRIAL"
                    ? "contextual-highlight-card opacity-100 ring-2 ring-[#FFD700]/70"
                    : "contextual-dimmed cursor-pointer hover:opacity-100"
                }`}
                onClick={() => {
                  if (focusMode === "MAP") setFocusMode("TRIAL");
                }}
              >
                <div className="ornate-corner-gem ornate-corner-tl" />
                <div className="ornate-corner-gem ornate-corner-tr" />
                <div className="ornate-corner-gem ornate-corner-bl" />
                <div className="ornate-corner-gem ornate-corner-br" />

                {/* Requirement 2 & 3: PYQ Provenance Badge & Difficulty Tag */}
                <div className="flex items-center justify-between mb-2.5 flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-fantasy-header text-xs sm:text-sm text-[#FFD700] font-extrabold tracking-wide flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-[#FFD700]" />
                      TRIAL #{currentQIndex + 1}
                    </span>
                    {/* PYQ Source Citation Badge */}
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFD700]/15 border border-[#FFD700]/70 text-[#FFD700] text-xs font-ui font-bold flex items-center gap-1">
                      <ScrollIcon className="w-3.5 h-3.5" />
                      <span>{activeQuestion.source}</span>
                    </span>
                    {/* Focus Mode Pill Status */}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusMode(focusMode === "TRIAL" ? "MAP" : "TRIAL");
                      }}
                      className={`hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-ui font-bold cursor-pointer border transition-all ${
                        focusMode === "TRIAL"
                          ? "bg-[#6A0DAD]/40 border-[#FFD700]/60 text-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                          : "bg-slate-800 border-slate-600 text-slate-300"
                      }`}
                      title="Click to toggle Focus Mode / Atlas View"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                      <span>{focusMode === "TRIAL" ? "Focus Mode" : "Dimmed (Click to Focus)"}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-ui">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#6A0DAD] border border-[#FFD700]/50 text-[#FFF8DC] text-xs font-ui font-bold">
                      {activeQuestion.difficulty}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71]/70 text-[#2ECC71] text-xs font-ui font-bold tabular-nums">
                      +{activeQuestion.goldReward}🪙
                    </span>
                  </div>
                </div>

                {/* Question Text with On-Demand Bilingual Translation */}
                <div className="mb-3">
                  <TranslationToggle
                    englishText={activeQuestion.question}
                    tamilText={activeQuestion.questionTa}
                    className="text-base sm:text-lg font-bold text-[#FFF8DC] leading-snug font-body"
                  />
                </div>

                {/* On-demand Option Translation Pill (Only in EN mode when optionsTa exists) */}
                {!isTamil && activeQuestion.options.some((o) => Boolean(o.textTa)) && (
                  <div className="flex justify-end mb-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptionsTa((prev) => !prev);
                      }}
                      aria-expanded={showOptionsTa}
                      aria-label={showOptionsTa ? "Hide Tamil options" : "View Tamil options"}
                      className={`px-2.5 py-1 rounded-full text-xs font-ui font-bold border transition-all cursor-pointer ${
                        showOptionsTa
                          ? "bg-emerald-950/90 border-emerald-400 text-emerald-300"
                          : "bg-[#200438]/80 hover:bg-[#6A0DAD]/60 border-[#FFD700]/50 text-[#FFD700]"
                      }`}
                    >
                      {showOptionsTa ? "Hide Options தமிழ்" : "Options in தமிழ்"}
                    </button>
                  </div>
                )}

                {/* Clickable Option Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                  {activeQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    let borderStyle = "border-[#D1AC69]";
                    let bgStyle = "bg-[#FFFDF0]";
                    let textStyle = "text-[#2A1200]";

                    if (hasAnswered) {
                      if (opt.isCorrect) {
                        borderStyle = "border-[#2ECC71] ring-2 ring-[#2ECC71]";
                        bgStyle = "bg-[#D1F2D9]";
                        textStyle = "text-[#0E5E30]";
                      } else if (isSelected && !opt.isCorrect) {
                        borderStyle = "border-red-500 ring-2 ring-red-400";
                        bgStyle = "bg-red-50";
                        textStyle = "text-red-900";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                        disabled={hasAnswered}
                        aria-label={`Option ${opt.id}: ${isTamil && opt.textTa ? opt.textTa : opt.text}`}
                        className={`parchment-tile ${borderStyle} ${bgStyle} ${textStyle} min-h-[52px] touch-target-48 cursor-pointer active:scale-[0.98] px-3 py-2.5 text-left flex items-center gap-2.5 text-[15px] sm:text-base font-bold transition-all`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#6A0DAD] text-[#FFD700] font-ui font-extrabold text-xs flex items-center justify-center shrink-0 shadow">
                          {opt.id}
                        </div>
                        <div className="leading-snug flex-1 flex flex-col font-body">
                          {isTamil ? (
                            <span className="font-bold font-tamil text-base leading-snug">
                              {opt.textTa || opt.text}
                            </span>
                          ) : (
                            <>
                              <span className="font-bold">{opt.text}</span>
                              <AnimatePresence initial={false}>
                                {showOptionsTa && opt.textTa && (
                                  <motion.span
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="overflow-hidden text-base text-emerald-800 font-tamil italic font-semibold mt-0.5 block"
                                  >
                                    {opt.textTa}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-[#FFD700]/30">
                  <button
                    onClick={handlePrevQuest}
                    disabled={currentQIndex === 0}
                    aria-label="Previous Quest"
                    className="magic-button magic-button-purple magic-button-round disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Previous Quest (⏮️)"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleAudio}
                      aria-label={isSpeakingAudio ? "Stop Audio Narration" : "Play Audio Narration"}
                      className="magic-button magic-button-gold magic-button-round"
                      title="Audio Dialogue (▶️)"
                    >
                      {isSpeakingAudio ? (
                        <VolumeX className="w-6 h-6 text-[#381B02]" />
                      ) : (
                        <Play className="w-6 h-6 text-[#381B02] fill-[#381B02]" />
                      )}
                    </button>
                    {/* Requirement 4: Boss Quiz Trigger (>80% Gate) */}
                    <button
                      onClick={handleStartBossTrial}
                      aria-label="Challenge Boss Trial (Requires 80% accuracy to unlock next realm)"
                      className="magic-button magic-button-emerald px-3.5 py-2 text-xs flex items-center gap-1.5"
                      title="Challenge Boss Trial (Requires >80% accuracy to unlock next realm)"
                    >
                      <Sword className="w-4 h-4" />
                      <span>Boss Quiz (&gt;80%)</span>
                    </button>
                  </div>

                  <button
                    onClick={handleNextQuest}
                    aria-label="Next Quest"
                    className="magic-button magic-button-emerald magic-button-round"
                    title="Next Quest (⏭️)"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =======================================================================
            RIGHT PANEL (40% Desktop, Slide-Out on Mobile): THE "QUEST LOG"
            ======================================================================= */}
        <aside
          className={`
            fixed lg:relative inset-y-0 right-0 z-40 lg:z-10
            w-full sm:w-96 lg:w-[40%] h-full p-3 sm:p-5
            flex flex-col justify-between
            transition-all duration-500 ease-in-out
            ${isMobileParchmentOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
            ${
              focusMode === "TRIAL"
                ? "contextual-dimmed cursor-pointer"
                : "contextual-map-highlight opacity-100"
            }
          `}
          onClick={() => {
            if (focusMode === "TRIAL") setFocusMode("MAP");
          }}
        >
          {isMobileParchmentOpen && (
            <div
              onClick={() => setIsMobileParchmentOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/70 -z-10 backdrop-blur-xs"
            />
          )}

          {/* Unrolled Parchment Scroll Container */}
          <div className="parchment-box w-full h-full flex flex-col overflow-hidden">
            <div className="parchment-scroll-header px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-fantasy-header text-xs text-[#FFF8DC] tracking-widest">
                  📜 SYLLABUS EXPEDITION ATLAS
                </span>
                {focusMode === "MAP" && (
                  <span className="px-2 py-0.5 rounded-full bg-[#2ECC71]/30 border border-[#2ECC71] text-[#2ECC71] text-[9px] font-black uppercase">
                    Focused
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusMode(focusMode === "TRIAL" ? "MAP" : "TRIAL");
                  }}
                  className="hidden lg:flex px-2 py-0.5 rounded bg-[#3E1E04] text-[#FFD700] border border-[#FFD700]/50 text-[10px] font-fantasy-header items-center gap-1 hover:brightness-125 transition-all shadow"
                  title="Toggle Focus Mode / Atlas View"
                >
                  {focusMode === "MAP" ? (
                    <>
                      <Sparkles className="w-3 h-3 text-[#FFD700]" />
                      <span>Focus Trial</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3 h-3 text-[#2ECC71]" />
                      <span>Inspect Map</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsMobileParchmentOpen(false)}
                  aria-label="Close mobile quest log"
                  className="lg:hidden w-6 h-6 rounded-full bg-[#3E1E04] text-[#FFF8DC] flex items-center justify-center text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 flex-1 overflow-y-auto space-y-3.5">
              {/* 1. Requirement 1: Official TNPSC Syllabus Coverage Progress */}
              <div className="p-2.5 rounded-xl bg-[#FFFDF0] border-2 border-[#D1AC69] shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-fantasy-header-dark text-[11px] text-[#3E1E04] flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-[#6A0DAD]" />
                    SYLLABUS COVERAGE GUARANTEE
                  </span>
                  <span className="text-[10px] font-black text-[#1E8449] bg-[#2ECC71]/20 px-2 py-0.5 rounded-full">
                    {coverage.coveredUnitsCount}/10 Units ({coverage.overallCoveragePercentage}%)
                  </span>
                </div>
                {/* Visual Coverage Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#2ECC71] to-[#FFD700] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(10, coverage.overallCoveragePercentage)}%` }}
                  />
                </div>
                {/* Active Unit Coverage Badges */}
                <div className="flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#2ECC71]/25 text-[#0E5E30] border border-[#2ECC71]">
                    Unit IV History ✓
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFD700]/25 text-[#7A5805] border border-[#FFD700]">
                    Unit V Polity ⏳
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#6A0DAD]/15 text-[#3F0569] border border-[#6A0DAD]/40">
                    Unit X Aptitude ⏳
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold text-slate-500 bg-slate-100">
                    +7 Units
                  </span>
                </div>
              </div>

              {/* 2. Mini-Map with Mastery Gatekeeper Logic (Requirement 4) */}
              <div className="relative rounded-xl overflow-hidden border-2 border-[#A77A38] bg-[#F4E4C1] shadow-inner p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-fantasy-header-dark text-[10px] sm:text-xs text-[#3E1E04] flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#6A0DAD]" />
                    THE EXPEDITION JOURNEY
                  </span>
                  <span className="text-[10px] font-bold text-[#3E1E04] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#2ECC71]" />
                    <span>80% Mastery Gate</span>
                  </span>
                </div>

                {/* Illustrated Map Canvas */}
                <div className="relative w-full h-36 sm:h-40 rounded-lg bg-gradient-to-b from-[#A3E4D7] via-[#D5F5E3] to-[#FADBD8] overflow-hidden border border-[#D1AC69]">
                  <svg className="w-full h-full" viewBox="0 0 320 180" fill="none">
                    <path
                      d="M20 70 Q 50 30 80 70 Q 120 20 160 70 Q 200 35 240 70 L 260 120 L 10 120 Z"
                      fill="#82E0AA"
                      fillOpacity="0.6"
                    />
                    <path
                      d="M10 110 Q 30 50 60 110 Q 80 60 110 110 L 120 170 L 0 170 Z"
                      fill="#BB8FCE"
                      fillOpacity="0.5"
                    />
                    <path
                      d="M20 85 Q 90 95 160 110 T 310 125"
                      stroke="#5DADE2"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 50 110 Q 120 75 160 85 T 260 115"
                      stroke="#FFD700"
                      strokeWidth="3.5"
                      fill="none"
                      className="golden-trail-animated"
                    />
                  </svg>

                  {/* MAP NODES */}
                  {/* Node 1: History Highlands (Active Unlocked) */}
                  <div
                    onClick={() => handleSelectRealmNode("realm_4_ancient", "History Highlands")}
                    className="absolute top-10 left-8 flex flex-col items-center group cursor-pointer"
                  >
                    <div className="map-node-glow ring-2 ring-[#FFD700] animate-pulse">
                      <span className="text-lg">🏛️</span>
                    </div>
                    <span className="font-fantasy-header-dark text-[9px] text-[#3E1E04] bg-[#FFF8DC] border border-[#A77A38]/50 px-1.5 py-0.5 rounded shadow mt-0.5">
                      {isTamil ? "வரலாற்றுச் சிகரங்கள்" : "Highlands"}
                    </span>
                  </div>

                  {/* Node 2: Polity Peak (Tested by Gatekeeper) */}
                  <div
                    onClick={() => handleSelectRealmNode("realm_5_polity", "Polity Peak")}
                    className="absolute top-12 left-32 flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`map-node-glow ${
                        state.bossDefeatedRealms?.includes("realm_4_ancient" as any)
                          ? "ring-2 ring-[#2ECC71]"
                          : "map-node-locked"
                      }`}
                    >
                      <span className="text-lg">🏔️</span>
                    </div>
                    <span className="font-fantasy-header-dark text-[9px] text-[#3E1E04] bg-[#FFF8DC] border border-[#A77A38]/50 px-1.5 py-0.5 rounded shadow mt-0.5">
                      {isTamil ? "ஆட்சியியல் முகடு" : "Polity Peak"}
                    </span>
                  </div>

                  {/* Node 3: Current Affairs Cave (Locked) */}
                  <div
                    onClick={() => handleSelectRealmNode("realm_2_current_affairs", "Current Affairs Cave")}
                    className="absolute bottom-5 right-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div className="map-node-glow map-node-locked">
                      <Lock className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <span className="font-fantasy-header-dark text-[9px] text-slate-600 bg-slate-200/90 border border-slate-400/50 px-1.5 py-0.5 rounded shadow mt-0.5">
                      {isTamil ? "நடப்பு நிகழ்வுக் குகை" : "Cave (Lvl 5)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2.5 Active Realm Story Hook (On-Demand Bilingual Translation) */}
              <div
                className="p-2.5 rounded-xl bg-[#FFFDF0] border-2 border-[#D1AC69] shadow-xs space-y-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <span className="font-fantasy-header-dark text-[10px] text-[#6A0DAD] uppercase tracking-wider">
                    {isTamil ? "உலகப் பின்னணி & இலக்கு" : "ACTIVE REALM STORY HOOK"}
                  </span>
                  <span className="text-[10px] font-bold text-[#3E1E04]">
                    {isTamil ? (activeRealmObj?.nameTa || currentRealmName) : currentRealmName}
                  </span>
                </div>
                <TranslationToggle
                  englishText={activeUnitStoryHook.narrativeEn}
                  tamilText={activeUnitStoryHook.narrativeTa}
                  variant="light"
                  compact
                  className="text-[11px] text-[#3E1E04] leading-snug font-body"
                />
                <TranslationToggle
                  englishText={`Goal: ${activeUnitStoryHook.investigatorGoal}`}
                  tamilText={
                    activeUnitStoryHook.investigatorGoalTa
                      ? `இலக்கு: ${activeUnitStoryHook.investigatorGoalTa}`
                      : undefined
                  }
                  variant="light"
                  compact
                  className="text-[10px] text-[#6A0DAD] font-bold leading-snug"
                />
              </div>

              {/* 3. Expeditions List with Syllabus Unit Attribution */}
              <div>
                <h3 className="font-fantasy-header-dark text-xs text-[#3E1E04] mb-1.5 flex items-center justify-between">
                  <span>EXPEDITION CHAPTERS</span>
                  <span className="text-[10px] text-[#6A0DAD]">Unit IV & V</span>
                </h3>

                <div className="space-y-1.5">
                  <div className="p-2 rounded-lg bg-[#FFFDF0] border-2 border-[#2ECC71] shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-[#1E8449] leading-tight">
                          Indus Valley & Sangam Monarchs
                        </h4>
                        <p className="text-[10px] text-slate-600 font-semibold">
                          Unit IV • Clause 1.1 • Mastered
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#2ECC71]">100%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#FFFDF0] border-2 border-[#FFD700] shadow-sm flex items-center justify-between ring-1 ring-[#FFD700]/50">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#FFD700] text-[#3E1E04] font-black text-[10px] flex items-center justify-center shrink-0 animate-pulse">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#3E1E04] leading-tight">
                          Mauryas & Ashoka's Edicts
                        </h4>
                        <p className="text-[10px] text-[#6A0DAD] font-bold">
                          Unit IV • Clause 2.1 • In Progress
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#D49000]">65%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#F8F1DD] border border-[#D1AC69] opacity-80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-700 leading-tight">
                          Polity Peak: Preamble & Articles 12-35
                        </h4>
                        <p className="text-[10px] text-slate-500">Unit V • Requires &gt;80% Boss Score</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Locked</span>
                  </div>
                </div>
              </div>

              {/* 4. Stats Summary */}
              <div className="p-2 rounded-lg bg-[#FFFDF0] border-2 border-[#D1AC69] flex items-center justify-around text-center">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">70% PYQ Policy</p>
                  <p className="font-fantasy-header text-xs text-[#2ECC71]">100% Active</p>
                </div>
                <div className="w-px h-7 bg-[#D1AC69]" />
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Difficulty Tier</p>
                  <p className="font-fantasy-header text-xs text-[#FFD700]">{currentDifficultyTier}</p>
                </div>
                <div className="w-px h-7 bg-[#D1AC69]" />
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Mastery Cutoff</p>
                  <p className="font-fantasy-header text-xs text-[#6A0DAD]">&gt;80% Pass</p>
                </div>
              </div>
            </div>

            {/* Bottom Tabs: "QUEST", "GRIND", "REVIEW", "TABS" */}
            <div className="p-1.5 bg-[#1C053A] border-t-2 border-[#3E1E04] flex items-center justify-between gap-1">
              <button
                onClick={() => {
                  playButtonClick();
                  setActiveTab("QUEST");
                }}
                className={`game-menu-tab flex-1 ${activeTab === "QUEST" ? "active-tab" : ""}`}
              >
                <span>📜</span>
                <span>QUEST</span>
              </button>

              <button
                onClick={() => {
                  playButtonClick();
                  const cursedItems = Object.values(state.questionSrs || {}).filter((item) => item.isCursed);
                  if (cursedItems.length === 0) {
                    setSpeaker("VELAN");
                    setDialogueText(
                      "No Cursed Topics currently linger! Your memory schema is pure. Conquering live trials in Quest Mode!"
                    );
                    setActiveTab("QUEST");
                  } else {
                    setActiveTab("GRIND");
                    setSpeaker("VELAN");
                    setDialogueText(
                      `Grind Mode Activated! You have ${cursedItems.length} Cursed Topics scheduled for Spaced Repetition. Clear each with 2 consecutive correct recalls!`
                    );
                  }
                }}
                className={`game-menu-tab flex-1 ${activeTab === "GRIND" ? "active-tab" : ""}`}
                title="Grind Mode: Spaced Repetition for Cursed Topics"
              >
                <span>⚔️</span>
                <span>GRIND</span>
              </button>

              <button
                onClick={() => {
                  playButtonClick();
                  setActiveTab("REVIEW");
                  router.push("/revision");
                }}
                className={`game-menu-tab flex-1 ${activeTab === "REVIEW" ? "active-tab" : ""}`}
              >
                <span>🔮</span>
                <span>REVIEW</span>
              </button>

              <button
                onClick={() => {
                  playButtonClick();
                  setActiveTab("TABS");
                  router.push("/progress");
                }}
                className={`game-menu-tab flex-1 ${activeTab === "TABS" ? "active-tab" : ""}`}
                title="Velan's Daily Oracle & Wizard Stats Mastery Dashboard"
              >
                <span>🔮</span>
                <span>ORACLE</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          REQUIREMENT 4 MODALS: GATEKEEPER LOCK NOTICE & INTERACTIVE BOSS TRIAL
          ========================================================================= */}

      {/* 1. Gatekeeper Lock Notice Modal */}
      {gatekeeperNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="ornate-frame ornate-frame-purple max-w-md w-full p-6 text-center shadow-2xl">
            <div className="ornate-corner-gem ornate-corner-tl" />
            <div className="ornate-corner-gem ornate-corner-tr" />
            <div className="ornate-corner-gem ornate-corner-bl" />
            <div className="ornate-corner-gem ornate-corner-br" />

            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center text-2xl shadow-lg shadow-red-950">
              🔒
            </div>

            <h3 className="font-fantasy-header text-base text-[#FFD700] mb-2">
              COMMISSION MASTERY GATE LOCKED
            </h3>

            <p className="text-xs text-[#FFF8DC] leading-relaxed mb-4">
              To guarantee exam readiness, the TNPSC Commission mandates{" "}
              <strong className="text-[#2ECC71]">&gt;80% mastery</strong> in{" "}
              <strong className="text-[#FFD700]">{gatekeeperNotice.requiredBossName}</strong> before unlocking{" "}
              <strong className="text-purple-300">{gatekeeperNotice.targetRealmName}</strong>.
            </p>

            <div className="p-3 rounded-xl bg-[#0F0320] border border-[#FFD700]/40 mb-4 flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">CURRENT ACCURACY</span>
                <span className="font-bold text-red-400">{gatekeeperNotice.currentScore || 60}%</span>
              </div>
              <div className="w-px h-6 bg-slate-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">REQUIRED CUTOFF</span>
                <span className="font-bold text-[#2ECC71]">&gt;80%</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={handleStartBossTrial}
                className="magic-button magic-button-emerald flex-1 py-2 text-xs flex items-center justify-center gap-1.5"
              >
                <Sword className="w-4 h-4" />
                <span>Challenge Boss Trial</span>
              </button>
              <button
                onClick={() => {
                  setGatekeeperNotice(null);
                  router.push("/revision");
                }}
                className="magic-button magic-button-purple flex-1 py-2 text-xs flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Grind / Review</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Boss Trial Modal (>80% Mastery Check Simulation) */}
      {isBossChallengeActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95">
          <div className="ornate-frame max-w-lg w-full p-6 text-center shadow-2xl bg-gradient-to-b from-[#2D084F] to-[#0F0320]">
            <div className="ornate-corner-gem ornate-corner-tl" />
            <div className="ornate-corner-gem ornate-corner-tr" />
            <div className="ornate-corner-gem ornate-corner-bl" />
            <div className="ornate-corner-gem ornate-corner-br" />

            <div className="flex items-center justify-between border-b border-[#FFD700]/40 pb-2 mb-3">
              <span className="font-fantasy-header text-xs text-[#FFD700] flex items-center gap-1.5">
                <Sword className="w-4 h-4 text-red-400" />
                {currentRealmName} • APEX BOSS TRIAL
              </span>
              <span className="px-2 py-0.5 rounded bg-red-600/30 border border-red-500 text-red-300 text-[10px] font-black">
                G1 DEGREE STANDARD
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Answer the Commission's highest-tier questions to clear the 80% Mastery Gate and unlock the next realm!
            </p>

            <div className="space-y-2 mb-4">
              <button
                onClick={() => handleCompleteBossEvaluation(100)}
                className="w-full p-3 rounded-xl bg-emerald-900/30 border-2 border-[#2ECC71] hover:bg-emerald-800/40 text-left transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-[#2ECC71]">Mastery Response (Score: 100%)</h4>
                  <p className="text-[10px] text-slate-400">All 5 Assertion-Reasoning & Multi-Statement answers correct.</p>
                </div>
                <span className="font-fantasy-header text-sm text-[#2ECC71]">PASS ✓</span>
              </button>

              <button
                onClick={() => handleCompleteBossEvaluation(85)}
                className="w-full p-3 rounded-xl bg-emerald-900/20 border-2 border-[#2ECC71]/70 hover:bg-emerald-800/30 text-left transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-[#2ECC71]">Strong Response (Score: 85%)</h4>
                  <p className="text-[10px] text-slate-400">Clears the 80% minimum mastery threshold.</p>
                </div>
                <span className="font-fantasy-header text-sm text-[#2ECC71]">PASS ✓</span>
              </button>

              <button
                onClick={() => handleCompleteBossEvaluation(60)}
                className="w-full p-3 rounded-xl bg-red-950/20 border-2 border-red-500/70 hover:bg-red-900/30 text-left transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-red-400">Developing Response (Score: 60%)</h4>
                  <p className="text-[10px] text-slate-400">Below 80% cutoff. Triggers automatic Grind/Review lock.</p>
                </div>
                <span className="font-fantasy-header text-sm text-red-400">FAIL ✗</span>
              </button>
            </div>

            <button
              onClick={() => setIsBossChallengeActive(false)}
              className="magic-button magic-button-purple px-4 py-1.5 text-xs"
            >
              Cancel Trial
            </button>
          </div>
        </div>
      )}

      {/* 2.5 Pillar 4: Metacognitive Post-Mortem Error Analysis Modal */}
      {postMortemModal && postMortemModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95">
          <div className="ornate-frame max-w-lg w-full p-5 sm:p-6 text-left shadow-2xl bg-gradient-to-b from-[#2D084F] to-[#0F0320] border-2 border-red-500/80">
            <div className="ornate-corner-gem ornate-corner-tl" />
            <div className="ornate-corner-gem ornate-corner-tr" />
            <div className="ornate-corner-gem ornate-corner-bl" />
            <div className="ornate-corner-gem ornate-corner-br" />

            <div className="flex items-center justify-between border-b border-red-500/40 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💀</span>
                <h3 className="font-fantasy-header text-xs sm:text-sm text-red-400">
                  {isTamil ? "வினாப் பிழை பகுப்பாய்வு & விளக்கம்" : "TRIAL POST-MORTEM & ERROR ANALYSIS"}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-950 border border-red-500 text-red-300 text-[9px] font-ui font-black uppercase">
                Tagged as Cursed Topic (Day {postMortemModal.intervalDays})
              </span>
            </div>

            {/* Option Chosen vs Verified Commission Key */}
            <div className="space-y-2.5 mb-3 font-body">
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/60 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-red-400 font-ui font-bold uppercase tracking-wider">
                    {isTamil ? `உங்கள் தேர்வு (விருப்பம் ${postMortemModal.chosenOptionId})` : `Your Selection (Option ${postMortemModal.chosenOptionId})`}
                  </span>
                  <span className="text-[10px] text-red-400 font-ui font-black px-1.5 py-0.5 rounded bg-red-900/40 border border-red-500">
                    DISTRACTOR ✗
                  </span>
                </div>
                <p className="text-xs font-bold text-red-100 font-body">
                  {isTamil && postMortemModal.chosenOptionTextTa
                    ? postMortemModal.chosenOptionTextTa
                    : postMortemModal.chosenOptionText}
                </p>
                <div className="mt-2 pt-2 border-t border-red-900/60">
                  <div className="text-[11px] text-red-300 leading-relaxed font-body">
                    <strong className="text-red-400 font-bold block mb-1">
                      {isTamil ? "பொறி விளக்கம்:" : "Trap Deconstruction:"}
                    </strong>
                    <TranslationToggle
                      englishText={postMortemModal.distractorReason}
                      tamilText={postMortemModal.distractorReasonTa}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-[#2ECC71]/60 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#2ECC71] font-ui font-bold uppercase tracking-wider">
                    {isTamil ? `அதிகாரப்பூர்வ விடை (விருப்பம் ${postMortemModal.correctOptionId})` : `Verified Commission Key (Option ${postMortemModal.correctOptionId})`}
                  </span>
                  <span className="text-[10px] text-[#2ECC71] font-ui font-black px-1.5 py-0.5 rounded bg-emerald-900/40 border border-[#2ECC71]">
                    CORRECT ✓
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-100 font-body">
                  {isTamil && postMortemModal.correctOptionTextTa
                    ? postMortemModal.correctOptionTextTa
                    : postMortemModal.correctOptionText}
                </p>
                <div className="mt-2 pt-2 border-t border-emerald-900/60">
                  <div className="text-[11px] text-emerald-300 leading-relaxed font-body">
                    <strong className="text-[#2ECC71] font-bold block mb-1">
                      {isTamil ? "முதன்மைப் பாடத்திட்ட விளக்கம்:" : "Core Syllabus Anchor:"}
                    </strong>
                    <TranslationToggle
                      englishText={postMortemModal.coreExplanation}
                      tamilText={postMortemModal.coreExplanationTa}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lalitha Metacognitive Reflection */}
            <div className="p-2.5 rounded-lg bg-[#1C053A] border border-[#FFD700]/40 mb-4 flex items-start gap-2.5 font-body">
              <span className="text-xl">✨</span>
              <div className="text-[11px] text-slate-300 leading-snug font-body">
                <span className="font-bold text-[#FFD700] block mb-0.5 font-fantasy-header text-xs">
                  Lalitha's Metacognitive Note:
                </span>
                "I see the distractor trap now. This question has been tagged as a Cursed Topic in my Spaced Repetition queue for Day {postMortemModal.intervalDays} review so I eliminate this blindspot."
              </div>
            </div>

            <button
              onClick={() => setPostMortemModal(null)}
              data-testid="close-post-mortem-btn"
              aria-label="Acknowledge error analysis and continue quest"
              className="magic-button magic-button-gold w-full py-2.5 text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg"
            >
              <span>Acknowledge & Continue Quest</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. The Wizard's Oath Interactive Onboarding (First-Time User Experience) */}
      <WizardOathOnboarding />
    </div>
  );
};

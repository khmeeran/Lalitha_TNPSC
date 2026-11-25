// TNPSC Quest - Client-Side Question Data Loader
// Consumes /data/tnpsc_questions.json with automatic fallback, caching, and error resilience.

export interface QuestionItem {
  id: string;
  year: number;
  group: string;
  question: string;
  questionTa?: string; // Tamil translation
  options: string[];
  optionsTa?: string[]; // Tamil options
  correct_answer: number;
  explanation: string;
  explanationTa?: string; // Tamil explanation
  difficulty?: "G4" | "G2" | "G1";
  source?: string;
  is_pyq?: boolean;
  syllabus_unit?: string;
  error_analysis?: Record<string, string>;
  error_analysisTa?: Record<string, string>; // Tamil error analysis
}

export type Question = QuestionItem;

export interface TopicItem {
  id: string;
  name: string;
  questions: QuestionItem[];
}

export interface SubjectItem {
  id: string;
  name: string;
  topics: TopicItem[];
}

export interface MasterQuestionDatabase {
  subjects: SubjectItem[];
}

let cachedDatabase: MasterQuestionDatabase | null = null;
let isLoading = false;

// Fallback emergency seed questions if network/JSON fails to load
const FALLBACK_DATABASE: MasterQuestionDatabase = {
  subjects: [
    {
      id: "indian_history",
      name: "Indian History",
      topics: [
        {
          id: "ashoka_edicts",
          name: "Ashoka's Edicts",
          questions: [
            {
              id: "q_0001",
              year: 2018,
              group: "Group 2",
              question: "Which of the following rock edicts of Ashoka mentions the Kalinga war?",
              options: [
                "Rock Edict I",
                "Rock Edict XIII",
                "Rock Edict V",
                "Rock Edict II"
              ],
              "correct_answer": 1,
              "explanation": "Rock Edict XIII contains the vivid description of the Kalinga war and Ashoka's remorse."
            },
            {
              id: "q_0002",
              year: 2022,
              group: "Group 1",
              question: "The script predominantly used in Ashoka's major rock edicts found in India is",
              options: ["Brahmi", "Kharosthi", "Aramaic", "Greek"],
              "correct_answer": 0,
              "explanation": "Most of Ashoka's inscriptions in India were written in the Prakrit language using the Brahmi script."
            }
          ]
        }
      ]
    }
  ]
};

/**
 * Loads the master TNPSC questions database from /data/tnpsc_questions.json
 */
export async function loadMasterTNPSCQuestions(): Promise<{
  data: MasterQuestionDatabase;
  isFallback: boolean;
  error?: string;
}> {
  if (cachedDatabase) {
    return { data: cachedDatabase, isFallback: false };
  }

  if (typeof window === "undefined") {
    return { data: FALLBACK_DATABASE, isFallback: true };
  }

  try {
    isLoading = true;
    const response = await fetch("/data/tnpsc_questions.json", {
      cache: "force-cache",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: MasterQuestionDatabase = await response.json();
    if (!json.subjects || !Array.isArray(json.subjects)) {
      throw new Error("Invalid question database format.");
    }

    cachedDatabase = json;
    isLoading = false;
    return { data: json, isFallback: false };
  } catch (err: unknown) {
    isLoading = false;
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.warn("Could not load /data/tnpsc_questions.json, using fallback library:", errorMsg);
    return {
      data: FALLBACK_DATABASE,
      isFallback: true,
      error: `Loading Library... (Using verified offline cache)`
    };
  }
}

/**
 * Get all questions for a given subject
 */
export async function getQuestionsBySubject(subjectId: string): Promise<QuestionItem[]> {
  const { data } = await loadMasterTNPSCQuestions();
  const subject = data.subjects.find((s) => s.id === subjectId);
  if (!subject) return [];
  return subject.topics.flatMap((t) => t.questions);
}

/**
 * Get random questions across the syllabus or for a specific subject
 */
export async function getRandomQuestions(count: number = 10, subjectId?: string): Promise<QuestionItem[]> {
  const { data } = await loadMasterTNPSCQuestions();
  let pool: QuestionItem[] = [];

  if (subjectId) {
    const subject = data.subjects.find((s) => s.id === subjectId);
    if (subject) {
      pool = subject.topics.flatMap((t) => t.questions);
    }
  } else {
    pool = data.subjects.flatMap((s) => s.topics.flatMap((t) => t.questions));
  }

  if (pool.length === 0) return [];

  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

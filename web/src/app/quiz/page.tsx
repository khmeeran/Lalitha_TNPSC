import React from "react";
import { MOCK_QUIZZES } from "../../data/mockQuizzesData";
import { QuizArenaPlayer } from "../../components/quiz/QuizArenaPlayer";

export default function QuizPage() {
  const defaultQuiz = MOCK_QUIZZES["quiz_ancient_boss"];
  return <QuizArenaPlayer quiz={defaultQuiz} />;
}

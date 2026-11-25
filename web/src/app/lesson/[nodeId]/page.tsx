"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Compass, ArrowLeft } from "lucide-react";
import { MOCK_LESSONS } from "../../../data/mockLessonsData";
import { SYLLABUS_MAPPING, getNodeStoryHook } from "../../../data/syllabusMapping";
import { MicroLessonPlayer } from "../../../components/lesson/MicroLessonPlayer";
import { MicroLessonPayload } from "../../../types/learning";
import { RealmId } from "../../../types/adventureMap";

function buildFallbackSyllabusLesson(nodeId: string): MicroLessonPayload | null {
  for (const unit of SYLLABUS_MAPPING.units) {
    const node = unit.nodes.find((n) => n.nodeId === nodeId);
    if (node) {
      const hook = getNodeStoryHook(node);
      const base = MOCK_LESSONS["node_hist_3"];
      return {
        ...base,
        nodeId: node.nodeId,
        realmId: unit.realmId as RealmId,
        realmNameTa: unit.realmNameTa || unit.realmName,
        realmNameEn: unit.realmName,
        unitNumber: unit.unitNumber,
        topicId: node.nodeId,
        topicTitleTa: node.titleTa || node.title,
        topicTitleEn: node.title,
        subClause: node.subClause,
        cards: [
          {
            ...base.cards[0],
            headlineEn: node.title,
            headlineTa: node.titleTa || node.title,
            bodyEn: hook.narrativeEn,
            bodyTa: hook.narrativeTa || hook.narrativeEn,
            velanDialogueEn: hook.investigatorGoal,
            velanDialogueTa: hook.investigatorGoalTa || hook.investigatorGoal,
          },
          ...base.cards.slice(1),
        ],
      };
    }
  }
  return null;
}

function LessonContent() {
  const params = useParams();
  const nodeId = typeof params?.nodeId === "string" ? params.nodeId : "";
  const lesson = MOCK_LESSONS[nodeId] || buildFallbackSyllabusLesson(nodeId);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0F0320] text-[#FFF8DC] flex flex-col items-center justify-center p-6 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#1C053A] border-2 border-[#FFD700]/60 flex items-center justify-center text-3xl shadow-xl">
          📜
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="font-fantasy-header text-xl text-[#FFD700]">404 — Chamber Not Found</h1>
          <p className="text-sm text-slate-300 font-body">
            The requested syllabus chamber (<code className="text-amber-300">{nodeId || "unknown"}</code>) does not exist in the TNPSC archive.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-[#FFD700] text-[#1C053A] text-xs font-black flex items-center gap-1.5 shadow-lg hover:brightness-110 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sanctuary</span>
          </Link>
          <Link
            href="/realms"
            className="px-4 py-2 rounded-xl bg-[#1C053A] border border-[#FFD700]/50 text-[#FFD700] text-xs font-bold flex items-center gap-1.5 hover:bg-[#6A0DAD]/40 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Realms Map</span>
          </Link>
        </div>
      </div>
    );
  }

  return <MicroLessonPlayer lesson={lesson} />;
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-300">
          Loading lesson...
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}

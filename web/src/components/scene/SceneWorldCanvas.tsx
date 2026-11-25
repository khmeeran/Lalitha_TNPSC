"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import { ComicSpeechBubble, SpeakerType } from "./ComicSpeechBubble";
import { AmbientSceneParticles } from "./AmbientSceneParticles";
import { triggerRewardParticles, triggerCoinRain, confetti } from "../../utils/particleEngine";
import { playCoinSound, playButtonClick } from "../../utils/soundEffects";

interface SceneWorldCanvasProps {
  onStartLesson?: () => void;
  onEnterBossBattle?: () => void;
  className?: string;
}

export const SceneWorldCanvas: React.FC<SceneWorldCanvasProps> = ({
  onStartLesson,
  onEnterBossBattle,
  className = "",
}) => {
  const router = useRouter();

  const [speaker, setSpeaker] = useState<SpeakerType>("VELAN");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const dialogues = [
    // 0: Velan Start Prompt
    {
      speaker: "VELAN" as SpeakerType,
      textTa: "Lalitha! Shall we investigate Ashoka's 13th Rock Edict?",
      textEn: "Lalitha! Shall we embark to investigate Ashoka's 13th Rock Edict?",
      options: [
        {
          labelTa: "📖 Start Lesson",
          labelEn: "Start Lesson",
          onClick: () => {
            if (onStartLesson) onStartLesson();
            else router.push("/lesson/node_hist_3");
          },
        },
        {
          labelTa: "📜 Daily Quest",
          labelEn: "Daily Mission",
          onClick: () => {
            setDialogueIndex(1);
            setSpeaker("LALITHA");
          },
        },
      ],
    },
    // 1: Lalitha Eager Goal
    {
      speaker: "LALITHA" as SpeakerType,
      textTa: "Velan Brother, today I will master 3 edicts and win 50 coins!",
      textEn: "Brother Velan, today I'll master 3 inscriptions and win 50 coins!",
      options: [
        {
          labelTa: "⚔️ Boss Battle",
          labelEn: "Boss Battle",
          onClick: () => {
            if (onEnterBossBattle) onEnterBossBattle();
            else router.push("/quiz");
          },
        },
        {
          labelTa: "🦜 Velan's Advice",
          labelEn: "Velan's advice",
          onClick: () => {
            setDialogueIndex(2);
            setSpeaker("VELAN");
          },
        },
      ],
    },
    // 2: Velan TNPSC Strategy
    {
      speaker: "VELAN" as SpeakerType,
      textTa: "Keeladi excavations and Mauryan statecraft — 4 guaranteed TNPSC questions!",
      textEn: "Keeladi excavations and Mauryan polity — 4 guaranteed TNPSC questions!",
      options: [
        {
          labelTa: "🗺️ Realms Map",
          labelEn: "Realms Map",
          onClick: () => router.push("/realms"),
        },
        {
          labelTa: "📖 Enter Chamber",
          labelEn: "Go to lesson",
          onClick: () => router.push("/lesson/node_hist_3"),
        },
      ],
    },
    // 3: Study Desk Prop Dialogue
    {
      speaker: "VELAN" as SpeakerType,
      textTa: "Ashoka's Major Rock Edict XIII lesson is ready! Shall we begin?",
      textEn: "Lesson on Ashoka's 13th Rock Edict is ready! Shall we begin?",
      options: [
        {
          labelTa: "📖 Start Lesson",
          labelEn: "Start Lesson",
          onClick: () => {
            if (onStartLesson) onStartLesson();
            else router.push("/lesson/node_hist_3");
          },
        },
        {
          labelTa: "Let's Review Later",
          labelEn: "Back",
          onClick: () => {
            setDialogueIndex(0);
            setSpeaker("VELAN");
          },
        },
      ],
    },
    // 4: Campfire Prop Dialogue
    {
      speaker: "LALITHA" as SpeakerType,
      textTa: "Velan, like this campfire, our TNPSC ambition burns brightly!",
      textEn: "Brother Velan, our TNPSC goal shines bright like this campfire!",
      options: [
        {
          labelTa: "🪙 Collect Coins (+10 Coins)",
          labelEn: "Collect Coins",
          onClick: () => {
            playCoinSound();
            triggerCoinRain(2000);
            setDialogueIndex(2);
            setSpeaker("VELAN");
          },
        },
      ],
    },
    // 5: Boss Gate Prop Dialogue
    {
      speaker: "VELAN" as SpeakerType,
      textTa: "Chola Golden Temple arena! Triumph in 10 questions to unlock the seal!",
      textEn: "Chola Golden Temple Arena! Conquer 10 questions to break the seal!",
      options: [
        {
          labelTa: "⚔️ Enter Battle",
          labelEn: "Enter Arena",
          onClick: () => {
            if (onEnterBossBattle) onEnterBossBattle();
            else router.push("/quiz");
          },
        },
        {
          labelTa: "Study A Bit More",
          labelEn: "Study more",
          onClick: () => {
            setDialogueIndex(0);
            setSpeaker("VELAN");
          },
        },
      ],
    },
  ];

  const currentDialogue = dialogues[dialogueIndex] || dialogues[0];

  const handleStudyDeskClick = (e: React.MouseEvent) => {
    playButtonClick();
    triggerRewardParticles({
      type: "STAR",
      originX: e.clientX,
      originY: e.clientY,
      count: 14,
    });
    setDialogueIndex(3);
    setSpeaker("VELAN");
  };

  const handleCampfireClick = (e: React.MouseEvent) => {
    playCoinSound();
    triggerCoinRain(2200);
    setDialogueIndex(4);
    setSpeaker("LALITHA");
  };

  const handleBossGateClick = (e: React.MouseEvent) => {
    playButtonClick();
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { x: 0.8, y: 0.7 },
      colors: ["#EF4444", "#F59E0B", "#FBBF24", "#DC2626"],
    });
    setDialogueIndex(5);
    setSpeaker("VELAN");
  };

  const handleLalithaClick = (e: React.MouseEvent) => {
    playButtonClick();
    triggerRewardParticles({
      type: "STAR",
      originX: e.clientX,
      originY: e.clientY,
      count: 10,
    });
    setSpeaker("LALITHA");
    setDialogueIndex(1);
  };

  const handleVelanClick = (e: React.MouseEvent) => {
    playButtonClick();
    triggerRewardParticles({
      type: "COIN",
      originX: e.clientX,
      originY: e.clientY,
      count: 10,
    });
    setSpeaker("VELAN");
    setDialogueIndex(dialogueIndex === 0 ? 2 : 0);
  };

  const handleAdvanceDialogue = () => {
    setDialogueIndex((prev) => {
      const next = (prev + 1) % dialogues.length;
      setSpeaker(dialogues[next].speaker);
      return next;
    });
  };

  return (
    <div
      className={`relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/40 select-none bg-slate-950 ${className}`}
      style={{ minHeight: "430px" }}
      role="region"
      aria-label="Living Sanctuary Visual Scene"
    >
      {/* =========================================================================
          1. COMFYUI CINEMATIC BACKGROUND: Mandapam Twilight Campfire (1280x720)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="/assets/mandapam_campfire_bg.png"
          alt="Ancient Tamil Nadu Mandapam Courtyard Scene"
          width={1280}
          height={720}
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
        />
        {/* Soft Vignette Gradient overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/80" />
        <div className="absolute inset-0 bg-amber-950/15 mix-blend-multiply" />
      </div>

      {/* =========================================================================
          2. AMBIENT ATMOSPHERIC FIREFLIES (Floating Night Bioluminescence)
          ========================================================================= */}
      <AmbientSceneParticles type="FIREFLIES" />

      {/* =========================================================================
          3. COMIC SPEECH BUBBLE WITH VOICE AUDIO (Strictly Max 2 Lines)
          ========================================================================= */}
      <div className="relative z-30 pt-4 px-3 sm:px-8 flex justify-center">
        <ComicSpeechBubble
          speaker={currentDialogue.speaker}
          textTa={currentDialogue.textTa}
          textEn={currentDialogue.textEn}
          options={currentDialogue.options}
          onSpeakingChange={setIsSpeaking}
          onAdvance={handleAdvanceDialogue}
        />
      </div>

      {/* =========================================================================
          4. LIVING CHARACTER & SCENE PROP STAGE (3D Animated Characters & Props)
          ========================================================================= */}
      <div className="relative z-20 mt-3 sm:mt-5 px-3 sm:px-8 flex items-end justify-between sm:justify-around gap-2 pb-4">
        {/* Prop 1: 📖 Study Pedestal Desk (ComfyUI 3D Render) */}
        <div
          onClick={handleStudyDeskClick}
          className="cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-2 active:scale-95 shrink-0"
          title="Lesson: Ashoka's 13th Edict (Click to inspect lesson!)"
          role="button"
          tabIndex={0}
        >
          <div className="mb-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow animate-bounce">
            Lesson 📖
          </div>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950/80 shadow-xl shadow-amber-950/80 group-hover:border-amber-300 group-hover:scale-105 transition-all">
            <img
              src="/assets/prop_study_scroll.png"
              alt="Ancient Palm-Leaf Study Desk"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-12 h-2.5 bg-black/60 rounded-full blur-xs mt-1" />
        </div>

        {/* Character 1: Lalitha (ComfyUI 3D Pixar Render) */}
        <div
          onClick={handleLalithaClick}
          className={`cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-2 active:scale-95 shrink-0 ${
            isSpeaking && currentDialogue.speaker === "LALITHA" ? "animate-talking-lalitha scale-105" : ""
          }`}
          role="button"
          tabIndex={0}
          aria-label="Lalitha Explorer"
        >
          <div
            className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-3 shadow-2xl transition-all ${
              isSpeaking && currentDialogue.speaker === "LALITHA"
                ? "border-amber-300 shadow-amber-400/70 ring-4 ring-amber-400/50"
                : "border-amber-400 shadow-amber-900/60 group-hover:scale-105"
            } bg-gradient-to-b from-amber-500/20 to-slate-950/80`}
          >
            <img
              src="/assets/lalitha_character.png"
              alt="Lalitha the Aspirant Protagonist"
              width={128}
              height={128}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-0 inset-x-0 py-0.5 bg-slate-950/85 backdrop-blur-xs text-center border-t border-amber-400/40">
              <span className="text-[10px] sm:text-xs font-black text-amber-300 flex items-center justify-center gap-1">
                <span>Lalitha</span>
                {isSpeaking && currentDialogue.speaker === "LALITHA" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </span>
            </div>
          </div>
          <div className="w-16 h-3 bg-black/70 rounded-full blur-xs mt-1" />
        </div>

        {/* Center: Crackling Campfire Hearth 🔥 */}
        <div
          onClick={handleCampfireClick}
          className="cursor-pointer group flex flex-col items-center mb-2 shrink-0"
          title="Sanctuary Fire (Click for sparks & coin rain!)"
          role="button"
          tabIndex={0}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-t from-orange-600 to-amber-400 p-2 shadow-2xl shadow-orange-500/60 animate-torch-flicker group-hover:scale-115 transition-transform flex items-center justify-center border-2 border-yellow-200">
            <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-100 fill-yellow-200" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-full bg-slate-950/90 border border-orange-500/50 text-amber-300 font-bold text-[9px] shadow">
            Fire 🔥
          </div>
        </div>

        {/* Character 2: Velan Parrot (ComfyUI 3D Pixar Render) */}
        <div
          onClick={handleVelanClick}
          className={`cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-2 active:scale-95 shrink-0 ${
            isSpeaking && currentDialogue.speaker === "VELAN"
              ? "animate-talking-velan scale-105"
              : "animate-velan-float"
          }`}
          role="button"
          tabIndex={0}
          aria-label="Velan the Wise Parrot"
        >
          <div
            className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-3 shadow-2xl transition-all ${
              isSpeaking && currentDialogue.speaker === "VELAN"
                ? "border-emerald-300 shadow-emerald-400/70 ring-4 ring-emerald-400/50"
                : "border-emerald-400 shadow-emerald-900/60 group-hover:scale-105"
            } bg-gradient-to-b from-emerald-500/20 to-slate-950/80`}
          >
            <img
              src="/assets/velan_parrot.png"
              alt="Velan the Wise Mentor Parrot"
              width={128}
              height={128}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-0 inset-x-0 py-0.5 bg-slate-950/85 backdrop-blur-xs text-center border-t border-emerald-400/40">
              <span className="text-[10px] sm:text-xs font-black text-emerald-300 flex items-center justify-center gap-1">
                <span>Velan</span>
                {isSpeaking && currentDialogue.speaker === "VELAN" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </span>
            </div>
          </div>
          <div className="w-16 h-3 bg-black/70 rounded-full blur-xs mt-1" />
        </div>

        {/* Prop 2: ⚔️ Chola Temple Boss Gate (ComfyUI 3D Render) */}
        <div
          onClick={handleBossGateClick}
          className="cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-2 active:scale-95 shrink-0"
          title="Boss Trial: Chola Challenge (Click to inspect boss trial!)"
          role="button"
          tabIndex={0}
        >
          <div className="mb-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
            Arena ⚔️
          </div>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-rose-500 bg-slate-950/80 shadow-xl shadow-rose-950/80 group-hover:border-rose-400 group-hover:scale-105 transition-all">
            <img
              src="/assets/prop_boss_gate.png"
              alt="Chola Temple Boss Gateway"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-12 h-2.5 bg-black/60 rounded-full blur-xs mt-1" />
        </div>
      </div>
    </div>
  );
};

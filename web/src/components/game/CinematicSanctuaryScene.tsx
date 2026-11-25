"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Flame, Volume2, VolumeX, ArrowRight, BookOpen, Sword, Scroll as ScrollIcon } from "lucide-react";
import { AmbientSceneParticles } from "../scene/AmbientSceneParticles";
import { speakNarration, stopNarration } from "../../utils/speechSynthesis";
import { playCoinSound, playButtonClick, playBubblePop, playTypewriterTick } from "../../utils/soundEffects";
import { triggerCoinRain, confetti, triggerRewardParticles } from "../../utils/particleEngine";
import { useLearning } from "../../context/LearningContext";

export const CinematicSanctuaryScene: React.FC = () => {
  const router = useRouter();
  const { state, toggleAudioNarration } = useLearning();

  // Scene references for GSAP animations
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const bgLayer1Ref = useRef<HTMLDivElement>(null);
  const lalithaRef = useRef<HTMLDivElement>(null);
  const velanRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);

  // Scene interactive state (100% English per Language Mandate)
  const [speaker, setSpeaker] = useState<"VELAN" | "LALITHA">("VELAN");
  const [dialogueText, setDialogueText] = useState("Lalitha! Shall we embark to investigate Ashoka's 13th Rock Edict?");
  const [activeAction, setActiveAction] = useState<{ label: string; onConfirm: () => void } | null>({
    label: "📖 Start Investigation",
    onConfirm: () => handleZoomToBook(),
  });

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  // Parallax mouse tracker
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // 1. SCENE ENTRANCE GSAP TIMELINE (Pixar Movie Opening)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial State
      gsap.set(cameraRef.current, { opacity: 0, scale: 1.05 });
      gsap.set(lalithaRef.current, { y: 160, opacity: 0 });
      gsap.set(velanRef.current, { x: 140, y: -60, opacity: 0 });
      gsap.set(bubbleRef.current, { scale: 0.7, opacity: 0 });

      // Entrance sequence
      tl.to(cameraRef.current, { opacity: 1, scale: 1.0, duration: 1.0, ease: "power2.out" })
        .to(lalithaRef.current, { y: 0, opacity: 1, duration: 1.0, ease: "back.out(1.4)" }, "-=0.5")
        .to(velanRef.current, { x: 0, y: 0, opacity: 1, duration: 1.0, ease: "power3.out" }, "-=0.6")
        .to(bubbleRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }, "-=0.2");

      // Looping idle breathing for Lalitha (Pixar breathing)
      gsap.to(lalithaRef.current, {
        scaleY: 1.025,
        y: -3,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Looping gentle bobbing for Velan the parrot
      gsap.to(velanRef.current, {
        y: -14,
        rotation: -2,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sceneContainerRef);

    return () => ctx.revert();
  }, []);

  // 2. TYPEWRITER EFFECT & AUDIO TRIGGER
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    playBubblePop();

    const interval = setInterval(() => {
      index++;
      setDisplayedText(dialogueText.slice(0, index));
      playTypewriterTick();

      if (index >= dialogueText.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [dialogueText]);

  // 3. PARALLAX MOUSE LISTENER
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isZooming) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const normX = (clientX - centerX) / centerX;
    const normY = (clientY - centerY) / centerY;

    setParallaxOffset({ x: normX, y: normY });
  };

  // 4. AUDIO NARRATION HANDLER (English Narration Profile)
  const handleListenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playButtonClick();

    if (isSpeaking) {
      stopNarration();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakNarration(dialogueText, {
        speaker,
        lang: "en-IN",
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  // 5. CINEMATIC CAMERA ZOOM TRANSITIONS
  const handleZoomToBook = () => {
    if (isZooming) return;
    setIsZooming(true);
    playButtonClick();

    const tl = gsap.timeline({
      onComplete: () => {
        router.push("/lesson/node_hist_3");
      },
    });

    tl.to(bubbleRef.current, { opacity: 0, scale: 0.8, duration: 0.3 })
      .to(cameraRef.current, {
        scale: 3.2,
        transformOrigin: "16% 75%",
        duration: 1.1,
        ease: "power3.inOut",
      })
      .to(fadeOverlayRef.current, { opacity: 1, duration: 0.5 }, "-=0.35");
  };

  const handleZoomToGate = () => {
    if (isZooming) return;
    setIsZooming(true);
    playButtonClick();

    const tl = gsap.timeline({
      onComplete: () => {
        router.push("/quiz");
      },
    });

    tl.to(bubbleRef.current, { opacity: 0, scale: 0.8, duration: 0.3 })
      .to(cameraRef.current, {
        scale: 3.2,
        transformOrigin: "86% 75%",
        duration: 1.1,
        ease: "power3.inOut",
      })
      .to(fadeOverlayRef.current, { opacity: 1, duration: 0.5 }, "-=0.35");
  };

  // 6. OBJECT CLICK HANDLERS (Interactions happen WITHIN the scene)
  const onSelectBookObject = () => {
    playButtonClick();
    triggerRewardParticles({ type: "STAR", originX: window.innerWidth * 0.16, originY: window.innerHeight * 0.75, count: 14 });
    setSpeaker("VELAN");
    setDialogueText("Ashoka's 13th Rock Edict! Let's uncover the secrets of the Kalinga War!");
    setActiveAction({
      label: "📖 Start Lesson (Investigation)",
      onConfirm: handleZoomToBook,
    });
  };

  const onSelectGateObject = () => {
    playButtonClick();
    confetti({ particleCount: 70, spread: 60, origin: { x: 0.85, y: 0.7 } });
    setSpeaker("VELAN");
    setDialogueText("Chola Empire Fortress Gateway! Conquer 10 questions to break the royal seal!");
    setActiveAction({
      label: "⚔️ Enter Boss Arena",
      onConfirm: handleZoomToGate,
    });
  };

  const onSelectScrollObject = () => {
    playButtonClick();
    triggerRewardParticles({ type: "COIN", originX: window.innerWidth * 0.5, originY: window.innerHeight * 0.8, count: 12 });
    setSpeaker("LALITHA");
    setDialogueText("Brother Velan, today I will master 3 historical inscriptions and earn 50 gold coins!");
    setActiveAction({
      label: "📜 View Quest Atlas",
      onConfirm: () => router.push("/realms"),
    });
  };

  const onSelectCampfireObject = () => {
    playCoinSound();
    triggerCoinRain(2200);
    setSpeaker("LALITHA");
    setDialogueText("Brother Velan, our quest for civil service victory burns bright like this flame!");
    setActiveAction(null);
  };

  const onSelectLalitha = () => {
    playButtonClick();
    setSpeaker("LALITHA");
    setDialogueText("I am ready, Brother Velan! Let's begin the archaeological investigation immediately!");
    setActiveAction({
      label: "📖 Begin Lesson",
      onConfirm: handleZoomToBook,
    });
  };

  const onSelectVelan = () => {
    playButtonClick();
    setSpeaker("VELAN");
    setDialogueText("Archaeological excavations and Mauryan polity guarantee high-yield questions on the TNPSC exam!");
    setActiveAction({
      label: "🗺️ Adventure Map",
      onConfirm: () => router.push("/realms"),
    });
  };

  return (
    <div
      ref={sceneContainerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 select-none font-sans"
      role="application"
      aria-label="Scene 1: The Sanctuary at Night - Cinematic Game Scene"
    >
      {/* =========================================================================
          1. 2.5D PARALLAX CAMERA RIG
          ========================================================================= */}
      <div
        ref={cameraRef}
        className="relative w-full h-full overflow-hidden transition-transform duration-75 ease-out"
      >
        {/* Layer 1: Distant Temple Silhouette & Moonlight (Slow Parallax) */}
        <div
          ref={bgLayer1Ref}
          className="absolute -inset-8 pointer-events-none z-0 transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${parallaxOffset.x * -8}px, ${parallaxOffset.y * -5}px, 0) scale(1.06)`,
          }}
        >
          <img
            src="/assets/mandapam_campfire_bg.png"
            alt="Distant Tamil Nadu Mandapam Courtyard at Night"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
          />
        </div>

        {/* Ambient Night Fireflies Floating in the Scene */}
        <AmbientSceneParticles type="FIREFLIES" className="z-10" />

        {/* Cinematic Vignette Overlays (Enhances Focal Depth) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/70 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/30 to-slate-950/90 pointer-events-none z-10" />

        {/* =========================================================================
            2. IN-SCENE INTERACTIVE OBJECTS (Click Objects, Not UI Buttons)
            ========================================================================= */}

        {/* OBJECT 1: Ancient Book on Pedestal (Left Foreground) */}
        <div
          onClick={onSelectBookObject}
          className="absolute z-20 cursor-pointer group flex flex-col items-center transition-all duration-300"
          style={{
            left: "14%",
            bottom: "16%",
            transform: `translate3d(${parallaxOffset.x * -18}px, ${parallaxOffset.y * -8}px, 0)`,
          }}
          title="Ashoka's Inscription Lesson (Click to examine book!)"
          role="button"
          tabIndex={0}
        >
          {/* Floating Glow Indicator */}
          <div className="mb-2 px-3 py-0.5 rounded-full bg-amber-500/90 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/40 animate-bounce flex items-center gap-1 border border-yellow-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study 📖</span>
          </div>

          {/* 3D Carved Stand & Glowing Palm Leaf Book */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-3 border-amber-400/90 bg-slate-950/90 shadow-2xl shadow-amber-950 group-hover:scale-110 group-hover:border-amber-300 group-hover:shadow-amber-500/50 transition-all duration-300">
            <img
              src="/assets/prop_study_scroll.png"
              alt="Ancient Palm-Leaf Study Desk"
              width={144}
              height={144}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-amber-500/10 group-hover:bg-amber-500/25 transition-colors" />
          </div>
          <div className="w-20 h-3 bg-black/80 rounded-full blur-xs mt-1" />
        </div>

        {/* OBJECT 2: Central Crackling Campfire Hearth */}
        <div
          onClick={onSelectCampfireObject}
          className="absolute z-20 cursor-pointer group flex flex-col items-center transition-all duration-300"
          style={{
            left: "37%",
            bottom: "14%",
            transform: `translate3d(${parallaxOffset.x * -24}px, ${parallaxOffset.y * -10}px, 0)`,
          }}
          title="Campfire (Click for sparks & coin shower!)"
          role="button"
          tabIndex={0}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-300 p-3 shadow-2xl shadow-orange-500/70 animate-torch-flicker group-hover:scale-115 transition-transform flex items-center justify-center border-3 border-yellow-200">
            <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-100 fill-yellow-200 drop-shadow" />
          </div>
          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-orange-500/60 text-amber-300 font-bold text-[10px] shadow">
            Campfire 🔥
          </div>
        </div>

        {/* OBJECT 3: Scroll on Ground (Center-Bottom) */}
        <div
          onClick={onSelectScrollObject}
          className="absolute z-20 cursor-pointer group flex flex-col items-center transition-all duration-300"
          style={{
            left: "48%",
            bottom: "11%",
            transform: `translate3d(${parallaxOffset.x * -28}px, ${parallaxOffset.y * -12}px, 0)`,
          }}
          title="Daily Mission Scroll (Click to inspect quest!)"
          role="button"
          tabIndex={0}
        >
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-amber-500 bg-slate-950/80 shadow-xl shadow-amber-950 group-hover:scale-115 group-hover:border-amber-300 transition-all duration-300">
            <img
              src="/assets/ui_study_scroll.png"
              alt="Ancient Scroll on Ground"
              width={88}
              height={88}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-full bg-slate-950/90 border border-amber-500/60 text-amber-300 font-bold text-[9px] shadow">
            Scroll 📜
          </div>
        </div>

        {/* OBJECT 4: Ancient Chola Temple Door / Boss Gateway (Right Foreground) */}
        <div
          onClick={onSelectGateObject}
          className="absolute z-20 cursor-pointer group flex flex-col items-center transition-all duration-300"
          style={{
            right: "12%",
            bottom: "16%",
            transform: `translate3d(${parallaxOffset.x * -18}px, ${parallaxOffset.y * -8}px, 0)`,
          }}
          title="Chola Temple Boss Gateway (Click to enter battle!)"
          role="button"
          tabIndex={0}
        >
          {/* Floating Glow Indicator */}
          <div className="mb-2 px-3 py-0.5 rounded-full bg-rose-600/90 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/50 flex items-center gap-1 border border-rose-300">
            <Sword className="w-3.5 h-3.5" />
            <span>Arena ⚔️</span>
          </div>

          <div className="relative w-32 h-36 sm:w-44 sm:h-48 rounded-3xl overflow-hidden border-3 border-rose-500 bg-slate-950/90 shadow-2xl shadow-rose-950 group-hover:scale-110 group-hover:border-rose-400 group-hover:shadow-rose-600/50 transition-all duration-300">
            <img
              src="/assets/prop_boss_gate.png"
              alt="Chola Temple Boss Gateway"
              width={176}
              height={192}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-rose-500/10 group-hover:bg-rose-500/25 transition-colors" />
          </div>
          <div className="w-24 h-3 bg-black/80 rounded-full blur-xs mt-1" />
        </div>

        {/* =========================================================================
            3. LARGE 3D LIVING CHARACTERS (Focal Point of the Movie Scene)
            ========================================================================= */}

        {/* CHARACTER 1: Lalitha (280px tall, Left-Center) */}
        <div
          ref={lalithaRef}
          onClick={onSelectLalitha}
          className="absolute z-30 cursor-pointer group flex flex-col items-center transition-transform"
          style={{
            left: "23%",
            bottom: "11%",
            transform: `translate3d(${parallaxOffset.x * -28}px, ${parallaxOffset.y * -12}px, 0)`,
          }}
          role="button"
          tabIndex={0}
          aria-label="Lalitha Explorer (280px tall)"
        >
          <div
            className={`relative rounded-3xl overflow-hidden border-3 shadow-2xl transition-all duration-300 ${
              speaker === "LALITHA"
                ? "border-amber-300 ring-4 ring-amber-400/60 shadow-amber-500/80 scale-105"
                : "border-amber-400/80 group-hover:border-amber-300 group-hover:scale-105 shadow-amber-950/70"
            } bg-gradient-to-b from-amber-500/20 to-slate-950/85`}
            style={{ width: "190px", height: "280px" }}
          >
            <img
              src="/assets/lalitha_character.png"
              alt="Lalitha the Aspirant Protagonist"
              width={190}
              height={280}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-0 inset-x-0 py-1 bg-slate-950/90 backdrop-blur-xs text-center border-t border-amber-400/40">
              <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wide flex items-center justify-center gap-1.5">
                <span>Lalitha</span>
                {speaker === "LALITHA" && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </span>
            </div>
          </div>
          {/* Ground Shadow */}
          <div className="w-36 h-4 bg-black/80 rounded-full blur-xs mt-1" />
        </div>

        {/* CHARACTER 2: Velan the Parrot (180px tall, Floating Right of Lalitha) */}
        <div
          ref={velanRef}
          onClick={onSelectVelan}
          className="absolute z-30 cursor-pointer group flex flex-col items-center transition-transform"
          style={{
            left: "38%",
            bottom: "32%",
            transform: `translate3d(${parallaxOffset.x * -24}px, ${parallaxOffset.y * -10}px, 0)`,
          }}
          role="button"
          tabIndex={0}
          aria-label="Velan the Wise Parrot (180px tall)"
        >
          <div
            className={`relative rounded-3xl overflow-hidden border-3 shadow-2xl transition-all duration-300 ${
              speaker === "VELAN"
                ? "border-emerald-300 ring-4 ring-emerald-400/60 shadow-emerald-500/80 scale-105"
                : "border-emerald-400/80 group-hover:border-emerald-300 group-hover:scale-105 shadow-emerald-950/70"
            } bg-gradient-to-b from-emerald-500/20 to-slate-950/85`}
            style={{ width: "140px", height: "180px" }}
          >
            <img
              src="/assets/velan_parrot.png"
              alt="Velan the Wise Mentor Parrot"
              width={140}
              height={180}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-0 inset-x-0 py-1 bg-slate-950/90 backdrop-blur-xs text-center border-t border-emerald-400/40">
              <span className="text-xs sm:text-sm font-black text-emerald-300 tracking-wide flex items-center justify-center gap-1.5">
                <span>Velan</span>
                {speaker === "VELAN" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </span>
            </div>
          </div>
          {/* Subtle Floating Aura */}
          <div className="w-24 h-3 bg-black/60 rounded-full blur-xs mt-1" />
        </div>

        {/* =========================================================================
            4. ORGANIC COMIC SPEECH BUBBLE (Positioned Above the Characters)
            ========================================================================= */}
        <div
          ref={bubbleRef}
          className="absolute z-40 max-w-xl w-full px-4"
          style={{
            left: "50%",
            top: "14%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            className={`relative p-4 sm:p-5 rounded-3xl shadow-2xl border-4 transition-all duration-300 ${
              speaker === "VELAN"
                ? "bg-gradient-to-br from-emerald-950/95 via-slate-950/95 to-emerald-950/90 border-emerald-400 text-emerald-50 shadow-emerald-900/60"
                : "bg-gradient-to-br from-amber-950/95 via-slate-950/95 to-amber-950/90 border-amber-400 text-amber-50 shadow-amber-900/60"
            }`}
          >
            {/* Comic Speech Tail Pointer */}
            <div
              className={`absolute -bottom-3.5 w-7 h-7 rotate-45 border-r-4 border-b-4 z-10 transition-all duration-300 ${
                speaker === "VELAN"
                  ? "left-24 bg-slate-950 border-emerald-400"
                  : "left-16 bg-slate-950 border-amber-400"
              }`}
            />

            {/* Bubble Header: Speaker Badge + 🔊 Audio Listen Button */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border shadow ${
                  speaker === "VELAN"
                    ? "bg-emerald-500 text-slate-950 border-emerald-300"
                    : "bg-amber-500 text-slate-950 border-amber-300"
                }`}
              >
                {speaker === "VELAN" ? "🦜 Mentor Velan" : "🎒 Explorer Lalitha"}
              </span>

              <button
                onClick={handleListenToggle}
                aria-label="Listen to audio dialogue"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all active:scale-95 shadow cursor-pointer ${
                  isSpeaking
                    ? "bg-rose-500 text-white animate-pulse"
                    : speaker === "VELAN"
                    ? "bg-emerald-400/20 hover:bg-emerald-400/35 text-emerald-300 border border-emerald-400/50"
                    : "bg-amber-400/20 hover:bg-amber-400/35 text-amber-300 border border-amber-400/50"
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>🔊 Listen</span>
                  </>
                )}
              </button>
            </div>

            {/* STRICTLY MAX 2 LINES DIALOGUE TEXT */}
            <div className="my-1">
              <p className="text-xl sm:text-2xl md:text-3xl font-black leading-snug tracking-tight text-white comic-text-shadow line-clamp-2">
                {displayedText}
                {isTyping && (
                  <span
                    className={`inline-block w-2.5 h-5 ml-1 rounded-xs animate-pulse align-middle ${
                      speaker === "VELAN" ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                )}
              </p>
            </div>

            {/* Contextual Action Button (Triggered When Clicking Scene Props) */}
            {activeAction && (
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => {
                    playButtonClick();
                    activeAction.onConfirm();
                  }}
                  className={`px-4 py-2 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 transition-all active:scale-95 shadow-xl cursor-pointer ${
                    speaker === "VELAN"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/40"
                      : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/40"
                  }`}
                >
                  <span>{activeAction.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. MINIMAL HUD (Top Corners ONLY — No SaaS Dashboard Elements)
          ========================================================================= */}

      {/* TOP-LEFT: Day Badge */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-2xl bg-slate-950/80 border-2 border-amber-500/60 backdrop-blur-md shadow-xl flex items-center gap-2 text-amber-300 font-black text-sm">
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-torch-flicker" />
          <span>Day 7 Streak</span>
        </div>
      </div>

      {/* TOP-RIGHT: Coins 🪙 | Stars ⭐ | Sound Toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5">
        {/* Coins Pill */}
        <button
          onClick={(e) => {
            playCoinSound();
            triggerRewardParticles({ type: "COIN", originX: e.clientX, originY: e.clientY, count: 12 });
          }}
          className="px-3 py-1.5 rounded-2xl bg-amber-950/80 border-2 border-amber-400/80 backdrop-blur-md shadow-xl flex items-center gap-2 text-amber-200 font-black text-sm active:scale-95 transition-transform cursor-pointer"
        >
          <img src="/assets/ui_gold_coin.png" alt="Coin" width={20} height={20} className="w-5 h-5 object-contain drop-shadow" />
          <span>{state.user.coins}</span>
        </button>

        {/* Stars Pill */}
        <button
          onClick={(e) => {
            playButtonClick();
            triggerRewardParticles({ type: "STAR", originX: e.clientX, originY: e.clientY, count: 12 });
          }}
          className="px-3 py-1.5 rounded-2xl bg-indigo-950/80 border-2 border-indigo-400/80 backdrop-blur-md shadow-xl flex items-center gap-2 text-indigo-200 font-black text-sm active:scale-95 transition-transform cursor-pointer"
        >
          <img src="/assets/ui_victory_star.png" alt="Star" width={20} height={20} className="w-5 h-5 object-contain drop-shadow" />
          <span>{state.completedNodeIds.length * 3 || 9}</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleAudioNarration}
          aria-label="Toggle narration audio"
          className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-transform active:scale-95 shadow-xl backdrop-blur-md cursor-pointer ${
            state.settings.audioNarrationEnabled
              ? "bg-emerald-950/80 border-emerald-400 text-emerald-300"
              : "bg-slate-900/80 border-slate-700 text-slate-500"
          }`}
        >
          {state.settings.audioNarrationEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* =========================================================================
          6. CINEMATIC FULL-SCREEN CAMERA WIPE OVERLAY (For Zoom Transitions)
          ========================================================================= */}
      <div
        ref={fadeOverlayRef}
        className="fixed inset-0 bg-slate-950 pointer-events-none z-50 opacity-0"
      />
    </div>
  );
};

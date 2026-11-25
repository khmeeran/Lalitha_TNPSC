"use client";

import React, { useEffect } from "react";
import { WizardOathOnboarding } from "@/components/game/WizardOathOnboarding";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { RotateCcw } from "lucide-react";

export default function OnboardingDemoPage() {
  const { resetOath, isOnboardingActive, currentStep } = useOnboardingStore();

  useEffect(() => {
    // Force onboarding active for demo
    resetOath();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0F0320] text-[#FFF8DC] flex flex-col items-center justify-center font-game-body select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="/assets/comfyui_wizard_bg.png"
          alt="Temple Background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover filter brightness-50 contrast-125"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/assets/wizard_temple_bg.png";
          }}
        />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0F0320]/60 to-[#0F0320]/95" />
      </div>

      {/* Behind-the-modal fallback UI (Simulating the Live Sanctuary) */}
      <div className="relative z-10 text-center max-w-lg p-6 rounded-2xl border border-purple-900/50 bg-[#1C053A]/80 backdrop-blur-md">
        <h2 className="font-fantasy-header text-lg text-[#FFD700] mb-2">
          🏛️ THE SANCTUARY OF TRIAL
        </h2>
        <p className="text-xs text-slate-300 mb-4">
          This live canvas is active. The Wizard's Oath onboarding overlay teaches the Apprentice the core loop before granting realm access.
        </p>
        <button
          onClick={resetOath}
          className="magic-button magic-button-purple px-4 py-2 text-xs flex items-center gap-1.5 mx-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Wizard's Oath Demo</span>
        </button>
      </div>

      {/* Interactive Wizard's Oath Modal */}
      <WizardOathOnboarding />
    </div>
  );
}

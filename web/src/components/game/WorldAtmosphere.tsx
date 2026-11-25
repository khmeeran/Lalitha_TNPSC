"use client";

import React from "react";

export interface WorldAtmosphereProps {
  realmId?: string;
  intensity?: "gentle" | "intense";
}

export const WorldAtmosphere: React.FC<WorldAtmosphereProps> = ({
  realmId = "ancient",
  intensity = "gentle",
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Vignette shadow around edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,6,23,0.8)_100%)]" />

      {/* 2. Floating Ancient Knowledge Embers / Stardust */}
      <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-amber-400/30 blur-xs animate-ping duration-1000" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-300/40 blur-xs animate-pulse duration-700" />
      <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-orange-400/20 blur-sm animate-bounce duration-1000" />
      <div className="absolute top-2/3 right-1/5 w-2 h-2 rounded-full bg-amber-500/25 blur-xs animate-pulse duration-1000" />

      {/* 3. Ancient Tamil Stone Inscription Watermark Motif */}
      <div className="absolute bottom-4 right-6 opacity-[0.04] text-[120px] font-serif text-amber-500 select-none">
        Heritage
      </div>
    </div>
  );
};

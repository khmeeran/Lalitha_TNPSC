"use client";

import React from "react";
import { TNPSCWizardGameInterface } from "../components/game/TNPSCWizardGameInterface";

export default function TNPSCWizardEntry() {
  return (
    <main
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0F0320] text-[#FFF8DC] select-none"
      role="main"
    >
      <TNPSCWizardGameInterface />
    </main>
  );
}

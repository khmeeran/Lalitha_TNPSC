"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Sparkles, AlertOctagon } from "lucide-react";
import { audioEngine } from "../../lib/audioEngine";

export const CleanSlateReset: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Show on localhost, local private network IP (192.168.x.x), dev mode, or debug query
    const isLocalNetwork =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.startsWith("192.168.") ||
        window.location.hostname.startsWith("10.") ||
        window.location.hostname.startsWith("172.") ||
        window.location.hostname.endsWith(".local") ||
        window.location.search.includes("debug=true"));

    const isDev = process.env.NODE_ENV === "development" || isLocalNetwork;
    setIsVisible(isDev);

    // Global keyboard shortcut: Ctrl + Shift + D or Ctrl + Shift + Backspace
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirm(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleWipeMemory = async () => {
    try {
      audioEngine.playCurseDispelled();
      audioEngine.triggerHaptic([80, 50, 80]);

      // 1. Wipe all local storage (progress, SRS, onboarding, friction logs, settings)
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();

        // 2. Clear Service Worker caches if available
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      }

      // 3. Force hard reload to Sanctuary
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch (err) {
      console.error("[CleanSlate] Wipe error:", err);
      window.location.reload();
    }
  };

  if (!isVisible && !showConfirm) return null;

  return (
    <>
      {/* Discreet Bottom-Left Dev Pill */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowConfirm(true)}
          data-testid="clean-slate-btn"
          aria-label="Clean slate: reset all memory and restart Day 1"
          title="Clean Slate: Completely wipe app memory (Progress, SRS, Onboarding) for testing"
          className="px-2.5 py-1.5 rounded-xl bg-slate-950/90 border border-amber-600/50 hover:border-amber-400 text-amber-300 text-[10px] font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <RotateCcw className="w-3 h-3 text-amber-400" />
          <span>Dev Reset</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          data-testid="clean-slate-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div className="max-w-xs w-full rounded-2xl bg-slate-950 border-2 border-red-500/80 p-5 text-center shadow-2xl space-y-3 text-white">
            <div className="w-12 h-12 mx-auto rounded-xl bg-red-950/80 border border-red-500 flex items-center justify-center text-xl shadow-md">
              <AlertOctagon className="w-6 h-6 text-red-400" />
            </div>

            <h3 className="text-sm font-black text-amber-200">
              Clean Slate Wiped Memory?
            </h3>

            <p className="text-[11px] text-slate-300 leading-relaxed font-serif italic">
              This will completely wipe all progress, SRS cursed items, onboarding status, and friction logs. The app will restart at Day 1 Apprentice.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                aria-label="Cancel memory reset"
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWipeMemory}
                data-testid="clean-slate-confirm-btn"
                aria-label="Confirm memory wipe and restart Day 1"
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-950 active:scale-95 transition-all"
              >
                Wipe &amp; Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

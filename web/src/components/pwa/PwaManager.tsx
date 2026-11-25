"use client";

import React, { useState, useEffect } from "react";
import { Download, Volume2, Sparkles, X, Smartphone } from "lucide-react";
import { audioEngine } from "../../lib/audioEngine";

export const PwaManager: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isAudioSuspended, setIsAudioSuspended] = useState(false);
  const [dismissedInstall, setDismissedInstall] = useState(false);

  useEffect(() => {
    // 1. Check if running as installed standalone PWA
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    setIsStandalone(isStandaloneMode);

    // 2. Register Service Worker with readyState check
    if ("serviceWorker" in navigator && process.env.NODE_ENV !== "test") {
      const registerSW = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((_reg) => {
            // SW registration successful
          })
          .catch((_err) => {
            // SW registration failed
          });
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }

    // 3. Listen for BeforeInstallPrompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandaloneMode) {
        setIsInstallable(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Detect iOS Safari
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (isIos && !isStandaloneMode) {
      // Allow iOS manual install prompt if not standalone
      const hasDismissedIos = localStorage.getItem("tnpsc_wizard_ios_dismissed");
      if (!hasDismissedIos) {
        setIsInstallable(true);
      }
    }

    // 5. Detect if AudioContext is blocked by Autoplay policy & auto-unlock on first tap
    const checkAudioState = () => {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          const testCtx = new AudioCtxClass();
          if (testCtx.state === "suspended") {
            setIsAudioSuspended(true);
          }
          testCtx.close();
        }
      } catch {}
    };
    checkAudioState();

    const unlockOnFirstTap = () => setIsAudioSuspended(false);
    window.addEventListener("pointerdown", unlockOnFirstTap, { once: true });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("pointerdown", unlockOnFirstTap);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      audioEngine.playCorrectRecall();
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // Show iOS Safari guidance modal
      setShowIosGuide(true);
    }
  };

  const handleEnableAudio = () => {
    audioEngine.playCorrectRecall();
    setIsAudioSuspended(false);
  };

  return (
    <>
      {/* 1. Install PWA Prompt Banner (Compact pill, never overlaps Quill or Questions) */}
      {isInstallable && !isStandalone && !dismissedInstall && (
        <aside
          role="complementary"
          aria-label="Application Installation"
          data-testid="pwa-install-banner"
          className="fixed bottom-3 left-3 right-18 sm:left-auto sm:right-20 sm:w-auto z-40 px-3 py-2 rounded-2xl bg-slate-950/95 border border-amber-400/80 shadow-2xl backdrop-blur-md flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">⚡</span>
            <h4 className="text-xs font-bold text-amber-200 font-ui truncate">
              Install TNPSC Wizard
            </h4>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/30 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setDismissedInstall(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. iOS Safari Install Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-950 border-2 border-amber-500 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl">
              <Smartphone className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-base font-black text-amber-200">
              Install on iOS Safari
            </h3>
            <div className="text-xs text-slate-300 space-y-2 text-left bg-slate-900/80 p-4 rounded-xl border border-white/10">
              <p className="flex items-center gap-2">
                <span className="font-bold text-amber-400">1.</span> Tap the <strong>Share</strong> icon (square with arrow) at the bottom.
              </p>
              <p className="flex items-center gap-2">
                <span className="font-bold text-amber-400">2.</span> Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
              </p>
              <p className="flex items-center gap-2">
                <span className="font-bold text-amber-400">3.</span> Launch TNPSC Wizard directly like a native app!
              </p>
            </div>
            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider"
            >
              Understood, Velan!
            </button>
          </div>
        </div>
      )}

      {/* 3. Audio Autoplay Safety: Compact non-blocking pill */}
      {isAudioSuspended && (
        <aside
          role="complementary"
          aria-label="Audio Controls"
          data-testid="audio-enable-banner"
          onClick={handleEnableAudio}
          className="hidden sm:flex fixed bottom-20 left-4 z-30 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/80 text-amber-300 text-xs font-bold shadow-xl backdrop-blur-md items-center gap-2 cursor-pointer hover:bg-slate-800 transition-all"
        >
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>Enable Sound</span>
        </aside>
      )}
    </>
  );
};

import { create } from "zustand";

export interface OnboardingState {
  hasSeenOath: boolean;
  isOnboardingActive: boolean;
  hasHydrated: boolean;
  currentStep: 1 | 2 | 3 | 4;
  hasAnsweredMock: boolean;
  hasSelectedMapNode: boolean;
  
  // Actions
  hydrateOath: () => void;
  startOnboarding: () => void;
  nextStep: () => void;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  answerMockQuestion: () => void;
  selectMapNode: () => void;
  completeOath: () => void;
  skipOath: () => void;
  resetOath: () => void;
}

const STORAGE_KEY = "tnpsc_wizard_has_seen_oath_v1";

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  hasSeenOath: false,
  isOnboardingActive: false,
  hasHydrated: false,
  currentStep: 1,
  hasAnsweredMock: false,
  hasSelectedMapNode: false,

  hydrateOath: () => {
    if (get().hasHydrated) return;
    let seen = false;
    try {
      if (typeof window !== "undefined") {
        seen = localStorage.getItem(STORAGE_KEY) === "true";
      }
    } catch {}
    set({
      hasSeenOath: seen,
      isOnboardingActive: !seen,
      hasHydrated: true,
    });
  },

  startOnboarding: () => {
    set({
      isOnboardingActive: true,
      currentStep: 1,
      hasAnsweredMock: false,
      hasSelectedMapNode: false,
    });
  },

  nextStep: () => {
    const next = Math.min(4, get().currentStep + 1) as 1 | 2 | 3 | 4;
    set({ currentStep: next });
  },

  setStep: (step) => {
    set({ currentStep: step });
  },

  answerMockQuestion: () => {
    set({ hasAnsweredMock: true });
  },

  selectMapNode: () => {
    set({ hasSelectedMapNode: true });
  },

  completeOath: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    set({
      hasSeenOath: true,
      isOnboardingActive: false,
    });
  },

  skipOath: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    set({
      hasSeenOath: true,
      isOnboardingActive: false,
    });
  },

  resetOath: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({
      hasSeenOath: false,
      isOnboardingActive: true,
      currentStep: 1,
      hasAnsweredMock: false,
      hasSelectedMapNode: false,
    });
  },
}));

import { create } from "zustand";
import type { UserBookProgress } from "@/types";

interface ProgressState {
  progress: UserBookProgress | null;
  setProgress: (progress: UserBookProgress | null) => void;
  isStepCompleted: (step: number) => boolean;
  getCurrentStep: () => number;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: null,
  setProgress: (progress) => set({ progress }),
  isStepCompleted: (step: number) => {
    const p = get().progress;
    if (!p) return false;
    const key = `step${step}_completed` as keyof UserBookProgress;
    return p[key] === true;
  },
  getCurrentStep: () => {
    return get().progress?.current_step ?? 1;
  },
}));

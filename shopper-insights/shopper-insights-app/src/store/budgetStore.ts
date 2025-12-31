// Zustand store for budget
import { create } from "zustand";

export const useBudgetStore = create((set) => ({
  budget: 0,
  setBudget: (budget: number) => set({ budget }),
}));

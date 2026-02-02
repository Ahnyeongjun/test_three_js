import { create } from "zustand";
import { ModelPart, ModelState } from "@/types";

export const useModelStore = create<ModelState>((set) => ({
  explodeLevel: 0,
  setExplodeLevel: (level: number) => set({ explodeLevel: level }),
  isLoading: true,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  modelParts: [],
  setModelParts: (parts: ModelPart[]) => set({ modelParts: parts }),
}));

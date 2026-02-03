import { create } from "zustand";
import { RenderState, RenderSettings } from "@/types";

const defaultSettings: RenderSettings = {
  bloom: {
    intensity: 0.5,
    threshold: 0.8,
    smoothing: 0.9,
  },
  ao: {
    radius: 0.5,
    intensity: 1.5,
  },
  material: {
    roughness: 0.1,
    metalness: 0.9,
    envMapIntensity: 1.5,
  },
  lighting: {
    keyLightIntensity: 2.0,
    ambientIntensity: 0.2,
  },
};

export const useRenderStore = create<RenderState>((set) => ({
  ...defaultSettings,
  setBloom: (bloom) =>
    set((state) => ({
      bloom: { ...state.bloom, ...bloom },
    })),
  setAO: (ao) =>
    set((state) => ({
      ao: { ...state.ao, ...ao },
    })),
  setMaterial: (material) =>
    set((state) => ({
      material: { ...state.material, ...material },
    })),
  setLighting: (lighting) =>
    set((state) => ({
      lighting: { ...state.lighting, ...lighting },
    })),
  reset: () => set(defaultSettings),
}));

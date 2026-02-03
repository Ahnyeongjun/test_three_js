import { create } from "zustand";
import { ModelPart, ModelState, MeshInfo, MeshPosition } from "@/types";

export const useModelStore = create<ModelState>((set) => ({
  explodeLevel: 0,
  setExplodeLevel: (level: number) => set({ explodeLevel: level }),
  isLoading: true,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  modelParts: [],
  setModelParts: (parts: ModelPart[]) => set({ modelParts: parts }),
  meshList: [],
  setMeshList: (list: MeshInfo[]) => set({ meshList: list }),
  selectedMeshId: null,
  setSelectedMeshId: (id: string | null) => set({ selectedMeshId: id }),
  meshPositions: {},
  setMeshPosition: (id: string, position: MeshPosition) =>
    set((state) => ({
      meshPositions: { ...state.meshPositions, [id]: position },
    })),
  resetAllPositions: () => set({ meshPositions: {}, explodeLevel: 0 }),
  isTransforming: false,
  setIsTransforming: (value: boolean) => set({ isTransforming: value }),
  isEditMode: false,
  setIsEditMode: (value: boolean) => set({ isEditMode: value, selectedMeshId: value ? null : null }),
  modelUrl: null,
  setModelUrl: (url: string | null) => set({ modelUrl: url, meshPositions: {}, explodeLevel: 0, isEditMode: false }),
  modelName: null,
  setModelName: (name: string | null) => set({ modelName: name }),
}));

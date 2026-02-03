import { Object3D, Vector3 } from "three";

export interface ModelPart {
  name: string;
  object: Object3D;
  originalPosition: Vector3;
}

export interface MeshInfo {
  id: string;
  name: string;
  color: string;
}

export interface MeshPosition {
  x: number;
  y: number;
  z: number;
}

export interface ModelState {
  explodeLevel: number;
  setExplodeLevel: (level: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  modelParts: ModelPart[];
  setModelParts: (parts: ModelPart[]) => void;
  meshList: MeshInfo[];
  setMeshList: (list: MeshInfo[]) => void;
  selectedMeshId: string | null;
  setSelectedMeshId: (id: string | null) => void;
  meshPositions: Record<string, MeshPosition>;
  setMeshPosition: (id: string, position: MeshPosition) => void;
  resetAllPositions: () => void;
  isTransforming: boolean;
  setIsTransforming: (value: boolean) => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  modelUrl: string | null;
  setModelUrl: (url: string | null) => void;
  modelName: string | null;
  setModelName: (name: string | null) => void;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface RenderSettings {
  bloom: {
    intensity: number;
    threshold: number;
    smoothing: number;
  };
  ao: {
    radius: number;
    intensity: number;
  };
  material: {
    roughness: number;
    metalness: number;
    envMapIntensity: number;
  };
  lighting: {
    keyLightIntensity: number;
    ambientIntensity: number;
  };
}

export interface RenderState extends RenderSettings {
  setBloom: (bloom: Partial<RenderSettings["bloom"]>) => void;
  setAO: (ao: Partial<RenderSettings["ao"]>) => void;
  setMaterial: (material: Partial<RenderSettings["material"]>) => void;
  setLighting: (lighting: Partial<RenderSettings["lighting"]>) => void;
  reset: () => void;
}

import { Object3D, Vector3 } from "three";

export interface ModelPart {
  name: string;
  object: Object3D;
  originalPosition: Vector3;
}

export interface ModelState {
  explodeLevel: number;
  setExplodeLevel: (level: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  modelParts: ModelPart[];
  setModelParts: (parts: ModelPart[]) => void;
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

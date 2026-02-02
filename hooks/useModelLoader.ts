"use client";

import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Object3D, Vector3, Box3 } from "three";
import { useModelStore } from "@/zustand/useModelStore";
import { ModelPart } from "@/types";

export function useModelLoader(modelUrl: string) {
  const { scene } = useGLTF(modelUrl);
  const { setModelParts, setIsLoading } = useModelStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!scene || initialized.current) return;
    initialized.current = true;

    const parts: ModelPart[] = [];
    const center = new Vector3();
    const box = new Box3().setFromObject(scene);
    box.getCenter(center);

    scene.traverse((child: Object3D) => {
      if (child.type === "Mesh" || child.type === "Group") {
        if (child.children.length === 0 || child.type === "Mesh") {
          const worldPosition = new Vector3();
          child.getWorldPosition(worldPosition);

          parts.push({
            name: child.name || `part_${parts.length}`,
            object: child,
            originalPosition: worldPosition.clone(),
          });
        }
      }
    });

    setModelParts(parts);
    setIsLoading(false);
  }, [scene, setModelParts, setIsLoading]);

  return { scene };
}

useGLTF.preload(
  "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb"
);

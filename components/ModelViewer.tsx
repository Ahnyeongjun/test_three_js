"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { Group, Vector3, Box3, Object3D, Mesh, MeshStandardMaterial } from "three";
import { useModelStore } from "@/zustand/useModelStore";

interface ModelViewerProps {
  modelUrl: string;
}

interface PartData {
  object: Object3D;
  originalPosition: Vector3;
  direction: Vector3;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(modelUrl);
  const { explodeLevel, setIsLoading } = useModelStore();
  const partsRef = useRef<PartData[]>([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child: Object3D) => {
      if (child instanceof Mesh && child.material) {
        const originalMaterial = child.material as MeshStandardMaterial;
        child.material = new MeshStandardMaterial({
          color: originalMaterial.color,
          map: originalMaterial.map,
          normalMap: originalMaterial.normalMap,
          roughness: 0.4,
          metalness: 0.6,
          envMapIntensity: 1.0,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    const box = new Box3().setFromObject(clonedScene);
    const center = new Vector3();
    box.getCenter(center);

    const parts: PartData[] = [];

    clonedScene.traverse((child: Object3D) => {
      if (child instanceof Mesh) {
        const worldPos = new Vector3();
        child.getWorldPosition(worldPos);

        const direction = worldPos.clone().sub(center).normalize();
        if (direction.length() < 0.01) {
          direction.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        }

        parts.push({
          object: child,
          originalPosition: worldPos.clone(),
          direction: direction,
        });
      }
    });

    partsRef.current = parts;
    setIsLoading(false);
  }, [clonedScene, setIsLoading]);

  useFrame(() => {
    const explodeDistance = 2;

    partsRef.current.forEach((part) => {
      const targetPosition = part.originalPosition
        .clone()
        .add(part.direction.clone().multiplyScalar(explodeLevel * explodeDistance));

      part.object.position.lerp(targetPosition, 0.1);
    });
  });

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={clonedScene} scale={0.5} />
      </group>
    </Center>
  );
}

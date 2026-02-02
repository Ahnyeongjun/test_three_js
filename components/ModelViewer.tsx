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
  explodeDirection: Vector3;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(modelUrl);
  const { explodeLevel, setIsLoading } = useModelStore();
  const partsRef = useRef<PartData[]>([]);
  const centerRef = useRef<Vector3>(new Vector3());

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

    // 디버깅: 모델 구조 출력
    console.log("=== Model Structure ===");
    clonedScene.traverse((child: Object3D) => {
      const indent = "  ".repeat(child.parent ? getDepth(child) : 0);
      console.log(`${indent}${child.type}: "${child.name}" pos:(${child.position.x.toFixed(2)}, ${child.position.y.toFixed(2)}, ${child.position.z.toFixed(2)})`);
    });

    // 모델 전체의 중심점 계산
    const box = new Box3().setFromObject(clonedScene);
    box.getCenter(centerRef.current);

    const parts: PartData[] = [];

    clonedScene.traverse((child: Object3D) => {
      // SkinnedMesh나 Bone은 제외, 일반 Mesh만 처리
      if (child instanceof Mesh && child.type === "Mesh") {
        // 로컬 위치 저장 (원래 위치)
        const originalPos = child.position.clone();

        // 월드 좌표로 방향 계산
        const worldPos = new Vector3();
        child.getWorldPosition(worldPos);

        // 중심에서 파츠 방향으로의 벡터 계산
        const direction = worldPos.clone().sub(centerRef.current);

        // 방향이 너무 작으면 랜덤 방향 설정
        if (direction.length() < 0.1) {
          direction.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          );
        }
        direction.normalize();

        parts.push({
          object: child,
          originalPosition: originalPos,
          explodeDirection: direction,
        });

        console.log(`Part added: "${child.name}" type: ${child.type}`);
      }
    });

    partsRef.current = parts;
    setIsLoading(false);
  }, [clonedScene, setIsLoading]);

  // 계층 깊이 계산 헬퍼
  function getDepth(obj: Object3D): number {
    let depth = 0;
    let parent = obj.parent;
    while (parent) {
      depth++;
      parent = parent.parent;
    }
    return depth;
  }

  useFrame(() => {
    const explodeDistance = 1.5; // 분리 거리

    partsRef.current.forEach((part) => {
      // 원래 로컬 위치 + (방향 * explodeLevel * 거리)
      const targetPosition = part.originalPosition
        .clone()
        .add(part.explodeDirection.clone().multiplyScalar(explodeLevel * explodeDistance));

      // 부드러운 전환
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

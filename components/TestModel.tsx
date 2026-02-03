"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3, Mesh } from "three";
import { useModelStore } from "@/zustand/useModelStore";
import { useRenderStore } from "@/zustand/useRenderStore";

interface PartData {
  mesh: Mesh;
  originalPosition: Vector3;
  explodeDirection: Vector3;
}

export default function TestModel() {
  const groupRef = useRef<Group>(null);
  const { explodeLevel, setIsLoading } = useModelStore();
  const { material } = useRenderStore();
  const partsRef = useRef<PartData[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!groupRef.current || initialized.current) return;
    initialized.current = true;

    const parts: PartData[] = [];

    // 그룹 내의 모든 메쉬 수집
    groupRef.current.children.forEach((child) => {
      if (child instanceof Mesh) {
        const originalPos = child.position.clone();
        const direction = originalPos.clone().normalize();

        // 중앙에 있는 파츠는 위로 분리
        if (direction.length() < 0.1) {
          direction.set(0, 1, 0);
        }

        parts.push({
          mesh: child,
          originalPosition: originalPos,
          explodeDirection: direction,
        });
      }
    });

    partsRef.current = parts;
    setIsLoading(false);
  }, [setIsLoading]);

  useFrame(() => {
    const explodeDistance = 2;

    partsRef.current.forEach((part) => {
      const targetPosition = part.originalPosition
        .clone()
        .add(part.explodeDirection.clone().multiplyScalar(explodeLevel * explodeDistance));

      part.mesh.position.lerp(targetPosition, 0.15);
    });
  });

  return (
    <group ref={groupRef}>
      {/* 몸통 (중앙) - 광택 금속 */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1.5, 0.6]} />
        <meshStandardMaterial
          color="#6366f1"
          roughness={material.roughness}
          metalness={material.metalness}
          envMapIntensity={material.envMapIntensity}
        />
      </mesh>

      {/* 머리 - 크롬 */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={material.roughness * 0.5}
          metalness={Math.min(material.metalness * 1.1, 1)}
          envMapIntensity={material.envMapIntensity * 1.3}
        />
      </mesh>

      {/* 왼팔 - 광택 청록 */}
      <mesh position={[-0.8, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1, 0.4]} />
        <meshStandardMaterial
          color="#22d3ee"
          roughness={material.roughness * 1.5}
          metalness={material.metalness * 0.95}
          envMapIntensity={material.envMapIntensity * 0.8}
        />
      </mesh>

      {/* 오른팔 - 광택 청록 */}
      <mesh position={[0.8, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1, 0.4]} />
        <meshStandardMaterial
          color="#22d3ee"
          roughness={material.roughness * 1.5}
          metalness={material.metalness * 0.95}
          envMapIntensity={material.envMapIntensity * 0.8}
        />
      </mesh>

      {/* 왼다리 - 광택 핑크 */}
      <mesh position={[-0.3, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial
          color="#f472b6"
          roughness={material.roughness * 2}
          metalness={material.metalness * 0.9}
          envMapIntensity={material.envMapIntensity * 0.7}
        />
      </mesh>

      {/* 오른다리 - 광택 핑크 */}
      <mesh position={[0.3, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial
          color="#f472b6"
          roughness={material.roughness * 2}
          metalness={material.metalness * 0.9}
          envMapIntensity={material.envMapIntensity * 0.7}
        />
      </mesh>
    </group>
  );
}

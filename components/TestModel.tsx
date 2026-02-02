"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3, Mesh } from "three";
import { useModelStore } from "@/zustand/useModelStore";

interface PartData {
  mesh: Mesh;
  originalPosition: Vector3;
  explodeDirection: Vector3;
}

export default function TestModel() {
  const groupRef = useRef<Group>(null);
  const { explodeLevel, setIsLoading } = useModelStore();
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
      {/* 몸통 (중앙) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.5, 0.6]} />
        <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 머리 */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 왼팔 */}
      <mesh position={[-0.8, 0.3, 0]}>
        <boxGeometry args={[0.5, 1, 0.4]} />
        <meshStandardMaterial color="#22d3ee" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 오른팔 */}
      <mesh position={[0.8, 0.3, 0]}>
        <boxGeometry args={[0.5, 1, 0.4]} />
        <meshStandardMaterial color="#22d3ee" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 왼다리 */}
      <mesh position={[-0.3, -1.2, 0]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#f472b6" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 오른다리 */}
      <mesh position={[0.3, -1.2, 0]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#f472b6" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

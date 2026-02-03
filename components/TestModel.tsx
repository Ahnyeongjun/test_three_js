"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { Group, Vector3, Mesh, Object3D } from "three";
import { useModelStore } from "@/zustand/useModelStore";
import { useRenderStore } from "@/zustand/useRenderStore";
import { MeshInfo } from "@/types";

interface PartData {
  id: string;
  mesh: Mesh;
  originalPosition: Vector3;
  explodeDirection: Vector3;
}

interface MeshPartProps {
  id: string;
  name: string;
  position: [number, number, number];
  geometry: [number, number, number];
  color: string;
  roughnessMultiplier?: number;
  metalnessMultiplier?: number;
  envMapMultiplier?: number;
}

const MESH_PARTS: MeshPartProps[] = [
  {
    id: "body",
    name: "몸통",
    position: [0, 0, 0],
    geometry: [1, 1.5, 0.6],
    color: "#6366f1",
    roughnessMultiplier: 1,
    metalnessMultiplier: 1,
    envMapMultiplier: 1,
  },
  {
    id: "head",
    name: "머리",
    position: [0, 1.2, 0],
    geometry: [0.6, 0.6, 0.6],
    color: "#ffffff",
    roughnessMultiplier: 0.5,
    metalnessMultiplier: 1.1,
    envMapMultiplier: 1.3,
  },
  {
    id: "left-arm",
    name: "왼팔",
    position: [-0.8, 0.3, 0],
    geometry: [0.5, 1, 0.4],
    color: "#22d3ee",
    roughnessMultiplier: 1.5,
    metalnessMultiplier: 0.95,
    envMapMultiplier: 0.8,
  },
  {
    id: "right-arm",
    name: "오른팔",
    position: [0.8, 0.3, 0],
    geometry: [0.5, 1, 0.4],
    color: "#22d3ee",
    roughnessMultiplier: 1.5,
    metalnessMultiplier: 0.95,
    envMapMultiplier: 0.8,
  },
  {
    id: "left-leg",
    name: "왼다리",
    position: [-0.3, -1.2, 0],
    geometry: [0.4, 1, 0.4],
    color: "#f472b6",
    roughnessMultiplier: 2,
    metalnessMultiplier: 0.9,
    envMapMultiplier: 0.7,
  },
  {
    id: "right-leg",
    name: "오른다리",
    position: [0.3, -1.2, 0],
    geometry: [0.4, 1, 0.4],
    color: "#f472b6",
    roughnessMultiplier: 2,
    metalnessMultiplier: 0.9,
    envMapMultiplier: 0.7,
  },
];

interface SelectableMeshProps extends MeshPartProps {
  meshRef: (el: Mesh | null) => void;
}

function SelectableMesh({
  id,
  position,
  geometry,
  color,
  roughnessMultiplier = 1,
  metalnessMultiplier = 1,
  envMapMultiplier = 1,
  meshRef,
}: SelectableMeshProps) {
  const { material } = useRenderStore();
  const { selectedMeshId, setSelectedMeshId, isTransforming, isEditMode } = useModelStore();
  const isSelected = selectedMeshId === id;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (isTransforming) return;
    e.stopPropagation();
    setSelectedMeshId(isSelected ? null : id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isTransforming) {
      document.body.style.cursor = isEditMode ? "move" : "pointer";
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  return (
    <mesh
      ref={meshRef}
      name={id}
      position={position}
      castShadow
      receiveShadow
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxGeometry args={geometry} />
      <meshStandardMaterial
        color={isSelected ? "#fbbf24" : color}
        roughness={material.roughness * roughnessMultiplier}
        metalness={Math.min(material.metalness * metalnessMultiplier, 1)}
        envMapIntensity={material.envMapIntensity * envMapMultiplier}
        emissive={isSelected ? "#fbbf24" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

function MeshTransformControls({ target }: { target: Object3D | null }) {
  const { setMeshPosition, setIsTransforming, isEditMode } = useModelStore();
  const { gl } = useThree();

  if (!target || !isEditMode) return null;

  const handleDragStart = () => {
    setIsTransforming(true);
    gl.domElement.style.cursor = "grabbing";
  };

  const handleDragEnd = () => {
    setIsTransforming(false);
    gl.domElement.style.cursor = "auto";

    const meshId = target.name;
    if (meshId) {
      setMeshPosition(meshId, {
        x: target.position.x,
        y: target.position.y,
        z: target.position.z,
      });
    }
  };

  return (
    <TransformControls
      object={target}
      mode="translate"
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
    />
  );
}

export default function TestModel() {
  const groupRef = useRef<Group>(null);
  const meshRefs = useRef<Record<string, Mesh | null>>({});
  const {
    explodeLevel,
    setIsLoading,
    setMeshList,
    setSelectedMeshId,
    selectedMeshId,
    meshPositions,
    isTransforming,
    isEditMode
  } = useModelStore();
  const partsRef = useRef<PartData[]>([]);
  const initialized = useRef(false);

  const meshList = useMemo<MeshInfo[]>(
    () =>
      MESH_PARTS.map((part) => ({
        id: part.id,
        name: part.name,
        color: part.color,
      })),
    []
  );

  useEffect(() => {
    setMeshList(meshList);
  }, [meshList, setMeshList]);

  useEffect(() => {
    if (!groupRef.current || initialized.current) return;
    initialized.current = true;

    const parts: PartData[] = [];

    groupRef.current.traverse((child) => {
      if (child instanceof Mesh && child.name) {
        const partConfig = MESH_PARTS.find(p => p.id === child.name);
        if (partConfig) {
          const originalPos = new Vector3(...partConfig.position);
          const direction = originalPos.clone().normalize();

          if (direction.length() < 0.1) {
            direction.set(0, 1, 0);
          }

          parts.push({
            id: child.name,
            mesh: child,
            originalPosition: originalPos,
            explodeDirection: direction,
          });
        }
      }
    });

    partsRef.current = parts;
    setIsLoading(false);
  }, [setIsLoading]);

  useFrame(() => {
    if (isTransforming) return;

    const explodeDistance = 2;

    partsRef.current.forEach((part) => {
      const customPos = meshPositions[part.id];

      // 기준 위치: 수동 이동한 위치가 있으면 그 위치, 없으면 원래 위치
      const basePosition = customPos
        ? new Vector3(customPos.x, customPos.y, customPos.z)
        : part.originalPosition.clone();

      // explode 효과 적용 (이동된 메쉬에도 적용)
      const targetPosition = basePosition
        .clone()
        .add(part.explodeDirection.clone().multiplyScalar(explodeLevel * explodeDistance));

      part.mesh.position.lerp(targetPosition, 0.15);
    });
  });

  const handleBackgroundClick = () => {
    if (!isTransforming) {
      setSelectedMeshId(null);
    }
  };

  const selectedMesh = selectedMeshId ? meshRefs.current[selectedMeshId] : null;

  return (
    <>
      <group ref={groupRef} onClick={handleBackgroundClick}>
        {MESH_PARTS.map((part) => (
          <SelectableMesh
            key={part.id}
            {...part}
            meshRef={(el) => {
              meshRefs.current[part.id] = el;
            }}
          />
        ))}
      </group>

      <MeshTransformControls target={selectedMesh} />
    </>
  );
}

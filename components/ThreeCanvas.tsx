"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import styled from "styled-components";
import LightingSetup from "./LightingSetup";
import TestModel from "./TestModel";

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f0f 100%);
`;

interface ThreeCanvasProps {
  modelUrl?: string;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

export default function ThreeCanvas({ modelUrl }: ThreeCanvasProps) {
  return (
    <CanvasContainer>
      <Canvas
        shadows
        camera={{ position: [5, 3, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0f0f0f"]} />

        <LightingSetup />

        <Suspense fallback={<LoadingFallback />}>
          <TestModel />
          <Environment preset="city" />
        </Suspense>

        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.5}
          dampingFactor={0.05}
          enableDamping
        />

        <gridHelper args={[20, 20, "#27272a", "#1a1a1a"]} position={[0, -2, 0]} />
      </Canvas>
    </CanvasContainer>
  );
}

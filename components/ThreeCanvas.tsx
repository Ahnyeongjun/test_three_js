"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, N8AO, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import styled from "styled-components";
import LightingSetup from "./LightingSetup";
import TestModel from "./TestModel";
import { useRenderStore } from "@/zustand/useRenderStore";

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
  const { bloom, ao, lighting } = useRenderStore();

  return (
    <CanvasContainer>
      <Canvas
        shadows
        camera={{ position: [5, 3, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#0f0f0f"]} />

        <LightingSetup
          keyLightIntensity={lighting.keyLightIntensity}
          ambientIntensity={lighting.ambientIntensity}
        />

        <Suspense fallback={<LoadingFallback />}>
          <TestModel />
          <Environment preset="city" background={false} />
        </Suspense>

        {/* 포스트 프로세싱 효과 */}
        <EffectComposer>
          {/* Bloom - 광택 반사 글로우 */}
          <Bloom
            intensity={bloom.intensity}
            luminanceThreshold={bloom.threshold}
            luminanceSmoothing={bloom.smoothing}
            mipmapBlur
          />
          {/* N8AO - 앰비언트 오클루전 (틈새 그림자) */}
          <N8AO
            aoRadius={ao.radius}
            intensity={ao.intensity}
            distanceFalloff={0.5}
          />
          {/* 톤 매핑 - 색감 보정 */}
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>

        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.5}
          scale={10}
          blur={2.5}
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

"use client";

import { useRef } from "react";
import { DirectionalLight, SpotLight } from "three";

interface LightingSetupProps {
  keyLightIntensity?: number;
  ambientIntensity?: number;
}

export default function LightingSetup({
  keyLightIntensity = 2.0,
  ambientIntensity = 0.2,
}: LightingSetupProps) {
  const directionalRef = useRef<DirectionalLight>(null);
  const spotRef = useRef<SpotLight>(null);

  return (
    <>
      {/* Ambient light - 낮게 설정해서 대비 강조 */}
      <ambientLight intensity={ambientIntensity} color="#ffffff" />

      {/* Main key light - 강한 메인 조명 */}
      <directionalLight
        ref={directionalRef}
        position={[5, 8, 5]}
        intensity={keyLightIntensity}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light - 반대편에서 부드럽게 */}
      <directionalLight
        position={[-4, 4, -4]}
        intensity={0.8}
        color="#c7d2fe"
      />

      {/* Top spotlight - 위에서 하이라이트 */}
      <spotLight
        ref={spotRef}
        position={[0, 12, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Back rim light - 뒤에서 실루엣 강조 */}
      <pointLight position={[-3, 3, -5]} intensity={0.8} color="#818cf8" />

      {/* Front accent light - 앞에서 반사 강조 */}
      <pointLight position={[3, 2, 4]} intensity={0.5} color="#f0abfc" />

      {/* Bottom bounce light - 바닥 반사광 시뮬레이션 */}
      <pointLight position={[0, -3, 0]} intensity={0.3} color="#6366f1" />

      {/* Hemisphere light - 하늘/땅 그라데이션 */}
      <hemisphereLight
        args={["#a5b4fc", "#1e1b4b", 0.4]}
        position={[0, 50, 0]}
      />
    </>
  );
}

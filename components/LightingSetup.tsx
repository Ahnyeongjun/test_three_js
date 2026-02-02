"use client";

import { useRef } from "react";
import { DirectionalLight, SpotLight } from "three";

export default function LightingSetup() {
  const directionalRef = useRef<DirectionalLight>(null);
  const spotRef = useRef<SpotLight>(null);

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* Main directional light (sun-like) */}
      <directionalLight
        ref={directionalRef}
        position={[5, 10, 7]}
        intensity={1.2}
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

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.5}
        color="#e0e7ff"
      />

      {/* Spotlight for dramatic effect */}
      <spotLight
        ref={spotRef}
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Rim light for edge highlighting */}
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#818cf8" />

      {/* Environment hemisphere light */}
      <hemisphereLight
        args={["#87ceeb", "#362312", 0.5]}
        position={[0, 50, 0]}
      />
    </>
  );
}

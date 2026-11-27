"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import {
  usePrefersReducedMotion,
  useWebGLSupport,
  WebGLErrorBoundary,
} from "./WebGLErrorBoundary";

function ClosingSculpture() {
  const outerRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.25;
      outerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.14;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x -= delta * 0.32;
      coreRef.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <Float speed={reducedMotion ? 0 : 1.6} floatIntensity={reducedMotion ? 0 : 0.4}>
      <group ref={outerRef}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshStandardMaterial
            color="#151D35"
            metalness={0.9}
            roughness={0.18}
            emissive="#4C7BFF"
            emissiveIntensity={0.42}
          />
        </mesh>
        <mesh scale={1.52}>
          <icosahedronGeometry args={[1.05, 2]} />
          <meshBasicMaterial color="#45E4FF" wireframe transparent opacity={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 2.6, 0.3, 0]}>
          <torusGeometry args={[2.0, 0.018, 16, 120]} />
          <meshBasicMaterial color="#9B6BFF" transparent opacity={0.65} />
        </mesh>
        <mesh rotation={[-Math.PI / 3.2, -0.45, 0]}>
          <torusGeometry args={[2.32, 0.012, 16, 120]} />
          <meshBasicMaterial color="#FF9B62" transparent opacity={0.45} />
        </mesh>
      </group>
    </Float>
  );
}

export default function ClosingOrbCanvas() {
  const webglSupported = useWebGLSupport();

  if (!webglSupported) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_center,rgba(91,140,255,0.22),transparent_65%)]" />
    );
  }

  return (
    <WebGLErrorBoundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.4], fov: 44 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 4]} intensity={1.3} color="#F5F7FF" />
        <pointLight position={[-4, -3, 3]} intensity={2.2} color="#9B6BFF" />
        <pointLight position={[3, 2, 3]} intensity={1.8} color="#45E4FF" />
        <ClosingSculpture />
        <Sparkles
          count={38}
          scale={[6, 6, 4]}
          size={1.5}
          speed={0.25}
          opacity={0.45}
          color="#45E4FF"
        />
      </Canvas>
    </WebGLErrorBoundary>
  );
}

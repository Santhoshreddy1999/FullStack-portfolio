"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { CapabilityGeometry } from "@/data/capabilities";
import {
  usePrefersReducedMotion,
  useWebGLSupport,
  WebGLErrorBoundary,
} from "./WebGLErrorBoundary";

function GeometrySculpture({
  type,
  accent,
}: {
  type: CapabilityGeometry;
  accent: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.45;
    groupRef.current.rotation.x += delta * 0.18;
  });

  return (
    <Float speed={reducedMotion ? 0 : 2} floatIntensity={reducedMotion ? 0 : 0.45}>
      <group ref={groupRef}>
        {type === "octahedron" && (
          <>
            <mesh>
              <octahedronGeometry args={[1.15, 0]} />
              <meshStandardMaterial
                color="#141B30"
                metalness={0.85}
                roughness={0.2}
                emissive={accent}
                emissiveIntensity={0.35}
              />
            </mesh>
            <mesh scale={1.45}>
              <octahedronGeometry args={[1.15, 1]} />
              <meshBasicMaterial color={accent} wireframe transparent opacity={0.4} />
            </mesh>
          </>
        )}

        {type === "torusKnot" && (
          <>
            <mesh>
              <torusKnotGeometry args={[0.82, 0.24, 100, 18]} />
              <meshStandardMaterial
                color="#191632"
                metalness={0.85}
                roughness={0.18}
                emissive={accent}
                emissiveIntensity={0.4}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
              <torusGeometry args={[1.6, 0.02, 16, 90]} />
              <meshBasicMaterial color={accent} transparent opacity={0.55} />
            </mesh>
          </>
        )}

        {type === "icosahedron" && (
          <>
            <mesh>
              <icosahedronGeometry args={[1.1, 0]} />
              <meshStandardMaterial
                color="#102030"
                metalness={0.88}
                roughness={0.22}
                emissive={accent}
                emissiveIntensity={0.35}
              />
            </mesh>
            <mesh scale={1.42}>
              <icosahedronGeometry args={[1.1, 1]} />
              <meshBasicMaterial color={accent} wireframe transparent opacity={0.38} />
            </mesh>
          </>
        )}

        {type === "dodecahedron" && (
          <>
            <mesh>
              <dodecahedronGeometry args={[1.1, 0]} />
              <meshStandardMaterial
                color="#261B1A"
                metalness={0.82}
                roughness={0.25}
                emissive={accent}
                emissiveIntensity={0.35}
              />
            </mesh>
            <mesh rotation={[Math.PI / 3, 0.4, 0]}>
              <torusGeometry args={[1.65, 0.022, 16, 96]} />
              <meshBasicMaterial color={accent} transparent opacity={0.5} />
            </mesh>
            <mesh rotation={[-Math.PI / 3, -0.4, 0]}>
              <torusGeometry args={[1.9, 0.015, 16, 96]} />
              <meshBasicMaterial color="#5B8CFF" transparent opacity={0.35} />
            </mesh>
          </>
        )}

        {type === "boxGrid" && (
          <group>
            {[
              [-0.65, 0.55, 0],
              [0.65, 0.55, 0],
              [-0.65, -0.55, 0],
              [0.65, -0.55, 0],
              [0, 0, 0.65],
              [0, 0, -0.65],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]}>
                <boxGeometry args={[0.62, 0.62, 0.62]} />
                <meshStandardMaterial
                  color="#131C2B"
                  metalness={0.84}
                  roughness={0.24}
                  emissive={accent}
                  emissiveIntensity={idx % 2 === 0 ? 0.4 : 0.2}
                />
              </mesh>
            ))}
          </group>
        )}

        {type === "ringCore" && (
          <group>
            <mesh>
              <sphereGeometry args={[0.62, 24, 24]} />
              <meshStandardMaterial
                color="#1F1B12"
                metalness={0.9}
                roughness={0.18}
                emissive={accent}
                emissiveIntensity={0.45}
              />
            </mesh>
            <mesh rotation={[0.4, 0.2, 0]}>
              <torusGeometry args={[1.22, 0.035, 16, 96]} />
              <meshBasicMaterial color={accent} transparent opacity={0.75} />
            </mesh>
            <mesh rotation={[-0.7, 0.6, 0.3]}>
              <torusGeometry args={[1.58, 0.025, 16, 96]} />
              <meshBasicMaterial color="#5B8CFF" transparent opacity={0.55} />
            </mesh>
            <mesh rotation={[1.2, -0.5, 0.4]}>
              <torusGeometry args={[1.9, 0.018, 16, 96]} />
              <meshBasicMaterial color="#45E4FF" transparent opacity={0.4} />
            </mesh>
          </group>
        )}
      </group>
    </Float>
  );
}

export default function CapabilityScene({
  geometry,
  accent,
}: {
  geometry: CapabilityGeometry;
  accent: string;
}) {
  const webglSupported = useWebGLSupport();

  if (!webglSupported) {
    return (
      <div
        className="flex h-full w-full items-center justify-center rounded-xl border border-white/10"
        style={{
          background: `radial-gradient(circle at center, ${accent}25, transparent 65%)`,
        }}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-[#969BB0]">
          3D Preview Unavailable
        </span>
      </div>
    );
  }

  return (
    <WebGLErrorBoundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.6], fov: 44 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 5, 4]} intensity={1.3} />
        <pointLight position={[-3, -2, 3]} intensity={2} color={accent} />
        <GeometrySculpture type={geometry} accent={accent} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.9} />
      </Canvas>
    </WebGLErrorBoundary>
  );
}

"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useScrollMotion } from "./ScrollStateContext";
import {
  usePrefersReducedMotion,
  useWebGLSupport,
  WebGLErrorBoundary,
} from "./WebGLErrorBoundary";

function seededNoise(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function NeuralNetworkConstellation({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { motionRef } = useScrollMotion();
  const reducedMotion = usePrefersReducedMotion();

  const { pointsPositions, linePositions } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const r = 4.2 + seededNoise(i, 1) * 5.2;
      const theta = seededNoise(i, 2) * Math.PI * 2;
      const phi = Math.acos(2 * seededNoise(i, 3) - 1);
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) * 0.7,
          r * Math.sin(phi) * Math.sin(theta) - 2
        )
      );
    }

    const pArr = new Float32Array(pts.length * 3);
    pts.forEach((p, idx) => {
      pArr[idx * 3] = p.x;
      pArr[idx * 3 + 1] = p.y;
      pArr[idx * 3 + 2] = p.z;
    });

    const segments: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 3.1 && segments.length < 720) {
          segments.push(
            pts[i].x,
            pts[i].y,
            pts[i].z,
            pts[j].x,
            pts[j].y,
            pts[j].z
          );
        }
      }
    }

    return {
      pointsPositions: pArr,
      linePositions: new Float32Array(segments),
    };
  }, [count]);

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;
    const p = motionRef.current.progress;
    groupRef.current.rotation.y += delta * 0.035;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      p * 0.9 + motionRef.current.pointerY * 0.08,
      0.04
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      -p * 2.8,
      0.05
    );
    void state;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointsPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#45E4FF"
          size={0.075}
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#5B8CFF" transparent opacity={0.14} />
      </lineSegments>
    </group>
  );
}

function DataStreams({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { motionRef } = useScrollMotion();
  const reducedMotion = usePrefersReducedMotion();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color("#5B8CFF");
    const c2 = new THREE.Color("#9B6BFF");
    const c3 = new THREE.Color("#45E4FF");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededNoise(i, 11) - 0.5) * 26;
      pos[i * 3 + 1] = (seededNoise(i, 12) - 0.5) * 18;
      pos[i * 3 + 2] = -seededNoise(i, 13) * 16 - 1;

      const pick = seededNoise(i, 14);
      const c = pick < 0.45 ? c1 : pick < 0.78 ? c2 : c3;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current || reducedMotion) return;
    const p = motionRef.current.progress;
    ref.current.rotation.y += delta * 0.014;
    ref.current.position.z = THREE.MathUtils.lerp(
      ref.current.position.z,
      p * 4.5,
      0.04
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

function EvolvingArchitecturalCore() {
  const heroGroup = useRef<THREE.Group>(null);
  const innerKnot = useRef<THREE.Mesh>(null);
  const outerRing = useRef<THREE.Mesh>(null);
  const planetGroup = useRef<THREE.Group>(null);
  const lightAccent = useRef<THREE.PointLight>(null);

  const { motionRef } = useScrollMotion();
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const { progress: p, pointerX, pointerY } = motionRef.current;

    // Subtle camera parallax and scroll trajectory
    const targetCamX = pointerX * 0.55 + Math.sin(p * Math.PI * 2) * 0.7;
    const targetCamY = pointerY * 0.35 - p * 1.1;
    const targetCamZ = 8.4 - Math.sin(p * Math.PI) * 1.3;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetCamX,
      0.045
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetCamY,
      0.045
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetCamZ,
      0.045
    );
    state.camera.lookAt(0, -p * 0.5, -1.5);

    if (heroGroup.current) {
      // Hero centerpiece starts on right, drifts across sections, returns in contact
      const targetX =
        p < 0.16
          ? 2.2
          : p < 0.45
            ? THREE.MathUtils.lerp(2.2, -3.4, (p - 0.16) / 0.29)
            : p < 0.82
              ? THREE.MathUtils.lerp(-3.4, 3.2, (p - 0.45) / 0.37)
              : THREE.MathUtils.lerp(3.2, 0.2, (p - 0.82) / 0.18);

      const targetY =
        p < 0.16
          ? 0.25
          : Math.cos(p * Math.PI * 2.5) * 1.35;

      const targetScale =
        p < 0.16
          ? 1.08
          : p > 0.84
            ? 0.95
            : 0.76;

      heroGroup.current.position.x = THREE.MathUtils.lerp(
        heroGroup.current.position.x,
        targetX,
        0.04
      );
      heroGroup.current.position.y = THREE.MathUtils.lerp(
        heroGroup.current.position.y,
        targetY,
        0.04
      );
      heroGroup.current.scale.setScalar(
        THREE.MathUtils.lerp(heroGroup.current.scale.x, targetScale, 0.04)
      );

      if (!reducedMotion) {
        heroGroup.current.rotation.y += delta * 0.14;
        heroGroup.current.rotation.z = Math.sin(t * 0.35) * 0.12;
      }
    }

    if (innerKnot.current && !reducedMotion) {
      innerKnot.current.rotation.x += delta * 0.22;
      innerKnot.current.rotation.y -= delta * 0.18;
    }

    if (outerRing.current && !reducedMotion) {
      outerRing.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.18;
      outerRing.current.rotation.z += delta * 0.16;
    }

    if (planetGroup.current) {
      // Digital planet emerges gently in mid-sections
      const targetPX = THREE.MathUtils.lerp(-4.8, 4.1, p);
      const targetPY = THREE.MathUtils.lerp(-3.2, 2.4, Math.sin(p * Math.PI));
      const targetPZ = -5.5 + Math.sin(p * Math.PI) * 2.2;
      planetGroup.current.position.x = THREE.MathUtils.lerp(
        planetGroup.current.position.x,
        targetPX,
        0.035
      );
      planetGroup.current.position.y = THREE.MathUtils.lerp(
        planetGroup.current.position.y,
        targetPY,
        0.035
      );
      planetGroup.current.position.z = THREE.MathUtils.lerp(
        planetGroup.current.position.z,
        targetPZ,
        0.035
      );
      if (!reducedMotion) {
        planetGroup.current.rotation.y += delta * 0.09;
      }
    }

    if (lightAccent.current) {
      const hueShift = p < 0.35 ? "#5B8CFF" : p < 0.68 ? "#9B6BFF" : "#45E4FF";
      lightAccent.current.color.lerp(new THREE.Color(hueShift), 0.04);
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 6]} intensity={1.15} color="#F5F7FF" />
      <pointLight
        ref={lightAccent}
        position={[3, 2, 4]}
        intensity={2.6}
        distance={16}
        color="#5B8CFF"
      />
      <pointLight
        position={[-5, -3, 2]}
        intensity={1.6}
        distance={14}
        color="#9B6BFF"
      />
      <pointLight
        position={[0, 5, -4]}
        intensity={1.4}
        distance={14}
        color="#45E4FF"
      />

      {/* Primary Metallic Geometric Centerpiece */}
      <Float
        speed={reducedMotion ? 0 : 1.4}
        rotationIntensity={reducedMotion ? 0 : 0.25}
        floatIntensity={reducedMotion ? 0 : 0.4}
      >
        <group ref={heroGroup} position={[2.2, 0.25, -0.8]}>
          {/* Inner metallic torus knot */}
          <mesh ref={innerKnot}>
            <torusKnotGeometry args={[0.92, 0.22, 128, 24]} />
            <meshStandardMaterial
              color="#1A2238"
              metalness={0.88}
              roughness={0.22}
              emissive="#24428C"
              emissiveIntensity={0.45}
            />
          </mesh>

          {/* Outer faceted wireframe icosahedron */}
          <mesh scale={1.72}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#5B8CFF"
              wireframe
              transparent
              opacity={0.26}
            />
          </mesh>

          {/* Precision orbital ring */}
          <mesh ref={outerRing} scale={2.18}>
            <torusGeometry args={[1, 0.012, 16, 120]} />
            <meshBasicMaterial color="#45E4FF" transparent opacity={0.55} />
          </mesh>

          {/* Secondary inclined violet orbit */}
          <mesh rotation={[Math.PI * 0.62, 0.4, 0]} scale={2.52}>
            <torusGeometry args={[1, 0.008, 12, 100]} />
            <meshBasicMaterial color="#9B6BFF" transparent opacity={0.35} />
          </mesh>
        </group>
      </Float>

      {/* Abstract Digital Planet */}
      <group ref={planetGroup} position={[-4.8, -3.2, -5.5]}>
        <mesh>
          <sphereGeometry args={[1.45, 28, 28]} />
          <meshStandardMaterial
            color="#101528"
            metalness={0.6}
            roughness={0.35}
            wireframe
            emissive="#4C3399"
            emissiveIntensity={0.55}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.25, 24, 24]} />
          <meshStandardMaterial
            color="#0B0F1F"
            metalness={0.8}
            roughness={0.3}
            transparent
            opacity={0.78}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
          <ringGeometry args={[1.85, 2.25, 64]} />
          <meshBasicMaterial
            color="#FF9B62"
            side={THREE.DoubleSide}
            transparent
            opacity={0.22}
          />
        </mesh>
      </group>
    </>
  );
}

export default function PersistentSceneCanvas() {
  const webglSupported = useWebGLSupport();
  const reducedMotion = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!webglSupported) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_25%,rgba(91,140,255,0.16),transparent_50%),radial-gradient(ellipse_at_20%_70%,rgba(155,107,255,0.12),transparent_50%)]"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-95"
    >
      <WebGLErrorBoundary>
        <Canvas
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          camera={{ position: [0, 0, 8.4], fov: 46, near: 0.1, far: 60 }}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <fog attach="fog" args={["#07080D", 9, 26]} />
          <EvolvingArchitecturalCore />
          <NeuralNetworkConstellation count={isMobile ? 28 : 54} />
          <DataStreams count={isMobile ? 160 : 420} />
          {!reducedMotion && (
            <Sparkles
              count={isMobile ? 24 : 55}
              scale={[16, 11, 10]}
              size={1.6}
              speed={0.28}
              opacity={0.4}
              color="#45E4FF"
            />
          )}
        </Canvas>
      </WebGLErrorBoundary>
      {/* Subtle atmospheric vignette for foreground typography legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(7,8,13,0.72)_100%)]" />
    </div>
  );
}

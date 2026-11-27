"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useScrollMotion } from "./ScrollStateContext";
import { useVisualSettings } from "./VisualSettingsContext";
import {
  usePrefersReducedMotion,
  useWebGLSupport,
  WebGLErrorBoundary,
} from "./WebGLErrorBoundary";

function seededNoise(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/* Custom GLSL: Morphing Holographic Architectural Core */
const CORE_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vDisplacement;

  void main() {
    vec3 pos = position;
    float wave = sin(pos.x * 3.4 + uTime * 1.15) *
                 cos(pos.y * 3.1 - uTime * 0.85) *
                 sin(pos.z * 3.6 + uTime * 0.7);
    float harmonic = sin(length(pos.xy) * 5.0 - uTime * 1.6) * 0.045;
    float disp = (wave * 0.11 + harmonic) * (0.8 + uScroll * 0.35);
    pos += normal * disp;

    vDisplacement = disp;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPos = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const CORE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorRim;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vDisplacement;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

    float mixFactor = clamp(vDisplacement * 4.2 + 0.5, 0.0, 1.0);
    vec3 base = mix(vec3(0.06, 0.08, 0.15), mix(uColorA, uColorB, mixFactor), 0.55);

    // Subtle holographic contour bands
    float band = smoothstep(0.42, 0.5, abs(fract(vDisplacement * 14.0 + uTime * 0.15) - 0.5));
    vec3 color = base + uColorRim * fresnel * 1.35 + uColorB * band * 0.16;

    gl_FragColor = vec4(color, 0.94);
  }
`;

/* Custom GLSL: Atmospheric Digital Planet with Scanlines & Fresnel Rim */
const PLANET_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vLocalPos;

  void main() {
    vLocalPos = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPos = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PLANET_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vLocalPos;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.4);

    // Architectural latitude/longitude telemetry lines
    float lat = smoothstep(0.92, 0.99, abs(sin(vLocalPos.y * 12.0 + uTime * 0.45)));
    float lon = smoothstep(0.95, 0.995, abs(sin(atan(vLocalPos.z, vLocalPos.x) * 8.0)));
    float grid = max(lat * 0.65, lon * 0.4);

    vec3 deep = vec3(0.05, 0.07, 0.14);
    vec3 violet = vec3(0.608, 0.42, 1.0);
    vec3 cyan = vec3(0.27, 0.894, 1.0);

    vec3 col = deep + violet * grid * 0.55 + mix(violet, cyan, 0.55) * fresnel * 1.25;
    gl_FragColor = vec4(col, 0.88);
  }
`;

function OrbitalDataFilaments({ reducedMotion }: { reducedMotion: boolean }) {
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);

  const curves = useMemo(() => {
    const configs = [
      { r: 2.35, tiltX: 0.45, tiltZ: 0.2, color: "#45E4FF", speed: 0.28 },
      { r: 2.7, tiltX: -0.6, tiltZ: 0.55, color: "#9B6BFF", speed: 0.22 },
      { r: 3.05, tiltX: 0.85, tiltZ: -0.35, color: "#5B8CFF", speed: 0.19 },
      { r: 2.55, tiltX: -0.2, tiltZ: -0.8, color: "#FF9B62", speed: 0.25 },
    ];

    return configs.map((cfg) => {
      const pts: THREE.Vector3[] = [];
      const segments = 56;
      const euler = new THREE.Euler(cfg.tiltX, 0, cfg.tiltZ);
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const v = new THREE.Vector3(
          Math.cos(a) * cfg.r,
          Math.sin(a * 2) * 0.22,
          Math.sin(a) * cfg.r
        ).applyEuler(euler);
        pts.push(v);
      }
      const curve = new THREE.CatmullRomCurve3(pts, true);
      return {
        curve,
        points: pts.map((p) => [p.x, p.y, p.z] as [number, number, number]),
        color: cfg.color,
        speed: cfg.speed,
      };
    });
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    curves.forEach((c, idx) => {
      const mesh = pulseRefs.current[idx];
      if (!mesh) return;
      const u = (t * c.speed + idx * 0.27) % 1;
      const pos = c.curve.getPointAt(u);
      mesh.position.copy(pos);
    });
  });

  return (
    <group>
      {curves.map((c, idx) => (
        <group key={idx}>
          <Line
            points={c.points}
            color={c.color}
            transparent
            opacity={0.22}
            lineWidth={1}
          />
          <mesh
            ref={(el) => {
              pulseRefs.current[idx] = el;
            }}
          >
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshBasicMaterial color={c.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function NeuralNetworkConstellation({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { motionRef } = useScrollMotion();
  const reducedMotion = usePrefersReducedMotion();

  const { pointsPositions, linePositions } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const r = 4.4 + seededNoise(i, 1) * 5.6;
      const theta = seededNoise(i, 2) * Math.PI * 2;
      const phi = Math.acos(2 * seededNoise(i, 3) - 1);
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) * 0.72,
          r * Math.sin(phi) * Math.sin(theta) - 2.2
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
        if (pts[i].distanceTo(pts[j]) < 3.15 && segments.length < 840) {
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

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;
    const p = motionRef.current.progress;
    groupRef.current.rotation.y += delta * 0.032;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      p * 0.95 + motionRef.current.pointerY * 0.08,
      0.04
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      -p * 3.0,
      0.05
    );
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
          opacity={0.78}
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
    const c4 = new THREE.Color("#FF9B62");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededNoise(i, 11) - 0.5) * 28;
      pos[i * 3 + 1] = (seededNoise(i, 12) - 0.5) * 19;
      pos[i * 3 + 2] = -seededNoise(i, 13) * 17 - 1;

      const pick = seededNoise(i, 14);
      const c = pick < 0.4 ? c1 : pick < 0.7 ? c2 : pick < 0.9 ? c3 : c4;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current || reducedMotion) return;
    const p = motionRef.current.progress;
    ref.current.rotation.y += delta * 0.015;
    ref.current.position.z = THREE.MathUtils.lerp(
      ref.current.position.z,
      p * 4.8,
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
        size={0.056}
        vertexColors
        transparent
        opacity={0.68}
        sizeAttenuation
      />
    </points>
  );
}

function EvolvingArchitecturalCore() {
  const heroGroup = useRef<THREE.Group>(null);
  const shaderCoreRef = useRef<THREE.ShaderMaterial>(null);
  const planetShaderRef = useRef<THREE.ShaderMaterial>(null);
  const outerRing = useRef<THREE.Mesh>(null);
  const planetGroup = useRef<THREE.Group>(null);
  const lightAccent = useRef<THREE.PointLight>(null);

  const { motionRef } = useScrollMotion();
  const reducedMotion = usePrefersReducedMotion();

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColorA: { value: new THREE.Color("#5B8CFF") },
      uColorB: { value: new THREE.Color("#9B6BFF") },
      uColorRim: { value: new THREE.Color("#45E4FF") },
    }),
    []
  );

  const planetUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const { progress: p, pointerX, pointerY } = motionRef.current;

    if (shaderCoreRef.current) {
      if (!reducedMotion) {
        shaderCoreRef.current.uniforms.uTime.value = t;
      }
      shaderCoreRef.current.uniforms.uScroll.value = p;

      const targetRim =
        p < 0.25
          ? "#45E4FF"
          : p < 0.55
            ? "#9B6BFF"
            : p < 0.8
              ? "#FF9B62"
              : "#5B8CFF";
      shaderCoreRef.current.uniforms.uColorRim.value.lerp(
        new THREE.Color(targetRim),
        0.04
      );
    }

    if (planetShaderRef.current && !reducedMotion) {
      planetShaderRef.current.uniforms.uTime.value = t;
    }

    // Subtle scroll-choreographed camera movement & pointer parallax
    const targetCamX = pointerX * 0.6 + Math.sin(p * Math.PI * 2) * 0.75;
    const targetCamY = pointerY * 0.38 - p * 1.15;
    const targetCamZ = 8.4 - Math.sin(p * Math.PI) * 1.35;
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
    state.camera.lookAt(0, -p * 0.48, -1.5);

    if (heroGroup.current) {
      const targetX =
        p < 0.16
          ? 2.25
          : p < 0.45
            ? THREE.MathUtils.lerp(2.25, -3.5, (p - 0.16) / 0.29)
            : p < 0.82
              ? THREE.MathUtils.lerp(-3.5, 3.3, (p - 0.45) / 0.37)
              : THREE.MathUtils.lerp(3.3, 0.25, (p - 0.82) / 0.18);

      const targetY =
        p < 0.16 ? 0.25 : Math.cos(p * Math.PI * 2.5) * 1.4;

      const targetScale = p < 0.16 ? 1.1 : p > 0.84 ? 0.96 : 0.76;

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
        heroGroup.current.rotation.y += delta * 0.12;
        heroGroup.current.rotation.z = Math.sin(t * 0.32) * 0.1;
      }
    }

    if (outerRing.current && !reducedMotion) {
      outerRing.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.18;
      outerRing.current.rotation.z += delta * 0.18;
    }

    if (planetGroup.current) {
      const targetPX = THREE.MathUtils.lerp(-4.9, 4.2, p);
      const targetPY = THREE.MathUtils.lerp(-3.2, 2.4, Math.sin(p * Math.PI));
      const targetPZ = -5.6 + Math.sin(p * Math.PI) * 2.3;
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
        planetGroup.current.rotation.y += delta * 0.1;
      }
    }

    if (lightAccent.current) {
      const hueShift =
        p < 0.3
          ? "#5B8CFF"
          : p < 0.6
            ? "#9B6BFF"
            : p < 0.82
              ? "#FF9B62"
              : "#45E4FF";
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
        intensity={2.8}
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

      {/* Primary Custom-Shader Architectural Centerpiece + Data Filaments */}
      <Float
        speed={reducedMotion ? 0 : 1.3}
        rotationIntensity={reducedMotion ? 0 : 0.22}
        floatIntensity={reducedMotion ? 0 : 0.38}
      >
        <group ref={heroGroup} position={[2.25, 0.25, -0.8]}>
          {/* Custom GLSL Morphing Fresnel Energy Core */}
          <mesh>
            <icosahedronGeometry args={[1.18, 28]} />
            <shaderMaterial
              ref={shaderCoreRef}
              vertexShader={CORE_VERTEX_SHADER}
              fragmentShader={CORE_FRAGMENT_SHADER}
              uniforms={coreUniforms}
              transparent
            />
          </mesh>

          {/* Outer faceted wireframe architectural geodesic */}
          <mesh scale={1.74}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#5B8CFF"
              wireframe
              transparent
              opacity={0.28}
            />
          </mesh>

          {/* Precision metallic gyroscope ring */}
          <mesh ref={outerRing} scale={2.15}>
            <torusGeometry args={[1, 0.015, 16, 120]} />
            <meshBasicMaterial color="#45E4FF" transparent opacity={0.62} />
          </mesh>

          {/* Curved 3D Orbital Data Filaments with Glowing Travelling Pulses */}
          <OrbitalDataFilaments reducedMotion={reducedMotion} />
        </group>
      </Float>

      {/* Atmospheric Custom-Shader Digital Planet */}
      <group ref={planetGroup} position={[-4.9, -3.2, -5.6]}>
        <mesh>
          <sphereGeometry args={[1.48, 36, 36]} />
          <shaderMaterial
            ref={planetShaderRef}
            vertexShader={PLANET_VERTEX_SHADER}
            fragmentShader={PLANET_FRAGMENT_SHADER}
            uniforms={planetUniforms}
            transparent
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0.32, 0]}>
          <ringGeometry args={[1.92, 2.38, 72]} />
          <meshBasicMaterial
            color="#FF9B62"
            side={THREE.DoubleSide}
            transparent
            opacity={0.24}
          />
        </mesh>
      </group>
    </>
  );
}

export default function PersistentSceneCanvas() {
  const webglSupported = useWebGLSupport();
  const reducedMotion = usePrefersReducedMotion();
  const { ecoMode } = useVisualSettings();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!webglSupported || ecoMode) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_25%,rgba(91,140,255,0.18),transparent_50%),radial-gradient(ellipse_at_20%_70%,rgba(155,107,255,0.14),transparent_50%)]"
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
          <fog attach="fog" args={["#07080D", 9, 27]} />
          <EvolvingArchitecturalCore />
          <NeuralNetworkConstellation count={isMobile ? 28 : 56} />
          <DataStreams count={isMobile ? 160 : 440} />
          {!reducedMotion && (
            <Sparkles
              count={isMobile ? 24 : 58}
              scale={[16, 11, 10]}
              size={1.7}
              speed={0.28}
              opacity={0.44}
              color="#45E4FF"
            />
          )}
        </Canvas>
      </WebGLErrorBoundary>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(7,8,13,0.72)_100%)]" />
    </div>
  );
}

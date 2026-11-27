"use client";

import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import {
  CATEGORY_BY_ID,
  TECH_CATEGORIES,
  type TechCategoryId,
  type TechnologyItem,
} from "@/data/technologies";
import {
  usePrefersReducedMotion,
  useWebGLSupport,
  WebGLErrorBoundary,
} from "./WebGLErrorBoundary";

interface GalaxyNode3D {
  tech: TechnologyItem;
  position: [number, number, number];
  color: string;
}

function GalaxyClusterScene({
  items,
  selectedTech,
  activeCategory,
  onSelectTech,
  onSelectCategory,
}: {
  items: TechnologyItem[];
  selectedTech: TechnologyItem;
  activeCategory: TechCategoryId | "all";
  onSelectTech: (tech: TechnologyItem) => void;
  onSelectCategory: (cat: TechCategoryId) => void;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const visibleIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  const nodes3D = useMemo<GalaxyNode3D[]>(() => {
    const byCategory = new Map<TechCategoryId, TechnologyItem[]>();
    items.forEach((t) => {
      const list = byCategory.get(t.category) ?? [];
      list.push(t);
      byCategory.set(t.category, list);
    });

    const result: GalaxyNode3D[] = [];
    byCategory.forEach((catItems, catId) => {
      const meta = CATEGORY_BY_ID.get(catId);
      if (!meta) return;
      const [cx, cy, cz] = meta.orbitCenter;
      const total = catItems.length;
      catItems.forEach((tech, idx) => {
        const ring = idx % 2 === 0 ? 1.05 : 1.58;
        const angle = (idx / Math.max(1, total)) * Math.PI * 2;
        const elevation = ((idx % 5) - 2) * 0.28;
        result.push({
          tech,
          color: meta.color,
          position: [
            cx + Math.cos(angle) * ring,
            cy + elevation,
            cz + Math.sin(angle) * ring,
          ],
        });
      });
    });
    return result;
  }, [items]);

  const nodePosById = useMemo(
    () => new Map(nodes3D.map((n) => [n.tech.id, n.position])),
    [nodes3D]
  );

  // Inter-planet constellation bridge lines
  const planetLinks = useMemo(() => {
    const pairs: [[number, number, number], [number, number, number]][] = [];
    for (let i = 0; i < TECH_CATEGORIES.length; i++) {
      const next = (i + 1) % TECH_CATEGORIES.length;
      pairs.push([
        TECH_CATEGORIES[i].orbitCenter,
        TECH_CATEGORIES[next].orbitCenter,
      ]);
      if (i < 4) {
        pairs.push([
          TECH_CATEGORIES[i].orbitCenter,
          TECH_CATEGORIES[i + 4].orbitCenter,
        ]);
      }
    }
    return pairs;
  }, []);

  // Related technology connection lines for the selected node
  const selectedLinks = useMemo(() => {
    const origin = nodePosById.get(selectedTech.id);
    if (!origin) return [];
    return selectedTech.relatedIds
      .map((rid) => nodePosById.get(rid))
      .filter(Boolean)
      .map((dest) => [origin, dest!] as [[number, number, number], [number, number, number]]);
  }, [nodePosById, selectedTech]);

  useFrame((_, delta) => {
    if (!rootRef.current || reducedMotion) return;
    rootRef.current.rotation.y += delta * 0.045;
  });

  return (
    <group ref={rootRef}>
      {/* Constellation bridges between category planets */}
      {planetLinks.map((pair, idx) => (
        <Line
          key={`bridge-${idx}`}
          points={pair}
          color="#5B8CFF"
          transparent
          opacity={0.14}
          lineWidth={1}
        />
      ))}

      {/* Active selected technology relationship beams */}
      {selectedLinks.map((pair, idx) => (
        <Line
          key={`rel-${idx}`}
          points={pair}
          color="#45E4FF"
          transparent
          opacity={0.75}
          lineWidth={1.6}
        />
      ))}

      {/* Category Planets */}
      {TECH_CATEGORIES.map((cat) => {
        const dimmed = activeCategory !== "all" && activeCategory !== cat.id;
        return (
          <group key={cat.id} position={cat.orbitCenter}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(cat.id);
              }}
            >
              <sphereGeometry args={[0.42, 24, 24]} />
              <meshStandardMaterial
                color="#121626"
                metalness={0.75}
                roughness={0.28}
                emissive={cat.color}
                emissiveIntensity={dimmed ? 0.15 : 0.72}
                transparent
                opacity={dimmed ? 0.35 : 0.95}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2.2, 0.25, 0]}>
              <ringGeometry args={[0.58, 0.64, 48]} />
              <meshBasicMaterial
                color={cat.color}
                side={THREE.DoubleSide}
                transparent
                opacity={dimmed ? 0.15 : 0.5}
              />
            </mesh>
            <Html
              position={[0, 0.72, 0]}
              center
              distanceFactor={12}
              style={{ pointerEvents: "none" }}
            >
              <div
                className="whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest backdrop-blur-md"
                style={{
                  borderColor: `${cat.color}66`,
                  backgroundColor: "rgba(7, 8, 13, 0.82)",
                  color: dimmed ? "#666C85" : "#F5F7FF",
                }}
              >
                {cat.shortLabel}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Orbiting Technology Nodes */}
      {nodes3D.map(({ tech, position, color }) => {
        const isSelected = tech.id === selectedTech.id;
        const isHovered = tech.id === hoveredId;
        const isRelated = selectedTech.relatedIds.includes(tech.id);
        const radius = isSelected ? 0.19 : isRelated ? 0.14 : 0.105;

        return (
          <group key={tech.id} position={position}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectTech(tech);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredId(tech.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHoveredId((prev) => (prev === tech.id ? null : prev));
                document.body.style.cursor = "auto";
              }}
            >
              <sphereGeometry args={[radius, 14, 14]} />
              <meshStandardMaterial
                color={isSelected ? "#FFFFFF" : color}
                emissive={isSelected ? "#45E4FF" : color}
                emissiveIntensity={isSelected ? 1.5 : isHovered || isRelated ? 0.95 : 0.45}
                roughness={0.25}
                metalness={0.4}
              />
            </mesh>

            {(isSelected || isHovered) && visibleIds.has(tech.id) && (
              <Html
                position={[0, 0.34, 0]}
                center
                distanceFactor={11}
                style={{ pointerEvents: "none" }}
              >
                <div className="whitespace-nowrap rounded-md border border-[#45E4FF]/60 bg-[#07080D]/95 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#F5F7FF] shadow-xl">
                  {tech.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function TechGalaxyCanvas({
  items,
  selectedTech,
  activeCategory,
  onSelectTech,
  onSelectCategory,
}: {
  items: TechnologyItem[];
  selectedTech: TechnologyItem;
  activeCategory: TechCategoryId | "all";
  onSelectTech: (tech: TechnologyItem) => void;
  onSelectCategory: (cat: TechCategoryId) => void;
}) {
  const webglSupported = useWebGLSupport();

  if (!webglSupported) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
        <p className="font-display text-lg font-semibold text-[#F5F7FF]">
          3D Galaxy View Unavailable on This Device
        </p>
        <p className="mt-2 max-w-md text-sm text-[#969BB0]">
          Switch to the Matrix View tab above to browse, search, and inspect all{" "}
          {items.length} technologies.
        </p>
      </div>
    );
  }

  return (
    <WebGLErrorBoundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 2.2, 12.6], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.42} />
        <pointLight position={[8, 8, 8]} intensity={1.8} color="#5B8CFF" />
        <pointLight position={[-8, -6, 4]} intensity={1.4} color="#9B6BFF" />
        <Sparkles
          count={70}
          scale={[18, 12, 12]}
          size={1.4}
          speed={0.2}
          opacity={0.35}
          color="#45E4FF"
        />
        <GalaxyClusterScene
          items={items}
          selectedTech={selectedTech}
          activeCategory={activeCategory}
          onSelectTech={onSelectTech}
          onSelectCategory={onSelectCategory}
        />
        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={18}
          dampingFactor={0.07}
        />
      </Canvas>
    </WebGLErrorBoundary>
  );
}

"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  CloudCog,
  Layers,
  Network,
  Server,
} from "lucide-react";
import {
  ENGINEERING_CAPABILITIES,
  type EngineeringCapability,
} from "@/data/capabilities";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { cn } from "@/lib/utils";

const CapabilityScene = dynamic(
  () => import("@/components/three/CapabilityScene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-[#969BB0]">
        Initializing 3D visual...
      </div>
    ),
  }
);

const ICON_MAP = {
  Layers,
  BrainCircuit,
  Server,
  CloudCog,
  Building2,
  Network,
};

function CardBlueprintVisual({
  geometry,
  accent,
  isSelected,
}: {
  geometry: EngineeringCapability["geometry"];
  accent: string;
  isSelected: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn(
        "h-16 w-16 transition-transform duration-500",
        isSelected ? "scale-110" : "group-hover:scale-105 group-hover:rotate-6"
      )}
      aria-hidden="true"
    >
      <circle
        cx="60"
        cy="60"
        r="46"
        fill="none"
        stroke={accent}
        strokeOpacity="0.22"
        strokeDasharray="3 5"
      />
      {geometry === "octahedron" && (
        <g stroke={accent} fill="none" strokeWidth="1.4">
          <polygon points="60,16 96,60 60,104 24,60" fill={`${accent}14`} />
          <line x1="60" y1="16" x2="60" y2="104" strokeOpacity="0.55" />
          <line x1="24" y1="60" x2="96" y2="60" strokeOpacity="0.55" />
        </g>
      )}
      {geometry === "torusKnot" && (
        <g stroke={accent} fill="none" strokeWidth="1.5">
          <ellipse cx="60" cy="60" rx="36" ry="18" transform="rotate(30 60 60)" />
          <ellipse cx="60" cy="60" rx="36" ry="18" transform="rotate(-30 60 60)" />
          <ellipse cx="60" cy="60" rx="36" ry="18" transform="rotate(90 60 60)" />
          <circle cx="60" cy="60" r="8" fill={accent} fillOpacity="0.35" />
        </g>
      )}
      {geometry === "icosahedron" && (
        <g stroke={accent} fill="none" strokeWidth="1.4">
          <polygon
            points="60,18 96,39 96,81 60,102 24,81 24,39"
            fill={`${accent}12`}
          />
          <polygon points="60,34 82,72 38,72" strokeOpacity="0.7" />
          <line x1="60" y1="18" x2="60" y2="34" />
          <line x1="96" y1="81" x2="82" y2="72" />
          <line x1="24" y1="81" x2="38" y2="72" />
        </g>
      )}
      {geometry === "dodecahedron" && (
        <g stroke={accent} fill="none" strokeWidth="1.4">
          <polygon
            points="60,20 92,42 80,82 40,82 28,42"
            fill={`${accent}14`}
          />
          <ellipse
            cx="60"
            cy="60"
            rx="44"
            ry="14"
            transform="rotate(-24 60 60)"
            strokeOpacity="0.65"
          />
        </g>
      )}
      {geometry === "boxGrid" && (
        <g stroke={accent} fill={`${accent}14`} strokeWidth="1.4">
          <rect x="28" y="28" width="26" height="26" rx="4" />
          <rect x="66" y="28" width="26" height="26" rx="4" />
          <rect x="28" y="66" width="26" height="26" rx="4" />
          <rect x="66" y="66" width="26" height="26" rx="4" />
          <line x1="54" y1="41" x2="66" y2="41" />
          <line x1="54" y1="79" x2="66" y2="79" />
          <line x1="41" y1="54" x2="41" y2="66" />
          <line x1="79" y1="54" x2="79" y2="66" />
        </g>
      )}
      {geometry === "ringCore" && (
        <g stroke={accent} fill="none" strokeWidth="1.4">
          <circle cx="60" cy="60" r="14" fill={`${accent}28`} />
          <circle cx="60" cy="60" r="28" strokeOpacity="0.7" />
          <circle cx="60" cy="60" r="42" strokeOpacity="0.4" />
          <circle cx="88" cy="60" r="3" fill={accent} />
          <circle cx="60" cy="18" r="3" fill={accent} />
        </g>
      )}
    </svg>
  );
}

export function CapabilitiesSection() {
  const [selectedId, setSelectedId] = useState(ENGINEERING_CAPABILITIES[0].id);
  const selected =
    ENGINEERING_CAPABILITIES.find((c) => c.id === selectedId) ??
    ENGINEERING_CAPABILITIES[0];

  return (
    <section id="capabilities" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="03"
          eyebrow="Engineering Capabilities"
          title="Six Core Disciplines, One Cohesive Architecture"
          description="Select any capability to inspect its interactive 3D visual, engineering deliverables, and architectural focus."
        />

        {/* Interactive 3D Selected Capability Stage */}
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-panel mb-8 grid grid-cols-1 gap-6 rounded-3xl p-6 sm:p-8 lg:grid-cols-12"
        >
          {/* Live Interactive 3D Viewport (single shared WebGL context for crisp 60 FPS) */}
          <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#090B13] sm:h-72 lg:col-span-5 lg:h-auto lg:min-h-[300px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${selected.accent}1E, transparent 68%)`,
              }}
            />
            <div className="relative z-10 h-full w-full" data-cursor="ORBIT">
              <CapabilityScene
                geometry={selected.geometry}
                accent={selected.accent}
              />
            </div>
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#969BB0]">
              <span style={{ color: selected.accent }}>
                {`CAP-${selected.index} // INTERACTIVE 3D`}
              </span>
              <span>Drag to Orbit</span>
            </div>
          </div>

          {/* Architectural Deep-Dive */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-xs uppercase tracking-[0.22em]"
                  style={{ color: selected.accent }}
                >
                  Discipline {selected.index}
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold text-[#F5F7FF] sm:text-3xl">
                {selected.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-[#C7D4FF]">
                {selected.tagline}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#969BB0] sm:text-base">
                {selected.deepDive}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {selected.deliverables.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: selected.accent }}
                    />
                    <span className="text-xs leading-relaxed text-[#D7DDF2]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#969BB0]">
                Architectural Focus:{" "}
                <span className="text-[#F5F7FF]">
                  {selected.architecturalFocus}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-[#10121B] px-3 py-1 font-mono text-[11px] text-[#F5F7FF]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Six Premium Interactive Capability Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ENGINEERING_CAPABILITIES.map((cap, idx) => {
            const Icon = ICON_MAP[cap.iconName];
            const isSelected = cap.id === selected.id;

            return (
              <motion.button
                key={cap.id}
                type="button"
                onClick={() => setSelectedId(cap.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                data-cursor="INSPECT"
                aria-pressed={isSelected}
                className={cn(
                  "group glass-panel glass-panel-hover relative flex cursor-pointer flex-col justify-between rounded-2xl p-6 text-left",
                  isSelected &&
                    "border-[#5B8CFF]/60 bg-[#14192B]/90 shadow-[0_20px_60px_-22px_rgba(91,140,255,0.32)]"
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0B0E17] transition-transform duration-300 group-hover:scale-105"
                      style={{
                        boxShadow: isSelected
                          ? `0 0 24px -6px ${cap.accent}`
                          : undefined,
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: cap.accent }} />
                    </div>
                    <CardBlueprintVisual
                      geometry={cap.geometry}
                      accent={cap.accent}
                      isSelected={isSelected}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.2em]"
                      style={{ color: cap.accent }}
                    >
                      {`${cap.index} //`}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isSelected
                          ? "translate-x-0.5 -translate-y-0.5 text-[#45E4FF]"
                          : "text-[#969BB0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F5F7FF]"
                      )}
                    />
                  </div>

                  <h3 className="mt-2 font-display text-xl font-bold text-[#F5F7FF]">
                    {cap.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#969BB0]">
                    {cap.description}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.07] pt-4">
                  {cap.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-[#C7D4FF]"
                    >
                      {tech}
                    </span>
                  ))}
                  {cap.technologies.length > 5 && (
                    <span className="rounded-md px-1.5 py-0.5 font-mono text-[10px] text-[#969BB0]">
                      +{cap.technologies.length - 5}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

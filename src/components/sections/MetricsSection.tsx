"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { PROFILE } from "@/config/profile";
import {
  PROFICIENCY_META,
  TECH_CATEGORIES,
  TECHNOLOGIES,
} from "@/data/technologies";
import { PROJECTS } from "@/data/projects";
import { ARCHITECTURE_BLUEPRINTS } from "@/data/architectures";
import { ENGINEERING_CAPABILITIES } from "@/data/capabilities";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SpotlightCard } from "@/components/ui/spotlight-card";

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 900;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function MetricsSection() {
  const verifiedMetrics = [
    {
      label: "Years of Engineering Experience",
      value: PROFILE.yearsOfExperience,
      suffix: " yrs",
      accent: "#5B8CFF",
      detail: "Full-stack, enterprise backend, cloud, and AI systems progression",
    },
    {
      label: "Mapped Technologies",
      value: TECHNOLOGIES.length,
      suffix: "",
      accent: "#45E4FF",
      detail: `Across ${TECH_CATEGORIES.length} interactive categories with explicit proficiency tiers`,
    },
    {
      label: "Architectural Project Blueprints",
      value: PROJECTS.length,
      suffix: "",
      accent: "#9B6BFF",
      detail: "Original AI, distributed, cloud, and full-stack case-study designs",
    },
    {
      label: "Interactive System Topologies",
      value: ARCHITECTURE_BLUEPRINTS.length,
      suffix: "",
      accent: "#FF9B62",
      detail: "Inspectable multi-node architectures in the System Architecture Lab",
    },
    {
      label: "Core Engineering Disciplines",
      value: ENGINEERING_CAPABILITIES.length,
      suffix: "",
      accent: "#34D399",
      detail: "Frontend, AI Agents, Backend, Cloud/DevOps, Enterprise, System Design",
    },
    {
      label: "Technology Ecosystem Domains",
      value: TECH_CATEGORIES.length,
      suffix: "",
      accent: "#FBBF24",
      detail: "Connected planetary clusters spanning pixel to Kubernetes runtime",
    },
  ];

  const productionCount = TECHNOLOGIES.filter(
    (t) => t.proficiency === "production"
  ).length;
  const workingCount = TECHNOLOGIES.filter(
    (t) => t.proficiency === "working"
  ).length;
  const exploredCount = TECHNOLOGIES.filter(
    (t) => t.proficiency === "explored"
  ).length;

  return (
    <section id="metrics" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="08"
          eyebrow="Engineering Metrics // Verified Inventory"
          title="Grounded Engineering Depth — Zero Fabricated Stats"
          description="Every counter below reflects verifiable structured data from this portfolio's engineering inventory rather than invented uptime claims or unverified business numbers."
        />

        {/* Animated Counters Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {verifiedMetrics.map((metric) => (
            <SpotlightCard
              key={metric.label}
              spotlightColor={`${metric.accent}24`}
              className="p-6"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl"
                style={{ backgroundColor: metric.accent }}
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#969BB0]">
                {metric.label}
              </p>
              <p
                className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl"
                style={{ color: metric.accent }}
              >
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[#969BB0]">
                {metric.detail}
              </p>
            </SpotlightCard>
          ))}
        </div>

        {/* Technology Domain & Proficiency Distribution */}
        <div className="glass-panel mt-8 grid grid-cols-1 gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#45E4FF]">
              Ecosystem Coverage By Domain
            </p>
            <div className="mt-5 space-y-3.5">
              {TECH_CATEGORIES.map((cat) => {
                const count = TECHNOLOGIES.filter(
                  (t) => t.category === cat.id
                ).length;
                const pct = Math.round((count / TECHNOLOGIES.length) * 100);
                return (
                  <div key={cat.id}>
                    <div className="mb-1 flex items-center justify-between font-mono text-xs">
                      <span className="text-[#F5F7FF]">{cat.label}</span>
                      <span className="text-[#969BB0]">
                        {count} technologies ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(8, pct * 3.5)}%`,
                          maxWidth: "100%",
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-6 lg:col-span-5">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#34D399]">
                <ShieldCheck className="h-4 w-4" />
                Transparent Proficiency Split
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#969BB0]">
                Not every technology is claimed as production mastery. Each node
                in the Technology Galaxy is honestly tiered:
              </p>

              <div className="mt-5 space-y-3">
                {[
                  { tier: "production" as const, count: productionCount },
                  { tier: "working" as const, count: workingCount },
                  { tier: "explored" as const, count: exploredCount },
                ].map(({ tier, count }) => {
                  const meta = PROFICIENCY_META[tier];
                  return (
                    <div
                      key={tier}
                      className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3"
                    >
                      <div>
                        <p
                          className="font-mono text-xs font-semibold"
                          style={{ color: meta.color }}
                        >
                          {meta.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#969BB0]">
                          {meta.shortLabel}
                        </p>
                      </div>
                      <span className="font-display text-2xl font-bold text-[#F5F7FF]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-5 border-t border-white/10 pt-3 font-mono text-[10px] text-[#969BB0]">
              Calculated dynamically from typed portfolio datasets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

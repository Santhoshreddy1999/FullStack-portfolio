"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  GitCommitHorizontal,
  Layers,
  List,
  MapPin,
} from "lucide-react";
import { PROFILE } from "@/config/profile";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function JourneySection() {
  const milestones = PROFILE.experienceTimeline;
  const [activeIndex, setActiveIndex] = useState(milestones.length - 1);
  const [layoutMode, setLayoutMode] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  const current = milestones[activeIndex] ?? milestones[0];

  return (
    <section id="journey" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="07"
            eyebrow="Engineering Journey"
            title="Five Years of Architectural Growth"
            description="A transparent progression from full-stack foundations to enterprise scale, cloud-native distributed systems, and agentic AI architecture. Organization and date slots are cleanly parameterized in src/config/profile.ts."
            className="mb-8 lg:mb-12"
          />

          <div className="mb-10 inline-flex self-start rounded-xl border border-white/10 bg-[#0E1019] p-1 lg:mb-12">
            <button
              type="button"
              onClick={() => setLayoutMode("horizontal")}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors",
                layoutMode === "horizontal"
                  ? "bg-[#5B8CFF]/20 text-[#F5F7FF]"
                  : "text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              <GitCommitHorizontal className="h-3.5 w-3.5 text-[#45E4FF]" />
              Horizontal Rail
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("vertical")}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors",
                layoutMode === "vertical"
                  ? "bg-[#5B8CFF]/20 text-[#F5F7FF]"
                  : "text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              <List className="h-3.5 w-3.5 text-[#5B8CFF]" />
              Vertical Timeline
            </button>
          </div>
        </div>

        {/* Horizontal Interactive Career Rail */}
        {layoutMode === "horizontal" && (
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-5 sm:p-6">
              <div className="relative">
                {/* Connecting Track */}
                <div
                  aria-hidden="true"
                  className="absolute left-6 right-6 top-6 hidden h-px bg-white/10 md:block"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-6 top-6 hidden h-[2px] bg-gradient-to-r from-[#5B8CFF] via-[#9B6BFF] to-[#45E4FF] transition-all duration-500 md:block"
                  style={{
                    width: `calc(${(activeIndex / (milestones.length - 1)) * 100}% - 48px)`,
                  }}
                />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                  {milestones.map((item, idx) => {
                    const active = idx === activeIndex;
                    const passed = idx <= activeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                          "group relative flex cursor-pointer flex-col items-start rounded-xl border p-4 text-left transition-all",
                          active
                            ? "border-[#5B8CFF]/60 bg-[#141A2E]"
                            : "border-white/[0.06] bg-[#0B0E17]/75 hover:border-white/20"
                        )}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-mono",
                              active
                                ? "border-[#45E4FF] bg-[#45E4FF]/20 text-[#45E4FF]"
                                : passed
                                  ? "border-[#5B8CFF]/60 bg-[#5B8CFF]/20 text-[#8EB0FF]"
                                  : "border-white/15 bg-[#07080D] text-[#969BB0]"
                            )}
                          >
                            {idx + 1}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[#969BB0]">
                            {item.yearRange}
                          </span>
                        </div>
                        <p className="mt-3 font-display text-sm font-semibold text-[#F5F7FF]">
                          {item.phase.split("/")[1]?.trim() ?? item.phase}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[11px] text-[#969BB0]">
                          {item.focusAreas[0]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Milestone Detail Stage */}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="glass-panel rounded-3xl p-6 sm:p-8"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="cyan">{current.phase}</Badge>
                    <Badge variant="blue">{current.yearRange}</Badge>
                    {current.isPlaceholder && (
                      <Badge variant="muted">Editable Slot</Badge>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold text-[#F5F7FF] sm:text-3xl">
                    {current.roleTitle}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-4 font-mono text-xs text-[#969BB0]">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-[#5B8CFF]" />
                      {current.organization}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#45E4FF]" />
                      {current.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={activeIndex === 0}
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    aria-label="Previous engineering stage"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={activeIndex === milestones.length - 1}
                    onClick={() =>
                      setActiveIndex((i) =>
                        Math.min(milestones.length - 1, i + 1)
                      )
                    }
                    aria-label="Next engineering stage"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-5 lg:col-span-7">
                  <p className="text-base leading-relaxed text-[#D7DDF2]">
                    {current.summary}
                  </p>

                  <div className="rounded-2xl border border-[#5B8CFF]/25 bg-[#5B8CFF]/8 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#45E4FF]">
                      Architectural Growth Milestone
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#F5F7FF]">
                      {current.architecturalGrowth}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 lg:col-span-5">
                  <div>
                    <p className="mb-2.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#969BB0]">
                      <Layers className="h-3.5 w-3.5 text-[#9B6BFF]" />
                      Focus Areas
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {current.focusAreas.map((area) => (
                        <div
                          key={area}
                          className="rounded-lg border border-white/[0.08] bg-[#0B0E17] px-3 py-2 text-xs text-[#C7D4FF]"
                        >
                          {area}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#969BB0]">
                      Primary Technologies
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {current.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-[#F5F7FF]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Vertical Editorial Career Timeline */}
        {layoutMode === "vertical" && (
          <div className="relative pl-6 sm:pl-10">
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-2 top-2 w-px bg-gradient-to-b from-[#5B8CFF] via-[#9B6BFF] to-[#45E4FF] sm:left-4"
            />
            <div className="space-y-6">
              {milestones.map((item, idx) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className="glass-panel relative rounded-2xl p-6"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-[22px] top-7 h-3 w-3 rounded-full border-2 border-[#45E4FF] bg-[#07080D] sm:-left-[30px]"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="cyan">{item.phase}</Badge>
                    <Badge variant="blue">{item.yearRange}</Badge>
                    {item.isPlaceholder && (
                      <Badge variant="muted">Editable in profile.ts</Badge>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-[#F5F7FF]">
                    {item.roleTitle}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-[#969BB0]">
                    {item.organization} · {item.location}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#D7DDF2]">
                    {item.summary}
                  </p>
                  <p className="mt-3 border-l-2 border-[#5B8CFF]/50 pl-3 text-xs text-[#C7D4FF]">
                    {item.architecturalGrowth}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-[#0B0E17] px-2.5 py-1 font-mono text-[11px] text-[#C7D4FF]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

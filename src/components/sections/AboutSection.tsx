"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera, Compass, MapPin, ShieldCheck } from "lucide-react";
import { PROFILE } from "@/config/profile";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useScrollMotion } from "@/components/three/ScrollStateContext";
import { Badge } from "@/components/ui/badge";

function PortraitFrame() {
  const hasPhoto = Boolean(PROFILE.photo.src);

  return (
    <div className="relative">
      {/* Studio rim-light frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-[28px] bg-gradient-to-br from-[#5B8CFF]/28 via-[#9B6BFF]/16 to-[#45E4FF]/24 blur-xl opacity-70"
      />

      <div className="glass-panel relative overflow-hidden rounded-3xl p-3">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0A0D16]">
          {hasPhoto && PROFILE.photo.src ? (
            <>
              <Image
                src={PROFILE.photo.src}
                alt={PROFILE.photo.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
                style={{ objectPosition: PROFILE.photo.objectPosition }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07080D]/80 via-transparent to-[#5B8CFF]/10" />
            </>
          ) : (
            /* Architectural Editorial Portrait Placeholder (Never fabricates a fake human face) */
            <div className="relative flex h-full w-full flex-col justify-between p-6">
              {/* Studio directional lighting gradient */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(91,140,255,0.22),transparent_52%),radial-gradient(circle_at_80%_75%,rgba(155,107,255,0.18),transparent_48%)]"
              />
              <div
                aria-hidden="true"
                className="bg-engineering-grid pointer-events-none absolute inset-0 opacity-65"
              />

              {/* Top camera framing marks */}
              <div className="relative z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#969BB0]">
                <span className="inline-flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-[#45E4FF]" />
                  Portrait Slot
                </span>
                <span>4:5 Editorial</span>
              </div>

              {/* Center geometric silhouette & monogram emblem */}
              <div className="relative z-10 mx-auto my-auto flex flex-col items-center text-center">
                <div className="relative flex h-36 w-36 items-center justify-center">
                  <svg
                    viewBox="0 0 160 160"
                    className="h-full w-full"
                    aria-hidden="true"
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="72"
                      fill="none"
                      stroke="rgba(91,140,255,0.35)"
                      strokeWidth="1"
                      strokeDasharray="4 6"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="56"
                      fill="none"
                      stroke="rgba(69,228,255,0.45)"
                      strokeWidth="1.2"
                    />
                    <polygon
                      points="80,18 134,49 134,111 80,142 26,111 26,49"
                      fill="rgba(21,24,36,0.75)"
                      stroke="rgba(155,107,255,0.55)"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <span className="absolute font-display text-4xl font-bold tracking-[0.16em] text-gradient-brand">
                    {PROFILE.monogram}
                  </span>
                </div>

                <p className="mt-5 font-display text-lg font-semibold text-[#F5F7FF]">
                  {PROFILE.name}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#45E4FF]">
                  5 Years · Full Stack &amp; AI Systems
                </p>
              </div>

              {/* Clean photo configuration guide */}
              <div className="relative z-10 rounded-xl border border-white/10 bg-[#07080D]/80 p-3.5 backdrop-blur-md">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#45E4FF]">
                  Add Your Real Photograph
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#969BB0]">
                  Place your portrait in{" "}
                  <code className="text-[#F5F7FF]">public/images/profile.jpg</code>{" "}
                  and set{" "}
                  <code className="text-[#F5F7FF]">photo.src</code> in{" "}
                  <code className="text-[#F5F7FF]">src/config/profile.ts</code>.
                </p>
              </div>
            </div>
          )}

          {/* Corner architectural crosshairs */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[#45E4FF]/60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[#45E4FF]/60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#45E4FF]/60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#45E4FF]/60"
          />
        </div>

        {/* Metadata bar under frame */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 py-1 font-mono text-[11px] text-[#969BB0]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#5B8CFF]" />
            {PROFILE.location}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#45E4FF]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Config
          </span>
        </div>
      </div>
    </div>
  );
}

export function AboutSection() {
  const { scrollToSection } = useScrollMotion();

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="02"
          eyebrow={PROFILE.about.eyebrow}
          title="Engineering Depth Across Every Layer of the Stack"
          description={PROFILE.supportingStatement}
        />

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Portrait Column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5"
          >
            <PortraitFrame />
          </motion.div>

          {/* Editorial Bio + Philosophy Column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="space-y-8 lg:col-span-7"
          >
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="blue">
                  {PROFILE.yearsOfExperience} Years Professional Experience
                </Badge>
                <Badge variant="violet">AI &amp; Agentic Specialization</Badge>
                <Badge variant="cyan">Cloud &amp; Enterprise Scale</Badge>
              </div>

              <h3 className="font-display text-2xl font-semibold leading-snug text-[#F5F7FF] sm:text-3xl">
                {PROFILE.about.lead}
              </h3>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#969BB0] sm:text-base">
                {PROFILE.about.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Engineering Philosophy */}
            <div>
              <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#45E4FF]">
                <Compass className="h-4 w-4" />
                {PROFILE.about.philosophy.title}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {PROFILE.about.philosophy.principles.map((item, idx) => (
                  <div
                    key={item.label}
                    className="glass-panel glass-panel-hover rounded-xl p-5"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#5B8CFF]">
                      Principle 0{idx + 1}
                    </p>
                    <h4 className="mt-1.5 font-display text-base font-semibold text-[#F5F7FF]">
                      {item.label}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-[#969BB0] sm:text-sm">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Growth Trajectory Strip */}
            <div className="glass-panel rounded-2xl p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#969BB0]">
                  5-Year Engineering Progression
                </span>
                <button
                  type="button"
                  onClick={() => scrollToSection("journey")}
                  className="inline-flex cursor-pointer items-center gap-1 font-mono text-xs text-[#45E4FF] hover:underline"
                >
                  Full Timeline
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {PROFILE.experienceTimeline.map((stage) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => scrollToSection("journey")}
                    className="group cursor-pointer rounded-xl border border-white/[0.08] bg-[#0B0D14]/80 p-3 text-left transition-colors hover:border-[#5B8CFF]/45"
                  >
                    <span className="font-mono text-[10px] text-[#5B8CFF]">
                      {stage.yearRange}
                    </span>
                    <p className="mt-1 font-display text-xs font-semibold text-[#F5F7FF] group-hover:text-[#45E4FF]">
                      {stage.phase.split("/")[1]?.trim() ?? stage.phase}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

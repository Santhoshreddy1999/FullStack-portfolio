"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Cpu,
  Download,
  Mail,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useScrollMotion } from "@/components/three/ScrollStateContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FLOATING_LABELS = [
  { label: "LangGraph · MCP", x: "6%", y: "14%", accent: "#9B6BFF", delay: 0 },
  { label: "Next.js · Three.js", x: "58%", y: "8%", accent: "#5B8CFF", delay: 0.4 },
  { label: "Spring Boot · Kafka", x: "66%", y: "48%", accent: "#45E4FF", delay: 0.8 },
  { label: "Kubernetes · Azure", x: "8%", y: "66%", accent: "#FF9B62", delay: 1.2 },
];

const TELEMETRY_EVENTS = [
  {
    node: "AGENT-ORCHESTRATOR",
    status: "OK",
    detail: "LangGraph cyclic plan verified · MCP sandbox ready",
    color: "#9B6BFF",
  },
  {
    node: "HYBRID-RAG-INDEX",
    status: "SYNC",
    detail: "Qdrant HNSW + BM25 reranker · ACL pre-filter active",
    color: "#45E4FF",
  },
  {
    node: "EVENT-MESH",
    status: "LIVE",
    detail: "Spring Boot outbox → Kafka partitions · DLQ healthy",
    color: "#5B8CFF",
  },
  {
    node: "CLOUD-RUNTIME",
    status: "READY",
    detail: "AKS pods · Helm rollout · Prometheus SLO green",
    color: "#FF9B62",
  },
];

export function HeroSection() {
  const { profile, setStudioOpen } = useProfile();
  const { scrollToSection } = useScrollMotion();
  const [activeTick, setActiveTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTick((prev) => (prev + 1) % TELEMETRY_EVENTS.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16 sm:pt-28"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        {/* Left editorial typography column */}
        <div className="relative z-10 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-6 flex flex-wrap items-center gap-2.5"
          >
            <Badge variant="cyan" className="py-1 px-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#45E4FF] animate-pulse" />
              {profile.availability.label}
            </Badge>
            <Badge variant="muted" className="py-1 px-3">
              {profile.yearsOfExperience} Years Engineering Experience
            </Badge>
          </motion.div>

          {/* Animated Name Typography */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mb-3 flex items-center gap-3"
          >
            <span className="font-mono text-xs uppercase tracking-[0.26em] text-[#45E4FF]">
              01 //
            </span>
            <span className="font-display text-lg font-bold tracking-[0.22em] text-[#F5F7FF] sm:text-xl">
              {profile.name}
            </span>
            {profile.isIdentityPlaceholder && (
              <button
                type="button"
                onClick={() => setStudioOpen(true)}
                className="hidden cursor-pointer rounded border border-[#9B6BFF]/35 bg-[#9B6BFF]/10 px-2 py-0.5 font-mono text-[10px] text-[#D2BAFF] transition-colors hover:border-[#45E4FF] hover:text-[#F5F7FF] sm:inline-block"
              >
                Personalize Live
              </button>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-[#969BB0] sm:text-sm"
          >
            {profile.role}
          </motion.p>

          {/* Cinematic Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl font-bold leading-[1.04] tracking-tight text-[#F5F7FF] sm:text-5xl lg:text-[3.75rem]"
          >
            ENGINEERING THE{" "}
            <span className="text-gradient-brand">FUTURE</span>, ONE SYSTEM AT A
            TIME.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-[#969BB0] sm:text-lg"
          >
            {profile.heroSupportingCopy}
          </motion.p>

          {/* Core Positioning Sub-banner */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="mt-4 border-l-2 border-[#5B8CFF]/60 pl-4 font-mono text-xs tracking-wider text-[#C7D4FF] sm:text-[13px]"
          >
            {profile.brandHeadline}
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => scrollToSection("projects")}
              data-cursor="EXPLORE"
            >
              View 15 Projects
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection("ai-lab")}
              data-cursor="AI LAB"
            >
              <Sparkles className="h-4 w-4 text-[#9B6BFF]" />
              Try AI Lab
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection("contact")}
              data-cursor="CONTACT"
            >
              <Mail className="h-4 w-4 text-[#5B8CFF]" />
              Contact Me
            </Button>

            <Button variant="outline" size="lg" asChild>
              <a
                href={profile.resume.pdfPath}
                download={profile.resume.downloadFilename}
                data-cursor="PDF"
              >
                <Download className="h-4 w-4 text-[#45E4FF]" />
                Resume PDF
              </a>
            </Button>
          </motion.div>

          {/* Quick domain pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.52 }}
            className="mt-9 flex flex-wrap gap-2"
          >
            {profile.coreIdentity.map((pillar) => (
              <span
                key={pillar}
                className="rounded-md border border-white/[0.08] bg-[#10121B]/75 px-2.5 py-1 font-mono text-[11px] text-[#969BB0]"
              >
                {pillar}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right visual spatial stage framing the persistent 3D centerpiece */}
        <div className="relative z-10 lg:col-span-5">
          <div className="relative mx-auto flex min-h-[340px] max-w-md flex-col justify-between sm:min-h-[420px] lg:min-h-[470px]">
            {/* Floating technology labels orbiting the 3D centerpiece */}
            <div
              aria-hidden="true"
              className="pointer-events-none relative hidden h-56 sm:block lg:h-64"
            >
              {FLOATING_LABELS.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -7, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.35 + item.delay * 0.2 },
                    y: {
                      duration: 4.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: item.delay,
                    },
                  }}
                  style={{ left: item.x, top: item.y }}
                  className="glass-panel absolute flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] text-[#F5F7FF] shadow-lg"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: item.accent,
                      boxShadow: `0 0 10px ${item.accent}`,
                    }}
                  />
                  {item.label}
                </motion.div>
              ))}
            </div>

            {/* Live-looking Architecture Telemetry Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="glass-panel rounded-2xl p-5 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)]"
            >
              <div className="mb-3.5 flex items-center justify-between border-b border-white/8 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#45E4FF]" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F5F7FF]">
                    System Architecture Feed
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#45E4FF]/30 bg-[#45E4FF]/10 px-2 py-0.5 font-mono text-[10px] text-[#45E4FF]">
                  <Sparkles className="h-2.5 w-2.5" />
                  SIMULATED
                </span>
              </div>

              <div className="space-y-2.5">
                {TELEMETRY_EVENTS.map((ev, idx) => {
                  const isCurrent = idx === activeTick;
                  return (
                    <div
                      key={ev.node}
                      className={`rounded-lg border px-3 py-2.5 transition-all duration-300 ${
                        isCurrent
                          ? "border-[#5B8CFF]/45 bg-[#5B8CFF]/10"
                          : "border-white/[0.06] bg-white/[0.02] opacity-70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                        <span
                          className="font-semibold tracking-wider"
                          style={{ color: ev.color }}
                        >
                          {ev.node}
                        </span>
                        <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[#F5F7FF]">
                          {ev.status}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-[#969BB0]">
                        {ev.detail}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 font-mono text-[10px] text-[#969BB0]">
                <span className="inline-flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-[#5B8CFF]" />
                  3D WebGL Scene Active
                </span>
                <button
                  type="button"
                  onClick={() => scrollToSection("architecture-lab")}
                  className="cursor-pointer text-[#45E4FF] hover:underline"
                >
                  Open Architecture Lab →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        onClick={() => scrollToSection("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        aria-label="Scroll to About section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#969BB0] transition-colors hover:text-[#45E4FF] md:flex"
      >
        <span>Scroll to Explore</span>
        <span className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <ArrowDown className="h-3 w-3 animate-bounce text-[#45E4FF]" />
        </span>
      </motion.button>
    </section>
  );
}

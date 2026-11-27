"use client";

import React from "react";
import { useScrollMotion } from "@/components/three/ScrollStateContext";
import { cn } from "@/lib/utils";

const HUD_CHAPTERS = [
  { id: "hero", num: "01", label: "Hero" },
  { id: "about", num: "02", label: "About" },
  { id: "capabilities", num: "03", label: "Capabilities" },
  { id: "tech-galaxy", num: "04", label: "Tech Galaxy" },
  { id: "projects", num: "05", label: "15 Projects" },
  { id: "architecture-lab", num: "06", label: "Arch Lab" },
  { id: "ai-lab", num: "6B", label: "AI Sandbox" },
  { id: "journey", num: "07", label: "Journey" },
  { id: "metrics", num: "08", label: "Metrics" },
  { id: "github", num: "09", label: "GitHub" },
  { id: "contact", num: "10", label: "Contact" },
];

export function SpatialSectionHud() {
  const { activeSection, scrollProgressUI, scrollToSection } = useScrollMotion();

  return (
    <aside
      aria-label="Section progress navigation"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2 xl:flex"
    >
      <div className="mb-1 rounded-md border border-white/10 bg-[#0A0C15]/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#45E4FF] backdrop-blur-md">
        {String(Math.round(scrollProgressUI * 100)).padStart(2, "0")}%
      </div>

      <div className="flex flex-col items-end gap-1.5 rounded-2xl border border-white/[0.08] bg-[#0A0C15]/75 p-2 backdrop-blur-xl">
        {HUD_CHAPTERS.map((ch) => {
          const active = activeSection === ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => scrollToSection(ch.id)}
              aria-label={`Jump to ${ch.label}`}
              className="group flex cursor-pointer items-center gap-2 py-0.5"
            >
              <span
                className={cn(
                  "pointer-events-none font-mono text-[9px] uppercase tracking-wider transition-all duration-200",
                  active
                    ? "opacity-100 text-[#45E4FF]"
                    : "opacity-0 -translate-x-1 text-[#969BB0] group-hover:opacity-100 group-hover:translate-x-0"
                )}
              >
                {ch.num} · {ch.label}
              </span>
              <span
                className={cn(
                  "block rounded-full transition-all duration-300",
                  active
                    ? "h-2.5 w-6 bg-gradient-to-r from-[#5B8CFF] to-[#45E4FF] shadow-[0_0_12px_rgba(69,228,255,0.75)]"
                    : "h-1.5 w-2 bg-white/20 group-hover:w-4 group-hover:bg-white/55"
                )}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}

"use client";

import React from "react";
import { ArrowUp, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { useProfile } from "@/context/ProfileContext";
import { useScrollMotion } from "@/components/three/ScrollStateContext";

const FOOTER_LINKS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "capabilities", label: "Capabilities" },
  { id: "tech-galaxy", label: "Tech Galaxy" },
  { id: "projects", label: "15 Projects" },
  { id: "architecture-lab", label: "Architecture Lab" },
  { id: "journey", label: "Journey" },
  { id: "metrics", label: "Metrics" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
];

export function Footer() {
  const { profile } = useProfile();
  const { scrollToSection } = useScrollMotion();

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#06070C]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#5B8CFF]/40 bg-[#5B8CFF]/12 font-display text-sm font-bold text-[#F5F7FF]">
                {profile.monogram}
              </span>
              <div>
                <p className="font-display text-base font-bold tracking-wider text-[#F5F7FF]">
                  {profile.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#969BB0]">
                  {profile.role}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-[#969BB0]">
              {profile.brandHeadline} Engineered with Next.js, TypeScript,
              Three.js, React Three Fiber, Framer Motion, GSAP, and Lenis.
            </p>
          </div>

          <div className="md:col-span-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#45E4FF]">
              Navigation
            </p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="cursor-pointer font-mono text-xs text-[#969BB0] transition-colors hover:text-[#F5F7FF]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 md:col-span-2 md:items-end">
            <div className="flex items-center gap-2">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#969BB0] transition-colors hover:border-[#45E4FF]/50 hover:text-[#F5F7FF]"
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#969BB0] transition-colors hover:border-[#45E4FF]/50 hover:text-[#F5F7FF]"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#969BB0] transition-colors hover:border-[#45E4FF]/50 hover:text-[#F5F7FF]"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-[#969BB0] transition-colors hover:border-[#5B8CFF]/50 hover:text-[#F5F7FF]"
            >
              Top
              <ArrowUp className="h-3.5 w-3.5 text-[#45E4FF]" />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-6 font-mono text-[11px] text-[#969BB0] sm:flex-row">
          <span>
            © {new Date().getFullYear()} {profile.name}. Personal details
            configured in src/config/profile.ts.
          </span>
          <span>Accessible · Reduced-Motion Aware · Responsive</span>
        </div>
      </div>
    </footer>
  );
}

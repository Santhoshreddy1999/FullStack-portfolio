"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Command, Download, Menu, Sliders, X } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useScrollMotion } from "@/components/three/ScrollStateContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "about", label: "About", index: "02" },
  { id: "capabilities", label: "Capabilities", index: "03" },
  { id: "tech-galaxy", label: "Galaxy", index: "04" },
  { id: "projects", label: "Projects", index: "05" },
  { id: "architecture-lab", label: "Arch Lab", index: "06" },
  { id: "ai-lab", label: "AI Lab", index: "6B" },
  { id: "journey", label: "Journey", index: "07" },
  { id: "contact", label: "Contact", index: "10" },
];

export function Navbar({
  onOpenCommandPalette,
}: {
  onOpenCommandPalette: () => void;
}) {
  const { profile, setStudioOpen } = useProfile();
  const { activeSection, scrollProgressUI, scrollToSection } = useScrollMotion();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#07080D]/78 backdrop-blur-xl">
      {/* Scroll progress hairline */}
      <div aria-hidden="true" className="h-[2px] w-full bg-white/[0.04]">
        <div
          className="h-full bg-gradient-to-r from-[#5B8CFF] via-[#9B6BFF] to-[#45E4FF] transition-[width] duration-150"
          style={{ width: `${Math.round(scrollProgressUI * 100)}%` }}
        />
      </div>

      <nav
        aria-label="Primary Navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("hero");
          }}
          className="group flex items-center gap-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#5B8CFF]/40 bg-[#5B8CFF]/12 font-display text-sm font-bold tracking-wider text-[#F5F7FF] transition-colors group-hover:border-[#45E4FF]">
            {profile.monogram}
          </span>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-semibold tracking-wider text-[#F5F7FF]">
              {profile.name}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#969BB0]">
              Full Stack · AI · Architect
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "cursor-pointer rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                    isActive
                      ? "border border-[#5B8CFF]/35 bg-[#5B8CFF]/16 text-[#F5F7FF]"
                      : "text-[#969BB0] hover:bg-white/[0.04] hover:text-[#F5F7FF]"
                  )}
                >
                  <span className="mr-1 text-[#5B8CFF]/75">{item.index}</span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            data-cursor="CMD+K"
            aria-label="Open Command Palette"
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-white/12 bg-[#10121B]/90 px-2.5 font-mono text-[11px] text-[#969BB0] transition-colors hover:border-[#45E4FF]/50 hover:text-[#F5F7FF]"
          >
            <Command className="h-3.5 w-3.5 text-[#45E4FF]" />
            <span className="hidden md:inline">Search</span>
            <kbd className="rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#C7D4FF]">
              ⌘K
            </kbd>
          </button>

          {/* Identity & Photo Preview Studio Trigger */}
          <button
            type="button"
            onClick={() => setStudioOpen(true)}
            title="Live Identity & Portrait Preview Studio"
            aria-label="Open Identity and Portrait Studio"
            className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/12 bg-[#10121B]/90 text-[#969BB0] transition-colors hover:border-[#9B6BFF]/60 hover:text-[#F5F7FF] sm:inline-flex"
          >
            <Sliders className="h-3.5 w-3.5 text-[#9B6BFF]" />
          </button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden xl:inline-flex"
          >
            <a
              href={profile.resume.pdfPath}
              download={profile.resume.downloadFilename}
              data-cursor="RESUME"
            >
              <Download className="h-3.5 w-3.5 text-[#45E4FF]" />
              Resume
            </a>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleNavClick("contact")}
            className="hidden sm:inline-flex"
            data-cursor="CONNECT"
          >
            Let&apos;s Build
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-[#F5F7FF] lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0A0C14]/98 px-4 py-5 backdrop-blur-xl lg:hidden">
          <ul className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left font-mono text-xs uppercase tracking-wider transition-colors",
                    activeSection === item.id
                      ? "border-[#5B8CFF]/45 bg-[#5B8CFF]/15 text-[#F5F7FF]"
                      : "border-white/8 bg-white/[0.02] text-[#969BB0]"
                  )}
                >
                  <span className="text-[#5B8CFF]">{item.index}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => {
                setMobileOpen(false);
                setStudioOpen(true);
              }}
            >
              <Sliders className="h-4 w-4 text-[#9B6BFF]" />
              Personalize Live
            </Button>
            <Button variant="outline" size="md" asChild className="w-full">
              <a
                href={profile.resume.pdfPath}
                download={profile.resume.downloadFilename}
              >
                <Download className="h-4 w-4 text-[#45E4FF]" />
                Download Resume
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

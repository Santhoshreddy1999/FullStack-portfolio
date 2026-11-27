"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Compass,
  Copy,
  Cpu,
  Download,
  FlaskConical,
  Layers,
  Search,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES, CATEGORY_BY_ID } from "@/data/technologies";
import { useScrollMotion } from "@/components/three/ScrollStateContext";
import { useVisualSettings } from "@/components/three/VisualSettingsContext";
import { useProfile } from "@/context/ProfileContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  group: "Actions" | "Sections" | "Projects" | "Technologies";
  title: string;
  subtitle: string;
  keywords: string;
  icon: "action" | "section" | "project" | "tech";
  onSelect: () => void;
}

const SECTIONS = [
  { id: "hero", label: "01 · Cinematic Hero", desc: "Opening centerpiece & live telemetry" },
  { id: "about", label: "02 · Editorial About", desc: "5-year background, philosophy & portrait" },
  { id: "capabilities", label: "03 · Engineering Capabilities", desc: "6 disciplines with 3D geometry inspector" },
  { id: "tech-galaxy", label: "04 · 3D Technology Galaxy", desc: "117 technologies across 8 orbital clusters" },
  { id: "projects", label: "05 · Featured Projects", desc: "15 architectural blueprints & case studies" },
  { id: "architecture-lab", label: "06 · System Architecture Lab", desc: "6 interactive diagrams + Chaos Mode" },
  { id: "ai-lab", label: "06B · AI Engineering Sandbox", desc: "LangGraph multi-agent & Hybrid RAG simulator" },
  { id: "journey", label: "07 · Engineering Journey", desc: "5-year horizontal & vertical timeline" },
  { id: "metrics", label: "08 · Verified Metrics", desc: "Dynamic inventory & proficiency split" },
  { id: "github", label: "09 · GitHub & Open Source", desc: "API-synced repositories & language split" },
  { id: "contact", label: "10 · Contact & Collaboration", desc: "Inquiry form, social links & 3D orb" },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { scrollToSection } = useScrollMotion();
  const { ecoMode, toggleEcoMode, jumpToTech } = useVisualSettings();
  const { profile, setStudioOpen } = useProfile();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const allItems = useMemo<CommandItem[]>(() => {
    const actions: CommandItem[] = [
      {
        id: "act-studio",
        group: "Actions",
        title: "Open Identity & Portrait Preview Studio",
        subtitle: "Test your own name, real photograph, email & links live",
        keywords: "customize edit photo profile studio personalize",
        icon: "action",
        onSelect: () => {
          onOpenChange(false);
          setStudioOpen(true);
        },
      },
      {
        id: "act-ailab",
        group: "Actions",
        title: "Launch Interactive AI & RAG Sandbox",
        subtitle: "Run live LangGraph agent traces & Hybrid RAG ACL retrieval",
        keywords: "ai agent langgraph rag sandbox lab simulate",
        icon: "action",
        onSelect: () => {
          onOpenChange(false);
          scrollToSection("ai-lab");
        },
      },
      {
        id: "act-eco",
        group: "Actions",
        title: ecoMode
          ? "Enable Full 3D WebGL & GLSL Shaders"
          : "Switch to Eco / Minimal Motion Mode",
        subtitle: ecoMode
          ? "Restore persistent 3D shaders and orbital particles"
          : "Disable background WebGL canvas for battery-saving mode",
        keywords: "performance eco webgl 3d shaders motion toggle",
        icon: "action",
        onSelect: () => {
          toggleEcoMode();
          onOpenChange(false);
        },
      },
      {
        id: "act-email",
        group: "Actions",
        title: `Copy Email (${profile.email})`,
        subtitle: "Copy direct engineering contact address to clipboard",
        keywords: "email copy contact mail",
        icon: "action",
        onSelect: () => {
          navigator.clipboard?.writeText(profile.email).catch(() => {});
          onOpenChange(false);
        },
      },
      {
        id: "act-resume",
        group: "Actions",
        title: "Download Resume PDF",
        subtitle: profile.resume.downloadFilename,
        keywords: "resume cv pdf download",
        icon: "action",
        onSelect: () => {
          const a = document.createElement("a");
          a.href = profile.resume.pdfPath;
          a.download = profile.resume.downloadFilename;
          a.click();
          onOpenChange(false);
        },
      },
    ];

    const sections: CommandItem[] = SECTIONS.map((s) => ({
      id: `sec-${s.id}`,
      group: "Sections",
      title: s.label,
      subtitle: s.desc,
      keywords: `${s.label} ${s.desc}`,
      icon: "section",
      onSelect: () => {
        onOpenChange(false);
        scrollToSection(s.id);
      },
    }));

    const projects: CommandItem[] = PROJECTS.map((p) => ({
      id: `prj-${p.slug}`,
      group: "Projects",
      title: `${p.number} · ${p.title} — ${p.subtitle}`,
      subtitle: p.stack.slice(0, 6).join(" · "),
      keywords: `${p.title} ${p.subtitle} ${p.stack.join(" ")} ${p.domainLabel}`,
      icon: "project",
      onSelect: () => {
        onOpenChange(false);
        router.push(`/projects/${p.slug}`);
      },
    }));

    const techs: CommandItem[] = TECHNOLOGIES.map((t) => {
      const cat = CATEGORY_BY_ID.get(t.category)?.label ?? t.category;
      return {
        id: `tech-${t.id}`,
        group: "Technologies",
        title: t.name,
        subtitle: `${cat} · Inspect in 3D Technology Galaxy`,
        keywords: `${t.name} ${cat} ${t.description}`,
        icon: "tech",
        onSelect: () => {
          onOpenChange(false);
          jumpToTech(t.id);
          scrollToSection("tech-galaxy");
        },
      };
    });

    return [...actions, ...sections, ...projects, ...techs];
  }, [
    ecoMode,
    jumpToTech,
    onOpenChange,
    profile.email,
    profile.resume.downloadFilename,
    profile.resume.pdfPath,
    router,
    scrollToSection,
    setStudioOpen,
    toggleEcoMode,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show curated overview before typing
      return [
        ...allItems.filter((i) => i.group === "Actions"),
        ...allItems.filter((i) => i.group === "Sections").slice(0, 6),
        ...allItems.filter((i) => i.group === "Projects").slice(0, 5),
      ];
    }
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [allItems, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(filtered.length - 1, prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      filtered[activeIndex].onSelect();
    }
  };

  const renderIcon = (item: CommandItem) => {
    if (item.id === "act-studio") return <Sliders className="h-4 w-4 text-[#45E4FF]" />;
    if (item.id === "act-ailab") return <FlaskConical className="h-4 w-4 text-[#9B6BFF]" />;
    if (item.id === "act-eco") return <Zap className="h-4 w-4 text-[#FF9B62]" />;
    if (item.id === "act-email") return <Copy className="h-4 w-4 text-[#5B8CFF]" />;
    if (item.id === "act-resume") return <Download className="h-4 w-4 text-[#34D399]" />;
    if (item.icon === "section") return <Compass className="h-4 w-4 text-[#5B8CFF]" />;
    if (item.icon === "project") return <Layers className="h-4 w-4 text-[#9B6BFF]" />;
    return <Cpu className="h-4 w-4 text-[#45E4FF]" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 gap-0">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>

        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 pr-12">
          <Search className="h-4 w-4 shrink-0 text-[#45E4FF]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to any section, 15 projects, 117 technologies, or action..."
            aria-label="Command palette search"
            className="w-full bg-transparent text-sm text-[#F5F7FF] placeholder:text-[#969BB0]/70 focus:outline-none"
          />
          <kbd className="hidden rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#969BB0] sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-[#5B8CFF]" />
              <p className="mt-3 font-display text-sm font-semibold text-[#F5F7FF]">
                No matches for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-[#969BB0]">
                Try searching &ldquo;LangGraph&rdquo;, &ldquo;Kafka&rdquo;,
                &ldquo;NEXUS&rdquo;, or &ldquo;Studio&rdquo;.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={item.onSelect}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors",
                      isActive
                        ? "bg-[#5B8CFF]/18 border border-[#5B8CFF]/40"
                        : "border border-transparent hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0B0E17]">
                        {renderIcon(item)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-medium text-[#F5F7FF]">
                          {item.title}
                        </p>
                        <p className="truncate font-mono text-[11px] text-[#969BB0]">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded bg-white/[0.05] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#969BB0]">
                        {item.group}
                      </span>
                      {isActive && (
                        <ArrowRight className="h-3.5 w-3.5 text-[#45E4FF]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer keyboard hints */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#080A12] px-4 py-2.5 font-mono text-[10px] text-[#969BB0]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#45E4FF]">
            {PROJECTS.length} Projects · {TECHNOLOGIES.length} Techs Indexed
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

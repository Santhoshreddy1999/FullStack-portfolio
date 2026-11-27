"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  Grid2X2,
  Orbit,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  CATEGORY_BY_ID,
  PROFICIENCY_META,
  TECH_BY_ID,
  TECH_CATEGORIES,
  TECHNOLOGIES,
  type ProficiencyTier,
  type TechCategoryId,
  type TechnologyItem,
} from "@/data/technologies";
import { PROJECT_BY_SLUG } from "@/data/projects";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TechGalaxyCanvas = dynamic(
  () => import("@/components/three/TechGalaxyCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-[#969BB0]">
        Loading interactive 3D technology galaxy...
      </div>
    ),
  }
);

export function TechGalaxySection() {
  const [viewMode, setViewMode] = useState<"galaxy" | "matrix">("galaxy");
  const [activeCategory, setActiveCategory] = useState<TechCategoryId | "all">(
    "all"
  );
  const [activeProficiency, setActiveProficiency] = useState<
    ProficiencyTier | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<TechnologyItem>(
    TECH_BY_ID.get("langgraph") ?? TECHNOLOGIES[0]
  );

  // Lazy-mount WebGL canvas only when section enters viewport vicinity
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [canvasVisible, setCanvasVisible] = useState(false);

  useEffect(() => {
    const el = canvasHostRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanvasVisible(true);
        }
      },
      { rootMargin: "220px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const filteredTechnologies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TECHNOLOGIES.filter((tech) => {
      if (activeCategory !== "all" && tech.category !== activeCategory) {
        return false;
      }
      if (
        activeProficiency !== "all" &&
        tech.proficiency !== activeProficiency
      ) {
        return false;
      }
      if (q) {
        const catLabel =
          CATEGORY_BY_ID.get(tech.category)?.label.toLowerCase() ?? "";
        return (
          tech.name.toLowerCase().includes(q) ||
          tech.description.toLowerCase().includes(q) ||
          catLabel.includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, activeProficiency, searchQuery]);

  const selectedCategoryMeta = CATEGORY_BY_ID.get(selectedTech.category);
  const selectedProficiencyMeta = PROFICIENCY_META[selectedTech.proficiency];

  const tierCounts = useMemo(() => {
    return {
      production: TECHNOLOGIES.filter((t) => t.proficiency === "production")
        .length,
      working: TECHNOLOGIES.filter((t) => t.proficiency === "working").length,
      explored: TECHNOLOGIES.filter((t) => t.proficiency === "explored").length,
    };
  }, []);

  const handleSelectById = (id: string) => {
    const found = TECH_BY_ID.get(id);
    if (found) {
      setSelectedTech(found);
    }
  };

  return (
    <section id="tech-galaxy" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="04"
          eyebrow="Technology Galaxy"
          title="An Interactive Ecosystem of 117 Technologies"
          description="Explore connected clusters across frontend, backend, AI, databases, cloud, distributed systems, testing, and architecture — with honest proficiency tiers distinguishing professional production experience, working knowledge, and R&D exploration."
        />

        {/* Proficiency Legend + View Switcher */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveProficiency("all")}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors",
                activeProficiency === "all"
                  ? "border-[#F5F7FF]/40 bg-white/10 text-[#F5F7FF]"
                  : "border-white/10 bg-[#10121B]/80 text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              All Tiers ({TECHNOLOGIES.length})
            </button>
            {(["production", "working", "explored"] as ProficiencyTier[]).map(
              (tier) => {
                const meta = PROFICIENCY_META[tier];
                const active = activeProficiency === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setActiveProficiency(tier)}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors",
                      active
                        ? "bg-white/10 text-[#F5F7FF]"
                        : "border-white/10 bg-[#10121B]/80 text-[#969BB0] hover:text-[#F5F7FF]"
                    )}
                    style={{
                      borderColor: active ? meta.color : undefined,
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    {meta.label} ({tierCounts[tier]})
                  </button>
                );
              }
            )}
          </div>

          <div className="inline-flex self-start rounded-xl border border-white/10 bg-[#0E1019] p-1">
            <button
              type="button"
              onClick={() => setViewMode("galaxy")}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors",
                viewMode === "galaxy"
                  ? "bg-[#5B8CFF]/20 text-[#F5F7FF]"
                  : "text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              <Orbit className="h-3.5 w-3.5 text-[#45E4FF]" />
              3D Galaxy
            </button>
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors",
                viewMode === "matrix"
                  ? "bg-[#5B8CFF]/20 text-[#F5F7FF]"
                  : "text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              <Grid2X2 className="h-3.5 w-3.5 text-[#5B8CFF]" />
              2D Matrix
            </button>
          </div>
        </div>

        {/* Search + Category Cluster Filter Bar */}
        <div className="glass-panel mb-6 rounded-2xl p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#969BB0]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any technology (e.g. LangGraph, Spring Boot, Kafka, Qdrant, Terraform)..."
                className="pl-10 pr-9"
                aria-label="Search technologies"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#969BB0] hover:text-[#F5F7FF]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="font-mono text-xs text-[#969BB0]">
              Showing{" "}
              <span className="font-semibold text-[#45E4FF]">
                {filteredTechnologies.length}
              </span>{" "}
              / {TECHNOLOGIES.length} nodes
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                activeCategory === "all"
                  ? "border-[#5B8CFF]/60 bg-[#5B8CFF]/18 text-[#F5F7FF]"
                  : "border-white/8 bg-white/[0.02] text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              All 8 Clusters
            </button>
            {TECH_CATEGORIES.map((cat) => {
              const count = TECHNOLOGIES.filter(
                (t) => t.category === cat.id
              ).length;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setActiveCategory(active ? "all" : cat.id)
                  }
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-colors",
                    active
                      ? "bg-white/10 text-[#F5F7FF]"
                      : "border-white/8 bg-white/[0.02] text-[#969BB0] hover:text-[#F5F7FF]"
                  )}
                  style={{ borderColor: active ? cat.color : undefined }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.shortLabel}
                  <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Galaxy + Technology Inspector Split */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 8 cols: 3D Galaxy or 2D Matrix */}
          <div className="lg:col-span-8">
            {viewMode === "galaxy" ? (
              <div
                ref={canvasHostRef}
                className="glass-panel relative h-[460px] overflow-hidden rounded-3xl sm:h-[540px]"
                data-cursor="ORBIT"
              >
                <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-[#07080D]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#45E4FF] backdrop-blur-md">
                    Drag to Orbit · Scroll to Zoom · Click Any Node
                  </span>
                </div>

                {canvasVisible ? (
                  <TechGalaxyCanvas
                    items={filteredTechnologies}
                    selectedTech={selectedTech}
                    activeCategory={activeCategory}
                    onSelectTech={setSelectedTech}
                    onSelectCategory={(cat) =>
                      setActiveCategory((prev) => (prev === cat ? "all" : cat))
                    }
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-mono text-xs text-[#969BB0]">
                    Preparing 3D orbital field...
                  </div>
                )}

                {/* Quick-click bar below galaxy for mobile & keyboard users */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-2 overflow-x-auto rounded-xl border border-white/10 bg-[#07080D]/85 p-2 backdrop-blur-md">
                  <span className="shrink-0 px-1.5 font-mono text-[10px] uppercase text-[#969BB0]">
                    Quick Select:
                  </span>
                  {filteredTechnologies.slice(0, 14).map((tech) => (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => setSelectedTech(tech)}
                      className={cn(
                        "shrink-0 cursor-pointer rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors",
                        selectedTech.id === tech.id
                          ? "border-[#45E4FF]/70 bg-[#45E4FF]/15 text-[#F5F7FF]"
                          : "border-white/10 bg-white/[0.03] text-[#969BB0] hover:text-[#F5F7FF]"
                      )}
                    >
                      {tech.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-panel max-h-[540px] overflow-y-auto rounded-3xl p-5 sm:p-6">
                {filteredTechnologies.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="font-display text-lg font-semibold text-[#F5F7FF]">
                      No matching technologies
                    </p>
                    <p className="mt-1 text-sm text-[#969BB0]">
                      Try clearing your search or proficiency filter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {TECH_CATEGORIES.map((cat) => {
                      const catItems = filteredTechnologies.filter(
                        (t) => t.category === cat.id
                      );
                      if (catItems.length === 0) return null;
                      return (
                        <div key={cat.id}>
                          <div className="mb-3 flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#F5F7FF]">
                              {cat.label}
                            </h3>
                            <span className="font-mono text-[11px] text-[#969BB0]">
                              ({catItems.length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {catItems.map((tech) => {
                              const isSelected = tech.id === selectedTech.id;
                              const tierColor =
                                PROFICIENCY_META[tech.proficiency].color;
                              return (
                                <button
                                  key={tech.id}
                                  type="button"
                                  onClick={() => setSelectedTech(tech)}
                                  className={cn(
                                    "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all",
                                    isSelected
                                      ? "border-[#45E4FF] bg-[#45E4FF]/15 text-[#F5F7FF]"
                                      : "border-white/10 bg-[#0C0F18] text-[#C7D4FF] hover:border-white/25"
                                  )}
                                >
                                  <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: tierColor }}
                                  />
                                  {tech.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right 4 cols: Selected Technology Inspector */}
          <div className="lg:col-span-4">
            <div className="glass-panel flex h-full flex-col justify-between rounded-3xl p-6">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#969BB0]">
                    <Compass className="h-3.5 w-3.5 text-[#45E4FF]" />
                    Node Inspector
                  </span>
                  {selectedCategoryMeta && (
                    <Badge
                      style={{
                        borderColor: `${selectedCategoryMeta.color}55`,
                        backgroundColor: `${selectedCategoryMeta.color}18`,
                        color: "#F5F7FF",
                      }}
                    >
                      {selectedCategoryMeta.shortLabel}
                    </Badge>
                  )}
                </div>

                <h3 className="mt-4 font-display text-2xl font-bold text-[#F5F7FF] sm:text-3xl">
                  {selectedTech.name}
                </h3>

                {/* Explicit Honest Proficiency Tier */}
                <div className="mt-3 rounded-xl border border-white/10 bg-[#0B0E17] p-3.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: selectedProficiencyMeta.color }}
                    />
                    <span style={{ color: selectedProficiencyMeta.color }}>
                      {selectedProficiencyMeta.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#969BB0]">
                    {selectedProficiencyMeta.description}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#D7DDF2]">
                  {selectedTech.description}
                </p>

                {/* Related Technologies */}
                <div className="mt-6">
                  <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#969BB0]">
                    Connected Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTech.relatedIds.map((rid) => {
                      const related = TECH_BY_ID.get(rid);
                      if (!related) return null;
                      return (
                        <button
                          key={rid}
                          type="button"
                          onClick={() => handleSelectById(rid)}
                          className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-[#C7D4FF] transition-colors hover:border-[#45E4FF]/60 hover:text-[#F5F7FF]"
                        >
                          {related.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Relevant Projects */}
                <div className="mt-6">
                  <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#969BB0]">
                    Applied In Blueprints
                  </p>
                  <div className="space-y-2">
                    {selectedTech.projectSlugs.map((slug) => {
                      const proj = PROJECT_BY_SLUG.get(slug);
                      if (!proj) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/projects/${proj.slug}`}
                          className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0C0F18] px-3.5 py-2.5 transition-colors hover:border-[#5B8CFF]/50"
                        >
                          <div>
                            <p className="font-display text-xs font-semibold text-[#F5F7FF] group-hover:text-[#45E4FF]">
                              {proj.number} · {proj.title}
                            </p>
                            <p className="text-[11px] text-[#969BB0]">
                              {proj.subtitle}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-[#969BB0] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#45E4FF]" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 font-mono text-[10px] text-[#969BB0]">
                <Sparkles className="h-3.5 w-3.5 text-[#9B6BFF]" />
                Proficiency tiers reflect honest engineering depth across R&amp;D
                and production work.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

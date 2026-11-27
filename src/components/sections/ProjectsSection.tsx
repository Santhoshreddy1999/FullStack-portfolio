"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Layers,
  Search,
  Sparkles,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/brand-icons";
import {
  PROJECT_DOMAINS,
  PROJECTS,
  type PortfolioProject,
  type ProjectDomain,
} from "@/data/projects";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ProjectArtwork } from "@/components/projects/ProjectArtwork";
import { ProjectDiagram } from "@/components/projects/ProjectDiagram";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ProjectsSection() {
  const [activeDomain, setActiveDomain] = useState<ProjectDomain | "all">("all");
  const [search, setSearch] = useState("");
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(
    null
  );

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      if (activeDomain !== "all" && p.domain !== activeDomain) return false;
      if (q) {
        return (
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.stack.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeDomain, search]);

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="05"
          eyebrow="Featured Projects // 15 Blueprints"
          title="Architecture-First Systems From Concept to Blueprint"
          description="Fifteen original engineering concepts spanning multi-agent AI, hybrid RAG, distributed Kafka meshes, cloud observability, and full-stack enterprise platforms. Every entry clearly labels its blueprint/prototype status without fabricated production claims."
        />

        {/* Transparency Banner */}
        <div className="glass-panel mb-8 flex flex-col gap-3 rounded-2xl border-[#5B8CFF]/25 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#45E4FF]" />
            <p className="text-xs leading-relaxed text-[#C7D4FF] sm:text-sm">
              <strong className="text-[#F5F7FF]">Honest Portfolio Scope:</strong>{" "}
              Each project below is a structured architectural concept and case-study
              blueprint with system diagrams, technical trade-offs, and implementation
              status. Repository and live demo URLs stay unlinked until real code is
              published.
            </p>
          </div>
          <Badge variant="cyan" className="shrink-0 self-start sm:self-center">
            {PROJECTS.length} Case Studies
          </Badge>
        </div>

        {/* Filter + Search Bar */}
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {PROJECT_DOMAINS.map((domain) => {
              const active = activeDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setActiveDomain(domain.id)}
                  className={cn(
                    "cursor-pointer rounded-xl border px-3.5 py-2 font-mono text-xs transition-colors",
                    active
                      ? "border-[#5B8CFF]/60 bg-[#5B8CFF]/18 text-[#F5F7FF]"
                      : "border-white/10 bg-[#10121B]/80 text-[#969BB0] hover:text-[#F5F7FF]"
                  )}
                >
                  {domain.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#969BB0]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by stack or title..."
              className="pl-10"
              aria-label="Filter projects"
            />
          </div>
        </div>

        {/* Flagship Spotlight Banner for 01 NEXUS AI when viewing All */}
        {activeDomain === "all" && !search.trim() && PROJECTS[0] && (
          <SpotlightCard
            spotlightColor="rgba(155, 107, 255, 0.2)"
            className="mb-8 overflow-hidden rounded-3xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <Link
                href={`/projects/${PROJECTS[0].slug}`}
                className="block lg:col-span-6"
                data-cursor="FLAGSHIP"
              >
                <ProjectArtwork
                  project={PROJECTS[0]}
                  className="h-64 w-full lg:h-full lg:min-h-[340px]"
                />
              </Link>
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="violet">Flagship Blueprint · PRJ-01</Badge>
                    <Badge variant="cyan">{PROJECTS[0].status}</Badge>
                  </div>
                  <h3 className="mt-3 font-display text-3xl font-bold text-[#F5F7FF]">
                    {PROJECTS[0].title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#C7D4FF]">
                    {PROJECTS[0].subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[#969BB0]">
                    {PROJECTS[0].architectureOverview}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {PROJECTS[0].stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-[#0B0E17] px-2.5 py-1 font-mono text-[11px] text-[#C7D4FF]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                  <Button variant="primary" size="md" asChild>
                    <Link href={`/projects/${PROJECTS[0].slug}`}>
                      Explore Full Case Study
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setPreviewProject(PROJECTS[0])}
                  >
                    <Eye className="h-4 w-4 text-[#45E4FF]" />
                    Inspect Topology
                  </Button>
                </div>
              </div>
            </div>
          </SpotlightCard>
        )}

        {/* 15 Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="font-display text-lg font-semibold text-[#F5F7FF]">
              No matching project blueprints
            </p>
            <p className="mt-1 text-sm text-[#969BB0]">
              Try resetting the domain filter or search keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: (idx % 3) * 0.05 }}
                className="h-full"
              >
              <SpotlightCard
                spotlightColor={`${project.accent}24`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl"
              >
                <article className="flex h-full flex-col">
                {/* Cover Artwork */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="block overflow-hidden border-b border-white/[0.07]"
                  data-cursor="CASE STUDY"
                >
                  <ProjectArtwork
                    project={project}
                    className="h-48 w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </Link>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="font-mono text-[11px] uppercase tracking-[0.18em]"
                        style={{ color: project.accent }}
                      >
                        {project.number} · {project.domainLabel}
                      </span>
                      <Badge variant="muted">{project.status}</Badge>
                    </div>

                    <Link href={`/projects/${project.slug}`}>
                      <h3 className="mt-2.5 font-display text-xl font-bold text-[#F5F7FF] transition-colors group-hover:text-[#45E4FF]">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-xs font-medium text-[#C7D4FF]">
                      {project.subtitle}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-[#969BB0]">
                      {project.description}
                    </p>

                    {/* Key Features Preview */}
                    <ul className="mt-4 space-y-1.5">
                      {project.features.slice(0, 3).map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2 text-xs text-[#D7DDF2]"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: project.accent }}
                          />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {project.disclaimer && (
                      <div className="mt-3.5 flex items-start gap-2 rounded-lg border border-[#FF9B62]/30 bg-[#FF9B62]/10 p-2.5 text-[11px] text-[#FFD0B3]">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF9B62]" />
                        <span>
                          Informational health organizer only — never a medical
                          diagnosis.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 border-t border-white/[0.08] pt-4">
                    {/* Technical Stack */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 5).map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-white/[0.08] bg-[#0B0E17] px-2 py-0.5 font-mono text-[10px] text-[#C7D4FF]"
                        >
                          {item}
                        </span>
                      ))}
                      {project.stack.length > 5 && (
                        <span className="px-1.5 py-0.5 font-mono text-[10px] text-[#969BB0]">
                          +{project.stack.length - 5}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <Button variant="secondary" size="sm" asChild className="flex-1">
                        <Link href={`/projects/${project.slug}`} data-cursor="OPEN">
                          Case Study
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewProject(project)}
                        data-cursor="DIAGRAM"
                        aria-label={`Preview ${project.title} architecture diagram`}
                      >
                        <Eye className="h-3.5 w-3.5 text-[#45E4FF]" />
                        Arch
                      </Button>

                      {project.links.github ? (
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${project.title} GitHub repository`}
                          >
                            <GitHubIcon className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <span
                          title={project.links.availabilityNote}
                          className="inline-flex h-9 items-center rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 font-mono text-[10px] text-[#969BB0]"
                        >
                          Blueprint
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                </article>
              </SpotlightCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Architecture Preview Modal */}
        <Dialog
          open={Boolean(previewProject)}
          onOpenChange={(open) => !open && setPreviewProject(null)}
        >
          <DialogContent className="max-w-4xl">
            {previewProject && (
              <>
                <DialogHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="blue">
                      PRJ-{previewProject.number} · {previewProject.domainLabel}
                    </Badge>
                    <Badge variant="muted">{previewProject.status}</Badge>
                  </div>
                  <DialogTitle className="mt-2 text-2xl">
                    {previewProject.title} — {previewProject.subtitle}
                  </DialogTitle>
                  <DialogDescription>
                    {previewProject.architectureOverview}
                  </DialogDescription>
                </DialogHeader>

                <ProjectDiagram project={previewProject} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-[#0B0E17] p-4">
                    <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#45E4FF]">
                      <Layers className="h-3.5 w-3.5" />
                      Core Capabilities
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#D7DDF2]">
                      {previewProject.features.map((f) => (
                        <li key={f}>• {f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#0B0E17] p-4">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#9B6BFF]">
                      Key Engineering Decision
                    </p>
                    {previewProject.challenges[0] && (
                      <div className="space-y-2 text-xs leading-relaxed text-[#969BB0]">
                        <p>
                          <strong className="text-[#F5F7FF]">Challenge: </strong>
                          {previewProject.challenges[0].challenge}
                        </p>
                        <p>
                          <strong className="text-[#45E4FF]">Decision: </strong>
                          {previewProject.challenges[0].decision}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {previewProject.disclaimer && (
                  <div className="rounded-xl border border-[#FF9B62]/35 bg-[#FF9B62]/10 p-3.5 text-xs leading-relaxed text-[#FFD0B3]">
                    {previewProject.disclaimer}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span className="font-mono text-[11px] text-[#969BB0]">
                    {previewProject.links.availabilityNote}
                  </span>
                  <Button variant="primary" size="md" asChild>
                    <Link href={`/projects/${previewProject.slug}`}>
                      Open Full Case Study
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

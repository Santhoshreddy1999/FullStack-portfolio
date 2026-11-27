import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Info,
  Layers,
  Scale,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/brand-icons";
import { PROJECT_BY_SLUG, PROJECTS } from "@/data/projects";
import { PROFILE } from "@/config/profile";
import { ProjectArtwork } from "@/components/projects/ProjectArtwork";
import { ProjectDiagram } from "@/components/projects/ProjectDiagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECT_BY_SLUG.get(slug);
  if (!project) {
    return { title: "Project Not Found" };
  }
  return {
    title: `${project.number} ${project.title} — ${project.subtitle} | ${PROFILE.name}`,
    description: project.description,
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECT_BY_SLUG.get(slug);
  if (!project) notFound();

  const currentIdx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prevProject =
    PROJECTS[(currentIdx - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIdx + 1) % PROJECTS.length];

  return (
    <div className="min-h-screen bg-[#07080D] text-[#F5F7FF]">
      {/* Top sticky utility bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#07080D]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#969BB0] transition-colors hover:text-[#45E4FF]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All 15 Projects
          </Link>
          <span className="font-mono text-xs text-[#969BB0]">
            CASE STUDY <span className="text-[#45E4FF]">{project.number}</span> /{" "}
            {PROJECTS.length}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Hero Header */}
        <div className="mb-8 flex flex-wrap items-center gap-2.5">
          <Badge variant="blue">
            PRJ-{project.number} · {project.domainLabel}
          </Badge>
          <Badge variant="cyan">{project.status}</Badge>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-[#F5F7FF] sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
        <p className="mt-3 font-display text-xl text-[#C7D4FF] sm:text-2xl">
          {project.subtitle}
        </p>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#969BB0] sm:text-lg">
          {project.description}
        </p>

        {/* Honest Status + External Links Row */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.links.github ? (
            <Button variant="primary" size="md" asChild>
              <a href={project.links.github} target="_blank" rel="noreferrer">
                <GitHubIcon className="h-4 w-4" />
                View Source on GitHub
              </a>
            </Button>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-[#10121B] px-4 py-2.5 font-mono text-xs text-[#969BB0]">
              <GitHubIcon className="h-4 w-4 text-[#5B8CFF]" />
              Repository Slot — Pending Publication
            </div>
          )}

          {project.links.demo ? (
            <Button variant="outline" size="md" asChild>
              <a href={project.links.demo} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Live Deployment
              </a>
            </Button>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-[#10121B] px-4 py-2.5 font-mono text-xs text-[#969BB0]">
              <Info className="h-4 w-4 text-[#45E4FF]" />
              {project.status} — No Fabricated Live URL
            </div>
          )}
        </div>

        {/* Medical Safety Disclaimer when applicable */}
        {project.disclaimer && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#FF9B62]/40 bg-[#FF9B62]/10 p-5 text-sm leading-relaxed text-[#FFD7BF]">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF9B62]" />
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#FF9B62]">
                Safety &amp; Clinical Boundary Notice
              </p>
              <p className="mt-1">{project.disclaimer}</p>
            </div>
          </div>
        )}

        {/* Cover Artwork */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/12">
          <ProjectArtwork project={project} className="h-64 w-full sm:h-80" />
        </div>

        {/* Status Note */}
        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#10121B]/80 p-4 font-mono text-xs text-[#969BB0]">
          <span className="text-[#45E4FF]">STATUS NOTE: </span>
          {project.statusDetail}
        </div>

        {/* Problem & Architecture Overview */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5B8CFF]">
              01 // Problem Statement
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#F5F7FF]">
              Engineering Context
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#969BB0] sm:text-base">
              {project.problemStatement}
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#45E4FF]">
              02 // System Architecture
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#F5F7FF]">
              Architectural Strategy
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#969BB0] sm:text-base">
              {project.architectureOverview}
            </p>
          </section>
        </div>

        {/* Interactive Architecture Diagram */}
        <section className="mt-12">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#969BB0]">
            <Layers className="h-4 w-4 text-[#5B8CFF]" />
            03 // Interactive System Topology
          </div>
          <ProjectDiagram project={project} />
        </section>

        {/* Features + Stack Split */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="glass-panel rounded-2xl p-6 sm:p-8 lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9B6BFF]">
              04 // Core Features &amp; Scope
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#F5F7FF]">
              System Capabilities
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-[#0B0E17] p-3.5 text-sm text-[#D7DDF2]"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: project.accent }}
                  />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-panel rounded-2xl p-6 sm:p-8 lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#45E4FF]">
              05 // Technical Stack
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#F5F7FF]">
              Technologies Used
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/12 bg-[#0B0E17] px-3.5 py-2 font-mono text-xs text-[#F5F7FF]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Engineering Challenges & Trade-offs */}
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#FF9B62]">
            <Scale className="h-4 w-4" />
            06 // Challenges, Engineering Decisions &amp; Trade-Offs
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {project.challenges.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 space-y-4"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF9B62]">
                    Challenge 0{idx + 1}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-semibold text-[#F5F7FF]">
                    {item.challenge}
                  </h3>
                </div>
                <div className="rounded-xl border border-[#5B8CFF]/25 bg-[#5B8CFF]/8 p-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#5B8CFF]">
                    Architectural Decision
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#D7DDF2]">
                    {item.decision}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#969BB0]">
                    Explicit Trade-Off
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#969BB0]">
                    {item.tradeoff}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prev / Next Case Study Navigation */}
        <nav
          aria-label="Project navigation"
          className="mt-16 grid grid-cols-1 gap-4 border-t border-white/10 pt-10 sm:grid-cols-2"
        >
          <Link
            href={`/projects/${prevProject.slug}`}
            className="glass-panel glass-panel-hover group flex items-center gap-4 rounded-2xl p-5"
          >
            <ArrowLeft className="h-5 w-5 text-[#969BB0] transition-transform group-hover:-translate-x-1 group-hover:text-[#45E4FF]" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#969BB0]">
                Previous Blueprint
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-[#F5F7FF]">
                {prevProject.number} · {prevProject.title}
              </p>
            </div>
          </Link>

          <Link
            href={`/projects/${nextProject.slug}`}
            className="glass-panel glass-panel-hover group flex items-center justify-end gap-4 rounded-2xl p-5 text-right"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#969BB0]">
                Next Blueprint
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-[#F5F7FF]">
                {nextProject.number} · {nextProject.title}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-[#969BB0] transition-transform group-hover:translate-x-1 group-hover:text-[#45E4FF]" />
          </Link>
        </nav>
      </main>
    </div>
  );
}

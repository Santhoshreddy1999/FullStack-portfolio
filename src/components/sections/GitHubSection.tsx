"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  GitFork,
  Info,
  Search,
  Star,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/brand-icons";
import type { GitHubRepoCard } from "@/app/api/github/route";
import { PROFILE } from "@/config/profile";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GitHubApiResponse {
  configured: boolean;
  mode: "live" | "preview" | "fallback";
  username: string | null;
  profileUrl: string;
  repos: GitHubRepoCard[];
  languages: { name: string; count: number; percentage: number }[];
  message: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#5B8CFF",
  Python: "#45E4FF",
  Java: "#FF9B62",
  JavaScript: "#FBBF24",
  HCL: "#9B6BFF",
  Go: "#38BDF8",
  Rust: "#F472B6",
};

// Deterministic architectural cadence pattern for contribution grid preview
const ACTIVITY_WEEKS = 24;
const ACTIVITY_DAYS = 7;

function getPreviewActivityLevel(week: number, day: number): number {
  const v = Math.abs(Math.sin(week * 1.7 + day * 2.9) * 100);
  if (v < 24) return 0;
  if (v < 52) return 1;
  if (v < 78) return 2;
  return 3;
}

export function GitHubSection() {
  const [data, setData] = useState<GitHubApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [langFilter, setLangFilter] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/github")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load GitHub data");
        return res.json() as Promise<GitHubApiResponse>;
      })
      .then((json) => {
        if (active) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("Could not reach local GitHub endpoint.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredRepos = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.repos.filter((repo) => {
      if (featuredOnly && !repo.featured) return false;
      if (langFilter !== "all" && repo.language !== langFilter) return false;
      if (q) {
        return (
          repo.name.toLowerCase().includes(q) ||
          repo.description.toLowerCase().includes(q) ||
          repo.topics.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [data, featuredOnly, langFilter, search]);

  return (
    <section id="github" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="09"
            eyebrow="GitHub & Open Source"
            title="Codebases, Blueprints & Language Distribution"
            description="Integration-ready GitHub showcase powered by the official GitHub API when configured, with a transparent architectural preview fallback."
            className="mb-6 lg:mb-12"
          />

          <div className="mb-10 lg:mb-12">
            <Button variant="outline" size="md" asChild>
              <a
                href={data?.profileUrl || PROFILE.social.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="GITHUB"
              >
                <GitHubIcon className="h-4 w-4 text-[#45E4FF]" />
                {data?.username ? `@${data.username}` : "GitHub Profile"}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        {data && (
          <div className="glass-panel mb-8 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5 text-xs leading-relaxed text-[#C7D4FF] sm:text-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#45E4FF]" />
              <span>{data.message}</span>
            </div>
            <Badge
              variant={data.mode === "live" ? "cyan" : "muted"}
              className="shrink-0 self-start sm:self-center"
            >
              {data.mode === "live" ? "Live GitHub API" : "Preview Mode"}
            </Badge>
          </div>
        )}

        {error && (
          <div className="glass-panel mb-8 rounded-2xl border-[#FF9B62]/35 p-5 text-sm text-[#FFD0B3]">
            {error}
          </div>
        )}

        {/* Top Analytics Strip: Language Distribution + Activity Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Language Distribution */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#45E4FF]">
              Language Distribution
            </p>
            {loading ? (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-6 animate-pulse rounded bg-white/[0.06]"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  {(data?.languages ?? []).map((lang) => (
                    <div
                      key={lang.name}
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: LANG_COLORS[lang.name] ?? "#969BB0",
                      }}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {(data?.languages ?? []).map((lang) => (
                    <div
                      key={lang.name}
                      className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#0B0E17] px-3 py-2"
                    >
                      <span className="inline-flex items-center gap-2 font-mono text-xs text-[#F5F7FF]">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              LANG_COLORS[lang.name] ?? "#969BB0",
                          }}
                        />
                        {lang.name}
                      </span>
                      <span className="font-mono text-xs text-[#969BB0]">
                        {lang.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Contribution Activity Grid */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5B8CFF]">
                Contribution Cadence Visual
              </p>
              <span className="font-mono text-[10px] text-[#969BB0]">
                {data?.mode === "live"
                  ? "Activity matrix preview (GitHub REST public scope)"
                  : "Sample visual cadence — connect GitHub GraphQL for live commits"}
              </span>
            </div>

            <div className="mt-5 overflow-x-auto pb-1">
              <div className="inline-grid grid-flow-col grid-rows-7 gap-1.5">
                {Array.from({ length: ACTIVITY_WEEKS * ACTIVITY_DAYS }).map(
                  (_, idx) => {
                    const week = Math.floor(idx / ACTIVITY_DAYS);
                    const day = idx % ACTIVITY_DAYS;
                    const level = getPreviewActivityLevel(week, day);
                    const bg =
                      level === 0
                        ? "bg-white/[0.05]"
                        : level === 1
                          ? "bg-[#5B8CFF]/30"
                          : level === 2
                            ? "bg-[#5B8CFF]/60"
                            : "bg-[#45E4FF]";
                    return (
                      <span
                        key={idx}
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 rounded-[3px] ${bg}`}
                      />
                    );
                  }
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-[#969BB0]">
              <span>24-Week Window</span>
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <span className="h-2.5 w-2.5 rounded-[2px] bg-white/[0.05]" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-[#5B8CFF]/30" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-[#5B8CFF]/60" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-[#45E4FF]" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Repository Filters + Search */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLangFilter("all")}
              className={cn(
                "cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                langFilter === "all"
                  ? "border-[#5B8CFF]/60 bg-[#5B8CFF]/18 text-[#F5F7FF]"
                  : "border-white/10 bg-[#10121B] text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              All Languages
            </button>
            {(data?.languages ?? []).map((lang) => (
              <button
                key={lang.name}
                type="button"
                onClick={() => setLangFilter(lang.name)}
                className={cn(
                  "cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                  langFilter === lang.name
                    ? "border-[#45E4FF]/60 bg-[#45E4FF]/15 text-[#F5F7FF]"
                    : "border-white/10 bg-[#10121B] text-[#969BB0] hover:text-[#F5F7FF]"
                )}
              >
                {lang.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFeaturedOnly((prev) => !prev)}
              className={cn(
                "cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                featuredOnly
                  ? "border-[#9B6BFF]/60 bg-[#9B6BFF]/20 text-[#F5F7FF]"
                  : "border-white/10 bg-[#10121B] text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              Featured Only
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#969BB0]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories or topics..."
              className="pl-10"
              aria-label="Search GitHub repositories"
            />
          </div>
        </div>

        {/* Repository Cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="glass-panel h-48 animate-pulse rounded-2xl p-6"
              />
            ))}
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center">
            <p className="font-display text-lg font-semibold text-[#F5F7FF]">
              No matching repositories
            </p>
            <p className="mt-1 text-sm text-[#969BB0]">
              Adjust your language filter or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo) => (
              <article
                key={repo.id}
                className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GitHubIcon className="h-4 w-4 text-[#5B8CFF]" />
                      <h3 className="font-mono text-sm font-semibold text-[#F5F7FF]">
                        {repo.name}
                      </h3>
                    </div>
                    {repo.featured && (
                      <Badge variant="violet">Featured</Badge>
                    )}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#969BB0]">
                    {repo.description}
                  </p>

                  {repo.topics.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {repo.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md border border-white/[0.08] bg-[#0B0E17] px-2 py-0.5 font-mono text-[10px] text-[#C7D4FF]"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 font-mono text-xs text-[#969BB0]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[#F5F7FF]">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            LANG_COLORS[repo.language] ?? "#969BB0",
                        }}
                      />
                      {repo.language}
                    </span>
                    {!repo.isPreview && (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-[#FBBF24]" />
                          {repo.stars}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <GitFork className="h-3.5 w-3.5" />
                          {repo.forks}
                        </span>
                      </>
                    )}
                  </div>

                  {repo.url ? (
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#45E4FF] hover:underline"
                    >
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider text-[#969BB0]">
                      {repo.updatedAt}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

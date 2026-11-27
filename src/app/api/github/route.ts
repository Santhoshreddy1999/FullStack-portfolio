import { NextResponse } from "next/server";
import { PROFILE } from "@/config/profile";

export interface GitHubRepoCard {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string | null;
  topics: string[];
  featured: boolean;
  updatedAt: string;
  isPreview: boolean;
}

const PREVIEW_REPOS: GitHubRepoCard[] = [
  {
    id: "preview-nexus-ai",
    name: "nexus-ai-orchestrator",
    description:
      "Reference multi-agent LangGraph + MCP orchestration template with FastAPI streaming and checkpointed state.",
    language: "Python",
    stars: 0,
    forks: 0,
    url: null,
    topics: ["langgraph", "mcp", "fastapi", "multi-agent"],
    featured: true,
    updatedAt: "Blueprint",
    isPreview: true,
  },
  {
    id: "preview-hybrid-rag",
    name: "enterprise-hybrid-rag",
    description:
      "Hybrid Qdrant + BM25 retrieval blueprint with ACL payload filters, reranking, and citation validation.",
    language: "Python",
    stars: 0,
    forks: 0,
    url: null,
    topics: ["rag", "qdrant", "llamaindex", "reranking"],
    featured: true,
    updatedAt: "Blueprint",
    isPreview: true,
  },
  {
    id: "preview-eventmesh",
    name: "spring-kafka-eventmesh",
    description:
      "Java Spring Boot transactional outbox, partitioned Kafka consumer groups, tiered retries, and DLQ recovery.",
    language: "Java",
    stars: 0,
    forks: 0,
    url: null,
    topics: ["spring-boot", "kafka", "distributed-systems", "microservices"],
    featured: true,
    updatedAt: "Blueprint",
    isPreview: true,
  },
  {
    id: "preview-portfolio-3d",
    name: "ai-architect-portfolio-3d",
    description:
      "Interactive Three.js / React Three Fiber + Next.js engineering portfolio with 3D Technology Galaxy & Architecture Lab.",
    language: "TypeScript",
    stars: 0,
    forks: 0,
    url: null,
    topics: ["nextjs", "threejs", "typescript", "gsap"],
    featured: true,
    updatedAt: "Active Workspace",
    isPreview: true,
  },
  {
    id: "preview-k8s-terraform",
    name: "azure-aks-terraform-kit",
    description:
      "Modular Terraform & Helm Kubernetes deployment templates for private-endpoint cloud-native apps.",
    language: "HCL",
    stars: 0,
    forks: 0,
    url: null,
    topics: ["terraform", "kubernetes", "azure", "helm"],
    featured: false,
    updatedAt: "Blueprint",
    isPreview: true,
  },
  {
    id: "preview-autonomous-qa",
    name: "playwright-agent-qa",
    description:
      "Playwright browser verification suite integrated with LangGraph failure triage and trace artifacts.",
    language: "TypeScript",
    stars: 0,
    forks: 0,
    url: null,
    topics: ["playwright", "qa", "langgraph", "testing"],
    featured: false,
    updatedAt: "Blueprint",
    isPreview: true,
  },
];

const USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

function computeLanguages(repos: GitHubRepoCard[]) {
  const counts = new Map<string, number>();
  for (const r of repos) {
    const lang = r.language || "Other";
    counts.set(lang, (counts.get(lang) ?? 0) + 1);
  }
  const total = Math.max(1, repos.length);
  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export async function GET() {
  const rawUsername =
    process.env.GITHUB_USERNAME?.trim() ||
    PROFILE.social.githubUsername?.trim() ||
    "";

  if (!rawUsername || !USERNAME_REGEX.test(rawUsername)) {
    return NextResponse.json({
      configured: false,
      mode: "preview",
      username: null,
      profileUrl: PROFILE.social.github,
      repos: PREVIEW_REPOS,
      languages: computeLanguages(PREVIEW_REPOS),
      message:
        "GitHub live sync is ready. Set social.githubUsername in src/config/profile.ts (or GITHUB_USERNAME env) to load public repositories from the official GitHub API.",
    });
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "ai-fullstack-portfolio",
    };

    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(rawUsername)}/repos?sort=updated&per_page=12`,
      {
        headers,
        next: { revalidate: 1800 },
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API responded with status ${res.status}`);
    }

    const data = (await res.json()) as Array<{
      id: number;
      name: string;
      description: string | null;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
      html_url: string;
      topics?: string[];
      updated_at: string;
      fork: boolean;
    }>;

    const repos: GitHubRepoCard[] = data
      .filter((r) => !r.fork)
      .slice(0, 12)
      .map((r, idx) => ({
        id: String(r.id),
        name: r.name,
        description:
          r.description || "Public repository synchronized via GitHub API.",
        language: r.language || "Multi-Language",
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        url: r.html_url,
        topics: Array.isArray(r.topics) ? r.topics.slice(0, 4) : [],
        featured: idx < 4 || (r.stargazers_count ?? 0) > 0,
        updatedAt: new Date(r.updated_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        isPreview: false,
      }));

    return NextResponse.json({
      configured: true,
      mode: "live",
      username: rawUsername,
      profileUrl: `https://github.com/${encodeURIComponent(rawUsername)}`,
      repos,
      languages: computeLanguages(repos),
      message: `Live public repositories synced from GitHub for @${rawUsername}.`,
    });
  } catch {
    return NextResponse.json({
      configured: false,
      mode: "fallback",
      username: rawUsername,
      profileUrl: `https://github.com/${encodeURIComponent(rawUsername)}`,
      repos: PREVIEW_REPOS,
      languages: computeLanguages(PREVIEW_REPOS),
      message:
        "GitHub API is currently rate-limited or unreachable from this environment. Displaying graceful preview repositories.",
    });
  }
}

export interface ExperienceMilestone {
  id: string;
  yearRange: string;
  phase: string;
  roleTitle: string;
  organization: string;
  location: string;
  isPlaceholder: boolean;
  summary: string;
  focusAreas: string[];
  technologies: string[];
  architecturalGrowth: string;
}

export interface ProfileConfig {
  /** Replace with your full name */
  name: string;
  /** Short initials used in navigation badge and portrait emblem */
  monogram: string;
  /** Whether personal identity fields are still using editable placeholders */
  isIdentityPlaceholder: boolean;
  /** Positioning string shown in hero & metadata */
  role: string;
  /** Years of professional experience */
  yearsOfExperience: number;
  /** Brand positioning headline */
  brandHeadline: string;
  /** Hero main cinematic headline */
  heroHeadline: string;
  /** Supporting statement from personal brand */
  supportingStatement: string;
  /** Hero supporting copy */
  heroSupportingCopy: string;
  /** Core identity pillars */
  coreIdentity: string[];
  /** Editable geographic location */
  location: string;
  /** Editable contact email */
  email: string;
  /** Social profiles — update with your real URLs */
  social: {
    github: string;
    /** Set your real GitHub username (e.g. "octocat") to enable live GitHub API sync */
    githubUsername: string | null;
    linkedin: string;
  };
  /** Resume configuration — replace /public/resume.pdf with your real PDF */
  resume: {
    pdfPath: string;
    downloadFilename: string;
    isPlaceholder: boolean;
  };
  /** Availability indicator in Hero & Contact */
  availability: {
    status: "open" | "selective" | "unavailable";
    label: string;
    details: string;
  };
  /**
   * Profile photograph configuration.
   * Drop your photograph into /public/images/profile.jpg (or .webp/.png)
   * and update `src` below to "/images/profile.jpg".
   */
  photo: {
    src: string | null;
    alt: string;
    objectPosition: string;
    caption: string;
  };
  /** Editorial About section copy */
  about: {
    eyebrow: string;
    lead: string;
    paragraphs: string[];
    philosophy: {
      title: string;
      principles: { label: string; detail: string }[];
    };
  };
  /** Editable 5-year engineering growth timeline (no fabricated employers or dates) */
  experienceTimeline: ExperienceMilestone[];
}

export const PROFILE: ProfileConfig = {
  name: "YOUR NAME",
  monogram: "AE",
  isIdentityPlaceholder: true,
  role: "FULL STACK ENGINEER | AI ENGINEER | SYSTEM ARCHITECT",
  yearsOfExperience: 5,
  brandHeadline: "I BUILD INTELLIGENT SYSTEMS. FROM PIXEL TO PRODUCTION.",
  heroHeadline: "ENGINEERING THE FUTURE, ONE SYSTEM AT A TIME.",
  supportingStatement:
    "Engineering scalable digital experiences, intelligent AI systems, and enterprise-grade applications by combining full-stack engineering, modern AI architectures, and cloud-native technologies.",
  heroSupportingCopy:
    "Full Stack Engineer crafting scalable applications, intelligent AI agents, and next-generation digital experiences.",
  coreIdentity: [
    "Full Stack Development",
    "AI/LLM Engineering",
    "Agentic AI Systems",
    "Enterprise Software Architecture",
    "Cloud-Native Engineering",
    "DevOps & Infrastructure",
    "Distributed Systems",
  ],
  location: "City, Country (Editable in src/config/profile.ts)",
  email: "your.email@example.com",
  social: {
    github: "https://github.com/Santhoshreddy1999",
    githubUsername: "Santhoshreddy1999",
    linkedin: "https://www.linkedin.com/in/your-profile",
  },
  resume: {
    pdfPath: "/resume.pdf",
    downloadFilename: "FullStack-AI-Engineer-Resume-Template.pdf",
    isPlaceholder: true,
  },
  availability: {
    status: "open",
    label: "Available for Senior & Principal Engineering Roles",
    details:
      "Open to full-stack architecture, AI/agentic platform engineering, and enterprise system design engagements.",
  },
  photo: {
    src: null,
    alt: "Portrait of Full Stack & AI Systems Engineer",
    objectPosition: "50% 20%",
    caption:
      "Portrait slot configured in src/config/profile.ts — drop a high-resolution studio photo into public/images/profile.jpg and set photo.src.",
  },
  about: {
    eyebrow: "Five Years Across the Stack",
    lead: "Bridging tactile frontend craft with resilient distributed backends and deterministic AI workflows.",
    paragraphs: [
      "Over five years of software engineering, my focus has evolved from crafting responsive web interfaces into architecting end-to-end systems where user experience, backend durability, cloud infrastructure, and generative AI operate as a unified whole.",
      "I approach software as an engineering discipline first: clear domain boundaries, observable runtime behavior, predictable failure modes, and clean abstractions that remain maintainable under enterprise load.",
      "Today, my work centers on combining full-stack TypeScript, React, Angular, Java/Spring Boot, and Python/FastAPI foundations with modern AI engineering — multi-agent orchestration, hybrid RAG pipelines, MCP tool interfaces, evaluation harnesses, and cloud-native Kubernetes delivery.",
    ],
    philosophy: {
      title: "Engineering Philosophy",
      principles: [
        {
          label: "Systems Over Silos",
          detail:
            "Every pixel connects to an API contract, a data model, an observability trace, and an infrastructure boundary.",
        },
        {
          label: "Deterministic Guardrails for Probabilistic AI",
          detail:
            "LLMs belong inside typed workflows with retrieval verification, human-in-the-loop checkpoints, and measurable evaluation.",
        },
        {
          label: "Boring Reliability, Ambitious UX",
          detail:
            "Pair expressive, high-craft interfaces with proven distributed patterns: idempotency, circuit breakers, and clear failure recovery.",
        },
        {
          label: "Design for Change",
          detail:
            "Clean and hexagonal architectures keep business rules insulated from framework churn and model provider shifts.",
        },
      ],
    },
  },
  experienceTimeline: [
    {
      id: "year-01",
      yearRange: "Year 01",
      phase: "01 / Foundations",
      roleTitle: "Software Engineer — Full Stack Foundations [Editable]",
      organization: "Organization Placeholder — Update in profile.ts",
      location: "Location Placeholder",
      isPlaceholder: true,
      summary:
        "Built foundational web applications, RESTful APIs, relational data models, and component-driven UI architectures with strong testing discipline.",
      focusAreas: [
        "Responsive UI Engineering",
        "REST API Design",
        "Relational Schema Modeling",
        "Unit & Integration Testing",
      ],
      technologies: ["TypeScript", "React", "Angular", "Java", "Spring Boot", "PostgreSQL"],
      architecturalGrowth:
        "Mastered clean code, SOLID principles, and end-to-end feature ownership from UI state to SQL queries.",
    },
    {
      id: "year-02",
      yearRange: "Year 02",
      phase: "02 / Enterprise Scale",
      roleTitle: "Full Stack Engineer — Enterprise Applications [Editable]",
      organization: "Organization Placeholder — Update in profile.ts",
      location: "Location Placeholder",
      isPlaceholder: true,
      summary:
        "Architected role-based enterprise portals, stateful frontend workflows, secure authentication boundaries, and high-throughput backend services.",
      focusAreas: [
        "Enterprise Security & RBAC",
        "State Management Architecture",
        "API Gateway & Caching",
        "Performance Profiling",
      ],
      technologies: ["Angular", "NgRx", "Spring Security", "Hibernate", "Redis", "Docker"],
      architecturalGrowth:
        "Transitioned from feature implementation to designing modular enterprise layers and caching strategies.",
    },
    {
      id: "year-03",
      yearRange: "Year 03",
      phase: "03 / Distributed & Cloud",
      roleTitle: "Senior Full Stack Engineer — Cloud & Distributed Systems [Editable]",
      organization: "Organization Placeholder — Update in profile.ts",
      location: "Location Placeholder",
      isPlaceholder: true,
      summary:
        "Designed event-driven microservices, containerized Kubernetes deployments, automated CI/CD pipelines, and resilient cross-service messaging.",
      focusAreas: [
        "Event-Driven Microservices",
        "Container Orchestration",
        "Infrastructure as Code",
        "Observability & Fault Tolerance",
      ],
      technologies: ["Apache Kafka", "Kubernetes", "Microsoft Azure", "Terraform", "GitHub Actions", "Microservices"],
      architecturalGrowth:
        "Internalized distributed failure modes: retry policies, dead-letter queues, circuit breakers, and zero-downtime rollouts.",
    },
    {
      id: "year-04",
      yearRange: "Year 04",
      phase: "04 / Applied AI Engineering",
      roleTitle: "Full Stack & AI Engineer — LLM & RAG Systems [Editable]",
      organization: "Organization Placeholder — Update in profile.ts",
      location: "Location Placeholder",
      isPlaceholder: true,
      summary:
        "Engineered production-oriented LLM integrations, hybrid semantic retrieval pipelines, vector search indexing, and streaming AI user interfaces.",
      focusAreas: [
        "Hybrid RAG Pipelines",
        "Vector Search & Reranking",
        "Streaming AI UX",
        "Evaluation & Guardrails",
      ],
      technologies: ["Python", "FastAPI", "LangChain", "LlamaIndex", "Qdrant", "Next.js"],
      architecturalGrowth:
        "Combined classical backend rigor with retrieval engineering, prompt versioning, and citation-grounded synthesis.",
    },
    {
      id: "year-05",
      yearRange: "Year 05",
      phase: "05 / Agentic Systems & Architecture",
      roleTitle: "Senior Full Stack & AI Systems Architect [Editable]",
      organization: "Organization Placeholder — Update in profile.ts",
      location: "Location Placeholder",
      isPlaceholder: true,
      summary:
        "Leading architecture for autonomous multi-agent workflows, MCP tool ecosystems, enterprise AI governance, and cinematic full-stack product engineering.",
      focusAreas: [
        "Multi-Agent Orchestration",
        "Model Context Protocol (MCP)",
        "High-Level & Low-Level Design",
        "AI Observability & Governance",
      ],
      technologies: ["LangGraph", "MCP", "Anthropic Claude", "OpenAI APIs", "Three.js", "System Design"],
      architecturalGrowth:
        "Synthesizing five years of full-stack, cloud, and AI craft into cohesive, auditable intelligent platforms.",
    },
  ],
};

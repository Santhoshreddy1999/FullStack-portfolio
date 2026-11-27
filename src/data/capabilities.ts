export type CapabilityGeometry =
  | "octahedron"
  | "torusKnot"
  | "icosahedron"
  | "dodecahedron"
  | "boxGrid"
  | "ringCore";

export interface EngineeringCapability {
  id: string;
  index: string;
  title: string;
  tagline: string;
  accent: string;
  geometry: CapabilityGeometry;
  iconName:
    | "Layers"
    | "BrainCircuit"
    | "Server"
    | "CloudCog"
    | "Building2"
    | "Network";
  description: string;
  deepDive: string;
  technologies: string[];
  deliverables: string[];
  architecturalFocus: string;
}

export const ENGINEERING_CAPABILITIES: EngineeringCapability[] = [
  {
    id: "full-stack",
    index: "01",
    title: "Full Stack Engineering",
    tagline: "Pixel-precise interfaces coupled to strongly typed API contracts.",
    accent: "#5B8CFF",
    geometry: "octahedron",
    iconName: "Layers",
    description:
      "Architecting cohesive web applications across React, Next.js, Angular, TypeScript, and high-craft interactive visualization layers backed by resilient APIs.",
    deepDive:
      "From design systems and reactive state management (RxJS, NgRx, Redux) to GPU-accelerated 3D scenes and server-rendered edge routes, every UI decision is grounded in accessibility, performance budgets, and maintainable component architecture.",
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Angular",
      "Tailwind CSS",
      "RxJS",
      "Framer Motion",
      "Three.js",
    ],
    deliverables: [
      "Design-system-driven web platforms & dashboards",
      "Real-time collaborative & streaming AI frontends",
      "End-to-end typed BFF & REST/GraphQL integration",
      "Accessible desktop & mobile responsive layouts",
    ],
    architecturalFocus: "Type-safe full-stack contracts & 60 FPS UI responsiveness",
  },
  {
    id: "ai-agentic",
    index: "02",
    title: "AI & Agentic Systems",
    tagline: "Stateful multi-agent orchestration, hybrid RAG, and safe tool calling.",
    accent: "#9B6BFF",
    geometry: "torusKnot",
    iconName: "BrainCircuit",
    description:
      "Designing enterprise-grade LLM systems using LangGraph, LangChain, LlamaIndex, MCP, vector search, reranking, evaluation suites, and deterministic guardrails.",
    deepDive:
      "Moving beyond fragile prompt wrappers into structured cognitive workflows: cyclic agent graphs with human approval checkpoints, access-controlled hybrid retrieval (BM25 + vector + cross-encoder), and span-level AI observability.",
    technologies: [
      "LangGraph",
      "LangChain",
      "LlamaIndex",
      "MCP",
      "OpenAI APIs",
      "Anthropic Claude",
      "Qdrant",
      "Guardrails",
    ],
    deliverables: [
      "Autonomous & human-in-the-loop multi-agent platforms",
      "Citation-backed enterprise RAG knowledge engines",
      "MCP tool servers with least-privilege execution",
      "Evaluation harnesses & prompt/context governance",
    ],
    architecturalFocus: "Deterministic orchestration around probabilistic foundation models",
  },
  {
    id: "backend-architecture",
    index: "03",
    title: "Backend Architecture",
    tagline: "High-integrity JVM and Python services engineered for durability.",
    accent: "#45E4FF",
    geometry: "icosahedron",
    iconName: "Server",
    description:
      "Building fault-tolerant backend platforms with Java, Spring Boot, Python, FastAPI, Node.js, PostgreSQL, Redis, and strict OpenAPI contract governance.",
    deepDive:
      "Combining clean/hexagonal boundaries with transactional integrity, query-plan tuning, multi-tier caching, and secure authentication/RBAC pipelines so business logic stays fast, testable, and decoupled from infrastructure churn.",
    technologies: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Python",
      "FastAPI",
      "Node.js",
      "PostgreSQL",
      "Redis",
    ],
    deliverables: [
      "Domain-aligned microservices & modular monoliths",
      "Async Python AI inference & streaming gateways",
      "High-throughput relational & cache data layers",
      "OpenAPI-first APIs with comprehensive test suites",
    ],
    architecturalFocus: "Predictable latency, ACID integrity, and clean domain boundaries",
  },
  {
    id: "cloud-devops",
    index: "04",
    title: "Cloud & DevOps",
    tagline: "Reproducible containers, Kubernetes orchestration, and automated CI/CD.",
    accent: "#FF9B62",
    geometry: "dodecahedron",
    iconName: "CloudCog",
    description:
      "Shipping production infrastructure across Microsoft Azure, AWS, Docker, Kubernetes, Helm, Terraform, and automated GitHub Actions / Jenkins pipelines.",
    deepDive:
      "Treating infrastructure as versioned, reviewable code: immutable multi-stage Docker images, zero-downtime Kubernetes rollouts, automated health checks, and telemetry dashboards that surface issues before users feel them.",
    technologies: [
      "Microsoft Azure",
      "Docker",
      "Kubernetes",
      "Helm",
      "Terraform",
      "GitHub Actions",
      "Nginx",
      "Linux",
    ],
    deliverables: [
      "Containerized multi-service Kubernetes topologies",
      "Terraform Infrastructure-as-Code modules",
      "Automated CI/CD pipelines with quality gates",
      "Prometheus, Grafana & cloud observability stacks",
    ],
    architecturalFocus: "Zero-downtime releases, declarative IaC, and full-stack telemetry",
  },
  {
    id: "enterprise-apps",
    index: "05",
    title: "Enterprise Applications",
    tagline: "Mission-critical platforms with RBAC, workflows, and auditability.",
    accent: "#38BDF8",
    geometry: "boxGrid",
    iconName: "Building2",
    description:
      "Delivering multi-tenant enterprise portals, approval engines, financial dashboards, and workflow automation built for governance, compliance, and long-term scale.",
    deepDive:
      "Enterprise engineering demands more than happy-path screens: granular role-based access control, immutable audit logs, complex form/state lifecycles, graceful error recovery, and predictable maintainability across teams.",
    technologies: [
      "Angular",
      "Spring Boot",
      "Spring Security",
      "PostgreSQL",
      "Azure App Services",
      "Kafka",
      "OpenAPI",
      "Playwright",
    ],
    deliverables: [
      "Role-based multi-tenant admin & operational portals",
      "Event-driven approval & business workflow engines",
      "Audit-ready data management & reporting modules",
      "Automated E2E & regression testing suites",
    ],
    architecturalFocus: "Governance, security engineering, and operational clarity",
  },
  {
    id: "system-design",
    index: "06",
    title: "System Design",
    tagline: "Distributed architectures engineered for failure modes and scale.",
    accent: "#FBBF24",
    geometry: "ringCore",
    iconName: "Network",
    description:
      "Crafting High-Level and Low-Level architectures featuring Kafka event streams, circuit breakers, API gateways, hexagonal boundaries, and horizontal elasticity.",
    deepDive:
      "Good system design starts with explicit trade-offs: consistency vs. availability, sync vs. async boundaries, retry/DLQ semantics, backpressure handling, and clear documentation so every engineer understands how data flows.",
    technologies: [
      "System Design",
      "Apache Kafka",
      "Distributed Systems",
      "DDD",
      "Clean Architecture",
      "Hexagonal Architecture",
      "Circuit Breakers",
      "API Gateway",
    ],
    deliverables: [
      "HLD / LLD architecture blueprints & RFCs",
      "Event-driven Kafka & Redis Streams topologies",
      "Resilience patterns (retry, DLQ, circuit breaking)",
      "Capacity modeling & performance optimization",
    ],
    architecturalFocus: "Explicit trade-offs, fault isolation, and horizontal scalability",
  },
];

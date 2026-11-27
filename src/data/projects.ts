export type ProjectDomain =
  | "ai-agents"
  | "distributed-cloud"
  | "enterprise-fullstack"
  | "developer-quality";

export type ProjectArtworkMotif =
  | "neural-mesh"
  | "vector-prism"
  | "infra-orbital"
  | "ledger-waves"
  | "biometric-grid"
  | "code-lattice"
  | "event-streams"
  | "spatial-blocks"
  | "bi-matrix"
  | "shield-gateway"
  | "qa-circuit"
  | "telemetry-arc"
  | "pulse-radar"
  | "synapse-rings"
  | "workflow-dag";

export interface ProjectArchNode {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
}

export interface ProjectArchEdge {
  from: string;
  to: string;
  label: string;
}

export interface ProjectChallenge {
  challenge: string;
  decision: string;
  tradeoff: string;
}

export interface PortfolioProject {
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  domain: ProjectDomain;
  domainLabel: string;
  status: "Architectural Concept" | "Interactive Prototype" | "Reference Blueprint";
  statusDetail: string;
  accent: string;
  secondaryAccent: string;
  motif: ProjectArtworkMotif;
  description: string;
  problemStatement: string;
  architectureOverview: string;
  stack: string[];
  features: string[];
  challenges: ProjectChallenge[];
  diagram: {
    nodes: ProjectArchNode[];
    edges: ProjectArchEdge[];
  };
  links: {
    github: string | null;
    demo: string | null;
    availabilityNote: string;
  };
  disclaimer?: string;
}

export const PROJECT_DOMAINS: { id: ProjectDomain | "all"; label: string }[] = [
  { id: "all", label: "All 15 Blueprints" },
  { id: "ai-agents", label: "AI & Agentic Systems" },
  { id: "distributed-cloud", label: "Distributed & Cloud" },
  { id: "enterprise-fullstack", label: "Enterprise & Full-Stack" },
  { id: "developer-quality", label: "Developer & QA Platforms" },
];

export const PROJECTS: PortfolioProject[] = [
  {
    number: "01",
    slug: "nexus-ai",
    title: "NEXUS AI",
    subtitle: "Autonomous Multi-Agent Enterprise Platform",
    domain: "ai-agents",
    domainLabel: "AI & Agentic Systems",
    status: "Architectural Concept",
    statusDetail:
      "Reference architecture & interactive blueprint. Repository and live deployment slots are intentionally unlinked until production release.",
    accent: "#9B6BFF",
    secondaryAccent: "#45E4FF",
    motif: "neural-mesh",
    description:
      "Enterprise multi-agent orchestration engine coordinating specialized planning, retrieval, and execution agents through MCP tool boundaries, persistent memory, and human approval checkpoints.",
    problemStatement:
      "Single-prompt LLM integrations break down on multi-step enterprise workflows requiring tool authorization, state persistence across long-running tasks, and auditable human governance.",
    architectureOverview:
      "Uses a LangGraph cyclic state machine backed by PostgreSQL checkpoints and Redis working memory. Specialist agents communicate through structured typed contracts and invoke external enterprise systems strictly through scoped MCP tool servers with interrupt-based human approval gates.",
    stack: [
      "Python",
      "FastAPI",
      "LangGraph",
      "LangChain",
      "MCP",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
    ],
    features: [
      "Multi-agent orchestration",
      "Agent-to-agent communication",
      "Tool execution",
      "Long-term memory",
      "Human approval workflows",
      "Agent observability",
      "Dynamic task planning",
    ],
    challenges: [
      {
        challenge: "Preventing infinite agent loops and runaway token spend during ambiguous planning.",
        decision: "Bounded LangGraph step budgets with explicit critic nodes and deterministic exit criteria.",
        tradeoff: "Slightly more upfront graph schema design in exchange for predictable runtime cost and reliability.",
      },
      {
        challenge: "Safely granting agents write access to internal enterprise tools.",
        decision: "Isolate all mutations behind scoped MCP servers with LangGraph interrupt checkpoints requiring human sign-off.",
        tradeoff: "Adds manual latency on high-risk actions while guaranteeing auditability and zero unapproved side effects.",
      },
    ],
    diagram: {
      nodes: [
        { id: "ui", label: "Operator Console", role: "Streaming SSE + Approvals", x: 110, y: 170 },
        { id: "api", label: "FastAPI Control Plane", role: "Auth + Budget Guard", x: 310, y: 170 },
        { id: "graph", label: "LangGraph Supervisor", role: "Dynamic Task Planner", x: 520, y: 170 },
        { id: "mem", label: "Postgres + Redis", role: "Checkpoints & Memory", x: 520, y: 310 },
        { id: "mcp", label: "MCP Tool Servers", role: "Scoped Enterprise Tools", x: 760, y: 110 },
        { id: "obs", label: "Agent Telemetry", role: "Spans, Costs & Evals", x: 760, y: 250 },
      ],
      edges: [
        { from: "ui", to: "api", label: "SSE / Approval" },
        { from: "api", to: "graph", label: "Run Graph" },
        { from: "graph", to: "mem", label: "State Sync" },
        { from: "graph", to: "mcp", label: "MCP Tools" },
        { from: "graph", to: "obs", label: "Trace Spans" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Concept blueprint — source repository and live deployment pending implementation.",
    },
  },
  {
    number: "02",
    slug: "intelligent-rag",
    title: "INTELLIGENT RAG",
    subtitle: "Enterprise Knowledge Intelligence",
    domain: "ai-agents",
    domainLabel: "AI & Agentic Systems",
    status: "Reference Blueprint",
    statusDetail:
      "End-to-end hybrid retrieval & citation architecture blueprint ready for enterprise knowledge ingestion.",
    accent: "#45E4FF",
    secondaryAccent: "#5B8CFF",
    motif: "vector-prism",
    description:
      "Citation-backed enterprise knowledge platform combining OCR document parsing, hybrid dense+lexical search, cross-encoder reranking, and strict access-controlled retrieval.",
    problemStatement:
      "Naive vector-only RAG misses exact domain identifiers, leaks restricted documents across teams, and hallucinates answers without traceable source evidence.",
    architectureOverview:
      "Separates offline ingestion (OCR, hierarchical parent-child chunking, ACL tagging) from online query execution (hybrid Qdrant + BM25 search filtered by caller ACLs, cross-encoder reranking, and citation-enforced generation).",
    stack: [
      "Python",
      "LangChain",
      "LlamaIndex",
      "OpenAI",
      "Qdrant",
      "PostgreSQL",
      "FastAPI",
    ],
    features: [
      "Document ingestion",
      "OCR and parsing",
      "Hybrid retrieval",
      "Semantic search",
      "Reranking",
      "Citation-backed answers",
      "Access-controlled knowledge retrieval",
    ],
    challenges: [
      {
        challenge: "Enforcing document-level permissions without post-filtering empty result sets.",
        decision: "Index tenant and security-group ACL metadata directly inside Qdrant payload indexes for pre-filtering.",
        tradeoff: "Requires ACL sync jobs on permission updates, but guarantees zero unauthorized chunk leakage.",
      },
      {
        challenge: "Preserving table and section context inside fixed-size embeddings.",
        decision: "Adopt parent-child chunking where fine child chunks drive retrieval and parent sections supply synthesis context.",
        tradeoff: "Increases storage footprint modestly while sharply improving synthesis coherence.",
      },
    ],
    diagram: {
      nodes: [
        { id: "ingest", label: "OCR & Parser", role: "PDF / Docs / Tables", x: 110, y: 110 },
        { id: "chunk", label: "LlamaIndex Pipeline", role: "Semantic Chunk + Embed", x: 330, y: 110 },
        { id: "qdrant", label: "Qdrant + Postgres", role: "Hybrid Index + ACLs", x: 560, y: 110 },
        { id: "query", label: "FastAPI Query API", role: "ACL Injection + Rewrite", x: 190, y: 280 },
        { id: "rerank", label: "Cross-Encoder", role: "Top-K Reranking", x: 520, y: 280 },
        { id: "llm", label: "Cited Synthesis", role: "Verified Grounded Output", x: 780, y: 200 },
      ],
      edges: [
        { from: "ingest", to: "chunk", label: "Structured Text" },
        { from: "chunk", to: "qdrant", label: "Vectors + ACL" },
        { from: "query", to: "qdrant", label: "Filtered Hybrid" },
        { from: "qdrant", to: "rerank", label: "Top-40" },
        { from: "rerank", to: "llm", label: "Top-6 Cited" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Reference blueprint — connect repository URL in src/data/projects.ts once published.",
    },
  },
  {
    number: "03",
    slug: "devops-ai",
    title: "DEVOPS AI",
    subtitle: "Autonomous Infrastructure Assistant",
    domain: "distributed-cloud",
    domainLabel: "Distributed & Cloud",
    status: "Architectural Concept",
    statusDetail:
      "Infrastructure diagnostics and remediation copilot blueprint with strict read-first safety boundaries.",
    accent: "#FF9B62",
    secondaryAccent: "#5B8CFF",
    motif: "infra-orbital",
    description:
      "AI-assisted infrastructure engineering companion that analyzes Kubernetes cluster state, inspects deployment logs, investigates incidents, and drafts reviewed Terraform/CI remediations.",
    problemStatement:
      "During production incidents, engineers lose critical time correlating fragmented pod events, Terraform state diffs, CI deployment commits, and container logs.",
    architectureOverview:
      "LangGraph diagnostic agents query read-only Kubernetes, Azure, and log telemetry adapters to build a root-cause hypothesis tree. Proposed remediations are generated as reviewable PRs or Terraform plans rather than unreviewed direct cluster mutations.",
    stack: ["Python", "Kubernetes", "Docker", "Terraform", "Azure", "LangGraph"],
    features: [
      "Infrastructure analysis",
      "Deployment monitoring",
      "Log analysis",
      "Incident investigation",
      "AI-assisted remediation",
      "CI/CD integration",
    ],
    challenges: [
      {
        challenge: "Preventing autonomous infrastructure changes from escalating an outage.",
        decision: "Default to read-only cluster RBAC; emit remediation as Terraform plan diffs and GitHub PRs requiring engineer merge.",
        tradeoff: "Not fully zero-touch auto-healing, but safe for real enterprise SRE governance.",
      },
      {
        challenge: "High-volume container logs overflowing LLM context windows.",
        decision: "Pre-cluster anomalous log templates and correlate timestamps against recent deployment SHAs before model reasoning.",
        tradeoff: "Requires deterministic log-parsing pipeline upstream of the agent.",
      },
    ],
    diagram: {
      nodes: [
        { id: "k8s", label: "AKS / Kubernetes", role: "Pods, Events & Logs", x: 120, y: 120 },
        { id: "cicd", label: "CI/CD & Terraform", role: "Deploy Diffs & IaC", x: 120, y: 280 },
        { id: "correlate", label: "Incident Correlator", role: "Anomaly Filtering", x: 370, y: 200 },
        { id: "agent", label: "LangGraph SRE Agent", role: "Root-Cause Graph", x: 590, y: 200 },
        { id: "pr", label: "Remediation Gate", role: "Terraform Plan / PR", x: 800, y: 200 },
      ],
      edges: [
        { from: "k8s", to: "correlate", label: "Read-Only Telemetry" },
        { from: "cicd", to: "correlate", label: "Change Context" },
        { from: "correlate", to: "agent", label: "Signal Bundle" },
        { from: "agent", to: "pr", label: "Reviewed Fix" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Concept blueprint — source repository and sandbox link will be added upon implementation.",
    },
  },
  {
    number: "04",
    slug: "finflow",
    title: "FINFLOW",
    subtitle: "Intelligent Personal Finance Platform",
    domain: "enterprise-fullstack",
    domainLabel: "Enterprise & Full-Stack",
    status: "Architectural Concept",
    statusDetail:
      "Full-stack personal finance architecture combining event-driven ledger updates with interactive analytics.",
    accent: "#5B8CFF",
    secondaryAccent: "#34D399",
    motif: "ledger-waves",
    description:
      "Full-stack personal finance management system delivering expense tracking, automated transaction categorization, budget guardrails, and interactive cash-flow dashboards.",
    problemStatement:
      "Personal finance tools often conflate immutable financial ledger entries with derived monthly analytics, causing sluggish dashboards and fragile reconciliation.",
    architectureOverview:
      "Spring Boot services maintain an ACID PostgreSQL double-entry ledger while publishing transaction events to Kafka. Downstream consumers update categorization models and warm Redis budget aggregates served to Angular and React dashboard views.",
    stack: [
      "Angular",
      "React",
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Kafka",
    ],
    features: [
      "Expense tracking",
      "Financial analytics",
      "Budget management",
      "Transaction categorization",
      "Interactive dashboards",
    ],
    challenges: [
      {
        challenge: "Keeping real-time budget alerts consistent with concurrent transaction imports.",
        decision: "Use idempotent import keys and Kafka-driven read projections cached in Redis per billing period.",
        tradeoff: "Eventual consistency of sub-second analytics in exchange for crisp write throughput.",
      },
      {
        challenge: "Supporting both dense desktop financial tables and responsive daily expense capture.",
        decision: "Separate heavy analytical views from rapid mobile capture flows using shared typed OpenAPI contracts.",
        tradeoff: "Requires strict API versioning discipline across frontend clients.",
      },
    ],
    diagram: {
      nodes: [
        { id: "web", label: "Angular / React UI", role: "Dashboards & Capture", x: 115, y: 200 },
        { id: "ledger", label: "Spring Boot Ledger", role: "ACID Transactions", x: 340, y: 200 },
        { id: "pg", label: "PostgreSQL", role: "Immutable Ledger DB", x: 560, y: 115 },
        { id: "kafka", label: "Kafka Event Bus", role: "Categorization Stream", x: 560, y: 285 },
        { id: "redis", label: "Redis Analytics", role: "Budget Aggregates", x: 785, y: 200 },
      ],
      edges: [
        { from: "web", to: "ledger", label: "REST / OAuth2" },
        { from: "ledger", to: "pg", label: "JPA Write" },
        { from: "ledger", to: "kafka", label: "Txn Event" },
        { from: "kafka", to: "redis", label: "Rollup Cache" },
        { from: "redis", to: "web", label: "Fast Reads" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Concept blueprint — prototype code and deployment links pending.",
    },
  },
  {
    number: "05",
    slug: "medicore-ai",
    title: "MEDICORE AI",
    subtitle: "Personal Healthcare Intelligence",
    domain: "ai-agents",
    domainLabel: "AI & Agentic Systems",
    status: "Architectural Concept",
    statusDetail:
      "Privacy-first personal health information organizer blueprint with strict non-diagnostic AI safety guardrails.",
    accent: "#34D399",
    secondaryAccent: "#45E4FF",
    motif: "biometric-grid",
    description:
      "Privacy-conscious personal healthcare information organizer helping individuals structure lab reports, medication schedules, appointment reminders, and plain-language document summaries.",
    problemStatement:
      "Patients struggle to keep scattered prescriptions, lab PDFs, and appointment histories organized while needing safe, understandable summaries without exposing sensitive records.",
    architectureOverview:
      "Built on a React frontend and FastAPI privacy boundary with field-level encryption in PostgreSQL, isolated per-user vector namespaces, PII redaction filters prior to LLM calls, and mandatory safety guardrails preventing diagnostic claims.",
    stack: ["React", "Python", "FastAPI", "LLMs", "PostgreSQL", "Vector DB"],
    features: [
      "Health information organization",
      "Medication tracking",
      "Appointment reminders",
      "Document intelligence",
      "AI-powered health information assistant",
      "Privacy-conscious architecture",
    ],
    challenges: [
      {
        challenge: "Ensuring AI responses remain informational and never act as clinical diagnosis or treatment advice.",
        decision: "Enforce deterministic safety guardrails, response classifiers, source-only summarization prompts, and persistent clinical disclaimers.",
        tradeoff: "Restricts open-ended symptom speculation to prioritize user safety and responsible AI boundaries.",
      },
      {
        challenge: "Minimizing sensitive health data exposure across retrieval and inference layers.",
        decision: "Isolate vector embeddings per user namespace, strip direct identifiers before model inference, and encrypt records at rest.",
        tradeoff: "Adds key-management complexity while establishing strong privacy-by-design defaults.",
      },
    ],
    diagram: {
      nodes: [
        { id: "ui", label: "React Health Vault", role: "Schedules & Records", x: 115, y: 200 },
        { id: "api", label: "FastAPI Privacy Gate", role: "PII Redaction & Auth", x: 345, y: 200 },
        { id: "pg", label: "Encrypted Postgres", role: "Meds & Appointments", x: 575, y: 115 },
        { id: "vec", label: "Isolated Vector DB", role: "Per-User Doc Index", x: 575, y: 285 },
        { id: "guard", label: "Safety Guardrail LLM", role: "Non-Diagnostic Info", x: 795, y: 200 },
      ],
      edges: [
        { from: "ui", to: "api", label: "TLS 1.3" },
        { from: "api", to: "pg", label: "Encrypted CRUD" },
        { from: "api", to: "vec", label: "Scoped Search" },
        { from: "api", to: "guard", label: "Redacted Context" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Concept blueprint — not a deployed clinical tool.",
    },
    disclaimer:
      "Medical Safety Disclaimer: MEDICORE AI is an architectural concept for personal health record organization and informational document summarization only. Generated AI output is never a medical diagnosis, clinical recommendation, or substitute for qualified healthcare professionals.",
  },
  {
    number: "06",
    slug: "codepilot-ai",
    title: "CODEPILOT AI",
    subtitle: "Intelligent Developer Workspace",
    domain: "developer-quality",
    domainLabel: "Developer & QA Platforms",
    status: "Interactive Prototype",
    statusDetail:
      "Developer engineering workspace blueprint pairing AST repository indexing with LangGraph code-review workflows.",
    accent: "#5B8CFF",
    secondaryAccent: "#9B6BFF",
    motif: "code-lattice",
    description:
      "AI-powered engineering workspace that maps repository architecture, explains unfamiliar modules, reviews pull requests for edge cases, generates documentation, and drafts unit tests.",
    problemStatement:
      "Onboarding into large polyglot codebases and reviewing complex pull requests consume substantial senior engineering bandwidth when context lives across dozens of files.",
    architectureOverview:
      "Combines a React/TypeScript workspace UI with a Python LangGraph orchestration engine that indexes symbol dependency graphs, scopes minimal context windows for LLM calls, and runs deterministic validation checks on generated tests.",
    stack: ["React", "TypeScript", "Python", "LangGraph", "LLM APIs"],
    features: [
      "Repository analysis",
      "Code explanation",
      "Automated documentation",
      "Pull request analysis",
      "Test generation",
      "AI coding workflows",
    ],
    challenges: [
      {
        challenge: "Avoiding hallucinated API signatures when analyzing large multi-service repositories.",
        decision: "Ground prompts in parsed AST symbol graphs and exact file slices rather than raw text chunking.",
        tradeoff: "Requires language-specific AST parsers, yielding dramatically higher code review precision.",
      },
      {
        challenge: "Keeping generated tests meaningful rather than brittle mock mirrors.",
        decision: "Instruct test agents to target public behavioral contracts and verify generated specs against a sandbox test runner.",
        tradeoff: "Longer generation turnaround time due to sandbox execution loop.",
      },
    ],
    diagram: {
      nodes: [
        { id: "ws", label: "React / TS Workspace", role: "Diff & Graph Explorer", x: 115, y: 200 },
        { id: "ast", label: "AST Symbol Indexer", role: "Call & Dep Graph", x: 355, y: 120 },
        { id: "pr", label: "PR Diff Analyzer", role: "Change Impact Scope", x: 355, y: 280 },
        { id: "lg", label: "LangGraph Agents", role: "Explain / Review / Test", x: 605, y: 200 },
        { id: "llm", label: "LLM Providers", role: "Structured Code Synth", x: 810, y: 200 },
      ],
      edges: [
        { from: "ws", to: "ast", label: "Repo Snapshot" },
        { from: "ws", to: "pr", label: "PR Context" },
        { from: "ast", to: "lg", label: "Symbol Graph" },
        { from: "pr", to: "lg", label: "Targeted Hunks" },
        { from: "lg", to: "llm", label: "Scoped Prompt" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Blueprint & workflow specification — public repo link pending.",
    },
  },
  {
    number: "07",
    slug: "eventmesh",
    title: "EVENTMESH",
    subtitle: "Distributed Event-Driven Platform",
    domain: "distributed-cloud",
    domainLabel: "Distributed & Cloud",
    status: "Reference Blueprint",
    statusDetail:
      "Fault-tolerant Kafka messaging backbone blueprint featuring transactional outbox, tiered retries, DLQ, and tracing.",
    accent: "#F472B6",
    secondaryAccent: "#5B8CFF",
    motif: "event-streams",
    description:
      "Resilient distributed event-streaming backbone enabling loosely coupled microservices to exchange domain events with guaranteed delivery, dead-letter isolation, and end-to-end tracing.",
    problemStatement:
      "Synchronous HTTP service chains amplify cascading outages and lose domain events whenever downstream dependencies experience transient latency spikes.",
    architectureOverview:
      "Java Spring Boot producers commit state and outbox events atomically to PostgreSQL, stream through partitioned Kafka topics, deduplicate consumers via Redis, and isolate poison pills in tiered retry and dead-letter topics monitored via distributed tracing.",
    stack: [
      "Java",
      "Spring Boot",
      "Kafka",
      "Redis",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
    ],
    features: [
      "Event streaming",
      "Service communication",
      "Retry strategies",
      "Dead-letter queues",
      "Distributed tracing",
      "Fault tolerance",
    ],
    challenges: [
      {
        challenge: "Eliminating dual-write divergence between database commits and Kafka publication.",
        decision: "Implement the transactional outbox pattern with ordered relay publishing.",
        tradeoff: "Introduces slight relay lag (milliseconds) in exchange for strict atomic consistency.",
      },
      {
        challenge: "Preventing a single malformed message from blocking an entire Kafka partition.",
        decision: "Route failures to non-blocking delayed retry topics and a replayable DLQ after max attempts.",
        tradeoff: "Relaxes strict global ordering for failed records while keeping healthy throughput unblocked.",
      },
    ],
    diagram: {
      nodes: [
        { id: "prod", label: "Spring Producers", role: "Atomic Outbox Write", x: 115, y: 200 },
        { id: "kafka", label: "Kafka Cluster", role: "Partitioned Event Log", x: 355, y: 200 },
        { id: "cons", label: "Consumer Mesh", role: "Idempotent Workers", x: 585, y: 120 },
        { id: "dlq", label: "Retry & DLQ", role: "Backoff + Replay", x: 585, y: 290 },
        { id: "trace", label: "Redis + Tracing", role: "Dedup & W3C Spans", x: 805, y: 200 },
      ],
      edges: [
        { from: "prod", to: "kafka", label: "Outbox Relay" },
        { from: "kafka", to: "cons", label: "Partition Poll" },
        { from: "cons", to: "dlq", label: "Failed Event" },
        { from: "dlq", to: "kafka", label: "Operator Replay" },
        { from: "cons", to: "trace", label: "Dedup + Trace" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Reference architecture blueprint — see Section 06 System Architecture Lab for interactive trace simulation.",
    },
  },
  {
    number: "08",
    slug: "pgverse",
    title: "PGVERSE",
    subtitle: "Smart Property & PG Management",
    domain: "enterprise-fullstack",
    domainLabel: "Enterprise & Full-Stack",
    status: "Architectural Concept",
    statusDetail:
      "Multi-property tenant, billing, and maintenance management platform blueprint on Angular, Spring Boot, and Azure.",
    accent: "#38BDF8",
    secondaryAccent: "#9B6BFF",
    motif: "spatial-blocks",
    description:
      "End-to-end property and paying-guest operations platform unifying unit occupancy, digital tenant onboarding, automated rent invoicing, maintenance ticketing, and occupancy analytics.",
    problemStatement:
      "Small and mid-scale property operators still rely on fragmented spreadsheets and chat threads to track rooms, rent dues, security deposits, and maintenance SLAs.",
    architectureOverview:
      "Multi-tenant Angular web portal backed by Spring Boot domain APIs, PostgreSQL relational schemas for rooms/leases/ledgers, Redis caching for occupancy lookups, and Azure App Services + Storage for lease documents.",
    stack: ["Angular", "Spring Boot", "Java", "PostgreSQL", "Redis", "Azure"],
    features: [
      "Property management",
      "Tenant onboarding",
      "Rent management",
      "Payment tracking",
      "Maintenance requests",
      "Analytics dashboard",
    ],
    challenges: [
      {
        challenge: "Modeling flexible room-sharing beds, pro-rated mid-month check-ins, and deposit adjustments.",
        decision: "Design explicit BedAllocation and BillingCycle entities with immutable invoice line items in PostgreSQL.",
        tradeoff: "More normalized schema tables, eliminating silent balance drift over multi-month leases.",
      },
      {
        challenge: "Ensuring strict tenant vs. property-owner data isolation across shared endpoints.",
        decision: "Enforce property-scoped Spring Security RBAC guards on every controller and repository query.",
        tradeoff: "Additional authorization test matrix per role, safeguarding multi-tenant boundaries.",
      },
    ],
    diagram: {
      nodes: [
        { id: "ng", label: "Angular Portal", role: "Owner & Tenant Views", x: 115, y: 200 },
        { id: "sb", label: "Spring Boot API", role: "RBAC + Billing Engine", x: 365, y: 200 },
        { id: "pg", label: "PostgreSQL", role: "Properties & Leases", x: 615, y: 115 },
        { id: "redis", label: "Redis Cache", role: "Occupancy & Sessions", x: 615, y: 285 },
        { id: "az", label: "Azure Cloud", role: "App Service + Blob Docs", x: 810, y: 200 },
      ],
      edges: [
        { from: "ng", to: "sb", label: "JWT REST" },
        { from: "sb", to: "pg", label: "Transactional" },
        { from: "sb", to: "redis", label: "Hot Lookups" },
        { from: "sb", to: "az", label: "KYC / Invoices" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Concept blueprint — repository and live demo not yet published.",
    },
  },
  {
    number: "09",
    slug: "bi-insight",
    title: "BI INSIGHT",
    subtitle: "AI-Powered Business Intelligence",
    domain: "ai-agents",
    domainLabel: "AI & Agentic Systems",
    status: "Architectural Concept",
    statusDetail:
      "Conversational analytics blueprint featuring AST-validated read-only SQL generation and interactive visual reporting.",
    accent: "#45E4FF",
    secondaryAccent: "#FF9B62",
    motif: "bi-matrix",
    description:
      "Conversational business intelligence workspace enabling teams to explore relational datasets in natural language with read-only SQL safeguards, interactive charts, and executive narrative summaries.",
    problemStatement:
      "Business stakeholders wait days for ad-hoc analytical queries while naive text-to-SQL prototypes risk unsafe mutations, heavy table scans, or unverified metric formulas.",
    architectureOverview:
      "FastAPI backend pairs a curated semantic metric layer with LLM SQL generation, passes generated queries through a strict SQL AST validator (SELECT-only, table allowlist, row/timeout caps), executes on a read-only PostgreSQL role, and returns structured chart specs to React.",
    stack: ["Python", "FastAPI", "React", "PostgreSQL", "LLMs"],
    features: [
      "Natural language analytics",
      "SQL generation with safeguards",
      "Interactive charts",
      "Report generation",
      "Data insights",
      "Conversational BI",
    ],
    challenges: [
      {
        challenge: "Eliminating SQL injection, destructive statements, and unbounded full-table scans from LLM SQL.",
        decision: "Combine AST parsing (SELECT-only allowlist), read-only DB credentials, statement_timeout, and mandatory LIMIT injection.",
        tradeoff: "Blocks arbitrary DDL/CTE tricks while ensuring database stability and security.",
      },
      {
        challenge: "Preventing inconsistent KPI definitions across conversational follow-ups.",
        decision: "Ground prompts in a versioned semantic schema registry defining canonical business metrics and joins.",
        tradeoff: "Requires initial semantic layer curation before onboarding new databases.",
      },
    ],
    diagram: {
      nodes: [
        { id: "ui", label: "React BI Canvas", role: "Charts & Narratives", x: 115, y: 200 },
        { id: "api", label: "FastAPI Engine", role: "Semantic Metric Layer", x: 345, y: 200 },
        { id: "llm", label: "LLM SQL Planner", role: "Schema-Grounded SQL", x: 565, y: 115 },
        { id: "guard", label: "SQL AST Safeguard", role: "Read-Only + Row Cap", x: 565, y: 285 },
        { id: "pg", label: "Postgres Read Replica", role: "Timeout-Bounded Query", x: 800, y: 200 },
      ],
      edges: [
        { from: "ui", to: "api", label: "NL Question" },
        { from: "api", to: "llm", label: "Schema Context" },
        { from: "llm", to: "guard", label: "Candidate SQL" },
        { from: "guard", to: "pg", label: "Safe SELECT" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Concept blueprint — source repository pending publication.",
    },
  },
  {
    number: "10",
    slug: "api-sentinel",
    title: "API SENTINEL",
    subtitle: "Intelligent API Management",
    domain: "distributed-cloud",
    domainLabel: "Distributed & Cloud",
    status: "Reference Blueprint",
    statusDetail:
      "Centralized API gateway, distributed rate-limiting, security policy, and traffic analytics architecture.",
    accent: "#FF9B62",
    secondaryAccent: "#9B6BFF",
    motif: "shield-gateway",
    description:
      "Enterprise API governance and edge protection platform uniting Kong gateway policies, Redis sliding-window rate limiting, JWT authentication, traffic analytics, and security enforcement.",
    problemStatement:
      "Growing microservice estates suffer from duplicated auth middleware, inconsistent throttling, and blind spots around abusive clients or deprecating endpoints.",
    architectureOverview:
      "Kong serves as the high-throughput data plane enforcing OAuth2/JWT verification and Redis-backed rate limits, while a Spring Boot control plane manages route policies, OpenAPI validation, and aggregated traffic telemetry across Kubernetes clusters.",
    stack: ["Java", "Spring Boot", "Kong", "Redis", "Docker", "Kubernetes"],
    features: [
      "API gateway management",
      "Authentication",
      "Rate limiting",
      "Traffic analytics",
      "API monitoring",
      "Security policies",
    ],
    challenges: [
      {
        challenge: "Enforcing accurate distributed rate limits across horizontally scaled gateway nodes without bottlenecking latency.",
        decision: "Use Redis Lua atomic sliding-window counters with local burst smoothing and fail-open fallback policy.",
        tradeoff: "Minor sub-percent tolerance during Redis failover in exchange for zero gateway outages.",
      },
      {
        challenge: "Updating routing and security policies without dropping live enterprise connections.",
        decision: "Declarative Kong configuration synced atomically from the Spring Boot control plane with schema pre-validation.",
        tradeoff: "Requires strict versioned policy migrations instead of ad-hoc gateway edits.",
      },
    ],
    diagram: {
      nodes: [
        { id: "clients", label: "External Consumers", role: "Web / Partner / Mobile", x: 110, y: 200 },
        { id: "kong", label: "Kong Data Plane", role: "JWT + Rate Limit Edge", x: 350, y: 200 },
        { id: "redis", label: "Redis Counters", role: "Sliding Window Quotas", x: 565, y: 115 },
        { id: "ctrl", label: "Spring Control Plane", role: "Policies & Telemetry", x: 565, y: 290 },
        { id: "svcs", label: "Upstream Services", role: "Kubernetes Workloads", x: 805, y: 200 },
      ],
      edges: [
        { from: "clients", to: "kong", label: "HTTPS" },
        { from: "kong", to: "redis", label: "Quota Check" },
        { from: "ctrl", to: "kong", label: "Policy Sync" },
        { from: "kong", to: "svcs", label: "Authorized Route" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Reference blueprint — repository link will be added once published.",
    },
  },
  {
    number: "11",
    slug: "autonomous-qa",
    title: "AUTONOMOUS QA",
    subtitle: "AI Testing Platform",
    domain: "developer-quality",
    domainLabel: "Developer & QA Platforms",
    status: "Architectural Concept",
    statusDetail:
      "AI-orchestrated Playwright browser verification, failure triage, and regression reporting platform blueprint.",
    accent: "#34D399",
    secondaryAccent: "#9B6BFF",
    motif: "qa-circuit",
    description:
      "Intelligent quality engineering platform that derives test scenarios from requirements, executes Playwright browser suites, triages flaky vs. real regressions, and generates trace-linked reports.",
    problemStatement:
      "End-to-end browser test suites frequently decay due to minor DOM shifts and ambiguous failure logs, causing teams to ignore or disable regression checks.",
    architectureOverview:
      "FastAPI orchestrates containerized Playwright runners while LangGraph agents synthesize semantic locator test cases, inspect DOM/network failure traces, distinguish product defects from selector drift, and publish visual reports to a React dashboard.",
    stack: ["Python", "Playwright", "React", "LangGraph", "FastAPI"],
    features: [
      "Test case generation",
      "Browser automation",
      "Regression testing",
      "Failure analysis",
      "Test reporting",
      "AI-assisted debugging",
    ],
    challenges: [
      {
        challenge: "Preventing AI self-healing selectors from masking genuine broken UX regressions.",
        decision: "Restrict auto-suggestions to reviewable PR diffs; never silently mutate passing assertions during CI runs.",
        tradeoff: "Preserves high signal integrity in CI pipelines rather than chasing vanity green builds.",
      },
      {
        challenge: "Running parallel browser suites cleanly without shared state contamination.",
        decision: "Spin ephemeral isolated browser contexts with deterministic seed fixtures per spec worker.",
        tradeoff: "Slightly higher CI compute footprint for reproducible, flake-resistant test runs.",
      },
    ],
    diagram: {
      nodes: [
        { id: "ui", label: "React QA Console", role: "Suites & Trace Viewer", x: 115, y: 200 },
        { id: "api", label: "FastAPI Orchestrator", role: "Run Scheduler", x: 345, y: 200 },
        { id: "pw", label: "Playwright Workers", role: "Headless Chromium", x: 580, y: 120 },
        { id: "lg", label: "LangGraph Triage", role: "Root-Cause Classifier", x: 580, y: 290 },
        { id: "rep", label: "Trace Artifacts", role: "Screenshots & Diffs", x: 805, y: 200 },
      ],
      edges: [
        { from: "ui", to: "api", label: "Trigger Suite" },
        { from: "api", to: "pw", label: "Parallel Specs" },
        { from: "pw", to: "rep", label: "DOM + Traces" },
        { from: "rep", to: "lg", label: "Failure Triage" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Concept blueprint — prototype repository pending.",
    },
  },
  {
    number: "12",
    slug: "velocity",
    title: "VELOCITY",
    subtitle: "Smart Motorcycle Companion",
    domain: "enterprise-fullstack",
    domainLabel: "Enterprise & Full-Stack",
    status: "Architectural Concept",
    statusDetail:
      "Multi-client rider companion architecture spanning web, mobile, fuel/mileage analytics, and interactive route maps.",
    accent: "#FF9B62",
    secondaryAccent: "#45E4FF",
    motif: "telemetry-arc",
    description:
      "Connected motorcycle ownership and touring companion tracking bike profiles, fuel efficiency curves, maintenance intervals, riding expenses, trip histories, and interactive map routes.",
    problemStatement:
      "Riders maintain fuel logs, service booklets, route GPX exports, and component wear histories in separate apps that never synthesize true cost-per-kilometer or upcoming service needs.",
    architectureOverview:
      "Angular web dashboard and React Native mobile app share a Java Spring Boot backend backed by PostgreSQL spatial/time-series tables and Maps API integration for route visualization and service interval scheduling.",
    stack: [
      "Angular",
      "React Native",
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Maps API",
    ],
    features: [
      "Motorcycle profiles",
      "Fuel tracking",
      "Mileage analytics",
      "Service reminders",
      "Expense tracking",
      "Trip history",
      "Interactive maps",
    ],
    challenges: [
      {
        challenge: "Handling offline fuel and trip logging during remote highway or mountain rides.",
        decision: "Design client-side offline queues with monotonic odometer validation and conflict-safe sync endpoints.",
        tradeoff: "Adds sync reconciliation states on mobile while ensuring zero lost ride data.",
      },
      {
        challenge: "Computing accurate mileage curves across partial vs. full-tank refills.",
        decision: "Tag partial fills explicitly and compute tank-to-tank efficiency intervals only across verified full-tank anchors.",
        tradeoff: "Avoids misleading spiky fuel-economy charts.",
      },
    ],
    diagram: {
      nodes: [
        { id: "clients", label: "Angular + React Native", role: "Web & Mobile Rider UI", x: 115, y: 200 },
        { id: "api", label: "Spring Boot API", role: "Garage & Trip Engine", x: 375, y: 200 },
        { id: "pg", label: "PostgreSQL", role: "Bikes, Fuel & Trips", x: 630, y: 120 },
        { id: "maps", label: "Maps API Layer", role: "Routes & Elevation", x: 630, y: 285 },
        { id: "alerts", label: "Reminder Scheduler", role: "Odometer / Date Alerts", x: 815, y: 200 },
      ],
      edges: [
        { from: "clients", to: "api", label: "Offline-Safe Sync" },
        { from: "api", to: "pg", label: "Odometer Ledger" },
        { from: "api", to: "maps", label: "Route Polyline" },
        { from: "pg", to: "alerts", label: "Service Thresholds" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Concept blueprint — source repository and mobile builds pending.",
    },
  },
  {
    number: "13",
    slug: "cloudpulse",
    title: "CLOUDPULSE",
    subtitle: "Cloud Observability Platform",
    domain: "distributed-cloud",
    domainLabel: "Distributed & Cloud",
    status: "Reference Blueprint",
    statusDetail:
      "Unified Kubernetes & Azure metrics, logs, alerting, and deployment health observability blueprint.",
    accent: "#5B8CFF",
    secondaryAccent: "#45E4FF",
    motif: "pulse-radar",
    description:
      "Unified cloud observability control center correlating Prometheus metrics, container logs, Kubernetes deployment health, and actionable SLO alerting across Azure environments.",
    problemStatement:
      "Engineering teams switch between disconnected metric panels, raw log streams, and deployment pipelines during high-pressure triage, slowing mean time to understand.",
    architectureOverview:
      "Python ingestion and correlation services federate Prometheus time-series metrics, Grafana dashboard specs, and Kubernetes deployment events on Azure, streaming unified health topologies and alert timelines to a React observability console.",
    stack: [
      "Python",
      "React",
      "Docker",
      "Kubernetes",
      "Prometheus",
      "Grafana",
      "Azure",
    ],
    features: [
      "Application monitoring",
      "Metrics visualization",
      "Log analytics",
      "Infrastructure health",
      "Alerts",
      "Deployment insights",
    ],
    challenges: [
      {
        challenge: "Preventing metric cardinality explosion from unbounded pod or request labels.",
        decision: "Enforce strict label allowlists and recording rules at Prometheus scrape boundaries.",
        tradeoff: "Limits ad-hoc high-cardinality grouping in favor of predictable TSDB memory and query speed.",
      },
      {
        challenge: "Reducing alert fatigue across multi-service dependencies.",
        decision: "Shift from noisy CPU threshold pages to multi-window SLO error-budget burn alerts correlated with recent deploys.",
        tradeoff: "Requires teams to define explicit availability and latency SLOs per service.",
      },
    ],
    diagram: {
      nodes: [
        { id: "az", label: "Azure / K8s Nodes", role: "Exporters & Logs", x: 115, y: 200 },
        { id: "prom", label: "Prometheus TSDB", role: "Metrics + Recording", x: 365, y: 120 },
        { id: "py", label: "Python Correlator", role: "Deploy & Log Signals", x: 365, y: 285 },
        { id: "graf", label: "Grafana + Alerts", role: "SLO Burn Rules", x: 615, y: 200 },
        { id: "ui", label: "React Pulse Console", role: "Live Health Topology", x: 815, y: 200 },
      ],
      edges: [
        { from: "az", to: "prom", label: "Scrape /metrics" },
        { from: "az", to: "py", label: "Events & Logs" },
        { from: "prom", to: "graf", label: "PromQL" },
        { from: "py", to: "ui", label: "Correlated Stream" },
        { from: "graf", to: "ui", label: "Alert State" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Reference blueprint — repository link pending implementation.",
    },
  },
  {
    number: "14",
    slug: "synapse-chat",
    title: "SYNAPSE CHAT",
    subtitle: "Real-Time AI Collaboration",
    domain: "ai-agents",
    domainLabel: "AI & Agentic Systems",
    status: "Architectural Concept",
    statusDetail:
      "Real-time WebSocket workspace uniting team chat, shared documents, semantic search, and context-aware AI assistance.",
    accent: "#9B6BFF",
    secondaryAccent: "#5B8CFF",
    motif: "synapse-rings",
    description:
      "Real-time collaborative team messaging and workspace hub integrating low-latency WebSockets, document sharing, semantic conversation search, and an embedded memory-aware AI collaborator.",
    problemStatement:
      "Team decisions buried in fast-moving chat threads and shared files are rarely accessible when teammates or AI assistants need accurate historical context.",
    architectureOverview:
      "Node.js WebSocket gateways fan out live presence and room messages over Redis pub/sub while persisting threads to PostgreSQL. A Python LangChain service asynchronously indexes shared documents and thread summaries for semantic search and context-aware mentions.",
    stack: [
      "React",
      "Node.js",
      "WebSockets",
      "Python",
      "LangChain",
      "Redis",
      "PostgreSQL",
    ],
    features: [
      "Real-time messaging",
      "AI assistant",
      "Document sharing",
      "Collaborative workspaces",
      "AI-powered search",
      "Conversation memory",
    ],
    challenges: [
      {
        challenge: "Scaling stateful WebSocket connections across multiple Node.js instances without missed messages.",
        decision: "Back socket rooms with Redis pub/sub fan-out and monotonic sequence IDs for client gap recovery on reconnect.",
        tradeoff: "Slightly more client sync state in exchange for seamless horizontal socket scaling.",
      },
      {
        challenge: "Preventing the AI assistant from leaking private channel context into public workspaces.",
        decision: "Scope all LangChain memory stores and semantic indexes strictly to workspace + channel membership IDs.",
        tradeoff: "Requires channel-scoped indexing updates whenever permissions change.",
      },
    ],
    diagram: {
      nodes: [
        { id: "ui", label: "React Workspace", role: "Threads & Shared Docs", x: 115, y: 200 },
        { id: "ws", label: "Node.js WS Hub", role: "Presence & Streaming", x: 345, y: 200 },
        { id: "redis", label: "Redis Pub/Sub", role: "Cross-Node Fan-Out", x: 565, y: 115 },
        { id: "pg", label: "PostgreSQL", role: "Messages & ACLs", x: 565, y: 285 },
        { id: "ai", label: "Python LangChain", role: "Memory & AI Search", x: 800, y: 200 },
      ],
      edges: [
        { from: "ui", to: "ws", label: "WebSocket" },
        { from: "ws", to: "redis", label: "Room Fan-Out" },
        { from: "ws", to: "pg", label: "Persist Thread" },
        { from: "ws", to: "ai", label: "@AI Mention" },
        { from: "ai", to: "pg", label: "Scoped Recall" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Concept blueprint — source repository pending publication.",
    },
  },
  {
    number: "15",
    slug: "enterprise-flow",
    title: "ENTERPRISE FLOW",
    subtitle: "Full Stack Workflow Automation",
    domain: "enterprise-fullstack",
    domainLabel: "Enterprise & Full-Stack",
    status: "Reference Blueprint",
    statusDetail:
      "Hybrid deterministic + AI-assisted enterprise workflow automation platform spanning Angular, Spring Boot, Kafka, Azure, and LangGraph.",
    accent: "#FBBF24",
    secondaryAccent: "#5B8CFF",
    motif: "workflow-dag",
    description:
      "Enterprise workflow orchestration suite combining visual approval chains, Kafka event-driven execution, role-based governance, executive dashboards, and AI-assisted intelligent task routing.",
    problemStatement:
      "Cross-departmental enterprise processes stall in manual email approvals and brittle point-to-point scripts lacking visibility, audit trails, or intelligent triage.",
    architectureOverview:
      "Angular enterprise portal feeds a Java Spring Boot workflow state machine backed by PostgreSQL and Kafka event orchestration. A Python LangGraph routing service classifies incoming requests and suggests priority/assignee routing inside strict RBAC and audit boundaries on Azure.",
    stack: [
      "Angular",
      "Java",
      "Spring Boot",
      "Python",
      "Kafka",
      "PostgreSQL",
      "Azure",
      "LangGraph",
    ],
    features: [
      "Workflow orchestration",
      "Approval processes",
      "Event-driven execution",
      "AI-assisted task routing",
      "Role-based access",
      "Enterprise dashboards",
    ],
    challenges: [
      {
        challenge: "Combining deterministic compliance approvals with probabilistic AI task classification.",
        decision: "Keep state transitions strictly deterministic in Spring Boot; constrain LangGraph to advisory triage and routing scores.",
        tradeoff: "Maintains full compliance auditability while still automating high-volume triage.",
      },
      {
        challenge: "Supporting evolving workflow definitions without breaking in-flight long-running approvals.",
        decision: "Version workflow DAG blueprints immutably so running instances finish on their pinned definition version.",
        tradeoff: "Requires maintaining backward-compatible step handlers across active schema versions.",
      },
    ],
    diagram: {
      nodes: [
        { id: "ng", label: "Angular Enterprise UI", role: "DAG Designer & Inbox", x: 115, y: 200 },
        { id: "sb", label: "Spring Workflow Core", role: "RBAC + State Machine", x: 345, y: 200 },
        { id: "kafka", label: "Kafka Event Bus", role: "Async Step Execution", x: 575, y: 120 },
        { id: "lg", label: "Python LangGraph", role: "AI Task Routing", x: 575, y: 285 },
        { id: "az", label: "Postgres + Azure", role: "Audit Log & Cloud Host", x: 805, y: 200 },
      ],
      edges: [
        { from: "ng", to: "sb", label: "RBAC API" },
        { from: "sb", to: "kafka", label: "Step Events" },
        { from: "kafka", to: "lg", label: "Triage Request" },
        { from: "lg", to: "sb", label: "Route Proposal" },
        { from: "sb", to: "az", label: "Immutable Audit" },
      ],
    },
    links: {
      github: null,
      demo: null,
      availabilityNote: "Reference blueprint — repository and hosted environment pending.",
    },
  },
];

export const PROJECT_BY_SLUG = new Map(PROJECTS.map((p) => [p.slug, p]));

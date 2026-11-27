"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Database,
  FlaskConical,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
  XCircle,
} from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  MODE A: LANGGRAPH MULTI-AGENT + HUMAN-IN-THE-LOOP SIMULATOR               */
/* -------------------------------------------------------------------------- */

interface AgentStep {
  id: string;
  node: string;
  role: string;
  latencyMs: number;
  payload: string;
  requiresApproval?: boolean;
}

interface AgentScenario {
  id: string;
  title: string;
  tag: string;
  prompt: string;
  accent: string;
  approvalAction: string;
  approvedResult: string;
  rejectedResult: string;
  steps: AgentStep[];
}

const AGENT_SCENARIOS: AgentScenario[] = [
  {
    id: "aks-oom",
    title: "AKS Pod OOMKilled Triage",
    tag: "DevOps AI + MCP",
    prompt:
      "Investigate repeated OOMKilled restarts on payment-worker pods in aks-prod-east and propose a safe Helm fix.",
    accent: "#FF9B62",
    approvalAction:
      "Open GitHub PR bumping payment-worker memory limit 512Mi → 1024Mi & enabling JVM MaxRAMPercentage=75",
    approvedResult:
      "Checkpoint resumed. Signed PR #418 opened against infra/helm-charts with zero direct cluster mutation. Audit event logged.",
    rejectedResult:
      "Human operator rejected mutation. Graph terminated cleanly at checkpoint chk_9f2a with diagnostic report only.",
    steps: [
      {
        id: "guard",
        node: "Policy & Guardrails",
        role: "Safety Gate",
        latencyMs: 38,
        payload:
          '{ "intent": "sre_diagnostics", "pii_detected": false, "cluster_rbac": "read_only" }',
      },
      {
        id: "plan",
        node: "LangGraph Supervisor",
        role: "Task Planner",
        latencyMs: 210,
        payload:
          '{ "plan": ["mcp.k8s.describe_pod", "mcp.prom.query_rss", "draft_helm_pr"], "max_steps": 6 }',
      },
      {
        id: "mcp",
        node: "MCP Tool Sandbox",
        role: "Read-Only Telemetry",
        latencyMs: 145,
        payload:
          '{ "tool": "mcp.k8s.events", "exit_code": 137, "rss_peak_mb": 511.8, "limit_mb": 512, "cause": "JVM heap + native metaspace spike" }',
      },
      {
        id: "interrupt",
        node: "Human Approval Interrupt",
        role: "Governance Gate",
        latencyMs: 0,
        requiresApproval: true,
        payload:
          '{ "interrupt": "awaiting_human_signoff", "proposed_diff": "charts/payment-worker/values.yaml (+2/-1)", "risk": "low_reversible" }',
      },
      {
        id: "synth",
        node: "Execution & Audit Trace",
        role: "Final Synthesis",
        latencyMs: 120,
        payload:
          '{ "status": "completed", "checkpoint_id": "chk_9f2a", "trace_spans": 5 }',
      },
    ],
  },
  {
    id: "kafka-outbox",
    title: "Kafka Dual-Write Remediation",
    tag: "EventMesh + Spring",
    prompt:
      "Audit checkout-service for lost order-created events during broker hiccups and generate a Transactional Outbox migration.",
    accent: "#5B8CFF",
    approvalAction:
      "Stage Flyway SQL migration V14__outbox_events.sql & Spring OutboxRelay component branch",
    approvedResult:
      "Migration & OutboxRelay branch staged cleanly with idempotent consumer key check and DLQ topology tests.",
    rejectedResult:
      "Human operator paused staging. Architectural RFC saved without modifying repository branches.",
    steps: [
      {
        id: "guard",
        node: "Policy & Guardrails",
        role: "Safety Gate",
        latencyMs: 32,
        payload:
          '{ "intent": "architecture_audit", "repo_scope": "checkout-service", "write_locked": true }',
      },
      {
        id: "plan",
        node: "LangGraph Supervisor",
        role: "Task Planner",
        latencyMs: 195,
        payload:
          '{ "plan": ["mcp.ast.scan_tx", "detect_dual_write", "propose_outbox_schema"], "max_steps": 5 }',
      },
      {
        id: "mcp",
        node: "MCP AST Analyzer",
        role: "Static Inspection",
        latencyMs: 162,
        payload:
          '{ "finding": "OrderService.java:84 calls kafkaTemplate.send() inside @Transactional without outbox", "risk": "event_loss_on_broker_timeout" }',
      },
      {
        id: "interrupt",
        node: "Human Approval Interrupt",
        role: "Governance Gate",
        latencyMs: 0,
        requiresApproval: true,
        payload:
          '{ "interrupt": "awaiting_engineer_approval", "artifacts": ["V14__outbox_events.sql", "OutboxRelay.java"] }',
      },
      {
        id: "synth",
        node: "Execution & Audit Trace",
        role: "Final Synthesis",
        latencyMs: 112,
        payload:
          '{ "status": "completed", "checkpoint_id": "chk_4c8d", "trace_spans": 5 }',
      },
    ],
  },
  {
    id: "rag-acl",
    title: "Enterprise RAG Citation Audit",
    tag: "Intelligent RAG",
    prompt:
      "Verify whether Q3 architecture RFC retrieval properly enforces RBAC filters and grounds claims in verified citations.",
    accent: "#9B6BFF",
    approvalAction:
      "Promote updated Qdrant payload index + cross-encoder threshold (0.68) to staging evaluation suite",
    approvedResult:
      "Staging eval suite scheduled with 0 ACL leaks and strict refusal enabled below 0.68 reranker confidence.",
    rejectedResult:
      "Promotion declined. Evaluation report exported for manual threshold calibration.",
    steps: [
      {
        id: "guard",
        node: "Policy & Guardrails",
        role: "Safety Gate",
        latencyMs: 29,
        payload:
          '{ "intent": "rag_eval_audit", "tenant_isolation": "enforced", "pii_redaction": true }',
      },
      {
        id: "plan",
        node: "LangGraph Supervisor",
        role: "Task Planner",
        latencyMs: 184,
        payload:
          '{ "plan": ["mcp.qdrant.inspect_acl", "run_golden_eval_set", "propose_threshold"], "max_steps": 5 }',
      },
      {
        id: "mcp",
        node: "MCP Retrieval Probe",
        role: "ACL + Reranker Check",
        latencyMs: 138,
        payload:
          '{ "acl_leaks": 0, "bm25_recall": 0.78, "hybrid_rerank_recall": 0.94, "ungrounded_claims": 0 }',
      },
      {
        id: "interrupt",
        node: "Human Approval Interrupt",
        role: "Governance Gate",
        latencyMs: 0,
        requiresApproval: true,
        payload:
          '{ "interrupt": "awaiting_release_signoff", "target_env": "staging", "rerank_min_score": 0.68 }',
      },
      {
        id: "synth",
        node: "Execution & Audit Trace",
        role: "Final Synthesis",
        latencyMs: 105,
        payload:
          '{ "status": "completed", "checkpoint_id": "chk_7e1b", "trace_spans": 5 }',
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  MODE B: HYBRID RAG + ACL PRE-FILTER + RERANKER VISUALIZER                 */
/* -------------------------------------------------------------------------- */

type RagRole = "engineering" | "finance" | "guest";
type RagStrategy = "vector" | "bm25" | "hybrid-rerank";

interface RagChunk {
  id: string;
  docTitle: string;
  section: string;
  acl: RagRole[];
  excerpt: string;
  scores: Record<string, { vector: number; bm25: number; rerank: number }>;
}

const RAG_QUERIES = [
  {
    id: "q-dlq",
    label: "How does EventMesh isolate poison messages in Kafka?",
  },
  {
    id: "q-sql",
    label: "What prevents LLM SQL injection in BI Insight?",
  },
  {
    id: "q-budget",
    label: "What are Q4 enterprise cloud spend guardrails?",
  },
];

const RAG_CHUNKS: RagChunk[] = [
  {
    id: "CHK-101",
    docTitle: "RFC-07 · EventMesh Kafka Topology",
    section: "§4.2 Tiered Retries & DLQ",
    acl: ["engineering", "guest"],
    excerpt:
      "Poison payloads bypass blocking consumer loops via non-blocking delayed retry topics (1m, 5m, 30m) before landing in an operator-replayable Dead-Letter Queue.",
    scores: {
      "q-dlq": { vector: 0.89, bm25: 0.92, rerank: 0.97 },
      "q-sql": { vector: 0.24, bm25: 0.11, rerank: 0.08 },
      "q-budget": { vector: 0.22, bm25: 0.14, rerank: 0.11 },
    },
  },
  {
    id: "CHK-204",
    docTitle: "SEC-09 · BI Insight Query Safeguards",
    section: "§2.1 SQL AST Allowlist",
    acl: ["engineering", "finance", "guest"],
    excerpt:
      "Every generated SQL query passes a strict AST parser allowing only SELECT statements against allowlisted views, executes under a read-only PostgreSQL role, and injects statement_timeout + LIMIT caps.",
    scores: {
      "q-dlq": { vector: 0.21, bm25: 0.09, rerank: 0.06 },
      "q-sql": { vector: 0.91, bm25: 0.88, rerank: 0.98 },
      "q-budget": { vector: 0.35, bm25: 0.18, rerank: 0.21 },
    },
  },
  {
    id: "CHK-309",
    docTitle: "FIN-Q4 · Cloud Cost & Token Budgets (Restricted)",
    section: "§3.4 Provisioned AI Spend Caps",
    acl: ["finance"],
    excerpt:
      "Q4 Azure AKS and LLM inference budgets enforce per-tenant token quotas in Redis with automated alert triggers at 75% monthly burn.",
    scores: {
      "q-dlq": { vector: 0.18, bm25: 0.12, rerank: 0.07 },
      "q-sql": { vector: 0.31, bm25: 0.19, rerank: 0.14 },
      "q-budget": { vector: 0.88, bm25: 0.91, rerank: 0.96 },
    },
  },
  {
    id: "CHK-412",
    docTitle: "OPS-13 · AKS Horizontal Autoscaling Notes",
    section: "§1.3 Memory & Budget Guardrails",
    acl: ["engineering", "finance"],
    excerpt:
      "Containerized API and worker pods separate synchronous latency pools from batch AI workers with PodDisruptionBudgets and Prometheus burn-rate alerts.",
    scores: {
      "q-dlq": { vector: 0.64, bm25: 0.42, rerank: 0.51 },
      "q-sql": { vector: 0.44, bm25: 0.25, rerank: 0.19 },
      "q-budget": { vector: 0.79, bm25: 0.62, rerank: 0.74 },
    },
  },
  {
    id: "CHK-518",
    docTitle: "SEC-01 · MCP Least-Privilege Tool Contracts",
    section: "§5.0 Scoped OAuth & Audits",
    acl: ["engineering"],
    excerpt:
      "Agent tool calls execute inside ephemeral sandboxes with JSON-schema parameter validation and interrupt-based human approval before mutating external state.",
    scores: {
      "q-dlq": { vector: 0.52, bm25: 0.31, rerank: 0.39 },
      "q-sql": { vector: 0.68, bm25: 0.51, rerank: 0.61 },
      "q-budget": { vector: 0.41, bm25: 0.29, rerank: 0.28 },
    },
  },
];

export function AiEngineeringLabSection() {
  const [labMode, setLabMode] = useState<"agent" | "rag">("agent");

  /* Mode A state */
  const [scenarioId, setScenarioId] = useState(AGENT_SCENARIOS[0].id);
  const scenario =
    AGENT_SCENARIOS.find((s) => s.id === scenarioId) ?? AGENT_SCENARIOS[0];
  const [stepCursor, setStepCursor] = useState<number>(-1);
  const [approvalState, setApprovalState] = useState<
    "idle" | "waiting" | "approved" | "rejected"
  >("idle");
  const [isRunning, setIsRunning] = useState(false);

  const resetAgentRun = () => {
    setIsRunning(false);
    setStepCursor(-1);
    setApprovalState("idle");
  };

  useEffect(() => {
    resetAgentRun();
  }, [scenarioId]);

  useEffect(() => {
    if (!isRunning) return;
    if (stepCursor >= scenario.steps.length - 1) {
      setIsRunning(false);
      return;
    }

    const currentStep = scenario.steps[stepCursor];
    if (currentStep?.requiresApproval && approvalState === "waiting") {
      return;
    }

    const timer = setTimeout(() => {
      const next = stepCursor + 1;
      setStepCursor(next);
      if (scenario.steps[next]?.requiresApproval) {
        setApprovalState("waiting");
      }
    }, 680);

    return () => clearTimeout(timer);
  }, [isRunning, stepCursor, scenario, approvalState]);

  const startAgentRun = () => {
    setStepCursor(0);
    setApprovalState("idle");
    setIsRunning(true);
  };

  const handleApprovalDecision = (decision: "approved" | "rejected") => {
    setApprovalState(decision);
    setStepCursor(scenario.steps.length - 1);
    setIsRunning(false);
  };

  /* Mode B state */
  const [ragQueryId, setRagQueryId] = useState(RAG_QUERIES[0].id);
  const [ragRole, setRagRole] = useState<RagRole>("engineering");
  const [ragStrategy, setRagStrategy] = useState<RagStrategy>("hybrid-rerank");

  const rankedChunks = useMemo(() => {
    return RAG_CHUNKS.map((chunk) => {
      const allowed = chunk.acl.includes(ragRole);
      const s = chunk.scores[ragQueryId];
      const activeScore =
        ragStrategy === "vector"
          ? s.vector
          : ragStrategy === "bm25"
            ? s.bm25
            : s.rerank;
      return { ...chunk, allowed, activeScore, rawScores: s };
    }).sort((a, b) => {
      if (a.allowed !== b.allowed) return a.allowed ? -1 : 1;
      return b.activeScore - a.activeScore;
    });
  }, [ragQueryId, ragRole, ragStrategy]);

  const topAuthorized = rankedChunks.find((c) => c.allowed && c.activeScore >= 0.65);

  return (
    <section id="ai-lab" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="06B"
            eyebrow="Interactive AI Engineering Laboratory"
            title="Live Agentic Graph & Hybrid RAG Sandbox"
            description="Experience how deterministic guardrails, human-in-the-loop interrupts, MCP tool sandboxing, and ACL-filtered Hybrid RAG behave in real time inside a safe client-side architectural simulation."
            className="mb-8 lg:mb-12"
          />

          <div className="mb-10 inline-flex self-start rounded-xl border border-white/10 bg-[#0E1019] p-1 lg:mb-12">
            <button
              type="button"
              onClick={() => setLabMode("agent")}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs transition-colors",
                labMode === "agent"
                  ? "bg-[#9B6BFF]/22 text-[#F5F7FF] border border-[#9B6BFF]/45"
                  : "text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              <Bot className="h-3.5 w-3.5 text-[#9B6BFF]" />
              LangGraph Agent Sandbox
            </button>
            <button
              type="button"
              onClick={() => setLabMode("rag")}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs transition-colors",
                labMode === "rag"
                  ? "bg-[#45E4FF]/18 text-[#F5F7FF] border border-[#45E4FF]/45"
                  : "text-[#969BB0] hover:text-[#F5F7FF]"
              )}
            >
              <Database className="h-3.5 w-3.5 text-[#45E4FF]" />
              Hybrid RAG &amp; ACL Lab
            </button>
          </div>
        </div>

        {/* MODE A: MULTI-AGENT SANDBOX */}
        {labMode === "agent" && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {AGENT_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setScenarioId(sc.id)}
                    className={cn(
                      "cursor-pointer rounded-xl border px-3.5 py-2 text-left transition-colors",
                      sc.id === scenario.id
                        ? "border-[#5B8CFF]/60 bg-[#5B8CFF]/15 text-[#F5F7FF]"
                        : "border-white/10 bg-[#0B0E17] text-[#969BB0] hover:text-[#F5F7FF]"
                    )}
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#45E4FF]">
                      {sc.tag}
                    </span>
                    <span className="font-display text-xs font-semibold">
                      {sc.title}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={startAgentRun}
                  disabled={isRunning || approvalState === "waiting"}
                  data-cursor="RUN"
                >
                  <Play className="h-3.5 w-3.5" />
                  Run Agent Graph
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAgentRun}
                  disabled={stepCursor === -1}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Scenario Prompt Box */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#080A12] p-4">
              <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-[#969BB0]">
                <span className="inline-flex items-center gap-1.5 text-[#45E4FF]">
                  <Terminal className="h-3.5 w-3.5" />
                  Operator Goal Prompt
                </span>
                <Badge variant="muted">Deterministic Simulation</Badge>
              </div>
              <p className="mt-2 font-mono text-xs leading-relaxed text-[#F5F7FF] sm:text-sm">
                &ldquo;{scenario.prompt}&rdquo;
              </p>
            </div>

            {/* Step-by-Step Execution Waterfall */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-7">
                {scenario.steps.map((step, idx) => {
                  const reached = idx <= stepCursor;
                  const active = idx === stepCursor;
                  const isPausedHere =
                    step.requiresApproval && approvalState === "waiting";

                  return (
                    <motion.div
                      key={step.id}
                      initial={false}
                      animate={{
                        opacity: reached ? 1 : 0.42,
                        scale: active ? 1.01 : 1,
                      }}
                      className={cn(
                        "rounded-2xl border p-4 transition-colors",
                        isPausedHere
                          ? "border-[#FF9B62]/70 bg-[#FF9B62]/10"
                          : reached
                            ? "border-[#5B8CFF]/40 bg-[#101425]"
                            : "border-white/[0.07] bg-[#0B0D16]"
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] text-[#45E4FF]">
                            0{idx + 1}
                          </span>
                          <span className="font-display text-sm font-semibold text-[#F5F7FF]">
                            {step.node}
                          </span>
                          <span className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#969BB0]">
                            {step.role}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#969BB0]">
                          {isPausedHere
                            ? "INTERRUPT PAUSED"
                            : reached
                              ? step.latencyMs > 0
                                ? `${step.latencyMs}ms`
                                : approvalState.toUpperCase()
                              : "PENDING"}
                        </span>
                      </div>

                      {reached && (
                        <pre className="mt-3 overflow-x-auto rounded-lg border border-white/[0.07] bg-[#07080D] p-3 font-mono text-[11px] leading-relaxed text-[#C7D4FF]">
                          {step.payload}
                        </pre>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Governance & Human-in-the-Loop Control Panel */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A0D16] p-5 lg:col-span-5">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#9B6BFF]">
                    <FlaskConical className="h-4 w-4" />
                    Governance &amp; Checkpoint Console
                  </div>

                  {stepCursor === -1 && (
                    <div className="mt-6 rounded-xl border border-dashed border-white/15 p-5 text-center">
                      <Sparkles className="mx-auto h-6 w-6 text-[#45E4FF]" />
                      <p className="mt-3 font-display text-base font-semibold text-[#F5F7FF]">
                        Ready to Execute Graph
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#969BB0]">
                        Click <strong>Run Agent Graph</strong> to observe how
                        guardrails, MCP tool calls, and human-in-the-loop
                        interrupts coordinate safely.
                      </p>
                    </div>
                  )}

                  {approvalState === "waiting" && (
                    <div className="mt-5 rounded-2xl border border-[#FF9B62]/50 bg-[#FF9B62]/10 p-5">
                      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#FF9B62]">
                        <AlertTriangle className="h-4 w-4" />
                        HUMAN APPROVAL REQUIRED
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#F5F7FF]">
                        {scenario.approvalAction}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-[#FFD0B3]">
                        Graph state is checkpointed in PostgreSQL. No external
                        mutation executes without explicit operator sign-off.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2.5">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprovalDecision("approved")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve Action
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprovalDecision("rejected")}
                        >
                          <XCircle className="h-3.5 w-3.5 text-[#FF9B62]" />
                          Reject &amp; Halt
                        </Button>
                      </div>
                    </div>
                  )}

                  {(approvalState === "approved" ||
                    approvalState === "rejected") && (
                    <div
                      className={cn(
                        "mt-5 rounded-2xl border p-5",
                        approvalState === "approved"
                          ? "border-[#34D399]/45 bg-[#34D399]/10"
                          : "border-[#FF9B62]/45 bg-[#FF9B62]/10"
                      )}
                    >
                      <p
                        className={cn(
                          "flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider",
                          approvalState === "approved"
                            ? "text-[#34D399]"
                            : "text-[#FF9B62]"
                        )}
                      >
                        {approvalState === "approved" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        {approvalState === "approved"
                          ? "Approved & Completed"
                          : "Safely Aborted"}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#F5F7FF]">
                        {approvalState === "approved"
                          ? scenario.approvedResult
                          : scenario.rejectedResult}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 font-mono text-[11px] text-[#969BB0]">
                  <div className="flex items-center justify-between">
                    <span>Pattern</span>
                    <span className="text-[#F5F7FF]">
                      LangGraph Cyclic + MCP
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span>Safety Guarantee</span>
                    <span className="text-[#45E4FF]">
                      Zero Unreviewed Side Effects
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE B: HYBRID RAG + ACL PRE-FILTER LAB */}
        {labMode === "rag" && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 border-b border-white/[0.08] pb-6 lg:grid-cols-12">
              {/* Query Selector */}
              <div className="lg:col-span-6">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#969BB0]">
                  1. Select Enterprise Query
                </p>
                <div className="space-y-2">
                  {RAG_QUERIES.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setRagQueryId(q.id)}
                      className={cn(
                        "block w-full cursor-pointer rounded-xl border px-3.5 py-2.5 text-left text-xs transition-colors sm:text-sm",
                        ragQueryId === q.id
                          ? "border-[#45E4FF]/60 bg-[#45E4FF]/12 text-[#F5F7FF]"
                          : "border-white/10 bg-[#0B0E17] text-[#969BB0] hover:text-[#F5F7FF]"
                      )}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACL Role + Strategy Controls */}
              <div className="space-y-4 lg:col-span-6">
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#969BB0]">
                    2. Caller RBAC Role (Qdrant Pre-Filter)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { id: "engineering", label: "Engineering Role" },
                        { id: "finance", label: "Finance Role" },
                        { id: "guest", label: "External Guest" },
                      ] as const
                    ).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRagRole(r.id)}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                          ragRole === r.id
                            ? "border-[#9B6BFF]/65 bg-[#9B6BFF]/20 text-[#F5F7FF]"
                            : "border-white/10 bg-[#0B0E17] text-[#969BB0]"
                        )}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-[#9B6BFF]" />
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#969BB0]">
                    3. Retrieval Pipeline Mode
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { id: "vector", label: "Dense Vector Only" },
                        { id: "bm25", label: "BM25 Lexical Only" },
                        {
                          id: "hybrid-rerank",
                          label: "Hybrid RRF + Cross-Encoder",
                        },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setRagStrategy(m.id)}
                        className={cn(
                          "cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                          ragStrategy === m.id
                            ? "border-[#45E4FF]/65 bg-[#45E4FF]/15 text-[#F5F7FF]"
                            : "border-white/10 bg-[#0B0E17] text-[#969BB0]"
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ranked Chunk Results + Cited Grounding Output */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-7">
                {rankedChunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className={cn(
                      "rounded-2xl border p-4 transition-all",
                      !chunk.allowed
                        ? "border-[#FF9B62]/30 bg-[#150E10]/70 opacity-65"
                        : chunk.activeScore >= 0.7
                          ? "border-[#45E4FF]/50 bg-[#0F1828]"
                          : "border-white/[0.08] bg-[#0B0E17]"
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#5B8CFF]">
                          {chunk.id}
                        </span>
                        <span className="font-display text-sm font-semibold text-[#F5F7FF]">
                          {chunk.docTitle}
                        </span>
                      </div>

                      {chunk.allowed ? (
                        <Badge variant="cyan">
                          Score {(chunk.activeScore * 100).toFixed(0)}%
                        </Badge>
                      ) : (
                        <Badge variant="orange">
                          <Lock className="h-3 w-3" />
                          Pre-Filtered by ACL
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 font-mono text-[10px] text-[#969BB0]">
                      {chunk.section} · Allowed roles: {chunk.acl.join(", ")}
                    </p>

                    {chunk.allowed ? (
                      <>
                        <p className="mt-2.5 text-xs leading-relaxed text-[#D7DDF2]">
                          {chunk.excerpt}
                        </p>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#5B8CFF] to-[#45E4FF] transition-all duration-500"
                            style={{
                              width: `${Math.round(chunk.activeScore * 100)}%`,
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="mt-2 font-mono text-[11px] text-[#FFB68A]">
                        Chunk excluded at vector index level before LLM prompt
                        assembly — zero unauthorized leakage to role &ldquo;
                        {ragRole}&rdquo;.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Grounded Citation Synthesis Output */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A0D16] p-5 lg:col-span-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#34D399]">
                    Citation-Grounded Synthesis
                  </p>
                  {topAuthorized ? (
                    <div className="mt-4 space-y-4">
                      <p className="text-sm leading-relaxed text-[#F5F7FF]">
                        {topAuthorized.excerpt}{" "}
                        <span className="inline-flex rounded bg-[#45E4FF]/20 px-1.5 py-0.5 font-mono text-[10px] text-[#45E4FF]">
                          [{topAuthorized.id}]
                        </span>
                      </p>
                      <div className="rounded-xl border border-white/[0.08] bg-[#07080D] p-3.5 font-mono text-[11px] text-[#969BB0]">
                        <p className="text-[#C7D4FF]">
                          Source: {topAuthorized.docTitle}
                        </p>
                        <p className="mt-1">Section: {topAuthorized.section}</p>
                        <p className="mt-1 text-[#34D399]">
                          Vector {(topAuthorized.rawScores.vector * 100).toFixed(0)}
                          % · BM25 {(topAuthorized.rawScores.bm25 * 100).toFixed(0)}
                          % · Rerank{" "}
                          {(topAuthorized.rawScores.rerank * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-[#FF9B62]/40 bg-[#FF9B62]/10 p-4">
                      <p className="font-mono text-xs font-semibold text-[#FF9B62]">
                        SAFE REFUSAL TRIGGERED
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#FFD0B3]">
                        No authorized evidence chunk exceeded the 65% relevance
                        threshold for role &ldquo;{ragRole}&rdquo;. The
                        synthesizer refuses to answer rather than hallucinating
                        or leaking restricted finance documents.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 font-mono text-[10px] text-[#969BB0]">
                  Tip: Select query #3 (&ldquo;Q4 enterprise cloud spend&rdquo;)
                  and switch role between <strong>Finance</strong> and{" "}
                  <strong>Guest</strong> to watch Qdrant ACL pre-filtering block
                  restricted chunks in real time.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

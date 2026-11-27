export interface BlueprintSnippet {
  filename: string;
  language: string;
  caption: string;
  code: string;
}

export const PROJECT_CODE_BLUEPRINTS: Record<string, BlueprintSnippet> = {
  "nexus-ai": {
    filename: "orchestrator/graph.py",
    language: "Python · LangGraph + MCP",
    caption: "Cyclic supervisor graph with bounded steps and human-approval interrupt before MCP mutations.",
    code: `from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres import PostgresSaver

def build_nexus_graph(checkpointer: PostgresSaver):
    graph = StateGraph(AgentWorkflowState)
    graph.add_node("guardrails", validate_policy_and_pii)
    graph.add_node("supervisor", plan_next_step)
    graph.add_node("mcp_executor", invoke_scoped_mcp_tool)
    graph.add_node("human_gate", request_operator_approval)

    graph.set_entry_point("guardrails")
    graph.add_edge("guardrails", "supervisor")
    graph.add_conditional_edges(
        "supervisor",
        route_by_risk_and_budget,
        {"read_tool": "mcp_executor", "write_tool": "human_gate", "done": END},
    )
    graph.add_edge("human_gate", "mcp_executor")
    graph.add_edge("mcp_executor", "supervisor")

    return graph.compile(
        checkpointer=checkpointer,
        interrupt_before=["human_gate"],
    )`,
  },
  "intelligent-rag": {
    filename: "retrieval/hybrid_acl.py",
    language: "Python · Qdrant + Reranker",
    caption: "Pre-filtered ACL payload query combined with cross-encoder reranking and citation thresholds.",
    code: `from qdrant_client.models import Filter, FieldCondition, MatchAny

async def retrieve_grounded_context(query: str, user_roles: list[str], top_k: int = 6):
    acl_filter = Filter(
        must=[FieldCondition(key="allowed_roles", match=MatchAny(any=user_roles))]
    )
    dense_hits = await qdrant.search(
        collection_name="enterprise_knowledge_v2",
        query_vector=await embed(query),
        query_filter=acl_filter,
        limit=40,
    )
    fused = reciprocal_rank_fusion(dense_hits, bm25_search(query, user_roles))
    reranked = cross_encoder.score(query, fused)
    return [c for c in reranked[:top_k] if c.score >= 0.68]`,
  },
  "devops-ai": {
    filename: "sre/remediation_gate.py",
    language: "Python · Kubernetes + Terraform",
    caption: "Read-only cluster diagnostics emitting reviewable Terraform/Helm pull requests rather than direct writes.",
    code: `async def investigate_pod_incident(namespace: str, pod: str) -> RemediationProposal:
    events = await k8s_readonly.list_pod_events(namespace, pod)
    metrics = await prom_client.query_rss_peak(namespace, pod, window="30m")
    diagnosis = await sre_agent.diagnose(events=events, metrics=metrics)

    # Safety boundary: never mutate live cluster directly from LLM output
    return RemediationProposal(
        root_cause=diagnosis.summary,
        patch_artifact=render_helm_values_diff(diagnosis.recommended_limits),
        delivery="github_pull_request",
        requires_human_merge=True,
    )`,
  },
  finflow: {
    filename: "ledger/TransactionLedgerService.java",
    language: "Java · Spring Boot + Kafka",
    caption: "ACID PostgreSQL ledger write paired with idempotent Kafka event emission for real-time budget rollups.",
    code: `@Service
public class TransactionLedgerService {
    @Transactional
    public LedgerEntry recordTransaction(CreateTxnCommand cmd) {
        if (ledgerRepo.existsByIdempotencyKey(cmd.idempotencyKey())) {
            return ledgerRepo.findByIdempotencyKey(cmd.idempotencyKey());
        }
        LedgerEntry saved = ledgerRepo.save(LedgerEntry.from(cmd));
        outboxRepo.save(OutboxEvent.created("txn.recorded", saved.getId(), saved));
        return saved;
    }
}`,
  },
  "medicore-ai": {
    filename: "privacy/health_guardrail.py",
    language: "Python · FastAPI Safety Layer",
    caption: "PII redaction and mandatory non-diagnostic safety framing before informational document summarization.",
    code: `NON_DIAGNOSTIC_NOTICE = (
    "Informational summary only — not a medical diagnosis or clinical advice."
)

async def summarize_personal_document(user_id: str, doc_id: str) -> SafeSummary:
    raw_text = await encrypted_vault.read_for_owner(user_id=user_id, doc_id=doc_id)
    redacted = pii_scrubber.strip_direct_identifiers(raw_text)
    summary = await llm.summarize_strictly_extractive(redacted)
    guardrail.assert_no_diagnostic_claims(summary)
    return SafeSummary(text=summary, disclaimer=NON_DIAGNOSTIC_NOTICE)`,
  },
  "codepilot-ai": {
    filename: "workspace/ast_context.py",
    language: "Python · AST + LangGraph",
    caption: "Symbol-graph scoping keeps PR reviews anchored to real definitions instead of blind text chunks.",
    code: `def assemble_pr_context(repo_index: SymbolGraph, changed_files: list[str]) -> ContextPack:
    impacted_symbols = repo_index.find_callers(changed_files, depth=2)
    slices = [
        repo_index.read_exact_span(sym.file, sym.start_line, sym.end_line)
        for sym in impacted_symbols[:18]
    ]
    return ContextPack(changed_files=changed_files, grounded_slices=slices)`,
  },
  eventmesh: {
    filename: "messaging/EventMeshConsumer.java",
    language: "Java · Spring Kafka + Redis",
    caption: "Idempotent consumer with Redis deduplication and non-blocking tiered retry / DLQ routing.",
    code: `@KafkaListener(topics = "domain.orders.v1", groupId = "fulfillment-mesh")
public void onOrderEvent(ConsumerRecord<String, DomainEvent> record, Acknowledgment ack) {
    String eventId = record.value().eventId();
    Boolean firstSeen = redis.opsForValue().setIfAbsent("dedup:" + eventId, "1", Duration.ofDays(7));
    if (Boolean.FALSE.equals(firstSeen)) {
        ack.acknowledge();
        return;
    }
    fulfillmentHandler.process(record.value());
    ack.acknowledge();
}`,
  },
  pgverse: {
    filename: "billing/TenantBillingGuard.java",
    language: "Java · Spring Security + JPA",
    caption: "Property-scoped RBAC guard ensuring strict multi-tenant isolation across lease and rent queries.",
    code: `@PreAuthorize("@propertyAuth.canAccessProperty(authentication, #propertyId)")
@Transactional(readOnly = true)
public List<RentLedgerDto> listMonthlyDues(UUID propertyId, YearMonth cycle) {
    return rentLedgerRepo
        .findAllByPropertyIdAndBillingCycle(propertyId, cycle)
        .stream()
        .map(RentLedgerDto::from)
        .toList();
}`,
  },
  "bi-insight": {
    filename: "sql/ast_safeguard.py",
    language: "Python · SQL AST Validator",
    caption: "Deterministic read-only SQL validation blocking mutations, unknown tables, and unbounded scans.",
    code: `import sqlglot
from sqlglot import exp

ALLOWED_VIEWS = {"v_revenue_monthly", "v_retention_cohorts", "v_pipeline_health"}

def validate_safe_select(sql: str) -> str:
    parsed = sqlglot.parse_one(sql, read="postgres")
    if not isinstance(parsed, exp.Select):
        raise SecurityError("Only read-only SELECT statements are permitted.")
    for table in parsed.find_all(exp.Table):
        if table.name not in ALLOWED_VIEWS:
            raise SecurityError(f"Table '{table.name}' is outside semantic allowlist.")
    if parsed.args.get("limit") is None:
        parsed = parsed.limit(200)
    return parsed.sql(dialect="postgres")`,
  },
  "api-sentinel": {
    filename: "gateway/SlidingWindowLimiter.java",
    language: "Java · Kong + Redis Lua",
    caption: "Atomic Redis sliding-window quota enforcement with graceful fail-open circuit protection.",
    code: `public RateLimitDecision checkQuota(String clientId, int limitPerMinute) {
    try {
        Long count = redis.execute(SLIDING_WINDOW_LUA, List.of("rl:" + clientId),
            String.valueOf(Instant.now().toEpochMilli()), "60000", String.valueOf(limitPerMinute));
        return count != null && count <= limitPerMinute
            ? RateLimitDecision.allow(limitPerMinute - count)
            : RateLimitDecision.reject(429);
    } catch (RedisConnectionFailureException ex) {
        metrics.increment("gateway.ratelimit.fail_open");
        return RateLimitDecision.allowDegraded();
    }
}`,
  },
  "autonomous-qa": {
    filename: "runner/triage_pipeline.py",
    language: "Python · Playwright + LangGraph",
    caption: "Isolated browser trace capture paired with AI failure classification that never hides real regressions.",
    code: `async def run_isolated_spec(spec_path: str) -> SpecResult:
    async with async_playwright() as pw:
        context = await pw.chromium.launch().new_context(viewport={"width": 1440, "height": 900})
        await context.tracing.start(screenshots=True, snapshots=True)
        outcome = await execute_spec(context, spec_path)
        trace_file = f"artifacts/{spec_path}.zip"
        await context.tracing.stop(path=trace_file)
        if not outcome.passed:
            outcome.triage = await triage_agent.classify(trace_file, outcome.error)
        return outcome`,
  },
  velocity: {
    filename: "telemetry/FuelEfficiencyCalculator.java",
    language: "Java · Spring Boot Domain",
    caption: "Accurate tank-to-tank mileage intervals anchored exclusively to verified full-tank fills.",
    code: `public Optional<BigDecimal> computeVerifiedMileage(List<FuelLog> orderedLogs) {
    List<FuelLog> fullFills = orderedLogs.stream().filter(FuelLog::isFullTank).toList();
    if (fullFills.size() < 2) return Optional.empty();
    FuelLog prev = fullFills.get(fullFills.size() - 2);
    FuelLog curr = fullFills.get(fullFills.size() - 1);
    BigDecimal distanceKm = curr.odometerKm().subtract(prev.odometerKm());
    BigDecimal totalLiters = sumLitersBetween(orderedLogs, prev.id(), curr.id());
    return Optional.of(distanceKm.divide(totalLiters, 2, RoundingMode.HALF_UP));
}`,
  },
  cloudpulse: {
    filename: "observability/slo_burn_alert.yaml",
    language: "YAML · Prometheus SLO Rule",
    caption: "Multi-window SLO error-budget burn alert replacing noisy single-threshold CPU pages.",
    code: `groups:
  - name: api-slo-burn-rate
    rules:
      - alert: ApiFastErrorBudgetBurn
        expr: |
          (sum(rate(http_requests_total{status=~"5.."}[5m]))
           / sum(rate(http_requests_total[5m]))) > (14.4 * 0.001)
        for: 2m
        labels:
          severity: page
        annotations:
          summary: "API 99.9% SLO error budget burning 14.4x faster than sustainable"`,
  },
  "synapse-chat": {
    filename: "realtime/socketFanout.ts",
    language: "TypeScript · Node.js + Redis",
    caption: "Horizontally scaled WebSocket rooms backed by Redis pub/sub and monotonic message sequences.",
    code: `export async function publishRoomMessage(roomId: string, msg: ChatMessage) {
  const persisted = await pg.insertMessageWithSequence(roomId, msg);
  await redisPub.publish(
    \`room:\${roomId}\`,
    JSON.stringify({ type: "message.created", payload: persisted })
  );
  if (msg.body.includes("@ai")) {
    await aiQueue.enqueue({ roomId, messageId: persisted.id, aclScope: roomId });
  }
  return persisted;
}`,
  },
  "enterprise-flow": {
    filename: "workflow/WorkflowStateEngine.java",
    language: "Java · Spring Boot + LangGraph",
    caption: "Deterministic compliance state machine consuming advisory AI triage scores inside immutable workflow versions.",
    code: `@Transactional
public WorkflowInstance advanceStep(UUID instanceId, ApprovalDecision decision, Actor actor) {
    WorkflowInstance instance = repo.findByIdForUpdate(instanceId).orElseThrow();
    WorkflowDefinition pinnedDef = definitionRepo.findVersion(instance.definitionId(), instance.version());
    pinnedDef.assertTransitionAllowed(instance.currentState(), decision, actor.roles());
    instance.apply(decision, actor.id());
    auditLog.recordImmutable(instanceId, decision, actor);
    kafka.publish("workflow.transitioned", instance.toEvent());
    return instance;
}`,
  },
};

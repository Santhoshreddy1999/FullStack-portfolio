"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Cpu,
  Pause,
  Play,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import {
  ARCHITECTURE_BLUEPRINTS,
  type ArchNode,
} from "@/data/architectures";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ArchitectureLabSection() {
  const [activeArchId, setActiveArchId] = useState(
    ARCHITECTURE_BLUEPRINTS[0].id
  );
  const blueprint =
    ARCHITECTURE_BLUEPRINTS.find((b) => b.id === activeArchId) ??
    ARCHITECTURE_BLUEPRINTS[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    blueprint.nodes[0].id
  );
  const [isSimulating, setIsSimulating] = useState(true);
  const [traceIdx, setTraceIdx] = useState(0);

  // Reset selected node and trace when switching diagrams
  useEffect(() => {
    setSelectedNodeId(blueprint.nodes[0].id);
    setTraceIdx(0);
  }, [blueprint]);

  // Animated request trace simulation
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setTraceIdx((prev) => (prev + 1) % blueprint.traceSteps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isSimulating, blueprint.traceSteps.length]);

  const nodeMap = useMemo(
    () => new Map(blueprint.nodes.map((n) => [n.id, n])),
    [blueprint.nodes]
  );

  const selectedNode: ArchNode =
    nodeMap.get(selectedNodeId) ?? blueprint.nodes[0];
  const activeTraceNodeId = blueprint.traceSteps[traceIdx];

  return (
    <section id="architecture-lab" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="06"
          eyebrow="System Architecture Lab"
          title="Interactive Distributed & AI System Blueprints"
          description="Inspect six production-oriented system architectures. Click any component node to examine its responsibilities, scaling model, and failure-handling design — or watch live simulated data-flow traces move across boundaries."
        />

        {/* Blueprint Selector Tabs */}
        <Tabs
          value={activeArchId}
          onValueChange={setActiveArchId}
          className="w-full"
        >
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <TabsList className="w-full justify-start overflow-x-auto lg:w-auto">
              {ARCHITECTURE_BLUEPRINTS.map((arch) => (
                <TabsTrigger key={arch.id} value={arch.id}>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: arch.accent }}
                  />
                  {arch.shortTitle}
                </TabsTrigger>
              ))}
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSimulating((prev) => !prev)}
              className="self-start lg:self-auto"
            >
              {isSimulating ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-[#45E4FF]" />
                  Pause Signal Trace
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-[#45E4FF]" />
                  Simulate Signal Trace
                </>
              )}
            </Button>
          </div>
        </Tabs>

        {/* Architecture Canvas + Component Inspector */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Interactive Topology Canvas */}
          <div className="glass-panel rounded-3xl p-4 sm:p-6 lg:col-span-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue">{blueprint.category}</Badge>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#969BB0]">
                    {blueprint.nodes.length} Components · {blueprint.edges.length}{" "}
                    Flows
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-bold text-[#F5F7FF] sm:text-2xl">
                  {blueprint.title}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#45E4FF]/30 bg-[#45E4FF]/10 px-3 py-1 font-mono text-[10px] text-[#45E4FF]">
                <Activity className="h-3 w-3" />
                {isSimulating ? "Tracing Active" : "Paused"}
              </span>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-[#969BB0]">
              {blueprint.summary}
            </p>

            {/* Interactive SVG Architecture Stage */}
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#070910] p-2">
              <svg
                viewBox="0 0 1000 520"
                className="h-auto min-w-[700px] w-full"
                role="img"
                aria-label={`${blueprint.title} interactive diagram`}
              >
                <defs>
                  <pattern
                    id={`grid-${blueprint.id}`}
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(245,247,255,0.035)"
                      strokeWidth="1"
                    />
                  </pattern>
                  <marker
                    id={`lab-arrow-${blueprint.id}`}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill={blueprint.accent} />
                  </marker>
                </defs>

                <rect
                  width="1000"
                  height="520"
                  fill={`url(#grid-${blueprint.id})`}
                />

                {/* Animated Connections */}
                {blueprint.edges.map((edge, idx) => {
                  const from = nodeMap.get(edge.from);
                  const to = nodeMap.get(edge.to);
                  if (!from || !to) return null;

                  const isConnectedToSelected =
                    edge.from === selectedNodeId || edge.to === selectedNodeId;
                  const isTraceActive =
                    isSimulating &&
                    (edge.from === activeTraceNodeId ||
                      edge.to === activeTraceNodeId);

                  const midX = (from.x + to.x) / 2;
                  const midY = (from.y + to.y) / 2;

                  return (
                    <g key={`${edge.from}-${edge.to}-${idx}`}>
                      <line
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={
                          isTraceActive
                            ? "#45E4FF"
                            : isConnectedToSelected
                              ? blueprint.accent
                              : "rgba(150,155,176,0.28)"
                        }
                        strokeWidth={
                          isTraceActive ? 2.6 : isConnectedToSelected ? 2 : 1.4
                        }
                        strokeDasharray="7 6"
                        className="animate-flow-dash"
                        markerEnd={`url(#lab-arrow-${blueprint.id})`}
                      />

                      {/* Protocol Pill */}
                      <rect
                        x={midX - 54}
                        y={midY - 11}
                        width="108"
                        height="20"
                        rx="6"
                        fill="#0A0D16"
                        stroke={
                          isTraceActive
                            ? "rgba(69,228,255,0.65)"
                            : "rgba(245,247,255,0.12)"
                        }
                      />
                      <text
                        x={midX}
                        y={midY + 2}
                        textAnchor="middle"
                        fill={isTraceActive ? "#45E4FF" : "#C7D4FF"}
                        fontSize="9.5"
                        fontFamily="var(--font-jetbrains-mono), monospace"
                      >
                        {edge.protocol}
                      </text>
                    </g>
                  );
                })}

                {/* Clickable Component Nodes */}
                {blueprint.nodes.map((node) => {
                  const isSelected = node.id === selectedNodeId;
                  const isPulsing =
                    isSimulating && node.id === activeTraceNodeId;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x - 86}, ${node.y - 38})`}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`Inspect ${node.label}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedNodeId(node.id);
                        }
                      }}
                    >
                      {isPulsing && (
                        <rect
                          x="-5"
                          y="-5"
                          width="182"
                          height="86"
                          rx="16"
                          fill="none"
                          stroke="#45E4FF"
                          strokeWidth="1.5"
                          strokeOpacity="0.65"
                          className="animate-subtle-pulse"
                        />
                      )}
                      <rect
                        width="172"
                        height="76"
                        rx="14"
                        fill={isSelected ? "#151C32" : "#0D101B"}
                        stroke={
                          isSelected
                            ? node.accent
                            : isPulsing
                              ? "#45E4FF"
                              : "rgba(245,247,255,0.16)"
                        }
                        strokeWidth={isSelected ? 2.2 : 1.2}
                      />
                      <rect
                        x="10"
                        y="10"
                        width="58"
                        height="15"
                        rx="4"
                        fill={`${node.accent}22`}
                      />
                      <text
                        x="39"
                        y="20.5"
                        textAnchor="middle"
                        fill={node.accent}
                        fontSize="8.5"
                        fontFamily="var(--font-jetbrains-mono), monospace"
                      >
                        {node.layer.toUpperCase()}
                      </text>
                      <text
                        x="12"
                        y="43"
                        fill="#F5F7FF"
                        fontSize="12"
                        fontWeight="700"
                        fontFamily="var(--font-space-grotesk), sans-serif"
                      >
                        {node.label}
                      </text>
                      <text
                        x="12"
                        y="61"
                        fill="#969BB0"
                        fontSize="9.8"
                        fontFamily="var(--font-jetbrains-mono), monospace"
                      >
                        {node.sublabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Component Inspector Panel */}
          <div className="glass-panel flex flex-col justify-between rounded-3xl p-6 lg:col-span-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#45E4FF]">
                  <Cpu className="h-3.5 w-3.5" />
                  Component Inspector
                </span>
                <Badge
                  style={{
                    borderColor: `${selectedNode.accent}55`,
                    backgroundColor: `${selectedNode.accent}1A`,
                    color: "#F5F7FF",
                  }}
                >
                  {selectedNode.layer}
                </Badge>
              </div>

              <h4 className="mt-4 font-display text-2xl font-bold text-[#F5F7FF]">
                {selectedNode.label}
              </h4>
              <p className="font-mono text-xs text-[#969BB0]">
                {selectedNode.sublabel}
              </p>

              {/* Responsibilities */}
              <div className="mt-6">
                <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#969BB0]">
                  Core Responsibilities
                </p>
                <ul className="space-y-2">
                  {selectedNode.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-lg border border-white/[0.07] bg-[#0B0E17] p-2.5 text-xs leading-relaxed text-[#D7DDF2]"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: selectedNode.accent }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scaling & Failure Handling */}
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-white/[0.08] bg-[#0B0E17] p-3.5">
                  <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#5B8CFF]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Scaling Strategy
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#C7D4FF]">
                    {selectedNode.scalingStrategy}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#0B0E17] p-3.5">
                  <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#FF9B62]">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Failure &amp; Resilience Design
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#C7D4FF]">
                    {selectedNode.failureHandling}
                  </p>
                </div>
              </div>
            </div>

            {/* Stack Tags */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#969BB0]">
                Component Technologies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-[#F5F7FF]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

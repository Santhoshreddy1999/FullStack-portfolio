"use client";

import React, { useState } from "react";
import type { PortfolioProject } from "@/data/projects";

export function ProjectDiagram({ project }: { project: PortfolioProject }) {
  const { nodes, edges } = project.diagram;
  const [activeNodeId, setActiveNodeId] = useState<string>(nodes[0]?.id ?? "");
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const activeNode = nodeMap.get(activeNodeId) ?? nodes[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#080A12] p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#45E4FF]">
          Architecture Blueprint // Click Any Node
        </span>
        {activeNode && (
          <span className="font-mono text-[11px] text-[#C7D4FF]">
            {activeNode.label}: <span className="text-[#969BB0]">{activeNode.role}</span>
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 370"
          className="h-auto min-w-[640px] w-full"
          role="img"
          aria-label={`${project.title} system architecture diagram`}
        >
          <defs>
            <marker
              id={`arrow-${project.slug}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill={project.accent} />
            </marker>
          </defs>

          {/* Animated Edges */}
          {edges.map((edge, idx) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 - 10;
            const highlighted =
              edge.from === activeNodeId || edge.to === activeNodeId;

            return (
              <g key={`${edge.from}-${edge.to}-${idx}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={highlighted ? project.accent : "rgba(150,155,176,0.3)"}
                  strokeWidth={highlighted ? 2.2 : 1.4}
                  strokeDasharray="6 6"
                  className="animate-flow-dash"
                  markerEnd={`url(#arrow-${project.slug})`}
                />
                <rect
                  x={midX - 46}
                  y={midY - 10}
                  width="92"
                  height="18"
                  rx="6"
                  fill="#0B0E17"
                  stroke="rgba(245,247,255,0.12)"
                />
                <text
                  x={midX}
                  y={midY + 2}
                  textAnchor="middle"
                  fill="#C7D4FF"
                  fontSize="9.5"
                  fontFamily="var(--font-jetbrains-mono), monospace"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Interactive Nodes */}
          {nodes.map((node) => {
            const selected = node.id === activeNodeId;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x - 86}, ${node.y - 30})`}
                onClick={() => setActiveNodeId(node.id)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveNodeId(node.id);
                  }
                }}
              >
                <rect
                  width="172"
                  height="60"
                  rx="12"
                  fill={selected ? "#151B2E" : "#0E111C"}
                  stroke={selected ? project.accent : "rgba(245,247,255,0.16)"}
                  strokeWidth={selected ? 2 : 1.2}
                />
                <circle
                  cx="14"
                  cy="16"
                  r="3.5"
                  fill={selected ? project.accent : "#5B8CFF"}
                />
                <text
                  x="25"
                  y="20"
                  fill="#F5F7FF"
                  fontSize="11.5"
                  fontWeight="600"
                  fontFamily="var(--font-space-grotesk), sans-serif"
                >
                  {node.label}
                </text>
                <text
                  x="14"
                  y="42"
                  fill="#969BB0"
                  fontSize="10"
                  fontFamily="var(--font-jetbrains-mono), monospace"
                >
                  {node.role}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import type { PortfolioProject } from "@/data/projects";

export function ProjectArtwork({
  project,
  className = "h-52 w-full",
}: {
  project: PortfolioProject;
  className?: string;
}) {
  const { accent, secondaryAccent, motif, number, title } = project;
  const gradId = `grad-${project.slug}`;
  const glowId = `glow-${project.slug}`;

  return (
    <div
      className={`relative overflow-hidden bg-[#090B14] ${className}`}
      aria-hidden="true"
    >
      {/* Atmospheric dual radial depth */}
      <div
        className="absolute inset-0 opacity-85"
        style={{
          background: `radial-gradient(circle at 22% 24%, ${accent}2E 0%, transparent 56%), radial-gradient(circle at 82% 78%, ${secondaryAccent}24 0%, transparent 54%)`,
        }}
      />

      {/* Precision SVG Architectural Artwork */}
      <svg
        viewBox="0 0 600 320"
        preserveAspectRatio="xMidYMid slice"
        className="relative z-10 h-full w-full"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={secondaryAccent} stopOpacity="0.65" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle technical grid */}
        <g stroke="rgba(245,247,255,0.05)" strokeWidth="1">
          {[80, 160, 240, 320, 400, 480, 560].map((x) => (
            <line key={`vx-${x}`} x1={x} y1="0" x2={x} y2="320" />
          ))}
          {[64, 128, 192, 256].map((y) => (
            <line key={`hy-${y}`} x1="0" y1={y} x2="600" y2={y} />
          ))}
        </g>

        <circle cx="300" cy="160" r="145" fill={`url(#${glowId})`} />

        {/* Motif-specific generative geometry */}
        {motif === "neural-mesh" && (
          <g stroke={`url(#${gradId})`} fill="none">
            {[
              [160, 110, 300, 160],
              [160, 220, 300, 160],
              [300, 160, 440, 100],
              [300, 160, 440, 220],
              [160, 110, 300, 70],
              [300, 70, 440, 100],
              [160, 220, 300, 255],
              [300, 255, 440, 220],
            ].map(([x1, y1, x2, y2], idx) => (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth="1.5"
                strokeOpacity="0.65"
              />
            ))}
            {[
              [160, 110, 10],
              [160, 220, 10],
              [300, 70, 9],
              [300, 160, 18],
              [300, 255, 9],
              [440, 100, 11],
              [440, 220, 11],
            ].map(([cx, cy, r], idx) => (
              <g key={idx}>
                <circle cx={cx} cy={cy} r={r + 8} strokeOpacity="0.25" />
                <circle cx={cx} cy={cy} r={r} fill="#0B0F1E" strokeWidth="1.8" />
                <circle cx={cx} cy={cy} r={r * 0.35} fill={accent} stroke="none" />
              </g>
            ))}
          </g>
        )}

        {motif === "vector-prism" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <polygon points="300,42 435,160 300,278 165,160" strokeWidth="1.6" fill={`${accent}12`} />
            <polygon points="300,76 396,160 300,244 204,160" strokeWidth="1.2" strokeDasharray="4 4" />
            <line x1="110" y1="160" x2="490" y2="160" strokeOpacity="0.45" />
            <line x1="300" y1="24" x2="300" y2="296" strokeOpacity="0.45" />
            <circle cx="300" cy="160" r="24" fill="#090B14" strokeWidth="2" />
            <circle cx="300" cy="160" r="8" fill={secondaryAccent} stroke="none" />
          </g>
        )}

        {motif === "infra-orbital" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <ellipse cx="300" cy="160" rx="185" ry="62" transform="rotate(-14 300 160)" strokeWidth="1.4" />
            <ellipse cx="300" cy="160" rx="145" ry="52" transform="rotate(20 300 160)" strokeWidth="1.2" strokeDasharray="5 5" />
            <polygon points="300,98 354,129 354,191 300,222 246,191 246,129" fill={`${accent}18`} strokeWidth="1.8" />
            <circle cx="468" cy="122" r="7" fill={accent} stroke="none" />
            <circle cx="144" cy="198" r="6" fill={secondaryAccent} stroke="none" />
          </g>
        )}

        {motif === "ledger-waves" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <path d="M60 220 C 160 120, 240 245, 340 145 S 470 95, 550 155" strokeWidth="2.2" />
            <path d="M60 245 C 170 165, 250 265, 355 180 S 475 135, 550 190" strokeWidth="1.2" strokeOpacity="0.45" />
            {[140, 220, 300, 380, 460].map((x, idx) => (
              <rect
                key={x}
                x={x - 14}
                y={195 - idx * 14}
                width="28"
                height={60 + idx * 14}
                rx="4"
                fill={`${accent}14`}
                strokeOpacity="0.45"
              />
            ))}
          </g>
        )}

        {motif === "biometric-grid" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <circle cx="300" cy="160" r="96" strokeWidth="1.2" strokeDasharray="6 6" />
            <circle cx="300" cy="160" r="64" strokeWidth="1.6" fill={`${accent}12`} />
            <path d="M120 160 L225 160 L252 115 L285 208 L315 132 L342 160 L480 160" strokeWidth="2.2" />
          </g>
        )}

        {motif === "code-lattice" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <rect x="145" y="72" width="310" height="176" rx="14" fill="#0B0F1D" strokeWidth="1.5" />
            <line x1="145" y1="108" x2="455" y2="108" strokeOpacity="0.35" />
            <path d="M220 150 L190 176 L220 202" strokeWidth="2.2" />
            <path d="M380 150 L410 176 L380 202" strokeWidth="2.2" />
            <line x1="322" y1="142" x2="278" y2="210" strokeWidth="2.2" />
          </g>
        )}

        {motif === "event-streams" && (
          <g stroke={`url(#${gradId})`} fill="none">
            {[100, 160, 220].map((y, idx) => (
              <g key={y}>
                <line x1="80" y1={y} x2="520" y2={y} strokeWidth="1.6" strokeDasharray="8 6" />
                <rect x={150 + idx * 75} y={y - 12} width="54" height="24" rx="12" fill="#0B0F1E" strokeWidth="1.6" />
                <circle cx={380 + idx * 35} cy={y} r="7" fill={accent} stroke="none" />
              </g>
            ))}
          </g>
        )}

        {motif === "spatial-blocks" && (
          <g stroke={`url(#${gradId})`} fill={`${accent}12`} strokeWidth="1.5">
            <polygon points="300,56 390,104 300,152 210,104" />
            <polygon points="210,104 300,152 300,248 210,200" />
            <polygon points="390,104 300,152 300,248 390,200" fill={`${secondaryAccent}14`} />
          </g>
        )}

        {motif === "bi-matrix" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <rect x="135" y="75" width="150" height="170" rx="12" fill={`${accent}10`} strokeWidth="1.4" />
            <rect x="310" y="75" width="155" height="78" rx="12" fill={`${secondaryAccent}12`} strokeWidth="1.4" />
            <rect x="310" y="167" width="155" height="78" rx="12" fill={`${accent}10`} strokeWidth="1.4" />
            <path d="M160 210 L195 165 L225 182 L262 120" strokeWidth="2.2" />
            <circle cx="388" cy="114" r="22" strokeWidth="1.8" />
            <path d="M388 114 L388 92 A22 22 0 0 1 408 124 Z" fill={accent} fillOpacity="0.4" />
          </g>
        )}

        {motif === "shield-gateway" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <path
              d="M300 46 L402 88 L402 164 C402 220 358 258 300 280 C242 258 198 220 198 164 L198 88 Z"
              fill={`${accent}14`}
              strokeWidth="1.8"
            />
            <path
              d="M300 78 L372 108 L372 162 C372 200 342 228 300 245 C258 228 228 200 228 162 L228 108 Z"
              strokeDasharray="4 4"
              strokeWidth="1.2"
            />
            <circle cx="300" cy="158" r="18" fill="#090B14" strokeWidth="2" />
          </g>
        )}

        {motif === "qa-circuit" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <circle cx="300" cy="160" r="88" strokeWidth="1.5" fill={`${accent}10`} />
            <path d="M256 164 L286 194 L348 128" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="115" y1="160" x2="212" y2="160" strokeDasharray="4 5" />
            <line x1="388" y1="160" x2="485" y2="160" strokeDasharray="4 5" />
          </g>
        )}

        {motif === "telemetry-arc" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <path d="M165 235 A145 145 0 1 1 435 235" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M195 220 A112 112 0 1 1 405 220" strokeWidth="1.2" strokeDasharray="6 6" />
            <line x1="300" y1="185" x2="386" y2="118" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="300" cy="185" r="12" fill="#090B14" strokeWidth="2" />
          </g>
        )}

        {motif === "pulse-radar" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <circle cx="300" cy="160" r="36" strokeOpacity="0.9" />
            <circle cx="300" cy="160" r="74" strokeOpacity="0.6" />
            <circle cx="300" cy="160" r="112" strokeOpacity="0.35" />
            <path d="M300 160 L392 98 A112 112 0 0 1 412 160 Z" fill={`${accent}28`} stroke="none" />
            <circle cx="352" cy="126" r="5" fill={secondaryAccent} stroke="none" />
            <circle cx="256" cy="204" r="4" fill={accent} stroke="none" />
          </g>
        )}

        {motif === "synapse-rings" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <circle cx="252" cy="160" r="72" fill={`${accent}10`} strokeWidth="1.6" />
            <circle cx="348" cy="160" r="72" fill={`${secondaryAccent}10`} strokeWidth="1.6" />
            <circle cx="300" cy="160" r="14" fill={accent} fillOpacity="0.45" />
          </g>
        )}

        {motif === "workflow-dag" && (
          <g stroke={`url(#${gradId})`} fill="none">
            <line x1="150" y1="160" x2="260" y2="105" strokeWidth="1.6" />
            <line x1="150" y1="160" x2="260" y2="215" strokeWidth="1.6" />
            <line x1="340" y1="105" x2="450" y2="160" strokeWidth="1.6" />
            <line x1="340" y1="215" x2="450" y2="160" strokeWidth="1.6" />
            <rect x="95" y="138" width="80" height="44" rx="10" fill="#0B0F1E" strokeWidth="1.6" />
            <rect x="260" y="83" width="80" height="44" rx="10" fill="#0B0F1E" strokeWidth="1.6" />
            <rect x="260" y="193" width="80" height="44" rx="10" fill="#0B0F1E" strokeWidth="1.6" />
            <rect x="425" y="138" width="80" height="44" rx="10" fill="#0B0F1E" strokeWidth="1.6" />
          </g>
        )}
      </svg>

      {/* Corner editorial metadata overlay */}
      <div className="pointer-events-none absolute inset-x-4 top-3.5 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
        <span className="rounded border border-white/15 bg-[#07080D]/80 px-2 py-0.5 text-[#F5F7FF] backdrop-blur-md">
          PRJ-{number}
        </span>
        <span
          className="rounded border bg-[#07080D]/80 px-2 py-0.5 backdrop-blur-md"
          style={{ borderColor: `${accent}55`, color: accent }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

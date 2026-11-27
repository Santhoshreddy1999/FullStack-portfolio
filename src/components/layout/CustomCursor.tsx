"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/three/WebGLErrorBoundary";

export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    if (!finePointer.matches) return;
    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button"
      );
      if (target) {
        setActive(true);
        setLabel(target.getAttribute("data-cursor"));
      } else {
        setActive(false);
        setLabel(null);
      }
    };

    const onLeave = () => {
      mouseX = -100;
      mouseY = -100;
      setActive(false);
      setLabel(null);
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] -ml-5 -mt-5 hidden md:flex items-center justify-center transition-[width,height,margin,border-color,background-color] duration-200"
        style={{
          width: label ? 76 : active ? 46 : 36,
          height: label ? 76 : active ? 46 : 36,
          marginLeft: label ? -38 : active ? -23 : -18,
          marginTop: label ? -38 : active ? -23 : -18,
          borderRadius: "9999px",
          border: active
            ? "1px solid rgba(69, 228, 255, 0.72)"
            : "1px solid rgba(91, 140, 255, 0.4)",
          backgroundColor: label
            ? "rgba(7, 8, 13, 0.72)"
            : active
              ? "rgba(91, 140, 255, 0.08)"
              : "transparent",
          backdropFilter: label ? "blur(6px)" : undefined,
        }}
      >
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#45E4FF]">
            {label}
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[91] -ml-1 -mt-1 hidden h-2 w-2 rounded-full bg-[#45E4FF] shadow-[0_0_12px_#45E4FF] md:block"
      />
    </>
  );
}

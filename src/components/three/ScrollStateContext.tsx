"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./WebGLErrorBoundary";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollMotionState {
  progress: number;
  velocity: number;
  pointerX: number;
  pointerY: number;
}

interface ScrollContextValue {
  motionRef: MutableRefObject<ScrollMotionState>;
  activeSection: string;
  scrollProgressUI: number;
  scrollToSection: (id: string) => void;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

const SECTION_IDS = [
  "hero",
  "about",
  "capabilities",
  "tech-galaxy",
  "projects",
  "architecture-lab",
  "journey",
  "metrics",
  "github",
  "contact",
];

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const motionRef = useRef<ScrollMotionState>({
    progress: 0,
    velocity: 0,
    pointerX: 0,
    pointerY: 0,
  });
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgressUI, setScrollProgressUI] = useState(0);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      motionRef.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      motionRef.current.pointerY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    let rafId = 0;
    let lastUiTick = 0;

    const updateProgress = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      motionRef.current.progress = p;

      const now = performance.now();
      if (now - lastUiTick > 90) {
        lastUiTick = now;
        setScrollProgressUI(p);
      }
    };

    if (!reducedMotion) {
      const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 1.4,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", (e: { velocity: number }) => {
        motionRef.current.velocity = e.velocity ?? 0;
        updateProgress();
        ScrollTrigger.update();
      });

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisRef.current = null;
      };
    } else {
      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
      return () => window.removeEventListener("scroll", updateProgress);
    }
  }, [reducedMotion]);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -72 });
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <ScrollContext.Provider
      value={{ motionRef, activeSection, scrollProgressUI, scrollToSection }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollMotion() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollMotion must be used within SmoothScrollProvider");
  }
  return ctx;
}

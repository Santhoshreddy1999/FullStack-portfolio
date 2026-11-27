"use client";

import React from "react";
import { MotionConfig } from "framer-motion";
import { SmoothScrollProvider } from "@/components/three/ScrollStateContext";
import { PersistentScene } from "@/components/three/PersistentScene";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { TechGalaxySection } from "@/components/sections/TechGalaxySection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ArchitectureLabSection } from "@/components/sections/ArchitectureLabSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { MetricsSection } from "@/components/sections/MetricsSection";
import { GitHubSection } from "@/components/sections/GitHubSection";
import { ContactSection } from "@/components/sections/ContactSection";

export function PortfolioExperience() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <div className="relative min-h-screen bg-engineering-grid">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#5B8CFF] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-semibold focus:text-[#07080D]"
          >
            Skip to main content
          </a>

          <PersistentScene />
          <CustomCursor />
          <Navbar />

          <main id="main-content" className="relative z-10">
            <HeroSection />
            <AboutSection />
            <CapabilitiesSection />
            <TechGalaxySection />
            <ProjectsSection />
            <ArchitectureLabSection />
            <JourneySection />
            <MetricsSection />
            <GitHubSection />
            <ContactSection />
          </main>

          <Footer />
        </div>
      </SmoothScrollProvider>
    </MotionConfig>
  );
}

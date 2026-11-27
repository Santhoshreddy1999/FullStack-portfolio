"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      <div
        className={cn(
          "mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#10121B]/85 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#969BB0]",
          align === "center" && "justify-center"
        )}
      >
        <span className="text-[#45E4FF]">{index}</span>
        <span className="h-3 w-px bg-white/15" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F7FF] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed text-[#969BB0] sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

"use client";

import React, { useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import type { BlueprintSnippet } from "@/data/projectBlueprints";

export function CodeBlueprintViewer({
  blueprint,
}: {
  blueprint: BlueprintSnippet;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(blueprint.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#080A12]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-[#0D101B] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Code2 className="h-4 w-4 text-[#45E4FF]" />
          <span className="font-mono text-xs font-semibold text-[#F5F7FF]">
            {blueprint.filename}
          </span>
          <span className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#969BB0]">
            {blueprint.language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-[#C7D4FF] transition-colors hover:border-[#45E4FF]/50 hover:text-[#F5F7FF]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-[#34D399]" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy Pattern
            </>
          )}
        </button>
      </div>

      <p className="border-b border-white/[0.06] px-4 py-2.5 text-xs text-[#969BB0]">
        {blueprint.caption}
      </p>

      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#D7DDF2]">
        <code>{blueprint.code}</code>
      </pre>
    </div>
  );
}

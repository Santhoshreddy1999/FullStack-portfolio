"use client";

import React, { useState } from "react";
import {
  Camera,
  Check,
  Copy,
  RotateCcw,
  Sliders,
  Sparkles,
  Upload,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProfileStudioDialog() {
  const {
    profile,
    overrides,
    hasOverrides,
    updateOverrides,
    resetOverrides,
    studioOpen,
    setStudioOpen,
  } = useProfile();

  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (overrides.photoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(overrides.photoPreviewUrl);
    }
    const url = URL.createObjectURL(file);
    updateOverrides({ photoPreviewUrl: url });
  };

  const generateConfigSnippet = () => {
    return `// Paste into src/config/profile.ts inside PROFILE:
name: ${JSON.stringify(profile.name)},
monogram: ${JSON.stringify(profile.monogram)},
isIdentityPlaceholder: false,
role: ${JSON.stringify(profile.role)},
location: ${JSON.stringify(profile.location)},
email: ${JSON.stringify(profile.email)},
social: {
  github: ${JSON.stringify(profile.social.github)},
  githubUsername: null, // set your GitHub handle for live API sync
  linkedin: ${JSON.stringify(profile.social.linkedin)},
},
availability: {
  status: ${JSON.stringify(profile.availability.status)},
  label: ${JSON.stringify(profile.availability.label)},
  details: ${JSON.stringify(profile.availability.details)},
},
photo: {
  src: "/images/profile.jpg",
  alt: ${JSON.stringify(`Portrait of ${profile.name}`)},
  objectPosition: ${JSON.stringify(profile.photo.objectPosition)},
  caption: "",
},`;
  };

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(generateConfigSnippet());
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2200);
    } catch {
      // Clipboard restricted
    }
  };

  return (
    <Dialog open={studioOpen} onOpenChange={setStudioOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="cyan">
              <Sliders className="h-3 w-3" />
              Live Identity &amp; Portrait Studio
            </Badge>
            {hasOverrides && <Badge variant="violet">Preview Active</Badge>}
          </div>
          <DialogTitle className="mt-2 text-2xl">
            Personalize Your Portfolio Live
          </DialogTitle>
          <DialogDescription>
            Preview your real name, portrait photograph, contact links, and
            availability status right in the browser (client-side only — your
            photo never leaves your device), then copy the ready-to-paste{" "}
            <code className="text-[#F5F7FF]">src/config/profile.ts</code>{" "}
            snippet.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          {/* Portrait Preview Upload */}
          <div className="rounded-2xl border border-white/10 bg-[#0B0E17] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#45E4FF]/35 bg-[#45E4FF]/10">
                  <Camera className="h-5 w-5 text-[#45E4FF]" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-[#F5F7FF]">
                    Live Portrait Photo Preview
                  </p>
                  <p className="text-xs text-[#969BB0]">
                    Test how your real photo looks inside the Section 02 studio
                    frame.
                  </p>
                </div>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#5B8CFF]/45 bg-[#5B8CFF]/15 px-3.5 py-2 font-mono text-xs text-[#F5F7FF] transition-colors hover:bg-[#5B8CFF]/25">
                <Upload className="h-3.5 w-3.5 text-[#45E4FF]" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            </div>

            {profile.photo.src && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-3">
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#969BB0]">
                  <span>Crop Focus:</span>
                  {["50% 15%", "50% 35%", "50% 50%"].map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() =>
                        updateOverrides({ photoObjectPosition: pos })
                      }
                      className={`cursor-pointer rounded border px-2 py-0.5 text-[10px] ${
                        profile.photo.objectPosition === pos
                          ? "border-[#45E4FF] bg-[#45E4FF]/15 text-[#F5F7FF]"
                          : "border-white/10 text-[#969BB0]"
                      }`}
                    >
                      {pos === "50% 15%"
                        ? "Upper"
                        : pos === "50% 35%"
                          ? "Portrait"
                          : "Center"}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => updateOverrides({ photoPreviewUrl: null })}
                  className="cursor-pointer font-mono text-[11px] text-[#FF9B62] hover:underline"
                >
                  Clear preview photo
                </button>
              </div>
            )}
          </div>

          {/* Identity Fields */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="studio-name"
                className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#969BB0]"
              >
                Full Name
              </label>
              <Input
                id="studio-name"
                value={overrides.name ?? ""}
                onChange={(e) => updateOverrides({ name: e.target.value })}
                placeholder={profile.name}
              />
            </div>

            <div>
              <label
                htmlFor="studio-monogram"
                className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#969BB0]"
              >
                Monogram (2 chars)
              </label>
              <Input
                id="studio-monogram"
                maxLength={3}
                value={overrides.monogram ?? ""}
                onChange={(e) =>
                  updateOverrides({ monogram: e.target.value.toUpperCase() })
                }
                placeholder={profile.monogram}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="studio-role"
                className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#969BB0]"
              >
                Professional Positioning
              </label>
              <Input
                id="studio-role"
                value={overrides.role ?? ""}
                onChange={(e) => updateOverrides({ role: e.target.value })}
                placeholder={profile.role}
              />
            </div>

            <div>
              <label
                htmlFor="studio-email"
                className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#969BB0]"
              >
                Contact Email
              </label>
              <Input
                id="studio-email"
                type="email"
                value={overrides.email ?? ""}
                onChange={(e) => updateOverrides({ email: e.target.value })}
                placeholder={profile.email}
              />
            </div>

            <div>
              <label
                htmlFor="studio-location"
                className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#969BB0]"
              >
                Location
              </label>
              <Input
                id="studio-location"
                value={overrides.location ?? ""}
                onChange={(e) => updateOverrides({ location: e.target.value })}
                placeholder={profile.location}
              />
            </div>

            <div>
              <label
                htmlFor="studio-github"
                className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#969BB0]"
              >
                GitHub URL
              </label>
              <Input
                id="studio-github"
                value={overrides.github ?? ""}
                onChange={(e) => updateOverrides({ github: e.target.value })}
                placeholder={profile.social.github}
              />
            </div>

            <div>
              <label
                htmlFor="studio-linkedin"
                className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#969BB0]"
              >
                LinkedIn URL
              </label>
              <Input
                id="studio-linkedin"
                value={overrides.linkedin ?? ""}
                onChange={(e) => updateOverrides({ linkedin: e.target.value })}
                placeholder={profile.social.linkedin}
              />
            </div>
          </div>

          {/* Availability Switcher */}
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#969BB0]">
              Availability Status
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "open", label: "Open to Opportunities", dot: "#34D399" },
                  { id: "selective", label: "Selective Advisory", dot: "#FF9B62" },
                  { id: "unavailable", label: "Currently Booked", dot: "#969BB0" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    updateOverrides({
                      availabilityStatus: opt.id,
                      availabilityLabel: opt.label,
                    })
                  }
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
                    profile.availability.status === opt.id
                      ? "border-[#5B8CFF]/65 bg-[#5B8CFF]/18 text-[#F5F7FF]"
                      : "border-white/10 bg-[#0B0E17] text-[#969BB0]"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: opt.dot }}
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetOverrides}
              disabled={!hasOverrides}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Preview
            </Button>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="cyan"
                size="sm"
                onClick={handleCopySnippet}
              >
                {copiedSnippet ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied profile.ts Snippet
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy profile.ts Snippet
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setStudioOpen(false)}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Apply Preview
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

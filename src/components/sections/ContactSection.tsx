"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Check,
  Copy,
  Download,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { PROFILE } from "@/config/profile";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ClosingOrbCanvas = dynamic(
  () => import("@/components/three/ClosingOrbCanvas"),
  { ssr: false }
);

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("AI & Agentic Architecture");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const orbHostRef = useRef<HTMLDivElement>(null);
  const [orbVisible, setOrbVisible] = useState(false);

  useEffect(() => {
    const el = orbHostRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOrbVisible(true);
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API restricted
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        note?: string;
        error?: string;
      };

      if (!res.ok) {
        setFeedback({
          type: "error",
          text: json.error || "Please check your form details and try again.",
        });
      } else {
        setFeedback({
          type: "success",
          text:
            json.note ||
            "Thank you — your message was validated successfully.",
        });
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Network error while submitting. Please reach out directly via email.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const availabilityDot =
    PROFILE.availability.status === "open"
      ? "bg-[#34D399]"
      : PROFILE.availability.status === "selective"
        ? "bg-[#FF9B62]"
        : "bg-[#969BB0]";

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="10"
          eyebrow="Contact & Collaboration"
          title="HAVE A COMPLEX PROBLEM? LET'S ENGINEER THE SOLUTION."
          description={PROFILE.availability.details}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Direct Channels + 3D Closing Orb */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${availabilityDot} animate-pulse`}
                />
                <span className="font-mono text-xs uppercase tracking-wider text-[#F5F7FF]">
                  {PROFILE.availability.label}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#0B0E17] px-4 py-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Mail className="h-4 w-4 shrink-0 text-[#5B8CFF]" />
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="truncate font-mono text-xs text-[#F5F7FF] hover:text-[#45E4FF]"
                    >
                      {PROFILE.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-[#C7D4FF] hover:border-[#45E4FF]/50"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-[#34D399]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0B0E17] px-4 py-3 font-mono text-xs text-[#969BB0]">
                  <MapPin className="h-4 w-4 shrink-0 text-[#45E4FF]" />
                  <span>{PROFILE.location}</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <Button variant="secondary" size="sm" asChild>
                  <a
                    href={PROFILE.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkedInIcon className="h-3.5 w-3.5 text-[#5B8CFF]" />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <a
                    href={PROFILE.social.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitHubIcon className="h-3.5 w-3.5 text-[#F5F7FF]" />
                    GitHub
                  </a>
                </Button>
                <Button variant="cyan" size="sm" asChild>
                  <a
                    href={PROFILE.resume.pdfPath}
                    download={PROFILE.resume.downloadFilename}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Resume
                  </a>
                </Button>
              </div>
            </div>

            {/* Animated 3D Closing Visual */}
            <div
              ref={orbHostRef}
              className="glass-panel relative h-64 overflow-hidden rounded-3xl"
            >
              {orbVisible ? (
                <ClosingOrbCanvas />
              ) : (
                <div className="flex h-full items-center justify-center font-mono text-xs text-[#969BB0]">
                  Loading 3D closing centerpiece...
                </div>
              )}
              <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#969BB0]">
                <span className="text-[#45E4FF]">SIGNAL // OPEN CHANNEL</span>
                <span>PIXEL TO PRODUCTION</span>
              </div>
            </div>
          </div>

          {/* Right Column: Engineering Inquiry Form */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:col-span-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#F5F7FF]">
                  Start an Engineering Conversation
                </h3>
                <p className="mt-1 text-sm text-[#969BB0]">
                  Share architectural scope, hiring opportunities, or technical
                  collaboration ideas.
                </p>
              </div>
              <Badge variant="muted">Direct Inquiry</Badge>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#969BB0]"
                  >
                    Your Name
                  </label>
                  <Input
                    id="contact-name"
                    required
                    minLength={2}
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Taylor"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#969BB0]"
                  >
                    Email Address
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={180}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@company.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-topic"
                  className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#969BB0]"
                >
                  Engineering Focus
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "AI & Agentic Architecture",
                    "Full Stack Platform",
                    "Distributed Backend / Cloud",
                    "Senior Engineering Role",
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTopic(option)}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                        topic === option
                          ? "border-[#5B8CFF]/65 bg-[#5B8CFF]/18 text-[#F5F7FF]"
                          : "border-white/10 bg-[#0B0E17] text-[#969BB0] hover:text-[#F5F7FF]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#969BB0]"
                >
                  Project or Role Details
                </label>
                <textarea
                  id="contact-message"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the system challenges, timeline, or role context..."
                  className="flex w-full rounded-lg border border-white/12 bg-[#0D0F17]/90 px-3.5 py-2.5 text-sm text-[#F5F7FF] placeholder:text-[#969BB0]/65 transition-colors focus-visible:outline-none focus-visible:border-[#5B8CFF] focus-visible:ring-1 focus-visible:ring-[#5B8CFF]"
                />
              </div>

              {feedback && (
                <div
                  role="status"
                  className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
                    feedback.type === "success"
                      ? "border-[#34D399]/40 bg-[#34D399]/10 text-[#B7F7DE]"
                      : "border-[#FF9B62]/45 bg-[#FF9B62]/10 text-[#FFD0B3]"
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="font-mono text-[11px] text-[#969BB0]">
                  Prefer direct email?{" "}
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="text-[#45E4FF] hover:underline"
                  >
                    Open mail client
                  </a>
                </p>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  data-cursor="SEND"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending..." : "Send Inquiry"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

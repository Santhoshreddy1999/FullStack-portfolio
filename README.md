# Full Stack & AI Systems Architect Portfolio

A futuristic, interactive 3D engineering portfolio built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Three.js / React Three Fiber / Drei**, **Framer Motion**, **GSAP ScrollTrigger**, and **Lenis** smooth scrolling.

## Key Features

- **Persistent Evolving 3D WebGL Scene**: Floating metallic geometric core, digital planet, glowing neural network constellation, and layered particle streams that morph continuously across scroll sections with pointer parallax, adaptive mobile quality, WebGL error boundaries, and `prefers-reduced-motion` support.
- **10 Complete Editorial & Interactive Sections**:
  1. **Cinematic Hero**: Animated typography, role positioning, floating technology telemetry, simulated architecture feed, and primary CTAs.
  2. **Editorial About Me**: Studio portrait framing configured for real photography (no fabricated AI faces), engineering philosophy, and 5-year progression overview.
  3. **Engineering Capabilities**: 6 interactive disciplines backed by an interactive 3D geometry inspector.
  4. **3D Technology Galaxy**: Interactive orbital 3D ecosystem of **117 technologies** across **8 categories**, with honest proficiency tiers (`Professional Experience`, `Working Knowledge`, `Explored & R&D`), search, category filters, node inspector, and an accessible 2D Matrix toggle.
  5. **15 Featured Project Blueprints + Dedicated Case-Study Pages (`/projects/[slug]`)**: Bespoke procedural cover artwork, interactive architecture diagrams, features, challenges/trade-offs, medical safety disclaimers where applicable, and transparent blueprint/prototype status labels.
  6. **System Architecture Lab**: 6 interactive multi-node architecture diagrams (AI Agents, RAG Pipelines, Spring Boot Microservices, Kafka Event-Driven, Kubernetes Deployments, Cloud-Native Apps) with animated signal traces and component inspection.
  7. **Engineering Journey**: Interactive horizontal rail and vertical career timeline spanning 5 years of editable experience data.
  8. **Verified Engineering Metrics**: Dynamically computed counters derived strictly from structured portfolio inventory — zero fabricated claims.
  9. **GitHub & Open Source**: Official GitHub API route (`/api/github`) with graceful preview fallback, language distribution, activity cadence visual, search, and filters.
  10. **Contact & 3D Closing Visual**: Configurable availability, email copy, validated inquiry API (`/api/contact`), social links, Resume download, and closing 3D orb.

## Personalizing Your Identity

All personal information is centralized in a single typed file:

1. **Identity, Bio, Links & Experience**: Edit `src/config/profile.ts`.
2. **Profile Photograph**: Place your photograph at `public/images/profile.jpg` (or `.webp`/`.png`) and update `PROFILE.photo.src` in `src/config/profile.ts` to `"/images/profile.jpg"`.
3. **Resume PDF**: Replace `public/resume.pdf` with your actual resume PDF and optionally update `PROFILE.resume.downloadFilename`.
4. **Live GitHub Sync**: Set `PROFILE.social.githubUsername` in `src/config/profile.ts` (or set the `GITHUB_USERNAME` environment variable) to load your real public repositories via the GitHub API.
5. **Project Links**: As individual projects are implemented and deployed, add real repository and live URLs in `src/data/projects.ts`.

## Running Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

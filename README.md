# Full Stack & AI Systems Architect Portfolio

A futuristic, interactive 3D engineering portfolio built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Three.js / React Three Fiber / Drei**, custom **GLSL Shaders**, **Framer Motion**, **GSAP ScrollTrigger**, and **Lenis** smooth scrolling.

## Key Features

- **Custom GLSL 3D Scroll Storytelling Engine**: Morphing holographic Fresnel energy core, atmospheric scanline digital planet shader, curved 3D orbital data-pulse filaments, glowing neural network constellation, and layered particle streams with scroll-reactive chapter lighting, Eco Mode toggle, WebGL error boundaries, and `prefers-reduced-motion` support.
- **Global Keyboard Command Palette (`⌘K` / `Ctrl+K`) & Spatial Telemetry HUD**: Instant fuzzy search across all sections, 15 project case studies, all 117 technologies (deep-linking straight to the node inside the 3D Galaxy), and quick actions — paired with a fixed desktop chapter telemetry rail.
- **Live Identity & Portrait Preview Studio**: Upload a local portrait photo in the browser (client-side preview only), adjust crop focus, test custom name/role/links/availability live across the entire site, and copy a ready-to-paste `src/config/profile.ts` snippet.
- **Interactive AI Engineering Laboratory (`Section 06B`)**:
  - **LangGraph Multi-Agent Sandbox**: Run deterministic execution graphs across real SRE/Kafka/RAG workflows with a live **Human Approval Interrupt** gate (approve or reject mutations in real time).
  - **Hybrid RAG & ACL Pre-Filter Lab**: Toggle RBAC caller roles (`Engineering`, `Finance`, `Guest`) and retrieval strategies (`Dense Vector`, `BM25`, `Hybrid RRF + Cross-Encoder`) to watch Qdrant ACL pre-filtering and safe refusal behavior live.
- **System Architecture Lab + Chaos Fault Injection (`Section 06`)**: Six interactive multi-node system diagrams (*AI Agents*, *RAG Pipelines*, *Spring Microservices*, *Kafka Event-Driven*, *Kubernetes Deployments*, *Cloud-Native Apps*) with live signal tracing and an **Inject Chaos Fault** toggle demonstrating circuit breakers, DLQ isolation, and graceful fallbacks.
- **All 10 Core Sections + 15 Statically Generated Case Studies (`/projects/[slug]`)**: Including cursor-tracking spotlight cards, a flagship blueprint showcase for *NEXUS AI*, custom procedural cover artwork, interactive topology diagrams, challenges & trade-offs, medical safety disclaimers on *MEDICORE AI*, and copyable **Reference Implementation Code Blueprints** tailored to each project's stack.

## Personalizing Your Identity

All personal information is centralized in `src/config/profile.ts` (or test changes live via the **Sliders / Personalize** button in the top bar):

1. **Identity, Bio, Links & Experience**: Edit `src/config/profile.ts`.
2. **Profile Photograph**: Place your photograph at `public/images/profile.jpg` (or `.webp`/`.png`) and update `PROFILE.photo.src` in `src/config/profile.ts` to `"/images/profile.jpg"`.
3. **Resume PDF**: Replace `public/resume.pdf` with your actual resume PDF and optionally update `PROFILE.resume.downloadFilename`.
4. **Live GitHub Sync**: Set `PROFILE.social.githubUsername` in `src/config/profile.ts` (or configure `GITHUB_USERNAME` in the environment) to load your real public repositories via the official GitHub API.
5. **Project Links**: Add real repository and live URLs in `src/data/projects.ts` as individual projects are implemented.

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

# Architectural Decision Record: Phase 2 — Upfront Foundation (The Shell)

- **Spec Reference**: `docs/specs/0001-phase-2-shell/index.md`
- **Status**: Accepted
- **Decider**: Principal Architect & Engineering Team
- **Date**: 2026-10-19

---

## 1. Context & Problem Statement

Event kitchen environments during major camp meetings are notorious for severe cellular attenuation, metal-roof signal dead zones, and sudden network dropouts. If an application requires external network roundtrips to fetch CSS stylesheets, typography files, or icon sprites during or after initial load, the app will fail silently or display an unstyled broken interface.

Furthermore, an uncurated Service Worker lifecycle can catastrophically reload an active kitchen dashboard mid-service if a new version is detected in the background, wiping active counter memory.

Phase 2 establishes the hardened, precached, zero-dependency App Shell foundation that all subsequent functional sprints will populate.

---

## 2. Decision Log & Strategic Rationale

### 2.1 Inlined CSS & SVG Symbols vs. External Files
- **Decision**: Inline all core CSS rules, typography `@font-face` declarations, and SVG iconography directly into `index.html`.
- **Rationale**:
  - Eliminates separate HTTP requests on initial boot.
  - Guarantees that if the browser opens `index.html` directly from disk or cache, 100% of the styling and icon assets are immediately available synchronously with zero layout shift (CLS = 0).
  - Maximizes performance: total shell payload remains under 50KB uncompressed, well within the 500KB total budget.

### 2.2 Rejection of Tailwind CDN Script
- **Decision**: Hand-crafted, precompiled modern CSS mapped directly to `:root` variables, strictly banning `<script src="https://cdn.tailwindcss.com">`.
- **Rationale**:
  - The Tailwind CDN compiles styles JIT in the browser via client-side JavaScript, requiring an external script download.
  - The CDN script violates our strict Content Security Policy (`script-src 'self' 'unsafe-inline'`).
  - If a server opens the app in aeroplane mode, the Tailwind CDN script fails to load, leaving the page completely unstyled and broken.

### 2.3 Service Worker Cache Lifecycle & Suppression of `skipWaiting`
- **Decision**: Precache all core assets in `tiag-kitchen-v1` on `install`, but strictly refrain from calling `self.skipWaiting()` during active service sessions.
- **Rationale**:
  - If conference organizers deploy a patch to static hosting while servers are actively distributing meals, calling `skipWaiting()` and auto-reloading the page would destroy in-memory UI state and interrupt the live queue.
  - New service worker versions will install in the background and wait until the current kitchen session is ended and the browser tab is fully closed before activating.

### 2.4 High-Contrast Status Color Quarantine Enforcement
- **Decision**: Establish strict color quarantine tokens in `:root` separating the TIAG-2026 conference brand palette (`#A20000`, `#FF2A2A`, `#7F499A`) from the operational status palette (`#1FA45B`, `#F5A524`, `#B00101`, `#0A0A0A`).
- **Rationale**:
  - Prevents brand red from appearing on serving counter surfaces, eliminating ambiguous emergency signals for kitchen servers.

---

## 3. Considered Alternatives & Trade-offs

| Alternative | Evaluation | Verdict |
|---|---|---|
| **Multi-file React/Vite SPA** | Requires heavy build toolchain (`node_modules`, npm build pipelines) and runtime JS overhead for a simple 2-screen portion counter. | **Rejected** for Phase 2. Zero-dependency monolithic PWA delivers maximum resilience and zero maintenance. |
| **Google Fonts CDN Link** | Causes page rendering block or fallback flash if network drops; violates offline-first requirement. | **Rejected**. Poppins latin subset bundled locally as WOFF2. |
| **FontAwesome / Lucide Icon CDN** | Adds external network latency and dependency on third-party CDNs. | **Rejected**. Hand-optimized inlined SVG `<symbol>` vault. |

---

## 4. Consequences & Follow-Up Sprints

- **Positive**: 
  - Complete offline survivability in aeroplane mode from Day 1.
  - Fast first paint (<100ms) with zero layout shift.
  - Safe foundation for Sprint 3.1 (Setup Screen) and Sprint 3.2 (Serving Dashboard).
- **Negative / Risks**:
  - Must ensure local Poppins font files are correctly formatted and encoded so they don't bloat the repository.

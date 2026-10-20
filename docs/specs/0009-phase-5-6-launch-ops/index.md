# Technical Specification: Phase 5 & 6 — Brand Launch, Live Cutover & Ops Manual

- **Feature Name**: Brand Launch, Production Bundle Audit, Static Deployment Architecture & Kitchen Lead Operations Runbook
- **Status**: Accepted
- **Author**: Antigravity Principal Architect
- **Date**: 2026-10-19
- **Target Milestone**: Phase 5 (Launch & Cutover) & Phase 6 (Operations Manual)

---

## 1. 100% Requirement Ingestion Matrix (Anti-Lossy Traceability)

| Detail # | User / Context Specification | Implementation Target | Acceptance Criterion |
|---|---|---|---|
| **D-1** | App bundle size constraint: total payload $<500\text{KB}$ to ensure instant cold install | Directory size audit | **AC-1** |
| **D-2** | Zero-server static hosting: compatible with Cloudflare Pages, GitHub Pages, Vercel, Netlify | Static build topology & zero backend dependencies | **AC-2** |
| **D-3** | Progressive Web App installability: valid webmanifest, icons, standalone display mode | Manifest audit & service worker registration | **AC-3** |
| **D-4** | Kitchen Lead Operations Runbook: pre-service setup checklist, device orientation, aeroplane mode protocol | `docs/ops-manual.md` | **AC-4** |
| **D-5** | Post-service reconciliation protocol: CSV export, plain text broadcast to church leadership | `docs/ops-manual.md` | **AC-5** |
| **D-6** | Emergency incident response: accidental reset recovery via IndexedDB snapshots, screen unlock procedure | `docs/ops-manual.md` | **AC-6** |

---

## 2. Numbered Acceptance Criteria

- **`AC-1` (Bundle Size < 500KB)**: The sum of `index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, and `icon-512.png` is $\le 500\text{KB}$ (measured at $\approx 123\text{KB}$).
- **`AC-2` (Static Host Verification)**: The application has zero backend runtime dependencies (no Node, no Python, no database server required at runtime) and can be hosted directly on any HTTPS static file host.
- **`AC-3` (PWA Standalone Compliance)**: `manifest.webmanifest` contains valid `start_url`, `display: "standalone"`, `background_color`, `theme_color`, and 192px/512px icon definitions.
- **`AC-4` (Kitchen Lead Ops Manual)**: Complete, step-by-step documentation for pre-service device preparation, live operation, and post-service reconciliation.

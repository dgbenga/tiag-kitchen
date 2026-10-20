# Technical Specification: Phase 2 — Upfront Foundation (The Shell)

- **Feature Name**: Upfront Foundation (The Shell)
- **Status**: Accepted
- **Author**: Antigravity Principal Architect
- **Date**: 2026-10-19
- **Target Milestone**: Phase 2 (Foundation & Precached App Shell)

---

## 1. 100% Requirement Ingestion Matrix (Anti-Lossy Traceability)

| Detail # | User / Context Specification | Implementation Target | Acceptance Criterion |
|---|---|---|---|
| **D-1** | 100% offline-ready precached App Shell via Service Worker (`sw.js`) | `sw.js`, `index.html` | **AC-1** |
| **D-2** | Zero CDN dependencies: all CSS, scripts, and SVG icons inlined or local | `index.html`, `styles.css` | **AC-2** |
| **D-3** | Strict Content Security Policy (CSP) blocking external telemetry, tracking, and remote CDNs | `<meta http-equiv="Content-Security-Policy">` in `index.html` | **AC-3** |
| **D-4** | Local font delivery: Poppins latin subset (500, 600, 700, 800) with robust system fallbacks | `@font-face` definitions & `fonts/` assets | **AC-4** |
| **D-5** | W3C Web App Manifest (`manifest.webmanifest`) with standalone display, icons (192px/512px), and brand theme | `manifest.webmanifest` | **AC-5** |
| **D-6** | Single-Knob CSS Variable Cascade bound to `:root` per `context/ui-tokens.md` | Inlined `<style>` in `index.html` | **AC-6** |
| **D-7** | Industrial touch viewport constraints: `touch-action: manipulation`, no double-tap zoom, no pull-to-refresh | `body` & `#app-root` CSS | **AC-7** |
| **D-8** | Inlined SVG Symbol Vault for all status icons (Checkmark, Triangle, Exclamation, Lock, Gear, Undo) | `<svg id="icon-vault">` in `index.html` | **AC-8** |
| **D-9** | Complete DOM Shell containers for Setup, Serving, Settings, Serve Multiple, Summary, and Multi-tab Overlay | Semantic `<main id="app-root">` structure | **AC-9** |
| **D-10** | Global Error Boundary and Unhandled Rejection interceptor with local ring buffer | Inlined `<script>` runtime bootstrap | **AC-10** |

---

## 2. Non-Destructive Blast-Radius Contract (Anti-Regression Lock)

- **Target Blast Radius**:
  - `index.html` (New creation: App shell structure, inlined CSS tokens, SVG vault, bootstrap JS)
  - `sw.js` (New creation: Cache-first Service Worker with versioned cache `tiag-kitchen-v1`)
  - `manifest.webmanifest` (New creation: PWA manifest)
  - `icon-192.png` & `icon-512.png` (New creation: PWA brand icons)
  - `fonts/` directory (Local Poppins WOFF2 font files)
- **Protected Working Surface ("DO NOT TOUCH")**:
  - `context/*.md` (Strictly immutable context contracts locked during Kickoff)
  - `AGENTS.md` (Governing rulebook)
  - `Tiag_Kitchen_Discovery_Document_v2.md` (Source discovery reference)
- **Surgical Edit Guarantee**: Phase 2 creates exclusively the foundational shell assets. No business logic or state mutations are stubbed or mocked.

---

## 3. Technical Contract & Interfaces

### 3.1 PWA Manifest Contract (`manifest.webmanifest`)
```json
{
  "name": "Tiag Kitchen",
  "short_name": "Tiag Kitchen",
  "description": "Offline food portion counter for event kitchen service",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0A0A0A",
  "theme_color": "#0A0A0A",
  "icons": [
    {
      "src": "./icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "./icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 3.2 Service Worker Cache Contract (`sw.js`)
- **Cache Name**: `tiag-kitchen-v1`
- **Precaching List**:
  - `./`
  - `./index.html`
  - `./manifest.webmanifest`
  - `./icon-192.png`
  - `./icon-512.png`
  - `./fonts/poppins-500.woff2`
  - `./fonts/poppins-600.woff2`
  - `./fonts/poppins-700.woff2`
  - `./fonts/poppins-800.woff2`
- **Cache Strategy**: Cache-First, network fallback. Navigation requests fall back to `./index.html`.
- **Lifecycle Guard**: Does NOT call `skipWaiting()` automatically while active sessions exist.

### 3.3 Strict Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data: blob:; connect-src 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';">
```

---

## 4. Numbered Acceptance Criteria

- **`AC-1` (Offline Precache)**: When the application is loaded once over HTTPS, all core assets (HTML, manifest, icons, fonts) are stored in CacheStorage under `tiag-kitchen-v1`. Subsequent reloads with network disconnected resolve instantly from cache.
- **`AC-2` (Zero Remote Calls)**: Network inspection confirms zero HTTP requests to external domains (no Google Fonts, no Tailwind CDN, no analytics, no remote icons).
- **`AC-3` (CSP Enforcement)**: Outbound `connect-src` is strictly `'none'`. Any attempt to fetch external telemetry is blocked by the browser.
- **`AC-4` (Local Typography)**: Text renders using local Poppins fonts (500, 600, 700, 800) without external network fetches, with a seamless system sans-serif fallback.
- **`AC-5` (PWA Installation)**: Android Chrome and iOS Safari recognize the app as an installable PWA with correct icons, title, and full-screen standalone display.
- **`AC-6` (Single-Knob Token Cascade)**: Modifying `--brand-primary` or `--status-ok-surface` in `:root` cascades instantaneously to all associated CSS classes.
- **`AC-7` (Touch Ergonomics)**: Rapid double-taps on the viewport do not trigger zoom; swipe-down does not trigger pull-to-refresh; long-press does not show callout menus.
- **`AC-8` (SVG Symbol Availability)**: All registered icons (`#icon-check`, `#icon-warn-triangle`, `#icon-critical-hex`, `#icon-lock`, `#icon-gear`, `#icon-undo`, `#icon-close`) render crisply at any size via `<svg><use href="#..."></svg>`.
- **`AC-9` (DOM Shell Scaffolding)**: The complete container layout exists with correct IDs (`#screen-setup`, `#screen-serving`, `#sheet-settings`, `#sheet-serve-multiple`, `#screen-summary`), correctly styled in default inactive/active states.
- **`AC-10` (Error Boundary Capture)**: Any uncaught runtime error is intercepted by `window.onerror` and safely recorded in an in-memory diagnostic ring buffer without throwing an unhandled browser crash.

---

## 5. Wireframe & Viewport Hierarchy

```
+-------------------------------------------------------------+
| #app-root                                                   |
|                                                             |
|  +-------------------------------------------------------+  |
|  | #screen-setup (Initial Active View)                   |  |
|  |  - Hero gradient container with 96px circular logo    |  |
|  |  - Form card with initial count fields & PIN          |  |
|  |  - "Ready offline" status badge                       |  |
|  |  - Full-width pill "START SERVING"                    |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  +-------------------------------------------------------+  |
|  | #screen-serving (Hidden by default)                   |  |
|  |  - 8% Header bar with logo, title, status, gear       |  |
|  |  - 20% Workers & Pastors row                          |  |
|  |  - 60% Participants dominant button                   |  |
|  |  - 12% Undo & Serve Multiple footer                   |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  +-------------------------------------------------------+  |
|  | #sheet-backdrop & Modals (Hidden by default)          |  |
|  |  - #sheet-serve-multiple                              |  |
|  |  - #sheet-settings                                    |  |
|  |  - #sheet-install-guide                               |  |
|  |  - #screen-summary                                    |  |
|  |  - #overlay-multi-tab                                 |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  +-------------------------------------------------------+  |
|  | #icon-vault (Hidden SVG symbols)                      |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

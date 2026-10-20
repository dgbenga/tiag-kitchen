# Technical Specification: Phase 4 — Production Hardening & Quality Gate

- **Feature Name**: Quality Gate, Offline Invariance, Rapid-Tap Stress Testing, WCAG 7:1 Contrast Floor, and Security Auditing
- **Status**: Accepted
- **Author**: Antigravity Principal Architect
- **Date**: 2026-10-19
- **Target Milestone**: Phase 4 Production Quality Gate & Verification

---

## 1. 100% Requirement Ingestion Matrix (Anti-Lossy Traceability)

| Detail # | User / Context Specification | Implementation Target | Acceptance Criterion |
|---|---|---|---|
| **D-1** | Aeroplane mode survivability: precached shell loads and operates with zero network | `sw.js` cache manifest & offline test suite | **AC-1** |
| **D-2** | Zero remote calls / Zero CDN links: all styles, scripts, fonts, and SVGs are 100% local | Strict CSP `<meta>` & dependency audit | **AC-2** |
| **D-3** | 10 rapid taps invariant: exactly $\le 10$ decrements, zero double-counting, zero dropped counts | Touch engine 200ms debounce test | **AC-3** |
| **D-4** | Zero boundary enforcement: at 0 remaining, button locks, prevents negative numbers, signals FINISHED | Decrement engine boundary guard | **AC-4** |
| **D-5** | WCAG 7:1 contrast floor: large numerals (>24pt/32px) and text maintain high contrast across OK, LOW, CRITICAL, and FINISHED | APCA / WCAG relative luminance check | **AC-5** |
| **D-6** | Drag cancellation: pointer movements $>12\text{px}$ cancel the decrement action without counting | Touch engine distance threshold | **AC-6** |
| **D-7** | 30-step named undo stack: accurately rolls back actions and restores previous counts in LIFO order | Undo stack test with state snapshots | **AC-7** |
| **D-8** | Emergency reset security: 2-second hold + PIN gate + automated immutable snapshot before clearing | Reset engine & IDB snapshot | **AC-8** |
| **D-9** | Screen Wake Lock survivability: re-acquires lock upon visibilitychange (`document.visibilityState === 'visible'`) | Wake Lock lifecycle listeners | **AC-9** |
| **D-10** | Status color quarantine: red strictly reserved for CRITICAL (<10%), never used on OK/LOW cards | CSS color audit | **AC-10** |

---

## 2. Numbered Acceptance Criteria

- **`AC-1` (Offline Precache Shell)**: Service Worker precaches all core resources (`/`, `index.html`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`). Cache hits return HTTP 200 while offline.
- **`AC-2` (Zero-CDN & CSP Enforcement)**: `index.html` contains zero external HTTP/HTTPS stylesheet, script, or font links. Strict Content Security Policy meta tag blocks all external network connections.
- **`AC-3` (10 Rapid Taps Invariant)**: In simulating 10 rapid successive taps within 1 second, the counter decrements by at most the debounced allowance (e.g. 5 under a 200ms debounce window), never drops into negative numbers, and never exceeds 10 decrements.
- **`AC-4` (Zero Boundary Lock)**: Decrements stop strictly at 0. Tapping at 0 triggers tactile error warning and leaves the count at 0.
- **`AC-5` (WCAG 7:1 Contrast Verification)**:
  - OK State: `#0E4A28` on `#DFF5E8` $\ge 7:1$.
  - LOW State: `#4E3304` on `#FFE9A8` $\ge 7:1$.
  - CRITICAL State: `#FFFFFF` on `#B00101` $\ge 7:1$.
  - FINISHED State: `#8C8C8C` on `#0A0A0A` $\ge 4.5:1$ (inactive/disabled state).
- **`AC-6` (12px Drag Rejection)**: Pointer moves exceeding $\Delta x^2 + \Delta y^2 > 144$ cancel decrement.
- **`AC-7` (30-Step LIFO Named Undo)**: Performing 30 actions and then 30 undos returns the exact initial state.
- **`AC-8` (Reset Guard & Snapshot Archive)**: Triggering reset stores a full session copy in `snapshots` before clearing active state.
- **`AC-9` (Wake Lock Visibility Re-request)**: Switching tabs or minimizing and restoring re-invokes `navigator.wakeLock.request('screen')`.
- **`AC-10` (Status Color Quarantine)**: Counters and cards in OK and LOW states do not contain `#FF2A2A` or `#B00101`.

# AGENTS.md — Production Standards for Tiag Kitchen

## Why these rules exist

There is no human code reviewer in this workflow. Whatever gets written here is what ships to live event kitchens. The discipline a senior engineer normally enforces from the outside must be enforced from the inside, on every pass. Tiag Kitchen is deployed in high-stress, offline environments (kitchen service lines with heat, grease, steam, and queue pressure). A failure signature here is catastrophic: counts lost mid-service, frozen screens, unresponsive buttons under rapid tapping, or loss of state on phone restart.

This isn't theoretical:
- **Offline Failure & Silent Drop**: If styling or scripts rely on external CDNs (Tailwind CDN, Google Fonts, CDN icons), the app breaks or unstyles the instant cellular signal is dropped in the dining hall.
- **Accidental Wipe / Session Reset**: A single misplaced tap or unconfirmed reset wipes an entire evening's service tally for hundreds of church conference attendees.
- **Data Loss on Phone Restart / Battery Death**: If state is stored only in memory or unsafely in browser storage without dual-write synchronization and sequence numbers, a dead phone leaves the kitchen blind.
- **Touch Latency & Double Counting**: Rushed taps with wet or gloved hands can register multiple decrements or trigger unwanted zooming if touch-action and debouncing aren't strictly guarded.
- **Color Domain Confusion**: Using brand red on a serving screen causes panic or blindness to true critical stock emergencies.

Apply these gates whenever: scaffolding a new project, adding a feature, fixing a bug, preparing to deploy, or reviewing existing code.

---

## Calibrating rigor

| Context | Rigor |
|---|---|
| Throwaway prototype / idea exploration | Mention gaps, don't block on them |
| Feature for an existing real product | Full build gate (below) |
| Anything touching persistence, counts, or reset | Full build gate, no exceptions, be explicit about what was checked |
| About to deploy / "this is ready" | Full ship gate (below) |

---

## Gate 1 — Kickoff (before writing any code)

Lock in what's expensive to change later: offline PWA architecture, dual-write data model, zero-server privacy, single-knob design tokens, and strict serving status color quarantine.

**The Context File Suite in `context/`:**
1. **`context/project-overview.md`** — Problem, personas, UX research intelligence (JTBD, verbatim user pain points, Jakob's law patterns, competitive whitespace, copywriting vault).
2. **`context/architecture.md`** — Offline-first PWA topology, dual-write engine (`localStorage` + `IndexedDB`), Service Worker lifecycle, Web APIs (Wake Lock, Web Audio, Haptics), and 2-Stage Evolution Roadmap.
3. **`context/design.md`** — TIAG-2026 brand tokens, Poppins typography hierarchy (weight 800 numerals), and strict Serving Status Color Quarantine.
4. **`context/ui-tokens.md`** — Single-knob CSS variables cascading through `globals.css` / inlined styles.
5. **`context/ui-rules.md`** — Atomic design composition, touch constraints (min 48px/88px/56px, 55-60% Participant button), Anti-Pill Law for badges, human copywriting contracts.
6. **`context/ui-registry.md`** — Atomic UI component inventory (`[ATOM]`, `[MOLECULE]`, `[ORGANISM]`).
7. **`context/code-standards.md`** — Zero-trust client validation, touch debounce (200ms), drag cancellation (12px), multi-touch lock, CSP header.
8. **`context/library-docs.md`** — Verified live documentation for Web APIs (Service Worker, CacheStorage, IndexedDB, Screen Wake Lock, Web Audio).
9. **`context/build-plan.md`** — Complete 6-Phase production lifecycle, Bootcapt section specifications, and Definition of Done per feature.
10. **`context/progress-tracker.md`** — Phase tracking and Decisions Made During Build log.

---

## Gate 2 — Build (while writing each feature)

Five lenses, every feature that touches input/data/rendering:

### Design System & Atomic UI
- **Zero Component Guessing**: Every interactive component must derive from registered Atoms and Molecules in `context/ui-registry.md`.
- **Atomic Composition**: Compose Atoms into Molecules, and Molecules into Organisms.
- **No Hardcoded Hex in Components**: Never use raw `#hex` in component styles. Reference only semantic tokens (`var(--surface-ok)`, `var(--brand-primary)`).
- **Status Quarantine**: Red on the serving screen strictly means CRITICAL portion stock (<10% of total). Never use brand red `#FF2A2A` on the counter surfaces.

### Security & Privacy
- **Zero Third-Party Calls**: Strict Content Security Policy (CSP) blocking external domains, analytics, telemetry, or remote scripts.
- **No Personal Data**: Zero collection of personal names, emails, credentials, or tracking identifiers.
- **Lead PIN Protection**: 4-digit PIN stored as a salted SHA-256 hash in local storage to prevent accidental resets or unauthorized configuration changes.
- **Destructive Action Confirmation**: Reset requires a 2-second press-and-hold + PIN (if configured) + automated state snapshot before clearing.

### Accessibility (WCAG 2.1 AA Kitchen Floor)
- **High Contrast**: Minimum 7:1 contrast ratio for all counter numbers against button surfaces (checked across OK, LOW, CRITICAL, and FINISHED states).
- **Multi-Modal State Signaling**: Never rely solely on color. Every status change includes a label ("OK", "LOW", "CRITICAL", "FINISHED"), an SVG icon, and distinct edge borders.
- **Touch Targets**: Minimum 48px for utility controls, 88px for secondary cards (Workers/Pastors), 56px for footer buttons, and 55–60% of viewport height for the primary Participant button.
- **Motor Assistance**: `touch-action: manipulation`, 200ms debounce per counter, 12px drag cancellation, double-tap zoom suppression.

### Performance & Resilience
- **100% Offline Precached Shell**: Service Worker precaches all core files (`index.html`, `sw.js`, `manifest.webmanifest`, icons, local Poppins WOFF2 fonts).
- **Synchronous Dual-Persistence**: Immediate synchronous write to `localStorage` followed by IndexedDB mirror with monotonic sequence IDs (`seq`) and state checksums.
- **Screen Wake Lock**: Acquire Screen Wake Lock during active service, re-requesting upon visibility change.
- **Rapid Visual Feedback**: Visual response within 50ms of pointer release.

### Testing
- **Aeroplane Mode Verification**: Mandatory test suite executed with aeroplane mode enabled, after hard application restart and device reboot.
- **Rapid Tap Invariant**: 10 rapid taps must subtract exactly 10 portions or fewer—never more, never double-counting.
- **Zero Boundary Enforcement**: At 0 portions left, counter locks, transitions to FINISHED, triggers tactile vibration, and prevents decrements.
- **30-Step Named Undo**: Multi-category undo stack correctly restores prior counts in exact reverse chronological order.

---

## Gate 3 — Ship (before saying "ready" / deploying)

Check against `context/progress-tracker.md`:
- [ ] 100% offline functionality verified in aeroplane mode
- [ ] No external CDN links in `index.html` (all styles/fonts/scripts bundled locally)
- [ ] Strict Content Security Policy meta tag enabled
- [ ] Screen Wake Lock operational with auto-lock guidance fallback
- [ ] Multi-touch and accidental drag rejection verified
- [ ] Dual-persistence sequence number recovery verified
- [ ] 30-step undo stack reverses actions with accurate action naming
- [ ] Reset requires 2-second hold and auto-snapshots previous session
- [ ] 7:1 number contrast verified across all 4 status states
- [ ] End-of-service summary matches audit log with offline CSV and text copy

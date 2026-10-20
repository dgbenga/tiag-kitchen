# Master Build Plan: Tiag Kitchen

## 1. Information Architecture & Hierarchical Sitemap

```
                              [ENTRY POINT]
                                    │
                                    ▼
                          ┌──────────────────┐
                          │   SETUP SCREEN   │
                          │ - Logo Upload    │
                          │ - Event/Station  │
                          │ - 3 Start Counts │
                          │ - Optional PIN   │
                          │ - Install Guide  │
                          └─────────┬────────┘
                                    │
                                    │ "Start Serving"
                                    ▼
                    ┌────────────────────────────────┐
                    │       SERVING DASHBOARD        │
                    │ - Header + Status + Settings   │
                    │ - Workers & Pastors (20%)      │
                    │ - Participants Button (60%)    │
                    │ - Undo Bar & Serve Multiple    │
                    └───────┬──────────────┬─────────┘
                            │              │
             "Settings Gear"│              │ "End Service" (Confirmed)
                            ▼              ▼
              ┌──────────────────┐   ┌───────────────────────────┐
              │  SETTINGS SHEET  │   │   END-OF-SERVICE SUMMARY  │
              │ - Restock (+N)   │   │ - Category Metrics Table  │
              │ - Adjust Count   │   │ - Copy Summary as Text    │
              │ - Tap Lock       │   │ - Download CSV File       │
              │ - Sound/Haptics  │   │ - "Start New Event"       │
              │ - Hold-to-Reset  │   └───────────────────────────┘
              └──────────────────┘
```

---

## 2. Section-by-Section Bootcapt Specifications

### SECTION 1: Setup Hero & Branding
- **Position**: Top of Screen 1.
- **Purpose**: Welcomes the kitchen lead, establishes event identity, and verifies offline readiness.
- **Layout**: Gradient hero card with curved bottom edge, centered 96px circular logo container.
- **Visual Weight**: Primary visual focus on first launch.
- **Element Inventory**:
  - `LogoSlot` (96px) with "Add organiser logo" action button.
  - Title: "TIAG KITCHEN" (White bold uppercase).
  - Subtitle: "Count every plate. Works offline."
  - Status Chip: "Ready offline" (Green tick) / "Not ready: connect once and refresh" (Amber).
- **Interaction Notes**: Tapping logo triggers native image picker; rejects non-images or files over 6MB; scales to 512px.
- **Mobile Collapse (375px)**: Proportions shrink smoothly; logo scales to 80px if height < 640px.

### SECTION 2: Setup Form Card
- **Position**: Center/Bottom of Screen 1.
- **Purpose**: Gathers initial counts and administrative constraints before service unlocks.
- **Layout**: Stacked inputs with generous spacing (16px gap).
- **Element Inventory**:
  - Event Name input (Placeholder: "e.g. TIAG-2026 Camp Meeting").
  - Station Name input (Placeholder: "e.g. Station A - Main Tent").
  - Three Count Fields: Participants, Workers, Pastors (inputmode="numeric", whole numbers 0–99,999).
  - Optional Lead PIN input (4 digits, password type).
  - Primary CTA: "START SERVING" (Full-width pill button).
- **Interaction Notes**: "START SERVING" is disabled until at least one category count is > 0 and inputs are valid.

### SECTION 3: Serving Header Bar
- **Position**: Fixed top of Screen 2 (height ~8% of viewport).
- **Purpose**: Displays persistent event identity, system status, and settings access without cluttering the screen.
- **Layout**: Flexbox space-between, near-black `#0A0A0A` background with 3px brand gradient bottom line.
- **Element Inventory**:
  - Left: 40px circular `LogoSlot` + "Tiag Kitchen" title + Event name subline.
  - Right: Worst-Status badge (e.g. "ALL OK" or "CRITICAL") + Settings gear button (48px tap target).

### SECTION 4: Secondary Serving Counters (Workers & Pastors)
- **Position**: Directly below Header (height ~20% of viewport).
- **Purpose**: Allows decrementing secondary attendee categories while maintaining visual clarity.
- **Layout**: Side-by-side equal-width cards (min 88px tall).
- **Element Inventory**:
  - Card Title (e.g. "WORKERS").
  - Large tabular numeral (Remaining count).
  - Subtitle: "Served: N".
  - Small "x N" chip button to trigger Serve Multiple specifically for this category.
  - Multi-sensory status border and badge.
- **Interaction Notes**: Pointer release triggers decrement of 1; 200ms button debounce.

### SECTION 5: Primary Serving Counter (Participants)
- **Position**: Center stage (height ~55%–60% of viewport).
- **Purpose**: Main touch target for the server. Dispatches the high-volume participant line with zero cognitive friction.
- **Layout**: Full-width edge-to-edge card button with massive typography.
- **Visual Weight**: Dominates the screen (60% visual attention).
- **Element Inventory**:
  - Header: Category name "PARTICIPANTS" + StatusBadge.
  - Hero numeral: 72px–110px tabular font, weight 800.
  - Label: "LEFT".
  - Footer count: "Served: N".
- **Interaction Notes**:
  - Tap down triggers 0.97 scale; release triggers -1 decrement and 50ms surface flash.
  - At 0: Locks surface, displays "FINISHED", vibrates 400ms.

### SECTION 6: Serving Footer Action Bar
- **Position**: Fixed bottom of Screen 2 (height ~12% of viewport, safe-area padded).
- **Purpose**: Houses error recovery (Undo) and rapid bulk serving (Serve multiple).
- **Layout**: Two-button row with 12px gap.
- **Element Inventory**:
  - Left: Royal Purple pill button "Undo: [Last Action]" (min 56px height).
  - Right: White/Outline pill button "Serve multiple" (min 56px height).
- **Interaction Notes**: Undo reverses last action up to 30 history steps; disabled when history is empty.

### SECTION 7: Serve Multiple Bottom Sheet
- **Position**: Modal sheet sliding up from bottom.
- **Purpose**: Dispatches 2, 3, 4, 5, or 10 plates in a single confirmed step.
- **Element Inventory**:
  - Header: "Serve how many?" + Category selector pills.
  - Quick-select chip row: `[ 2 ]` `[ 3 ]` `[ 4 ]` `[ 5 ]` `[ 10 ]`.
  - Full-width "CONFIRM" pill button.

### SECTION 8: Settings Bottom Sheet
- **Position**: Modal sheet sliding up from bottom.
- **Purpose**: Administrative controls protected by optional lead PIN.
- **Element Inventory**:
  - "Add food" (Restock dialog: category + quantity).
  - "Fix a count" (Adjust dialog: category + exact left value).
  - "Tap Lock" (Dims screen; requires 1s press to unlock).
  - Sound & Vibration toggles.
  - "End Service" (Confirmation dialog leading to Summary).
  - "Hold to reset" (Quiet red outline; 2-second hold-to-confirm).

### SECTION 9: End-of-Service Summary View
- **Position**: Full-screen view replacing dashboard upon service completion.
- **Purpose**: Final reconciliation and data export.
- **Element Inventory**:
  - Header: 72px Logo + Event name + Station name + Duration timestamp.
  - Per-category table: Starting, Restocked, Adjusted, Served, Remaining.
  - "Copy summary as text" button (Clipboard API).
  - "Download CSV" button (Blob download).
  - "START NEW EVENT" primary button.

---

## 3. Phased 6-Phase Production Lifecycle

### Phase 1: Discovery & Architecture Specs
- [x] UX Research Synthesis completed (`project-overview.md`).
- [x] Architecture topology locked (`architecture.md`).
- [x] Brand design tokens locked (`design.md` & `ui-tokens.md`).
- [x] UI rules and component registry locked (`ui-rules.md` & `ui-registry.md`).
- [x] Code standards and API contracts locked (`code-standards.md` & `library-docs.md`).

### Phase 2: Upfront Foundation (The Shell)
- [x] `index.html` structure with meta tags, CSP header, and root layout containers.
- [x] `manifest.webmanifest` with PWA metadata, standalone display mode, and icon definitions.
- [x] Inlined CSS system containing all `:root` CSS variables and responsive rules.
- [x] Local font embedding (Poppins Latin subset weights 500, 600, 700, 800 as local WOFF2 / SVG fallback).
- [x] SVG icon vault (Checkmark, Warning Triangle, Exclamation Hexagon, Padlock, Gear, Undo, Close).
- [x] Service Worker (`sw.js`) precaching engine.

### Phase 3: Methodical Layered Sprints
- [x] **Sprint 3.1: Setup Screen & Logo Pipeline**
  - Implement Setup form, input sanitizers, PIN hashing, canvas logo resizer, and IndexedDB storage.
  - Add-to-Home-Screen guide card.
- [x] **Sprint 3.2: Serving Dashboard & Portion Engine**
  - Implement Header, Workers/Pastors secondary cards, Participants hero button.
  - Wire portion math engine with ceiling calculations: OK (>25%), LOW (<=25%), CRITICAL (<=10%), FINISHED (0).
- [x] **Sprint 3.3: Touch Engine, Wake Lock, Haptics & Audio**
  - Pointer release handler with 12px drag cancellation and 200ms button debounce.
  - Screen Wake Lock integration with auto-lock guidance fallback.
  - Web Audio tone synthesizer and navigator haptic pulses.
- [x] **Sprint 3.4: 30-Step Undo Stack & Serve Multiple Sheet**
  - Dynamic named undo stack.
  - Modal bottom sheet with quick-select portion chips (2, 3, 4, 5, 10).
- [x] **Sprint 3.5: Settings Sheet & Admin Restock/Reset**
  - Restock and Adjust dialogs.
  - Tap Lock mode.
  - 2-second hold-to-reset with automated session snapshot.
- [x] **Sprint 3.6: Summary Screen & Dual-Persistence Sync**
  - Synchronous `localStorage` + asynchronous `IndexedDB` dual-write engine.
  - End-of-service reconciliation view with offline CSV and clipboard copy.

### Phase 4: Production Hardening & Quality Gate
- [x] Aeroplane mode verification test suite.
- [x] 10-rapid-taps stress test (zero ghost counting).
- [x] WCAG 7:1 contrast audit across all four status states.
- [x] Screen Wake Lock survivability across app minimize/restore.

### Phase 5: Brand Launch & Live Cutover
- [x] App bundle size audit (target < 500KB total — verified 120.44KB).
- [x] Static host deployment verification (Cloudflare Pages / GitHub Pages).
- [x] PWA installation audit on Android Chrome and iOS Safari.

### Phase 6: Formal Handover & Ops Manual
- [x] Pre-service testing checklist for kitchen leads.
- [x] Aeroplane mode verification guide.
- [x] 30-day conference support warranty.

---

## 4. Definition of Done per Feature

Every sprint feature must satisfy this checklist before being marked complete:
1. **Visual Fidelity**: Matches the spatial grid, typography, and color tokens defined in `design.md`.
2. **Offline Parity**: Functions completely without internet access.
3. **Touch Safety**: Respects the 200ms debounce and 12px drag cancellation rules.
4. **Contrast Floor**: Numerals meet or exceed 7:1 contrast ratio.
5. **Atomic Consistency**: Built strictly using registered Atoms and Molecules from `ui-registry.md`.
6. **Progress Tracker**: Updated in `progress-tracker.md`.

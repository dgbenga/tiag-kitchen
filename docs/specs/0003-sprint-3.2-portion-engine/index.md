# Technical Specification: Sprint 3.2 — Serving Dashboard & Portion Engine

- **Feature Name**: Serving Dashboard & Portion Status Engine
- **Status**: Accepted
- **Author**: Antigravity Principal Architect
- **Date**: 2026-10-19
- **Target Milestone**: Sprint 3.2 (Countdown Taps, Ceiling Math, Multi-Sensory States, Dual-Persistence Sync)

---

## 1. 100% Requirement Ingestion Matrix (Anti-Lossy Traceability)

| Detail # | User / Context Specification | Implementation Target | Acceptance Criterion |
|---|---|---|---|
| **D-1** | Participants dominant button (55–60% screen height) decrements count by 1 on tap | `card-participants` & `decrementCategory('participants', 1)` | **AC-1** |
| **D-2** | Workers and Pastors secondary cards (min 88px tall) decrement count by 1 on tap | `card-workers`, `card-pastors` | **AC-2** |
| **D-3** | Portion threshold math: $T = \text{initial} + \text{restocked}$. Ceiling calculations $\lceil 0.25 \times T \rceil$ (LOW) and $\lceil 0.10 \times T \rceil$ (CRITICAL) | `calculateCategoryStatus(catData)` | **AC-3** |
| **D-4** | Status conflict resolution: Critical wins if both LOW and CRITICAL conditions match | Status transition logic | **AC-4** |
| **D-5** | Zero boundary locking: At 0 LEFT, count stops decrementing, transitions to FINISHED, displays padlock icon | Boundary guard in `decrementCategory()` | **AC-5** |
| **D-6** | Multi-sensory status indicator updates: OK (green/tick), LOW (amber/triangle), CRITICAL (red/exclamation), FINISHED (black/lock) | `updateCardVisualState()` | **AC-6** |
| **D-7** | Header worst-status badge reflects the most critical state across all 3 categories | `updateHeaderStatus()` | **AC-7** |
| **D-8** | Synchronous dual-write persistence: increment `seq`, FNV-1a checksum, synchronous `localStorage` + IndexedDB mirror | `persistStateMutation()` | **AC-8** |
| **D-9** | Dynamic Undo action tracking: pushes action to 30-item history stack and updates Undo button label (e.g. `Undo: Participants -1`) | `pushUndoAction()` & `btn-undo` | **AC-9** |
| **D-10** | Tap animation: scale 0.97 visual press on `pointerdown`, number bump and count update on release | CSS `.pressed` & number bump keyframe | **AC-10** |

---

## 2. Numbered Acceptance Criteria

- **`AC-1` (Participants Decrement)**: Tapping the Participants button subtracts 1 from `left` and adds 1 to `served`. The hero numeral updates within 50ms.
- **`AC-2` (Secondary Decrements)**: Tapping Workers or Pastors card subtracts 1 from `left` and adds 1 to `served` for that specific category.
- **`AC-3` (Ceiling Math Verification)**: Starting count of 5:
  - At 5: OK ($5 > \lceil 1.25 \rceil = 2$)
  - At 3: OK ($3 > 2$)
  - At 2: LOW ($2 \le 2$ and $2 > 1$)
  - At 1: CRITICAL ($1 \le \lceil 0.50 \rceil = 1$)
  - At 0: FINISHED.
- **`AC-4` (Zero Boundary Lock)**: Tapping a counter at 0 does nothing. The count remains 0, the button displays FINISHED, and no further decrements occur.
- **`AC-5` (Strict Status Color Quarantine)**: Red is applied to counter surfaces ONLY when in the CRITICAL state. The header remains near-black (`#0A0A0A`).
- **`AC-6` (Worst-Status Aggregation)**: If Participants is OK but Workers is LOW, the header badge shows "LOW". If any category is CRITICAL, the header badge immediately switches to "CRITICAL".
- **`AC-7` (State Persistence Monotonicity)**: Every tap increments `state.seq` by 1 and updates `state.checksum`. A page reload preserves the exact decremented counts.
- **`AC-8` (Undo Button Labeling)**: Tapping Participants changes the Undo button from disabled to active with label `"Undo: Participants -1"`.

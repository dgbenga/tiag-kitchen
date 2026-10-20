# Architectural Decision Record: Sprint 3.2 — Serving Dashboard & Portion Engine

- **Spec Reference**: `docs/specs/0003-sprint-3.2-portion-engine/index.md`
- **Status**: Accepted
- **Decider**: Principal Architect & Engineering Team
- **Date**: 2026-10-19

---

## 1. Context & Architectural Rationale

### 1.1 Why Ceiling (`Math.ceil`) Calculations?
- On small food pools (e.g. 5 or 7 plates cooked for Pastors or dietary specials), floating-point arithmetic (e.g. $25\% \times 5 = 1.25$) would lead to confusing status boundaries if rounded down ($1.25 \rightarrow 1$), causing the kitchen to only see an amber alert at 1 plate remaining—at which point critical would also be triggered.
- Rounding up ($\lceil 1.25 \rceil = 2$) guarantees that the amber warning is shown with enough buffer for the server to call for more food.

### 1.2 Worst-Status Header Aggregation
- Servers are heads-down plating food in the center of the screen, focusing on Participants.
- The kitchen lead stands 2–3 meters away, glancing at the header across stations.
- An aggregated worst-status badge in the header ensures that if any secondary pool (Workers or Pastors) drops to LOW or CRITICAL, the lead spots it immediately without having to walk over to inspect individual numbers.

### 1.3 Decoupled Visual Press vs. State Mutation
- Instant feedback on `pointerdown` (CSS `.pressed` scale `0.97`) provides the immediate mechanical satisfaction of a physical clicker.
- The actual count decrement, FNV-1a checksum, and persistence execute on `pointerup`, ensuring an accidental drag or swipe is rejected without corrupting the tally.

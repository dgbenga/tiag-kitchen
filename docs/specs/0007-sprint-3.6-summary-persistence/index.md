# Technical Specification: Sprint 3.6 — Summary Screen & Dual-Persistence Sync

- **Feature Name**: End-of-Service Summary, Reconciliation Table, Offline CSV Export, Clipboard Copy & Dual-Persistence Engine
- **Status**: Accepted
- **Author**: Antigravity Principal Architect
- **Date**: 2026-10-19
- **Target Milestone**: Sprint 3.6 (Reconciliation Math, RFC-4180 CSV Blob Export, Clipboard API Copy, Dual-Persistence Sync)

---

## 1. 100% Requirement Ingestion Matrix (Anti-Lossy Traceability)

| Detail # | User / Context Specification | Implementation Target | Acceptance Criterion |
|---|---|---|---|
| **D-1** | Full-screen Summary view replaces dashboard upon service completion | `#screen-summary` & `renderSummaryScreen()` | **AC-1** |
| **D-2** | Event identity header displays organizer logo, event name, station, and duration | `#summary-event-title`, `#summary-time-range` | **AC-2** |
| **D-3** | Per-category reconciliation table: Starting, Restocked, Adjusted, Served, Remaining | `#summary-metrics-container` table | **AC-3** |
| **D-4** | Summary reconciliation math: $\text{Remaining} = \text{Initial} + \text{Restocked} + \text{Adjusted} - \text{Served}$ | Table calculation engine | **AC-4** |
| **D-5** | Total row aggregates all counts across Participants, Workers, and Pastors | Summary table footer total | **AC-5** |
| **D-6** | "Copy summary as text" copies human-readable summary to system clipboard | `#btn-copy-summary` & `navigator.clipboard` | **AC-6** |
| **D-7** | "Download CSV" generates RFC-4180 CSV blob with automated filename | `#btn-download-csv` & `URL.createObjectURL` | **AC-7** |
| **D-8** | "START NEW EVENT" creates immutable archive snapshot and resets for next session | `#btn-new-event` & `saveSnapshotToIDB()` | **AC-8** |
| **D-9** | Dual-write persistence engine: synchronous `localStorage` + asynchronous IndexedDB `app_state` mirror | `persistStateMutation()` | **AC-9** |
| **D-10** | Monotonic sequence number recovery: selects state with higher `seq` on cold boot | Cold boot reconciliation logic | **AC-10** |

---

## 2. Numbered Acceptance Criteria

- **`AC-1` (Summary Screen Rendering)**: Navigating to `#screen-summary` displays a complete reconciliation table populated with active session values.
- **`AC-2` (Mathematical Invariant)**: In each row and in total, $\text{Starting} + \text{Restocked} + \text{Adjusted} - \text{Served} = \text{Remaining}$.
- **`AC-3` (RFC-4180 CSV Export)**: Clicking "Download CSV Report" prompts download of a valid CSV file containing event metadata and category totals.
- **`AC-4` (Clipboard Sharing)**: Clicking "Copy Summary as Text" copies a clean plain-text breakdown to clipboard and flashes a confirmation toast.
- **`AC-5` (Start New Event Flow)**: Tapping "START NEW EVENT" prompts for Lead PIN (if configured), archives snapshot to IndexedDB, clears active storage, and presents Screen 1.
- **`AC-6` (Dual-Storage Monotonicity)**: On startup, if IndexedDB has `seq = 15` and localStorage has `seq = 14`, the engine adopts the higher sequence ID state.

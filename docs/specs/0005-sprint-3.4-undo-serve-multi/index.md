# Technical Specification: Sprint 3.4 — 30-Step Undo Stack & Serve Multiple Sheet

- **Feature Name**: 30-Step Named Undo Stack & Serve Multiple Bottom Sheet
- **Status**: Accepted
- **Author**: Antigravity Principal Architect
- **Date**: 2026-10-19
- **Target Milestone**: Sprint 3.4 (Serve Multiple Bottom Sheet, Portion Chips 2-3-4-5-10, Dynamic Named Undo Stack)

---

## 1. 100% Requirement Ingestion Matrix (Anti-Lossy Traceability)

| Detail # | User / Context Specification | Implementation Target | Acceptance Criterion |
|---|---|---|---|
| **D-1** | Serve multiple modal bottom sheet triggered by footer button or "× N" category chips | `#btn-serve-multi-trigger`, `.chip-multi[data-cat]` | **AC-1** |
| **D-2** | Category selector inside Serve Multiple sheet allows toggling between Participants, Workers, Pastors | `.multi-cat-btn[data-cat]` | **AC-2** |
| **D-3** | Quick-select portion chips row: [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 10 ] with visual selection state | `.chip-number[data-count]` | **AC-3** |
| **D-4** | Confirm button reflects selected count and category (e.g. `CONFIRM (5 Participants)`) | `#btn-multi-confirm` label and action | **AC-4** |
| **D-5** | Bulk decrement calculation: decrements category count by selected amount or capped by remaining portions | `decrementCategory(catKey, selectedCount)` | **AC-5** |
| **D-6** | Dynamic 30-step undo action logging: records `{ id, t, cat, type: 'decrement', delta }` to history stack | `pushUndoAction()` | **AC-6** |
| **D-7** | Dynamic undo button labeling: shows last reversed action (e.g. `Undo: Participants -5` or `Undo: Workers -2`) | `#label-undo` text update | **AC-7** |
| **D-8** | Full undo reversal: restores exact portion counts and adjusts served counts in reverse chronological order | `performUndo()` | **AC-8** |
| **D-9** | Undo button state management: disabled when stack is empty, enabled when stack has at least 1 action | `#btn-undo.disabled` | **AC-9** |
| **D-10** | Synchronous persistence and checksum sealing on both bulk serve and undo operations | `localStorage` + `IndexedDB` sync | **AC-10** |

---

## 2. Numbered Acceptance Criteria

- **`AC-1` (Triggering Serve Multiple)**: Tapping "Serve multiple" opens `#sheet-serve-multiple` with Participants pre-selected. Tapping "× N" on Workers opens the sheet with Workers pre-selected.
- **`AC-2` (Chip Selection)**: Tapping chips 2, 3, 4, 5, or 10 updates the selected state and dynamically updates the confirm button label to `CONFIRM (N)`.
- **`AC-3` (Bulk Decrement)**: Confirming with 5 selected reduces `left` by 5 (or remaining available) and increases `served` by 5, triggering state persistence and visual status updates.
- **`AC-4` (Undo Label Precision)**: After serving 5 Participants, the undo button displays `Undo: Participants -5`.
- **`AC-5` (Undo Execution)**: Tapping the undo button restores 5 to `left` and subtracts 5 from `served`, updating sequence numbers and re-evaluating portion status indicators.
- **`AC-6` (Stack Capping)**: Executing more than 30 actions retains only the most recent 30 actions, dropping the oldest.

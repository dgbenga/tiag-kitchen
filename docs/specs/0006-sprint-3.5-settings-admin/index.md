# Technical Specification: Sprint 3.5 — Settings Sheet & Admin Restock/Reset

- **Feature Name**: Settings Sheet, Restock & Adjust Dialogs, Tap Lock, PIN Auth & 2s Hold Reset
- **Status**: Accepted
- **Author**: Antigravity Principal Architect
- **Date**: 2026-10-19
- **Target Milestone**: Sprint 3.5 (Restock Math, Adjust Auditing, Lead PIN Gate, Tap Lock Shield, 2s Hold Reset with Auto-Snapshot)

---

## 1. 100% Requirement Ingestion Matrix (Anti-Lossy Traceability)

| Detail # | User / Context Specification | Implementation Target | Acceptance Criterion |
|---|---|---|---|
| **D-1** | Settings sheet accessed via gear icon button on serving header | `#btn-open-settings` & `#sheet-settings` | **AC-1** |
| **D-2** | Sound and Vibration setting toggles dynamically mutate `state.settings` and persist to storage | `#toggle-sound`, `#toggle-vibrate` | **AC-2** |
| **D-3** | Tap Lock mode disables counter interactions and displays full-screen shield requiring 1s hold to unlock | `#btn-setting-taplock`, `#overlay-tap-lock` | **AC-3** |
| **D-4** | Lead PIN authentication gate for Restock, Adjust, and Emergency Reset when PIN was configured | `verifyLeadPin()` & `#sheet-pin-prompt` | **AC-4** |
| **D-5** | Restock dialog adds quantity to `cat.restocked` and `cat.left`, recalculates $T = \text{initial} + \text{restocked}$ | `#sheet-restock` & `executeRestock()` | **AC-5** |
| **D-6** | Adjust dialog calculates delta between new and current `left`, records delta in `cat.adjusted` | `#sheet-adjust` & `executeAdjust()` | **AC-6** |
| **D-7** | End Service action records `endedAt` timestamp, transitions to Screen 3 (#screen-summary) | `#btn-setting-endservice` & `endServiceSession()` | **AC-7** |
| **D-8** | Emergency Reset requires continuous 2.0-second hold with visual fill progress animation | `#btn-setting-reset` 2s hold engine | **AC-8** |
| **D-9** | Automated session snapshot saved to IndexedDB `snapshots` store before any reset execution | `saveSnapshotToIDB()` before state clear | **AC-9** |
| **D-10** | Emergency Reset clears `localStorage`, resets runtime memory, and returns to Screen 1 (#screen-setup) | `executeEmergencyReset()` | **AC-10** |

---

## 2. Numbered Acceptance Criteria

- **`AC-1` (Settings Access & Toggles)**: Tapping Settings gear icon opens `#sheet-settings`. Toggling Sound or Vibration updates `window.currentState.settings` and persists synchronously to `localStorage`.
- **`AC-2` (Tap Lock Activation & Release)**: Activating Tap Lock displays `#overlay-tap-lock`. Tapping does not decrement counters. Pressing and holding the unlock button for 1.0 second dismisses the lock shield.
- **`AC-3` (PIN Authorization Gate)**: If Lead PIN is configured, attempting Restock, Adjust, or Reset prompts for the 4-digit PIN. Incorrect PIN shows an error; correct PIN unlocks the action. If no PIN is configured, action proceeds immediately.
- **`AC-4` (Restock Portion Math)**: Restocking 20 portions to Participants increases `left` by 20 and `restocked` by 20. Total capacity $T$ is updated to $\text{initial} + \text{restocked}$, adjusting LOW and CRITICAL threshold ceilings.
- **`AC-5` (Adjust Count Auditing)**: If Participants left is 15 and volunteer adjusts to 10, `cat.left` becomes 10, `cat.adjusted` changes by -5, and sequence number increments.
- **`AC-6` (2-Second Hold Reset)**: Releasing before 2.0 seconds cancels the reset. Holding for 2.0 seconds prompts for PIN (if set) and triggers auto-snapshot and reset.
- **`AC-7` (Zero-Loss Auto-Snapshot)**: Prior to clearing state, current event state, tallies, and undo log are archived into IndexedDB `snapshots` object store with timestamp key.

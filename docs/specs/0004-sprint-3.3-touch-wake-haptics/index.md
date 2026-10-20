# Technical Specification: Sprint 3.3 — Touch Engine, Wake Lock, Haptics & Audio

- **Feature Name**: Touch Engine, Wake Lock, Multi-Sensory Feedback & Multi-Tab Defense
- **Status**: Accepted
- **Author**: Antigravity Principal Architect
- **Date**: 2026-10-19
- **Target Milestone**: Sprint 3.3 (Screen Wake Lock, Web Audio Synth, Web Haptics, 12px Drag Cancel, 200ms Debounce, Multi-Tab Lock)

---

## 1. 100% Requirement Ingestion Matrix (Anti-Lossy Traceability)

| Detail # | User / Context Specification | Implementation Target | Acceptance Criterion |
|---|---|---|---|
| **D-1** | Decoupled pointer engine: visual scale 0.97 on `pointerdown`, count decrement on `pointerup` | `attachCounterTouch()` | **AC-1** |
| **D-2** | Accidental drag rejection: pointer motion exceeding 12px cancels decrement | `Math.hypot(dx, dy) > 12` cancel guard | **AC-2** |
| **D-3** | Rapid tap debounce: 200ms lock per counter prevents double-counting on greasy screens | `lastTapTime` 200ms check | **AC-3** |
| **D-4** | Screen Wake Lock API: acquires lock when serving dashboard becomes active | `requestWakeLock()` | **AC-4** |
| **D-5** | Wake Lock re-acquisition: re-requests lock on `visibilitychange` when document returns to visible | `visibilitychange` event listener | **AC-5** |
| **D-6** | Web Audio API tone synthesizer: zero-CDN native oscillator beeps (880Hz / 440Hz) | `playWarningTone(type)` | **AC-6** |
| **D-7** | Web Haptics API: multi-tier vibrations (30ms tap, 100ms low, [100,50,100] critical, 400ms finished) | `triggerHaptic(type)` | **AC-7** |
| **D-8** | Audio and haptic settings toggles: sound default OFF, vibration default ON | `state.settings.sound`, `state.settings.vibrate` | **AC-8** |
| **D-9** | Storage persistence request: invokes `navigator.storage.persist()` on boot | `ensurePersistentStorage()` | **AC-9** |
| **D-10** | Multi-Tab BroadcastChannel: displays `#overlay-multi-tab` when another tab opens | `BroadcastChannel('tiag_kitchen_channel')` | **AC-10** |

---

## 2. Numbered Acceptance Criteria

- **`AC-1` (Tactile Press Feedback)**: Pressing down on any counter button scales it to 0.975 within 1 frame (sub-50ms). Releasing smoothly restores scale.
- **`AC-2` (12px Drag Cancel)**: Moving the pointer more than 12 pixels while pressed cancels the press and prevents any portion decrement on release.
- **`AC-3` (200ms Button Debounce)**: Taps arriving within 200ms of a prior tap on the same counter are strictly discarded to eliminate phantom bounces.
- **`AC-4` (Screen Wake Lock)**: Screen Wake Lock is requested when entering `#screen-serving` and released when leaving or closing.
- **`AC-5` (Wake Lock Visibility Resilience)**: Switching browser tabs and returning re-acquires the Screen Wake Lock if the serving screen remains active.
- **`AC-6` (Zero-File Audio Synth)**: `playWarningTone('low')` generates an 880Hz tone with exponential decay; `playWarningTone('critical')` generates a dual-frequency 440Hz -> 880Hz alert tone without network requests.
- **`AC-7` (Multi-Tier Haptics)**: Taps trigger 30ms vibration; reaching CRITICAL triggers `[100, 50, 100]`; reaching FINISHED (0) triggers 400ms heavy vibration.
- **`AC-8` (Configurable Feedback Toggles)**: If `state.settings.sound` is `false`, audio synthesis is muted. If `state.settings.vibrate` is `false`, haptics are suppressed.
- **`AC-9` (Persistent Storage Quota)**: `navigator.storage.persist()` is invoked safely without throwing errors on browsers with or without support.
- **`AC-10` (Multi-Tab Protection)**: Opening a second browser tab triggers `#overlay-multi-tab` on the secondary tab, preventing concurrent database writes and split-brain tallies.

# UI Rules & Interaction Contracts: Tiag Kitchen

## 1. Touch Engine & Gesture Invariants

Operating on a greasy, steamy kitchen line requires deterministic pointer processing. Standard browser click events introduce latency and false positives. Tiag Kitchen enforces the following interaction contracts:

### 1.1 Pointer Release Execution
- Counters trigger exclusively on `pointerup`.
- **Drag Rejection**: If pointer travel exceeds **12px** between `pointerdown` and `pointerup`, the interaction is classified as a scroll or swipe gesture and the count decrement is canceled.
- **Multi-Touch Lockout**: If a finger is already down on a counter surface, subsequent touch contacts are discarded.

### 1.2 The 200ms Debounce Shield
- Upon a valid decrement, the target button enters a locked state for **200ms**.
- Prevents mechanical bounce or rapid jitter taps from double-counting portions.
- Visual feedback (number bump animation + surface flash) executes in **under 50ms**.

### 1.3 Viewport Touch Discipline
The root dashboard container enforces:
```css
body, #app-root {
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  overscroll-behavior: none;
  -webkit-touch-callout: none;
}
```
- Disables double-tap to zoom.
- Disables long-press context menus and image callouts.
- Disables pull-to-refresh to prevent accidental page reloads mid-service.

---

## 2. Multi-Sensory State Rules

Never rely exclusively on color to convey portion status. Color blindness, harsh overhead glare, or tinted kitchen sunglasses can distort hues. Every state mandates a triple-signal verification:

| State | 1. Surface & Edge | 2. Text Label | 3. Icon Graphic | 4. Tactile & Audible |
|---|---|---|---|---|
| **OK** | Light Mint (`#DFF5E8`) with Solid Green Edge (`#1FA45B`) | Bold `"OK"` | Circle Checkmark (SVG) | 30ms single haptic pulse |
| **LOW** | Warm Butter (`#FFE9A8`) with 3px Diagonal Stripe Border | Bold `"LOW"` | Warning Triangle (SVG) | 880Hz audio chirp (if sound enabled) |
| **CRITICAL** | Solid Crimson (`#B00101`) with Slow Pulsing Border | Bold `"CRITICAL"` | Exclamation Hexagon (SVG) | Dual haptic buzz + dual audio chime |
| **FINISHED** | Ink Black (`#0A0A0A`) with Locked Muted Border | Bold `"FINISHED"` | Padlock Icon (SVG) | 400ms sustained long vibration |

---

## 3. The Anti-Pill / Anti-Badge Law

1. **Ban on Emoji Chips & Decorative Pills**:
   - Arbitrary marketing pills (`[✨ EVENT COUNTER]`, `[🚀 PORTION TRACKER]`) are strictly forbidden.
   - Headers and section dividers must rely purely on clean typographic hierarchy.
2. **Exemption for Functional Brand Buttons**:
   - Primary action buttons on Setup (`START SERVING`), Summary (`START NEW EVENT`), and Bottom Sheets (`CONFIRM`) maintain fully rounded pill geometry (`border-radius: var(--radius-pill)`) as specified in the TIAG-2026 brand identity.

---

## 4. Copywriting & Plain-English Contracts

All UI text must pass the **12-Year-Old Volunteer / Busy Lead Litmus Test**.

| Banned Plumbing Jargon | Approved Human Copy |
|---|---|
| `"Rehydrating state from IndexedDB..."` | `"Restoring session..."` |
| `"Mutation dispatched"` | Count updates immediately with no toast clutter |
| `"Service Worker active and precached"` | `"Ready offline"` |
| `"Execute reset transaction"` | `"Hold to reset"` |
| `"Increment category pool"` | `"Add food"` |
| `"Override current balance"` | `"Fix a count"` |
| `"Authentication failure"` | `"Incorrect PIN"` |
| `"Session terminated"` | `"Service Complete"` |

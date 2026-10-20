# Architectural Rationale: Sprint 3.3 — Touch Engine, Wake Lock, Haptics & Audio

## 1. Ergonomic Context & Failure Modes in Event Kitchens

Event kitchens are extreme operating environments:
1. **Steam, Heat, and Moisture**: Servers operate with wet hands or food-handling gloves. Capillarity causes false drags and thumb bounces that register as double-decrements. The decoupled pointer engine with a 12px drag cancellation threshold and 200ms lock ensures that only intentional releases count.
2. **Device Auto-Lock (Sleep Mode)**: An iPad or Android phone on the counter will sleep after 30 to 60 seconds of inactivity between attendee waves. Tapping a black screen to wake it, entering a passcode, and waiting for the browser to reconnect disrupts the service queue. The Screen Wake Lock API keeps the display active continuously during active service, while automatically re-requesting the lock when the server brings the tab back from background.
3. **Ambient Kitchen Noise**: With exhaust hoods, industrial dishwashers, and hall chatter, subtle visual indicators can be missed. Tactile haptics (`navigator.vibrate`) deliver physical confirmation straight to the volunteer's hand, while synthesized Web Audio beeps (if enabled) warn when stock reaches critical levels.

## 2. Zero-CDN, Zero-Audio-Asset Strategy

Instead of loading MP3 or WAV audio assets over the network (which risk failing offline, adding bloat, or triggering CORS/CSP issues), we use the browser's native `AudioContext` and `OscillatorNode`. This requires:
- **Zero KB of binary audio files**.
- **Instant playback latency (<10ms)** with zero decoding delay.
- **Parametric sound synthesis**: frequencies (880Hz, 440Hz), duration, and decay ramps are generated purely via mathematical formulas in code.

## 3. Split-Brain Defense via Multi-Tab BroadcastChannel

If two volunteers open the application URL on the same tablet or device simultaneously in different browser tabs:
- Both tabs would read the same `localStorage` key.
- Concurrent writes would clobber sequence numbers (`seq`) and corrupt the 30-step undo history.
- Using a `BroadcastChannel` with a unique session-scoped `tab_id`, secondary tabs immediately detect the presence of the primary serving tab, show the `#overlay-multi-tab` barrier, and block further input until the duplicate tab is closed.

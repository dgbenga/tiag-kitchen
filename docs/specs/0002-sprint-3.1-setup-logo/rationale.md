# Architectural Decision Record: Sprint 3.1 — Setup Screen & Logo Pipeline

- **Spec Reference**: `docs/specs/0002-sprint-3.1-setup-logo/index.md`
- **Status**: Accepted
- **Decider**: Principal Architect & Engineering Team
- **Date**: 2026-10-19

---

## 1. Context & Architectural Rationale

### 1.1 Why Process the Logo in an Offscreen Canvas?
- Phone camera photos taken by church volunteers often measure 12–48 megapixels and weigh 4MB–15MB.
- Storing high-resolution camera photos directly in browser storage would quickly hit the quota limit, crash iOS Safari WebKit memory, or trigger severe rendering lag.
- Resizing on an offscreen `<canvas>` with a 512px max dimension constraint compresses the logo to ~40KB–120KB, preserving visual sharpness while consuming negligible storage.

### 1.2 Why Store the Logo in IndexedDB Instead of LocalStorage?
- `localStorage` has a strict synchronous 5MB cap per origin in mobile browsers.
- Serializing a 200KB base64 image into `localStorage` along with state and audit history risks exceeding the quota.
- Moving image blobs to IndexedDB keeps `localStorage` lean (<10KB of pure numerical state data) for zero-latency synchronous dual-writes.

### 1.3 Why Salted SHA-256 for Lead PIN?
- The Lead PIN is an accidental-wipe protection speed bump, not an enterprise banking credential.
- However, storing plaintext PINs in `localStorage` leaves it visible to anyone inspecting dev tools or local storage exports.
- A local per-device salt combined with Web Crypto SHA-256 (`crypto.subtle.digest('SHA-256', ...)`) hashes the PIN safely before saving.

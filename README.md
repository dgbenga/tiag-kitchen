# Tiag Kitchen 🍲

> **Rugged, Offline-First Food Service Portion Tracker for Live Event Kitchens**

Tiag Kitchen is a high-reliability, zero-server mobile web application (PWA) designed to track and count down food portion stock in high-stress, offline environments. Built specifically for church conference dining halls, camp meetings, and live event kitchens where cellular reception drops and queue pressure is high.

---

## ⚡ Key Architecture & Features

- **100% Offline Precached Shell**: Precached Service Worker architecture (`sw.js` v2) with zero remote CDNs. Operates seamlessly in aeroplane mode.
- **Synchronous Dual-Persistence**: Every portion decrement is saved synchronously to `localStorage` and asynchronously mirrored to `IndexedDB` with monotonic sequence IDs (`seq`) and FNV-1a checksums.
- **Accidental Wipe Protection**: Emergency Reset strictly requires a continuous 2.0-second hold with visual feedback, automated session snapshot archiving, and optional salted SHA-256 Lead PIN verification.
- **Hardware Primed**:
  - **Screen Wake Lock**: Prevents phone screen from dimming or locking mid-service.
  - **Parametric Web Audio**: Synthesizes warning alert beeps natively via Web Audio API without audio files or CDN latency.
  - **Tactile Haptic Feedback**: Multi-tier vibration patterns for OK, Warning, Critical, and Finished events.
- **Zero-Ghost Touch Engine**: 200ms per-button debounce and 12px Euclidean drag cancellation to prevent accidental double-counting from wet or gloved hands.
- **30-Step Named Undo**: Reverse-chronological LIFO undo stack that restores prior counts accurately.
- **End-of-Service Reconciliation**: Instant RFC-4180 CSV export and formatted clipboard summary copy.

---

## 🚀 Quick Start

### Running Locally

```bash
# Clone the repository
git clone https://github.com/dgbenga/tiag-kitchen.git
cd tiag-kitchen

# Start the offline dev server
npm run dev
# Server runs on http://localhost:8080 (or http://localhost:8081)
```

### Running Test Suites

```bash
# Execute complete unit test suite and Phase 4 quality gate audits
npm test
```

---

## 🌐 Free Static Hosting Deployment (GitHub Pages)

Because Tiag Kitchen has **zero server dependencies** and **zero build step requirements**, it can be hosted directly on GitHub Pages:

1. In your GitHub repository: Go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**: Select **Deploy from a branch**.
3. Choose branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. In under 60 seconds, your live kitchen PWA will be live at:
   `https://dgbenga.github.io/tiag-kitchen/`

---

## 🛡️ License

MIT License. Designed and engineered for live kitchen resilience.

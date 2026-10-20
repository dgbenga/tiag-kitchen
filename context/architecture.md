# System Architecture: Tiag Kitchen

## 1. High-Level System Architecture

Tiag Kitchen is engineered as a zero-dependency, self-contained, offline-first Progressive Web Application (PWA). It runs entirely on the client's browser runtime with zero reliance on remote servers, external APIs, or cloud infrastructure during service.

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER RUNTIME                             |
|                                                                                       |
|  +--------------------+     +------------------------------------------------------+  |
|  |   UI Presentation  |     |                   STATE CONTROLLER                   |  |
|  |                    |     |                                                      |  |
|  | - Setup View       |<--->| - Portion Math Engine (OK, LOW, CRITICAL, FINISHED)  |  |
|  | - Serving Dashboard|     | - 30-Action Named Undo Stack                         |  |
|  | - Bottom Sheets    |     | - Lead PIN Guard (SHA-256)                           |  |
|  | - End Summary View |     | - 20,000 Event Audit Tap Log                         |  |
|  +--------------------+     +--------------------------+---------------------------+  |
|            |                                           |                              |
|            v                                           v                              |
|  +--------------------+                     +----------------------+                  |
|  |   HARDWARE & APIS  |                     | DUAL-WRITE ENGINE    |                  |
|  |                    |                     |                      |                  |
|  | - Screen Wake Lock |                     | 1. Synchronous       |                  |
|  | - Web Audio Synth  |                     |    localStorage      |                  |
|  | - Navigator Haptics|                     | 2. Asynchronous      |                  |
|  | - Multi-Tab Lock   |                     |    IndexedDB Mirror  |                  |
|  +--------------------+                     +----------+-----------+                  |
|                                                        |                              |
+--------------------------------------------------------|------------------------------+
                                                         v
                                              +----------------------+
                                              | SERVICE WORKER CACHE |
                                              |                      |
                                              | - Precache App Shell |
                                              | - Versioned Cache    |
                                              | - Local Fonts & SVG  |
                                              +----------------------+
```

---

## 2. Data Model & Storage Specifications

### 2.1 State Schema (`v1`)

The state schema is strictly versioned and validated against a CRC32 or SHA-256 checksum on load:

```typescript
interface AppState {
  schema: 1;
  seq: number;                 // Monotonically increasing sequence number
  checksum: string;            // Integrity hash of core counts and event info
  event: {
    name: string;              // e.g. "TIAG-2026 Camp Meeting"
    station: string;           // e.g. "Station 1 - Pavilion North"
    date: string;              // ISO string representation
  };
  pinHash: string | null;      // Salted SHA-256 hash of 4-digit lead PIN
  categories: {
    participants: CategoryCount;
    workers: CategoryCount;
    pastors: CategoryCount;
  };
  settings: {
    sound: boolean;            // Sound beep on LOW/CRITICAL (default: false)
    vibrate: boolean;          // Haptics on decrement (default: true)
    tapLock: boolean;          // Dimmed screen with hold-to-unlock (default: false)
  };
  activeScreen: 'setup' | 'serving' | 'summary';
  startedAt: string | null;    // ISO timestamp of service start
  endedAt: string | null;      // ISO timestamp of service end
}

interface CategoryCount {
  label: string;               // Display name ("Participants", "Workers", "Pastors")
  initial: number;             // Starting portion count (0 - 99,999)
  restocked: number;           // Cumulative portions added mid-service
  adjusted: number;            // Cumulative net adjustments
  served: number;              // Cumulative portions distributed
  left: number;                // Current remaining portions (T - served)
}
```

### 2.2 Audit Tap Log (`TapLogEntry`)

Every mutation (serve, serve multiple, restock, adjust) produces an immutable audit record:

```typescript
interface TapLogEntry {
  id: string;                  // Unique UUID or monotonic string
  t: number;                   // Unix timestamp (ms)
  cat: 'participants' | 'workers' | 'pastors';
  type: 'serve' | 'multi' | 'restock' | 'adjust';
  delta: number;               // Negative for serve (-1, -4), positive for restock (+50)
  resultingLeft: number;       // Remaining portions after action
}
```
*Storage Constraint*: Audit log is capped at 20,000 entries, stored in IndexedDB.

### 2.3 Undo Stack

- Keeps the last **30 user actions** across all three categories in memory and mirrored to storage.
- Each undo entry stores inverse deltas and human-readable action descriptors (e.g. `Undo: Participants -1`, `Undo: Workers -4`).
- Executing an undo reverses the action and records a compensatory entry in the audit log.

### 2.4 Session Snapshot Schema

Before any emergency reset or new event initialization, a complete JSON snapshot is serialized to `tiag_kitchen_snapshot_last` in `localStorage` and IndexedDB:
- Allows one-click **Restore Previous Session** from the Settings sheet if a reset was triggered by mistake.

---

## 3. Dual-Persistence & Integrity Engine

Mobile browsers (especially iOS Safari and low-memory Android devices) may purge `localStorage` or terminate inactive tabs. Tiag Kitchen employs a dual-write persistence strategy:

1. **Synchronous Immediate Write (`localStorage`)**:
   - `localStorage.setItem('tiag_kitchen_state', JSON.stringify(state))` executes synchronously on the exact frame of the tap.
   - Guaranteed completion before the next microtask.
2. **Asynchronous Binary Write (`IndexedDB`)**:
   - State and audit logs are immediately mirrored to IndexedDB (`tiag_kitchen_db`) via asynchronous transactional writes.
   - Logo image blobs (resized to 512px, <=300KB) are stored exclusively in IndexedDB to prevent exceeding `localStorage` 5MB quota.
3. **Sequence Monotonicity (`seq`)**:
   - Every write increments `state.seq += 1`.
   - On application startup, the loader reads both `localStorage` and `IndexedDB`. The copy with the higher `seq` wins.
   - If a checksum mismatch occurs (indicating mid-write corruption), the state falls back to the last valid snapshot.
4. **Persistent Storage Request**:
   - Calls `navigator.storage.persist()` on service start to instruct the browser never to evict cached data or IndexedDB records.

---

## 4. Hardware Integration & Web APIs

### 4.1 Screen Wake Lock API
- **Purpose**: Prevents the phone display from dimming or sleeping while servers are actively plating food.
- **Implementation**:
  ```javascript
  let wakeLock = null;
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.warn('Wake Lock request failed:', err);
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.activeScreen === 'serving') {
      requestWakeLock();
    }
  });
  ```
- **Fallback**: If unsupported, a non-intrusive one-line dismissible prompt guides the server to set auto-lock to "Never" in system settings.

### 4.2 Web Audio API Tone Synthesizer
- **Purpose**: Audible status warning beeps without external MP3 or audio asset dependencies.
- **Implementation**:
  - Uses native `AudioContext` and `OscillatorNode`.
  - Frequency: 880Hz (A5) short chirp for LOW warnings; dual 440Hz/880Hz urgent chime for CRITICAL.
  - Zero network requests. Fully synthesized client-side.

### 4.3 Web Haptics Engine
- **Purpose**: Tactile physical confirmation on every valid plate countdown.
- **Implementation**:
  - `navigator.vibrate(30)` for standard plate decrement.
  - `navigator.vibrate([100, 50, 100])` for CRITICAL threshold entry.
  - `navigator.vibrate(400)` for FINISHED (0 stock).
  - iOS Safari Fallback: Instantaneous 50ms border flash animation.

### 4.4 Multi-Tab Collision Prevention
- Employs a `BroadcastChannel('tiag_kitchen_channel')` and window `storage` listeners.
- If a user opens Tiag Kitchen in a second browser tab on the same device, the secondary tab displays an overlay: *"Active service session in another tab. This tab is read-only to prevent count discrepancies."*

---

## 5. Service Worker Lifecycle & Offline Cache Architecture

- **Precache Strategy**: Cache-First (`Cache-Falling-Back-to-Network`).
- **Precaching Manifest**:
  - `index.html` (all styles, scripts, and SVG icons inlined)
  - `sw.js`
  - `manifest.webmanifest`
  - `icon-192.png` and `icon-512.png`
  - Local Poppins WOFF2 fonts (weights 500, 600, 700, 800)
- **Controlled Updates**:
  - The Service Worker strictly suppresses `skipWaiting()` while an active service is underway.
  - If a new version of the app is downloaded in the background, it sits in `waiting` state until the current service ends and the window is reopened. Never reloads the page mid-service.
- **Readiness Verification**:
  - The "Ready offline" badge on Setup only activates after verifying that every asset key is present in `caches.keys()`.

---

## 6. Observability, Resilience & PII Scrubbing

- **Local Error Boundary**: A global `window.onerror` and `window.onunhandledrejection` handler captures exceptions into an in-memory ring buffer (last 50 errors).
- **Strict Zero-PII Policy**: No attendee names, emails, IPs, or location telemetry are collected. The Content Security Policy (CSP) header strictly blocks outbound connections:
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data: blob:; connect-src 'none';">
  ```
- **Local Diagnostics**: The Settings sheet contains a diagnostic export button allowing the kitchen lead to copy error logs and storage state directly for post-mortem troubleshooting.

---

## 7. The Tool Consolidation & Silicon Valley Stack Rationale

### Why Zero-Server Static PWA?
- In high-pressure event kitchen environments, **network connections fail**. Relying on a backend API, database server (PostgreSQL/Supabase), or external auth provider introduces catastrophic single points of failure.
- By consolidating the entire system into a single-file compiled PWA running on vanilla browser standards, we achieve:
  1. **$0/month recurring cost**: Hosted as static files on Cloudflare Pages, GitHub Pages, Netlify, or Vercel.
  2. **Zero Maintenance**: No servers to patch, no database connection pooling to configure, no SSL renewal headaches.
  3. **Instant 0ms Latency**: Taps update local memory synchronously with zero network roundtrip.

---

## 8. Two-Stage Evolution Roadmap

```
+---------------------------------------------------------------------------------------+
| STAGE 1: LAUNCH & EVENT MVP (LOCKED)                                                  |
| - Single-station offline PWA                                                          |
| - Synchronous dual-write (localStorage + IndexedDB)                                   |
| - 100% offline Service Worker precache                                                |
| - Export via offline CSV and text clipboard                                           |
| - Infrastructure Cost: $0.00 / month                                                  |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| STAGE 2: SCALE MIGRATION (FUTURE MULTI-STATION SYNCHRONIZATION)                       |
| - Local Peer-to-Peer Wi-Fi mesh synchronization (WebRTC / Local mDNS broadcast)      |
| - Central Kitchen Dashboard aggregating counts from Station A, Station B, Station C   |
| - Optional lightweight local Raspberry Pi coordinator running in dining hall          |
| - Zero reliance on external cellular internet                                         |
+---------------------------------------------------------------------------------------+
```

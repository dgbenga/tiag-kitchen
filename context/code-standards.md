# Code Standards & Engineering Discipline: Tiag Kitchen

## 1. Stack-Agnostic Engineering Floor

### 1.1 Engineering Mindset
- **Predictability Over Cleverness**: Code must be readable, explicit, and easy to audit during a live kitchen crisis. Avoid esoteric abstractions, complex reactive graph libraries, or unverified polyfills.
- **Fail-Safe Defaults**: If any component, API, or storage write encounters an unexpected condition, the application must maintain the current count safely in memory and degrade gracefully—never crash to a blank screen.
- **Comment Discipline**: Comments must explain *why* an architectural or ergonomic decision was made (e.g. `// 200ms debounce prevents double counting when thumb bounces on greasy glass`), never merely restating what the syntax does.

### 1.2 Zero-Trust Input & Security Standards
- **Numerical Sanitization**: All count inputs must be rigorously sanitized:
  ```typescript
  function sanitizeCount(val: string): number {
    const cleaned = val.replace(/\D/g, '');
    const num = parseInt(cleaned, 10);
    if (isNaN(num) || num < 0) return 0;
    return Math.min(num, 99999);
  }
  ```
- **PIN Security**: The lead PIN is strictly four numeric digits (`0000`–`9999`), stored locally as a salted SHA-256 hash using the Web Crypto API (`crypto.subtle.digest`).
- **Content Security Policy (CSP)**: Outbound network calls are completely blocked. External script injection is impossible.

### 1.3 Accessibility & Quality Floor
- **7:1 Contrast Floor**: All numbers displayed on counter buttons must satisfy a minimum **7:1 contrast ratio** against their background surface, checked in all four status states.
- **Reduced Motion Support**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
  Disables the pulsing border in the CRITICAL state and number bump animations.
- **Semantic DOM Structure**: Every interactive element is a native `<button>` element with appropriate `aria-label`, `aria-live="polite"` for counter updates, and full keyboard operability (`Space` / `Enter` triggering decrements).

---

## 2. Stack-Specific Guidelines (Offline PWA & TypeScript)

### 2.1 State Mutation & Integrity Verification
- State mutations must produce a fresh state object and increment `seq`:
  ```typescript
  function updateCount(cat: CategoryKey, delta: number): void {
    const current = state.categories[cat];
    const newLeft = Math.max(0, current.left + delta);
    const newServed = current.served + (delta < 0 ? Math.abs(delta) : 0);
    
    state.seq += 1;
    state.categories[cat] = {
      ...current,
      left: newLeft,
      served: newServed
    };
    state.checksum = calculateChecksum(state);
    persistState(state);
  }
  ```

### 2.2 Dual-Write Persistence Protocol
1. **Step 1 (Sync)**: Serialize and write to `localStorage.setItem('tiag_kitchen_state', json)`.
2. **Step 2 (Async Mirror)**: Push copy to IndexedDB transaction.
3. **Step 3 (Audit Append)**: Write `TapLogEntry` to IndexedDB object store.

### 2.3 Logo Processing Pipeline
- Image files selected via `<input type="file" accept="image/png, image/jpeg, image/webp">` are processed in memory using an offscreen `<canvas>`:
  - Scaled down so that the longest dimension does not exceed **512px**.
  - Encoded as WebP/JPEG with quality 0.82.
  - Inspected for binary size (must be <= **300KB**).
  - Stored directly as a Blob or Base64 string in IndexedDB.
  - Rejects PDFs, HEIC, or SVGs with clean user-facing error copy.

### 2.4 Service Worker Precaching Rules
- The Service Worker cache name is versioned (e.g. `tiag-kitchen-v1.0.0`).
- Core files are precached during `install`:
  ```javascript
  const CACHE_NAME = 'tiag-kitchen-v1';
  const ASSETS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './icon-192.png',
    './icon-512.png',
    './fonts/poppins-500.woff2',
    './fonts/poppins-600.woff2',
    './fonts/poppins-700.woff2',
    './fonts/poppins-800.woff2'
  ];
  ```
- Any fetch request for an in-scope asset resolves from cache first, ensuring zero network latency.

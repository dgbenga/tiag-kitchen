# Technical Specification: Sprint 3.1 — Setup Screen & Logo Pipeline

- **Feature Name**: Setup Screen & Logo Processing Pipeline
- **Status**: Accepted
- **Author**: Antigravity Principal Architect
- **Date**: 2026-10-19
- **Target Milestone**: Sprint 3.1 (Form Validation, Salted PIN, Canvas Resizer, Initial State Seeding)

---

## 1. 100% Requirement Ingestion Matrix (Anti-Lossy Traceability)

| Detail # | User / Context Specification | Implementation Target | Acceptance Criterion |
|---|---|---|---|
| **D-1** | Circular logo slot (96px on setup, 40px in header) with safe-circle white ring | `setup-logo-preview`, `header-logo-preview` | **AC-1** |
| **D-2** | Image file input accepting PNG, JPG, WebP only; rejects PDF/unsupported formats with clear error copy | `input-logo-file` & validation logic | **AC-2** |
| **D-3** | Browser canvas resizing: resize to max 512px on longest dimension with 300KB post-compression cap | `processLogoFile(file)` | **AC-3** |
| **D-4** | Logo stored in IndexedDB (`media_blobs` store), never in `localStorage` | `saveLogoToIDB(blob)` | **AC-4** |
| **D-5** | Three portion count inputs (Participants, Workers, Pastors) restricted to whole numbers 0–99,999 | `count-participants`, `count-workers`, `count-pastors` | **AC-5** |
| **D-6** | Non-digit stripping on paste/input and inline plain-words validation error display | `sanitizeNumericInput()` | **AC-6** |
| **D-7** | "START SERVING" disabled until valid; requires at least one count > 0 | `btn-start-serving` state binding | **AC-7** |
| **D-8** | Optional 4-digit lead PIN stored as salted SHA-256 hash | `hashPin(pin, salt)` via Web Crypto API | **AC-8** |
| **D-9** | "START SERVING" tap initializes state, seeds dual storage (`localStorage` + `IndexedDB`), primes Web Audio, requests Wake Lock, and switches view to `#screen-serving` | `startServingSession()` | **AC-9** |
| **D-10** | Event Name and Station Name inputs (optional, sanitized, max lengths 60 and 40) | `input-event-name`, `input-station-name` | **AC-10** |

---

## 2. Non-Destructive Blast-Radius Contract (Anti-Regression Lock)

- **Target Blast Radius**:
  - `index.html` (Surgical enhancement: Wire validation handlers, IndexedDB logo helper, canvas resizer, state initializer)
- **Protected Working Surface ("DO NOT TOUCH")**:
  - `sw.js` (Precache engine remains untouched)
  - `manifest.webmanifest` (PWA metadata untouched)
  - `icon-*.png` (Icons untouched)
  - CSS styling tokens in `:root` (Tokens unchanged)
- **Surgical Edit Guarantee**: Inlined JavaScript runtime in `index.html` is upgraded cleanly without breaking existing DOM containers or CSS variables.

---

## 3. Numbered Acceptance Criteria

- **`AC-1` (Logo Display)**: When no logo is uploaded, a neutral seal placeholder SVG is visible. When uploaded, the image renders centered inside the 96px circle with padding.
- **`AC-2` (File Rejection)**: Selecting a non-image file (e.g. PDF, text) displays: *"Please select a valid image (PNG, JPG, or WebP)."*
- **`AC-3` (Canvas Resize)**: Selecting a 6MB photograph successfully scales down to $\le 512\text{px}$ and compresses under 300KB without crashing.
- **`AC-4` (Logo Storage)**: The resized logo data URL/Blob is persisted to IndexedDB store `media_blobs`. On reload, the logo is automatically restored.
- **`AC-5` (Numeric Input Enforcement)**: Typing letters, decimals, or negative numbers is physically blocked or stripped immediately.
- **`AC-6` (Form Validation)**: If all three categories are 0 or empty, an inline notice appears: *"At least one category must have starting portions."* and "START SERVING" remains disabled.
- **`AC-7` (State Initialization)**: Tapping "START SERVING" creates the initial `state` with `schema: 1`, `seq: 1`, `checksum`, and seeded categories.
- **`AC-8` (PIN Security)**: Entering a 4-digit PIN generates a salted SHA-256 hash. The plaintext PIN is never stored in `localStorage` or memory.
- **`AC-9` (Audio Priming & Transition)**: Tapping "START SERVING" calls `getAudioContext().resume()`, requests Screen Wake Lock, and activates `#screen-serving`.
- **`AC-10` (Header Reflection)**: The serving screen header immediately displays the event name and station name entered during setup.

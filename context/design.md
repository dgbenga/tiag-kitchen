# Design System & Visual Direction: Tiag Kitchen

## 1. Approved Brand System & Aesthetic Philosophy

Tiag Kitchen borrows the visual language and energy of the **TIAG-2026** conference organizer website, infusing a sense of institutional pride and warmth while adhering to strict industrial ergonomics. The design balances bold church-event vibrancy with high-contrast legibility tailored for harsh kitchen environments (steam, grease, bright sunlight, and dim lighting).

---

## 2. Color Palette & Semantic Tokens

### 2.1 Brand Identity Palette (Sampled from TIAG-2026 Website)

| Token Name | Hex Code | HSL Value | Intent & Usage |
|---|---|---|---|
| `brand-deep-crimson` | `#A20000` | `0, 100%, 32%` | Setup hero header, brand typography, structural accents. |
| `brand-signal-red` | `#FF2A2A` | `0, 100%, 58%` | Primary action buttons on Setup & Summary only. **BANNED FROM SERVING SCREEN**. |
| `brand-flame-orange` | `#FD3F27` | `7, 98%, 57%` | Brand gradient start point, focus rings, high-visibility badges. |
| `brand-rose-red` | `#F52545` | `351, 91%, 55%` | Gradient midpoint, active button states. |
| `brand-royal-purple` | `#7F499A` | `280, 36%, 45%` | Gradient terminus, Undo button background, secondary links. |
| `surface-ink-black` | `#0A0A0A` | `0, 0%, 4%` | Serving header background, Finished state surface, text primary. |
| `surface-mist` | `#F4F7FA` | `210, 25%, 97%` | Application viewport background in light-surface views. |
| `surface-paper` | `#F9F9FE` | `240, 50%, 99%` | Elevated card surfaces, bottom sheets, dialogs. |

**The Signature Brand Gradient**:
```css
--brand-gradient: linear-gradient(135deg, #FA2B2E 0%, #F52545 45%, #7F499A 100%);
```

---

### 2.2 Operational Serving Status Palette (The Life-Safety Palette)

The status palette is mathematically separate from the brand identity palette.

| State | Remaining Condition | Surface Color | Border / Accent Edge | Text Color | Icon Indicator |
|---|---|---|---|---|---|
| **OK** | > 25% of total pool | `#DFF5E8` (Light Mint) | `#1FA45B` (Go Green, 3px solid) | `#0E4A28` (Dark Forest Green) | Circle Checkmark (SVG) |
| **LOW** | <= 25% of total pool | `#FFE9A8` (Warm Butter) | `#F5A524` (Amber, 3px diagonal stripe) | `#4E3304` (Dark Amber) | Warning Triangle (SVG) |
| **CRITICAL** | <= 10% of total pool | `#B00101` (Signal Crimson) | `#FF4D4D` (Pulsing 4px glow) | `#FFFFFF` (Pure White) | Exclamation Hexagon (SVG) |
| **FINISHED** | Exactly 0 remaining | `#0A0A0A` (Ink Black) | `#262626` (Muted Dark Border) | `#8C8C8C` (Muted Grey) | Padlock / Finished (SVG) |

---

### 2.3 The Serving Status Color Quarantine Invariant

> [!CRITICAL]
> **THE QUARANTINE LAW**: On the active Serving Dashboard, the color RED is strictly reserved for portion emergencies (`CRITICAL` stock, <= 10%).
> - Never use `#FF2A2A`, `#A20000`, or the brand gradient on counter surfaces, borders, or text while serving.
> - The serving header bar is set to near-black (`#0A0A0A`) with only a razor-thin 3px gradient border at its bottom boundary.
> - This guarantees that when a server's peripheral vision detects red, it indicates a critical food shortage, eliminating ambiguity and queue panic.

---

## 3. Typography & Numerical Hierarchy

### 3.1 Typeface Selection: Poppins (Locally Bundled)

- **Primary Typeface**: `Poppins` (Google Fonts, latin subset bundled locally as `.woff2`).
- **System Fallback Stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- **Zero Remote Font Dependencies**: The app must render identically without an active internet connection.

### 3.2 Type Scale & Weight Distribution

| Element | Size (px / rem) | Weight | Letter Spacing | Contrast Requirement |
|---|---|---|---|---|
| **Primary Participant Counter Numeral** | `72px–110px` (dynamic clamp) | **800 (ExtraBold)** | `-0.03em` | **>= 7:1** against surface |
| **Secondary Counter Numerals (Workers/Pastors)** | `36px–48px` | **800 (ExtraBold)** | `-0.02em` | **>= 7:1** against surface |
| **Counter Status Labels ("OK", "CRITICAL")** | `14px / 0.875rem` | **700 (Bold)** | `+0.05em (caps)` | >= 4.5:1 |
| **Header App Title ("Tiag Kitchen")** | `18px / 1.125rem` | **700 (Bold)** | `-0.01em` | Pure White (`#FFFFFF`) |
| **Section & Field Labels** | `16px / 1.0rem` | **600 (SemiBold)** | `0` | >= 4.5:1 |
| **Subtitles & Audit Micro-Copy** | `13px / 0.8125rem` | **500 (Medium)** | `0` | >= 4.5:1 |

---

## 4. Spatial Geometry & Viewport Architecture

### 4.1 Portrait Serving Layout (Standard 390x844 Viewport)

```
+-------------------------------------------------------------+
| [Logo 40px] Tiag Kitchen (TIAG-2026)      [OK] [Gear]       |  ~8% Height (Header)
|================== 3px Gradient Line ========================|
|                                                             |
| +-------------------------+     +-------------------------+ |
| | WORKERS                 |     | PASTORS                 | |  ~20% Height
| |           48            |     |           18            | |  (Min 88px Cards)
| | Left         Served: 12 |     | Left          Served: 4 | |
| +-------------------------+     +-------------------------+ |
|                                                             |
| +---------------------------------------------------------+ |
| |                      PARTICIPANTS                       | |
| |                                                         | |  ~60% Height
| |                          412                            | |  (Full-Width Button,
| |                                                         | |   Min 55% Viewport)
| |                          LEFT                           | |
| |                      Served: 188                        | |
| +---------------------------------------------------------+ |
|                                                             |
| +-------------------------------+ +-----------------------+ |  ~12% Height
| | [Undo: Participants -1]       | | [Serve Multiple]      | |  (Min 56px Height,
| +-------------------------------+ +-----------------------+ |   Safe Area Inset)
+-------------------------------------------------------------+
```

### 4.2 Industrial Touch Target Standards

- **Primary Participant Button**: Occupies a minimum of **55% of the viewport height** (target 60%), spanning 100% of usable width. The numerical counter consumes at least **35% of the button's internal height**.
- **Secondary Cards (Workers / Pastors)**: Minimum height of **88px**.
- **Action Buttons (Undo, Serve Multiple)**: Minimum height of **56px**.
- **Utility Touch Targets (Gear, Close, Increment/Decrement)**: Minimum dimension of **48px x 48px**.

---

## 5. Logo Slot Architecture

- **Format Support**: PNG, JPG, WebP.
- **Client-Side Processing**: Resized via HTML5 Canvas to 512px max dimension, capped at 300KB, stored in IndexedDB.
- **Aspect Ratio Safe Enclosure**:
  - The slot is a circle surrounded by a clean 2px white ring (`rgba(255,255,255,0.9)`).
  - Images are rendered with `object-fit: contain` and 12% internal padding to prevent square, crest, or rectangular logos from being clipped by the circle mask.
- **Dimensions**:
  - Setup Screen: `96px x 96px`
  - Serving Header: `40px x 40px`
  - Summary Screen: `72px x 72px`
  - Default: Clean neutral seal placeholder with the text *"YOUR LOGO"*.

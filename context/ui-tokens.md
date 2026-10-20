# UI Tokens & Single-Knob Cascade Contract: Tiag Kitchen

## 1. Single-Knob Global CSS Cascade

All color, typography, radius, and elevation tokens are defined as native CSS variables within `:root`. Modifying a single root variable updates every Atom, Molecule, and Organism app-wide without modifying individual component styles.

```css
:root {
  /* ==========================================================================
     1. Brand Identity Tokens (Sampled from TIAG-2026 Website)
     ========================================================================== */
  --brand-primary: #FF2A2A;             /* Signal Red - Primary CTA on Setup/Summary */
  --brand-primary-hover: #E01E1E;
  --brand-crimson: #A20000;             /* Deep Crimson - Hero backgrounds & title accents */
  --brand-flame: #FD3F27;               /* Flame Orange - Gradient start & focus rings */
  --brand-rose: #F52545;                /* Rose Red - Gradient midpoint */
  --brand-purple: #7F499A;              /* Royal Purple - Gradient end & Undo button */
  --brand-purple-hover: #6D3D86;
  
  --brand-gradient: linear-gradient(135deg, #FA2B2E 0%, #F52545 45%, #7F499A 100%);
  --brand-gradient-hover: linear-gradient(135deg, #E01E1E 0%, #D81B3A 45%, #6D3D86 100%);

  /* ==========================================================================
     2. Surface & Layout Tokens
     ========================================================================== */
  --surface-body: #F4F7FA;              /* Mist - Viewport background */
  --surface-paper: #F9F9FE;             /* Paper - Card backgrounds & bottom sheets */
  --surface-header: #0A0A0A;            /* Ink Black - Serving screen header */
  --surface-border: #E2E8F0;
  
  --text-primary: #0A0A0A;
  --text-secondary: #4A5568;
  --text-muted: #718096;
  --text-inverted: #FFFFFF;

  /* ==========================================================================
     3. Serving Status Tokens (QUARANTINED FROM BRAND PALETTE)
     ========================================================================== */
  /* State: OK (>25% portions left) */
  --status-ok-surface: #DFF5E8;
  --status-ok-border: #1FA45B;
  --status-ok-text: #0E4A28;
  --status-ok-badge: #C3EED5;

  /* State: LOW (<=25% portions left) */
  --status-low-surface: #FFE9A8;
  --status-low-border: #F5A524;
  --status-low-text: #4E3304;
  --status-low-badge: #FDE087;

  /* State: CRITICAL (<=10% portions left) */
  --status-critical-surface: #B00101;
  --status-critical-border: #FF4D4D;
  --status-critical-text: #FFFFFF;
  --status-critical-badge: #780000;

  /* State: FINISHED (0 portions left) */
  --status-finished-surface: #0A0A0A;
  --status-finished-border: #2D3748;
  --status-finished-text: #8C8C8C;
  --status-finished-badge: #1A202C;

  /* ==========================================================================
     4. Typography Tokens
     ========================================================================== */
  --font-sans: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  
  --font-weight-normal: 500;
  --font-weight-medium: 600;
  --font-weight-bold: 700;
  --font-weight-black: 800;

  /* ==========================================================================
     5. Shape & Spatial Metrics
     ========================================================================== */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  --touch-min-utility: 48px;
  --touch-min-secondary: 88px;
  --touch-min-action: 56px;
  --touch-min-primary: 55vh;

  /* ==========================================================================
     6. Elevation & Motion
     ========================================================================== */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Device Safe Area Insets */
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

---

## 2. Token Inheritance & Semantic Mapping

```
:root (Raw CSS Tokens)
  │
  ├──► [ATOM: Button] ───────► background: var(--brand-primary); border-radius: var(--radius-pill);
  │
  ├──► [ATOM: CounterBadge] ──► background: var(--status-ok-badge); color: var(--status-ok-text);
  │
  ├──► [ORGANISM: PrimaryCard] 
  │     ├── OK State ────────► background: var(--status-ok-surface); border: 3px solid var(--status-ok-border);
  │     ├── LOW State ───────► background: var(--status-low-surface); border: 3px dashed var(--status-low-border);
  │     └── CRITICAL State ──► background: var(--status-critical-surface); border: 4px solid var(--status-critical-border);
  │
  └──► [ORGANISM: ServingHeader] 
        └──► background: var(--surface-header); border-bottom: 3px solid; border-image: var(--brand-gradient) 1;
```

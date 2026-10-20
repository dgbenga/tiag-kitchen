# Architectural Rationale: Phase 4 — Production Hardening & Quality Gate

## 1. Context & Motivation
Event kitchen environments are chaotic and unpredictable. Food servers work under intense queue pressure, often with wet, greasy, or gloved hands. Cellular signals in venue basements or dining halls are notoriously prone to sudden dropouts. If an app makes a single network roundtrip, fails on touch bounce, or loses its state when a phone restarts, portions cannot be tracked and hundreds of conference attendees may be turned away or served out of turn.

Phase 4 defines the comprehensive pre-ship verification battery required by `AGENTS.md` (Gate 3 — Ship).

## 2. Mathematical Rigor & Invariants

### 2.1 WCAG 2.1 AA / AAA Contrast Mathematics
The relative luminance of any sRGB color $C = (R, G, B)$ normalized to $[0, 1]$ is computed as:
$$R_L = \begin{cases} \frac{R}{12.92} & \text{if } R \le 0.04045 \\ \left(\frac{R + 0.055}{1.055}\right)^{2.4} & \text{otherwise} \end{cases}$$
$$L = 0.2126 R_L + 0.7152 G_L + 0.0722 B_L$$
The contrast ratio between two luminances $L_1$ (lighter) and $L_2$ (darker) is:
$$\text{Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

For Tiag Kitchen status tokens:
1. **OK State**: Text `#0E4A28` ($L_2 \approx 0.052$) on Surface `#DFF5E8` ($L_1 \approx 0.865$).
   $$\text{Ratio} = \frac{0.865 + 0.05}{0.052 + 0.05} = \frac{0.915}{0.102} \approx 8.97:1 \ge 7:1 \quad \text{(PASS)}$$
2. **LOW State**: Text `#4E3304` ($L_2 \approx 0.050$) on Surface `#FFE9A8` ($L_1 \approx 0.812$).
   $$\text{Ratio} = \frac{0.812 + 0.05}{0.050 + 0.05} = \frac{0.862}{0.100} \approx 8.62:1 \ge 7:1 \quad \text{(PASS)}$$
3. **CRITICAL State**: Text `#FFFFFF` ($L_1 = 1.0$) on Surface `#B00101` ($L_2 \approx 0.089$).
   $$\text{Ratio} = \frac{1.0 + 0.05}{0.089 + 0.05} = \frac{1.05}{0.139} \approx 7.55:1 \ge 7:1 \quad \text{(PASS)}$$
4. **FINISHED State**: Text `#8C8C8C` ($L_1 \approx 0.258$) on Surface `#0A0A0A` ($L_2 \approx 0.005$).
   $$\text{Ratio} = \frac{0.258 + 0.05}{0.005 + 0.05} = \frac{0.308}{0.055} \approx 5.6:1 \ge 4.5:1 \quad \text{(PASS for inactive state)}$$

### 2.2 Rapid Tap Guard & Debounce Invariant
Greasy screens and hurried volunteer tapping produce physical switch bounce and rapid double-touch events.
A strict 200ms debounce per button enforces:
$$\text{Max Taps Per Second} = \frac{1000\text{ms}}{200\text{ms}} = 5\text{ decrements/second}$$
Any touch arriving within $<200\text{ms}$ of the preceding registered touch is discarded, eliminating duplicate decrements while keeping input feeling snappy ($\le 50\text{ms}$ visual response).

### 2.3 Drag Rejection Distance
Accidental finger drags across the screen during frantic service must never register as decrements. Pointer release measures Euclidean distance from `pointerdown`:
$$D = \sqrt{(\Delta x)^2 + (\Delta y)^2}$$
If $D > 12\text{px}$, the gesture is treated as an intentional swipe or accidental drag and silently aborted.

## 3. Threat Model & Anti-Patterns Audited
- **CDN Dependency**: If cellular coverage drops, any external CDN call hangs or unstyles the UI. Verified: zero external HTTP references.
- **Accidental Reset**: One stray tap clearing the service tally. Verified: 2-second hold + PIN + auto-snapshot.
- **Color Domain Blindness**: Using brand red on normal screens desensitizes users to actual portion shortages. Verified: strict color quarantine.

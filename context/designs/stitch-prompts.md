# Google Stitch Visual Prompts: Tiag Kitchen

## 1. Project Visual Overview

- **Product Mission**: Tiag Kitchen is a single-screen, mobile-first offline portion counter for high-volume event catering lines.
- **Core User Persona**: Volunteer kitchen servers operating under intense queue pressure with wet or gloved hands, requiring instant visual recognition from arm's length.
- **Visual Atmosphere**: Bold, warm, authoritative, church-event community energy (TIAG-2026), blended with ultra-clean industrial ergonomics. Thick rounded cards, soft ambient shadows, deep high-contrast surfaces, and generous negative space.
- **Locked Color Tokens**:
  - Background: `#F4F7FA` (Mist)
  - Card Surfaces: `#F9F9FE` (Paper)
  - Serving Header: `#0A0A0A` (Ink Black)
  - Brand Primary CTA: `#FF2A2A` (Signal Red, Setup/Summary only)
  - Brand Secondary / Undo: `#7F499A` (Royal Purple)
  - Status OK Surface / Edge: `#DFF5E8` / `#1FA45B`
  - Status LOW Surface / Edge: `#FFE9A8` / `#F5A524`
  - Status CRITICAL Surface / Edge: `#B00101` / `#FF4D4D`
  - Status FINISHED Surface: `#0A0A0A` / `#2D3748`
- **Spatial Zoning & Density**:
  - Zone 1: Top 8% Header bar (Logo, title, status chip, gear).
  - Zone 2: Upper 20% Secondary row (Workers and Pastors side-by-side cards).
  - Zone 3: Center 60% Hero counter button (Participants massive touch target).
  - Zone 4: Bottom 12% Action bar (Undo and Serve Multiple buttons).

---

## 2. Deterministic Google Stitch Prompt: Screen 1 (Serving Dashboard - OK State)

```text
Flat 2D mobile web application screenshot, iPhone portrait framing, 390x844 resolution, direct front-facing view, NO 3D perspective tilt, NO hand holding device, NO claymockups, clean crisp professional UI design only.

SPATIAL LAYOUT ZONING:
Top Zone (8% height): Sleek near-black navigation bar with a thin 3px crimson-to-purple horizontal gradient line at its bottom edge. Contains a 40px circular white-ringed logo slot on the left, white bold interface title "Tiag Kitchen" with subtle grey text "TIAG-2026", a rounded mint-green status pill with a checkmark icon "ALL OK" and a minimal gear icon on the right.
Upper Zone (20% height): Two equal side-by-side rectangular cards with 20px rounded corners. Left card has label "WORKERS", huge bold numerals "48", small label "LEFT" and "Served: 12", with a tiny mint-green checkmark badge and a subtle "x N" chip. Right card has label "PASTORS", huge bold numerals "18", small label "LEFT" and "Served: 4", with identical mint-green styling. Both cards have soft mint surface (#DFF5E8) and a crisp 3px solid green border (#1FA45B).
Central Zone (60% height): One massive full-width touch button with 24px rounded corners dominating the center of the screen. Soft mint green background (#DFF5E8) with a thick solid green border (#1FA45B). At top: label "PARTICIPANTS" in bold uppercase tracking and a green checkmark badge "OK". In the center: an enormous, ultra-bold, high-contrast dark forest green numeral "412", with the label "LEFT" below it. At bottom: subtle secondary text "Served: 188".
Bottom Zone (12% height): Horizontal action bar with two large 56px tall pill-shaped buttons. Left button is a rich royal purple (#7F499A) with crisp white text "Undo: Participants -1". Right button is a clean white pill with a thin grey border and dark text "Serve multiple". Generous thumb padding respecting bottom safe area.

TYPOGRAPHY & FINISH:
Clean, modern geometric sans-serif typography. Enormous, bold tabular numerals with extreme contrast (exceeding 7:1) against the light mint surface. Soft ambient drop shadows on cards (0 4px 12px rgba(0,0,0,0.06)). Crisp, industrial touch-first finish.

STRICT NEGATIVE CONSTRAINTS:
NO 3D tilt, NO hands holding phone, NO desk mockup surfaces, NO analytics charts, NO line graphs, NO decorative bubbles, NO colorful background gradients, NO dark mode for the main body, NO red colors on the counters or buttons. Clean industrial mobile interface only.
```

---

## 3. Subsequent Screens Prompts

### Screen 2: Dashboard Critical Warning State
```text
Flat 2D mobile web application screenshot, iPhone portrait framing, 390x844 resolution, direct front-facing view, NO 3D perspective tilt, NO claymockups.

Identical spatial zoning to Screen 1 with emergency status colors active:
The central massive Participants button has transitioned into a solid deep emergency crimson red surface (#B00101) with a glowing, high-visibility 4px light-red border (#FF4D4D). In the center, an enormous pure white numeral "18" with white label "LEFT". Top label displays white uppercase text "PARTICIPANTS" and a dark crimson pill badge with an exclamation hexagon icon "CRITICAL".
The top navigation bar displays a matching red pill badge "CRITICAL" with an exclamation icon.
Upper Workers card is amber (#FFE9A8 with amber diagonal-stripe edge and triangle icon "LOW", numeral "8"). Pastors card remains light mint green (#DFF5E8, numeral "14", "OK").
Bottom action bar retains the royal purple "Undo: Participants -1" pill and white "Serve multiple" pill.
High urgency, life-safety visual clarity, perfect white-on-crimson contrast.

STRICT NEGATIVE CONSTRAINTS:
NO 3D angle, NO charts, NO distractions, NO red on the top header background (remains near-black #0A0A0A).
```

### Screen 3: Setup View
```text
Flat 2D mobile web application screenshot, iPhone portrait framing, 390x844 resolution, direct front-facing view, NO 3D perspective tilt.

Top 35% height: Rich, warm hero card with a smooth curved bottom edge filled with a vibrant gradient from crimson red (#FA2B2E) through rose red (#F52545) to royal purple (#7F499A). In the center of the hero is a prominent 96px circular white-bordered logo badge containing an embossed church event crest placeholder, with a small white pill button "Add organiser logo" below it. Above the logo is a small green pill chip "Ready offline" with a tick icon. Bold white title "TIAG KITCHEN" and subtitle "Count every plate. Works offline."
Bottom 65% height: An elevated crisp white paper card (#F9F9FE) with 24px top rounded corners containing clean form fields: Event Name ("TIAG-2026 Camp Meeting"), Station Name ("Station 1"), followed by three large numerical input fields with bold labels: "Participants (e.g. 500)", "Workers (e.g. 60)", "Pastors (e.g. 25)". Below the inputs is an optional 4-digit PIN field. At the bottom: a prominent full-width pill button with the vibrant crimson-to-purple brand gradient and bold white text "START SERVING".

STRICT NEGATIVE CONSTRAINTS:
NO 3D perspective, NO device bezel distortion, NO cluttered text. Clean modern event setup aesthetic.
```

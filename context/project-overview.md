# Project Overview: Tiag Kitchen

## 1. Executive Summary & Problem Definition

During large multi-day events, conferences, and camp meetings (such as the TIAG-2026 conference), catering teams and volunteer kitchen servers face intense pressure to serve thousands of hot meals across distinct attendee groups: **Participants**, **Workers**, and **Pastors**.

In real service lines, servers operate with wet or food-gloved hands, amidst steam, heat, kitchen noise, and impatient queues. Mobile connectivity in remote camp meeting dining halls or steel-reinforced kitchen tents is frequently weak or nonexistent. Existing digital POS systems or complex kitchen management software are expensive, require continuous Wi-Fi, demand complex user training, and collapse when the network drops. Conversely, manual paper tally sheets or mechanical hand-clickers get lost, greased, or fail to signal when stock is running out before it is too late.

**Tiag Kitchen** is an ultra-reliable, zero-friction, offline-first mobile web application (PWA) designed to track and count down food portion stock with a single thumb. It installs directly to the home screen, saves every decrement synchronously without a server, alerts the kitchen lead as food runs low through multi-sensory status indicators, and guarantees zero data loss—even under dead batteries, sudden browser closures, or phone reboots.

---

## 2. Users & Autonomous UX Research Intelligence

### 2.1 Audience Archetypes & Technical Literacy Audit

| User Archetype | Primary Role & Demographic | Tech Literacy & Cognitive Load | Device Profile & Environment |
|---|---|---|---|
| **Kitchen Server** (Primary Operator) | Volunteer or catering worker (Ages 18–65). Dispatches plates down the line. | **Low to Varied Literacy**: High physical distraction, tunnel vision under queue pressure. Cognitive capacity = zero. Must require **zero onboarding**. Maximum 1 primary touch target per viewport. | Mid-range Android (Samsung A-series, Tecno, Infinix) and older iPhones (iPhone 11/12/SE). Wet/gloved hands, grease, steam, outdoor glare or dim lighting. |
| **Kitchen Lead / Head Cook** | Chef, deacon, or food committee chair. Manages batch cooking and distribution. | **Moderate Literacy**: Needs to configure counts, handle mid-service batch restocks, fix server errors, and view final counts. Needs reassurance that counts cannot be wiped accidentally. | Dedicated phone or tablet mounted near food staging. Intermittent attention between cooking and serving. |
| **Event Organizer / Committee** | Conference leadership, audit committee. | **Executive / Oversight**: Interested in final reconciliation totals ("How many plates were served? Was there waste?"). Requires official event branding and shareable reports. | Desktop/laptop or WhatsApp mobile viewer reviewing exported CSV/text summaries post-service. |

### 2.2 Jakob's Law Familiar Market Pattern Mapping

Users in high-stress, repetitive environments rely on deeply ingrained physical and digital mental models:
1. **The Industrial Tally Clicker**: One tap = one count. Immediate, tactile feedback with zero visual lag.
2. **KDS (Kitchen Display System) Bump Screens**: Large, high-visibility status blocks with high contrast that change state based on queue urgency.
3. **Emergency Industrial Stop / Shutter Buttons**: Bottom-weighted thumb reach zone where the primary action occupies the natural arc of the thumb, preventing reach fatigue.
4. **Settings Behind the Gear**: Administrative tasks (restock, adjustments, resets) are explicitly separated from the operational surface to eliminate accidental modifications.

### 2.3 Jobs-To-Be-Done (JTBD) Matrix

| Category | Job ID | Job Statement (When / I Want To / So That) | Importance Rating |
|---|---|---|---|
| **Functional** | JTBD-F1 | When a hot plate passes across the counter, I want to tap a huge target with my thumb in under 50ms, so that the portion count updates instantly without delaying the serving queue. | **Critical** |
| **Functional** | JTBD-F2 | When the kitchen brings out another warm cooler containing 60 portions, I want to add 60 to the pool, so that remaining portions and percentage alert thresholds recalculate automatically without resetting the total served. | **Critical** |
| **Functional** | JTBD-F3 | When a volunteer accidentally taps the button twice, I want to undo that exact action with a clear label, so that errors are corrected without wiping other counters. | **High** |
| **Functional** | JTBD-F4 | When a department rep arrives to collect food for 4 team members, I want to dispatch 4 plates in a single confirmed action, so that I don't have to tap repeatedly while balancing plates. | **High** |
| **Functional** | JTBD-F5 | When the service ends, I want to generate a complete reconciliation summary as CSV or WhatsApp text, so that the catering committee has verified proof of meals served. | **High** |
| **Emotional** | JTBD-E1 | When 500 hungry people are lined up, I want to know with certainty that my screen won't sleep, crash, or lose counts if my battery dies, so that I feel calm, in control, and competent. | **Critical** |
| **Emotional** | JTBD-E2 | When stock is running thin, I want the screen to alert me clearly through color, icons, and text, so that I don't have to do mental arithmetic while plating food. | **High** |
| **Social** | JTBD-S1 | As an event organizer, I want volunteers using a tool displaying our official TIAG-2026 seal and brand colors, so that our kitchen operation reflects conference excellence. | **Supporting** |

### 2.4 Pain Points & Frustrations Hierarchy

| # | Severity | Pain Point & Root Cause | Verbatim User Language (Synthesized Field Quotes) |
|---|---|---|---|---|
| 1 | **P0 (Catastrophic)** | **Total Data Loss on Screen Lock / Refresh**: Unsaved browser state cleared when phone locks or memory flushes. | *"I put the phone down to wipe soup off the counter, the phone went to sleep, and when I unlocked it the page reloaded with 0! We had no clue how many participants had eaten."* |
| 2 | **P0 (Catastrophic)** | **Offline Dependency Failure**: App fails to load or loses styles when internet drops in the camp dining hall. | *"We were out in the camp pavilion with zero network bars. The website gave us the dinosaur offline error and broke completely. We had to scramble for scrap cardboard and a pen."* |
| 3 | **P1 (Severe)** | **Rapid Tap Ghosting / Double Counting**: Sensitive touchscreens registering multiple taps from shaky or wet thumbs. | *"My thumb was greasy from handling the trays and it registered three clicks when I only handed out one plate. There was no way to undo just that one mistake."* |
| 4 | **P1 (Severe)** | **Washout in Outdoor Sun / Kitchen Glare**: Low-contrast screens become unreadable under halogen lights or sunlight. | *"The afternoon sun hit our serving window directly. I couldn't see whether the button was yellow or green, the numbers were washed out, and I couldn't read the text."* |
| 5 | **P2 (Moderate)** | **Restock Calculation Chaos**: Mid-service cooking additions corrupt starting baseline counts. | *"The chef brought out another 80 plates of rice mid-service. We didn't know if we should change our starting number or do mental math, and by the end the tally was completely wrong."* |
| 6 | **P2 (Moderate)** | **Brand Red Ambiguity**: Using red for church branding confuses operators during critical food shortages. | *"Everything on our event flyer is bright red, so when the app turned red I thought it was just the church theme—I didn't realize we were down to the last 15 plates until the pot was empty!"* |
| 7 | **P3 (Minor)** | **Multi-Plate Bottleneck**: Serving groups or families requires awkward rapid-fire tapping. | *"When a pastor asked for four plates for his team, I had to tap four times while holding trays. It felt clumsy and slowed the line down."* |
| 8 | **P3 (Minor)** | **Greasy End-of-Night Reconciliation**: Manual transcription errors when reporting counts to conference directors. | *"Calculating how many people ate on a crumpled, stained paper napkin at 11 PM was awful. Someone always made an arithmetic error."* |

### 2.5 Mental Models & Competitive Whitespace

- **Tier 1 (Direct Competitors - Mobile Tally Apps)**: Generic tally apps (Tally Count, Counter). They feature banner ads, lack kitchen-specific percentage thresholds, offer no category division, and require App Store / Play Store accounts.
- **Tier 2 (Indirect Competitors - POS / KDS Platforms)**: Square KDS, Toast, Lightspeed. Highly functional but cost $50–$100/mo, require permanent high-speed Wi-Fi, need dedicated tablet hardware, and involve complex itemized menus.
- **Tier 3 (Category Alternatives - Pen & Paper)**: Zero setup cost, but paper gets soaked, lost, allows double-booking, and provides zero real-time warning when stock hits 10%.
- **Defensible Whitespace**: A zero-cost, zero-account, 100% offline-first PWA loaded once over HTTPS, instantly operable with one thumb, featuring triple-redundant status warnings, dual-write fault tolerance, and event-specific branding.

### 2.6 Search & Language Intelligence (Human Copywriting Vault)

- **Strict Copy Domain Separation**: Strictly ban plumbing jargon (*"indexedDB rehydration"*, *"state mutation"*, *"cache worker lifecycle"*, *"dispatch token"*) from all UI strings.
- **Operational Copy Tokens**:
  - `Ready offline` / `Not ready: connect once and refresh`
  - `Start Serving`
  - `Participants` / `Workers` / `Pastors`
  - `LEFT` / `Served: N`
  - `OK` (Tick) / `LOW` (Warning triangle) / `CRITICAL` (Exclamation mark) / `FINISHED` (Lock)
  - `Undo: [Category] -1`
  - `Serve multiple` / `Serve how many?`
  - `Add food` (Restock) / `Fix a count` (Adjust)
  - `Hold 2s to reset` / `Restore previous session`
  - `Session restored`

---

## 3. Scope Definition

### 3.1 In-Scope (Phase 1 MVP)

1. **Setup Screen**:
   - Circular logo slot (96px) with browser-side image resize (512px max, 300KB cap) stored in IndexedDB.
   - Event Name and Station Name inputs (optional).
   - Three initial portion count fields (Participants, Workers, Pastors) with numeric sanitization (0–99,999).
   - Optional 4-digit lead PIN protection (salted SHA-256).
   - Offline readiness indicator pill ("Ready offline" / "Not ready").
   - Dismissible first-run Add-to-Home-Screen guide (Android Chrome & iOS Safari).
2. **Serving Dashboard**:
   - Near-black header bar (8% height) with TIAG logo (40px), station/event title, worst-status chip, and Settings gear.
   - Secondary row (20% height): Workers and Pastors side-by-side cards (min 88px tall).
   - Primary target (60% height): Participants full-width button (min 55% height, 35% number size).
   - Footer bar (12% height): Dynamic named Undo button (min 56px) and Serve Multiple trigger.
   - Multi-sensory status indicators: OK (>25%), LOW (<=25%), CRITICAL (<=10%), FINISHED (0).
3. **Settings Bottom Sheet**:
   - Restock (+N plates added to total and left).
   - Adjust (override left count with audit log entry).
   - Tap Lock (dimmed screen requiring 1s press-and-hold to unlock).
   - Sound toggle (Web Audio synthesized beeps on LOW and CRITICAL).
   - Vibration toggle (Web Haptics on Android; visual flash fallback on iOS).
   - Change Logo / Event Info.
   - End Service (transitions to Summary).
   - Reset (2-second hold + PIN + automatic previous session snapshot).
4. **End-of-Service Summary**:
   - Header with logo, event name, station, start/end timestamps.
   - Per-category metrics: Starting, Restocked, Adjusted, Served, Remaining.
   - Offline Copy Summary as Text and Download CSV actions.
   - Start New Event trigger.
5. **Offline & System Resilience**:
   - Cache-first Service Worker with versioned cache precaching.
   - Dual-persistence engine: synchronous `localStorage` + asynchronous `IndexedDB` with sequence numbers.
   - Screen Wake Lock API management.
   - Multi-tab conflict detection (read-only warning on duplicate tabs).
   - Back button gesture guard.

### 3.2 Out-of-Scope (Hard Boundaries)

- No user accounts, passwords, email signups, or authentication servers.
- No remote database, cloud syncing, websockets, or external API backends.
- No tracking cookies, telemetry beacons, or third-party analytics scripts.
- No payment processing, food ordering, recipe management, or dietary preferences.
- No dynamic categories beyond the three fixed groups (Participants, Workers, Pastors; custom labels allowed at setup only).
- No dark/light mode toggle. A single high-contrast, glare-proof industrial theme.

---

## 4. Checkable Success Criteria

1. **Zero-Signal Survivability**: The application loads and functions 100% offline in aeroplane mode, including after full browser termination and cold device restart.
2. **Single-Thumb Ergonomics**: A first-time volunteer can operate the primary counter accurately using only one thumb with zero training.
3. **50ms Tactile Latency**: Every touch registers visual feedback within 50ms, with a 200ms debounce preventing accidental double-clicks.
4. **Zero Accidental Wipes**: It is mathematically impossible to reset or wipe active counts with a single tap. Reset strictly requires a 2-second continuous hold plus PIN (if set).
5. **Reconciliation Audit Parity**: At service close, the sum of `Starting + Restocked + Adjusted` exactly equals `Served + Left` across all categories, matching the local tap audit log.
6. **Strict Status Color Quarantine**: Brand reds (`#A20000`, `#FF2A2A`) never appear on the counter buttons during service. Red indicates exclusively critical portion stock (<10%).

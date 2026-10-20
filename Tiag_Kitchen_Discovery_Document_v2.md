*Discovery Document · Version 2*

# Tiag Kitchen

Offline portion tracker for event kitchen service

| **Item**      | **Detail**                                                                              |
|---------------|-----------------------------------------------------------------------------------------|
| Prepared by   | A.U.TO.MATE                                                                             |
| Date          | 19 October 2026                                                                         |
| Event context | TIAG-2026 (taken from the organiser website screenshot)                                 |
| Contents      | Sections 1–10 (discovery) · Appendix A: Master Build Prompt · Appendix B: Stitch Prompt |
| Colour source | Sampled directly from the attached organiser website screenshot                         |

*This version keeps the original idea exactly as written (three counters, big Participant button, warning colours, undo, offline) and closes the gaps that would cause trouble on the night. Nothing from the original brief was removed.*

# 1. Project Summary

**Tiag Kitchen** is a single-screen web app that lets a kitchen server count down food portions for three groups: **Participants**, **Workers** and **Pastors**. The server enters the starting numbers once, then taps a big button each time a plate goes out. The app shows what is left, changes colour as stock runs low, and keeps working with no internet at all.

## What success looks like

- A person who has never seen the app can serve a full line using only their thumb, with no instructions.

- Every tap is saved the moment it happens. A dead battery, a closed browser or a lost signal never loses a count.

- The kitchen lead can answer "how many plates are left and how many did we serve?" in under 3 seconds.

- The organisers' logo appears on the app so it looks official, without any technical effort from the user.

- No personal data is ever collected, stored or sent.

## What changed from the first prompt

The first prompt was a good core. Version 2 adds 23 protections (Section 3), a logo slot, a defined end-of-service summary, a colour system taken from the organiser's own website, and a full set of tests to run in aeroplane mode before the event.

# 2. Users and Context

| **Who**                        | **What they need**                                                           | **What gets in the way**                                                                         |
|--------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **Kitchen server** (main user) | Tap, see the number, keep going. Zero learning.                              | Wet or gloved hands, one hand free, queue pressure, bright or dim light, rushed accidental taps. |
| **Kitchen lead**               | Set up the counts, add stock, fix mistakes, see the final summary.           | Needs to correct errors without wiping the event. Needs a record at the end.                     |
| **Event organisers**           | Their logo and event name visible. A tool that looks like part of the event. | Will not touch settings. May want a printed or shared summary.                                   |

## Environment

- Kitchen area with weak or no mobile signal. The app must not depend on it at any moment after the first load.

- Phones are the main device (mixed Android and iPhone). Portrait orientation is the default.

- Heat, steam, grease and glare. High contrast and large touch targets are not optional.

## Assumptions (change any of these and tell the builder)

- One phone per serving station. Phones do not sync with each other (see Open Questions).

- The app is hosted on a secure (HTTPS) web address and opened once with data or Wi-Fi before the event.

- Starting counts are below 100,000 per category.

# 3. Gap Analysis: Loopholes Found and How They Are Closed

Each row below is a way the original prompt could fail in real service. The right-hand column is already written into the Master Build Prompt.

| **\#** | **Loophole**                               | **Why it hurts**                                                          | **How it is closed**                                                                                                                                                |
|--------|--------------------------------------------|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | Tailwind loaded from a CDN                 | Page loses all styling the moment signal drops on a fresh start.          | Compile Tailwind ahead of time and inline it. No CDN, no remote fonts, no remote icons.                                                                             |
| 2      | "Load once and it works" is not guaranteed | Service worker can fail silently. User thinks it is ready and it is not.  | Show "Ready offline" only after every file is confirmed cached. Otherwise show "Not ready: connect once and refresh". First-run install guide.                      |
| 3      | Phone can clear stored data                | iPhone Safari clears unused site data. Low-storage Android phones do too. | Request persistent storage. Save to two places (localStorage and IndexedDB). Restore from the newer copy. Recommend Add to Home Screen.                             |
| 4      | Bad numbers at setup                       | Negative, decimal, empty or pasted junk values.                           | Whole numbers only, 0 to 99,999, numeric keypad, at least one category above 0, input cleaned on paste.                                                             |
| 5      | Zero not defined                           | Server keeps tapping past empty.                                          | At 0 the button locks, shows FINISHED and vibrates once. Only Restock can raise it again.                                                                           |
| 6      | Accidental taps                            | Double-tap, pocket tap, second finger, scroll-drag.                       | 200 ms lock per button, double-tap zoom disabled, extra fingers ignored, a drag cancels the tap, optional Tap Lock.                                                 |
| 7      | Undo covers one tap only                   | Cannot fix a mistake from three taps ago or in another category.          | Undo history of the last 30 actions across all categories. Button states what it will undo.                                                                         |
| 8      | Reset can wipe a live event                | One wrong tap ends the night.                                             | Reset hidden in Settings, press-and-hold 2 seconds, optional lead PIN, automatic snapshot with a Restore option.                                                    |
| 9      | No way to add stock                        | Kitchens often cook more mid-service.                                     | Restock (+N) with a log entry. Percentages recalculate on the new total.                                                                                            |
| 10     | Percent rule on small totals               | 25% of 5 plates is 1.25.                                                  | Round up. Critical wins if both rules match. Rule written out in Section 6.                                                                                         |
| 11     | Brand red clashes with danger red          | If the app is branded red, "low stock" looks like decoration.             | On the serving screen, red means critical stock and nothing else. Brand colours live only in header accents and non-serving screens.                                |
| 12     | Colour is the only signal                  | Glare and colour blindness hide the warning.                              | Every state also has a text label, an icon and an edge pattern.                                                                                                     |
| 13     | Screen sleeps mid-service                  | Phone locks, server fumbles to wake it.                                   | Screen Wake Lock while serving, re-requested when the app returns to the front. State is saved on every tap regardless.                                             |
| 14     | Accidental close, back or refresh          | Session view lost or page reloads.                                        | Pull-to-refresh disabled, Back button guarded, full state restored on reopen.                                                                                       |
| 15     | App update mid-event                       | New version reloads and disturbs a live session.                          | Updates wait. They apply only after the app is closed and no session is active. Never auto-reload.                                                                  |
| 16     | Two phones, one food pool                  | Counts drift apart. No sync offline.                                      | Each phone is a named Station. Summary is per station. Sync is out of scope for v1 and flagged in Section 10.                                                       |
| 17     | Two tabs open on one phone                 | They overwrite each other.                                                | Detect the second tab and show a clear warning with a read-only view.                                                                                               |
| 18     | Logo handling                              | Huge file, wrong format, nowhere to put it.                               | Logo slot on Setup, header and Summary. PNG, JPG or WebP only, resized in the browser to 512 px, 300 KB cap, stored on the phone, circle-safe, default placeholder. |
| 19     | No record of what happened                 | Cannot reconcile at the end.                                              | Local tap log (time, category, change; no personal data). End-of-service summary. Copy-as-text and CSV download that both work offline.                             |
| 20     | Storage gets corrupted                     | App opens blank.                                                          | Schema version, integrity check, fall back to the last good snapshot.                                                                                               |
| 21     | Gloves, wet hands, glare                   | Missed taps and unreadable numbers.                                       | Minimum tap sizes, 7:1 contrast on numbers, very large numerals.                                                                                                    |
| 22     | Personal data                              | Brief says none.                                                          | No names, accounts, analytics, cookies or outside requests. A content-security rule blocks everything except the app's own files.                                   |
| 23     | Several plates at once                     | One tap per plate is slow when a table of four arrives.                   | "Serve multiple" sheet: 2, 3, 4, 5 or 10 in one confirmed action.                                                                                                   |

# 4. Scope

## In scope (version 1)

- Setup screen with event name, station name, logo slot and three starting counts.

- Serving dashboard with three counters, live status colours, undo, serve multiple.

- Settings sheet: restock, adjust, tap lock, sound and vibration, logo change, reset.

- End-of-service summary with copy and CSV export.

- 100% offline use, installable to the home screen.

## Out of scope (hard fence)

- No accounts, logins, names or any personal data.

- No syncing between phones, no server, no database, no analytics.

- No ordering, payments, menus or inventory beyond the three counters.

- No extra categories beyond Participants, Workers and Pastors. Labels may be renamed at setup only.

- No dark mode toggle. One high-contrast theme only.

# 5. User Flows

| **Flow**                 | **Steps**                                                                                                                                                  |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| First-time install       | Open link online → app loads → "Ready offline" tick appears → install guide offers Add to Home Screen (Android and iPhone steps) → user proceeds to Setup. |
| Setup                    | Add logo (optional) → type event name and station name → enter three counts → optional lead PIN → Start Serving.                                           |
| Normal serving           | Tap Participants (−1) → number drops, flashes, status updates. Same for Workers and Pastors. Screen stays awake.                                           |
| Fix a mistake            | Tap Undo (shows what it will undo) → repeat up to 30 times. Or open Settings → Adjust to set an exact figure (logged).                                     |
| Food added               | Settings → Restock → choose category → enter amount → confirm. Status recalculates.                                                                        |
| Phone dies or app closes | Reopen → app restores the exact last state → a brief "Session restored" note appears.                                                                      |
| End of service           | Settings → End Service → summary screen (served, left, per category, time range) → Copy or Download CSV → New Event.                                       |
| Reset                    | Settings → Reset → press and hold 2 s → PIN if set → previous state saved as a snapshot → back to Setup. Snapshot can be restored once.                    |

# 6. Screens and Component Rules

## 6.1 Setup screen

- Top: logo slot (circle, 96 px) with "Add organiser logo" under it. Default shows a neutral placeholder.

- Title: **Tiag Kitchen**. Fields: Event name, Station name (both optional), three count fields with big labels.

- Optional lead PIN (4 digits). Skipped by default.

- Primary button: **Start Serving**, disabled until counts are valid. Errors appear in plain words under the field.

- Small status chip: Ready offline / Not ready.

## 6.2 Serving dashboard

| **Zone**                    | **Rule**                                                                                                                                                         |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Header (about 8% of height) | Logo (40 px circle), "Tiag Kitchen", event name small, worst-status chip, Settings gear. Near-black background with a thin crimson-to-purple line.               |
| Secondary row (about 20%)   | Workers and Pastors cards side by side, each at least 88 px tall. Each shows LEFT as the big number and "Served: N" small. A small ×N chip opens Serve multiple. |
| Participants (about 60%)    | One full-width button, at least 55% of screen height, edge to edge. Number takes at least 35% of the button height. Tap = −1.                                    |
| Footer bar (about 12%)      | Undo (names the action it will reverse) and Serve multiple. Each at least 56 px tall. Respects phone safe areas.                                                 |

## 6.3 Status rules

Let **T** = starting count + all restocks. Amber starts when left ≤ round-up(25% of T). Critical starts when left ≤ round-up(10% of T). If both match, critical wins. At 0 the state is Finished.

| **State**    | **Condition** | **Look**                                                                                                                            |
|--------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **OK**       | Above 25%     | Light green surface, green edge, dark number, label "OK" with a tick icon.                                                          |
| **LOW**      | 25% or less   | Amber surface, dark number, label "LOW" with a triangle icon, diagonal-stripe edge.                                                 |
| **CRITICAL** | 10% or less   | Solid deep red surface, white number, label "CRITICAL", exclamation icon, slow pulse on the border (stops if reduced-motion is on). |
| **FINISHED** | 0             | Near-black, white text, "FINISHED", button locked, one long vibration. Restock is offered.                                          |

## 6.4 Settings sheet (tucked away)

- Opens from the gear. Sections: Restock, Adjust, Tap Lock, Sound and Vibration, Change Logo, Event Info, End Service, Reset.

- If a PIN is set, Restock, Adjust, Change Logo, End Service and Reset ask for it.

- Tap Lock: dims the dashboard and ignores taps until the user presses and holds an unlock control for 1 second.

## 6.5 End-of-service summary

- Logo, event name, station, start and end time.

- Per category: starting, restocked, adjusted, served, left.

- Buttons: Copy summary as text, Download CSV, Start New Event.

- Opens only when the lead confirms End Service. Never appears by accident.

# 7. Visual Direction

Colours were sampled from the attached organiser website. The site uses a strong red hero, pill-shaped buttons, a red-to-purple gradient section, soft grey-white backgrounds and a black footer. Tiag Kitchen borrows that look so it feels like part of the same event family.

## 7.1 Brand palette (from the screenshot)

| **Swatch** | **Hex**  | **Name**     | **Use**                                                                   |
|------------|----------|--------------|---------------------------------------------------------------------------|
|            | \#A20000 | Deep Crimson | Setup screen header, headings, critical state surface (as \#B00101).      |
|            | \#FF2A2A | Signal Red   | Primary buttons on Setup and Summary only. Never on the serving counters. |
|            | \#FD3F27 | Flame Orange | Gradient start, small highlights, focus rings.                            |
|            | \#F52545 | Rose Red     | Gradient mid-point and icon accents.                                      |
|            | \#7F499A | Royal Purple | Gradient end, Undo button, links, secondary accents.                      |
|            | \#0A0A0A | Ink Black    | Header bar, Finished state, body text.                                    |
|            | \#F4F7FA | Mist         | Page background.                                                          |
|            | \#F9F9FE | Paper        | Cards and sheets.                                                         |

Brand gradient: **\#FA2B2E → \#7F499A**, running top-left to bottom-right (the same sweep as the testimonial section on the site).

## 7.2 Status palette (separate from the brand)

| **Swatch** | **Hex**  | **Name**     | **Use**                                                                |
|------------|----------|--------------|------------------------------------------------------------------------|
|            | \#1FA45B | Go Green     | OK edge and icon. Surface tint \#DFF5E8.                               |
|            | \#F5A524 | Amber        | LOW edge. Surface tint \#FFE9A8.                                       |
|            | \#B00101 | Critical Red | CRITICAL surface with white text. Matches the deepest red on the site. |
|            | \#0A0A0A | Ink Black    | FINISHED surface.                                                      |

**The key colour rule:** on the serving dashboard, red means "stock is critical" and nothing else. The header is near-black with only a thin gradient line, so the brand red never competes with the warning red.

## 7.3 Type, shape and logo

- Typeface: Poppins (bundled locally), weights 500, 600, 700, 800. Fallback: system sans-serif. Counter numerals at 800 weight.

- Shape: pill buttons (fully rounded), 20 to 24 px card radius, soft shadows, as on the organiser site.

- Logo slot: circle, 40 px in header, 96 px on Setup, 72 px on Summary. The organiser's mark on the site is a round seal, so the slot is circle-safe with a white ring. Non-round logos sit inside the circle with padding rather than being cropped.

- Tone of copy: short, plain, human. "Left", "Served", "Add food", not technical wording.

# 8. Technical and Offline Requirements

## 8.1 Architecture

- Files: index.html (all CSS and JavaScript inline), sw.js, manifest.webmanifest, icon-192.png, icon-512.png, poppins subset font files. The HTML also works on its own if the service worker is unavailable.

- Tailwind compiled and minified at build time, then inlined. No CDN scripts.

- Hosting must be HTTPS (service workers require it). Suggested: any static host.

- Cache-first service worker with a versioned cache name. Navigation requests fall back to index.html.

## 8.2 Data and storage

- Write to localStorage synchronously on every action. Mirror to IndexedDB right after. Each write carries an increasing sequence number; on load, use the higher one.

- Logo is stored in IndexedDB, not localStorage.

- Schema version and a checksum on the saved state. If the check fails, load the last good snapshot.

- Call navigator.storage.persist() when the session starts.

- Cap the tap log at 20,000 entries.

## 8.3 Hard numeric constraints

| **Item**                      | **Value**                                                                     |
|-------------------------------|-------------------------------------------------------------------------------|
| Participant button height     | 55% of screen height minimum (target 60%)                                     |
| Worker and Pastor card height | 88 px minimum                                                                 |
| Any other tap target          | 48 px minimum; Undo and Serve multiple 56 px                                  |
| Tap response                  | Visual feedback within 50 ms                                                  |
| Per-button lock after a tap   | 200 ms                                                                        |
| Undo history                  | 30 actions                                                                    |
| Count range                   | 0 to 99,999, whole numbers                                                    |
| Hold-to-confirm for Reset     | 2 seconds                                                                     |
| Tap Lock unlock hold          | 1 second                                                                      |
| Logo                          | PNG, JPG or WebP; resized to 512 px longest side; 300 KB maximum after resize |
| Number contrast               | 7:1 minimum against its surface                                               |
| Total app size                | Under 500 KB including fonts                                                  |

## 8.4 Browser and device support

- Android Chrome (last 3 years of versions) and iPhone Safari 15 and above. Other browsers are best effort.

- Haptic vibration is not available on iPhone. Use a short visual flash instead.

- Screen Wake Lock may be unavailable on older devices. Show a one-line tip to turn off auto-lock.

## 8.5 Privacy and security

- No personal data fields anywhere. No cookies, analytics or third-party code.

- A strict content-security rule allowing only the app's own files.

- The PIN is a speed bump against accidents, not high security. Stored as a salted hash on the device.

# 9. Edge Cases and Acceptance Tests

Run every test below on one Android phone and one iPhone before the event. Tests 1 to 3 are done with aeroplane mode on.

| **\#** | **Test (pass = it behaves as written)**                                                                                                     |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | Load once online. Switch on aeroplane mode. Close the app fully. Reopen. Styling, logo and counts are all intact.                           |
| 2      | Restart the phone mid-session in aeroplane mode. Reopen. Counts match the last tap exactly.                                                 |
| 3      | Fresh phone with no signal at all, never loaded before: shows nothing broken, and the install guide explains it must be opened once online. |
| 4      | Tap the Participant button 10 times quickly. Count drops by 10 or fewer, never more, and never double-counts a single press.                |
| 5      | Double-tap on any counter does not zoom the page.                                                                                           |
| 6      | Set a category to 5. Confirm the status order: OK at 5 and 3, LOW at 2, CRITICAL at 1, FINISHED at 0.                                       |
| 7      | At 0, tapping does nothing, the button shows FINISHED. Restock +10 brings it back to OK or LOW correctly.                                   |
| 8      | Make 5 taps across 3 categories. Undo 5 times. All three counts return to their starting values.                                            |
| 9      | Reset requires the 2-second hold and PIN (if set). After reset, Restore brings the previous session back.                                   |
| 10     | Leave the phone idle for 5 minutes during service. Screen stays awake (or the tip is shown).                                                |
| 11     | Upload a 6 MB photo as the logo. It is resized and accepted. Upload a PDF. It is rejected with a clear message.                             |
| 12     | Open the app in two tabs. The second tab shows a warning and does not change counts.                                                        |
| 13     | Publish an update while a session is active. The live session does not reload. The update applies after End Service and reopening.          |
| 14     | End Service. Summary totals equal the tap log. CSV downloads and opens. Copy-as-text pastes cleanly.                                        |
| 15     | Turn off colour on the display (greyscale). The three states are still clearly different by label, icon and edge.                           |

# 10. Open Questions

Each question has a default so the builder is never blocked. Change any default and the prompt can be updated.

| **\#** | **Question**                                                                       | **Default used if not answered**                                      |
|--------|------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| 1      | Will more than one phone serve the same food pool? If yes, do you want sync later? | Each phone is its own station. No sync in v1.                         |
| 2      | Where will the app be hosted?                                                      | Any HTTPS static host. The builder includes deployment notes.         |
| 3      | Is the organiser logo round, square or wide? Is a transparent PNG available?       | Treated as unknown; placed inside a circle with padding.              |
| 4      | Exact event name for the header?                                                   | Blank field with placeholder "e.g. TIAG-2026 Camp Meeting".           |
| 5      | Should the lead PIN be required or optional?                                       | Optional.                                                             |
| 6      | Should the three category names be editable?                                       | Editable at setup only. Defaults stay Participants, Workers, Pastors. |
| 7      | Is a sound beep wanted when stock turns LOW or CRITICAL?                           | Off by default; can be switched on in Settings.                       |
| 8      | Typical starting counts (hundreds or thousands)?                                   | Up to 99,999 supported.                                               |
| 9      | Does the organiser want the end summary shared as CSV, plain text, or both?        | Both are included.                                                    |
| 10     | Language: English only?                                                            | English only.                                                         |

# Appendix A: Master Build Prompt

*Copy everything inside the quoted block into your builder.*

> ### ROLE
>
> You are a senior front-end engineer building a small, bulletproof, offline-first web app for a live event kitchen. Build exactly what is written below. Do not add features. Do not leave placeholders or TODOs. Output complete, working code.
>
> ### PRODUCT
>
> App name: Tiag Kitchen. A single-page, mobile-first web app that lets a kitchen server count down food portions for three groups: Participants, Workers, Pastors. No personal data is collected. It must work 100% offline after the first load.
>
> ### HARD SCOPE FENCES

- Only three categories: Participants, Workers, Pastors. Names editable at setup only.

- No accounts, names, analytics, cookies, sync, server calls, ordering, payments or menus.

- No CDN scripts, no remote fonts, no remote icons, no remote images. Every asset ships with the app.

- One high-contrast theme. No dark-mode toggle.

> ### DELIVERABLES

- index.html: all CSS and JavaScript inline. Tailwind must be compiled and minified at build time and inlined as a style block. Never use the Tailwind CDN script. If a build step is not possible, hand-write the equivalent minimal CSS.

- sw.js: service worker. manifest.webmanifest. icon-192.png and icon-512.png. Poppins latin subset as local woff2 (500, 600, 700, 800) with a system sans-serif fallback.

- A short README with deployment steps for any HTTPS static host and the aeroplane-mode test list.

- The HTML must still work if opened without the service worker (state still saved locally).

> ### SCREEN 1: SETUP

- Top: circular logo slot, 96 px, with a button "Add organiser logo". Default is a neutral placeholder. Logo accepts PNG, JPG or WebP only. Resize in the browser to a 512 px longest side, reject anything above 300 KB after resize, show a plain-words error otherwise. Store in IndexedDB. Never upload anywhere. Place the logo inside a circle with a white ring and padding so square or wide logos are not cropped badly.

- Title: Tiag Kitchen. Optional fields: Event name (placeholder "e.g. TIAG-2026 Camp Meeting"), Station name (placeholder "e.g. Station A").

- Three count fields: Participants, Workers, Pastors. Numeric keypad (inputmode numeric). Whole numbers from 0 to 99,999. Strip non-digits on paste. At least one must be above 0. Show errors in plain words under the field.

- Optional 4-digit lead PIN. Stored as a salted SHA-256 hash. Protects Restock, Adjust, Change Logo, End Service and Reset.

- Primary button "Start Serving", disabled until valid.

- Status chip: "Ready offline" (only after the service worker is active and every file is confirmed in cache) or "Not ready: connect once and refresh".

- First-run install guide card with Add to Home Screen steps for Android Chrome and iPhone Safari. Dismissible.

> ### SCREEN 2: SERVING DASHBOARD (portrait, full height, no page scroll)

- Header, about 8% of height: logo (40 px circle), "Tiag Kitchen", event name in small text, worst-status chip, Settings gear. Background \#0A0A0A with a 3 px line gradient \#FA2B2E to \#7F499A.

- Secondary row, about 20%: Workers and Pastors cards side by side, each at least 88 px tall. Big number = LEFT. Small text = "Served: N". A small "x N" chip opens Serve multiple.

- Participants, about 60%: one full-width button, at least 55% of screen height, edge to edge. Number is at least 35% of the button height. Tap subtracts 1 from LEFT and adds 1 to Served.

- Footer bar, about 12%: Undo (label states what it will undo, for example "Undo: Participants -1") and Serve multiple. Each at least 56 px tall. Respect safe-area insets.

- Landscape must still work without overlap.

> ### TAP BEHAVIOUR

- Count on pointer release. Ignore the tap if the pointer moved more than 12 px. Ignore extra fingers while one is down.

- Lock each button for 200 ms after a counted tap. Set touch-action: manipulation. Disable double-tap zoom, text selection, long-press menus, pull-to-refresh (overscroll-behavior: none) and pinch zoom on the dashboard.

- Feedback within 50 ms: number bump animation and a quick flash. Vibrate 30 ms where supported; on iPhone use the flash only.

- At 0 LEFT: button locks, shows FINISHED, one long vibration. Counts can never go below 0.

- Serve multiple: bottom sheet with 2, 3, 4, 5, 10 and a Confirm button. One action in the history.

- Optional Tap Lock: dims the screen and ignores taps until an unlock control is held for 1 second.

> ### STATUS RULES

- T = starting count + all restocks for that category. Use round-up (ceiling) maths.

- Amber (LOW) when LEFT \<= ceil(0.25 x T). Critical when LEFT \<= ceil(0.10 x T). Critical wins if both match. FINISHED at 0.

- OK: surface \#DFF5E8, edge \#1FA45B, dark number, label "OK" with tick icon.

- LOW: surface \#FFE9A8, edge \#F5A524, dark number, label "LOW" with triangle icon, diagonal-stripe edge.

- CRITICAL: surface \#B00101, white number, label "CRITICAL" with exclamation icon, slow border pulse (disable if prefers-reduced-motion).

- FINISHED: surface \#0A0A0A, white text, label "FINISHED".

- Colour is never the only signal: every state has a text label, an icon and an edge pattern.

- On the dashboard, red means critical stock and nothing else. Do not use \#FF2A2A or other brand reds on the counters.

- Number contrast must be at least 7:1 against its surface.

> ### SETTINGS SHEET (behind the gear)

- Restock: choose category, enter amount (whole number), confirm. Adds to LEFT and to T. Logged.

- Adjust: set an exact LEFT value for a category with confirm. Logged.

- Tap Lock, Sound (off by default; beep on entering LOW and CRITICAL), Vibration, Change Logo, Event Info.

- End Service: opens the Summary screen after confirmation.

- Reset: press and hold 2 seconds, PIN if set. Before wiping, save a full snapshot. Settings shows "Restore previous session" until the next reset.

> ### UNDO

- Keep the last 30 actions (serve, serve multiple, restock, adjust) across all categories in one history. Undo reverses the most recent. The button always names the action it will reverse. Undo is disabled when history is empty.

> ### SUMMARY SCREEN

- Logo (72 px circle), event name, station, start and end time.

- Per category: starting, restocked, adjusted, served, left.

- Buttons: Copy summary as text, Download CSV, Start New Event.

- Both Copy and Download must work offline. Totals must equal the tap log.

> ### DATA MODEL (keep it simple and versioned)

- state: { schema: 1, seq, checksum, event: {name, date, station}, pinHash, categories: { participants\|workers\|pastors: {label, initial, restocked, adjusted, served, left} }, settings: {tapLock, sound, vibrate}, startedAt, endedAt }

- history: array of { id, t, cat, type: serve\|multi\|restock\|adjust, delta } capped at 20,000.

- On load verify schema and checksum. If invalid, load the last good snapshot. If neither is valid, show a clear recovery screen, never a blank page.

> ### PERSISTENCE

- Write to localStorage synchronously on every action, then mirror to IndexedDB. Increase seq on every write. On load use the copy with the higher seq.

- Call navigator.storage.persist() at session start.

- Reopening after a crash or phone restart restores the exact last state and shows "Session restored" briefly.

- If a second tab is open, show a warning and make it read-only. Use BroadcastChannel or the storage event.

- Request a Screen Wake Lock while serving. Re-request it when the page becomes visible again. If unsupported, show a one-line tip to turn off auto-lock.

- Guard accidental Back navigation with history state so Back does not leave a live session.

> ### SERVICE WORKER

- Precache every file. Versioned cache name. Cache-first for the app shell. Navigation fallback to index.html.

- Do not call skipWaiting while a session is active. New versions wait and apply only after the app is closed and no session is active. Never auto-reload the page.

- Report "Ready offline" only after confirming each required file exists in the cache.

> ### PRIVACY AND SECURITY

- Add a Content-Security-Policy meta tag allowing only same-origin resources and inline styles and scripts needed by the app. No third-party code.

- Collect no personal data. The only stored values are counts, labels, optional event and station names, the logo, optional PIN hash and the tap log.

> ### DESIGN TOKENS

- Brand: Deep Crimson \#A20000, Signal Red \#FF2A2A, Flame Orange \#FD3F27, Rose Red \#F52545, Royal Purple \#7F499A, Ink Black \#0A0A0A, Mist \#F4F7FA, Paper \#F9F9FE. Gradient: \#FA2B2E to \#7F499A, top-left to bottom-right.

- Use brand colours on Setup, Summary, header line and buttons. Primary buttons on Setup and Summary: pill shape, Signal Red or gradient. Undo button: Royal Purple.

- Poppins from local files. Counter numerals weight 800. Cards radius 20 to 24 px, soft shadow. Plain, short, human copy.

- Tap targets: 48 px minimum anywhere; 88 px for Worker and Pastor cards; 56 px for Undo and Serve multiple.

- Total app size under 500 KB.

> ### ACCEPTANCE TESTS (the build must pass all)

- Works fully after the first load with aeroplane mode on, including after fully closing the app and after a phone restart.

- 10 rapid taps never subtract more than 10 and never double-count one press.

- With a starting count of 5: OK at 5 and 3, LOW at 2, CRITICAL at 1, FINISHED at 0.

- Undo x5 after 5 mixed taps restores all three starting values.

- Reset needs a 2-second hold (and PIN if set); Restore brings the old session back.

- A 6 MB photo is resized and accepted as the logo; a PDF is rejected with a clear message.

- An update published during a live session does not reload it.

- Summary totals equal the tap log; CSV and Copy work offline.

> ### OUTPUT
>
> Return the full code for every file, then the README. No explanations inside the code files beyond short comments. Do not skip any section above.

# Appendix B: Stitch Prompt (Visual Generation)

*Paste this into Google Stitch. Generate the screens in the order listed. The colours are taken from the organiser website.*

> ### PROJECT
>
> Design a polished, modern mobile web app UI called "Tiag Kitchen": a food-portion counter for event kitchen servers. Device: iPhone-size portrait, 390 x 844. Feel: bold, warm, confident, church-event energy, premium but dead simple. Large numerals, thick rounded shapes, soft shadows, very high contrast. Everything readable at arm's length in a busy kitchen.
>
> ### BRAND STYLE (match the organiser's website)

- Colours: Deep Crimson \#A20000, Signal Red \#FF2A2A, Flame Orange \#FD3F27, Rose Red \#F52545, Royal Purple \#7F499A, Ink Black \#0A0A0A, Mist \#F4F7FA, Paper \#F9F9FE.

- Signature gradient: \#FA2B2E to \#7F499A, top-left to bottom-right, used on hero areas and primary buttons.

- Typeface: Poppins. Headlines in bold caps. Numerals extra bold (800).

- Shapes: fully rounded pill buttons, 24 px rounded cards with soft shadow, thin white rings around circular logos.

- Status colours (separate from brand): OK green \#1FA45B on \#DFF5E8, LOW amber \#F5A524 on \#FFE9A8, CRITICAL deep red \#B00101 with white text, FINISHED ink black \#0A0A0A with white text.

- Rule: on the serving screen red only ever means critical stock. The header there is near-black, not red.

> ### LOGO SLOT
>
> Every screen that shows branding has a circular logo slot with a white ring. Show a tasteful neutral placeholder (a simple seal outline with the words "YOUR LOGO") so the organiser can swap in their own. 96 px on Setup, 40 px in the header, 72 px on Summary.
>
> ### SCREEN 1: SETUP

- Top hero with the brand gradient and soft curved bottom edge. Centred circular logo slot with a small pill button "Add organiser logo" under it.

- Big bold title "TIAG KITCHEN" in white. Small subtitle "Count every plate. Works offline."

- A white card slides up with fields: Event name, Station name, then three large number fields with clear labels: Participants, Workers, Pastors. Each field is tall, with a big numeric value and a small icon.

- Optional line: "Add a 4-digit lead PIN (optional)".

- Full-width gradient pill button "START SERVING".

- Small green chip "Ready offline" with a tick at the top right.

> ### SCREEN 2: SERVING DASHBOARD (all states in the OK condition first)

- Near-black header bar with a thin crimson-to-purple gradient line at its bottom edge. Left: round logo slot (40 px), "Tiag Kitchen" in white, event name small and grey. Right: a green chip "ALL OK" and a gear icon.

- Below the header, two side-by-side cards: Workers and Pastors. Each has a tiny label, a big number labelled LEFT, small "Served: 38" text, a small tick icon with "OK", and a tiny "x N" chip in the corner. Light green surface with a green edge.

- Under them, one huge edge-to-edge button taking about 60% of the screen: PARTICIPANTS, with an enormous number (for example 412), the word LEFT, and small "Served: 188". Light green surface, thick green edge, a tick icon with "OK". It must look like a button that begs to be tapped.

- Bottom bar: a Royal Purple pill button "Undo: Participants -1" and a white pill button "Serve multiple". Large and thumb friendly.

> ### SCREEN 3: DASHBOARD, LOW AND CRITICAL STATES

- Variant A: Workers card amber (#FFE9A8 with amber edge and diagonal-stripe border, triangle icon, label "LOW"). Participants still green. Header chip amber "LOW".

- Variant B: Participants button solid deep red \#B00101, white giant number (for example 38), label "CRITICAL" with an exclamation icon, a glowing pulsing border. Header chip red "CRITICAL".

- Variant C: Pastors card near-black with white text "FINISHED", number 0, a small outlined pill "Add food".

> ### SCREEN 4: SERVE MULTIPLE BOTTOM SHEET
>
> Bottom sheet over the dashboard with a drag handle. Title "Serve how many?" Large round number chips: 2, 3, 4, 5, 10. A gradient pill button "CONFIRM".
>
> ### SCREEN 5: SETTINGS SHEET
>
> Clean list sheet on Paper \#F9F9FE with large rows and icons: Add food (Restock), Fix a count (Adjust), Tap Lock, Sound, Vibration, Change logo, Event info, End service, Reset (shown last in a quiet red outline with the text "Hold to reset").
>
> ### SCREEN 6: END-OF-SERVICE SUMMARY
>
> Gradient header with the round logo (72 px), event name, station, time range. Three neat cards, one per category, each showing Starting, Restocked, Served, Left with a thin progress bar. Two pill buttons: "Copy summary" and "Download CSV". A bold gradient pill "START NEW EVENT".
>
> ### SCREEN 7: FIRST-RUN INSTALL GUIDE
>
> A friendly card with two tabs: Android and iPhone. Three short numbered steps each with a simple icon, explaining Add to Home Screen. A green "Ready offline" chip at the top. Title: "Install once, use anywhere".
>
> ### DO NOT

- Do not use red anywhere on the serving dashboard except the CRITICAL state.

- No stock photos, no clutter, no tiny text. Minimum body text 16 px, numerals as large as the space allows.

- Keep spacing generous and layout symmetrical. Make every number legible from a metre away.

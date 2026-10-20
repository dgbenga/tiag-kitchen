# Architectural Rationale: Sprint 3.5 — Settings Sheet & Admin Restock/Reset

## 1. The High-Stress Kitchen Floor & Destructive Action Defense

In event kitchens:
1. **Accidental Resets are Disastrous**: If a volunteer wipes the tally mid-service, hundreds of meal counts are lost, causing chaos in supply planning. Therefore:
   - Reset is nested inside the Settings sheet (never exposed on the primary dashboard).
   - Reset requires a continuous **2.0-second hold** with linear feedback fill.
   - If a Lead PIN was defined, the PIN must be verified.
   - **Automated Snapshot**: Even if confirmed, the app creates an immutable snapshot in IndexedDB `snapshots` store before clearing active storage. A kitchen lead can recover the exact lost session with zero data loss.
2. **Restock Math Integrity**: When additional warmers arrive from the preparation kitchen (e.g. 50 extra plates), treating them simply as "more portions left" without tracking `restocked` would corrupt the threshold calculations ($T = \text{initial} + \text{restocked}$) and reporting. Restock updates both `left` and `restocked` simultaneously.
3. **Audit Trail for Adjustments**: When volunteers count the remaining physical pans and find a discrepancy, "Adjust" logs the exact delta into `adjusted` without corrupting `served` counts.
4. **Grease Shield (Tap Lock)**: Cleaning a tablet screen or carrying it across the kitchen line with food-greased fingers often causes phantom touches. Tap Lock provides a temporary modal shield that requires a 1-second deliberate hold to release.

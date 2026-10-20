# Architectural Rationale: Sprint 3.6 — Summary Screen & Dual-Persistence Sync

## 1. End-of-Service Accounting & Administrative Auditing

When a multi-hour dinner or camp meeting service concludes, kitchen leads must report exact figures to conference organizers:
1. **The Arithmetic Invariant**:
   Every portion must be accounted for:
   $$\text{Remaining} = \text{Initial} + \text{Restocked} + \text{Adjusted} - \text{Served}$$
   Discrepancies indicate unrecorded portions or theft/loss. The summary table clearly presents each factor.
2. **Offline-First Delivery Modes**:
   - **Text Clipboard**: In event dining tents, leads immediately copy the summary and paste it directly into a WhatsApp, Telegram, or SMS group with executive pastors.
   - **CSV Export**: Kitchen supervisors download the CSV to open in Excel or Google Sheets for multi-station roll-up and grocery re-ordering for the next day's meal.
   - Neither mechanism requires internet connectivity; everything is generated locally in the browser via Blobs and Clipboard APIs.

## 2. Dual-Persistence Synchronization Topology

1. **Synchronous Immediate Write (`localStorage`)**:
   Guarantees zero latency on taps ($<50$ms budget). Even if the phone battery dies or the process is killed instantly, the last tap was committed synchronously before the function returned.
2. **Asynchronous Durability Mirror (`IndexedDB`)**:
   Provides structured storage, large capacity for logo media blobs, and immutable session snapshots.
3. **Monotonic Sequence Reconciliation (`seq`)**:
   On every cold reboot, the app reads both `localStorage` and `IndexedDB`. If an IndexedDB transaction finished with a higher sequence number than `localStorage` (or vice-versa due to a crash during write), the state with the highest sequence number always wins.

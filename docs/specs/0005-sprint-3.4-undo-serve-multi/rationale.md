# Architectural Rationale: Sprint 3.4 — 30-Step Undo Stack & Serve Multiple Sheet

## 1. Volunteer Workflow: The Bulk Serving Dilemma

During event dining line rushes, servers frequently encounter attendees requesting multiple plates (e.g. parents carrying food for young children or volunteers fetching plates for an AV booth).
- **The Problem with Rapid Taps**: Tapping a single counter 5 times in rapid succession under queue pressure risks double-counting or missing taps due to thumb jitter and greasy fingers.
- **The Solution (Serve Multiple)**: A dedicated 2-step bottom sheet allows dispatching `[ 2 ]`, `[ 3 ]`, `[ 4 ]`, `[ 5 ]`, or `[ 10 ]` plates in a single atomic transaction with visual confirmation.
- **Category Flexibility**: Direct "× N" triggers on the secondary cards (Workers, Pastors) pre-filter to that attendee group, eliminating extra navigation steps.

## 2. 30-Step Reverse Chronological Named Undo

- **Failure Signature**: In the heat of kitchen line operations, a volunteer accidentally taps the wrong button or double-dispatches a bulk order. If the Undo button merely says "Undo", the volunteer cannot be certain which category will be affected.
- **Named Action Clarity**: By binding the target category and delta into the button label (e.g. `Undo: Participants -5`), the server has immediate cognitive confidence in what the rollback will execute.
- **Bounded Memory Footprint**: A 30-step cap guarantees zero unbounded memory growth and allows the history to be serialized synchronously into `localStorage` (<4KB payload) without degrading the 50ms tap performance budget.

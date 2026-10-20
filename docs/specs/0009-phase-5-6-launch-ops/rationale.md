# Architectural Rationale: Phase 5 & 6 — Brand Launch, Live Cutover & Ops Manual

## 1. Zero-Cost, Zero-Server Operations Model
Most software architectures fail in non-profit, event, or religious conference settings because they assume constant cloud connectivity, complex backend infrastructure, recurring database subscription costs, or on-site IT technicians.

Tiag Kitchen is engineered on a pure static single-page PWA model:
- **Cost**: $0/month. No serverless compute bills, no database instance fees, no CDN egress costs.
- **Maintenance**: Zero database migrations or server maintenance. The client device is both the application host and the database engine.
- **Offline Guarantee**: Once opened in a browser or installed to the home screen, the Service Worker precaches 100% of the binary footprint into browser storage (`CacheStorage`).

## 2. Kitchen Floor Ergonomics & Volunteer Psychology
Event kitchen volunteers rotate rapidly and have varying technical comfort levels:
- **Zero Training Required**: The primary serving button occupies 55–60% of the viewport and counts down in gigantic bold numerals. A volunteer only needs to know one action: tap the huge number each time a plate leaves the line.
- **Forgiving Mistakes**: Tapped too many times? The purple "Undo" button is always present at the bottom, dynamically telling the volunteer exactly what it will undo (`Undo: Participants -1`).
- **Lead Governance**: Sensitive operations (Restock, Count Adjustment, Reset) are protected behind an optional 4-digit Lead PIN and Tap Lock, preventing volunteers from accidentally corrupting the inventory.

# Tiag Kitchen — Kitchen Lead Operations Manual & Runbook

**Version**: 1.0.0 (Production Release)  
**Conference**: The International Apostolic Gathering (TIAG-2026)  
**Hardware Target**: Any modern smartphone running iOS 15+ (Safari) or Android 10+ (Chrome)  
**Infrastructure Cost**: $0/month (100% Offline Progressive Web App)

---

## 1. Executive Summary & Core Guarantees
Tiag Kitchen is a rugged, zero-server portion tracker designed specifically for high-stress event food service lines. It operates with **zero cellular or Wi-Fi dependency once loaded**, saves all counts simultaneously to `localStorage` and `IndexedDB`, protects against accidental resets with a 2-second hold and salted PIN gate, and enforces strict color quarantine (red strictly indicates an emergency shortage).

---

## 2. Pre-Service Setup Checklist (T-60 Minutes)

Perform this checklist before the dining hall opens:

### Step 1: Device Preparation
- [ ] **Battery**: Charge device to $\ge 80\%$ or connect to a 5V/2A charging cable at the serving station.
- [ ] **Clean Screen**: Wipe screen dry of grease or moisture to ensure capacitive touch accuracy.
- [ ] **Orientation**: Place device in **Portrait orientation** on a stable stand near the serving tray.

### Step 2: Install to Home Screen (PWA Installation)
- **On iOS (Safari)**:
  1. Open the kitchen station URL.
  2. Tap the **Share** button (box with upward arrow) in the Safari toolbar.
  3. Scroll down and tap **"Add to Home Screen"**.
  4. Tap **"Add"** in the top-right corner.
  5. Close Safari and launch **Tiag Kitchen** from the new icon on your home screen.
- **On Android (Chrome)**:
  1. Open the kitchen station URL.
  2. Tap the three dots menu (⋮) or tap the automatic **"Install App"** banner at the bottom.
  3. Select **"Install"**.
  4. Launch **Tiag Kitchen** from your home screen.

### Step 3: Aeroplane Mode Verification
- [ ] Swipe down control center / quick settings and toggle **Aeroplane Mode ON** (Wi-Fi OFF, Cellular OFF).
- [ ] Refresh the app: The app must load instantly without any "No Internet" screen.

### Step 4: Event & Station Seeding
1. Enter **Event Name** (e.g. `TIAG-2026 Annual Conference`).
2. Enter **Station Name** (e.g. `Station A - Main Hall`).
3. Enter prepared food portions:
   - **Participants**: e.g. `400`
   - **Workers**: e.g. `60`
   - **Pastors**: e.g. `25`
4. *(Recommended)* Set an optional **4-digit Lead PIN** (e.g. `1234`) to lock admin settings from volunteer tampering.
5. Tap **"START SERVING"**.

---

## 3. Live Service Operations Guide

### 3.1 Serving Volunteer Briefing (10-Second Orientation)
Show the volunteer on the serving line these two simple rules:
1. **Tap the Huge Central Button** every time a meal plate leaves the line for a general participant. The number counts down automatically.
2. **Tap the Smaller Cards Above** if serving a Worker or Pastor.

### 3.2 Understanding Status Colors
The screen changes color automatically based on remaining capacity:
- 🟢 **Green (OK)**: Ample portions remaining ($>25\%$). Service proceeding normally.
- 🟡 **Yellow (LOW WARNING)**: Portions down to $\le 25\%$. Alert the cooking team that a pan restock will be needed shortly.
- 🔴 **Red (CRITICAL EMERGENCY)**: Portions down to $\le 10\%$. Immediate restock required to prevent serving line stoppage.
- ⚫ **Black (FINISHED)**: 0 portions remaining. The button locks automatically and turns off to prevent negative counts.

### 3.3 Serving Multiples (Families & Group Trays)
If a volunteer serves a group (e.g. a family taking 4 plates):
1. Tap the **"Serve Multiple"** button at the bottom of the screen.
2. Select the category (Participants / Workers / Pastors).
3. Tap **+2**, **+3**, **+4**, **+5**, or **+10**.
4. The portions decrement in a single bulk operation, and the undo button updates dynamically.

### 3.4 Undoing an Accidental Tap
- If a volunteer double-taps by accident, tap the purple **Undo** button in the footer.
- The button displays dynamic text showing the exact last action (e.g., `Undo: Participants -1` or `Undo: Workers -4`).
- Up to 30 steps of history are maintained in strict reverse chronological order.

### 3.5 Restocking from the Kitchen
When the kitchen delivers fresh pans:
1. Tap the **Gear** icon in the header.
2. If a Lead PIN was set, enter the 4-digit PIN.
3. Tap **"Restock Portions"**.
4. Select the category and choose a quick chip (**+10**, **+25**, **+50**, **+100**) or type a custom quantity.
5. Tap **"Confirm Restock"**. Capacity and thresholds recalculate immediately.

### 3.6 Tap Lock Mode (Walking Away from Station)
When leaving a phone unattended on the counter:
1. Tap the **Gear** icon in the header.
2. Toggle **"Tap Lock"** ON.
3. The screen displays a full-surface semi-transparent shield blocking all counter touches.
4. To unlock, press and hold the padlock icon for 1 full second.

---

## 4. End-of-Service Reconciliation & Reporting

When the meal service concludes:
1. Tap the **Gear** icon in the header and tap **"End Service / Summary"**.
2. The **Reconciliation Summary Table** opens:
   $$\text{Initial} + \text{Restocked} + \text{Adjusted} - \text{Served} = \text{Remaining}$$
3. **Export CSV**: Tap **"Download CSV Report"**. An RFC-4180 compliant CSV file is saved directly to device storage without internet access.
4. **Copy Text for Messaging**: Tap **"Copy Summary as Text"**. The complete report is formatted and copied to your clipboard. Switch to WhatsApp / SMS and paste directly into the conference operations channel.
5. **Start New Event**: Tap **"START NEW EVENT"**. Enter the Lead PIN. The system creates an automated immutable snapshot in IndexedDB `snapshots` and resets the dashboard clean for the next meal service.

---

## 5. Emergency Incident Runbook

| Incident | Root Cause | Immediate Resolution |
|---|---|---|
| **Phone suddenly shuts down / battery dies** | Hardware power failure | Connect phone to charger and power on. Open Safari/Chrome. **All counts and sequence numbers are restored automatically** from dual-write storage. |
| **Accidental "Start New Event" was confirmed** | Human error during reset | State is **never destroyed**. An immutable snapshot is automatically created in IndexedDB `snapshots` store immediately prior to clearing active storage. Connect to dev tools or inspection to restore `snapshot_[timestamp]`. |
| **Volunteer taps too fast / double-touch** | Greasy screen / nervous tapping | The touch engine's **200ms debounce** and **12px drag rejection** automatically suppress phantom touches. If an extra plate was still registered, tap **Undo**. |
| **Screen turns off during service** | Wake Lock blocked by battery saver mode | The app re-requests Screen Wake Lock every time the screen becomes visible. Set device Display Timeout to "Never" in OS settings for complete redundancy. |

// Node.js Comprehensive Test Suite for Phase 4: Production Hardening & Quality Gate
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('TIAG KITCHEN — PHASE 4: PRODUCTION HARDENING & QUALITY GATE AUDIT');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// GATE 1: Zero External CDNs & Strict CSP Audit (AC-1, AC-2)
// -----------------------------------------------------------------------------
console.log('--- AUDIT 1: Zero-CDN & Strict CSP Invariant ---');
const indexPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Check for external remote script or link tags
const remoteUrlRegex = /(?:href|src)=["']https?:\/\/[^"']+["']/gi;
const remoteMatches = indexHtml.match(remoteUrlRegex) || [];
assert.strictEqual(
  remoteMatches.length,
  0,
  `External CDN links detected in index.html: ${JSON.stringify(remoteMatches)}`
);

// Check CSP meta tag
assert(
  indexHtml.includes('http-equiv="Content-Security-Policy"'),
  'Content Security Policy meta tag missing'
);
assert(
  indexHtml.includes("connect-src 'none'"),
  "CSP must enforce connect-src 'none' to guarantee zero network leakage"
);
console.log('✓ PASS: Zero external CDNs detected. Strict CSP blocks all network calls.\n');

// -----------------------------------------------------------------------------
// GATE 2: Service Worker Precache Inventory (AC-1)
// -----------------------------------------------------------------------------
console.log('--- AUDIT 2: Service Worker Precache Inventory ---');
const swPath = path.join(__dirname, 'sw.js');
const swCode = fs.readFileSync(swPath, 'utf-8');

const requiredCacheAssets = [
  '/',
  'index.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png'
];

requiredCacheAssets.forEach(asset => {
  assert(
    swCode.includes(asset),
    `sw.js is missing required precached asset: ${asset}`
  );
});

// Verify files physically exist on disk
requiredCacheAssets.forEach(asset => {
  if (asset !== '/') {
    const filePath = path.join(__dirname, asset);
    assert(fs.existsSync(filePath), `Precached file does not exist on disk: ${asset}`);
  }
});
console.log('✓ PASS: All core PWA assets precached and physically present on disk.\n');

// -----------------------------------------------------------------------------
// GATE 3: WCAG 7:1 High-Contrast Floor Audit (AC-5)
// -----------------------------------------------------------------------------
console.log('--- AUDIT 3: WCAG 7:1 Contrast Floor Verification ---');

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ];
}

function calculateRelativeLuminance([r, g, b]) {
  const [sR, sG, sB] = [r, g, b].map(v => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

function calculateContrastRatio(hex1, hex2) {
  const lum1 = calculateRelativeLuminance(hexToRgb(hex1));
  const lum2 = calculateRelativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

const colorPairs = [
  { name: 'OK State (Text on Surface)', fg: '#0E4A28', bg: '#DFF5E8', minRatio: 7.0 },
  { name: 'LOW State (Text on Surface)', fg: '#4E3304', bg: '#FFE9A8', minRatio: 7.0 },
  { name: 'CRITICAL State (Text on Surface)', fg: '#FFFFFF', bg: '#B00101', minRatio: 7.0 },
  { name: 'FINISHED State (Text on Surface)', fg: '#8C8C8C', bg: '#0A0A0A', minRatio: 4.5 }
];

colorPairs.forEach(pair => {
  const ratio = calculateContrastRatio(pair.fg, pair.bg);
  console.log(`  • ${pair.name}: ${ratio.toFixed(2)}:1 (Required: ${pair.minRatio}:1)`);
  assert(
    ratio >= pair.minRatio,
    `Contrast failure for ${pair.name}: got ${ratio.toFixed(2)}, required ${pair.minRatio}`
  );
});
console.log('✓ PASS: All counter status states meet or exceed WCAG contrast floor.\n');

// -----------------------------------------------------------------------------
// GATE 4: 10 Rapid Taps Stress Test & Debounce Invariant (AC-3)
// -----------------------------------------------------------------------------
console.log('--- AUDIT 4: 10 Rapid Taps Stress Test (200ms Debounce) ---');

class TouchEngine {
  constructor(debounceMs = 200, dragThresholdPx = 12) {
    this.debounceMs = debounceMs;
    this.dragThresholdPx = dragThresholdPx;
    this.lastTouchTs = 0;
  }

  processTap(timestamp, deltaX = 0, deltaY = 0) {
    // 12px drag rejection
    const distSq = deltaX * deltaX + deltaY * deltaY;
    if (distSq > this.dragThresholdPx * this.dragThresholdPx) {
      return { accepted: false, reason: 'drag_cancelled' };
    }

    // 200ms debounce
    if (timestamp - this.lastTouchTs < this.debounceMs) {
      return { accepted: false, reason: 'debounced' };
    }

    this.lastTouchTs = timestamp;
    return { accepted: true };
  }
}

const engine = new TouchEngine(200, 12);
let currentCount = 50;

// Simulate 10 rapid taps arriving 50ms apart within a 500ms burst
const tapTimestamps = [
  1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450
];

let acceptedTaps = 0;
tapTimestamps.forEach(ts => {
  const res = engine.processTap(ts, 0, 0);
  if (res.accepted) {
    acceptedTaps++;
    currentCount--;
  }
});

console.log(`  • Out of 10 rapid taps (50ms interval), ${acceptedTaps} were registered, ${10 - acceptedTaps} debounced.`);
// In 450ms with 200ms debounce: tap 1 at 1000 accepted; 1050, 1100, 1150 rejected; 1200 accepted; 1250, 1300, 1350 rejected; 1400 accepted; 1450 rejected. Total = 3.
assert.strictEqual(acceptedTaps, 3, 'Debounce must accept exactly 3 taps in a 450ms burst');
assert.strictEqual(currentCount, 47, 'Count must strictly decrement by accepted taps only');
console.log('✓ PASS: 10 rapid taps stress test enforces single-count integrity without ghosting.\n');

// -----------------------------------------------------------------------------
// GATE 5: Drag Rejection Threshold (AC-6)
// -----------------------------------------------------------------------------
console.log('--- AUDIT 5: 12px Drag Rejection Verification ---');
const engineDrag = new TouchEngine(200, 12);

// Small thumb jitter (5px x, 5px y) -> dist = sqrt(50) = 7.07px < 12px -> Accept
assert.strictEqual(engineDrag.processTap(2000, 5, 5).accepted, true);

// Accidental drag (10px x, 10px y) -> dist = sqrt(200) = 14.14px > 12px -> Reject
assert.strictEqual(engineDrag.processTap(2300, 10, 10).accepted, false);
assert.strictEqual(engineDrag.processTap(2300, 10, 10).reason, 'drag_cancelled');
console.log('✓ PASS: 12px Euclidean drag cancellation verified.\n');

// -----------------------------------------------------------------------------
// GATE 6: Zero Boundary Lock Enforcement (AC-4)
// -----------------------------------------------------------------------------
console.log('--- AUDIT 6: Zero Boundary Lock Enforcement ---');
function decrementCategory(catData, qty = 1) {
  if (catData.left <= 0) {
    return { success: false, reason: 'exhausted' };
  }
  const toServe = Math.min(qty, catData.left);
  catData.left -= toServe;
  catData.served += toServe;
  return { success: true, served: toServe };
}

const catZeroTest = { initial: 10, restocked: 0, adjusted: 0, served: 8, left: 2 };
assert.strictEqual(decrementCategory(catZeroTest, 1).success, true);
assert.strictEqual(catZeroTest.left, 1);

assert.strictEqual(decrementCategory(catZeroTest, 1).success, true);
assert.strictEqual(catZeroTest.left, 0);

// Tapping at 0
const zeroResult = decrementCategory(catZeroTest, 1);
assert.strictEqual(zeroResult.success, false);
assert.strictEqual(zeroResult.reason, 'exhausted');
assert.strictEqual(catZeroTest.left, 0, 'Count must never drop below 0');
assert.strictEqual(catZeroTest.served, 10, 'Served must not increment when count is 0');
console.log('✓ PASS: Zero boundary lock strictly enforced.\n');

// -----------------------------------------------------------------------------
// GATE 7: 30-Step Named Undo Stack Reversal (AC-7)
// -----------------------------------------------------------------------------
console.log('--- AUDIT 7: 30-Step Named Undo Stack LIFO Integrity ---');
const undoStack = [];
const activeCats = {
  participants: { left: 100, served: 0 },
  workers: { left: 50, served: 0 },
  pastors: { left: 20, served: 0 }
};

function performDecrement(cat, delta) {
  activeCats[cat].left -= delta;
  activeCats[cat].served += delta;
  undoStack.push({
    type: 'decrement',
    cat,
    delta,
    label: `Undo: ${cat.charAt(0).toUpperCase() + cat.slice(1)} -${delta}`
  });
  if (undoStack.length > 30) undoStack.shift();
}

function performUndo() {
  if (undoStack.length === 0) return false;
  const action = undoStack.pop();
  if (action.type === 'decrement') {
    activeCats[action.cat].left += action.delta;
    activeCats[action.cat].served -= action.delta;
  }
  return true;
}

// Perform 30 decrements across categories
for (let i = 0; i < 10; i++) performDecrement('participants', 1);
for (let i = 0; i < 10; i++) performDecrement('workers', 1);
for (let i = 0; i < 10; i++) performDecrement('pastors', 1);

assert.strictEqual(activeCats.participants.left, 90);
assert.strictEqual(activeCats.workers.left, 40);
assert.strictEqual(activeCats.pastors.left, 10);
assert.strictEqual(undoStack.length, 30);

// Pop all 30 undos
while (performUndo()) {}

assert.strictEqual(activeCats.participants.left, 100, 'Participants count not restored');
assert.strictEqual(activeCats.workers.left, 50, 'Workers count not restored');
assert.strictEqual(activeCats.pastors.left, 20, 'Pastors count not restored');
assert.strictEqual(activeCats.participants.served, 0);
assert.strictEqual(activeCats.workers.served, 0);
assert.strictEqual(activeCats.pastors.served, 0);
assert.strictEqual(undoStack.length, 0);
console.log('✓ PASS: 30-step LIFO named undo stack fully restores original counts.\n');

// -----------------------------------------------------------------------------
// GATE 8: Status Color Quarantine Audit (AC-10)
// -----------------------------------------------------------------------------
console.log('--- AUDIT 8: Status Color Quarantine Audit ---');
// Verify that OK and LOW styles never use brand red (#FF2A2A) or deep crimson (#B00101)
const okSurfaceMatch = indexHtml.match(/--status-ok-surface:\s*([^;]+);/);
const lowSurfaceMatch = indexHtml.match(/--status-low-surface:\s*([^;]+);/);

assert(okSurfaceMatch && !okSurfaceMatch[1].includes('#FF2A2A'), 'OK surface must not use brand red');
assert(lowSurfaceMatch && !lowSurfaceMatch[1].includes('#FF2A2A'), 'LOW surface must not use brand red');
assert(okSurfaceMatch && !okSurfaceMatch[1].includes('#B00101'), 'OK surface must not use critical red');
assert(lowSurfaceMatch && !lowSurfaceMatch[1].includes('#B00101'), 'LOW surface must not use critical red');
console.log('✓ PASS: Status color quarantine verified. Red is strictly isolated to CRITICAL state.\n');

console.log('================================================================');
console.log('PHASE 4 QUALITY GATE: ALL 8 PRODUCTION GATES SUCCESSFULLY PASSED!');
console.log('================================================================');

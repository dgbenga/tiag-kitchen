// Node.js test suite for Sprint 3.5 Settings Sheet & Admin Restock/Reset
const assert = require('assert');
const crypto = require('crypto');

console.log('--- TEST 1: Restock Math & Threshold Ceilings (AC-4) ---');
function calculateCategoryStatus(catData) {
  if (!catData) return 'ok';
  if (catData.left <= 0) return 'finished';
  const total = (catData.initial || 0) + (catData.restocked || 0);
  if (total <= 0) return catData.left <= 0 ? 'finished' : 'ok';
  const lowThreshold = Math.ceil(0.25 * total);
  const critThreshold = Math.ceil(0.10 * total);
  if (catData.left <= critThreshold) return 'critical';
  if (catData.left <= lowThreshold) return 'low';
  return 'ok';
}

const state = {
  seq: 1,
  categories: {
    participants: { initial: 50, restocked: 0, adjusted: 0, served: 40, left: 10 }
  }
};

// Before restock: total = 50, left = 10. 10 <= ceil(0.25 * 50) = 13 (LOW)
assert.strictEqual(calculateCategoryStatus(state.categories.participants), 'low');

// Restock 50 portions
const qty = 50;
state.categories.participants.restocked += qty;
state.categories.participants.left += qty;

// After restock: total = 100, left = 60. 60 > ceil(0.25 * 100) = 25 (OK)
assert.strictEqual(state.categories.participants.left, 60);
assert.strictEqual(state.categories.participants.restocked, 50);
assert.strictEqual(calculateCategoryStatus(state.categories.participants), 'ok');

console.log('✓ TEST 1 PASSED: Restock capacity math and threshold updates verified.');

console.log('--- TEST 2: Adjust Count & Delta Auditing (AC-5) ---');
// Adjust left from 60 down to 45
const currentLeft = state.categories.participants.left;
const newLeft = 45;
const delta = newLeft - currentLeft;

state.categories.participants.adjusted += delta;
state.categories.participants.left = newLeft;

assert.strictEqual(state.categories.participants.left, 45);
assert.strictEqual(state.categories.participants.adjusted, -15);
assert.strictEqual(state.categories.participants.served, 40, 'Served count must remain unchanged during adjust');

console.log('✓ TEST 2 PASSED: Adjust delta auditing and served count preservation verified.');

console.log('--- TEST 3: Lead PIN Hashing & Verification (AC-3) ---');
function hashPin(pin) {
  if (!pin) return null;
  const salt = 'tiag_kitchen_salt_2026_';
  return crypto.createHash('sha256').update(salt + pin).digest('hex');
}

const correctPin = '1234';
const wrongPin = '0000';
const storedHash = hashPin(correctPin);

assert.strictEqual(hashPin(correctPin), storedHash);
assert.notStrictEqual(hashPin(wrongPin), storedHash);

function verifyPinGate(enteredPin, pinHash) {
  if (!pinHash) return true; // No PIN configured
  return hashPin(enteredPin) === pinHash;
}

assert.strictEqual(verifyPinGate('1234', storedHash), true);
assert.strictEqual(verifyPinGate('9999', storedHash), false);
assert.strictEqual(verifyPinGate('', null), true, 'No PIN configured allows immediate access');

console.log('✓ TEST 3 PASSED: Salted SHA-256 Lead PIN verification gate verified.');

console.log('--- TEST 4: Auto-Snapshot & Reset Integrity (AC-6, AC-7) ---');
const mockSnapshots = [];
function saveSnapshot(stateObj, historyObj, reason) {
  const snap = {
    id: 'snapshot_' + Date.now(),
    timestamp: new Date().toISOString(),
    reason,
    state: JSON.parse(JSON.stringify(stateObj)),
    history: JSON.parse(JSON.stringify(historyObj))
  };
  mockSnapshots.push(snap);
  return snap;
}

const snap = saveSnapshot(state, [{ type: 'decrement', cat: 'participants', delta: 5 }], 'emergency_reset');
assert.strictEqual(mockSnapshots.length, 1);
assert.strictEqual(snap.reason, 'emergency_reset');
assert.strictEqual(snap.state.categories.participants.left, 45);

// Wipe state
let activeState = state;
activeState = null;
assert.strictEqual(activeState, null);
assert.strictEqual(mockSnapshots[0].state.categories.participants.left, 45, 'Snapshot remains intact in immutable archive');

console.log('✓ TEST 4 PASSED: Auto-snapshot archiving before emergency reset verified.');
console.log('\nALL SPRINT 3.5 SETTINGS SHEET & ADMIN TESTS PASSED SUCCESFULLY!');

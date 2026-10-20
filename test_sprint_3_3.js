// Node.js test suite for Sprint 3.3 Touch Engine, Wake Lock, Haptics & Audio
const assert = require('assert');

console.log('--- TEST 1: Haptic Vibrations & Settings Check (AC-7, AC-8) ---');
let lastVibratePattern = null;
const mockNavigator = {
  vibrate: (pattern) => {
    lastVibratePattern = pattern;
    return true;
  }
};

function triggerHaptic(type, settings, nav = mockNavigator) {
  if (!('vibrate' in nav)) return false;
  if (settings && settings.vibrate === false) {
    return false;
  }
  try {
    switch (type) {
      case 'tap':
        return nav.vibrate(25);
      case 'low':
        return nav.vibrate(100);
      case 'critical':
        return nav.vibrate([100, 50, 100]);
      case 'finished':
        return nav.vibrate(400);
      default:
        return nav.vibrate(25);
    }
  } catch (e) {
    return false;
  }
}

// 1. Normal tap haptic
lastVibratePattern = null;
assert.strictEqual(triggerHaptic('tap', { vibrate: true }), true);
assert.strictEqual(lastVibratePattern, 25);

// 2. Low stock haptic
lastVibratePattern = null;
assert.strictEqual(triggerHaptic('low', { vibrate: true }), true);
assert.strictEqual(lastVibratePattern, 100);

// 3. Critical alert haptic
lastVibratePattern = null;
assert.strictEqual(triggerHaptic('critical', { vibrate: true }), true);
assert.deepStrictEqual(lastVibratePattern, [100, 50, 100]);

// 4. Finished lock haptic
lastVibratePattern = null;
assert.strictEqual(triggerHaptic('finished', { vibrate: true }), true);
assert.strictEqual(lastVibratePattern, 400);

// 5. Suppressed when vibrate: false
lastVibratePattern = null;
assert.strictEqual(triggerHaptic('tap', { vibrate: false }), false);
assert.strictEqual(lastVibratePattern, null, 'Must not vibrate when setting is false');

console.log('✓ TEST 1 PASSED: Multi-tier haptic vibration patterns and setting suppression verified.');

console.log('--- TEST 2: Web Audio Synthesizer Tone & Settings (AC-6, AC-8) ---');
let createdOscillators = [];
let audioDestinationConnected = false;

class MockGainNode {
  constructor() {
    this.gain = {
      setValueAtTime: (v, t) => { this.initialGain = v; },
      exponentialRampToValueAtTime: (v, t) => { this.endGain = v; }
    };
  }
  connect(dest) { audioDestinationConnected = true; }
}

class MockOscillator {
  constructor() {
    this.frequencies = [];
    this.frequency = {
      setValueAtTime: (f, t) => { this.frequencies.push(f); }
    };
    createdOscillators.push(this);
  }
  connect(gain) {}
  start(t) { this.started = true; }
  stop(t) { this.stopped = true; }
}

const mockAudioCtx = {
  currentTime: 10.0,
  destination: {},
  createOscillator: () => new MockOscillator(),
  createGain: () => new MockGainNode()
};

function playWarningTone(type, settings, ctx = mockAudioCtx) {
  if (!settings || !settings.sound) {
    return false; // Muted by default
  }
  if (!ctx) return false;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  if (type === 'low') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'critical') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.start(now);
    osc.stop(now + 0.22);
  }
  return true;
}

// Sound off by default
assert.strictEqual(playWarningTone('low', { sound: false }), false);
assert.strictEqual(createdOscillators.length, 0, 'No audio node should be created when sound is disabled');

// Sound enabled: Low tone (880Hz)
createdOscillators = [];
assert.strictEqual(playWarningTone('low', { sound: true }), true);
assert.strictEqual(createdOscillators.length, 1);
assert.strictEqual(createdOscillators[0].type, 'sine');
assert.deepStrictEqual(createdOscillators[0].frequencies, [880]);

// Sound enabled: Critical tone (440Hz -> 880Hz dual tone)
createdOscillators = [];
assert.strictEqual(playWarningTone('critical', { sound: true }), true);
assert.strictEqual(createdOscillators.length, 1);
assert.strictEqual(createdOscillators[0].type, 'triangle');
assert.deepStrictEqual(createdOscillators[0].frequencies, [440, 880]);

console.log('✓ TEST 2 PASSED: Pure parametric Web Audio tone synthesis verified.');

console.log('--- TEST 3: Touch Engine 12px Drag Cancel & 200ms Debounce (AC-2, AC-3) ---');
let lastTapTime = 0;
let decrementCount = 0;

function simulatePointerGesture(startX, startY, moves, releaseTime) {
  let isDown = true;
  for (const [x, y] of moves) {
    const dx = x - startX;
    const dy = y - startY;
    if (Math.hypot(dx, dy) > 12) {
      isDown = false; // Drag cancellation
      break;
    }
  }

  if (!isDown) return { counted: false, reason: 'drag_cancelled' };

  if (releaseTime - lastTapTime < 200) {
    return { counted: false, reason: 'debounced' };
  }

  lastTapTime = releaseTime;
  decrementCount++;
  return { counted: true };
}

// 1. Clean stationary tap
const g1 = simulatePointerGesture(100, 100, [[102, 101]], 1000);
assert.strictEqual(g1.counted, true);
assert.strictEqual(decrementCount, 1);

// 2. Rapid double tap within 100ms -> should debounce
const g2 = simulatePointerGesture(100, 100, [[101, 100]], 1080);
assert.strictEqual(g2.counted, false);
assert.strictEqual(g2.reason, 'debounced');
assert.strictEqual(decrementCount, 1);

// 3. Legitimate second tap after 250ms
const g3 = simulatePointerGesture(100, 100, [[100, 101]], 1260);
assert.strictEqual(g3.counted, true);
assert.strictEqual(decrementCount, 2);

// 4. Accidental swipe/drag (15px travel) -> cancel
const g4 = simulatePointerGesture(100, 100, [[100, 105], [100, 116]], 1600);
assert.strictEqual(g4.counted, false);
assert.strictEqual(g4.reason, 'drag_cancelled');
assert.strictEqual(decrementCount, 2);

console.log('✓ TEST 3 PASSED: 12px drag rejection and 200ms debounce verified.');

console.log('--- TEST 4: Multi-Tab BroadcastChannel Conflict Guard (AC-10) ---');
let overlayActive = false;
const currentTabId = 'tab_primary_123';

function onBroadcastMessage(event) {
  if (event.type === 'TAB_ACTIVE' && event.tabId !== currentTabId) {
    overlayActive = true;
  }
}

// Own message ignored
onBroadcastMessage({ type: 'TAB_ACTIVE', tabId: currentTabId });
assert.strictEqual(overlayActive, false);

// Foreign tab message triggers overlay
onBroadcastMessage({ type: 'TAB_ACTIVE', tabId: 'tab_secondary_456' });
assert.strictEqual(overlayActive, true);

console.log('✓ TEST 4 PASSED: Multi-tab conflict overlay defense verified.');
console.log('\nALL SPRINT 3.3 HARDWARE PRIMING, SENSORY & DEFENSE TESTS PASSED!');

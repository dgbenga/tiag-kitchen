// Node.js test suite for Sprint 3.4 30-Step Undo Stack & Serve Multiple
const assert = require('assert');

console.log('--- TEST 1: Bulk Serve Math & Boundary Capping (AC-3, AC-5) ---');
const state = {
  seq: 1,
  categories: {
    participants: { left: 10, served: 0, initial: 10, restocked: 0 },
    workers: { left: 3, served: 2, initial: 5, restocked: 0 },
    pastors: { left: 0, served: 4, initial: 4, restocked: 0 }
  }
};

const undoStack = [];
function pushUndoAction(action) {
  undoStack.push(action);
  if (undoStack.length > 30) undoStack.shift();
}

function getUndoLabel() {
  if (undoStack.length === 0) return 'Undo';
  const lastAction = undoStack[undoStack.length - 1];
  const catMap = { participants: 'Participants', workers: 'Workers', pastors: 'Pastors' };
  const catName = catMap[lastAction.cat] || lastAction.cat;
  return `Undo: ${catName} -${lastAction.delta}`;
}

function bulkServe(catKey, requestedCount) {
  const cat = state.categories[catKey];
  if (!cat || cat.left <= 0) return 0;
  const actualDelta = Math.min(requestedCount, cat.left);
  cat.left -= actualDelta;
  cat.served += actualDelta;
  state.seq++;
  pushUndoAction({
    id: 'dec_' + Date.now(),
    t: Date.now(),
    cat: catKey,
    type: 'decrement',
    delta: actualDelta
  });
  return actualDelta;
}

function performUndo() {
  if (undoStack.length === 0) return null;
  const action = undoStack.pop();
  if (action.type === 'decrement') {
    const cat = state.categories[action.cat];
    cat.left += action.delta;
    cat.served = Math.max(0, cat.served - action.delta);
  }
  state.seq++;
  return action;
}

// 1. Bulk serve 5 Participants
const served1 = bulkServe('participants', 5);
assert.strictEqual(served1, 5);
assert.strictEqual(state.categories.participants.left, 5);
assert.strictEqual(state.categories.participants.served, 5);
assert.strictEqual(getUndoLabel(), 'Undo: Participants -5');

// 2. Bulk serve 5 Workers when only 3 left -> capped at 3
const served2 = bulkServe('workers', 5);
assert.strictEqual(served2, 3);
assert.strictEqual(state.categories.workers.left, 0);
assert.strictEqual(state.categories.workers.served, 5);
assert.strictEqual(getUndoLabel(), 'Undo: Workers -3');

// 3. Bulk serve Pastors when 0 left -> 0 served, no state mutation
const served3 = bulkServe('pastors', 5);
assert.strictEqual(served3, 0);
assert.strictEqual(state.categories.pastors.left, 0);
assert.strictEqual(getUndoLabel(), 'Undo: Workers -3', 'Undo label must not change on zero serve');

console.log('✓ TEST 1 PASSED: Bulk serve capping and dynamic undo labeling verified.');

console.log('--- TEST 2: 30-Step Reverse Chronological Undo (AC-4, AC-5, AC-6) ---');
// Undo the Workers -3 action
const undoWorkers = performUndo();
assert.strictEqual(undoWorkers.cat, 'workers');
assert.strictEqual(undoWorkers.delta, 3);
assert.strictEqual(state.categories.workers.left, 3);
assert.strictEqual(state.categories.workers.served, 2);
assert.strictEqual(getUndoLabel(), 'Undo: Participants -5');

// Undo the Participants -5 action
const undoParticipants = performUndo();
assert.strictEqual(undoParticipants.cat, 'participants');
assert.strictEqual(undoParticipants.delta, 5);
assert.strictEqual(state.categories.participants.left, 10);
assert.strictEqual(state.categories.participants.served, 0);
assert.strictEqual(getUndoLabel(), 'Undo');
assert.strictEqual(undoStack.length, 0);

// Undo when empty returns null
assert.strictEqual(performUndo(), null);

// Test 30 actions capacity
for (let i = 1; i <= 35; i++) {
  pushUndoAction({ cat: 'participants', type: 'decrement', delta: 1 });
}
assert.strictEqual(undoStack.length, 30, 'Stack must cap at 30 items strictly');

console.log('✓ TEST 2 PASSED: Exact undo reversal, empty stack handling, and 30-item cap verified.');
console.log('\nALL SPRINT 3.4 30-STEP UNDO & SERVE MULTIPLE TESTS PASSED SUCCESFULLY!');

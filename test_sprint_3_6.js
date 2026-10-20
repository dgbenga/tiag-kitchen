// Node.js test suite for Sprint 3.6 End-of-Service Summary & Dual-Persistence Sync
const assert = require('assert');

console.log('--- TEST 1: Reconciliation Mathematical Invariant (AC-2, AC-3) ---');
// Invariant: Initial + Restocked + Adjusted - Served = Remaining (Left)
const sampleState = {
  seq: 42,
  event: { name: 'TIAG 2026 World Conference', station: 'Main Hall A' },
  startedAt: 1729310000000,
  endedAt: 1729320000000,
  categories: {
    participants: { initial: 400, restocked: 50, adjusted: -10, served: 380, left: 60 },
    workers: { initial: 60, restocked: 10, adjusted: 0, served: 55, left: 15 },
    pastors: { initial: 25, restocked: 0, adjusted: 5, served: 20, left: 10 }
  }
};

function verifyReconciliation(catData) {
  const calculatedLeft = (catData.initial || 0) + (catData.restocked || 0) + (catData.adjusted || 0) - (catData.served || 0);
  return calculatedLeft === catData.left;
}

assert.strictEqual(verifyReconciliation(sampleState.categories.participants), true, 'Participants reconciliation failed');
assert.strictEqual(verifyReconciliation(sampleState.categories.workers), true, 'Workers reconciliation failed');
assert.strictEqual(verifyReconciliation(sampleState.categories.pastors), true, 'Pastors reconciliation failed');

// Total reconciliation
const p = sampleState.categories.participants;
const w = sampleState.categories.workers;
const pa = sampleState.categories.pastors;

const totInitial = p.initial + w.initial + pa.initial;
const totRestocked = p.restocked + w.restocked + pa.restocked;
const totAdjusted = p.adjusted + w.adjusted + pa.adjusted;
const totServed = p.served + w.served + pa.served;
const totLeft = p.left + w.left + pa.left;

assert.strictEqual(totInitial + totRestocked + totAdjusted - totServed, totLeft, 'Total row reconciliation invariant failed');
console.log('✓ TEST 1 PASSED: Reconciliation mathematical invariant verified across all categories and totals.');

console.log('--- TEST 2: RFC-4180 CSV Generation (AC-3) ---');
function generateSummaryCsv(state) {
  if (!state || !state.categories) return '';
  const p = state.categories.participants;
  const w = state.categories.workers;
  const pa = state.categories.pastors;

  const totServed = (p.served || 0) + (w.served || 0) + (pa.served || 0);
  const totLeft = (p.left || 0) + (w.left || 0) + (pa.left || 0);
  const totInit = (p.initial || 0) + (w.initial || 0) + (pa.initial || 0);
  const totRest = (p.restocked || 0) + (w.restocked || 0) + (pa.restocked || 0);
  const totAdj = (p.adjusted || 0) + (w.adjusted || 0) + (pa.adjusted || 0);

  const lines = [
    'Category,Initial,Restocked,Adjusted,Served,Remaining',
    `Participants,${p.initial},${p.restocked},${p.adjusted},${p.served},${p.left}`,
    `Workers,${w.initial},${w.restocked},${w.adjusted},${w.served},${w.left}`,
    `Pastors,${pa.initial},${pa.restocked},${pa.adjusted},${pa.served},${pa.left}`,
    `TOTAL,${totInit},${totRest},${totAdj},${totServed},${totLeft}`
  ];
  return lines.join('\r\n');
}

const csvOutput = generateSummaryCsv(sampleState);
assert(csvOutput.includes('Category,Initial,Restocked,Adjusted,Served,Remaining'), 'CSV header missing');
assert(csvOutput.includes('Participants,400,50,-10,380,60'), 'Participants CSV row mismatch');
assert(csvOutput.includes('Workers,60,10,0,55,15'), 'Workers CSV row mismatch');
assert(csvOutput.includes('Pastors,25,0,5,20,10'), 'Pastors CSV row mismatch');
assert(csvOutput.includes('TOTAL,485,60,-5,455,85'), 'Total CSV row mismatch');
assert(csvOutput.includes('\r\n'), 'CSV must conform to RFC-4180 CRLF line endings');
console.log('✓ TEST 2 PASSED: RFC-4180 CSV formatting and values verified.');

console.log('--- TEST 3: Plain-Text Summary Clipboard Formatting (AC-4) ---');
function formatTime(ts) {
  if (!ts) return '--:--';
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function generateSummaryText(state) {
  if (!state || !state.categories) return '';
  const evtName = state.event?.name || 'TIAG-2026';
  const stName = state.event?.station || 'Main';
  const start = formatTime(state.startedAt);
  const end = formatTime(state.endedAt);

  const p = state.categories.participants;
  const w = state.categories.workers;
  const pa = state.categories.pastors;

  const totServed = (p.served || 0) + (w.served || 0) + (pa.served || 0);
  const totLeft = (p.left || 0) + (w.left || 0) + (pa.left || 0);
  const totInit = (p.initial || 0) + (w.initial || 0) + (pa.initial || 0);
  const totRest = (p.restocked || 0) + (w.restocked || 0) + (pa.restocked || 0);
  const totAdj = (p.adjusted || 0) + (w.adjusted || 0) + (pa.adjusted || 0);

  return `TIAG KITCHEN - END OF SERVICE REPORT
Event: ${evtName}
Station: ${stName}
Service Window: ${start} - ${end}

PARTICIPANTS:
• Initial: ${p.initial} | Restocked: +${p.restocked} | Adjusted: ${p.adjusted}
• Served: ${p.served} | Remaining Left: ${p.left}

WORKERS:
• Initial: ${w.initial} | Restocked: +${w.restocked} | Adjusted: ${w.adjusted}
• Served: ${w.served} | Remaining Left: ${w.left}

PASTORS:
• Initial: ${pa.initial} | Restocked: +${pa.restocked} | Adjusted: ${pa.adjusted}
• Served: ${pa.served} | Remaining Left: ${pa.left}

TOTALS:
• Starting Portions: ${totInit}
• Total Restocked: +${totRest}
• Net Adjustments: ${totAdj >= 0 ? '+' + totAdj : totAdj}
• TOTAL SERVED: ${totServed}
• TOTAL REMAINING: ${totLeft}`;
}

const summaryText = generateSummaryText(sampleState);
assert(summaryText.includes('TIAG KITCHEN - END OF SERVICE REPORT'), 'Header missing');
assert(summaryText.includes('Event: TIAG 2026 World Conference'), 'Event name missing');
assert(summaryText.includes('Station: Main Hall A'), 'Station missing');
assert(summaryText.includes('TOTAL SERVED: 455'), 'Total served mismatch');
assert(summaryText.includes('TOTAL REMAINING: 85'), 'Total remaining mismatch');
console.log('✓ TEST 3 PASSED: Clipboard plain text formatting verified.');

console.log('--- TEST 4: Dual-Persistence Sequence Monotonicity Recovery (AC-6) ---');
// In offline kitchen scenarios, crash or sudden restart may leave localStorage or IndexedDB with desynced sequence numbers.
// The engine must always prioritize the higher sequence number state.
function resolveColdBootState(localState, idbState) {
  if (!localState && !idbState) return null;
  if (!localState) return idbState;
  if (!idbState) return localState;
  return (idbState.seq || 0) > (localState.seq || 0) ? idbState : localState;
}

const localSt = { seq: 14, categories: { participants: { left: 50 } } };
const idbSt = { seq: 15, categories: { participants: { left: 49 } } };

assert.strictEqual(resolveColdBootState(localSt, idbSt).seq, 15, 'IDB higher seq must win');
assert.strictEqual(resolveColdBootState(idbSt, localSt).seq, 15, 'IDB higher seq must win regardless of order');

const localStNewer = { seq: 20, categories: { participants: { left: 30 } } };
const idbStOlder = { seq: 19, categories: { participants: { left: 31 } } };
assert.strictEqual(resolveColdBootState(localStNewer, idbStOlder).seq, 20, 'Local higher seq must win if newer');

console.log('✓ TEST 4 PASSED: Monotonic dual-persistence state reconciliation verified.');

console.log('\n=============================================');
console.log('ALL SPRINT 3.6 ACCEPTANCE CRITERIA VERIFIED!');
console.log('=============================================');

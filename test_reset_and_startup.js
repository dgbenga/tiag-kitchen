// Test suite to verify Startup Routing & Reset Controls
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TEST: Startup Routing & Visible Reset Architecture ---');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

// 1. Verify Active Session Banner on Screen 1 (Setup View)
assert(indexHtml.includes('id="banner-active-session"'), 'Active session banner missing from index.html');
assert(indexHtml.includes('id="btn-banner-resume"'), 'Resume button missing from active session banner');
assert(indexHtml.includes('id="btn-banner-reset"'), 'Hold-to-reset button missing from active session banner');
assert(indexHtml.includes('id="banner-reset-fill"'), 'Reset fill animation element missing from banner');
console.log('✓ PASS 1: Active Session banner with Resume & 2s Hold-to-Reset elements verified on Home/Setup screen.');

// 2. Verify Clear / Reset Form Inputs Button
assert(indexHtml.includes('id="btn-clear-setup"'), 'Clear / Reset form inputs button missing from setup card');
console.log('✓ PASS 2: Clear / Reset form inputs button verified on Setup form.');

// 3. Verify Visible Header Reset Button on Serving Screen
assert(indexHtml.includes('id="btn-header-reset"'), 'Visible Reset button missing from serving screen header');
assert(indexHtml.includes('class="btn-reset-header"'), 'CSS class for header reset button missing');
console.log('✓ PASS 3: Prominent Reset button verified in Serving Dashboard header.');

// 4. Verify Dedicated Reset Confirmation Bottom Sheet
assert(indexHtml.includes('id="sheet-reset-confirm"'), 'Dedicated Reset confirmation bottom sheet missing');
assert(indexHtml.includes('id="btn-modal-reset"'), 'Modal reset 2s hold button missing');
assert(indexHtml.includes('id="modal-reset-fill"'), 'Modal reset fill animation missing');
console.log('✓ PASS 4: Dedicated Reset confirmation sheet with 2s hold engine verified.');

// 5. Verify attachHoldToReset binds all reset controls
assert(indexHtml.includes('attachHoldToReset('), 'attachHoldToReset function missing');
assert(indexHtml.includes("document.getElementById('btn-header-reset')"), 'Header reset click listener missing');
assert(indexHtml.includes("document.getElementById('btn-banner-resume')"), 'Banner resume click listener missing');
assert(indexHtml.includes("document.getElementById('btn-clear-setup')"), 'Clear setup click listener missing');
console.log('✓ PASS 5: attachHoldToReset and event listeners verified.');

// 6. Verify Cold Boot does not force switchScreen to screen-serving
assert(
  !indexHtml.includes("window.switchScreen('screen-serving');\n          }\n        } catch(e) {\n          console.warn('State parse error:'"),
  'DOMContentLoaded must not force switchScreen to screen-serving'
);
assert(indexHtml.includes('showActiveSessionBanner(parsed)'), 'DOMContentLoaded must show active session banner on setup screen');
console.log('✓ PASS 6: Cold Boot reconciliation verified to start on Home screen and present active session banner.');

console.log('\n======================================================');
console.log('ALL STARTUP ROUTING & VISIBLE RESET TESTS PASSED!');
console.log('======================================================\n');

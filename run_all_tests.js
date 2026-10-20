// Cross-platform test runner for Tiag Kitchen
const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
  'test_sprint_3_2.js',
  'test_sprint_3_3.js',
  'test_sprint_3_4.js',
  'test_sprint_3_5.js',
  'test_sprint_3_6.js',
  'test_reset_and_startup.js',
  'test_phase_4_quality_gate.js'
];

console.log('Running all Tiag Kitchen test suites...\n');

let failed = false;
for (const file of testFiles) {
  const filePath = path.join(__dirname, file);
  try {
    execSync(`node "${filePath}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`\n❌ Test suite failed: ${file}`);
    failed = true;
    break;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('\n=============================================');
  console.log('  ALL SPRINT & QUALITY GATE SUITES PASSED!   ');
  console.log('=============================================\n');
}

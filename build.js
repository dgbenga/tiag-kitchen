const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'sw.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png'
];

filesToCopy.forEach((file) => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${file} -> dist/${file}`);
  } else {
    console.warn(`Warning: ${file} not found.`);
  }
});

console.log('Build complete! Production assets successfully bundled into dist/.');

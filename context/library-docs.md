# Library Docs & Web API Contracts: Tiag Kitchen

## 1. Service Worker & CacheStorage API (W3C Standard)

### Precache & Fetch Handling
```javascript
// sw.js
const CACHE_NAME = 'tiag-kitchen-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './fonts/poppins-500.woff2',
  './fonts/poppins-600.woff2',
  './fonts/poppins-700.woff2',
  './fonts/poppins-800.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  // NOTE: skipWaiting() is deliberately NOT called here to prevent disrupting live sessions
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
```

---

## 2. IndexedDB Dual-Write Storage API

```javascript
// Native IndexedDB helper
const DB_NAME = 'tiag_kitchen_db';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('app_state')) {
        db.createObjectStore('app_state', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('tap_log')) {
        const store = db.createObjectStore('tap_log', { keyPath: 'id' });
        store.createIndex('timestamp', 't', { unique: false });
      }
      if (!db.objectStoreNames.contains('media_blobs')) {
        db.createObjectStore('media_blobs', { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveStateToIDB(state) {
  const db = await openDB();
  const tx = db.transaction(['app_state'], 'readwrite');
  tx.objectStore('app_state').put({ id: 'current', state });
  return tx.complete;
}
```

---

## 3. Screen Wake Lock API

```javascript
let wakeLock = null;

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
      });
    } catch (err) {
      console.warn(`Wake Lock request failed: ${err.name}, ${err.message}`);
    }
  }
}

// Re-request on tab focus
document.addEventListener('visibilitychange', async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
});
```

---

## 4. Web Audio API Tone Synthesizer

```javascript
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playWarningTone(type = 'low') {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  if (type === 'low') {
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'critical') {
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}
```

---

## 5. Web Haptics API

```javascript
function triggerHaptic(type = 'tap') {
  if (!('vibrate' in navigator)) return false;
  try {
    switch (type) {
      case 'tap':
        return navigator.vibrate(30);
      case 'critical':
        return navigator.vibrate([100, 50, 100]);
      case 'finished':
        return navigator.vibrate(400);
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
}
```

---

## 6. Storage Persistence Request

```javascript
async function ensurePersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted) {
      const granted = await navigator.storage.persist();
      console.log(`Persistent storage granted: ${granted}`);
    }
  }
}
```

---

## 7. Multi-Tab Conflict BroadcastChannel

```javascript
const channel = new BroadcastChannel('tiag_kitchen_channel');

channel.postMessage({ type: 'TAB_ACTIVE', id: window.sessionStorage.getItem('tab_id') });

channel.onmessage = (event) => {
  if (event.data.type === 'TAB_ACTIVE') {
    // Secondary tab detected: show warning overlay and enter read-only mode
    document.getElementById('multi-tab-warning').classList.remove('hidden');
  }
};
```

/** 
 * PWA Caching Logic 
 */
const CACHE_NAME = 'money-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

/**
 * Firebase Background Notifications
 */
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB5wwkM9l-rB8Boz7GmTyH7HZsz0_L3pqQ",
  authDomain: "money-d51f3.firebaseapp.com",
  projectId: "money-d51f3",
  storageBucket: "money-d51f3.firebasestorage.app",
  messagingSenderId: "176746639477",
  appId: "1:176746639477:web:d901007c9d02e97127483c",
  measurementId: "G-4QWD701DJR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Always show manual notification to ensure iOS/Safari stability.
  // We use a 'tag' to prevent duplicates: the second one will simply overwrite the first.
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Financial Update';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Your ledger has a new transaction synchronization.',
    icon: '/icon-192.png',
    tag: 'money-updates', // This prevents duplicate alerts!
    vibrate: [100, 50, 100],
    data: {
      url: self.location.origin
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

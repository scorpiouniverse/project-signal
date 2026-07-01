/* ═══════════════════════════════════════════════
   PROJECT SIGNAL — Firebase Messaging Service Worker
   Handles push notifications when the app is closed
   or running in the background.
   
   This file MUST be at the ROOT of your GitHub repo
   (same folder as index.html).
═══════════════════════════════════════════════ */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAivu2qiy2ixfmtVCh-TE1qUcJq1O4rSI0",
  authDomain: "project-signal-a8bf8.firebaseapp.com",
  projectId: "project-signal-a8bf8",
  storageBucket: "project-signal-a8bf8.firebasestorage.app",
  messagingSenderId: "106245402557",
  appId: "1:106245402557:web:8b82062adfeb79dca0acd4"
});

const messaging = firebase.messaging();

/* Background notification handler */
messaging.onBackgroundMessage(function(payload) {
  console.log('Project Signal — background message:', payload);

  const title = (payload.notification && payload.notification.title) || 'Project Signal';
  const body  = (payload.notification && payload.notification.body)  || 'New signal detected.';

  self.registration.showNotification(title, {
    body: body,
    icon: '/icon-192.png',   /* optional — add this image to your repo */
    badge: '/icon-192.png',
    tag: 'project-signal',   /* replaces previous notification instead of stacking */
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'View Signal' }
    ]
  });
});

/* Handle notification click — opens the app */
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      /* If app is already open, focus it */
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ('focus' in client) return client.focus();
      }
      /* Otherwise open a new tab */
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

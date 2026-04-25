/**
 * Broadcast Notification Script
 * 
 * This script sends a push notification to all users who have enabled notifications
 * in the MONEY PWA.
 * 
 * SETUP:
 * This script uses the service account key from `.env.local`.
 * Run: node broadcast-notification.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.error('Error: FIREBASE_SERVICE_ACCOUNT_KEY not found in .env.local');
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (e) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY from .env.local:', e.message);
  process.exit(1);
}

const db = admin.firestore();
const messaging = admin.messaging();

async function broadcastNotification() {
  console.log('Fetching users with notification tokens...');
  
  const usersSnap = await db.collection('users').where('fcmToken', '!=', null).get();
  
  if (usersSnap.empty) {
    console.log('No users found with notification tokens.');
    return;
  }

  const tokens = [];
  usersSnap.forEach(doc => {
    const data = doc.data();
    if (data.fcmToken) {
      tokens.push(data.fcmToken);
    }
  });

  if (tokens.length === 0) {
    console.log('No valid tokens found.');
    return;
  }

  console.log(`Sending notification to ${tokens.length} devices...`);

  // FCM sendEachForMulticast expects an array of messages or a specific multicasting format
  // For simplicity and to avoid size limits (max 500 tokens per multicast), we can send in a loop or use multicast
  
  const message = {
    notification: {
      title: '📱 Find People Fast',
      body: 'New Update: You can now pick people directly from your phone\'s contacts when tracking money!'
    },
    tokens: tokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    console.log(`Successfully sent ${response.successCount} messages.`);
    if (response.failureCount > 0) {
      console.log(`${response.failureCount} messages failed.`);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

broadcastNotification();

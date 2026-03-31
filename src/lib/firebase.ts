import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Next.js handles server variables automatically via .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics: unknown = null;
if (typeof window !== "undefined") {
  isSupported().then(yes => yes ? analytics = getAnalytics(app) : null);
}
export { analytics };

export const requestForToken = async () => {
  if (typeof window === "undefined") return null;
  
  if (!("Notification" in window)) {
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    // Show instant welcome notification
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Welcome", {
          body: "Notifications enabled! You'll now receive updates about your finances.",
          icon: "/logo.png",
          badge: "/logo.png",
          vibrate: [100, 50, 100],
          tag: 'welcome-notification'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      });
    } else {
      new Notification("MONEY", {
        body: "Notifications enabled! You'll now receive updates about your finances.",
        icon: "/logo.png"
      });
    }
  } else {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const messaging = getMessaging(app);
    const validKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    
    if (!validKey) {
      return null;
    }

    const currentToken = await getToken(messaging, { 
      serviceWorkerRegistration: registration,
      vapidKey: validKey 
    });
    return currentToken || null;
  } catch (err) {
    console.error("Token request failed:", err);
    return null;
  }
};

export const onMessageListener = () => {
  if (typeof window === "undefined") return;
  const messaging = getMessaging(app);
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

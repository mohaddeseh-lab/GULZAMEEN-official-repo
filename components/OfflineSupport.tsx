'use client';

// NEW: registers the offline service worker and shows a small "offline" note
import { useEffect, useState } from 'react';

export function OfflineSupport() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((e) => console.warn('SW not registered', e));
    }
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (!offline) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] rounded-full bg-[#2D1E18] px-4 py-2 text-xs font-semibold text-[#F5E6D3] shadow-lg"
    >
      You&apos;re offline. Showing saved content.
    </div>
  );
}

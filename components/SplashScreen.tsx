'use client';

import { useState, useEffect } from 'react';

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-primary flex items-center justify-center z-50">
      <h1 className="text-4xl font-bold text-primary-foreground">Your App Name</h1>
    </div>
  );
}

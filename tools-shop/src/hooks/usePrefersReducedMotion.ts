'use client';

import { useEffect, useState } from 'react';

export default function usePrefersReducedMotion() {
  // Default to true (reduced motion) for SSR safety
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: no-preference)');
    // If user has no preference, they're OK with motion (so reduced = false)
    setPrefersReducedMotion(!mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

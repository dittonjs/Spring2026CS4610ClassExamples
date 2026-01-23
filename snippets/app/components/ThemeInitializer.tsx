'use client';

import { useEffect } from 'react';

interface ThemeInitializerProps {
  theme: 'light' | 'dark';
}

/**
 * ThemeInitializer component that sets the dark class on the html element
 * based on the theme prop. This ensures the app theme matches the code theme
 * on initial page load.
 */
export default function ThemeInitializer({ theme }: ThemeInitializerProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  return null;
}

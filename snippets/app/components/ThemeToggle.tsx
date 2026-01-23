'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { ThemeName } from '@/app/_utils/themes';

interface ThemeToggleProps {
  defaultTheme?: ThemeName;
}

/**
 * ThemeToggle component that allows users to switch between light and dark themes
 * for both the app UI and code snippets.
 * This is a Client Component because it uses interactive features and navigation.
 */
export default function ThemeToggle({ defaultTheme = 'usu-light' }: ThemeToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [theme, setTheme] = useState<ThemeName>(() => {
    const themeParam = searchParams.get('theme');
    if (themeParam === 'light' || themeParam === 'dark') {
      return themeParam === 'light' ? 'usu-light' : 'usu-dark';
    }
    // Check if dark class is already on html element
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? 'usu-dark' : defaultTheme;
    }
    return defaultTheme;
  });

  // Sync app dark mode with theme
  useEffect(() => {
    const isDark = theme === 'usu-dark';
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  useEffect(() => {
    const themeParam = searchParams.get('theme');
    if (themeParam === 'light' || themeParam === 'dark') {
      const newTheme = themeParam === 'light' ? 'usu-light' : 'usu-dark';
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    }
  }, [searchParams, theme]);

  const handleToggle = () => {
    const newTheme: ThemeName = theme === 'usu-light' ? 'usu-dark' : 'usu-light';
    setTheme(newTheme);
    
    // Update URL with new theme parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('theme', newTheme === 'usu-light' ? 'light' : 'dark');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const isLight = theme === 'usu-light';

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-usu-text-gray dark:text-usu-dark-text-gray">
        Theme:
      </span>
      <button
        onClick={handleToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-usu-primary dark:bg-usu-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-usu-primary dark:focus:ring-usu-secondary focus:ring-offset-2"
        role="switch"
        aria-checked={!isLight}
        aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isLight ? 'translate-x-1' : 'translate-x-6'
          }`}
        />
      </button>
      <span className="text-sm font-medium text-usu-text-dark dark:text-usu-dark-text min-w-[3rem]">
        {isLight ? 'Light' : 'Dark'}
      </span>
    </div>
  );
}

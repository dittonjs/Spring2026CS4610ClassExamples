'use client';

import { useSearchParams } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { getDefaultTheme, type ThemeName } from '@/app/_utils/themes';

/**
 * Header component that displays the theme toggle.
 * This is a Client Component because it uses navigation hooks.
 */
export default function Header() {
  const searchParams = useSearchParams();
  
  // Don't show toggle in embed mode
  const isEmbedMode = searchParams.get('embed') === 'true';
  if (isEmbedMode) {
    return null;
  }

  // Determine theme from URL or default
  const themeParam = searchParams.get('theme');
  const defaultTheme: ThemeName = themeParam === 'dark' 
    ? 'usu-dark' 
    : themeParam === 'light' 
    ? 'usu-light' 
    : getDefaultTheme('light');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-usu-dark-border bg-usu-bg-white dark:bg-usu-dark-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-usu-primary dark:text-usu-secondary">
              Code Snippet Viewer
            </h1>
          </div>
          <div className="flex items-center">
            <ThemeToggle defaultTheme={defaultTheme} />
          </div>
        </div>
      </div>
    </header>
  );
}

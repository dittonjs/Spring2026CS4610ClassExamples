/**
 * ThemeScript component that prevents flash of wrong theme by setting
 * the dark class on the html element before React hydrates.
 * This must be a Server Component (no 'use client' directive).
 */
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const urlParams = new URLSearchParams(window.location.search);
              const theme = urlParams.get('theme');
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else if (theme === 'light') {
                document.documentElement.classList.remove('dark');
              } else {
                // Default to light mode if no theme param
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {
              console.error('Error setting theme:', e);
            }
          })();
        `,
      }}
    />
  );
}

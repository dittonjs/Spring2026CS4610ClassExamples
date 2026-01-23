import { createHighlighter } from 'shiki';
import { loadTheme, type ThemeName, isValidTheme, getDefaultTheme } from '@/app/_utils/themes';

interface CodeBlockProps {
  code: string;
  language: string;
  theme?: ThemeName | string;
}

/**
 * CodeBlock component that renders syntax-highlighted code using shiki.
 * This is a Server Component, so it can be async.
 * Supports custom USU themes ('usu-light' or 'usu-dark') or any shiki theme.
 */
export default async function CodeBlock({ code, language, theme = 'usu-light' }: CodeBlockProps) {
  // Determine if we're using a custom USU theme
  const isCustomTheme = isValidTheme(theme);
  const themeToUse = isCustomTheme ? theme : (theme || 'usu-light');

  // Load custom theme if using USU theme, otherwise use theme name as-is
  const themes = isCustomTheme
    ? [loadTheme(themeToUse as ThemeName)]
    : [themeToUse];

  const highlighter = await createHighlighter({
    themes: themes,
    langs: [language],
  });

  const html = highlighter.codeToHtml(code, {
    lang: language,
    theme: isCustomTheme ? (themeToUse as ThemeName) : themeToUse,
  });

  return (
    <div
      className="code-block overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

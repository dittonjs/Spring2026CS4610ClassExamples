import { decodeBase64 } from '@/app/_utils/base64';
import { calculateIframeHeight } from '@/app/_utils/iframeHeight';
import { getDefaultTheme, type ThemeName } from '@/app/_utils/themes';
import CodeBlock from '@/app/components/CodeBlock';
import CopyButton from '@/app/components/CopyButton';
import EmbedCode from '@/app/components/EmbedCode';
import ThemeInitializer from '@/app/components/ThemeInitializer';
import { headers } from 'next/headers';

interface SnippetPageProps {
  params: Promise<{
    language: string;
    base64: string;
  }>;
  searchParams: Promise<{
    embed?: string;
    theme?: string;
  }>;
}

/**
 * Snippet page that displays code snippets from base64-encoded strings.
 * Route: /s/[language]/[base64]
 */
export default async function SnippetPage({ params, searchParams }: SnippetPageProps) {
  const { language, base64: base64Param } = await params;
  const searchParamsResolved = await searchParams;
  const { embed, theme: themeParam } = searchParamsResolved || {};
  const isEmbedMode = embed === 'true';

  // Determine theme: use query param if provided, otherwise default to light
  const theme: ThemeName = themeParam === 'dark'
    ? 'usu-dark'
    : themeParam === 'light'
    ? 'usu-light'
    : getDefaultTheme('light');

  // URL-decode the base64 parameter (Next.js may have already decoded it, but we'll decode again to be safe)
  const base64 = decodeURIComponent(base64Param);

  let code: string;
  try {
    code = decodeBase64(base64);
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-usu-bg-light dark:bg-usu-dark-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">
            Invalid Code Snippet
          </h1>
          <p className="text-usu-text-gray dark:text-usu-dark-text-gray">
            The provided code snippet is invalid or corrupted.
          </p>
        </div>
      </div>
    );
  }

  // Get the current URL for embed code generation
  // In production, this would use headers() to get the actual host
  // For now, we'll construct it from the route
  let currentUrl: string;
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    currentUrl = `${protocol}://${host}/s/${language}/${base64}`;
  } catch {
    // Fallback for test environment or when headers aren't available
    currentUrl = `http://localhost:3000/s/${language}/${base64}`;
  }

  return (
    <>
      <ThemeInitializer theme={theme === 'usu-dark' ? 'dark' : 'light'} />
      <main
        className={`min-h-screen ${
          isEmbedMode
            ? 'p-2 bg-usu-bg-white dark:bg-usu-dark-bg-secondary'
            : 'p-8 bg-usu-bg-light dark:bg-usu-dark-bg'
        }`}
      >
      <div
        className={`max-w-6xl mx-auto ${
          isEmbedMode ? '' : 'space-y-6'
        }`}
      >
        {!isEmbedMode && (
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2 text-usu-primary dark:text-usu-secondary">Code Snippet</h1>
            <p className="text-usu-text-gray dark:text-usu-dark-text-gray">
              Language: <span className="font-mono">{language}</span>
            </p>
          </div>
        )}

        <div
          className={`bg-usu-bg-white dark:bg-usu-dark-bg-secondary rounded-lg shadow-lg overflow-hidden ${
            isEmbedMode ? 'border-0' : 'border border-gray-200 dark:border-usu-dark-border'
          }`}
        >
          <div
            className={`flex items-center justify-between ${
              isEmbedMode ? 'p-2' : 'p-4'
            } bg-usu-bg-gray dark:bg-usu-dark-bg-tertiary border-b border-gray-200 dark:border-usu-dark-border`}
          >
            <span className="text-sm font-mono text-usu-text-gray dark:text-usu-dark-text-gray">
              {language}
            </span>
            <CopyButton text={code} />
          </div>
          <div className={`${isEmbedMode ? 'p-2' : 'p-4'} bg-usu-bg-soft dark:bg-usu-dark-bg-extra-dark overflow-x-auto`}>
            {language === 'other' ? (
              <pre className="font-mono text-sm text-usu-text-dark dark:text-usu-dark-text whitespace-pre overflow-x-auto">
                <code>{code}</code>
              </pre>
            ) : (
              <CodeBlock code={code} language={language} theme={theme} />
            )}
          </div>
        </div>

        {!isEmbedMode && (
          <div className="bg-usu-bg-white dark:bg-usu-dark-bg-secondary rounded-lg shadow-lg p-6 border border-gray-200 dark:border-usu-dark-border">
            <EmbedCode
              url={currentUrl}
              height={`${calculateIframeHeight(code)}px`}
              theme={theme === 'usu-light' ? 'light' : 'dark'}
            />
          </div>
        )}
      </div>
    </main>
    </>
  );
}

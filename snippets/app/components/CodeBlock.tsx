import { getHighlighter } from 'shiki';

interface CodeBlockProps {
  code: string;
  language: string;
  theme?: string;
}

/**
 * CodeBlock component that renders syntax-highlighted code using shiki.
 * This is a Server Component, so it can be async.
 */
export default async function CodeBlock({ code, language, theme = 'github-dark' }: CodeBlockProps) {
  const highlighter = await getHighlighter({
    themes: [theme],
    langs: [language],
  });

  const html = highlighter.codeToHtml(code, {
    lang: language,
    theme: theme,
  });

  return (
    <div
      className="code-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

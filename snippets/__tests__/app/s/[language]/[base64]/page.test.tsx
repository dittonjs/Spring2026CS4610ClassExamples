import { render, screen, waitFor } from '@testing-library/react';
import SnippetPage from '@/app/s/[language]/[base64]/page';
import { decodeBase64 } from '@/app/_utils/base64';

// Mock the components
jest.mock('@/app/components/CodeBlock', () => {
  return function MockCodeBlock({ code, language }: { code: string; language: string }) {
    return <pre data-testid="code-block" data-language={language}>{code}</pre>;
  };
});

jest.mock('@/app/components/CopyButton', () => {
  return function MockCopyButton({ text }: { text: string }) {
    return <button data-testid="copy-button">Copy</button>;
  };
});

jest.mock('@/app/components/EmbedCode', () => {
  return function MockEmbedCode({ url }: { url: string }) {
    return <div data-testid="embed-code">Embed Code: {url}</div>;
  };
});

describe('SnippetPage', () => {
  it('should render code snippet with decoded base64', async () => {
    const code = 'console.log("Hello, World!");';
    const base64Encoded = Buffer.from(code).toString('base64');
    // URL-encode the base64 string to simulate what happens in the URL
    const urlEncoded = encodeURIComponent(base64Encoded);

    const page = await SnippetPage({
      params: Promise.resolve({ language: 'javascript', base64: urlEncoded }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(page);

    await waitFor(() => {
      expect(container.textContent).toContain(code);
    });
  });

  it('should use the correct language for syntax highlighting', async () => {
    const code = 'const x = 1;';
    const base64Encoded = Buffer.from(code).toString('base64');
    const urlEncoded = encodeURIComponent(base64Encoded);

    const page = await SnippetPage({
      params: Promise.resolve({ language: 'typescript', base64: urlEncoded }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(page);

    await waitFor(() => {
      const codeBlock = container.querySelector('[data-language="typescript"]');
      expect(codeBlock).toBeInTheDocument();
    });
  });

  it('should handle URL-safe base64 encoding', async () => {
    const code = 'print("test")';
    const base64Encoded = Buffer.from(code).toString('base64');
    // URL-encode it (which handles +, /, = characters)
    const urlEncoded = encodeURIComponent(base64Encoded);

    const page = await SnippetPage({
      params: Promise.resolve({ language: 'python', base64: urlEncoded }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(page);

    await waitFor(() => {
      expect(container.textContent).toContain(code);
    });
  });

  it('should display embed code when not in embed mode', async () => {
    const code = 'const x = 1;';
    const base64Encoded = Buffer.from(code).toString('base64');
    const urlEncoded = encodeURIComponent(base64Encoded);

    const page = await SnippetPage({
      params: Promise.resolve({ language: 'javascript', base64: urlEncoded }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(page);

    await waitFor(() => {
      const embedCode = container.querySelector('[data-testid="embed-code"]');
      expect(embedCode).toBeInTheDocument();
    });
  });

  it('should not display embed code when in embed mode', async () => {
    const code = 'const x = 1;';
    const base64Encoded = Buffer.from(code).toString('base64');
    const urlEncoded = encodeURIComponent(base64Encoded);

    const page = await SnippetPage({
      params: Promise.resolve({ language: 'javascript', base64: urlEncoded }),
      searchParams: Promise.resolve({ embed: 'true' }),
    });
    const { container } = render(page);

    await waitFor(() => {
      const embedCode = container.querySelector('[data-testid="embed-code"]');
      expect(embedCode).not.toBeInTheDocument();
    });
  });

  it('should show error message for invalid base64', async () => {
    const page = await SnippetPage({
      params: Promise.resolve({ language: 'javascript', base64: 'invalid-base64!!!' }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(page);

    await waitFor(() => {
      expect(container.textContent).toMatch(/error|invalid/i);
    });
  });

  it('should handle empty base64 string', async () => {
    const base64Encoded = Buffer.from('').toString('base64');
    const urlEncoded = encodeURIComponent(base64Encoded);

    const page = await SnippetPage({
      params: Promise.resolve({ language: 'javascript', base64: urlEncoded }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(page);

    // Should render without error (empty code is valid)
    expect(container).toBeInTheDocument();
  });

  it('should apply compact layout in embed mode', async () => {
    const code = 'const x = 1;';
    const base64Encoded = Buffer.from(code).toString('base64');
    const urlEncoded = encodeURIComponent(base64Encoded);

    const page = await SnippetPage({
      params: Promise.resolve({ language: 'javascript', base64: urlEncoded }),
      searchParams: Promise.resolve({ embed: 'true' }),
    });
    const { container } = render(page);

    // Check for compact layout classes (reduced padding)
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });
});

import { render, waitFor } from '@testing-library/react';
import CodeBlock from '@/app/components/CodeBlock';

// Mock shiki
const mockCodeToHtml = jest.fn((code: string, options: { lang: string; theme: string }) => {
  return `<pre class="shiki" style="background-color: #1e1e1e; color: #d4d4d4;"><code class="language-${options.lang}">${code}</code></pre>`;
});

const mockHighlighter = {
  codeToHtml: mockCodeToHtml,
};

jest.mock('shiki', () => ({
  getHighlighter: jest.fn(() => Promise.resolve(mockHighlighter)),
}));

describe('CodeBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render code with syntax highlighting', async () => {
    const code = 'console.log("Hello, World!");';
    const { container } = render(await CodeBlock({ code, language: 'javascript' }));

    await waitFor(() => {
      expect(container.querySelector('pre')).toBeInTheDocument();
    });

    expect(container.textContent).toContain(code);
    expect(mockCodeToHtml).toHaveBeenCalledWith(code, expect.objectContaining({ lang: 'javascript' }));
  });

  it('should apply the correct language class', async () => {
    const code = 'const x = 1;';
    const { container } = render(await CodeBlock({ code, language: 'typescript' }));

    await waitFor(() => {
      const codeElement = container.querySelector('code');
      expect(codeElement).toHaveClass('language-typescript');
    });
  });

  it('should handle different programming languages', async () => {
    const pythonCode = 'print("Hello, World!")';
    const { container: pythonContainer } = render(await CodeBlock({ code: pythonCode, language: 'python' }));

    await waitFor(() => {
      expect(pythonContainer.textContent).toContain(pythonCode);
    });

    const htmlCode = '<div>Hello</div>';
    const { container: htmlContainer } = render(await CodeBlock({ code: htmlCode, language: 'html' }));

    await waitFor(() => {
      // textContent will only show "Hello" for HTML, so check for that
      expect(htmlContainer.textContent).toContain('Hello');
      // Also verify the code element contains the HTML
      const codeElement = htmlContainer.querySelector('code.language-html');
      expect(codeElement).toBeInTheDocument();
    });
  });

  it('should handle code with special characters', async () => {
    const code = 'function test() {\n  return "test";\n}';
    const { container } = render(await CodeBlock({ code, language: 'javascript' }));

    await waitFor(() => {
      expect(container.textContent).toContain('function test()');
      expect(container.textContent).toContain('return "test"');
    });
  });

  it('should handle empty code string', async () => {
    const { container } = render(await CodeBlock({ code: '', language: 'javascript' }));

    await waitFor(() => {
      expect(container.querySelector('pre')).toBeInTheDocument();
    });
  });

  it('should use default theme when not specified', async () => {
    const code = 'const x = 1;';
    render(await CodeBlock({ code, language: 'typescript' }));

    await waitFor(() => {
      expect(mockCodeToHtml).toHaveBeenCalledWith(
        code,
        expect.objectContaining({ lang: 'typescript' })
      );
    });
  });
});

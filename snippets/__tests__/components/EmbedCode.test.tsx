import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmbedCode from '@/app/components/EmbedCode';

// Mock the clipboard API
const mockWriteText = jest.fn().mockResolvedValue(undefined);

describe('EmbedCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);

    // Setup navigator.clipboard mock
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });
    }
  });

  it('should render embed code section', () => {
    render(<EmbedCode url="https://example.com/s/javascript/dGVzdA" />);
    expect(screen.getByText('Embed Code')).toBeInTheDocument();
  });

  it('should display iframe code with correct URL', () => {
    const url = 'https://example.com/s/javascript/dGVzdA';
    render(<EmbedCode url={url} />);

    const iframeCode = screen.getByDisplayValue(new RegExp(url));
    expect(iframeCode).toBeInTheDocument();
  });

  it('should include default width and height in iframe code', () => {
    const url = 'https://example.com/s/javascript/dGVzdA';
    render(<EmbedCode url={url} />);

    const iframeCode = screen.getByDisplayValue(/<iframe/) as HTMLTextAreaElement;
    expect(iframeCode.value).toContain('width="100%"');
    expect(iframeCode.value).toContain('height="400px"');
  });

  it('should include embed=true in the iframe src', () => {
    const url = 'https://example.com/s/javascript/dGVzdA';
    render(<EmbedCode url={url} />);

    const iframeCode = screen.getByDisplayValue(/<iframe/) as HTMLTextAreaElement;
    expect(iframeCode.value).toContain('embed=true');
  });

  it('should allow copying embed code to clipboard', async () => {
    const user = userEvent.setup();
    const url = 'https://example.com/s/javascript/dGVzdA';

    // Setup clipboard spy
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

    render(<EmbedCode url={url} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalled();
    });

    // Verify the copied text contains iframe code
    const copiedText = writeTextSpy.mock.calls[0][0];
    expect(copiedText).toContain('<iframe');
    expect(copiedText).toContain(url);
  });

  it('should show copied message after copying', async () => {
    const user = userEvent.setup();
    const url = 'https://example.com/s/javascript/dGVzdA';

    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

    render(<EmbedCode url={url} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });

  it('should handle custom width and height', () => {
    const url = 'https://example.com/s/javascript/dGVzdA';
    render(<EmbedCode url={url} width="800px" height="600px" />);

    const iframeCode = screen.getByDisplayValue(/<iframe/) as HTMLTextAreaElement;
    expect(iframeCode.value).toContain('width="800px"');
    expect(iframeCode.value).toContain('height="600px"');
  });
});

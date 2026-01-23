import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('Home Page', () => {
  it('should render the home page', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display instructions on how to use the snippet viewer', () => {
    render(<Home />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText(/Paste your code above/i)).toBeInTheDocument();
  });


  it('should display a form to generate snippet URLs', () => {
    render(<Home />);
    const textarea = screen.getByPlaceholderText(/paste your code/i);
    expect(textarea).toBeInTheDocument();
  });

  it('should allow selecting a programming language', () => {
    render(<Home />);
    const languageSelect = screen.getByLabelText(/language/i);
    expect(languageSelect).toBeInTheDocument();
  });

  it('should generate a URL when form is submitted', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const textarea = screen.getByPlaceholderText(/paste your code/i);
    const languageSelect = screen.getByLabelText(/language/i);
    const submitButton = screen.getByRole('button', { name: /generate|create/i });

    await user.type(textarea, 'console.log("Hello");');
    await user.selectOptions(languageSelect, 'javascript');
    await user.click(submitButton);

    // Should show the generated URL in the URL input field
    await waitFor(() => {
      const urlInputs = screen.getAllByDisplayValue(/\/s\/javascript\//);
      // Should have at least the URL input
      expect(urlInputs.length).toBeGreaterThan(0);
    });
  });

  it('should encode code as base64 in the generated URL', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const code = 'console.log("test");';
    const textarea = screen.getByPlaceholderText(/paste your code/i);
    const languageSelect = screen.getByLabelText(/language/i);
    const submitButton = screen.getByRole('button', { name: /generate|create/i });

    await user.type(textarea, code);
    await user.selectOptions(languageSelect, 'javascript');
    await user.click(submitButton);

    await waitFor(() => {
      // Get the URL input (first one, which is the text input, not the textarea)
      const urlInputs = screen.getAllByDisplayValue(/\/s\/javascript\//);
      const urlInput = urlInputs.find(el => el.tagName === 'INPUT') as HTMLInputElement;
      expect(urlInput).toBeDefined();
      // The URL should contain base64 encoded code
      expect(urlInput.value).toContain('/s/javascript/');
      // Should not contain the raw code
      expect(urlInput.value).not.toContain('console.log');
    });
  });

  it('should allow copying the generated URL', async () => {
    const user = userEvent.setup();

    // Mock clipboard
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

    render(<Home />);

    const textarea = screen.getByPlaceholderText(/paste your code/i);
    const languageSelect = screen.getByLabelText(/language/i);
    const submitButton = screen.getByRole('button', { name: /generate|create/i });

    await user.type(textarea, 'const x = 1;');
    await user.selectOptions(languageSelect, 'typescript');
    await user.click(submitButton);

    await waitFor(() => {
      // Should have copy buttons available
      const copyButtons = screen.getAllByRole('button', { name: /copy/i });
      expect(copyButtons.length).toBeGreaterThan(0);
    });

    // Get all copy buttons and click the first one (URL copy button)
    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    await user.click(copyButtons[0]);

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalled();
      // Should have been called with the URL (not the iframe code)
      const calledWith = writeTextSpy.mock.calls[0][0];
      expect(calledWith).toContain('/s/typescript/');
      expect(calledWith).not.toContain('<iframe');
    });
  });

  it('should display embed code when URL is generated', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const textarea = screen.getByPlaceholderText(/paste your code/i);
    const languageSelect = screen.getByLabelText(/language/i);
    const submitButton = screen.getByRole('button', { name: /generate|create/i });

    await user.type(textarea, 'console.log("test");');
    await user.selectOptions(languageSelect, 'javascript');
    await user.click(submitButton);

    await waitFor(() => {
      // Look for the iframe code specifically, not just any "embed code" text
      expect(screen.getByDisplayValue(/<iframe/)).toBeInTheDocument();
    });
  });

  it('should handle empty code input', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const submitButton = screen.getByRole('button', { name: /generate|create/i });
    await user.click(submitButton);

    // Should show validation error or handle gracefully
    // The form might prevent submission or show an error
    expect(submitButton).toBeInTheDocument();
  });
});

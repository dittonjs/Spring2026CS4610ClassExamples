import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyButton from '@/app/components/CopyButton';

describe('CopyButton', () => {
  let mockWriteText: jest.SpyInstance;

  beforeEach(() => {
    // Ensure navigator.clipboard exists
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
        writable: true,
        configurable: true,
      });
    }

    // Spy on the writeText method
    mockWriteText = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
  });


  it('should render a copy button', () => {
    render(<CopyButton text="test code" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should display copy text initially', () => {
    render(<CopyButton text="test code" />);
    expect(screen.getByText(/copy/i)).toBeInTheDocument();
  });

  it('should copy text to clipboard when clicked', async () => {
    const user = userEvent.setup();
    const textToCopy = 'console.log("Hello, World!");';

    // Ensure clipboard is set up and spy is active
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: jest.fn().mockResolvedValue(undefined) },
        writable: true,
        configurable: true,
      });
    }
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

    render(<CopyButton text={textToCopy} />);
    const button = screen.getByRole('button');

    await user.click(button);

    // Wait for the UI to update (showing "Copied!")
    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });

    // Then verify the clipboard was called
    expect(writeTextSpy).toHaveBeenCalledWith(textToCopy);
    expect(writeTextSpy).toHaveBeenCalledTimes(1);
  });

  it('should show success message after copying', async () => {
    const user = userEvent.setup();
    render(<CopyButton text="test code" />);
    const button = screen.getByRole('button');

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });

  it('should revert to copy text after timeout', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    render(<CopyButton text="test code" />);
    const button = screen.getByRole('button');

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });

    // Fast-forward time
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByText(/copy/i)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('should handle clipboard errors gracefully', async () => {
    const user = userEvent.setup();
    mockWriteText.mockRejectedValue(new Error('Clipboard error'));

    render(<CopyButton text="test code" />);
    const button = screen.getByRole('button');

    // Should not throw
    await expect(user.click(button)).resolves.not.toThrow();
  });

  it('should handle empty text', async () => {
    const user = userEvent.setup();
    render(<CopyButton text="" />);
    const button = screen.getByRole('button');

    await user.click(button);

    // Wait for the UI to update (showing "Copied!")
    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });

    // Then verify the clipboard was called with empty string
    expect(mockWriteText).toHaveBeenCalledWith('');
  });
});

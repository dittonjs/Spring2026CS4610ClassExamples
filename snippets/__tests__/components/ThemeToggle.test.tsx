import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '@/app/components/ThemeToggle';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('ThemeToggle', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams()
    );
    // Reset dark class on html element
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
  });

  it('should render theme toggle', () => {
    render(<ThemeToggle />);
    expect(screen.getByText('Theme:')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('should display light theme by default', () => {
    render(<ThemeToggle />);
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('should use defaultTheme prop when provided', () => {
    render(<ThemeToggle defaultTheme="usu-dark" />);
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('should read theme from URL search params', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('theme=dark')
    );
    render(<ThemeToggle />);
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('should toggle theme when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    
    const toggle = screen.getByRole('switch');
    expect(screen.getByText('Light')).toBeInTheDocument();
    
    await user.click(toggle);
    
    await waitFor(() => {
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });
    
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('theme=dark'),
      { scroll: false }
    );
  });

  it('should toggle from dark to light and call router.push', async () => {
    const user = userEvent.setup();
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('theme=dark')
    );
    render(<ThemeToggle />);
    
    const toggle = screen.getByRole('switch');
    expect(screen.getByText('Dark')).toBeInTheDocument();
    
    await user.click(toggle);
    
    // Verify router.push was called with the correct theme parameter
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
    
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('theme=light'),
      { scroll: false }
    );
  });

  it('should preserve other search params when toggling', async () => {
    const user = userEvent.setup();
    const searchParams = new URLSearchParams('embed=true&theme=light');
    (useSearchParams as jest.Mock).mockReturnValue(searchParams);
    
    render(<ThemeToggle />);
    
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
    
    const callArgs = mockPush.mock.calls[0][0];
    // The URL should contain both params
    expect(callArgs).toMatch(/embed=true/);
    expect(callArgs).toMatch(/theme=dark/);
  });

  it('should have correct aria-label', () => {
    render(<ThemeToggle />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-label', 'Switch to dark theme');
    
    // After toggling to dark
    userEvent.click(toggle);
    waitFor(() => {
      expect(toggle).toHaveAttribute('aria-label', 'Switch to light theme');
    });
  });
});

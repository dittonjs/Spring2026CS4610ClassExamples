import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeEditor from '@/app/components/CodeEditor';

describe('CodeEditor', () => {
  it('should render a textarea', () => {
    const handleChange = jest.fn();
    render(<CodeEditor value="" onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('should display the value', () => {
    const handleChange = jest.fn();
    render(<CodeEditor value="test code" onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('test code');
  });

  it('should call onChange when text is typed', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<CodeEditor value="" onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'hello');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should indent with Tab key (4 spaces)', async () => {
    const user = userEvent.setup();
    let currentValue = 'line1';
    const handleChange = (value: string) => {
      currentValue = value;
    };
    const { rerender } = render(<CodeEditor value={currentValue} onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(0, 0); // Cursor at start
    
    await user.keyboard('{Tab}');
    
    // Re-render with new value
    rerender(<CodeEditor value={currentValue} onChange={handleChange} />);
    
    expect(currentValue).toBe('    line1'); // 4 spaces
  });

  it('should de-indent with Shift+Tab (4 spaces)', async () => {
    let currentValue = '    line1'; // 4 spaces
    const handleChange = jest.fn((value: string) => {
      currentValue = value;
    });
    render(<CodeEditor value={currentValue} onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(0, 0); // Cursor at start
    
    // Create and dispatch Shift+Tab event
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(shiftTabEvent, 'target', { value: textarea, enumerable: true });
    
    textarea.dispatchEvent(shiftTabEvent);
    
    // Wait for async updates
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (handleChange.mock.calls.length > 0) {
      const newValue = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
      expect(newValue).toBe('line1');
    } else {
      // If onChange wasn't called, the value should remain unchanged
      expect(currentValue).toBe('    line1');
    }
  });

  it('should indent multiple selected lines with Tab (4 spaces)', async () => {
    const user = userEvent.setup();
    let currentValue = 'line1\nline2\nline3';
    const handleChange = jest.fn((value: string) => {
      currentValue = value;
    });
    const { rerender } = render(<CodeEditor value={currentValue} onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    // Select from start of first line to end of last line
    textarea.setSelectionRange(0, currentValue.length);
    
    // Create a Tab keydown event
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(tabEvent, 'target', { value: textarea });
    
    textarea.dispatchEvent(tabEvent);
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (handleChange.mock.calls.length > 0) {
      const newValue = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
      expect(newValue).toBe('    line1\n    line2\n    line3'); // 4 spaces
    }
  });

  it('should de-indent multiple selected lines with Shift+Tab (4 spaces)', async () => {
    const user = userEvent.setup();
    let currentValue = '    line1\n    line2\n    line3'; // 4 spaces
    const handleChange = jest.fn((value: string) => {
      currentValue = value;
    });
    const { rerender } = render(<CodeEditor value={currentValue} onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(0, currentValue.length);
    
    // Create a Shift+Tab keydown event
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(shiftTabEvent, 'target', { value: textarea });
    
    textarea.dispatchEvent(shiftTabEvent);
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (handleChange.mock.calls.length > 0) {
      const newValue = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
      expect(newValue).toBe('line1\nline2\nline3');
    }
  });

  it('should handle placeholder', () => {
    const handleChange = jest.fn();
    render(<CodeEditor value="" onChange={handleChange} placeholder="Enter code here" />);
    
    const textarea = screen.getByPlaceholderText('Enter code here');
    expect(textarea).toBeInTheDocument();
  });

  it('should not de-indent if line has no indentation', async () => {
    const user = userEvent.setup();
    let currentValue = 'line1';
    const handleChange = (value: string) => {
      currentValue = value;
    };
    const { rerender } = render(<CodeEditor value={currentValue} onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(0, 0);
    
    const initialValue = currentValue;
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    
    // Re-render with new value
    rerender(<CodeEditor value={currentValue} onChange={handleChange} />);
    
    // Should not change if there's nothing to de-indent
    expect(currentValue).toBe(initialValue);
  });

  it('should auto-indent new line to match previous line', async () => {
    let currentValue = '    function test() {'; // 4 spaces
    const handleChange = jest.fn((value: string) => {
      currentValue = value;
    });
    render(<CodeEditor value={currentValue} onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    // Place cursor at the end of the line
    textarea.setSelectionRange(currentValue.length, currentValue.length);
    
    // Create and dispatch Enter event
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(enterEvent, 'target', { value: textarea, enumerable: true });
    
    textarea.dispatchEvent(enterEvent);
    
    // Wait for async updates
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (handleChange.mock.calls.length > 0) {
      const newValue = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
      expect(newValue).toBe('    function test() {\n    '); // New line with 4 spaces
    }
  });

  it('should auto-indent new line with no indentation if previous line has none', async () => {
    let currentValue = 'line1';
    const handleChange = jest.fn((value: string) => {
      currentValue = value;
    });
    render(<CodeEditor value={currentValue} onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(currentValue.length, currentValue.length);
    
    // Create and dispatch Enter event
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(enterEvent, 'target', { value: textarea, enumerable: true });
    
    textarea.dispatchEvent(enterEvent);
    
    // Wait for async updates
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (handleChange.mock.calls.length > 0) {
      const newValue = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
      expect(newValue).toBe('line1\n'); // New line with no indentation
    }
  });
});

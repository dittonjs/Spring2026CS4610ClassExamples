'use client';

import { useRef, KeyboardEvent } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  id?: string;
}

/**
 * CodeEditor component that provides a textarea with code editing features.
 * Supports Tab and Shift+Tab for indentation/de-indentation (4 spaces).
 * Auto-indents new lines to match the previous line's indentation.
 * This is a Client Component because it handles keyboard events.
 */
export default function CodeEditor({
  value,
  onChange,
  placeholder = '',
  rows = 10,
  className = '',
  id,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;
    const INDENT_SIZE = 4; // 4 spaces for indentation

    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (e.shiftKey) {
        // Shift+Tab: De-indent
        const linesBefore = text.substring(0, start).split('\n');
        const currentLineIndex = linesBefore.length - 1;
        const currentLine = linesBefore[currentLineIndex];
        
        // Find the start of the current line
        const lineStart = start - currentLine.length;
        
        // Check if line starts with spaces or tabs
        let indentToRemove = 0;
        if (currentLine.startsWith(' '.repeat(INDENT_SIZE))) {
          indentToRemove = INDENT_SIZE; // Remove 4 spaces
        } else if (currentLine.startsWith('\t')) {
          indentToRemove = 1; // Remove 1 tab
        } else {
          // Try to remove as many spaces as possible (up to INDENT_SIZE)
          for (let i = 1; i <= INDENT_SIZE && i <= currentLine.length; i++) {
            if (currentLine.startsWith(' '.repeat(i))) {
              indentToRemove = i;
            }
          }
        }
        
        if (indentToRemove > 0) {
          const newText = 
            text.substring(0, lineStart) +
            currentLine.substring(indentToRemove) +
            text.substring(end);
          
          onChange(newText);
          
          // Set cursor position
          setTimeout(() => {
            const newStart = Math.max(lineStart, start - indentToRemove);
            const newEnd = Math.max(lineStart, end - indentToRemove);
            textarea.setSelectionRange(newStart, newEnd);
          }, 0);
        }
      } else {
        // Tab: Indent
        const selectedText = text.substring(start, end);
        const lines = selectedText.split('\n');
        
        if (lines.length > 1) {
          // Multiple lines selected: indent all lines
          const indentedLines = lines.map(line => ' '.repeat(INDENT_SIZE) + line);
          const newText = 
            text.substring(0, start) +
            indentedLines.join('\n') +
            text.substring(end);
          
          onChange(newText);
          
          // Set cursor position
          setTimeout(() => {
            const newStart = start + INDENT_SIZE;
            const newEnd = end + (lines.length * INDENT_SIZE);
            textarea.setSelectionRange(newStart, newEnd);
          }, 0);
        } else {
          // Single line or no selection: insert 4 spaces
          const newText = 
            text.substring(0, start) +
            ' '.repeat(INDENT_SIZE) +
            text.substring(end);
          
          onChange(newText);
          
          // Set cursor position after the inserted spaces
          setTimeout(() => {
            const newPos = start + INDENT_SIZE;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
      }
    } else if (e.key === 'Enter') {
      // Auto-indent new line to match previous line
      e.preventDefault();
      
      const linesBefore = text.substring(0, start).split('\n');
      const currentLineIndex = linesBefore.length - 1;
      const currentLine = linesBefore[currentLineIndex];
      
      // Get the indentation of the current line (leading spaces)
      const match = currentLine.match(/^(\s*)/);
      const indent = match ? match[1] : '';
      
      // Insert newline with the same indentation
      const newText = 
        text.substring(0, start) +
        '\n' +
        indent +
        text.substring(end);
      
      onChange(newText);
      
      // Set cursor position after the indentation on the new line
      setTimeout(() => {
        const newPos = start + 1 + indent.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      rows={rows}
      className={className}
    />
  );
}

'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

/**
 * CopyButton component that copies text to clipboard.
 * This is a Client Component because it uses browser APIs.
 */
export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset to "Copy" after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      // Handle clipboard errors gracefully
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
        className || ''
      } ${
        copied
          ? 'bg-usu-secondary dark:bg-usu-primary text-usu-text-light'
          : 'bg-usu-primary dark:bg-usu-secondary text-usu-text-light hover:bg-usu-primary-dark dark:hover:bg-usu-secondary-dark'
      }`}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

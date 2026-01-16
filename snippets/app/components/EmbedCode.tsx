'use client';

import { useState } from 'react';
import CopyButton from './CopyButton';

interface EmbedCodeProps {
  url: string;
  width?: string;
  height?: string;
}

/**
 * EmbedCode component that displays iframe embed code for Canvas LMS.
 * This is a Client Component because it uses interactive features.
 */
export default function EmbedCode({ url, width = '100%', height = '400px' }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);

  // Add embed=true to the URL if not already present
  const embedUrl = url.includes('embed=true') ? url : `${url}${url.includes('?') ? '&' : '?'}embed=true`;

  // Generate the iframe HTML code
  const iframeCode = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy embed code:', error);
    }
  };

  return (
    <div className="embed-code-section">
      <h3 className="text-lg font-semibold mb-2 text-usu-primary dark:text-usu-secondary">Embed Code</h3>
      <p className="text-sm text-usu-text-gray dark:text-usu-dark-text-gray mb-3">
        Copy this code to embed the snippet in Canvas LMS:
      </p>
      <div className="flex gap-2">
        <textarea
          readOnly
          value={iframeCode}
          className="flex-1 p-2 border rounded font-mono text-sm bg-usu-bg-gray dark:bg-usu-dark-bg-tertiary border-gray-300 dark:border-usu-dark-border text-usu-text-dark dark:text-usu-dark-text"
          rows={2}
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-usu-primary dark:bg-usu-secondary text-usu-text-light rounded hover:bg-usu-primary-dark dark:hover:bg-usu-secondary-dark transition-colors font-medium"
          aria-label={copied ? 'Copied to clipboard' : 'Copy embed code'}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

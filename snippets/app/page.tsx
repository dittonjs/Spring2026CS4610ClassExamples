'use client';

import { useState } from 'react';
import CopyButton from './components/CopyButton';
import EmbedCode from './components/EmbedCode';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
];

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleGenerate = () => {
    if (!code.trim()) {
      return;
    }

    // Encode code as base64
    const base64Encoded = Buffer.from(code).toString('base64');

    // URL-encode the base64 string to handle special characters (+, /, =)
    const urlEncoded = encodeURIComponent(base64Encoded);

    // Generate URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/s/${language}/${urlEncoded}`;
    setGeneratedUrl(url);
  };

  return (
    <div className="min-h-screen bg-usu-bg-light dark:bg-usu-dark-bg">
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-usu-primary dark:text-usu-secondary">
            Code Snippet Viewer
          </h1>
          <p className="text-lg text-usu-text-gray dark:text-usu-dark-text-gray">
            Share and display code snippets with beautiful syntax highlighting
          </p>
        </div>

        <div className="bg-usu-bg-white dark:bg-usu-dark-bg-secondary rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-usu-dark-border">
          <h2 className="text-2xl font-semibold mb-4 text-usu-primary dark:text-usu-secondary">
            How It Works
          </h2>
          <div className="space-y-4 text-usu-text-gray dark:text-usu-dark-text-gray">
            <p>
              Paste your code below, select the programming language, and generate a shareable URL.
              The code is encoded in the URL, so no database is needed!
            </p>
            <p>
              You can embed these snippets in Canvas LMS using the provided iframe code.
            </p>
          </div>
        </div>

        <div className="bg-usu-bg-white dark:bg-usu-dark-bg-secondary rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-usu-dark-border">
          <h2 className="text-2xl font-semibold mb-4 text-usu-primary dark:text-usu-secondary">
            Generate Snippet URL
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-2 text-usu-text-dark dark:text-usu-dark-text">
                Programming Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded bg-usu-bg-white dark:bg-usu-dark-bg-tertiary border-gray-300 dark:border-usu-dark-border text-usu-text-dark dark:text-usu-dark-text focus:border-usu-primary dark:focus:border-usu-secondary focus:ring-2 focus:ring-usu-primary dark:focus:ring-usu-secondary focus:ring-opacity-50"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2 text-usu-text-dark dark:text-usu-dark-text">
                Code
              </label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={10}
                className="w-full p-3 border rounded font-mono text-sm bg-usu-bg-white dark:bg-usu-dark-bg-tertiary border-gray-300 dark:border-usu-dark-border text-usu-text-dark dark:text-usu-dark-text focus:border-usu-primary dark:focus:border-usu-secondary focus:ring-2 focus:ring-usu-primary dark:focus:ring-usu-secondary focus:ring-opacity-50"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!code.trim()}
              className="w-full px-4 py-2 bg-usu-primary dark:bg-usu-secondary text-usu-text-light rounded hover:bg-usu-primary-dark dark:hover:bg-usu-secondary-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Generate URL
            </button>
          </div>

          {generatedUrl && (
            <>
              <div className="mt-6 p-4 bg-usu-bg-gray dark:bg-usu-dark-bg-tertiary rounded border border-gray-200 dark:border-usu-dark-border">
                <label className="block text-sm font-medium mb-2 text-usu-text-dark dark:text-usu-dark-text">
                  Generated URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedUrl}
                    className="flex-1 p-2 border rounded font-mono text-sm bg-usu-bg-white dark:bg-usu-dark-bg-secondary border-gray-300 dark:border-usu-dark-border text-usu-text-dark dark:text-usu-dark-text"
                  />
                  <CopyButton text={generatedUrl} />
                </div>
              </div>
              <div className="mt-6">
                <EmbedCode url={generatedUrl} />
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
}

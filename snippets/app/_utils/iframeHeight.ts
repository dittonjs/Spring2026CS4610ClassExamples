/**
 * Calculates the estimated iframe height based on the number of lines in the code.
 *
 * The calculation accounts for:
 * - Header space (language label and copy button): ~60px
 * - Padding (top and bottom): ~32px (16px each for embed mode, more for regular mode)
 * - Line height: ~24px per line (more accurate for shiki output)
 * - Minimum height: 100px
 *
 * @param code - The code string to calculate height for
 * @returns The estimated height in pixels
 */
export function calculateIframeHeight(code: string): number {
  if (!code || code.trim().length === 0) {
    return 100; // Minimum height for empty code
  }

  // Count lines (split by newline, filter out empty trailing lines)
  const lines = code.split('\n').filter((line, index, array) => {
    // Keep all lines except trailing empty ones
    if (index === array.length - 1 && line.trim() === '') {
      return false;
    }
    return true;
  });

  const lineCount = lines.length;

  // Constants for height calculation
  const HEADER_HEIGHT = 60; // Space for language label and copy button
  const PADDING = 32; // Top and bottom padding (16px each in embed mode)
  const LINE_HEIGHT = 24; // More accurate height per line of code (shiki uses ~24px)
  const MIN_HEIGHT = 100; // Minimum iframe height

  // Calculate height: header + padding + (lines * line height)
  const calculatedHeight = HEADER_HEIGHT + PADDING + (lineCount * LINE_HEIGHT);

  // Return the maximum of calculated height and minimum height
  return Math.max(calculatedHeight, MIN_HEIGHT);
}

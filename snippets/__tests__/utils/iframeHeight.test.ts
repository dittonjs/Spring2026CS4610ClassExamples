import { calculateIframeHeight } from '@/app/_utils/iframeHeight';

describe('iframeHeight utilities', () => {
  describe('calculateIframeHeight', () => {
    it('should calculate height for single line of code', () => {
      const code = 'console.log("Hello");';
      const height = calculateIframeHeight(code);
      expect(height).toBeGreaterThan(0);
      expect(typeof height).toBe('number');
    });

    it('should calculate height for multiple lines of code', () => {
      const code = 'function test() {\n  return true;\n}';
      const height = calculateIframeHeight(code);
      expect(height).toBeGreaterThan(0);
    });

    it('should return minimum height for very short code', () => {
      const code = 'x';
      const height = calculateIframeHeight(code);
      // Should have a reasonable minimum (e.g., at least 100px)
      expect(height).toBeGreaterThanOrEqual(100);
    });

    it('should calculate height proportionally to line count', () => {
      const shortCode = 'line1\nline2';
      const longCode = 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10';

      const shortHeight = calculateIframeHeight(shortCode);
      const longHeight = calculateIframeHeight(longCode);

      expect(longHeight).toBeGreaterThan(shortHeight);
    });

    it('should handle empty string with minimum height', () => {
      const height = calculateIframeHeight('');
      expect(height).toBeGreaterThanOrEqual(100);
    });

    it('should handle code with many lines', () => {
      const code = Array(50).fill('console.log("test");').join('\n');
      const height = calculateIframeHeight(code);
      expect(height).toBeGreaterThan(400); // Should be larger than default
    });

    it('should account for header and padding in calculation', () => {
      const code = 'single line';
      const height = calculateIframeHeight(code);
      // Should include space for header (language label) and padding
      expect(height).toBeGreaterThan(100);
    });

    it('should handle code with trailing newline', () => {
      const code1 = 'line1\nline2';
      const code2 = 'line1\nline2\n';

      const height1 = calculateIframeHeight(code1);
      const height2 = calculateIframeHeight(code2);

      // Should treat them similarly (trailing newline shouldn't add extra line)
      expect(Math.abs(height1 - height2)).toBeLessThan(50);
    });

    it('should handle code with only newlines', () => {
      const code = '\n\n\n';
      const height = calculateIframeHeight(code);
      expect(height).toBeGreaterThanOrEqual(100);
    });
  });
});

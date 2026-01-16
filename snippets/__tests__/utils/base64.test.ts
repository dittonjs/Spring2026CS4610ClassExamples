import { decodeBase64, isValidBase64 } from '@/app/_utils/base64';

describe('base64 utilities', () => {
  describe('decodeBase64', () => {
    it('should decode a valid base64 string', () => {
      const encoded = Buffer.from('console.log("Hello, World!");').toString('base64');
      const decoded = decodeBase64(encoded);
      expect(decoded).toBe('console.log("Hello, World!");');
    });

    it('should decode a base64 string with special characters', () => {
      const code = 'function test() {\n  return "test";\n}';
      const encoded = Buffer.from(code).toString('base64');
      const decoded = decodeBase64(encoded);
      expect(decoded).toBe(code);
    });

    it('should decode URL-safe base64 strings', () => {
      const code = 'const x = 1 + 2;';
      const encoded = Buffer.from(code).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
      const decoded = decodeBase64(encoded);
      expect(decoded).toBe(code);
    });

    it('should handle empty string', () => {
      const encoded = Buffer.from('').toString('base64');
      const decoded = decodeBase64(encoded);
      expect(decoded).toBe('');
    });

    it('should throw an error for invalid base64 string', () => {
      expect(() => decodeBase64('invalid-base64!!!')).toThrow();
    });

    it('should throw an error for non-base64 characters', () => {
      expect(() => decodeBase64('hello@world#test')).toThrow();
    });

    it('should throw an error for null or undefined', () => {
      expect(() => decodeBase64(null as any)).toThrow();
      expect(() => decodeBase64(undefined as any)).toThrow();
    });
  });

  describe('isValidBase64', () => {
    it('should return true for valid base64 strings', () => {
      const valid = Buffer.from('test').toString('base64');
      expect(isValidBase64(valid)).toBe(true);
    });

    it('should return true for URL-safe base64 strings', () => {
      const valid = Buffer.from('test').toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
      expect(isValidBase64(valid)).toBe(true);
    });

    it('should return false for invalid base64 strings', () => {
      expect(isValidBase64('invalid!!!')).toBe(false);
      expect(isValidBase64('hello@world')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidBase64('')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isValidBase64(null as any)).toBe(false);
      expect(isValidBase64(undefined as any)).toBe(false);
    });
  });
});

import { loadTheme, getDefaultTheme, isValidTheme, type ThemeName } from '@/app/_utils/themes';

describe('theme utilities', () => {
  describe('loadTheme', () => {
    it('should load usu-light theme', () => {
      const theme = loadTheme('usu-light');
      expect(theme).toBeDefined();
      expect(theme.name).toBe('usu-light');
      expect(theme.type).toBe('light');
    });

    it('should load usu-dark theme', () => {
      const theme = loadTheme('usu-dark');
      expect(theme).toBeDefined();
      expect(theme.name).toBe('usu-dark');
      expect(theme.type).toBe('dark');
    });

    it('should return usu-light theme for invalid theme name', () => {
      const theme = loadTheme('invalid' as ThemeName);
      expect(theme.name).toBe('usu-light');
    });
  });

  describe('getDefaultTheme', () => {
    it('should return usu-light for light type', () => {
      expect(getDefaultTheme('light')).toBe('usu-light');
    });

    it('should return usu-dark for dark type', () => {
      expect(getDefaultTheme('dark')).toBe('usu-dark');
    });
  });

  describe('isValidTheme', () => {
    it('should return true for usu-light', () => {
      expect(isValidTheme('usu-light')).toBe(true);
    });

    it('should return true for usu-dark', () => {
      expect(isValidTheme('usu-dark')).toBe(true);
    });

    it('should return false for invalid theme names', () => {
      expect(isValidTheme('github-dark')).toBe(false);
      expect(isValidTheme('light')).toBe(false);
      expect(isValidTheme('dark')).toBe(false);
      expect(isValidTheme('')).toBe(false);
      expect(isValidTheme('invalid')).toBe(false);
    });
  });
});

import type { ThemeRegistration } from 'shiki';
import usuLightTheme from '../themes/usu-light.json';
import usuDarkTheme from '../themes/usu-dark.json';

/**
 * Available theme names
 */
export type ThemeName = 'usu-light' | 'usu-dark';

/**
 * Loads a custom USU theme for shiki
 * @param themeName - The name of the theme to load ('usu-light' or 'usu-dark')
 * @returns The theme registration object for shiki
 */
export function loadTheme(themeName: ThemeName): ThemeRegistration {
  switch (themeName) {
    case 'usu-light':
      return usuLightTheme as ThemeRegistration;
    case 'usu-dark':
      return usuDarkTheme as ThemeRegistration;
    default:
      return usuLightTheme as ThemeRegistration;
  }
}

/**
 * Gets the default theme based on the type
 * @param type - 'light' or 'dark'
 * @returns The theme name
 */
export function getDefaultTheme(type: 'light' | 'dark'): ThemeName {
  return type === 'light' ? 'usu-light' : 'usu-dark';
}

/**
 * Validates if a string is a valid theme name
 * @param theme - The theme string to validate
 * @returns True if valid, false otherwise
 */
export function isValidTheme(theme: string): theme is ThemeName {
  return theme === 'usu-light' || theme === 'usu-dark';
}

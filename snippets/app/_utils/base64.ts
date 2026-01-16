/**
 * Validates if a string contains only valid base64 characters.
 * Base64 can contain: A-Z, a-z, 0-9, +, /, = (padding), and - _ (URL-safe)
 */
function hasValidBase64Characters(str: string): boolean {
  // Base64 regex: allows A-Z, a-z, 0-9, +, /, =, -, _
  const base64Regex = /^[A-Za-z0-9+\/=\-_]*$/;
  return base64Regex.test(str);
}

/**
 * Validates if a string is valid base64 by attempting to decode it.
 *
 * @param str - The string to validate
 * @returns True if the string is valid base64, false otherwise
 */
export function isValidBase64(str: string | null | undefined): boolean {
  if (!str || typeof str !== 'string') {
    return false;
  }

  // Empty string is not valid base64
  if (str.length === 0) {
    return false;
  }

  // Check for valid base64 characters
  if (!hasValidBase64Characters(str)) {
    return false;
  }

  try {
    // Convert URL-safe base64 to standard base64
    const standardBase64 = str.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    const padded = standardBase64 + '='.repeat((4 - (standardBase64.length % 4)) % 4);

    // Try to decode
    const decoded = Buffer.from(padded, 'base64');

    // Re-encode to verify it's valid base64
    // If the re-encoded version (without padding) matches the original (without padding), it's valid
    const reencoded = decoded.toString('base64');
    const originalWithoutPadding = standardBase64.replace(/=+$/, '');
    const reencodedWithoutPadding = reencoded.replace(/=+$/, '');

    // The re-encoded version should match the original
    return originalWithoutPadding === reencodedWithoutPadding;
  } catch {
    return false;
  }
}

/**
 * Decodes a base64 string to its original text.
 * Handles both standard and URL-safe base64 encoding.
 *
 * @param encoded - The base64 encoded string
 * @returns The decoded string
 * @throws Error if the input is not valid base64
 */
export function decodeBase64(encoded: string): string {
  if (encoded === null || encoded === undefined || typeof encoded !== 'string') {
    throw new Error('Invalid base64 input: must be a non-empty string');
  }

  // Empty string is valid (decodes to empty string)
  if (encoded.length === 0) {
    return '';
  }

  // Validate before attempting to decode
  if (!isValidBase64(encoded)) {
    throw new Error('Invalid base64 string');
  }

  try {
    // Convert URL-safe base64 to standard base64
    const standardBase64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    const padded = standardBase64 + '='.repeat((4 - (standardBase64.length % 4)) % 4);

    // Decode
    const decoded = Buffer.from(padded, 'base64').toString('utf-8');
    return decoded;
  } catch (error) {
    throw new Error(`Failed to decode base64: ${error instanceof Error ? error.message : 'Invalid base64 string'}`);
  }
}

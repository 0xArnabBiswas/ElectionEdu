/**
 * @module sanitize
 * @description Input sanitization utilities for security.
 * Prevents XSS by escaping HTML entities in user input.
 */

/**
 * Escapes HTML entities in a string to prevent XSS attacks.
 * @param {string} str - Raw user input
 * @returns {string} Sanitized string safe for DOM insertion
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Strips HTML tags from a string.
 * @param {string} str - String potentially containing HTML
 * @returns {string} Plain text without HTML tags
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Trims and limits string length.
 * @param {string} str - Input string
 * @param {number} [maxLength=500] - Maximum allowed length
 * @returns {string} Trimmed and truncated string
 */
export function trimAndLimit(str, maxLength = 500) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

/**
 * Full sanitization pipeline for user chat input.
 * @param {string} input - Raw user input
 * @returns {string} Fully sanitized input
 */
export function sanitizeChatInput(input) {
  return sanitizeInput(trimAndLimit(stripHtml(input), 500));
}

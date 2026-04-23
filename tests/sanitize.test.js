/**
 * @file Sanitization module unit tests
 * @description Tests for XSS prevention and input sanitization.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeInput, stripHtml, trimAndLimit, sanitizeChatInput } from '../modules/sanitize.js';

describe('sanitizeInput', () => {
  it('escapes HTML angle brackets', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    );
  });

  it('escapes ampersands', () => {
    expect(sanitizeInput('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput(123)).toBe('');
  });

  it('leaves safe text unchanged', () => {
    expect(sanitizeInput('Hello world')).toBe('Hello world');
  });
});

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<b>bold</b> text')).toBe('bold text');
  });

  it('handles nested tags', () => {
    expect(stripHtml('<div><p>nested</p></div>')).toBe('nested');
  });

  it('returns empty string for non-string input', () => {
    expect(stripHtml(42)).toBe('');
  });
});

describe('trimAndLimit', () => {
  it('trims whitespace', () => {
    expect(trimAndLimit('  hello  ')).toBe('hello');
  });

  it('limits string length', () => {
    const long = 'a'.repeat(600);
    expect(trimAndLimit(long, 500).length).toBe(500);
  });

  it('returns empty string for non-string input', () => {
    expect(trimAndLimit(null)).toBe('');
  });
});

describe('sanitizeChatInput', () => {
  it('applies full sanitization pipeline', () => {
    const malicious = '  <img onerror="alert(1)">Hello & goodbye  ';
    const result = sanitizeChatInput(malicious);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).toContain('&amp;');
  });
});

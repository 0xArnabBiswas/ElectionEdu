/**
 * @file Eligibility module unit tests
 * @description Tests for voter eligibility checking logic.
 */

import { describe, it, expect } from 'vitest';
import { checkEligibility } from '../modules/eligibility.js';

describe('checkEligibility', () => {
  it('returns eligible for an 18+ Indian citizen', () => {
    const result = checkEligibility({ age: 25, citizenship: 'indian', registered: 'no' });
    expect(result.eligible).toBe(true);
    expect(result.message).toContain('Eligible');
  });

  it('returns all-set for registered voter', () => {
    const result = checkEligibility({ age: 30, citizenship: 'indian', registered: 'yes' });
    expect(result.eligible).toBe(true);
    expect(result.message).toContain('All Set');
  });

  it('returns not eligible for under 18', () => {
    const result = checkEligibility({ age: 16, citizenship: 'indian', registered: 'no' });
    expect(result.eligible).toBe(false);
    expect(result.message).toContain('Not Yet');
  });

  it('returns not eligible for non-Indian citizen', () => {
    const result = checkEligibility({ age: 25, citizenship: 'other', registered: 'no' });
    expect(result.eligible).toBe(false);
    expect(result.message).toContain('Not Eligible');
  });

  it('handles invalid input gracefully', () => {
    const result = checkEligibility(null);
    expect(result.eligible).toBe(false);
    expect(result.message).toContain('Invalid');
  });

  it('handles missing age', () => {
    const result = checkEligibility({ citizenship: 'indian', registered: 'no' });
    expect(result.eligible).toBe(false);
  });

  it('returns eligible for exactly 18 years old', () => {
    const result = checkEligibility({ age: 18, citizenship: 'indian', registered: 'no' });
    expect(result.eligible).toBe(true);
  });
});

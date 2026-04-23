import { describe, it, expect } from 'vitest';
import { TIMELINE_DATA } from '../modules/timeline.js';

describe('Timeline Module', () => {
  it('contains exactly 7 phases', () => {
    expect(TIMELINE_DATA.length).toBe(7);
  });

  it('has correctly structured phase data', () => {
    const phase1 = TIMELINE_DATA[0];
    expect(phase1).toHaveProperty('phase', 1);
    expect(phase1).toHaveProperty('icon');
    expect(phase1).toHaveProperty('title');
    expect(phase1).toHaveProperty('summary');
    expect(phase1).toHaveProperty('details');
    expect(phase1.details).toHaveProperty('heading');
    expect(Array.isArray(phase1.details.points)).toBe(true);
  });

  it('maintains sequential phase numbers', () => {
    TIMELINE_DATA.forEach((item, index) => {
      expect(item.phase).toBe(index + 1);
    });
  });
});

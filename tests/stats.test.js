import { describe, it, expect } from 'vitest';
import { STATS_DATA } from '../modules/stats.js';

describe('Stats Module', () => {
  it('contains correctly structured stats data', () => {
    expect(STATS_DATA.length).toBeGreaterThan(0);
    const stat = STATS_DATA[0];
    expect(stat).toHaveProperty('icon');
    expect(stat).toHaveProperty('value');
    expect(typeof stat.value).toBe('number');
    expect(stat).toHaveProperty('suffix');
    expect(stat).toHaveProperty('label');
  });

  it('has valid numerical values for all stats', () => {
    STATS_DATA.forEach((stat) => {
      expect(stat.value).toBeGreaterThan(0);
    });
  });
});

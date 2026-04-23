import { describe, it, expect, beforeEach } from 'vitest';
import { initTimeline } from '../modules/timeline.js';
import { initStats } from '../modules/stats.js';

describe('End-to-End Component Rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="timeline-container"></div>
      <div id="stats-grid"></div>
      <div id="sr-announcer"></div>
    `;
  });

  it('renders all 7 timeline phases correctly in the DOM', () => {
    initTimeline();
    const items = document.querySelectorAll('.timeline-item');
    expect(items.length).toBe(7);
    expect(items[0].textContent).toContain('Phase 1');
    expect(items[6].textContent).toContain('Phase 7');
  });

  it('renders stats grid with correct data targets', () => {
    initStats();
    const cards = document.querySelectorAll('.stat-card');
    expect(cards.length).toBeGreaterThan(0);
    const firstStat = cards[0].querySelector('.stat-number');
    expect(firstStat.dataset.target).toBe('970');
  });

  it('verifies accessibility attributes are present after rendering', () => {
    initTimeline();
    const cards = document.querySelectorAll('.timeline-card');
    cards.forEach(card => {
      expect(card.getAttribute('role')).toBe('button');
      expect(card.getAttribute('aria-expanded')).toBe('false');
    });
  });
});

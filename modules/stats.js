/**
 * @module stats
 * @description Animated statistics counters with Intersection Observer.
 * Counts up numbers when scrolled into view for a dynamic feel.
 */

/** @type {Array<{icon:string, value:number, suffix:string, label:string}>} */
const STATS_DATA = [
  { icon: '🗳️', value: 970, suffix: 'M+', label: 'Registered Voters' },
  { icon: '🏛️', value: 543, suffix: '', label: 'Lok Sabha Constituencies' },
  { icon: '📍', value: 1, suffix: 'M+', label: 'Polling Stations' },
  { icon: '🎯', value: 8000, suffix: '+', label: 'Candidates (2024)' },
  { icon: '🗓️', value: 44, suffix: '', label: 'Days of Polling (2024)' },
  { icon: '🏳️', value: 750, suffix: '+', label: 'Political Parties' },
];

/**
 * Renders the stats grid and sets up Intersection Observer for count-up animation.
 */
export function initStats() {
  const grid = document.getElementById('stats-grid');
  if (!grid) return;

  grid.innerHTML = '';
  STATS_DATA.forEach((stat) => {
    const card = document.createElement('div');
    card.className = 'glass-card stat-card reveal';
    card.innerHTML = `
      <div class="stat-icon" aria-hidden="true">${stat.icon}</div>
      <div class="stat-number" data-target="${stat.value}">0</div>
      <div class="stat-suffix">${stat.suffix}</div>
      <div class="stat-label">${stat.label}</div>
    `;
    grid.appendChild(card);
  });

  observeStats();
}

function observeStats() {
  const cards = document.querySelectorAll('.stat-card');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const numEl = entry.target.querySelector('.stat-number');
          if (numEl) animateCounter(numEl);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  cards.forEach((card) => observer.observe(card));
}

/**
 * Animates a number from 0 to its target value.
 * @param {HTMLElement} el - Element with data-target attribute
 */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

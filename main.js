/**
 * @module main
 * @description Application entry point. Initializes all modules,
 * sets up navigation, scroll observers, and hero stat animations.
 */

import { initParticles } from './modules/particles.js';
import { initTimeline } from './modules/timeline.js';
import { initChatbot } from './modules/chatbot.js';
import { initQuiz } from './modules/quiz.js';
import { initEligibility } from './modules/eligibility.js';
import { initStats } from './modules/stats.js';

/**
 * Bootstraps the application when DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavigation();
  initHeroStats();
  initTimeline();
  initQuiz();
  initEligibility();
  initStats();
  initChatbot();
  initRevealAnimations();
});

/** Sets up sticky navbar, mobile menu toggle, and active link highlighting. */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  // Scroll — add background to navbar
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu on link click
  navItems.forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link highlighting based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((link) => link.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { threshold: 0.3 }
  );
  sections.forEach((section) => observer.observe(section));
}

/** Animates the hero stat numbers on page load. */
function initHeroStats() {
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  statNumbers.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
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
  });
}

/** Sets up Intersection Observer for scroll-reveal animations. */
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  elements.forEach((el) => observer.observe(el));
}

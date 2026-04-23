/**
 * @module particles
 * @description Canvas-based particle background animation.
 * Uses requestAnimationFrame and pauses when tab is hidden for efficiency.
 */

/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
/** @type {Array<{x:number,y:number,vx:number,vy:number,r:number,alpha:number}>} */
let particles = [];
let animationId = null;
let isVisible = true;

const PARTICLE_COUNT = 60;
const MAX_DISTANCE = 120;
const COLORS = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(245,158,11,'];

/**
 * Initializes the particle canvas animation.
 */
export function initParticles() {
  canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resize();
  createParticles();
  animate();

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', handleVisibility);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
}

function animate() {
  if (!isVisible) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DISTANCE) {
        const lineAlpha = (1 - dist / MAX_DISTANCE) * 0.15;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(124,58,237,${lineAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  animationId = requestAnimationFrame(animate);
}

/** @description Pauses animation when tab is hidden for efficiency */
function handleVisibility() {
  isVisible = !document.hidden;
  if (isVisible && !animationId) {
    animationId = requestAnimationFrame(animate);
  }
}

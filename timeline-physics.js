/* Scroll-led timeline indicator: scroll is the only source of motion. */
(() => {
  'use strict';
  const diagram = document.getElementById('tenseDiagram');
  if (!diagram) return;
  const svg = diagram.querySelector('svg');
  const path = diagram.querySelector('.spine-path');
  const glow = diagram.querySelector('.spine-glow');
  const dots = [...diagram.querySelectorAll('.timeline-dot')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let target = 0;
  let progress = 0;
  let raf = 0;
  let lastTime = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const apply = value => {
    progress = clamp(value, 0, 1);
    const dash = 1 - progress;
    path.style.strokeDashoffset = String(dash);
    glow.style.strokeDashoffset = String(dash);
    diagram.dataset.timelineProgress = String(progress);
    diagram.dataset.timelineVelocity = '0';
    diagram.classList.toggle('in-view', progress > .02);
    dots.forEach((dot, index) => dot.classList.toggle('active', index <= Math.floor(progress * 2 + .04)));
    if (svg) svg.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
  };

  const loop = now => {
    raf = 0;
    const dt = Math.min(.05, Math.max(.001, (now - (lastTime || now)) / 1000));
    lastTime = now;
    const alpha = reduce.matches ? 1 : 1 - Math.exp(-10 * dt);
    const next = progress + (target - progress) * alpha;
    apply(Math.abs(target - next) < .0007 ? target : next);
    if (Math.abs(target - progress) > .0007) raf = requestAnimationFrame(loop);
  };
  const wake = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const setScrollProgress = value => {
    target = clamp(Number(value) || 0, 0, 1);
    if (reduce.matches) apply(target);
    else wake();
  };

  window.timelinePhysics = { setScrollProgress };
  if (svg) {
    svg.removeAttribute('tabindex');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Scroll progress timeline from past to present to future.');
  }
  new ResizeObserver(() => apply(progress)).observe(svg);
  apply(0);
})();

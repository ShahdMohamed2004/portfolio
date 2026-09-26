/* Supplied glass-nav motion: pointer light, sheen replay, and menu state sync. */
(() => {
  'use strict';
  const glass = document.getElementById('siteHeader');
  if (!glass) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  glass.classList.add('glass');
  glass.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reduced.matches || frame) return;
    frame = requestAnimationFrame(() => {
      const rect = glass.getBoundingClientRect();
      glass.style.setProperty('--x', `${event.clientX - rect.left}px`);
      glass.style.setProperty('--y', `${event.clientY - rect.top}px`);
      frame = 0;
    });
  }, { passive: true });
  glass.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame); frame = 0;
    glass.style.removeProperty('--x'); glass.style.removeProperty('--y');
  }, { passive: true });
  glass.addEventListener('mouseenter', () => {
    if (!reduced.matches) {
      glass.classList.remove('is-sheening');
      void glass.offsetWidth;
      glass.classList.add('is-sheening');
    }
  }, { passive: true });
  glass.addEventListener('animationend', event => {
    if (event.animationName === 'glassSheen') glass.classList.remove('is-sheening');
  });
  const syncMenu = () => glass.classList.toggle('open', document.body.classList.contains('menu-open'));
  new MutationObserver(syncMenu).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  syncMenu();
})();

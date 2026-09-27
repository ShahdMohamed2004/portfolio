/* Motion Dock controller — no dependencies, pointer-safe, RTL-aware. */
(() => {
  'use strict';

  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const docks = new Set();
  let frame = 0;
  let pointer = null;

  const itemSelectors = [
    '#siteHeader .nav-links',
    '#siteHeader .nav-utility',
    '#siteHeader .mini-control-pill',
    '#mobileMenu',
    '#mobileMenu .mobile-menu-utility',
    '#work .work-filters',
  ];

  function itemElements(dock) {
    return [...dock.children].filter(item => {
      if (item.matches('.mm-divider, .mobile-menu-close')) return false;
      return item.matches('a, button, .work-filter, .lang-toggle, .theme-toggle, [role="button"]');
    });
  }

  function register(dock) {
    if (!dock || docks.has(dock)) return;
    const items = itemElements(dock);
    if (!items.length) return;
    dock.classList.add('motion-dock');
    items.forEach((item, index) => {
      item.classList.add('dock-item');
      item.style.setProperty('--dock-index', index);
    });
    docks.add(dock);
  }

  function registerAll() {
    itemSelectors.forEach(selector => document.querySelectorAll(selector).forEach(register));
  }

  function clearDock(dock) {
    itemElements(dock).forEach(item => {
      item.style.removeProperty('--dock-scale');
      item.style.removeProperty('--dock-lift');
      item.style.removeProperty('--dock-shift');
      item.style.removeProperty('--dock-depth');
      item.style.removeProperty('will-change');
    });
    dock.classList.remove('motion-dock-active');
  }

  function clearAll() {
    docks.forEach(clearDock);
  }

  function update() {
    frame = 0;
    if (!pointer || reducedQuery.matches || !finePointerQuery.matches) {
      clearAll();
      return;
    }

    docks.forEach(dock => {
      const items = itemElements(dock);
      const dockRect = dock.getBoundingClientRect();
      if (!items.length || !dock.isConnected || !dockRect.width || !dockRect.height ||
          dockRect.bottom < -240 || dockRect.top > window.innerHeight + 240) {
        clearDock(dock);
        return;
      }
      let closest = Infinity;
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const axisDistance = dock.id === 'mobileMenu' ? Math.abs(pointer.y - centerY) : Math.abs(pointer.x - centerX);
        closest = Math.min(closest, axisDistance);
        const radius = dock.id === 'mobileMenu' ? Math.max(112, rect.height * 3.8) : Math.max(124, rect.width * 2.6);
        const proximity = clamp(1 - axisDistance / radius, 0, 1);
        const scale = 1 + proximity * .23;
        const lift = dock.id === 'mobileMenu' ? 0 : -proximity * 5;
        const shift = dock.id === 'mobileMenu' ? (pointer.x < centerX ? proximity * 5 : -proximity * 5) : 0;
        item.style.setProperty('--dock-scale', scale.toFixed(3));
        item.style.setProperty('--dock-lift', `${lift.toFixed(2)}px`);
        item.style.setProperty('--dock-shift', `${shift.toFixed(2)}px`);
        item.style.setProperty('--dock-depth', proximity.toFixed(3));
        if (proximity > .02) item.style.setProperty('will-change', 'transform');
        else item.style.removeProperty('will-change');
      });
      dock.classList.toggle('motion-dock-active', closest < 220);
    });
  }

  function queue() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function onPointerMove(event) {
    pointer = { x: event.clientX, y: event.clientY };
    queue();
  }

  function onPointerLeave() {
    pointer = null;
    queue();
  }

  function boot() {
    registerAll();
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    document.addEventListener('pointerout', event => {
      if (!event.relatedTarget) onPointerLeave();
    }, { passive: true });
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', () => { registerAll(); queue(); }, { passive: true });
    const observer = new MutationObserver(() => { registerAll(); queue(); });
    observer.observe(document.body, { childList: true, subtree: true });
    reducedQuery.addEventListener?.('change', () => { if (reducedQuery.matches) clearAll(); });
    finePointerQuery.addEventListener?.('change', () => { if (!finePointerQuery.matches) clearAll(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();

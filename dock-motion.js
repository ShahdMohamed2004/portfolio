/* A single, header-local controller. No document pointer tracking or scroll loop. */
(() => {
  'use strict';
  const header = document.getElementById('siteHeader');
  if (!header || header.dataset.dockReady) return;
  header.dataset.dockReady = 'true';
  const events = new AbortController();
  const options = { passive: true, signal: events.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const items = [...header.querySelectorAll('.nav-links > a, .nav-utility a, .nav-utility button')]
    .map(node => ({ node, x: 0, y: 0, scale: 1, tx: 0, ty: 0, ts: 1, rect: null }));
  items.forEach(item => item.node.classList.add('dock-control'));
  let bounds, raf = 0, last = 0, inside = false;
  const enabled = () => fine.matches && !reduced.matches && !document.hidden;
  const state = value => { if (header.dataset.dockState !== value) header.dataset.dockState = value; };
  state('RESTING');

  // All reads happen together, only on entry or an actual layout change.
  function measure() {
    bounds = header.getBoundingClientRect();
    items.forEach(item => {
      const r = item.node.getBoundingClientRect();
      item.rect = { x: r.left + r.width / 2 - bounds.left - item.x,
        y: r.top + r.height / 2 - bounds.top - item.y,
        visible: r.width > 0 && r.height > 0 && item.node.getClientRects().length > 0 };
    });
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick(now) {
    raf = 0;
    if (!enabled()) { rest(true); return; }
    const amount = 1 - Math.exp(-(last ? now - last : 16.67) / 42);
    last = now;
    let moving = false;
    for (const item of items) {
      item.x += (item.tx - item.x) * amount;
      item.y += (item.ty - item.y) * amount;
      item.scale += (item.ts - item.scale) * amount;
      const settled = Math.abs(item.tx - item.x) < .015 && Math.abs(item.ty - item.y) < .015 && Math.abs(item.ts - item.scale) < .0005;
      if (settled) { item.x = item.tx; item.y = item.ty; item.scale = item.ts; }
      else moving = true;
      if (item.x === 0 && item.y === 0 && item.scale === 1) {
        item.node.style.removeProperty('translate');
        item.node.style.removeProperty('scale');
      } else {
        item.node.style.translate = `${item.x.toFixed(3)}px ${item.y.toFixed(3)}px`;
        item.node.style.scale = item.scale.toFixed(4);
      }
      item.node.style.willChange = settled ? '' : 'translate, scale';
    }
    if (moving) schedule();
    else { last = 0; if (!inside) state('RESTING'); }
  }
  function rest(immediate = false) {
    inside = false;
    header.classList.remove('is-sheening');
    header.style.removeProperty('--x'); header.style.removeProperty('--y');
    let displaced = false;
    for (const item of items) {
      item.tx = item.ty = 0; item.ts = 1;
      displaced ||= item.x !== 0 || item.y !== 0 || item.scale !== 1;
      if (immediate) {
        item.x = item.y = 0; item.scale = 1;
        ['translate', 'scale', 'will-change'].forEach(key => item.node.style.removeProperty(key));
      }
    }
    if (immediate || !displaced) { cancelAnimationFrame(raf); raf = last = 0; state('RESTING'); }
    else { state('RETURNING'); schedule(); }
  }
  function move(event) {
    if (!enabled() || event.pointerType !== 'mouse') return;
    if (!bounds) measure();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) { rest(); return; }
    inside = true; state('ACTIVE');
    let changed = false;
    for (const item of items) {
      const proximity = item.rect.visible ? Math.max(0, 1 - Math.hypot(x - item.rect.x, y - item.rect.y) / 90) : 0;
      const tx = clamp((x - item.rect.x) * .025, -2, 2) * proximity;
      const ty = -2 * proximity;
      const ts = 1 + .045 * proximity;
      if (Math.abs(item.tx - tx) > .015 || Math.abs(item.ty - ty) > .015 || Math.abs(item.ts - ts) > .0005) {
        item.tx = tx; item.ty = ty; item.ts = ts; changed = true;
      }
    }
    if (changed) schedule();
  }
  header.addEventListener('pointerenter', event => {
    if (!enabled() || event.pointerType !== 'mouse') return;
    measure();
    header.classList.add('is-sheening');
    move(event);
  }, options);
  header.addEventListener('pointermove', move, options);
  header.addEventListener('pointerleave', () => rest(), options);
  header.addEventListener('pointercancel', () => rest(), options);
  header.addEventListener('animationend', event => { if (event.animationName === 'glassSheen') header.classList.remove('is-sheening'); }, options);
  const invalidate = () => { rest(true); bounds = null; };
  // Measure on the next actual interaction, never inside a scroll callback.
  header.addEventListener('pointerover', event => { if (!bounds && enabled()) { measure(); move(event); } }, options);
  const resize = new ResizeObserver(invalidate);
  resize.observe(header);
  items.forEach(item => resize.observe(item.node));
  const locale = new MutationObserver(invalidate);
  locale.observe(document.documentElement, { attributes: true, attributeFilter: ['dir', 'lang'] });
  window.addEventListener('resize', invalidate, options);
  window.addEventListener('blur', () => rest(true), options);
  document.addEventListener('visibilitychange', () => { if (document.hidden) rest(true); }, options);
  reduced.addEventListener('change', invalidate, options);
  fine.addEventListener('change', invalidate, options);
  window.addEventListener('pagehide', event => {
    rest(true);
    if (!event.persisted) { events.abort(); resize.disconnect(); locale.disconnect(); delete header.dataset.dockReady; }
  }, options);
})();

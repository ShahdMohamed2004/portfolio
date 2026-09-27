/* Drawer state only. Pointer motion belongs exclusively to dock-motion.js. */
(() => {
  'use strict';
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const sync = () => header.classList.toggle('open', document.body.classList.contains('menu-open'));
  const observer = new MutationObserver(sync);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('pagehide', event => { if (!event.persisted) observer.disconnect(); });
  sync();
})();

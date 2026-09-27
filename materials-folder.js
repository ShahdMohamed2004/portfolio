(() => {
  'use strict';

  const init = () => {
    const section = document.getElementById('materials');
    const grid = document.getElementById('materialsGrid');
    if (!section || !grid || section.dataset.folderInteractionReady === 'true') return;
    section.dataset.folderInteractionReady = 'true';

    let overlay = null;
    let activeCard = null;
    let activeUrl = '';
    let closeTimer = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const copy = () => document.documentElement.lang === 'ar'
      ? { kicker: 'أرشيف المواد التعليمية', status: 'جاري فتح المستند…', open: 'فتح المادة', close: 'إغلاق', cancel: 'العودة إلى المواد', dialog: 'معاينة المادة التعليمية' }
      : { kicker: 'TEACHING MATERIALS ARCHIVE', status: 'Opening selected material…', open: 'Open material', close: 'Close', cancel: 'Back to materials', dialog: 'Teaching material preview' };

    const ensureOverlay = () => {
      if (overlay) return overlay;
      overlay = document.createElement('div');
      overlay.className = 'materials-folder-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = `
        <button class="materials-folder-backdrop" type="button" aria-label="Close preview"></button>
        <div class="materials-folder-dialog" role="dialog" aria-modal="true" aria-labelledby="materialsFolderTitle">
          <button class="materials-folder-close" type="button" aria-label="Close preview">×</button>
          <div class="materials-folder-stage" aria-hidden="true">
            <div class="materials-folder">
              <span class="materials-folder-tab"></span>
              <span class="materials-folder-rear"></span>
              <span class="materials-folder-page"></span>
              <span class="materials-folder-front"></span>
            </div>
          </div>
          <div class="materials-folder-copy">
            <span class="materials-folder-kicker"></span>
            <strong class="materials-folder-title" id="materialsFolderTitle"></strong>
            <span class="materials-folder-status" role="status" aria-live="polite"></span>
            <div class="materials-folder-actions">
              <a class="materials-folder-open" href="#"></a>
              <button class="materials-folder-cancel" type="button"></button>
            </div>
          </div>
        </div>`;
      section.appendChild(overlay);
      overlay.querySelectorAll('.materials-folder-backdrop, .materials-folder-close, .materials-folder-cancel').forEach(node => node.addEventListener('click', close));
      overlay.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
      return overlay;
    };

    const updateCopy = (title) => {
      const text = copy();
      overlay.querySelector('.materials-folder-kicker').textContent = text.kicker;
      overlay.querySelector('.materials-folder-title').textContent = title;
      overlay.querySelector('.materials-folder-status').textContent = text.status;
      overlay.querySelector('.materials-folder-open').textContent = text.open;
      overlay.querySelector('.materials-folder-open').setAttribute('aria-label', `${text.open}: ${title}`);
      overlay.querySelector('.materials-folder-cancel').textContent = text.cancel;
      overlay.querySelector('.materials-folder-close').setAttribute('aria-label', text.close);
      overlay.querySelector('.materials-folder-backdrop').setAttribute('aria-label', text.close);
      overlay.querySelector('.materials-folder-dialog').setAttribute('aria-label', text.dialog);
    };

    function open(card) {
      const href = card.getAttribute('href');
      if (!href || href === '#') return;
      activeCard = card;
      activeUrl = href;
      const title = card.querySelector('.mname')?.textContent.trim() || '';
      ensureOverlay();
      const cardRect = card.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const folderWidth = Math.min(window.innerWidth * (window.innerWidth <= 600 ? .82 : .72), window.innerWidth <= 600 ? 350 : 390);
      const folderHeight = folderWidth / 1.38;
      overlay.style.setProperty('--folder-origin-x', `${cardRect.left + cardRect.width / 2 - viewportCenterX}px`);
      overlay.style.setProperty('--folder-origin-y', `${cardRect.top + cardRect.height / 2 - viewportCenterY}px`);
      overlay.style.setProperty('--folder-origin-scale', `${Math.max(.42, Math.min(1, Math.min(cardRect.width / folderWidth, cardRect.height / folderHeight)))}`);
      overlay.dataset.folderOrigin = card.dataset.materialName || title;
      updateCopy(title);
      overlay.querySelector('.materials-folder-open').href = href;
      overlay.setAttribute('aria-hidden', 'false');
      overlay.classList.add('is-open');
      activeCard.setAttribute('aria-expanded', 'true');
      document.body.classList.add('materials-folder-open');
      window.clearTimeout(closeTimer);
      // The folder is the transition: let it rise and settle before entering Drive.
      closeTimer = window.setTimeout(() => {
        if (activeUrl && overlay.classList.contains('is-open')) window.location.assign(activeUrl);
      }, reducedMotion.matches ? 120 : 1050);
      window.setTimeout(() => overlay?.querySelector('.materials-folder-close')?.focus({ preventScroll: true }), reducedMotion.matches ? 20 : 420);
    }

    function close() {
      if (!overlay) return;
      window.clearTimeout(closeTimer);
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('materials-folder-open');
      if (activeCard) {
        activeCard.setAttribute('aria-expanded', 'false');
        activeCard.focus({ preventScroll: true });
      }
      activeCard = null;
      activeUrl = '';
    }

    grid.addEventListener('click', event => {
      const card = event.target.closest('.material-card');
      if (!card || !grid.contains(card)) return;
      event.preventDefault();
      open(card);
    });
    grid.addEventListener('keydown', event => {
      const card = event.target.closest('.material-card');
      if (!card || !grid.contains(card)) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(card);
      }
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  // Pointer-following ambient light remains independent of badge physics.
  let spotlightFrame = 0;
  let spotlightX = 50;
  let spotlightY = 18;
  const updateSpotlight = () => {
    spotlightFrame = 0;
    document.documentElement.style.setProperty('--spotlight-x', `${spotlightX}%`);
    document.documentElement.style.setProperty('--spotlight-y', `${spotlightY}%`);
  };
  window.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    spotlightX = event.clientX / Math.max(1, window.innerWidth) * 100;
    spotlightY = event.clientY / Math.max(1, window.innerHeight) * 100;
    if (!spotlightFrame) spotlightFrame = requestAnimationFrame(updateSpotlight);
  }, { passive: true });

  // Delegated project preview survives the site's language/filter re-rendering.
  const work = document.getElementById('workSpine');
  if (work) {
    const preview = document.createElement('div');
    preview.className = 'project-preview';
    preview.setAttribute('aria-hidden', 'true');
    document.body.appendChild(preview);
    let active = null;
    let previewWidth = 230;
    let previewFrame = 0;
    let pendingPoint = null;
    const detailsFor = target => target?.closest?.('.project-details');
    const positionPreview = () => {
      previewFrame = 0;
      if(!pendingPoint || !active || !finePointer.matches) return;
      const {x, y} = pendingPoint;
      preview.style.setProperty('--preview-x', `${clamp(x + 18, 16, window.innerWidth - previewWidth - 16)}px`);
      preview.style.setProperty('--preview-y', `${clamp(y + 18, 78, window.innerHeight - 150)}px`);
    };
    const queuePreviewPosition = (x, y) => {
      pendingPoint = {x, y};
      if(!previewFrame) previewFrame = requestAnimationFrame(positionPreview);
    };
    const showPreview = (details, x, y) => {
      if (!details) return;
      const title = details.querySelector('h3')?.textContent?.trim() || 'Project';
      const image = details.querySelector('img');
      preview.replaceChildren();
      preview.classList.toggle('has-image', Boolean(image));
      if (image) { const clone = image.cloneNode(true); clone.alt = ''; preview.appendChild(clone); }
      const strong = document.createElement('strong'); strong.textContent = title; preview.appendChild(strong);
      const span = document.createElement('span'); span.textContent = image ? 'Existing project visual' : 'Open the project card for details and links'; preview.appendChild(span);
      preview.classList.add('is-visible');
      previewWidth = preview.getBoundingClientRect().width;
      queuePreviewPosition(x, y);
      active = details;
    };
    const hidePreview = () => { preview.classList.remove('is-visible'); active = null; pendingPoint = null; };
    work.addEventListener('pointerover', event => { if (!finePointer.matches || reducedMotion.matches) return; const details = detailsFor(event.target); if (details) showPreview(details, event.clientX, event.clientY); });
    work.addEventListener('pointermove', event => { if (!active || !finePointer.matches) return; queuePreviewPosition(event.clientX, event.clientY); }, {passive:true});
    work.addEventListener('pointerout', event => { if (detailsFor(event.target) && !detailsFor(event.relatedTarget)) hidePreview(); });
    work.addEventListener('pointerup', event => { if (finePointer.matches) return; const details = detailsFor(event.target); if (details) showPreview(details, 0, 0); });
    work.addEventListener('focusin', event => { const details = detailsFor(event.target); if (details && !finePointer.matches) showPreview(details, 0, 0); });
    work.addEventListener('focusout', event => { if (!detailsFor(event.relatedTarget)) hidePreview(); });
    window.addEventListener('scroll', hidePreview, { passive: true });
  }

  const skills = document.getElementById('skillsGrid');
  if (skills) {
    const observer = new MutationObserver(() => skills.querySelectorAll('.skill-group li').forEach((item, index) => item.style.setProperty('--skill-delay', `${index * 35}ms`)));
    observer.observe(skills, { childList: true, subtree: true });
  }

  // Section navigation motion: replay a lightweight transition whenever a
  // user jumps to another section, including links rendered in the mobile drawer.
  const sectionMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sectionMotionTimers = new WeakMap();
  const replaySectionTransition = section => {
    if (!section || sectionMotionQuery.matches) return;
    section.classList.remove('section-entering');
    void section.offsetWidth;
    section.classList.add('section-entering');
    const previousTimer = sectionMotionTimers.get(section);
    if (previousTimer) window.clearTimeout(previousTimer);
    const timer = window.setTimeout(() => {
      section.classList.remove('section-entering');
      sectionMotionTimers.delete(section);
    }, 980);
    sectionMotionTimers.set(section, timer);
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-nav][href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target) window.setTimeout(() => replaySectionTransition(target), 80);
  }, { passive: true });
  sectionMotionQuery.addEventListener?.('change', () => {
    if (sectionMotionQuery.matches) document.querySelectorAll('.section-entering').forEach(section => section.classList.remove('section-entering'));
  });
})();

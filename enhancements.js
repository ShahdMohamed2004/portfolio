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
    const detailsFor = target => target?.closest?.('.project-details');
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
      const width = preview.getBoundingClientRect().width;
      preview.style.left = `${clamp(x + 18, 16, window.innerWidth - width - 16)}px`;
      preview.style.top = `${clamp(y + 18, 78, window.innerHeight - 150)}px`;
      active = details;
    };
    const hidePreview = () => { preview.classList.remove('is-visible'); active = null; };
    work.addEventListener('pointerover', event => { if (!finePointer.matches || reducedMotion.matches) return; const details = detailsFor(event.target); if (details) showPreview(details, event.clientX, event.clientY); });
    work.addEventListener('pointermove', event => { if (!active || !finePointer.matches) return; const width = preview.getBoundingClientRect().width; preview.style.left = `${clamp(event.clientX + 18, 16, window.innerWidth - width - 16)}px`; preview.style.top = `${clamp(event.clientY + 18, 78, window.innerHeight - 150)}px`; });
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
})();

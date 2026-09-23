(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  /* A small spring model keeps the badge attached to its resting point while
     preserving release momentum. All visual updates use one rAF loop. */
  const stage = document.querySelector('.badge-stage');
  const badge = document.querySelector('.id-badge');
  const lanyard = document.querySelector('.lanyard-path');
  const lanyardShadow = document.querySelector('.lanyard-shadow');
  const lanyardInner = document.querySelector('.lanyard-inner');
  if (stage && badge && lanyard && lanyardShadow && lanyardInner) {
    const state = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, dragging: false, pointerId: null, lastX: 0, lastY: 0, lastTime: 0, raf: 0 };
    const rest = { x: 0, y: 0 };
    const getBounds = () => {
      const rect = stage.getBoundingClientRect();
      const card = badge.getBoundingClientRect();
      return { rect, maxX: Math.max(12, (rect.width - card.width) / 2 - 5), maxY: Math.max(22, rect.height - card.height - 5) };
    };
    const updateLanyard = () => {
      const bounds = getBounds();
      const card = badge.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const anchorX = stageRect.width / 2;
      const anchorY = 16;
      const cardX = card.left - stageRect.left + card.width / 2;
      const cardY = card.top - stageRect.top + 7;
      const bend = (cardX - anchorX) * .34;
      const d = `M ${anchorX} ${anchorY} C ${anchorX + bend} ${anchorY + 34}, ${cardX - bend} ${Math.max(anchorY + 34, cardY - 38)}, ${cardX} ${cardY}`;
      lanyard.setAttribute('d', d);
      lanyardShadow.setAttribute('d', d);
      lanyardInner.setAttribute('d', d);
      const anchor = stage.querySelector('.lanyard-anchor');
      if (anchor) { anchor.setAttribute('cx', String(cardX)); anchor.setAttribute('cy', String(cardY)); }
      badge.style.transform = `translate3d(calc(-50% + ${state.x}px), ${state.y}px, 0) rotate(${state.angle}deg)`;
    };
    const frame = () => {
      state.raf = 0;
      const bounds = getBounds();
      if (!state.dragging && !reducedMotion.matches) {
        state.vx += (rest.x - state.x) * .075;
        state.vy += (rest.y - state.y) * .075;
        state.vx *= .83; state.vy *= .83;
        state.x += state.vx; state.y += state.vy;
        state.angle += ((state.vx * .18) - state.angle) * .12;
      } else if (!state.dragging) {
        state.x += (rest.x - state.x) * .2;
        state.y += (rest.y - state.y) * .2;
        state.angle *= .8;
      }
      state.x = clamp(state.x, -bounds.maxX, bounds.maxX);
      state.y = clamp(state.y, -10, bounds.maxY);
      state.angle = clamp(state.angle, -12, 12);
      updateLanyard();
      if (Math.abs(state.x) > .04 || Math.abs(state.y) > .04 || Math.abs(state.vx) > .04 || Math.abs(state.vy) > .04 || state.dragging) {
        state.raf = requestAnimationFrame(frame);
      }
    };
    const requestFrame = () => { if (!state.raf) state.raf = requestAnimationFrame(frame); };
    const pointerPosition = event => {
      const rect = stage.getBoundingClientRect();
      return { x: event.clientX - (rect.left + rect.width / 2), y: event.clientY - (rect.top + 54) };
    };
    badge.addEventListener('pointerdown', event => {
      if (event.button !== undefined && event.button !== 0) return;
      const p = pointerPosition(event);
      state.dragging = true; state.pointerId = event.pointerId; state.lastX = p.x; state.lastY = p.y; state.lastTime = performance.now();
      badge.classList.add('is-dragging');
      badge.setPointerCapture?.(event.pointerId);
      event.preventDefault(); requestFrame();
    });
    badge.addEventListener('pointermove', event => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const now = performance.now(); const p = pointerPosition(event); const dt = Math.max(8, now - state.lastTime);
      const bounds = getBounds();
      state.vx = clamp((p.x - state.lastX) / dt * 16, -12, 12);
      state.vy = clamp((p.y - state.lastY) / dt * 16, -12, 12);
      state.x = clamp(p.x, -bounds.maxX, bounds.maxX);
      state.y = clamp(p.y, -10, bounds.maxY);
      state.angle = clamp(state.vx * 1.5, -12, 12);
      state.lastX = p.x; state.lastY = p.y; state.lastTime = now;
      requestFrame();
    });
    const release = event => {
      if (!state.dragging || (event.pointerId !== undefined && event.pointerId !== state.pointerId)) return;
      state.dragging = false; state.pointerId = null; badge.classList.remove('is-dragging'); requestFrame();
    };
    badge.addEventListener('pointerup', release); badge.addEventListener('pointercancel', release); badge.addEventListener('lostpointercapture', release);
    badge.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const amount = event.shiftKey ? 18 : 8;
        state.x += event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0;
        state.y += event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0;
        const bounds = getBounds(); state.x = clamp(state.x, -bounds.maxX, bounds.maxX); state.y = clamp(state.y, -10, bounds.maxY);
        state.vx = state.vy = 0; requestFrame(); event.preventDefault();
      }
    });
    window.addEventListener('resize', updateLanyard, { passive: true });
    updateLanyard(); requestFrame();
  }

  /* Ambient light follows the pointer without touching layout or content. */
  let spotlightFrame = 0; let spotlightX = 50; let spotlightY = 18;
  const updateSpotlight = () => { spotlightFrame = 0; document.documentElement.style.setProperty('--spotlight-x', `${spotlightX}%`); document.documentElement.style.setProperty('--spotlight-y', `${spotlightY}%`); };
  window.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    spotlightX = event.clientX / Math.max(1, window.innerWidth) * 100;
    spotlightY = event.clientY / Math.max(1, window.innerHeight) * 100;
    if (!spotlightFrame) spotlightFrame = requestAnimationFrame(updateSpotlight);
  }, { passive: true });

  /* Project preview is delegated because the existing renderer refreshes cards
     when switching language or filters. It only displays real project images. */
  const work = document.getElementById('workSpine');
  if (work) {
    const preview = document.createElement('div');
    preview.className = 'project-preview'; preview.setAttribute('aria-hidden', 'true');
    document.body.appendChild(preview);
    let active = null;
    const detailsFor = target => target.closest?.('.project-details');
    const showPreview = (details, x, y) => {
      if (!details) return;
      const title = details.querySelector('h3')?.textContent?.trim() || 'Project';
      const image = details.querySelector('img');
      preview.replaceChildren(); preview.classList.toggle('has-image', Boolean(image));
      if (image) { const clone = image.cloneNode(true); clone.alt = ''; preview.appendChild(clone); }
      const strong = document.createElement('strong'); strong.textContent = title; preview.appendChild(strong);
      const span = document.createElement('span'); span.textContent = image ? 'Existing project visual' : 'Open the project card for details and links'; preview.appendChild(span);
      preview.style.left = `${clamp(x + 18, 16, window.innerWidth - preview.offsetWidth - 16)}px`;
      preview.style.top = `${clamp(y + 18, 78, window.innerHeight - 150)}px`;
      preview.classList.add('is-visible'); active = details;
    };
    const hidePreview = () => { preview.classList.remove('is-visible'); active = null; };
    work.addEventListener('pointerover', event => { if (!finePointer.matches || reducedMotion.matches) return; const details = detailsFor(event.target); if (details) showPreview(details, event.clientX, event.clientY); });
    work.addEventListener('pointermove', event => { if (!active || !finePointer.matches) return; preview.style.left = `${clamp(event.clientX + 18, 16, window.innerWidth - preview.offsetWidth - 16)}px`; preview.style.top = `${clamp(event.clientY + 18, 78, window.innerHeight - 150)}px`; });
    work.addEventListener('pointerout', event => { if (detailsFor(event.target) && !detailsFor(event.relatedTarget)) hidePreview(); });
    work.addEventListener('pointerup', event => { if (finePointer.matches) return; const details = detailsFor(event.target); if (details) showPreview(details, 0, 0); });
    work.addEventListener('focusin', event => { const details = detailsFor(event.target); if (details && !finePointer.matches) showPreview(details, 0, 0); });
    work.addEventListener('focusout', event => { if (!detailsFor(event.relatedTarget)) hidePreview(); });
    window.addEventListener('scroll', hidePreview, { passive: true });
  }

  /* Re-apply a gentle stagger whenever the language renderer replaces skills. */
  const skills = document.getElementById('skillsGrid');
  if (skills) {
    const observer = new MutationObserver(() => {
      skills.querySelectorAll('.skill-group li').forEach((item, index) => { item.style.setProperty('--skill-delay', `${index * 35}ms`); });
    });
    observer.observe(skills, { childList: true, subtree: true });
  }
})();

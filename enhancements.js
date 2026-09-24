(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const stage = document.querySelector('.badge-stage');
  const badge = document.querySelector('.id-badge');
  const lanyard = document.querySelector('.lanyard-path');
  const lanyardShadow = document.querySelector('.lanyard-shadow');
  const lanyardInner = document.querySelector('.lanyard-inner');
  const lanyardAnchor = stage?.querySelector('.lanyard-anchor');

  if (stage && badge && lanyard && lanyardShadow && lanyardInner) {
    /* One compact state represents the complete hanging system. The badge is
       pulled by a damped spring and an angular spring, like a light card on a
       flexible strap rather than an independently translated UI element. */
    const state = {
      x: 0, y: 0, vx: 0, vy: 0,
      angle: 0, angularVelocity: 0,
      dragging: false, pointerId: null,
      grabOffsetX: 0, grabOffsetY: 0,
      lastPointerX: 0, lastPointerY: 0, lastTime: 0,
      raf: 0, lastFrame: 0
    };
    const metrics = { width: 0, height: 0, badgeWidth: 0, badgeHeight: 0, maxX: 0, maxY: 0, top: 54, anchorX: 0 };
    const rest = { x: 0, y: 0, angle: 0 };

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      metrics.width = stageRect.width;
      metrics.height = stageRect.height;
      metrics.badgeWidth = badge.offsetWidth;
      metrics.badgeHeight = badge.offsetHeight;
      metrics.maxX = Math.max(8, (metrics.width - metrics.badgeWidth) / 2 - 4);
      metrics.maxY = Math.max(8, metrics.height - metrics.top - metrics.badgeHeight - 5);
      metrics.anchorX = metrics.width / 2;
      state.x = clamp(state.x, -metrics.maxX, metrics.maxX);
      state.y = clamp(state.y, -8, metrics.maxY);
    };

    const updateLanyard = () => {
      const attachmentX = metrics.anchorX + state.x;
      // The endpoint is the badge's real top attachment slot, not its center.
      const attachmentY = metrics.top + state.y + 7;
      const dx = attachmentX - metrics.anchorX;
      const dy = Math.max(38, attachmentY - 16);
      const tension = clamp(Math.abs(dx) / Math.max(1, metrics.width) * 1.6, 0, .42);
      const control1X = metrics.anchorX + dx * (.18 + tension);
      const control2X = attachmentX - dx * (.18 + tension);
      const control1Y = 16 + dy * .38;
      const control2Y = attachmentY - dy * .28;
      const path = `M ${metrics.anchorX} 16 C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${attachmentX} ${attachmentY}`;
      lanyard.setAttribute('d', path);
      lanyardShadow.setAttribute('d', path);
      lanyardInner.setAttribute('d', path);
      if (lanyardAnchor) {
        lanyardAnchor.setAttribute('cx', String(attachmentX));
        lanyardAnchor.setAttribute('cy', String(attachmentY));
      }
      badge.style.transform = `translate3d(calc(-50% + ${state.x}px), ${state.y}px, 0) rotate(${state.angle}deg)`;
    };

    const requestFrame = () => {
      if (!state.raf) state.raf = requestAnimationFrame(frame);
    };

    const frame = timestamp => {
      state.raf = 0;
      const dt = clamp((timestamp - (state.lastFrame || timestamp)) / 16.67, .5, 2.2);
      state.lastFrame = timestamp;
      const mobile = window.innerWidth < 768;
      const spring = mobile ? .105 : .075;
      const damping = mobile ? .76 : .82;
      const angularSpring = mobile ? .13 : .105;
      const angularDamping = mobile ? .72 : .79;

      if (!state.dragging) {
        const idleX = reducedMotion.matches ? 0 : Math.sin(timestamp / 2100) * (mobile ? 1.1 : 1.8);
        const idleY = reducedMotion.matches ? 0 : Math.sin(timestamp / 2650 + .8) * (mobile ? .5 : .8);
        const targetX = rest.x + idleX;
        const targetY = rest.y + idleY;
        state.vx += (targetX - state.x) * spring * dt;
        state.vy += (targetY - state.y) * spring * dt;
        state.vx *= Math.pow(damping, dt);
        state.vy *= Math.pow(damping, dt);
        state.x += state.vx * dt;
        state.y += state.vy * dt;

        const targetAngle = reducedMotion.matches ? 0 : clamp(state.vx * (mobile ? 1.15 : 1.5), -10, 10);
        state.angularVelocity += (targetAngle - state.angle) * angularSpring * dt;
        state.angularVelocity *= Math.pow(angularDamping, dt);
        state.angle += state.angularVelocity * dt;
      }

      const maxAngle = mobile ? 8 : 11;
      state.x = clamp(state.x, -metrics.maxX, metrics.maxX);
      state.y = clamp(state.y, -8, metrics.maxY);
      state.angle = clamp(state.angle, -maxAngle, maxAngle);
      updateLanyard();

      const moving = state.dragging || Math.abs(state.x - rest.x) > .04 || Math.abs(state.y - rest.y) > .04 || Math.abs(state.vx) > .04 || Math.abs(state.vy) > .04 || Math.abs(state.angle) > .04;
      if (moving || !reducedMotion.matches) requestFrame();
    };

    const pointerPosition = event => {
      const rect = stage.getBoundingClientRect();
      return { x: event.clientX - (rect.left + metrics.anchorX), y: event.clientY - (rect.top + metrics.top) };
    };

    badge.addEventListener('pointerdown', event => {
      if (event.button !== undefined && event.button !== 0) return;
      const p = pointerPosition(event);
      state.dragging = true;
      state.pointerId = event.pointerId;
      state.grabOffsetX = p.x - state.x;
      state.grabOffsetY = p.y - state.y;
      state.lastPointerX = p.x;
      state.lastPointerY = p.y;
      state.lastTime = performance.now();
      state.vx = state.vy = state.angularVelocity = 0;
      badge.classList.add('is-dragging');
      badge.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      requestFrame();
    });

    badge.addEventListener('pointermove', event => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const now = performance.now();
      const p = pointerPosition(event);
      const dt = Math.max(8, now - state.lastTime);
      const mobile = window.innerWidth < 768;
      const resistance = mobile ? .82 : .92;
      const nextX = clamp(p.x - state.grabOffsetX, -metrics.maxX, metrics.maxX);
      const nextY = clamp(p.y - state.grabOffsetY, -8, metrics.maxY);
      state.vx = clamp((nextX - state.x) / dt * 16, -12, 12);
      state.vy = clamp((nextY - state.y) / dt * 16, -12, 12);
      state.x += (nextX - state.x) * resistance;
      state.y += (nextY - state.y) * resistance;
      state.angle = clamp(state.vx * (mobile ? 1.35 : 1.7) + state.vy * .16, mobile ? -8 : -11, mobile ? 8 : 11);
      state.lastPointerX = p.x;
      state.lastPointerY = p.y;
      state.lastTime = now;
      requestFrame();
    });

    const release = event => {
      if (!state.dragging || (event.pointerId !== undefined && event.pointerId !== state.pointerId)) return;
      state.dragging = false;
      state.pointerId = null;
      badge.classList.remove('is-dragging');
      requestFrame();
    };
    badge.addEventListener('pointerup', release);
    badge.addEventListener('pointercancel', release);
    badge.addEventListener('lostpointercapture', release);

    badge.addEventListener('keydown', event => {
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      if (!keys.includes(event.key)) return;
      const amount = event.shiftKey ? 18 : 8;
      state.x += event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0;
      state.y += event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0;
      state.x = clamp(state.x, -metrics.maxX, metrics.maxX);
      state.y = clamp(state.y, -8, metrics.maxY);
      state.vx = state.vy = state.angularVelocity = 0;
      requestFrame();
      event.preventDefault();
    });

    measure();
    updateLanyard();
    window.addEventListener('resize', () => { measure(); requestFrame(); }, { passive: true });
    window.addEventListener('orientationchange', () => { setTimeout(() => { measure(); requestFrame(); }, 80); }, { passive: true });
    requestFrame();
  }

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

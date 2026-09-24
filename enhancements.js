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
    // Lightweight verlet rope: smooth while dragging, paused when idle.
    const N = 9;
    const state = {
      points: [],
      dragging: false,
      pointerId: null,
      pointer: { x: 0, y: 0, dx: 0, dy: 0 },
      mouse: { x: 0, y: 0 },
      mouseInStage: false,
      raf: 0,
      lastFrame: 0,
      time: 0
    };
    const metrics = { width: 0, height: 0, top: 54, anchorX: 0, ropeLen: 200, segLen: 25, maxX: 0, maxY: 0 };

    const isMobile = () => window.innerWidth < 768;
    const measure = () => {
      const rect = stage.getBoundingClientRect();
      metrics.width = rect.width;
      metrics.height = rect.height;
      metrics.anchorX = metrics.width / 2;
      const mobile = isMobile();
      metrics.ropeLen = Math.min(metrics.height * .62, mobile ? 142 : 218);
      metrics.segLen = metrics.ropeLen / (N - 1);
      metrics.maxX = Math.max(8, (metrics.width - badge.offsetWidth) / 2 - 5);
      metrics.maxY = Math.max(8, metrics.height - metrics.top - badge.offsetHeight - 6);
      if (!state.points.length) {
        for (let i = 0; i < N; i += 1) {
          const y = 16 + metrics.segLen * i;
          state.points.push({ x: metrics.anchorX, y, ox: metrics.anchorX, oy: y });
        }
      }
      state.points.forEach((point, index) => {
        if (index === 0) { point.x = metrics.anchorX; point.y = 16; }
      });
      state.pointer.x = clamp(state.pointer.x, metrics.anchorX - metrics.maxX, metrics.anchorX + metrics.maxX);
      state.pointer.y = clamp(state.pointer.y, metrics.top - 8, metrics.top + metrics.maxY);
      lanyard.setAttribute('stroke-width', mobile ? '4.5' : '5');
      lanyardShadow.setAttribute('stroke-width', mobile ? '7' : '8');
    };

    const pointerPosition = event => {
      const rect = stage.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const requestFrame = () => { if (!state.raf) state.raf = requestAnimationFrame(frame); };

    const render = () => {
      const points = state.points;
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length - 1; i += 1) {
        const mx = (points[i].x + points[i + 1].x) / 2;
        const my = (points[i].y + points[i + 1].y) / 2;
        d += ` Q ${points[i].x} ${points[i].y} ${mx} ${my}`;
      }
      const last = points[N - 1];
      d += ` L ${last.x} ${last.y}`;
      lanyard.setAttribute('d', d);
      lanyardShadow.setAttribute('d', d);
      lanyardInner.setAttribute('d', d);
      const previous = points[N - 2];
      const angle = clamp(Math.atan2(last.x - previous.x, last.y - previous.y) * 180 / Math.PI, -9, 9);
      const x = last.x - metrics.anchorX;
      const y = last.y - metrics.top;
      badge.style.left = `${metrics.anchorX + x}px`;
      badge.style.top = `${metrics.top + y}px`;
      badge.style.transform = `translate(-50%,0) rotate(${angle}deg)`;
      const sway = last.x - metrics.anchorX;
      badge.style.setProperty('--gloss-x', `${clamp(-sway * .12, -12, 12)}px`);
      badge.style.setProperty('--gloss-y', `${clamp((last.y - (metrics.top + metrics.ropeLen)) * .08, -8, 8)}px`);
    };

    const frame = timestamp => {
      state.raf = 0;
      const dt = clamp((timestamp - (state.lastFrame || timestamp)) / 16.67, .5, 2);
      state.lastFrame = timestamp;
      state.time += dt;
      const points = state.points;
      const last = points[N - 1];
      if (!state.dragging) {
        const idle = reducedMotion.matches ? 0 : Math.sin(timestamp / 1800) * (isMobile() ? .35 : .7);
        state.pointer.x = metrics.anchorX + idle;
        state.pointer.y = metrics.top + metrics.ropeLen;
      } else {
        const dx = state.pointer.x - metrics.anchorX;
        const dy = state.pointer.y - metrics.top;
        const distance = Math.hypot(dx, dy) || 1;
        const maxDistance = metrics.ropeLen * 1.08;
        if (distance > maxDistance) {
          const scale = maxDistance / distance;
          state.pointer.x = metrics.anchorX + dx * scale;
          state.pointer.y = metrics.top + dy * scale;
        }
        last.x = state.pointer.x;
        last.y = state.pointer.y;
      }
      for (let i = 1; i < N; i += 1) {
        const point = points[i];
        if (i === N - 1 && state.dragging) continue;
        const vx = (point.x - point.ox) * .982;
        const vy = (point.y - point.oy) * .982;
        point.ox = point.x; point.oy = point.y;
        point.x += vx;
        point.y += vy + .48 * dt;
      }
      for (let pass = 0; pass < 6; pass += 1) {
        points[0].x = metrics.anchorX; points[0].y = 16;
        for (let i = 0; i < N - 1; i += 1) {
          const a = points[i]; const b = points[i + 1];
          const dx = b.x - a.x; const dy = b.y - a.y;
          const distance = Math.hypot(dx, dy) || .001;
          const difference = (distance - metrics.segLen) / distance;
          const ox = dx * .5 * difference; const oy = dy * .5 * difference;
          if (i > 0) { a.x += ox; a.y += oy; }
          if (!(i + 1 === N - 1 && state.dragging)) { b.x -= ox; b.y -= oy; }
        }
      }
      render();
      const moving = state.dragging || Math.abs(last.x - (metrics.anchorX)) > .8 || Math.abs(last.y - (metrics.top + metrics.ropeLen)) > .8;
      if (moving) requestFrame();
    };

    badge.addEventListener('pointerdown', event => {
      if (event.button !== undefined && event.button !== 0) return;
      const p = pointerPosition(event);
      const last = state.points[N - 1];
      state.dragging = true;
      state.pointerId = event.pointerId;
      state.pointer.dx = p.x - last.x; state.pointer.dy = p.y - last.y;
      state.pointer.x = last.x; state.pointer.y = last.y;
      badge.classList.add('is-dragging');
      badge.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      requestFrame();
    });
    badge.addEventListener('pointermove', event => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const p = pointerPosition(event);
      state.pointer.x = p.x - state.pointer.dx;
      state.pointer.y = p.y - state.pointer.dy;
      requestFrame();
      event.preventDefault();
    });
    const release = event => {
      if (!state.dragging || (event.pointerId !== undefined && event.pointerId !== state.pointerId)) return;
      state.dragging = false; state.pointerId = null;
      badge.classList.remove('is-dragging');
      requestFrame();
    };
    badge.addEventListener('pointerup', release);
    badge.addEventListener('pointercancel', release);
    badge.addEventListener('lostpointercapture', release);
    badge.addEventListener('keydown', event => {
      const amount = event.shiftKey ? 18 : 8;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      const last = state.points[N - 1];
      if (event.key === 'ArrowLeft') last.x -= amount;
      if (event.key === 'ArrowRight') last.x += amount;
      if (event.key === 'ArrowUp') last.y -= amount;
      if (event.key === 'ArrowDown') last.y += amount;
      state.pointer.x = clamp(last.x, metrics.anchorX - metrics.maxX, metrics.anchorX + metrics.maxX);
      state.pointer.y = clamp(last.y, metrics.top - 8, metrics.top + metrics.maxY);
      requestFrame(); event.preventDefault();
    });
    stage.addEventListener('pointermove', event => { if (!state.dragging) { state.mouse = pointerPosition(event); state.mouseInStage = true; } }, { passive: true });
    stage.addEventListener('pointerleave', () => { state.mouseInStage = false; });
    measure(); render();
    window.addEventListener('resize', () => { measure(); requestFrame(); }, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(() => { measure(); requestFrame(); }, 80), { passive: true });
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

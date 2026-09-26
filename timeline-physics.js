/* Scroll-led timeline physics: drag is temporary, scroll remains the source of truth. */
(() => {
  'use strict';
  const diagram = document.getElementById('tenseDiagram');
  if (!diagram) return;
  const svg = diagram.querySelector('svg');
  const path = diagram.querySelector('.spine-path');
  const glow = diagram.querySelector('.spine-glow');
  const travel = diagram.querySelector('.timeline-travel-light');
  const dots = [...diagram.querySelectorAll('.timeline-dot')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const W = 620, LEFT = 10, BASE_Y = 68;
  let scrollTarget = 0, x = LEFT, y = BASE_Y, vx = 0, vy = 0;
  let dragging = false, pointerId = null, lastX = 0, lastY = 0, lastTime = 0, raf = 0;
  let width = 640, scaleX = 1, scaleY = 1;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const targetX = () => LEFT + W * scrollTarget;
  const measure = () => {
    const box = svg.getBoundingClientRect();
    width = Math.max(1, box.width);
    scaleX = width / 640;
    scaleY = Math.max(1, box.height / 136);
  };
  const localPoint = event => {
    const box = svg.getBoundingClientRect();
    return { x: (event.clientX - box.left) / scaleX, y: (event.clientY - box.top) / scaleY };
  };
  const applyPath = progress => {
    const midpoint = (LEFT + W) / 2;
    const bend = clamp((y - BASE_Y) * .62, -25, 25);
    const d = `M${LEFT},${BASE_Y} Q${midpoint},${BASE_Y + bend} ${LEFT + W},${BASE_Y}`;
    path.setAttribute('d', d);
    glow.setAttribute('d', d);
    const draw = clamp(progress, 0, 1);
    path.style.strokeDashoffset = String(1 - draw);
    glow.style.strokeDashoffset = String(1 - draw);
    if (travel) {
      travel.setAttribute('cx', x.toFixed(2));
      travel.setAttribute('cy', y.toFixed(2));
    }
    diagram.style.setProperty('--timeline-drag-x', `${x}px`);
    diagram.style.setProperty('--timeline-drag-y', `${y}px`);
    diagram.classList.toggle('is-dragging', dragging);
    const phase = x <= LEFT + W * .5 ? (x <= LEFT + W * .25 ? 0 : 1) : 2;
    dots.forEach((dot, index) => dot.classList.toggle('active', index <= phase && progress > .02));
    diagram.dataset.timelineProgress = String(progress);
    diagram.dataset.timelineVelocity = String(Math.abs(vx) + Math.abs(vy));
  };
  const loop = now => {
    raf = 0;
    const dt = Math.min(.032, Math.max(.001, (now - (loop.last || now)) / 1000));
    loop.last = now;
    if (!dragging) {
      const tx = targetX();
      if (reduce.matches) { x = tx; y = BASE_Y; vx = vy = 0; }
      else {
        const stiffness = 170, damping = 22;
        vx += (tx - x) * stiffness * dt;
        vy += (BASE_Y - y) * stiffness * dt;
        vx *= Math.exp(-damping * dt); vy *= Math.exp(-damping * dt);
        x += vx * dt; y += vy * dt;
        if (Math.abs(tx - x) < .08 && Math.abs(vx) < .08 && Math.abs(y - BASE_Y) < .08 && Math.abs(vy) < .08) { x = tx; y = BASE_Y; vx = vy = 0; }
      }
    }
    applyPath(scrollTarget);
    if (dragging || Math.abs(vx) + Math.abs(vy) > .08 || Math.abs(targetX() - x) > .08) raf = requestAnimationFrame(loop);
  };
  const wake = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const setScrollProgress = progress => {
    scrollTarget = clamp(Number(progress) || 0, 0, 1);
    if (!dragging && reduce.matches) { x = targetX(); y = BASE_Y; }
    applyPath(scrollTarget); wake();
  };
  window.timelinePhysics = { setScrollProgress };

  const handle = event => {
    if (!event.isPrimary) return;
    const p = localPoint(event);
    const distance = Math.hypot(p.x - x, p.y - y);
    if (distance > 34) return;
    dragging = true; pointerId = event.pointerId; lastTime = performance.now(); lastX = p.x; lastY = p.y; vx = vy = 0;
    svg.setPointerCapture?.(pointerId);
    event.preventDefault(); wake();
  };
  const move = event => {
    if (!dragging || event.pointerId !== pointerId) return;
    const p = localPoint(event), now = performance.now(), dt = Math.max(.008, (now - lastTime) / 1000);
    const resistance = p.x < LEFT + 48 || p.x > LEFT + W - 48 ? .38 : 1;
    const nextX = clamp(x + (p.x - lastX) * resistance, LEFT - 20, LEFT + W + 20);
    const nextY = clamp(y + (p.y - lastY) * resistance, BASE_Y - 44, BASE_Y + 44);
    vx = (nextX - x) / dt * .72; vy = (nextY - y) / dt * .72;
    x = nextX; y = nextY; lastX = p.x; lastY = p.y; lastTime = now;
    applyPath(scrollTarget); wake(); event.preventDefault();
  };
  const release = event => {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false; pointerId = null;
    svg.releasePointerCapture?.(event.pointerId);
    if (reduce.matches) { x = targetX(); y = BASE_Y; vx = vy = 0; }
    wake();
  };
  svg.addEventListener('pointerdown', handle);
  svg.addEventListener('pointermove', move, { passive: false });
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);
  svg.addEventListener('lostpointercapture', () => { if (dragging) { dragging = false; wake(); } });
  svg.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') x -= 18;
    if (event.key === 'ArrowRight') x += 18;
    if (event.key === 'ArrowUp') y -= 12;
    if (event.key === 'ArrowDown') y += 12;
    x = clamp(x, LEFT - 20, LEFT + W + 20); y = clamp(y, BASE_Y - 44, BASE_Y + 44); dragging = true; wake();
    clearTimeout(svg._keyboardRelease);
    svg._keyboardRelease = setTimeout(() => { dragging = false; wake(); }, 180);
  });
  svg.setAttribute('tabindex', '0');
  svg.setAttribute('role', 'application');
  svg.setAttribute('aria-label', 'Interactive scroll timeline. Drag the gold point and release it to return to the current scroll position.');
  new ResizeObserver(() => { measure(); applyPath(scrollTarget); }).observe(svg);
  measure();
  setScrollProgress(0);
})();

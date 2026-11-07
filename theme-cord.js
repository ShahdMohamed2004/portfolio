/* Hero-edge pull cord: damped spring physics, touch/keyboard access, and theme-aware lamp feedback. */
(() => {
  'use strict';

  const cord = document.getElementById('themeCord');
  const hero = document.getElementById('home');
  if (!cord || !hero) return;

  const root = document.documentElement;
  const badgeHost = hero.querySelector('.shahd-badge-mount');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const setCordPose = (y, angle) => {
    cord.style.setProperty('--cord-y', `${Math.max(0, y).toFixed(2)}px`);
    cord.style.setProperty('--cord-angle', `${angle.toFixed(2)}deg`);
  };

  let pointer = null;
  let currentY = 0;
  let velocityY = 0;
  let angle = 0;
  let angularVelocity = 0;
  let lastFrame = 0;
  let animationFrame = 0;
  let ignoreNextClick = false;
  let placementFrame = 0;

  function updateLabel() {
    const isLight = root.dataset.theme === 'light';
    const isArabic = root.lang.toLowerCase().startsWith('ar');
    const label = isArabic
      ? (isLight ? 'اسحبي الحبل للتبديل إلى الوضع الداكن' : 'اسحبي الحبل للتبديل إلى الوضع الفاتح')
      : (isLight ? 'Pull the cord to switch to dark mode' : 'Pull the cord to switch to light mode');
    cord.setAttribute('aria-label', label);
    cord.setAttribute('title', label);
    cord.setAttribute('aria-pressed', String(isLight));
  }

  function placeCord() {
    placementFrame = 0;
    const heroRect = hero.getBoundingClientRect();
    const realCard = badgeHost?.shadowRoot?.querySelector('.card');
    const cardRect = realCard?.getBoundingClientRect() || badgeHost?.getBoundingClientRect();
    if (!heroRect.width || !heroRect.height) return;

    // Keep the bulb on the hero's physical right edge, with a clear lane beside the ID card.
    const safeRight = Math.max(24, window.innerWidth - 16);
    const preferredX = heroRect.right - 12;
    const afterCardX = cardRect ? cardRect.right + 30 : preferredX;
    const centerX = clamp(Math.max(preferredX, afterCardX), 24, safeRight);
    const localX = centerX - heroRect.left;
    cord.style.setProperty('--cord-x', `${localX.toFixed(1)}px`);

    // Align the bulb beside the card's middle, never over or attached to the card.
    const cardMiddleY = cardRect ? cardRect.top + cardRect.height / 2 : heroRect.top + heroRect.height * 0.55;
    const top = clamp(cardMiddleY - heroRect.top - 73, 112, Math.max(112, heroRect.height - 166));
    cord.style.setProperty('--cord-top', `${top.toFixed(1)}px`);
  }

  function schedulePlacement() {
    if (placementFrame) return;
    placementFrame = window.requestAnimationFrame(placeCord);
  }

  function playDarkChime() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const start = context.currentTime;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, start);
      master.gain.exponentialRampToValueAtTime(0.022, start + 0.014);
      master.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
      master.connect(context.destination);
      [740, 988].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const partial = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start + index * 0.05);
        partial.gain.setValueAtTime(index === 0 ? 0.72 : 0.34, start);
        oscillator.connect(partial);
        partial.connect(master);
        oscillator.start(start + index * 0.05);
        oscillator.stop(start + 0.34);
      });
      window.setTimeout(() => context.close().catch(() => {}), 450);
    } catch (_) {
      // The cord still works when audio is blocked or unavailable.
    }
  }

  function switchTheme() {
    const nextIsLight = root.dataset.theme !== 'light';
    if (typeof window.togglePortfolioTheme === 'function') {
      window.togglePortfolioTheme();
    }
    if (!nextIsLight) playDarkChime();
    updateLabel();
  }

  function animateSpring(now) {
    animationFrame = 0;
    const dt = Math.min(0.032, Math.max(0.001, (now - (lastFrame || now)) / 1000));
    lastFrame = now;

    if (reduceMotion.matches) {
      currentY = 0;
      velocityY = 0;
      angle = 0;
      angularVelocity = 0;
    } else {
      // Semi-implicit Euler integration keeps the cord elastic with a soft pendulum follow-through.
      velocityY += (-58 * currentY - 13.5 * velocityY) * dt;
      currentY += velocityY * dt;
      angularVelocity += (-36 * angle - 8.2 * angularVelocity + currentY * 0.075) * dt;
      angle += angularVelocity * dt;
      if (Math.abs(currentY) < 0.14 && Math.abs(velocityY) < 0.9) {
        currentY = 0;
        velocityY = 0;
      }
      if (Math.abs(angle) < 0.08 && Math.abs(angularVelocity) < 0.8) {
        angle = 0;
        angularVelocity = 0;
      }
    }

    setCordPose(currentY, angle);
    if (currentY || velocityY || angle || angularVelocity) {
      animationFrame = window.requestAnimationFrame(animateSpring);
    }
  }

  function releaseSpring(initialAngle = 0) {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    angle = initialAngle;
    angularVelocity = initialAngle * 2.1;
    velocityY = currentY ? -Math.max(0.9, Math.abs(velocityY) * 0.24) : 0;
    lastFrame = 0;
    if (reduceMotion.matches) {
      currentY = 0;
      angle = 0;
      angularVelocity = 0;
      velocityY = 0;
      setCordPose(0, 0);
      return;
    }
    animationFrame = window.requestAnimationFrame(animateSpring);
  }

  cord.addEventListener('pointerdown', event => {
    if ((event.button !== undefined && event.button !== 0) || event.isPrimary === false) return;
    pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastY: event.clientY, lastTime: performance.now(), speedY: 0 };
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    velocityY = 0;
    cord.classList.add('is-pulling');
    try { cord.setPointerCapture(event.pointerId); } catch (_) { /* Embedded browsers may not support pointer capture. */ }
  });

  cord.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const now = performance.now();
    const elapsed = Math.max(8, now - pointer.lastTime);
    pointer.speedY = clamp((event.clientY - pointer.lastY) / elapsed, -1.8, 1.8);
    pointer.lastY = event.clientY;
    pointer.lastTime = now;
    currentY = clamp(event.clientY - pointer.startY, 0, 62);
    angle = clamp((pointer.startX - event.clientX) * 0.14, -13, 13);
    setCordPose(currentY, angle);
    if (currentY > 2) event.preventDefault();
  });

  function finishPull(event, cancelled = false) {
    if (!pointer || (event && event.pointerId !== pointer.id)) return;
    const pullY = currentY;
    const pullAngle = angle;
    const didPull = !cancelled && pullY >= 34;
    pointer = null;
    cord.classList.remove('is-pulling');
    if (didPull) {
      ignoreNextClick = true;
      window.setTimeout(() => { ignoreNextClick = false; }, 500);
      switchTheme();
      releaseSpring(clamp(pullAngle + (Math.random() - 0.5) * 3, -14, 14));
    } else {
      releaseSpring(pullAngle * 0.5);
    }
  }

  cord.addEventListener('pointerup', event => finishPull(event));
  cord.addEventListener('pointercancel', event => finishPull(event, true));
  cord.addEventListener('lostpointercapture', event => finishPull(event, true));
  cord.addEventListener('click', event => {
    if (ignoreNextClick) {
      event.preventDefault();
      event.stopPropagation();
      ignoreNextClick = false;
      return;
    }
    // Keyboard and assistive-technology activation remain available without dragging.
    switchTheme();
    currentY = 27;
    releaseSpring(4.5);
  });

  new MutationObserver(updateLabel).observe(root, { attributes: true, attributeFilter: ['data-theme', 'lang'] });
  window.addEventListener('resize', schedulePlacement, { passive: true });
  window.addEventListener('orientationchange', schedulePlacement, { passive: true });
  window.addEventListener('load', schedulePlacement, { once: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedulePlacement);
    observer.observe(hero);
    if (badgeHost) observer.observe(badgeHost);
  }
  updateLabel();
  setCordPose(0, 0);
  schedulePlacement();
})();

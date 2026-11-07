/* Pull-cord theme switch: damped spring physics, accessible activation, and a soft dark-mode chime. */
(() => {
  'use strict';

  const cord = document.getElementById('themeCord');
  const themeToggle = document.getElementById('themeToggle');
  if (!cord || !themeToggle) return;

  const root = document.documentElement;
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

  function updateLabel() {
    const isLight = root.dataset.theme === 'light';
    const isArabic = root.lang.toLowerCase().startsWith('ar');
    const label = isArabic
      ? (isLight ? 'اسحبي الحبل للتبديل إلى الوضع الداكن' : 'اسحبي الحبل للتبديل إلى الوضع الفاتح')
      : (isLight ? 'Pull the cord to switch to dark mode' : 'Pull the cord to switch to light mode');
    cord.setAttribute('aria-label', label);
    cord.title = label;
  }

  function playDarkChime() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const start = context.currentTime;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, start);
      master.gain.exponentialRampToValueAtTime(0.035, start + 0.012);
      master.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
      master.connect(context.destination);
      [740, 988].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const partial = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start + index * 0.045);
        partial.gain.setValueAtTime(index === 0 ? 0.72 : 0.38, start);
        oscillator.connect(partial);
        partial.connect(master);
        oscillator.start(start + index * 0.045);
        oscillator.stop(start + 0.38);
      });
      window.setTimeout(() => context.close().catch(() => {}), 500);
    } catch (_) {
      // Theme switching remains available when audio is blocked or unsupported.
    }
  }

  function switchTheme() {
    const nextIsLight = root.dataset.theme !== 'light';
    themeToggle.click();
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
      // Semi-implicit Euler integration of a damped spring and a small pendulum.
      velocityY += (-52 * currentY - 12.5 * velocityY) * dt;
      currentY += velocityY * dt;
      angularVelocity += (-34 * angle - 8.5 * angularVelocity + currentY * 0.09) * dt;
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
    angularVelocity = initialAngle * 2.2;
    velocityY = currentY ? -Math.max(0.75, Math.abs(velocityY) * 0.24) : 0;
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
    if (event.button !== undefined && event.button !== 0) return;
    pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastY: event.clientY, lastTime: performance.now(), speedY: 0 };
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    velocityY = 0;
    cord.classList.add('is-pulling');
    try { cord.setPointerCapture?.(event.pointerId); } catch (_) { /* Synthetic and embedded pointers may not be capturable. */ }
  });

  cord.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const now = performance.now();
    const elapsed = Math.max(8, now - pointer.lastTime);
    const deltaY = event.clientY - pointer.lastY;
    pointer.speedY = clamp(deltaY / elapsed, -1.8, 1.8);
    pointer.lastY = event.clientY;
    pointer.lastTime = now;
    currentY = clamp(event.clientY - pointer.startY, 0, 58);
    angle = clamp((pointer.startX - event.clientX) * 0.16, -12, 12);
    setCordPose(currentY, angle);
    if (currentY > 3) event.preventDefault();
  });

  function finishPull(event) {
    if (!pointer || (event && event.pointerId !== pointer.id)) return;
    const pullY = currentY;
    const pullAngle = angle;
    const didPull = pullY >= 35;
    pointer = null;
    cord.classList.remove('is-pulling');
    if (didPull) {
      ignoreNextClick = true;
      window.setTimeout(() => { ignoreNextClick = false; }, 450);
      switchTheme();
      releaseSpring(clamp(pullAngle + (Math.random() - 0.5) * 4, -14, 14));
    } else {
      releaseSpring(pullAngle * 0.55);
    }
  }

  cord.addEventListener('pointerup', finishPull);
  cord.addEventListener('pointercancel', finishPull);
  cord.addEventListener('lostpointercapture', finishPull);
  cord.addEventListener('click', event => {
    if (ignoreNextClick) {
      event.preventDefault();
      event.stopPropagation();
      ignoreNextClick = false;
      return;
    }
    // Native keyboard activation (Enter/Space) remains equivalent to a full pull.
    switchTheme();
    currentY = 28;
    releaseSpring(5);
  });

  new MutationObserver(updateLabel).observe(root, { attributes: true, attributeFilter: ['data-theme', 'lang'] });
  updateLabel();
  setCordPose(0, 0);
})();

(() => {
  'use strict';
  const companion = document.querySelector('.teacher-companion');
  const model = companion?.querySelector('model-viewer');
  const bubble = companion?.querySelector('.teacher-companion-bubble');
  const label = companion?.querySelector('.teacher-companion-label');
  if (!companion || !model) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 767px)');
  const messages = ['Ready to explore?', 'Look here!', 'Let’s learn something new!', 'Great work!', 'I’m thinking…', 'See you soon!'];
  let frame = 0;
  let bubbleTimer;

  function say(message) {
    if (!bubble) return;
    bubble.textContent = message;
    bubble.classList.add('is-visible');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('is-visible'), 2200);
  }

  function update() {
    frame = 0;
    const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollMax));
    const hero = document.querySelector('#home');
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const desktop = !mobile.matches;
    if (desktop) {
      // Move through the page's right-side whitespace without covering the reading column.
      const travel = Math.min(window.innerHeight * .55, 460);
      const drift = (progress - .08) * travel;
      companion.style.transform = `translate3d(0, ${Math.max(-24, Math.min(travel, drift))}px, 0)`;
      companion.style.opacity = heroBottom < -80 ? '0.68' : '0.98';
      label.textContent = heroBottom > 0 ? 'Learning guide' : 'Keep exploring';
    } else {
      companion.style.transform = 'none';
      companion.style.opacity = '1';
    }
    if (!reduced.matches && !mobile.matches) {
      const orbit = (progress - .5) * 8;
      model.cameraOrbit = `${orbit}deg auto auto`;
    }
  }

  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  reduced.addEventListener?.('change', requestUpdate);
  mobile.addEventListener?.('change', requestUpdate);
  model.addEventListener('load', () => {
    label && (label.textContent = 'Learning guide');
    setTimeout(() => say('Ready to explore?'), 650);
  });
  companion.addEventListener('click', () => {
    if (reduced.matches) return;
    const message = messages[Math.floor(Math.random() * messages.length)];
    say(message);
    model.cameraOrbit = `${(Math.random() * 12 - 6).toFixed(2)}deg auto auto`;
  });
  update();
})();

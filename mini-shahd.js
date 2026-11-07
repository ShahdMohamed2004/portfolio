(() => {
  'use strict';
  const root = document.getElementById('miniShahd');
  if (!root) return;
  const character = root.querySelector('.mini-character');
  const bubble = root.querySelector('.mini-bubble');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = ['wave','celebrate','think','read','teach','write','surprise','point','sit','dance','jump','peek'];
  const copy = {
    home:'Ready to explore?', about:'Nice to meet you!', skills:'Look here — these are my tools!', work:'Did you see this project?', experience:'Let me show you how I teach!', education:'Still learning, always curious.', professional:'Small steps, big growth.', skillsLanguages:'Pick a skill and watch me!', contact:'Let’s keep in touch!'
  };
  const sectionStates = {home:'wave',about:'wave',skills:'write',work:'celebrate',experience:'teach',education:'read',professional:'think',skillsLanguages:'point',contact:'wave'};
  let currentSection = 'home'; let bubbleTimer; let idleTimer; let blinkTimer;
  function setState(state, duration = 0) {
    states.forEach(s => root.classList.remove(`state-${s}`));
    root.classList.add(`state-${state}`);
    if (duration) { clearTimeout(root._stateTimer); root._stateTimer = setTimeout(() => setState(sectionStates[currentSection] || 'wave'), duration); }
  }
  function say(section = currentSection, duration = 3000) {
    const item = copy[section] || copy.home;
    bubble.textContent = item;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer); bubbleTimer = setTimeout(() => bubble.classList.remove('show'), duration);
  }
  function react(state, speak = true) { setState(state, reduced.matches ? 0 : 1600); if (speak) say(currentSection); character.classList.remove('blink'); }
  function clickReaction() {
    const preferred = sectionStates[currentSection] || 'wave';
    const options = [preferred, 'surprise', 'dance', 'peek', 'celebrate'];
    react(options[Math.floor(Math.random() * options.length)], true);
  }
  function scheduleBlink() {
    clearTimeout(blinkTimer); blinkTimer = setTimeout(() => { if (!document.hidden) { character.classList.add('blink'); setTimeout(() => character.classList.remove('blink'), 150); } scheduleBlink(); }, 3400 + Math.random() * 3900);
  }
  function scheduleIdle() {
    clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (!document.hidden && !reduced.matches) react(['think','read','peek','dance','write'][Math.floor(Math.random()*5)], true); scheduleIdle(); }, 9000);
  }
  character.addEventListener('click', clickReaction);
  character.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickReaction(); } });
  character.addEventListener('pointerenter', () => { if (!bubble.classList.contains('show')) say(currentSection, 1900); });
  const sections = [...document.querySelectorAll('main section[id]')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (!visible) return;
    currentSection = visible.target.id;
    setState(sectionStates[currentSection] || 'wave');
    if (currentSection !== 'home') say(currentSection, 2200);
  }, {threshold:[.2,.45,.7], rootMargin:'-15% 0px -35% 0px'});
  sections.forEach(section => observer.observe(section));
  new MutationObserver(() => { if (bubble.classList.contains('show')) say(currentSection, 2200); }).observe(document.documentElement, {attributes:true, attributeFilter:['lang','dir']});
  reduced.addEventListener?.('change', () => { if (reduced.matches) { states.forEach(s => root.classList.remove(`state-${s}`)); root.classList.add('state-wave'); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { scheduleBlink(); scheduleIdle(); } });
  setState('wave'); scheduleBlink(); scheduleIdle();
})();

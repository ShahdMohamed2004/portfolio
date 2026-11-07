(() => {
  'use strict';
  const root = document.getElementById('miniShahd');
  if (!root) return;
  const character = root.querySelector('.mini-character');
  const bubble = root.querySelector('.mini-bubble');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = ['wave','celebrate','think','read','teach','surprise','point','sit'];
  const copy = {
    home: {en:'Ready to explore?', ar:'مستعدة نكتشف؟'}, about:{en:'Nice to meet you!',ar:'سعيدة بلقائك!'}, skills:{en:'Let’s learn something new!',ar:'هيا نتعلم شيئًا جديدًا!'}, work:{en:'Look what I’ve created!',ar:'انظري ماذا صنعت!'}, experience:{en:'Learning is an adventure!',ar:'التعلّم مغامرة!'}, education:{en:'Always curious.',ar:'دائمًا فضولية.'}, professional:{en:'Small steps, big growth.',ar:'خطوات صغيرة، نمو كبير.'}, skillsLanguages:{en:'Curiosity starts here!',ar:'الفضول يبدأ هنا!'}, contact:{en:'Let’s keep in touch!',ar:'لنبقَ على تواصل!'}
  };
  const sectionStates = {home:'wave',about:'wave',skills:'point',work:'celebrate',experience:'teach',education:'read',professional:'think',skillsLanguages:'point',contact:'wave'};
  let currentSection = 'home'; let bubbleTimer; let idleTimer; let blinkTimer;
  const isArabic = () => document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl';
  function setState(state, duration = 0) {
    states.forEach(s => root.classList.remove(`state-${s}`));
    root.classList.add(`state-${state}`);
    if (duration) { clearTimeout(root._stateTimer); root._stateTimer = setTimeout(() => setState(sectionStates[currentSection] || 'wave'), duration); }
  }
  function say(section = currentSection, duration = 3000) {
    const item = copy[section] || copy.home;
    bubble.textContent = isArabic() ? item.ar : item.en;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer); bubbleTimer = setTimeout(() => bubble.classList.remove('show'), duration);
  }
  function react(state, speak = true) { setState(state, reduced.matches ? 0 : 1600); if (speak) say(currentSection); character.classList.remove('blink'); }
  function randomReaction() { react(states[Math.floor(Math.random() * states.length)], true); }
  function scheduleBlink() {
    clearTimeout(blinkTimer); blinkTimer = setTimeout(() => { if (!document.hidden) { character.classList.add('blink'); setTimeout(() => character.classList.remove('blink'), 150); } scheduleBlink(); }, 3400 + Math.random() * 3900);
  }
  function scheduleIdle() {
    clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (!document.hidden && !reduced.matches) react(['think','read','look'][Math.floor(Math.random()*3)] || 'think', false); scheduleIdle(); }, 12500);
  }
  character.addEventListener('click', randomReaction);
  character.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); randomReaction(); } });
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

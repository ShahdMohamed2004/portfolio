
(() => {
'use strict';
const clamp = (n, low, high) => Math.min(high, Math.max(low, n));
const pose = () => ({ x: 0, y: 0, rx: 0, ry: 0, rz: -.65, s: 1 });
const axes = ['x', 'y', 'rx', 'ry', 'rz', 's'];
const still = () => Object.fromEntries(axes.map(key => [key, 0]));

// A critically damped spring: the card has weight but cannot fling itself
// through the reader or earn verification from overshoot.
function spring(value, target, velocity, dt, omega) {
  const distance = value - target;
  const impulse = velocity + omega * distance;
  const decay = Math.exp(-omega * dt);
  return { value: target + (distance + impulse * dt) * decay,
    velocity: (velocity - omega * impulse * dt) * decay };
}

function createCardReader(root, { onState = () => {}, onComplete = () => {}, getCopy } = {}) {
  const card = root.querySelector('[data-reader-card]');
  const slot = root.querySelector('[data-reader-slot]');
  const display = root.querySelector('[data-reader-display]');
  const bar = root.querySelector('[data-reader-progress]');
  const percent = root.querySelector('[data-reader-percent]');
  const shadow = root.querySelector('[data-reader-shadow]');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const listen = { signal: events.signal };
  let geometry, position = pose(), target = pose(), velocity = still();
  let gesture = null, keyboard = null, state = null;
  let docked = false, armed = false, interrupted = false;
  let busy = false, destroyed = false, pending = false;
  let raf = 0, lastFrame = 0, completionTimer = 0;

  function measure() {
    const scale = root.clientWidth / 560;
    geometry = {
      scale,
      bound: Math.max(1, (560 - card.offsetWidth / scale) / 2 - 8),
      dockY: (slot.offsetTop - card.offsetTop - card.offsetHeight) / scale + 22,
      minY: 8 - card.offsetTop / scale,
    };
  }
  function setState(next) {
    if (state === next) return;
    state = next;
    root.dataset.readerState = next;
    display.textContent = {
      IDLE: 'WAITING', HELD: 'LIFTED', INSERTED: 'INSERTED', ARMED: 'SWIPE RIGHT',
      SCANNING: 'SCANNING', INCOMPLETE: 'PAUSED', READY: 'ACCESS GRANTED',
    }[next];
    onState(next);
  }
  function refreshState() {
    if (busy) return setState('READY');
    if (!docked) return setState(interrupted ? 'INCOMPLETE' : gesture?.active || keyboard ? 'HELD' : 'IDLE');
    if (!armed) return setState('INSERTED');
    if (target.x === -geometry.bound) return setState('ARMED');
    setState(gesture?.active || keyboard || pending ? 'SCANNING' : 'INCOMPLETE');
  }
  function paint() {
    const p = media.matches ? { ...position, rx: 0, ry: 0, rz: 0, s: 1 } : position;
    card.style.transform = `perspective(900px) translate3d(${p.x * geometry.scale}px,${p.y * geometry.scale}px,0) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg) scale(${p.s})`;
    const fraction = busy ? 1 : armed && docked ? clamp((position.x + geometry.bound) / (2 * geometry.bound), 0, .99) : 0;
    const value = busy ? 100 : Math.floor(fraction * 100);
    bar.style.transform = `scaleX(${fraction})`;
    percent.textContent = `${value}%`;
    root.dataset.readerDocked = String(docked);
    root.dataset.readerArmed = String(armed);
    root.style.setProperty('--read-progress', String(fraction));
    card.style.setProperty('--glass-x', `${50 + p.ry * 5 + p.x * .16}%`);
    card.style.setProperty('--lift-shadow', `${docked ? 7 : 16 + Math.max(0, geometry.dockY - p.y) * .15}px`);
    const copy = getCopy();
    if (card.getAttribute('aria-valuenow') !== String(value)) card.setAttribute('aria-valuenow', String(value));
    const valueText = busy ? copy.verified : !docked ? copy.outside : !armed ? copy.inserted : copy.progress(value);
    if (card.getAttribute('aria-valuetext') !== valueText) card.setAttribute('aria-valuetext', valueText);
    if (shadow) {
      shadow.style.transform = `translateX(${p.x * geometry.scale * .22}px) scale(${docked ? 1 : .85})`;
      shadow.style.opacity = String(docked ? .48 : .24);
    }
  }
  function tryArm() {
    // Merely placing the card in the middle/right of the slot never arms it.
    // Both the pointer's destination AND the visible card must reach the left.
    if (docked && target.x === -geometry.bound && position.x <= -geometry.bound + .08) {
      // Each pointer pass must visit the visible left edge without releasing.
      if (gesture?.active) gesture.startedAtLeft = true;
      armed = true;
      interrupted = false;
      refreshState();
    }
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
    lastFrame = 0;
    card.style.willChange = '';
  }
  function schedule() {
    if (raf || destroyed || busy) return;
    card.style.willChange = 'transform';
    raf = requestAnimationFrame(frame);
  }
  function releaseGesture() {
    const old = gesture;
    gesture = null;
    root.dataset.readerDragging = 'false';
    if (old && card.hasPointerCapture(old.id)) card.releasePointerCapture(old.id);
  }
  function complete() {
    if (!pending || !docked || !armed || target.x !== geometry.bound ||
        position.x !== geometry.bound || position.y !== geometry.dockY || destroyed || busy) return;
    pending = false;
    busy = true;
    releaseGesture();
    keyboard = null;
    stop();
    position = { ...pose(), x: geometry.bound, y: geometry.dockY, rz: 0 };
    target = { ...position };
    velocity = still();
    root.dataset.readerBusy = 'true';
    card.setAttribute('aria-disabled', 'true');
    setState('READY');
    paint();
    completionTimer = setTimeout(() => {
      completionTimer = 0;
      if (!destroyed && busy) onComplete({ reason: 'completed' });
    }, 650);
  }
  function frame(now) {
    raf = 0;
    if (destroyed || busy) return;
    const dt = lastFrame ? Math.min(.04, (now - lastFrame) / 1000) : 1 / 60;
    lastFrame = now;
    const held = gesture?.active;
    const edgeRoom = 1 - Math.pow(Math.abs(position.x) / geometry.bound, 4);
    target.rz = held ? clamp((target.x - position.x) * -.11 + gesture.gripX * 2, -5, 5) * (docked ? .13 : 1) * edgeRoom : docked ? 0 : -.65;
    target.ry = held ? clamp((target.x - position.x) * .17, -6, 6) * (docked ? .35 : 1) * edgeRoom : 0;
    target.rx = held ? clamp((position.y - target.y) * .13 + (docked ? gesture.pressure * .08 : 0), -5, 5) : 0;
    target.s = held && !docked ? 1.025 : 1;
    let moving = false;
    for (const key of axes) {
      const linear = key === 'x' || key === 'y';
      const next = spring(position[key], target[key], velocity[key], dt, linear ? 48 : 22);
      // Translation follows only the latest user position, never momentum past it.
      position[key] = linear ? clamp(next.value, Math.min(position[key], target[key]), Math.max(position[key], target[key])) : next.value;
      velocity[key] = next.velocity;
      const close = Math.abs(position[key] - target[key]) < (key === 's' ? .0001 : .015) && Math.abs(velocity[key]) < .08;
      if (close) { position[key] = target[key]; velocity[key] = 0; }
      else moving = true;
    }
    tryArm();
    paint();
    complete();
    if (!busy && moving) schedule();
    else if (!busy) stop();
  }
  function follow() {
    refreshState();
    if (media.matches) {
      position = { ...target, rx: 0, ry: 0, rz: 0, s: 1 };
      velocity = still();
      tryArm();
      paint();
      complete();
    } else schedule();
  }
  function pause() {
    if (busy || destroyed) return;
    pending = false;
    releaseGesture();
    keyboard = null;
    // Cancellation keeps the visible card where it is; no centre reset or verify.
    stop();
    target = { ...position, y: docked ? geometry.dockY : position.y };
    velocity = still();
    refreshState();
    follow();
  }
  function moveTo(rawX, rawY, previousRawY) {
    target.x = clamp(rawX, -geometry.bound, geometry.bound);
    let changed = false;
    if (docked) {
      // Upward pull must overcome the slot's grip. Downward pressure is resisted.
      if (rawY < geometry.dockY - 30) {
        docked = false;
        interrupted = armed;
        armed = false;
        pending = false;
        changed = true;
      }
    } else {
      const nearSlot = Math.abs(rawY - geometry.dockY) <= 12;
      const crossedSlot = previousRawY < geometry.dockY && rawY >= geometry.dockY;
      if (nearSlot || crossedSlot) {
        docked = true;
        armed = false;
        interrupted = false;
        changed = true;
        // The lip catches the lower edge, matching the physical insertion gesture.
        position.y = geometry.dockY;
        velocity.y = 0;
      }
    }
    target.y = docked ? geometry.dockY : clamp(rawY, geometry.minY, geometry.dockY + 52);
    return changed;
  }
  function down(event) {
    if (busy || destroyed || gesture || event.isPrimary === false || event.button !== 0) return;
    event.preventDefault();
    pending = false;
    keyboard = null;
    measure();
    stop();
    target = { ...position, y: docked ? geometry.dockY : position.y };
    velocity = still();
    const rect = card.getBoundingClientRect();
    card.focus({ preventScroll: true });
    gesture = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      lastX: event.clientX, lastY: event.clientY,
      start: { ...target }, previousRawY: target.y,
      gripX: clamp((event.clientX - rect.x) / rect.width * 2 - 1, -1, 1),
      pressure: 0, active: false, direction: 0, forwardMoved: false,
      startedAtLeft: docked && armed && position.x <= -geometry.bound + .08,
    };
    card.setPointerCapture(event.pointerId);
    root.dataset.readerDragging = 'true';
    paint();
  }
  function updateGesture(event) {
    const g = gesture;
    if (!g || event.pointerId !== g.id) return;
    const dx = (event.clientX - g.x) / geometry.scale;
    const dy = (event.clientY - g.y) / geometry.scale;
    const deltaX = event.clientX - g.lastX;
    if (deltaX !== 0) g.direction = Math.sign(deltaX);
    g.lastX = event.clientX;
    g.lastY = event.clientY;
    if (!g.active && Math.hypot(event.clientX - g.x, event.clientY - g.y) < 4) return;
    g.active = true;
    const rawY = g.start.y + dy;
    const previousX = target.x;
    g.pressure = docked ? rawY - geometry.dockY : 0;
    const changed = moveTo(g.start.x + dx, rawY, g.previousRawY);
    g.previousRawY = rawY;
    if (changed) {
      // Rebase the vertical grip when inserted so pulling out remains predictable.
      g.y = event.clientY;
      g.start.y = target.y;
      g.previousRawY = target.y;
      g.pressure = 0;
      g.forwardMoved = false;
      g.startedAtLeft = false;
    }
    if (docked && armed && target.x > previousX) g.forwardMoved = true;
    follow();
  }
  function move(event) {
    if (busy || destroyed || !gesture || gesture.id !== event.pointerId) return;
    event.preventDefault();
    updateGesture(event);
  }
  function up(event) {
    if (busy || destroyed || !gesture || gesture.id !== event.pointerId) return;
    event.preventDefault();
    updateGesture(event);
    const g = gesture;
    pending = !!(g.active && g.startedAtLeft && g.forwardMoved && g.direction === 1 && docked && armed && target.x === geometry.bound);
    releaseGesture();
    follow();
  }
  function keydown(event) {
    if (event.key === 'Escape') { event.preventDefault(); pause(); return; }
    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (busy || destroyed || gesture) return;
    pending = false;
    keyboard = keyboard?.key === event.key ? keyboard : { key: event.key, forwardMoved: false };
    const previousX = target.x;
    const x = target.x + (event.key === 'ArrowLeft' ? -26 : event.key === 'ArrowRight' ? 26 : 0);
    // One upward key press overcomes the slot grip; down inserts the card.
    const y = target.y + (event.key === 'ArrowUp' ? -36 : event.key === 'ArrowDown' ? 24 : 0);
    moveTo(x, y, target.y);
    keyboard.forwardMoved ||= docked && armed && target.x > previousX;
    follow();
  }
  function keyup(event) {
    if (!keyboard || keyboard.key !== event.key || busy || destroyed) return;
    event.preventDefault();
    pending = keyboard.key === 'ArrowRight' && keyboard.forwardMoved && docked && armed && target.x === geometry.bound;
    keyboard = null;
    follow();
  }
  function reset() {
    if (destroyed) return;
    releaseGesture();
    stop();
    clearTimeout(completionTimer);
    completionTimer = 0;
    keyboard = null;
    docked = armed = busy = pending = interrupted = false;
    position = pose();
    target = pose();
    velocity = still();
    root.dataset.readerBusy = 'false';
    card.removeAttribute('aria-disabled');
    measure();
    setState('IDLE');
    paint();
  }
  function resize() {
    if (destroyed || !root.clientWidth) return;
    const old = geometry;
    measure();
    if (Math.abs(old.scale - geometry.scale) < .0001 && Math.abs(old.dockY - geometry.dockY) < .05) return;
    pending = false;
    releaseGesture();
    keyboard = null;
    stop();
    position.x = clamp(position.x / old.bound, -1, 1) * geometry.bound;
    position.y = docked ? geometry.dockY : clamp(position.y, geometry.minY, geometry.dockY + 52);
    target = { ...position };
    velocity = still();
    refreshState();
    paint();
  }

  reset();
  const observer = new ResizeObserver(resize);
  observer.observe(root);
  observer.observe(card);
  card.addEventListener('pointerdown', down, listen);
  card.addEventListener('pointermove', move, listen);
  card.addEventListener('pointerup', up, listen);
  card.addEventListener('pointercancel', event => { if (gesture?.id === event.pointerId) pause(); }, listen);
  card.addEventListener('lostpointercapture', event => { if (gesture?.id === event.pointerId) pause(); }, listen);
  card.addEventListener('keydown', keydown, listen);
  card.addEventListener('keyup', keyup, listen);
  card.addEventListener('blur', () => { if (gesture || keyboard || pending) pause(); }, listen);
  card.addEventListener('click', event => event.preventDefault(), listen);
  card.addEventListener('dragstart', event => event.preventDefault(), listen);
  card.addEventListener('contextmenu', event => event.preventDefault(), listen);
  window.addEventListener('blur', () => { if (gesture || keyboard || pending) pause(); }, listen);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && (gesture || keyboard || pending)) pause();
  }, listen);
  media.addEventListener('change', () => { if (!busy) pause(); }, listen);

  return {
    reset, pause, refreshText: paint,
    destroy() {
      releaseGesture();
      destroyed = true;
      events.abort();
      observer.disconnect();
      stop();
      clearTimeout(completionTimer);
    },
    get state() { return state; },
  };
}

const COPY = {
  en: {
    title: 'Swipe into my teaching portfolio',
    label: 'Move Shahd’s card with the mouse, touch, or four arrow keys. Insert it, then swipe from left to right.',
    alt: 'Shahd Mohamed’s original university ID card', region: 'Teaching portfolio files',
    verified: 'Access granted', outside: 'Card outside the reader. Move down to insert.',
    inserted: 'Card inserted. Move all the way left to start.',
    progress: value => `${value} percent. Swipe all the way right and release.`,
    states: {
      IDLE: 'Insert the card, move it all the way left, then swipe to the far right and release.',
      HELD: 'Move freely. Lower the bottom edge into the slot.',
      INSERTED: 'Card inserted. Move all the way left to start reading.',
      ARMED: 'Ready. Swipe through the slot from left to the far right.',
      SCANNING: 'Scanning. Continue to the far right, then release.',
      INCOMPLETE: 'Pass incomplete. Move all the way left, then swipe continuously to the far right and release.',
      READY: 'Access granted. Your teaching portfolio files are open below.',
    },
  },
  ar: {
    title: 'مرّري البطاقة لاستكشاف ملفّي التعليمي',
    label: 'حرّكي بطاقة شهد بالماوس أو اللمس أو الأسهم الأربعة. أدخليها في الشق ثم اسحبي من اليسار لآخر اليمين.',
    alt: 'بطاقة شهد محمد الجامعية الأصلية', region: 'ملفات البورتفوليو التعليمي',
    verified: 'تم التحقق وفتح الملفات', outside: 'البطاقة خارج القارئ. حرّكيها لأسفل لإدخالها.',
    inserted: 'البطاقة داخل القارئ. حرّكيها إلى أقصى اليسار أولًا.',
    progress: value => `${value} بالمئة. اسحبي إلى آخر اليمين ثم اتركي البطاقة.`,
    states: {
      IDLE: 'دخّلي البطاقة في الشق، اسحبيها لأقصى اليسار، ثم مرّريها لآخر اليمين وسيبيها.',
      HELD: 'حرّكي البطاقة بحرية، وانزلي بحافتها السفلية داخل الشق.',
      INSERTED: 'البطاقة دخلت. اسحبيها لأقصى اليسار عشان تبدأ القراءة.',
      ARMED: 'جاهزة للسحب. مرّريها داخل الشق من اليسار لآخر اليمين.',
      SCANNING: 'جارٍ الفحص. كمّلي داخل الشق لآخر اليمين، وبعدها سيبي البطاقة.',
      INCOMPLETE: 'المرور مش كامل. ارجعي لأقصى اليسار، وبعدها اسحبي لآخر اليمين من غير ما تسيبي البطاقة إلا في الآخر.',
      READY: 'تم التحقق. ملفات البورتفوليو التعليمي مفتوحة بالأسفل.',
    },
  },
};

function initMaterialsReader() {
  const section = document.getElementById('materials');
  const wrapper = section?.querySelector('[data-materials-reader]');
  const files = section?.querySelector('#materials-files');
  if (!wrapper || !files || section.dataset.materialsReaderInit) return;
  // Files are visible in HTML. Only a fully initialized, styled reader may fold them.
  if (getComputedStyle(wrapper).getPropertyValue('--materials-reader-ready').trim() !== '1' ||
      !window.ResizeObserver || !window.PointerEvent) return;
  section.dataset.materialsReaderInit = 'loading';
  const root = wrapper.querySelector('[data-reader-scene]');
  const card = wrapper.querySelector('[data-reader-card]');
  const image = card.querySelector('img');
  const live = wrapper.querySelector('[data-materials-status]');
  const events = new AbortController();
  const listen = { signal: events.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let api = null, opened = false, animation = null;
  let localeObserver, removalObserver, visibilityObserver;
  let disposed = false;
  const getCopy = () => COPY[document.documentElement.lang === 'ar' ? 'ar' : 'en'];

  function updateLanguage() {
    const copy = getCopy();
    wrapper.querySelectorAll('[data-materials-copy]').forEach(node => {
      node.textContent = copy[node.dataset.materialsCopy];
    });
    card.setAttribute('aria-label', copy.label);
    image.alt = copy.alt;
    files.setAttribute('aria-label', copy.region);
    if (api) {
      const message = copy.states[api.state];
      if (live.textContent !== message) live.textContent = message;
      api.refreshText();
    }
  }

  function revealMaterials({ source: reason }) {
    if (opened || disposed) return;
    opened = true;
    files.hidden = false;
    files.inert = false;
    section.dataset.materialsOpen = 'true';
    section.dataset.materialsOpenSource = reason;
    updateLanguage();
    if (!reduced.matches && files.animate) {
      animation = files.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 280, easing: 'cubic-bezier(.2,.75,.25,1)' });
    }
    // Focus makes the revealed links the next keyboard stops without a page jump.
    files.focus({ preventScroll: true });
    section.dispatchEvent(new CustomEvent('materials:revealed', { bubbles: true, detail: { source: reason } }));
    // Keep the reader visible after access is granted so the interaction
    // remains part of the materials section instead of disappearing.
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    events.abort();
    localeObserver?.disconnect();
    removalObserver?.disconnect();
    visibilityObserver?.disconnect();
    api?.destroy();
    animation?.cancel();
    // A failed or removed reader must never strand the public files.
    files.hidden = false;
    files.inert = false;
    wrapper.hidden = true;
    delete section.dataset.materialsReaderInit;
  }

  function start() {
    if (disposed || api) return;
    if (!image.naturalWidth) { dispose(); return; }
    try {
      wrapper.hidden = false;
      updateLanguage();
      api = createCardReader(root, {
        getCopy,
        onState(state) {
          live.dataset.state = state;
          const message = getCopy().states[state];
          if (live.textContent !== message) live.textContent = message;
        },
        onComplete: () => revealMaterials({ source: 'swipe' }),
      });
      // The site's synchronous locale renderer replaces grid children, not this wrapper.
      localeObserver = new MutationObserver(updateLanguage);
      localeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
      removalObserver = new MutationObserver(() => {
        if (!section.isConnected || !wrapper.isConnected) dispose();
      });
      removalObserver.observe(section.parentNode, { childList: true, subtree: true });
      if ('IntersectionObserver' in window) {
        visibilityObserver = new IntersectionObserver(entries => {
          wrapper.dataset.visible = String(entries[0].isIntersecting);
          if (!entries[0].isIntersecting) api.pause();
        });
        visibilityObserver.observe(wrapper);
      }
      window.addEventListener('pagehide', event => {
        if (event.persisted) { api.pause(); animation?.cancel(); }
        else dispose();
      }, listen);
      reduced.addEventListener('change', () => { if (reduced.matches) animation?.cancel(); }, listen);
      files.hidden = true;
      files.inert = true;
      section.dataset.materialsReaderInit = 'ready';
      section.dataset.materialsOpen = 'false';
    } catch (error) {
      dispose();
      console.warn('Materials reader unavailable; portfolio files remain accessible.', error);
    }
  }
  image.addEventListener('error', dispose, listen);
  if (image.complete) start();
  else image.addEventListener('load', start, { ...listen, once: true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMaterialsReader, { once: true });
else initMaterialsReader();
})();

/* Existing evidence, presented as an archive. No uploaded or invented documents. */
(() => {
  'use strict';
  const section = document.getElementById('materials');
  const files = document.getElementById('materials-files');
  const grid = document.getElementById('materialsGrid');
  if (!files || !grid || section.dataset.passportReady || getComputedStyle(files).getPropertyValue('--passport-ready').trim() !== '1') return;
  section.dataset.passportReady = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const listen = { signal: events.signal };
  const passport = document.createElement('div');
  passport.className = 'portfolio-passport';
  const heading = document.createElement('h3');
  const caption = document.createElement('p');
  const stamps = document.createElement('nav');
  stamps.className = 'passport-stamps';
  passport.append(heading, caption, stamps);
  files.prepend(passport);
  const verified = document.createElement('div');
  verified.className = 'verified-id';
  verified.hidden = true;
  const surface = document.createElement('div');
  surface.className = 'verified-id-surface';
  const original = section.querySelector('[data-reader-card] img');
  if (original) { surface.append(original.cloneNode(true)); verified.append(surface); passport.after(verified); }
  const pending = new Map();
  let usedReveal = false;
  const copy = () => document.documentElement.lang === 'ar' ? {
    heading:'جواز البورتفوليو', caption:'مسارات إلى أعمالي وشواهدي المهنية', label:'تصنيفات شواهد البورتفوليو',
    names:['التدريس','التقييم','التصميم التعليمي','تكنولوجيا التعليم'], paper:'فتح الشاهد الأصلي',
  } : { heading:'Portfolio Passport', caption:'A field guide to my work and professional evidence', label:'Portfolio evidence categories',
    names:['Teaching','Assessment','Instructional Design','EdTech'], paper:'Open original evidence' };
  // Exact sources are the existing teaching project, assessment design, timeline
  // research, and live assessment. No new URLs or inferred qualifications.
  const sources = [
    '#workSpine [data-project-index="5"] .proj-links a',
    '#workSpine [data-project-index="1"] .proj-links a',
    '#workSpine [data-project-index="0"] .proj-links a',
    '#workSpine [data-project-index="1"] .proj-links a:last-child',
  ];
  function decorate() {
    const c = copy();
    heading.textContent = c.heading; caption.textContent = c.caption;
    stamps.setAttribute('aria-label', c.label);
    stamps.replaceChildren();
    sources.forEach((selector, i) => {
      const source = document.querySelector(selector);
      if (!source || !/^https?:/.test(source.href)) return;
      const a = document.createElement('a');
      a.className = 'passport-stamp'; a.href = source.href;
      a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = c.names[i];
      stamps.append(a);
    });
    if (original && surface.firstElementChild) surface.firstElementChild.alt = original.alt;
    [...grid.querySelectorAll('a')].forEach((a, i) => {
      // CV retains its own direct link and Printer / Paper Edition entry points.
      if (i === 2 || a.querySelector('.file-window')) return;
      a.classList.add('paper-file');
      const window = document.createElement('span'); window.className = 'file-window'; window.setAttribute('aria-hidden','true');
      const sheet = document.createElement('span'); sheet.className = 'file-paper';
      const name = document.createElement('span'); name.textContent = a.querySelector('.mname')?.textContent || '';
      sheet.append(name); window.append(sheet); a.prepend(window);
      a.title = c.paper;
    });
  }
  decorate();
  const observer = new MutationObserver(decorate);
  observer.observe(grid, { childList: true });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  function finish(a) {
    const job = pending.get(a);
    if (!job) return;
    clearTimeout(job.timer); pending.delete(a); a.classList.remove('is-opening');
    const tab = window.open(job.href, '_blank');
    if (tab) tab.opener = null;
    else window.location.assign(job.href);
  }
  grid.addEventListener('click', event => {
    const a = event.target.closest('a.paper-file');
    if (!a || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced.matches) return;
    event.preventDefault();
    if (pending.has(a)) return;
    // Show the short reveal first. Browsers that block the new tab continue in
    // this tab, so evidence remains accessible without an orphaned blank window.
    const duration = usedReveal ? 140 : 360;
    usedReveal = true;
    a.style.setProperty('--file-duration', `${duration}ms`);
    a.classList.add('is-opening');
    pending.set(a, { href: a.href, timer: setTimeout(() => finish(a), duration) });
  }, listen);

  // One controller for the post-scan surface; the original reader physics is untouched.
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  let raf = 0, last = 0, rx = 0, ry = 0, tx = 0, ty = 0, rect;
  let touching = null, visible = false, orientationListening = false, permissionAsked = false, baseline = null;
  function draw(now) {
    raf = 0;
    if (reduced.matches || !visible || document.hidden) { neutral(true); return; }
    const step = 1 - Math.exp(-(last ? now-last : 16.67)/52); last = now;
    rx += (tx-rx)*step; ry += (ty-ry)*step;
    const settled = Math.abs(tx-rx)<.015 && Math.abs(ty-ry)<.015;
    if (settled) { rx=tx; ry=ty; }
    surface.style.transform = rx || ry ? `perspective(900px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)` : '';
    surface.style.setProperty('--tilt-light', String(Math.min(.18,(Math.abs(rx)+Math.abs(ry))*.012)));
    surface.style.setProperty('--tilt-x', `${50+ry*3}%`);
    surface.style.setProperty('--tilt-y', `${50-rx*3}%`);
    if (!settled) raf=requestAnimationFrame(draw);
    else { surface.style.willChange=''; last=0; }
  }
  function target(x,y) {
    if (!visible || reduced.matches || document.hidden) return;
    tx=clamp(x,-10,10); ty=clamp(y,-10,10);
    if (Math.abs(tx-rx)<.015 && Math.abs(ty-ry)<.015) return;
    surface.style.willChange='transform';
    if(!raf) raf=requestAnimationFrame(draw);
  }
  function neutral(immediate=false) {
    tx=ty=0; baseline=null;
    if(immediate || reduced.matches) {
      cancelAnimationFrame(raf); raf=last=rx=ry=0; surface.style.transform=''; surface.style.willChange=''; surface.style.setProperty('--tilt-light','0');
    } else if((rx || ry) && !raf) raf=requestAnimationFrame(draw);
  }
  function point(event) {
    if (!rect || (event.pointerType !== 'mouse' && event.pointerId !== touching)) return;
    target(-(event.clientY-rect.top)/rect.height*20+10,(event.clientX-rect.left)/rect.width*20-10);
  }
  function orientation(event) {
    if (reduced.matches || document.hidden || !visible) { neutral(true); return; }
    if (touching !== null || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    baseline ||= { beta:event.beta, gamma:event.gamma };
    const angle=(screen.orientation?.angle || 0)*Math.PI/180;
    const x=(event.beta-baseline.beta)*.35, y=(event.gamma-baseline.gamma)*.35;
    target(-x*Math.cos(angle)+y*Math.sin(angle),y*Math.cos(angle)+x*Math.sin(angle));
  }
  function stopOrientation() { window.removeEventListener('deviceorientation',orientation); orientationListening=false; baseline=null; }
  async function enableOrientation() {
    if(permissionAsked || reduced.matches || !window.DeviceOrientationEvent) return;
    permissionAsked=true;
    try {
      const api=window.DeviceOrientationEvent;
      const granted=typeof api.requestPermission !== 'function' || await api.requestPermission() === 'granted';
      if(granted && visible && !events.signal.aborted) {
        window.addEventListener('deviceorientation',orientation,{passive:true}); orientationListening=true;
      }
    } catch { /* Touch remains available when permission is denied or unsupported. */ }
  }
  verified.addEventListener('pointerenter',event=>{rect=verified.getBoundingClientRect();if(event.pointerType==='mouse')point(event);},listen);
  verified.addEventListener('pointermove',point,{...listen,passive:true});
  verified.addEventListener('pointerleave',()=>{if(touching===null)neutral();},listen);
  verified.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse' || touching!==null || reduced.matches) return;
    rect=verified.getBoundingClientRect(); touching=event.pointerId;
    verified.setPointerCapture(event.pointerId); point(event); enableOrientation();
  },listen);
  function release(event) {
    if(touching!==event.pointerId) return;
    touching=null; if(verified.hasPointerCapture(event.pointerId))verified.releasePointerCapture(event.pointerId); neutral();
  }
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>verified.addEventListener(type,release,listen));
  const visibility = new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting && !verified.hidden;
    if(!visible){neutral(true); if(orientationListening){stopOrientation();permissionAsked=false;}}
  });
  visibility.observe(verified);
  section.addEventListener('materials:revealed',event=>{
    if(event.detail.source==='swipe' && original){verified.hidden=false;decorate();}
  },listen);
  const resize = new ResizeObserver(()=>{rect=null;neutral(true);}); resize.observe(verified);
  window.addEventListener('resize',()=>{rect=null;neutral(true);},listen);
  window.addEventListener('blur',()=>neutral(true),listen);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){neutral(true);for(const a of pending.keys())finish(a);}},listen);
  reduced.addEventListener('change',()=>{neutral(true);if(reduced.matches){stopOrientation();permissionAsked=false;for(const a of pending.keys())finish(a);}},listen);
  window.addEventListener('pagehide',event=>{
    neutral(true);stopOrientation();permissionAsked=false;
    for(const a of pending.keys())finish(a);
    if(!event.persisted){events.abort();observer.disconnect();visibility.disconnect();resize.disconnect();}
  },listen);
})();

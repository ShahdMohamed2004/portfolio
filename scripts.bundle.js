/* --- shahd-card.js --- */
(() => {
  'use strict';
  const DEFAULT_PHOTO = 'assets/about.webp';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const style = `
    :host{display:block;position:relative;width:100%;height:500px;min-width:0;contain:layout style;direction:ltr;color:#193b31;--card-width:184px;--card-height:276px;--clip-height:28px;--scene-light:rgba(209,182,121,.055);font-family:'Space Grotesk',Arial,sans-serif}
    *,*::before,*::after{box-sizing:border-box}
    .scene{position:absolute;inset:0;isolation:isolate;overflow:hidden;border-radius:12px;background:radial-gradient(ellipse at 50% 53%,var(--scene-light),transparent 65%)}
    .ambient{position:absolute;inset:36px 0 48px;border-radius:50%;-webkit-mask-image:radial-gradient(ellipse at 50% 54%,#000 24%,transparent 72%);mask-image:radial-gradient(ellipse at 50% 54%,#000 24%,transparent 72%);pointer-events:none;z-index:0;background:radial-gradient(ellipse at 24% 52%,var(--badge-glow-a,rgba(116,177,154,.09)),transparent 64%),radial-gradient(ellipse at 76% 68%,var(--badge-glow-b,rgba(201,166,98,.08)),transparent 62%)}
    .glass{position:absolute;left:50%;top:37%;width:65%;height:49%;border:1px solid var(--badge-glass-line,rgba(210,220,192,.08));border-radius:24px;background:var(--badge-glass-fill,linear-gradient(135deg,#ffffff05,#ffffff00));box-shadow:var(--badge-glass-shadow,none);transform:translateX(-50%) rotate(-9deg);pointer-events:none;z-index:1}
    .glass.second{transform:translateX(-50%) rotate(8deg);top:39%;width:62%;opacity:.65}
    canvas{position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;z-index:2}
    .assembly{position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0;z-index:3;will-change:transform}
    .assembly:focus{outline:none}
    .assembly:focus-visible:not(.pointer-focus) .card{outline:2px solid #d9b767;outline-offset:6px}
    .card{position:absolute;left:calc(var(--card-width) / -2);top:var(--clip-height);width:var(--card-width);height:var(--card-height);padding:0;overflow:hidden;border:1px solid #e6decb;border-radius:9px;background:#f2eee3;box-shadow:1px 2px 0 #a89e83,2px 3px 0 #776e57,0 9px 15px -9px #0009, var(--shadow-x,9px) 22px 32px -16px #0009;cursor:grab;touch-action:pan-y pinch-zoom;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;color:#173b31}
    @media(hover:hover) and (pointer:fine){.card{touch-action:none}}
    .scene.touch-drag .card{touch-action:none}
    .assembly.dragging .card{cursor:grabbing}
    .card::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:4;background:linear-gradient(var(--shine,117deg),#fff1 2%,#fff0 32%,#fff3 44%,#fff0 56%,#fff0 81%,#ffffff15);box-shadow:inset 0 0 0 2px #fff3,inset -1px 0 1px #fff8;border-radius:inherit}
    .card-top{height:32px;position:relative;display:flex;align-items:center;justify-content:space-between;padding:0 13px;color:#536457;font-size:6px;letter-spacing:1.5px;font-weight:600}
    .slot{position:absolute;left:50%;top:7px;transform:translateX(-50%);width:28px;height:6px;border-radius:5px;background:#25392f;box-shadow:inset 0 1px 2px #000b,0 1px 0 #fff;border:1px solid #908b76}
    .card-top span{align-self:flex-end;margin-bottom:5px}
    .brand-mark{width:12px;height:12px;display:grid;place-items:center;border:1px solid #54715d;border-radius:50%;font:italic 10px Georgia,serif;align-self:flex-end;margin-bottom:3px}
    .portrait{position:relative;margin:0 11px;height:151px;border-radius:3px;overflow:hidden;background:#e0e6df}
    .portrait img{display:block;width:100%;height:100%;object-fit:cover;object-position:center 37%;pointer-events:none;filter:saturate(.85) contrast(.97)}
    .portrait::after{content:'';position:absolute;inset:0;pointer-events:none;border:1px solid #152b2315;border-radius:inherit;background:linear-gradient(180deg,transparent 65%,#173b3112)}
    .portrait-label{position:absolute;bottom:7px;left:7px;background:#173b31eb;color:#f5efdf;border-radius:2px;padding:3px 5px;font-size:5.5px;letter-spacing:1.3px;z-index:1}
    .identity{padding:10px 12px 0}
    :host(.rtl) .identity{direction:rtl;text-align:right}
    :host(.rtl) .role{direction:rtl;text-align:right}
    :host(.rtl) .portrait-label{direction:rtl;letter-spacing:0;text-align:right}
    :host(.rtl) .discipline{direction:rtl;letter-spacing:.25px}
    .name{display:block;font-family:'Fraunces',Georgia,serif;font-size:18px;font-weight:500;line-height:1.06;letter-spacing:-.6px;white-space:nowrap}
    .role{display:block;margin-top:5px;font-size:8px;line-height:1.45;color:#52675b;font-weight:500;letter-spacing:0}
    .footer{position:absolute;left:12px;right:12px;bottom:10px;border-top:1px solid #263e3029;padding-top:8px;display:flex;align-items:center;justify-content:space-between;gap:4px}
    .discipline{font-size:6px;letter-spacing:1.25px;font-weight:600;white-space:nowrap}
    .lines{height:9px;width:29px;opacity:.6;background:repeating-linear-gradient(90deg,#254537 0 1px,transparent 1px 3px,#254537 3px 5px,transparent 5px 7px)}
    .corner{position:absolute;right:0;bottom:0;border-style:solid;border-width:0 0 9px 9px;border-color:transparent transparent #c5a361 transparent}
    .clip{position:absolute;left:-8px;top:-3px;width:16px;height:39px;z-index:6;pointer-events:none;filter:drop-shadow(1px 2px 1px #0004)}
    .ring{position:absolute;left:2px;top:0;width:12px;height:15px;border-radius:7px;border:2px solid #acb0a2;background:transparent;box-shadow:inset 1px 0 #f8f7eb,1px 0 #343d36}
    .swivel{position:absolute;left:4px;top:12px;width:8px;height:8px;border:1px solid #697467;border-radius:3px;background:linear-gradient(90deg,#626b5c,#f0efe0 40%,#b8baa9 65%,#697261)}
    .clasp{position:absolute;left:3px;top:17px;width:10px;height:19px;border:1px solid #727a6d;border-radius:3px;background:linear-gradient(90deg,#7a8472,#f7f4e5 35%,#c6c7b4 66%,#7a8472);box-shadow:inset 0 1px #ffffffd9}
    .clasp::after{content:'';position:absolute;left:2px;top:4px;width:4px;height:10px;border-right:1px solid #747e6d;border-bottom:1px solid #747e6d;border-radius:1px;opacity:.8}
    @media(max-width:767px){:host{height:400px;--card-width:150px;--card-height:229px;--clip-height:26px}.card{border-radius:7px}.card-top{height:29px;padding:0 10px;font-size:5px}.portrait{height:123px;margin-inline:9px}.identity{padding:9px 10px 0}.name{font-size:14.5px;letter-spacing:-.4px}.role{font-size:6.8px;margin-top:4px}.footer{left:10px;right:10px;bottom:9px;padding-top:7px}.discipline{font-size:5px;letter-spacing:1px}.hint{font-size:8px;bottom:7px}.clasp{height:17px}.portrait-label{font-size:5px}}
    @media(prefers-reduced-motion:reduce){.hint{transition:none}}
    @media(forced-colors:active){.ambient,.glass{display:none}.control,.card{border:1px solid ButtonText}.assembly:focus-visible:not(.pointer-focus) .card{outline-color:Highlight}}
  `;
  class ShahdLanyard extends HTMLElement {
    connectedCallback() {
      if (this._alive) return;
      this._alive = true;
      this.attachShadowOnce();
      this.abort = new AbortController();
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
      this.fine = matchMedia('(hover: hover) and (pointer: fine)');
      this.raf = 0; this.lastFrame = 0; this.accumulator = 0;
      this.angle = 0; this.angularVelocity = 0; this.wind = 0;
      this.visible = true; this.drag = null; this.quiet = 0; this.nodes = [];
      this.lastPointer = null;
      // All motion tuning lives here so it can be adjusted without hunting through the solver.
      this.physics = {
        gravity: 980, ropeDamping: .987, stretchDamping: .84,
        dragFollow: .18, dragVelocity: .42, dragMaxSpeed: 18,
        spring: 30, angularDamping: 7.2, edgeSoftness: 28,
        maxStretchRatio: .34, maxStretchPx: 42, fixedStep: 1 / 120
      };
      const on = (el, type, fn, options = {}) => el.addEventListener(type, fn, {...options, signal:this.abort.signal});
      on(this.card, 'pointerdown', e => this.grab(e));
      on(this.card, 'pointermove', e => this.move(e));
      on(this.card, 'pointerup', e => this.release(e));
      on(this.card, 'pointercancel', e => this.release(e));
      on(this.card, 'lostpointercapture', e => this.release(e));
      on(this.card, 'pointerover', e => this.breeze(e));
      on(this.card, 'pointermove', e => this.breeze(e));
      on(this.assembly, 'keydown', e => this.keyboard(e));
      on(window, 'blur', () => this.release());
      on(document, 'visibilitychange', () => {
        if (document.hidden) { this.release(); this.pause(); }
        else this.wake();
      });
      on(this.reduced, 'change', () => { this.release(); this.pause(); this.reset(); this.draw(); this.wake(); });
      this.languageObserver=new MutationObserver(()=>this.updateLanguage());
      this.languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
      this.updateLanguage();
      this.resizeObserver = new ResizeObserver(() => this.measure());
      this.resizeObserver.observe(this);
      this.intersection = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        if (this.visible) this.wake(); else this.pause();
      }, {rootMargin:'60px'});
      this.intersection.observe(this);
      this.measure();
    }
    attachShadowOnce() {
      if (!this.shadowRoot) this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML = `<style>${style}</style>
        <div class="scene">
          <div class="ambient" aria-hidden="true"></div><div class="glass" aria-hidden="true"></div><div class="glass second" aria-hidden="true"></div>
          <canvas aria-hidden="true"></canvas>
          <div class="assembly" tabindex="0" role="application" aria-label="Interactive identity badge">
            <div class="clip" aria-hidden="true"><i class="ring"></i><i class="swivel"></i><i class="clasp"></i></div>
            <div class="card">
              <div class="card-top" aria-hidden="true"><span>EDUCATOR</span><i class="slot"></i><i class="brand-mark">s</i></div>
              <div class="portrait"><img alt="Shahd Mohamed" draggable="false" width="480" height="640"><span class="portrait-label" aria-hidden="true">LANGUAGE & LEARNING</span></div>
              <div class="identity"><strong class="name">Shahd Mohamed</strong><span class="role">English Language Educator</span></div>
              <div class="footer"><span class="discipline">TEFL &nbsp; / &nbsp; EDUCATION</span><span class="lines" aria-hidden="true"></span></div>
              <i class="corner" aria-hidden="true"></i>
            </div>
          </div>
        </div>`;
      this.scene=this.shadowRoot.querySelector('.scene');
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.card = this.shadowRoot.querySelector('.card');
      this.assembly = this.shadowRoot.querySelector('.assembly');
      const image = this.shadowRoot.querySelector('img');
      image.src = this.getAttribute('photo') || DEFAULT_PHOTO;
      image.onerror = () => { image.onerror = null; image.src = DEFAULT_PHOTO; };
    }
    updateLanguage() {
      if (!this.shadowRoot) return;
      const ar = document.documentElement.lang === 'ar';
      this.classList.toggle('rtl', ar);
      const q = selector => this.shadowRoot.querySelector(selector);
      const topLabel = q('.card-top span');
      const portraitLabel = q('.portrait-label');
      const role = q('.role');
      const discipline = q('.discipline');
      const assembly = q('.assembly');
      if(topLabel) topLabel.textContent = ar ? 'مُعلّمة' : 'EDUCATOR';
      if(portraitLabel) portraitLabel.textContent = ar ? 'اللغة والتعلّم' : 'LANGUAGE & LEARNING';
      if(role) role.textContent = ar ? 'معلمة لغة إنجليزية' : 'English Language Educator';
      if(discipline) discipline.textContent = ar ? 'TEFL  /  التعليم' : 'TEFL   /   EDUCATION';
      if(assembly) assembly.setAttribute('aria-label', ar ? 'بطاقة الهوية التفاعلية' : 'Interactive identity badge');
    }
    disconnectedCallback() {
      this._alive = false; this.release(); this.pause(); this.abort?.abort();
      this.resizeObserver?.disconnect(); this.intersection?.disconnect(); this.languageObserver?.disconnect();
    }
    measure() {
      const w = this.clientWidth, h = this.clientHeight;
      if (!w || !h) return;
      this.w = w; this.h = h;
      this.cw = this.card.offsetWidth; this.ch = this.card.offsetHeight;
      this.clip = parseFloat(getComputedStyle(this).getPropertyValue('--clip-height')) || 28;
      this.anchor = {x:w / 2, y:15};
      this.edgePadding = clamp(Math.min(w, h) * .04, 10, 18);
      this.maxAngle = clamp(Math.atan2(Math.max(18, w - this.cw - this.edgePadding * 2), this.ch + this.clip) * .34, .12, .34);
      // The resting length is derived from the actual card and available host height.
      const minRope = Math.max(38, h * .10), maxRope = Math.max(minRope + 12, h * .48);
      // Compact resting hang; the extra distance is earned only while the card is pulled.
      this.ropeLength = clamp(h - this.ch - this.clip - Math.max(30, h * .18), minRope, maxRope);
      this.maxStretch = Math.min(this.physics.maxStretchPx, this.ropeLength * this.physics.maxStretchRatio);
      this.currentLength = this.ropeLength;
      this.linkLength = this.ropeLength / 16;
      this.dpr = Math.min(devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(w * this.dpr);
      this.canvas.height = Math.round(h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.release(); this.reset(); this.draw(); this.wake();
    }
    reset() {
      if (!this.anchor) return;
      this.currentLength=this.ropeLength; this.linkLength=this.ropeLength/16;
      this.nodes = Array.from({length:17}, (_, i) => ({x:this.anchor.x, y:this.anchor.y + i*this.linkLength, px:this.anchor.x, py:this.anchor.y + i*this.linkLength, mass:i === 0 ? 0 : i === 16 ? .075 : 1}));
      this.angle = 0; this.angularVelocity = 0; this.wind = 0; this.quiet = 0;
    }
    local(e) {
      const rect = this.getBoundingClientRect();
      return {x:(e.clientX - rect.left)*this.w/rect.width, y:(e.clientY-rect.top)*this.h/rect.height};
    }
    grab(e) {
      if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0) || this.drag || !this.nodes.length) return;
      const p = this.local(e), end = this.nodes[16];
      const dx=p.x-end.x, dy=p.y-end.y, c=Math.cos(this.angle), s=Math.sin(this.angle);
      this.drag = {id:e.pointerId, x:p.x, y:p.y, startX:p.x, startY:p.y, axis:e.pointerType==='touch'?null:'both', vx:0, vy:0, offsetX:dx*c+dy*s, offsetY:-dx*s+dy*c, time:e.timeStamp};
      this.lastPointer = null;
      this.card.setPointerCapture(e.pointerId);
      this.assembly.classList.add('dragging', 'pointer-focus');
      this.assembly.focus({preventScroll:true});
      if(e.pointerType!=='touch') e.preventDefault();
      this.wake();
    }
    move(e) {
      if (!this.drag || this.drag.id !== e.pointerId) return;
      const p = this.local(e);
      if(e.pointerType==='touch' && !this.drag.axis){
        const dx=p.x-this.drag.startX, dy=p.y-this.drag.startY;
        if(Math.hypot(dx,dy)<6) return;
        if(Math.abs(dy)>Math.abs(dx)*1.12){ this.release(e); return; }
        this.drag.axis='x'; this.scene.classList.add('touch-drag');
      }
      const elapsed = Math.max(1, e.timeStamp - this.drag.time) / 1000;
      this.drag.vx = clamp((p.x - this.drag.x) / elapsed, -this.physics.dragMaxSpeed * 60, this.physics.dragMaxSpeed * 60);
      this.drag.vy = clamp((p.y - this.drag.y) / elapsed, -this.physics.dragMaxSpeed * 60, this.physics.dragMaxSpeed * 60);
      this.drag.x=p.x; this.drag.y=p.y; this.drag.time=e.timeStamp;
      e.preventDefault(); this.wake();
    }
    release(e) {
      if (!this.drag || (e && e.pointerId !== this.drag.id)) return;
      const id = this.drag.id; this.drag = null;
      this.assembly.classList.remove('dragging');
      this.scene.classList.remove('touch-drag');
      if (this.card.hasPointerCapture(id)) this.card.releasePointerCapture(id);
      // Reduced motion returns immediately; other users retain bounded momentum.
      if(this.reduced.matches){this.pause();this.reset();this.draw();return;}
      this.wake();
    }
    keyboard(e) {
      this.assembly.classList.remove('pointer-focus');
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','Enter',' '].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Home') { this.release(); this.pause(); this.reset(); this.draw(); return; }
      else if (!this.reduced.matches) {
        const end = this.nodes[16], force=e.shiftKey?1.8:1;
        if (['ArrowLeft','ArrowRight','Enter',' '].includes(e.key)) end.px += (e.key === 'ArrowLeft'?2.2:-2.2)*force;
        else end.py += (e.key === 'ArrowUp'?1.3:-1.3)*force;
      }
      this.wake();
    }
    breeze(e) {
      if (this.drag || this.reduced.matches || !this.fine.matches || e.pointerType === 'touch') return;
      const p=this.local(e), previous=this.lastPointer;
      this.lastPointer={...p,t:e.timeStamp};
      if (!previous || e.timeStamp-previous.t > 150) return;
      const near=clamp(1-Math.abs(p.x-this.w/2)/(this.w*.9),0,1);
      this.wind=clamp((p.x-previous.x)*.1,-2,2)*near;
      if (Math.abs(this.wind) > .02) this.wake();
    }
    bounds(angle=this.angle) {
      const c=Math.cos(angle),s=Math.sin(angle),half=this.cw/2;
      const corners=[[-half,this.clip],[half,this.clip],[-half,this.clip+this.ch],[half,this.clip+this.ch],[-8,-3],[8,-3],[-8,36],[8,36]];
      const xs=corners.map(([x,y])=>x*c-y*s),ys=corners.map(([x,y])=>x*s+y*c);
      const pad=this.edgePadding || 12;
      return {left:pad-Math.min(...xs),right:this.w-pad-Math.max(...xs),top:pad-Math.min(...ys),bottom:this.h-pad-Math.max(...ys)};
    }
    contain(point) {
      const b=this.bounds();
      point.x=clamp(point.x,b.left,b.right);point.y=clamp(point.y,b.top,b.bottom);
      return point;
    }
    soften(point) {
      const b=this.bounds(), s=this.physics.edgeSoftness;
      const resist=(value,min,max)=>{
        if(value<min+s) return min+s-(min+s-value)*.28;
        if(value>max-s) return max-s+(value-(max-s))*.28;
        return value;
      };
      point.x=resist(point.x,b.left,b.right);point.y=resist(point.y,b.top,b.bottom);
      return this.contain(point);
    }
    target() {
      const c=Math.cos(this.angle), s=Math.sin(this.angle), d=this.drag;
      const p=this.soften({x:d.x-(d.offsetX*c-d.offsetY*s),y:d.y-(d.offsetX*s+d.offsetY*c)});
      const dx=p.x-this.anchor.x,dy=p.y-this.anchor.y,r=Math.hypot(dx,dy),max=this.ropeLength+this.maxStretch;
      if(r>max){p.x=this.anchor.x+dx/r*max;p.y=this.anchor.y+dy/r*max;}
      return this.soften(p);
    }
    step(dt) {
      const n=this.nodes, end=n[16], beforeX=end.x, beforeY=end.y;
      const target=this.drag?this.target():null;
      const desired=target?clamp(Math.hypot(target.x-this.anchor.x,target.y-this.anchor.y),this.ropeLength,this.ropeLength+this.maxStretch):this.ropeLength;
      const lengthRate=target ? .16 : .035;
      this.currentLength+=(desired-this.currentLength)*lengthRate;
      this.linkLength=this.currentLength/16;
      if (this.reduced.matches) {
        if(target){
          for(let i=1;i<n.length;i++){
            const t=i/16;n[i].x=n[i].px=this.anchor.x+(target.x-this.anchor.x)*t;
            n[i].y=n[i].py=this.anchor.y+(target.y-this.anchor.y)*t;
          }
        } else {
          for(let i=1;i<n.length;i++){
            n[i].x+=(this.anchor.x-n[i].x)*.22;n[i].y+=(this.anchor.y+i*this.linkLength-n[i].y)*.22;
            n[i].px=n[i].x;n[i].py=n[i].y;
          }
        }
        this.angle=0; return;
      }
      for(let i=1;i<n.length;i++){
        const p=n[i], vx=(p.x-p.px)*this.physics.ropeDamping, vy=(p.y-p.py)*this.physics.ropeDamping;
        p.px=p.x; p.py=p.y;
        p.x+=vx+this.wind*(i/16)*dt*dt*90;
        p.y+=vy+this.physics.gravity*dt*dt;
      }
      if(target){
        const follow=this.physics.dragFollow;
        end.x+=(target.x-end.x)*follow;
        end.y+=(target.y-end.y)*follow;
        // Carry the measured pointer velocity through the card instead of teleporting it.
        end.px=end.x-(end.x-end.px)*this.physics.stretchDamping;
        end.py=end.y-(end.y-end.py)*this.physics.stretchDamping;
      }
      // Weighted constraints: the card is substantially heavier than each rope point.
      for(let pass=0;pass<20;pass++){
        n[0].x=this.anchor.x; n[0].y=this.anchor.y;
        for(let i=0;i<16;i++){
          const a=n[i],b=n[i+1],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||.001;
          const correction=(len-this.linkLength)/len, total=a.mass+b.mass;
          a.x+=dx*correction*a.mass/total;a.y+=dy*correction*a.mass/total;
          b.x-=dx*correction*b.mass/total;b.y-=dy*correction*b.mass/total;
        }
      }
      // Let pointer movement carry through as a soft breeze instead of a sharp kick.
      this.wind*=.945;
      // A damped angular joint: card orientation lags behind the strap and acceleration.
      const vx=(end.x-beforeX)/dt;
      const lean=clamp((this.anchor.x-end.x)/this.ropeLength*.18+vx*.00035,-.21,.21);
      const torque=this.drag?clamp(this.drag.offsetX/this.cw*.11+this.drag.vx*.0008,-.06,.06):0;
      this.angularVelocity+=((lean+torque-this.angle)*this.physics.spring-this.angularVelocity*this.physics.angularDamping)*dt;
      this.angle=clamp(this.angle+this.angularVelocity*dt,-this.maxAngle,this.maxAngle);
      // Reflect only the outward component at a boundary; this gives a soft, non-sticky edge.
      const oldX=end.x,oldY=end.y;this.contain(end);
      if(oldX!==end.x) end.px=end.x+(end.px-end.x)*-.18;
      if(oldY!==end.y) end.py=end.y+(end.py-end.y)*-.18;
      if(!Number.isFinite(end.x+end.y+this.angle)) this.reset();
    }
    curve() {
      const ns=this.nodes, out=[];
      // Sample Catmull–Rom into a smooth ribbon, including the exact attachment point.
      for(let i=0;i<ns.length-1;i++){
        const p0=ns[Math.max(0,i-1)],p1=ns[i],p2=ns[i+1],p3=ns[Math.min(ns.length-1,i+2)];
        for(let j=0;j<5;j++){
          const t=j/5,t2=t*t,t3=t2*t;
          const axis=k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3);
          out.push({x:axis('x'),y:axis('y')});
        }
      }
      out.push({...ns[16]});
      let distance=0;
      return out.map((p,i)=>{
        const before=out[Math.max(0,i-1)],after=out[Math.min(out.length-1,i+1)];
        const dx=after.x-before.x,dy=after.y-before.y,len=Math.hypot(dx,dy)||1;
        if(i) distance+=Math.hypot(p.x-out[i-1].x,p.y-out[i-1].y);
        return {...p,nx:dy/len,ny:-dx/len,d:distance,angle:Math.atan2(dy,dx)};
      });
    }
    draw() {
      if(!this.nodes.length) return;
      const ctx=this.ctx, pts=this.curve(), width=this.cw>160?13:11;
      ctx.clearRect(0,0,this.w,this.h);
      const path=(offset=0)=>{
        ctx.beginPath();pts.forEach((p,i)=>{const x=p.x+p.nx*offset,y=p.y+p.ny*offset;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
      };
      // A woven ribbon with thickness, edge highlights, transverse fibres and stitches.
      ctx.save();ctx.translate(3,3);path();ctx.strokeStyle='#00000025';ctx.lineWidth=width+1;ctx.lineCap='round';ctx.stroke();ctx.restore();
      const bands=[[-width/2,width,'#141f18'],[-width/2+1,width-2,'#465244'],[-width/2+2,width-4,'#344437'],[-width/2+3,2,'#59624b'],[width/2-2,1,'#818369']];
      bands.forEach(([offset,w,color])=>{path(offset+w/2);ctx.lineWidth=w;ctx.strokeStyle=color;ctx.stroke()});
      ctx.lineWidth=.45;
      for(let d=2;d<pts[pts.length-1].d;d+=2){
        const p=pts.find(p=>p.d>=d);if(!p)continue;
        ctx.beginPath();ctx.moveTo(p.x-p.nx*(width/2-1),p.y-p.ny*(width/2-1));ctx.lineTo(p.x+p.nx*(width/2-1)+.5,p.y+p.ny*(width/2-1)+.5);ctx.strokeStyle=d%4<2?'#d1c69629':'#070f0955';ctx.stroke();
      }
      ctx.setLineDash([1.6,2.5]);ctx.lineWidth=.65;ctx.strokeStyle='#b1ad8270';path(-width/2+1.5);ctx.stroke();path(width/2-1.5);ctx.stroke();ctx.setLineDash([]);
      // Print follows the local tangent, so it bends with the simulated strap.
      ctx.fillStyle='#e3d7b4';ctx.font='600 5px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
      const word='SHAHD / TEFL',start=24;
      [...word].forEach((char,i)=>{const p=pts.find(p=>p.d>=start+i*5);if(!p)return;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillText(char,0,0);ctx.restore()});
      // Small fixed anchor, then the loop feeding into the moving metal swivel.
      ctx.beginPath();ctx.arc(this.anchor.x,this.anchor.y,3.4,0,Math.PI*2);ctx.fillStyle='#bea36c';ctx.fill();ctx.beginPath();ctx.arc(this.anchor.x-.7,this.anchor.y-.9,1.2,0,Math.PI*2);ctx.fillStyle='#f2dfb6';ctx.fill();
      const end=this.nodes[16];
      this.assembly.style.transform=`translate3d(${end.x.toFixed(3)}px,${end.y.toFixed(3)}px,0) rotate(${this.angle.toFixed(5)}rad)`;
      this.card.style.setProperty('--shadow-x',`${(8-this.angle*55).toFixed(1)}px`);
      this.card.style.setProperty('--shine',`${117+this.angle*180}deg`);
    }
    wake() {
      if(!this._alive || this.raf || !this.visible || document.hidden || !this.nodes.length) return;
      if(this.reduced.matches&&!this.drag){this.reset();this.draw();return;}
      this.lastFrame=0;this.accumulator=0;this.quiet=0;
      this.raf=requestAnimationFrame(t=>this.frame(t));
    }
    pause() { cancelAnimationFrame(this.raf);this.raf=0;this.lastFrame=0; }
    frame(time) {
      this.raf=0;
      if(this.reduced.matches&&!this.drag){this.reset();this.draw();this.lastFrame=0;return;}
      const dt=this.lastFrame?Math.min((time-this.lastFrame)/1000,.04):1/60;
      this.lastFrame=time;this.accumulator+=dt;
      while(this.accumulator>=1/120){this.step(1/120);this.accumulator-=1/120;}
      this.draw();
      const end=this.nodes[16];
      const speed=this.nodes.reduce((m,p)=>Math.max(m,Math.abs(p.x-p.px),Math.abs(p.y-p.py)),0);
      const settled=!this.drag&&Math.abs(end.x-this.anchor.x)<.12&&speed<.025&&Math.abs(this.angle)<.002&&Math.abs(this.wind)<.02;
      this.quiet=settled?this.quiet+dt:0;
      // Rest is truly quiet: stop drawing once the physical system has settled.
      if(this.quiet<.4&&this.visible&&!document.hidden&&this._alive) this.raf=requestAnimationFrame(t=>this.frame(t));
      else this.lastFrame=0;
    }
  }
  if(!customElements.get('shahd-lanyard')) customElements.define('shahd-lanyard', ShahdLanyard);
})();

/* --- enhancements.js --- */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

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
    let previewWidth = 230;
    let previewFrame = 0;
    let pendingPoint = null;
    const detailsFor = target => target?.closest?.('.project-details');
    const positionPreview = () => {
      previewFrame = 0;
      if(!pendingPoint || !active || !finePointer.matches) return;
      const {x, y} = pendingPoint;
      preview.style.setProperty('--preview-x', `${clamp(x + 18, 16, window.innerWidth - previewWidth - 16)}px`);
      preview.style.setProperty('--preview-y', `${clamp(y + 18, 78, window.innerHeight - 150)}px`);
    };
    const queuePreviewPosition = (x, y) => {
      pendingPoint = {x, y};
      if(!previewFrame) previewFrame = requestAnimationFrame(positionPreview);
    };
    const showPreview = (details, x, y) => {
      if (!details) return;
      const isArabic = document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl';
      const title = details.querySelector('h3')?.textContent?.trim() || (isArabic ? 'مشروع' : 'Project');
      const image = details.querySelector('img');
      preview.replaceChildren();
      preview.dir = isArabic ? 'rtl' : 'ltr';
      preview.lang = isArabic ? 'ar' : 'en';
      preview.classList.toggle('has-image', Boolean(image));
      if (image) { const clone = image.cloneNode(true); clone.alt = ''; preview.appendChild(clone); }
      const strong = document.createElement('strong'); strong.textContent = title; preview.appendChild(strong);
      const span = document.createElement('span');
      span.textContent = image
        ? (isArabic ? 'معاينة مرئية للمشروع' : 'Existing project visual')
        : (isArabic ? 'افتح بطاقة المشروع لعرض التفاصيل والروابط' : 'Open the project card for details and links');
      preview.appendChild(span);
      preview.classList.add('is-visible');
      previewWidth = preview.getBoundingClientRect().width;
      queuePreviewPosition(x, y);
      active = details;
    };
    const hidePreview = () => { preview.classList.remove('is-visible'); active = null; pendingPoint = null; };
    work.addEventListener('pointerover', event => { if (!finePointer.matches || reducedMotion.matches) return; const details = detailsFor(event.target); if (details) showPreview(details, event.clientX, event.clientY); });
    work.addEventListener('pointermove', event => { if (!active || !finePointer.matches) return; queuePreviewPosition(event.clientX, event.clientY); }, {passive:true});
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

  // Section navigation motion: replay a lightweight transition whenever a
  // user jumps to another section, including links rendered in the mobile drawer.
  const sectionMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sectionMotionTimers = new WeakMap();
  const replaySectionTransition = section => {
    if (!section || sectionMotionQuery.matches) return;
    section.classList.remove('section-entering');
    void section.offsetWidth;
    section.classList.add('section-entering');
    const previousTimer = sectionMotionTimers.get(section);
    if (previousTimer) window.clearTimeout(previousTimer);
    const timer = window.setTimeout(() => {
      section.classList.remove('section-entering');
      sectionMotionTimers.delete(section);
    }, 980);
    sectionMotionTimers.set(section, timer);
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-nav][href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target) window.setTimeout(() => replaySectionTransition(target), 80);
  }, { passive: true });
  sectionMotionQuery.addEventListener?.('change', () => {
    if (sectionMotionQuery.matches) document.querySelectorAll('.section-entering').forEach(section => section.classList.remove('section-entering'));
  });
})();

/* --- glass-nav.js --- */
/* Drawer state only. Pointer motion belongs exclusively to dock-motion.js. */
(() => {
  'use strict';
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const sync = () => header.classList.toggle('open', document.body.classList.contains('menu-open'));
  const observer = new MutationObserver(sync);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('pagehide', event => { if (!event.persisted) observer.disconnect(); });
  sync();
})();

/* --- dock-motion.js --- */
/* A single, header-local controller. No document pointer tracking or scroll loop. */
(() => {
  'use strict';
  const header = document.getElementById('siteHeader');
  if (!header || header.dataset.dockReady) return;
  header.dataset.dockReady = 'true';
  const events = new AbortController();
  const options = { passive: true, signal: events.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const items = [...header.querySelectorAll('.nav-links > a, .nav-utility a, .nav-utility button')]
    .map(node => ({ node, x: 0, y: 0, scale: 1, tx: 0, ty: 0, ts: 1, rect: null }));
  items.forEach(item => item.node.classList.add('dock-control'));
  let bounds, raf = 0, last = 0, inside = false;
  const enabled = () => fine.matches && !reduced.matches && !document.hidden;
  const state = value => { if (header.dataset.dockState !== value) header.dataset.dockState = value; };
  state('RESTING');

  // All reads happen together, only on entry or an actual layout change.
  function measure() {
    bounds = header.getBoundingClientRect();
    items.forEach(item => {
      const r = item.node.getBoundingClientRect();
      item.rect = { x: r.left + r.width / 2 - bounds.left - item.x,
        y: r.top + r.height / 2 - bounds.top - item.y,
        visible: r.width > 0 && r.height > 0 && item.node.getClientRects().length > 0 };
    });
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick(now) {
    raf = 0;
    if (!enabled()) { rest(true); return; }
    const amount = 1 - Math.exp(-(last ? now - last : 16.67) / 42);
    last = now;
    let moving = false;
    for (const item of items) {
      item.x += (item.tx - item.x) * amount;
      item.y += (item.ty - item.y) * amount;
      item.scale += (item.ts - item.scale) * amount;
      const settled = Math.abs(item.tx - item.x) < .015 && Math.abs(item.ty - item.y) < .015 && Math.abs(item.ts - item.scale) < .0005;
      if (settled) { item.x = item.tx; item.y = item.ty; item.scale = item.ts; }
      else moving = true;
      if (item.x === 0 && item.y === 0 && item.scale === 1) {
        item.node.style.removeProperty('translate');
        item.node.style.removeProperty('scale');
      } else {
        item.node.style.translate = `${item.x.toFixed(3)}px ${item.y.toFixed(3)}px`;
        item.node.style.scale = item.scale.toFixed(4);
      }
      item.node.style.willChange = settled ? '' : 'translate, scale';
    }
    if (moving) schedule();
    else { last = 0; if (!inside) state('RESTING'); }
  }
  function rest(immediate = false) {
    inside = false;
    header.classList.remove('is-sheening');
    header.style.removeProperty('--x'); header.style.removeProperty('--y');
    let displaced = false;
    for (const item of items) {
      item.tx = item.ty = 0; item.ts = 1;
      displaced ||= item.x !== 0 || item.y !== 0 || item.scale !== 1;
      if (immediate) {
        item.x = item.y = 0; item.scale = 1;
        ['translate', 'scale', 'will-change'].forEach(key => item.node.style.removeProperty(key));
      }
    }
    if (immediate || !displaced) { cancelAnimationFrame(raf); raf = last = 0; state('RESTING'); }
    else { state('RETURNING'); schedule(); }
  }
  function move(event) {
    if (!enabled() || event.pointerType !== 'mouse') return;
    if (!bounds) measure();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) { rest(); return; }
    inside = true; state('ACTIVE');
    let changed = false;
    for (const item of items) {
      const proximity = item.rect.visible ? Math.max(0, 1 - Math.hypot(x - item.rect.x, y - item.rect.y) / 90) : 0;
      const tx = clamp((x - item.rect.x) * .025, -2, 2) * proximity;
      const ty = -2 * proximity;
      const ts = 1 + .045 * proximity;
      if (Math.abs(item.tx - tx) > .015 || Math.abs(item.ty - ty) > .015 || Math.abs(item.ts - ts) > .0005) {
        item.tx = tx; item.ty = ty; item.ts = ts; changed = true;
      }
    }
    if (changed) schedule();
  }
  header.addEventListener('pointerenter', event => {
    if (!enabled() || event.pointerType !== 'mouse') return;
    measure();
    header.classList.add('is-sheening');
    move(event);
  }, options);
  header.addEventListener('pointermove', move, options);
  header.addEventListener('pointerleave', () => rest(), options);
  header.addEventListener('pointercancel', () => rest(), options);
  header.addEventListener('animationend', event => { if (event.animationName === 'glassSheen') header.classList.remove('is-sheening'); }, options);
  const invalidate = () => { rest(true); bounds = null; };
  // Measure on the next actual interaction, never inside a scroll callback.
  header.addEventListener('pointerover', event => { if (!bounds && enabled()) { measure(); move(event); } }, options);
  const resize = new ResizeObserver(invalidate);
  resize.observe(header);
  items.forEach(item => resize.observe(item.node));
  const locale = new MutationObserver(invalidate);
  locale.observe(document.documentElement, { attributes: true, attributeFilter: ['dir', 'lang'] });
  window.addEventListener('resize', invalidate, options);
  window.addEventListener('blur', () => rest(true), options);
  document.addEventListener('visibilitychange', () => { if (document.hidden) rest(true); }, options);
  reduced.addEventListener('change', invalidate, options);
  fine.addEventListener('change', invalidate, options);
  window.addEventListener('pagehide', event => {
    rest(true);
    if (!event.persisted) { events.abort(); resize.disconnect(); locale.disconnect(); delete header.dataset.dockReady; }
  }, options);
})();

/* --- timeline-physics.js --- */
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

/* --- cv-printer.js --- */
/* Shahd CV Printer 2.0 — replace the old JS and CSS, do not load both versions.
 * No dependencies. PDF + preview image are same-origin files in assets/.
 * Shadow DOM isolates styles; native <dialog> provides modal focus management.
 */
(() => {
  'use strict';
  if (customElements.get('shahd-cv-printer')) return;
  const script = document.currentScript;
  const config = window.ShahdCVPrinterConfig || {};
  const base = script?.src || document.baseURI;
  const asset = (key, fallback) => new URL(config[key] || script?.dataset[key] || fallback, base).href;
  const PDF = asset('pdf', 'assets/shahd-cv.pdf');
  const IMAGE = asset('image', 'assets/shahd-cv-preview.webp');
  const CSS = asset('css', 'cv-printer.css?v=2.0.1');
  const FILENAME = 'Shahd-Mohamed-CV.pdf';
  const triggers = '#btnCV, #contactCvBtn, #cvLinkDesktop, #cvLinkMobile, [data-cv-print]';
  const svg = path => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const icons = {
    printer: svg('<path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7z"/><path d="M16.5 11h.01"/>'),
    download: svg('<path d="M12 3v11m-4-4 4 4 4-4M5 16v4h14v-4"/>'),
    replay: svg('<path d="M4 10a8 8 0 1 1 .6 6M4 4v6h6"/>'),
    close: svg('<path d="m6 6 12 12M18 6 6 18"/>'),
    zoom: svg('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8M12 8v8"/>'),
    back: svg('<path d="m10 6-6 6 6 6M4 12h16"/>'),
    pointer: svg('<path d="m5 3 3 16 4-5 6-1L5 3Zm8 12 4 6"/>')
  };
  const words = {
    en: {
      eyebrow:'SHAHD MOHAMED / THE PAPER EDITION', title:'A fresh copy, for you.',
      subtitle:'My experience, on one page. Keep a copy for later.',
      close:'Close CV preview', download:'Download CV', replay:'Print again', back:'Back to printer',
      preparing:'Preparing your copy…', printing:'Printing your copy…', ready:'Your copy is ready.',
      enlarge:'Tap the page for a closer look', zoom:'Read the page or switch to 100% for more detail.',
      error:'The preview could not load. You can still download the original PDF below.',
      alt:'Shahd Mohamed Siddiq — original CV, page 1 of 1',
      fileTitle:'Shahd Mohamed · CV', info:'PDF · 1 page · 46 KB', page:'Page 1 of 1', fit:'Fit width', full:'100%',
      trigger:'Print my CV', short:'Preview CV'
    },
    ar: {
      eyebrow:'شهد محمد / النسخة الورقية', title:'نسخة جديدة، من أجلك.',
      subtitle:'رحلتي في صفحة واحدة، يمكنك الاحتفاظ بها.',
      close:'إغلاق معاينة السيرة الذاتية', download:'تحميل السيرة الذاتية', replay:'إعادة الطباعة', back:'العودة للطابعة',
      preparing:'لحظة، نجهّز نسختك…', printing:'نطبع نسختك الآن…', ready:'نسختك جاهزة.',
      enlarge:'اضغط على الورقة لقراءة التفاصيل', zoom:'اقرأ الصفحة، أو اختر 100% لتكبير التفاصيل.',
      error:'تعذّر تحميل المعاينة. يمكنك تحميل ملف PDF الأصلي من الزر بالأسفل.',
      alt:'السيرة الذاتية الأصلية لشهد محمد صديق — صفحة ١ من ١',
      fileTitle:'شهد محمد · السيرة الذاتية', info:'PDF · صفحة واحدة · 46 KB', page:'صفحة ١ من ١', fit:'ملاءمة العرض', full:'100%',
      trigger:'اطبع سيرتي الذاتية', short:'معاينة السيرة الذاتية'
    }
  };

  class CVPrinter extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode:'open'});
      this.state = 'closed';
      this.run = 0;
      this.animations = [];
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      const sheet = document.createElement(config.styles ? 'style' : 'link');
      this.stylesReady = new Promise(resolve => {
        if (config.styles) { sheet.textContent = config.styles; resolve(true); return; }
        const timeout = setTimeout(() => resolve(false), 6000);
        sheet.rel = 'stylesheet'; sheet.href = CSS;
        sheet.onload = () => { clearTimeout(timeout); resolve(true); };
        sheet.onerror = () => { clearTimeout(timeout); resolve(false); };
      });
      this.shadowRoot.append(sheet);
      const template = document.createElement('template');
      template.innerHTML = `
        <dialog class="cvp-dialog" aria-labelledby="cvp-title" aria-describedby="cvp-subtitle">
          <header class="cvp-head">
            <div class="cvp-heading">
              <p class="cvp-eyebrow" data-word="eyebrow"></p>
              <h2 class="cvp-title" id="cvp-title" data-word="title"></h2>
              <p class="cvp-subtitle" id="cvp-subtitle" data-word="subtitle"></p>
            </div>
            <button class="cvp-close" type="button" autofocus>${icons.close}</button>
          </header>
          <div class="cvp-main" data-state="preparing">
            <div class="cvp-stage-wrap">
              <div class="cvp-stage" data-state="preparing">
                <div class="cvp-printer" aria-hidden="true">
                  <div class="cvp-brand"><span class="cvp-monogram">S</span><div><div class="cvp-printer-name">SHAHD / STUDIO</div><div class="cvp-printer-model">THE PAPER EDITION — 001</div></div></div>
                  <div class="cvp-machine-status"><span class="cvp-machine-label">READY</span><span class="cvp-led"></span></div>
                  <div class="cvp-slot"></div><div class="cvp-scan"></div>
                </div>
                <div class="cvp-feed-window"><button class="cvp-paper" type="button" disabled><img draggable="false" decoding="async"><span class="cvp-paper-lift"></span></button></div>
              </div>
            </div>
            <div class="cvp-zoom-view" hidden>
              <div class="cvp-zoom-toolbar"><span class="cvp-page-label" data-word="page"></span><div class="cvp-zoom-controls"><button type="button" data-zoom-mode="fit" data-word="fit" aria-pressed="true"></button><button type="button" data-zoom-mode="full" data-word="full" aria-pressed="false"></button></div></div>
              <div class="cvp-document" tabindex="0" data-zoom="fit"><img decoding="async"></div>
            </div>
            <p class="cvp-error" data-word="error" hidden></p>
            <div class="cvp-status-area">
              <p class="cvp-status" role="status" aria-live="polite" aria-atomic="true"></p>
              <button class="cvp-enlarge" type="button" hidden>${icons.zoom}<span data-word="enlarge"></span></button>
              <div class="cvp-progress" aria-hidden="true"><span></span></div>
            </div>
          </div>
          <footer class="cvp-footer">
            <div class="cvp-file"><span class="cvp-file-icon" aria-hidden="true">PDF</span><div class="cvp-file-copy"><p class="cvp-file-title" data-word="fileTitle"></p><p class="cvp-file-info" data-word="info"></p></div></div>
            <div class="cvp-actions">
              <button class="cvp-replay" type="button" disabled>${icons.replay}</button>
              <button class="cvp-back" type="button" hidden>${icons.back}</button>
              <a class="cvp-download">${icons.download}<span data-word="download"></span></a>
            </div>
          </footer>
        </dialog>`;
      this.shadowRoot.append(template.content.cloneNode(true));
      this.$ = selector => this.shadowRoot.querySelector(selector);
      this.dialog = this.$('dialog');
      this.stage = this.$('.cvp-stage');
      this.frame = this.$('.cvp-stage-wrap');
      this.paper = this.$('.cvp-paper');
      this.picture = this.$('.cvp-paper img');
      this.documentView = this.$('.cvp-document');
      this.link = this.$('.cvp-download');
      this.link.href = PDF;
      this.link.download = FILENAME;
      this.resize = new ResizeObserver(() => this.fitScene());
      this.$('.cvp-close').addEventListener('click', () => this.close());
      this.$('.cvp-replay').addEventListener('click', () => this.print());
      this.paper.addEventListener('click', () => this.zoom(true));
      this.$('.cvp-enlarge').addEventListener('click', () => this.zoom(true));
      this.$('.cvp-back').addEventListener('click', () => this.zoom(false));
      this.shadowRoot.querySelectorAll('[data-zoom-mode]').forEach(button => button.addEventListener('click', () => this.setZoom(button.dataset.zoomMode)));
      this.dialog.addEventListener('cancel', event => { event.preventDefault(); this.close(); });
      this.dialog.addEventListener('click', event => {
        if (event.target !== this.dialog) return;
        const r = this.dialog.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) this.close();
      });
      this.dialog.addEventListener('close', () => this.cleanup());
      this.onMotionChange = () => { if (this.motion.matches) { this.animations.forEach(a => a.finish()); this.dialogAnimation?.finish(); } };
    }
    connectedCallback() {
      this.sync();
      this.resize.observe(this.frame);
      this.motion.addEventListener('change', this.onMotionChange);
    }
    disconnectedCallback() {
      this.resize.disconnect();
      this.motion.removeEventListener('change', this.onMotionChange);
      if (this.state !== 'closed') this.cleanup();
    }
    fitScene() {
      const {clientWidth:width,clientHeight:height} = this.frame;
      if (!width || !height) return;
      const scale = Math.max(.1, Math.min((width-12)/440, (height-8)/470, 1.14));
      this.stage.style.setProperty('--cvp-scale', scale.toFixed(4));
    }
    sync() {
      this.lang = document.documentElement.lang.startsWith('ar') ? 'ar' : 'en';
      this.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
      this.setAttribute('lang', this.lang);
      this.setAttribute('dir', this.dir);
      this.setAttribute('theme', document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
      this.copy = words[this.lang];
      this.shadowRoot.querySelectorAll('[data-word]').forEach(e => { e.textContent = this.copy[e.dataset.word]; });
      for (const [selector,key] of [['.cvp-close','close'],['.cvp-replay','replay'],['.cvp-back','back'],['.cvp-paper','enlarge']]) {
        const e = this.$(selector); e.setAttribute('aria-label',this.copy[key]); e.title = this.copy[key];
      }
      this.documentView.setAttribute('aria-label',this.copy.zoom);
      this.shadowRoot.querySelectorAll('img').forEach(e => { e.alt = this.copy.alt; });
      this.status(this.state === 'closed' ? 'preparing' : this.state);
      this.fitScene();
    }
    status(state) {
      this.$('.cvp-main').dataset.state = state;
      this.$('.cvp-status').textContent = this.copy[state] || '';
      this.$('.cvp-status').classList.toggle('cvp-visually-hidden',state === 'ready');
      this.$('.cvp-enlarge').hidden = state !== 'ready';
      this.$('.cvp-machine-label').textContent = state === 'printing' ? 'PRINTING' : state === 'preparing' ? 'WARMING UP' : 'READY';
    }
    cancelPrint() {
      this.animations.forEach(a => a.cancel());
      this.animations = [];
    }
    cleanup() {
      this.run++;
      this.cancelPrint();
      this.dialogAnimation?.cancel();
      this.state = 'closed';
      this.closing = false;
      if (this.savedOverflow !== undefined) document.body.style.overflow = this.savedOverflow;
      this.savedOverflow = undefined;
      let target = this.opener;
      if (target?.closest('#mobileMenu') || !target?.getClientRects().length) target = document.getElementById('btnCV');
      target?.focus({preventScroll:true});
    }
    async open(opener) {
      if (this.dialog.open || this.opening || this.closing) return;
      this.opening = true;
      const styled = await this.stylesReady;
      this.opening = false;
      if (!styled || !this.dialog.showModal) { this.link.click(); return; }
      this.opener = opener;
      this.sync();
      this.savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      this.dialog.showModal();
      this.fitScene();
      this.$('.cvp-close').focus({preventScroll:true});
      if (!this.motion.matches) this.dialogAnimation = this.dialog.animate([
        {opacity:0,transform:'translateY(14px) scale(.974)'},
        {opacity:1,transform:'translateY(0) scale(1)'}
      ],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
      this.print();
    }
    async close() {
      if (!this.dialog.open || this.closing) return;
      this.closing = true;
      this.run++;
      this.cancelPrint();
      this.dialogAnimation?.cancel();
      if (!this.motion.matches) {
        this.dialogAnimation = this.dialog.animate([
          {opacity:1,transform:'translateY(0) scale(1)'},
          {opacity:0,transform:'translateY(8px) scale(.98)'}
        ],{duration:160,easing:'ease-in',fill:'forwards'});
        try { await this.dialogAnimation.finished; } catch { /* an externally closed dialog still gets cleanup */ }
      }
      if (this.dialog.open) this.dialog.close();
    }
    async print() {
      if (!this.dialog.open || this.closing) return;
      const ticket = ++this.run;
      this.cancelPrint();
      this.state = 'preparing';
      this.stage.dataset.state = 'preparing';
      this.frame.hidden = false;
      this.$('.cvp-zoom-view').hidden = true;
      this.$('.cvp-error').hidden = true;
      this.$('.cvp-back').hidden = true;
      this.$('.cvp-replay').hidden = false;
      this.$('.cvp-replay').disabled = true;
      this.paper.disabled = true;
      this.frame.setAttribute('aria-busy','true');
      this.status('preparing');
      this.fitScene();
      if (!this.picture.hasAttribute('src')) this.picture.src = IMAGE;
      let decodeTimeout;
      try {
        await Promise.race([
          this.picture.decode(),
          new Promise((_,reject) => { decodeTimeout = setTimeout(() => reject(new Error('Image timeout')),8000); })
        ]);
      } catch {
        if (ticket !== this.run || !this.dialog.open) return;
        this.state = 'error'; this.frame.hidden = true;
        this.frame.setAttribute('aria-busy','false');
        this.$('.cvp-error').hidden = false;
        this.$('.cvp-replay').disabled = false;
        this.picture.removeAttribute('src');
        this.status('error');
        return;
      } finally { clearTimeout(decodeTimeout); }
      if (ticket !== this.run || !this.dialog.open) return;
      // Start the paper animation immediately after the preview image is ready.
      if (ticket !== this.run || !this.dialog.open) return;
      this.documentView.style.setProperty('--cvp-image-width', `${this.picture.naturalWidth}px`);
      this.state = 'printing';
      this.stage.dataset.state = 'printing';
      this.status('printing');
      if (!this.motion.matches) {
        // A real translation through the clipping slot; the full heading clears the printer at the end.
        const paper = this.paper.animate([
          {transform:'translateY(-102%)',offset:0},
          {transform:'translateY(-96%)',offset:.10},
          {transform:'translateY(-62%)',offset:.38},
          {transform:'translateY(-60%)',offset:.43},
          {transform:'translateY(-24%)',offset:.71},
          {transform:'translateY(-22%)',offset:.76},
          {transform:'translateY(18px)',offset:1}
        ],{duration:2300,easing:'cubic-bezier(.3,.05,.3,1)',fill:'forwards'});
        const progress = this.$('.cvp-progress span').animate([
          {transform:'scaleX(0)'},{transform:'scaleX(1)'}
        ],{duration:2300,easing:'linear',fill:'forwards'});
        this.animations = [paper,progress];
        try { await paper.finished; } catch { return; }
      }
      if (ticket !== this.run || !this.dialog.open) return;
      this.stage.dataset.state = 'ready';
      this.cancelPrint();
      this.state = 'ready';
      this.paper.disabled = false;
      this.frame.setAttribute('aria-busy','false');
      this.$('.cvp-replay').disabled = false;
      this.status('ready');
    }
    zoom(enlarge) {
      if (this.state !== 'ready' && this.state !== 'zoom') return;
      this.state = enlarge ? 'zoom' : 'ready';
      if (enlarge) this.$('.cvp-document img').src = IMAGE;
      this.frame.hidden = enlarge;
      this.$('.cvp-zoom-view').hidden = !enlarge;
      this.$('.cvp-replay').hidden = enlarge;
      this.$('.cvp-back').hidden = !enlarge;
      this.status(this.state);
      if (enlarge) { this.setZoom('fit'); this.documentView.focus(); }
      else { this.fitScene(); this.$('.cvp-enlarge').focus(); }
    }
    setZoom(mode) {
      this.documentView.dataset.zoom = mode;
      this.shadowRoot.querySelectorAll('[data-zoom-mode]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.zoomMode === mode)));
      this.documentView.scrollTop = 0;
      this.documentView.scrollLeft = 0;
    }
  }
  customElements.define('shahd-cv-printer',CVPrinter);

  function start() {
    const printer = document.createElement('shahd-cv-printer');
    document.body.append(printer);
    function syncTriggers() {
      printer.sync();
      const t = printer.copy;
      document.querySelectorAll(triggers).forEach(el => {
        el.setAttribute('aria-haspopup','dialog'); el.setAttribute('aria-label',el.id === 'btnCV' ? t.trigger : t.short); el.title = t.short;
        if (el.tagName === 'A') { el.href = PDF; el.download = FILENAME; el.removeAttribute('target'); }
        if (el.id === 'btnCV') {
          const icon = el.querySelector('svg');
          if (icon && !el.dataset.printerIcon) { icon.outerHTML = icons.printer; el.dataset.printerIcon = 'true'; }
          const label = el.querySelector('.button-label'); if (label) label.textContent = t.trigger;
        }
      });
    }
    syncTriggers();
    new MutationObserver(syncTriggers).observe(document.documentElement,{attributes:true,attributeFilter:['lang','data-theme']});
    document.addEventListener('click',event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target.closest?.(triggers);
      if (!target) return;
      event.preventDefault();
      if (document.getElementById('mobileMenu')?.classList.contains('open')) document.getElementById('mobileMenuClose')?.click();
      printer.open(target);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

/* --- materials-reader.js --- */

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
      SCANNING: 'Scanning — continue to the far right, then release.',
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
      SCANNING: 'جارٍ الفحص — كمّلي داخل الشق لآخر اليمين، وبعدها سيبي البطاقة.',
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

/* --- materials-folder.js --- */
(() => {
  'use strict';

  const init = () => {
    const section = document.getElementById('materials');
    const grid = document.getElementById('materialsGrid');
    if (!section || !grid || section.dataset.folderInteractionReady === 'true') return;
    section.dataset.folderInteractionReady = 'true';

    let overlay = null;
    let activeCard = null;
    let activeUrl = '';
    let closeTimer = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const copy = () => document.documentElement.lang === 'ar'
      ? { kicker: 'أرشيف المواد التعليمية', status: 'جاري فتح المستند…', open: 'فتح المادة', close: 'إغلاق', cancel: 'العودة إلى المواد', dialog: 'معاينة المادة التعليمية' }
      : { kicker: 'TEACHING MATERIALS ARCHIVE', status: 'Opening selected material…', open: 'Open material', close: 'Close', cancel: 'Back to materials', dialog: 'Teaching material preview' };

    const ensureOverlay = () => {
      if (overlay) return overlay;
      overlay = document.createElement('div');
      overlay.className = 'materials-folder-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = `
        <button class="materials-folder-backdrop" type="button" aria-label="Close preview"></button>
        <div class="materials-folder-dialog" role="dialog" aria-modal="true" aria-labelledby="materialsFolderTitle">
          <button class="materials-folder-close" type="button" aria-label="Close preview">×</button>
          <div class="materials-folder-stage" aria-hidden="true">
            <div class="materials-folder">
              <span class="materials-folder-tab"></span>
              <span class="materials-folder-rear"></span>
              <span class="materials-folder-page"></span>
              <span class="materials-folder-front"></span>
            </div>
          </div>
          <div class="materials-folder-copy">
            <span class="materials-folder-kicker"></span>
            <strong class="materials-folder-title" id="materialsFolderTitle"></strong>
            <span class="materials-folder-status" role="status" aria-live="polite"></span>
            <div class="materials-folder-actions">
              <a class="materials-folder-open" href="#"></a>
              <button class="materials-folder-cancel" type="button"></button>
            </div>
          </div>
        </div>`;
      section.appendChild(overlay);
      overlay.querySelectorAll('.materials-folder-backdrop, .materials-folder-close, .materials-folder-cancel').forEach(node => node.addEventListener('click', close));
      overlay.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
      return overlay;
    };

    const updateCopy = (title) => {
      const text = copy();
      overlay.querySelector('.materials-folder-kicker').textContent = text.kicker;
      overlay.querySelector('.materials-folder-title').textContent = title;
      overlay.querySelector('.materials-folder-status').textContent = text.status;
      overlay.querySelector('.materials-folder-open').textContent = text.open;
      overlay.querySelector('.materials-folder-open').setAttribute('aria-label', `${text.open}: ${title}`);
      overlay.querySelector('.materials-folder-cancel').textContent = text.cancel;
      overlay.querySelector('.materials-folder-close').setAttribute('aria-label', text.close);
      overlay.querySelector('.materials-folder-backdrop').setAttribute('aria-label', text.close);
      overlay.querySelector('.materials-folder-dialog').setAttribute('aria-label', text.dialog);
    };

    function open(card) {
      const href = card.getAttribute('href');
      if (!href || href === '#') return;
      activeCard = card;
      activeUrl = href;
      const title = card.querySelector('.mname')?.textContent.trim() || '';
      ensureOverlay();
      const cardRect = card.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const folderWidth = Math.min(window.innerWidth * (window.innerWidth <= 600 ? .82 : .72), window.innerWidth <= 600 ? 350 : 390);
      const folderHeight = folderWidth / 1.38;
      overlay.style.setProperty('--folder-origin-x', `${cardRect.left + cardRect.width / 2 - viewportCenterX}px`);
      overlay.style.setProperty('--folder-origin-y', `${cardRect.top + cardRect.height / 2 - viewportCenterY}px`);
      overlay.style.setProperty('--folder-origin-scale', `${Math.max(.42, Math.min(1, Math.min(cardRect.width / folderWidth, cardRect.height / folderHeight)))}`);
      overlay.dataset.folderOrigin = card.dataset.materialName || title;
      updateCopy(title);
      overlay.querySelector('.materials-folder-open').setAttribute('href', href);
      overlay.setAttribute('aria-hidden', 'false');
      overlay.classList.add('is-open');
      activeCard.setAttribute('aria-expanded', 'true');
      document.body.classList.add('materials-folder-open');
      window.clearTimeout(closeTimer);
      // The folder is the transition: let it rise and settle before entering Drive.
      closeTimer = window.setTimeout(() => {
        if (activeUrl && overlay.classList.contains('is-open')) window.location.assign(activeUrl);
      }, reducedMotion.matches ? 120 : 1050);
      window.setTimeout(() => overlay?.querySelector('.materials-folder-close')?.focus({ preventScroll: true }), reducedMotion.matches ? 20 : 420);
    }

    function close() {
      if (!overlay) return;
      window.clearTimeout(closeTimer);
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('materials-folder-open');
      if (activeCard) {
        activeCard.setAttribute('aria-expanded', 'false');
        activeCard.focus({ preventScroll: true });
      }
      activeCard = null;
      activeUrl = '';
    }

    grid.addEventListener('click', event => {
      const card = event.target.closest('.material-card');
      if (!card || !grid.contains(card)) return;
      event.preventDefault();
      open(card);
    });
    grid.addEventListener('keydown', event => {
      const card = event.target.closest('.material-card');
      if (!card || !grid.contains(card)) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(card);
      }
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();


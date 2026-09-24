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
        maxStretchRatio: .16, maxStretchPx: 28, fixedStep: 1 / 120
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
      // The badge is a visual identity element, not an editor control.
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
      const minRope = Math.max(40, h * .12), maxRope = Math.max(minRope + 12, h * .55);
      this.ropeLength = clamp(h - this.ch - this.clip - Math.max(24, h * .08), minRope, maxRope);
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

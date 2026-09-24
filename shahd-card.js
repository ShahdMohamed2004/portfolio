(() => {
  'use strict';
  const DEFAULT_PHOTO = 'assets/about.webp';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const style = `
    :host{display:block;position:relative;width:100%;height:480px;min-width:0;contain:layout style;direction:ltr;color:#193b31;--card-width:184px;--card-height:276px;--clip-height:28px;--scene-light:rgba(209,182,121,.055);font-family:'Space Grotesk',Arial,sans-serif}
    *,*::before,*::after{box-sizing:border-box}
    .scene{position:absolute;inset:0;isolation:isolate;overflow:hidden;border-radius:12px;background:radial-gradient(ellipse at 50% 53%,var(--scene-light),transparent 65%)}
    canvas{position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;z-index:2}
    .assembly{position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0;z-index:3;will-change:transform}
    .assembly:focus{outline:none}
    .assembly:focus-visible:not(.pointer-focus) .card{outline:2px solid #d9b767;outline-offset:6px}
    .card{position:absolute;left:calc(var(--card-width) / -2);top:var(--clip-height);width:var(--card-width);height:var(--card-height);padding:0;overflow:hidden;border:1px solid #e6decb;border-radius:9px;background:#f2eee3;box-shadow:1px 2px 0 #a89e83,2px 3px 0 #776e57,0 9px 15px -9px #0009, var(--shadow-x,9px) 22px 32px -16px #0009;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;color:#173b31}
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
    .hint{position:absolute;left:16px;right:16px;bottom:9px;display:flex;align-items:center;justify-content:center;gap:9px;color:var(--lanyard-hint,#a7b3a3);font-size:9px;letter-spacing:1.65px;text-transform:uppercase;pointer-events:none;transition:opacity .2s}
    .hint svg{width:13px;height:13px;opacity:.65}
    .scene:has(.dragging) .hint{opacity:0}
    @media(max-width:767px){:host{height:368px;--card-width:150px;--card-height:229px;--clip-height:26px}.card{border-radius:7px}.card-top{height:29px;padding:0 10px;font-size:5px}.portrait{height:123px;margin-inline:9px}.identity{padding:9px 10px 0}.name{font-size:14.5px;letter-spacing:-.4px}.role{font-size:6.8px;margin-top:4px}.footer{left:10px;right:10px;bottom:9px;padding-top:7px}.discipline{font-size:5px;letter-spacing:1px}.hint{font-size:8px;bottom:7px}.clasp{height:17px}.portrait-label{font-size:5px}}
    @media(prefers-reduced-motion:reduce){.hint{transition:none}}
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
      const on = (el, type, fn, options = {}) => el.addEventListener(type, fn, {...options, signal:this.abort.signal});
      on(this.card, 'pointerdown', e => this.grab(e));
      on(this.card, 'pointermove', e => this.move(e));
      on(this.card, 'pointerup', e => this.release(e));
      on(this.card, 'pointercancel', e => this.release(e));
      on(this.card, 'lostpointercapture', e => this.release(e));
      on(this.card, 'dragstart', e => e.preventDefault());
      on(this.assembly, 'keydown', e => this.keyboard(e));
      on(this.assembly, 'blur', () => this.assembly.classList.remove('pointer-focus'));
      on(this.closest('.hero, .sm-hero') || this, 'pointermove', e => this.breeze(e), {passive:true});
      on(window, 'blur', () => this.release());
      on(document, 'visibilitychange', () => {
        if (document.hidden) { this.release(); this.pause(); }
        else this.wake();
      });
      on(this.reduced, 'change', () => { this.reset(); this.wake(); });
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
          <canvas aria-hidden="true"></canvas>
          <div class="assembly" role="button" tabindex="0" aria-label="Shahd Mohamed, English Language Educator. Drag to move the ID card. Arrow keys to swing; Home to settle." aria-describedby="instructions">
            <div class="clip" aria-hidden="true"><i class="ring"></i><i class="swivel"></i><i class="clasp"></i></div>
            <div class="card">
              <div class="card-top" aria-hidden="true"><span>EDUCATOR</span><i class="slot"></i><i class="brand-mark">s</i></div>
              <div class="portrait"><img alt="Shahd Mohamed" draggable="false" width="480" height="640"><span class="portrait-label" aria-hidden="true">LANGUAGE & LEARNING</span></div>
              <div class="identity"><strong class="name">Shahd Mohamed</strong><span class="role">English Language Educator</span></div>
              <div class="footer"><span class="discipline">TEFL &nbsp; / &nbsp; EDUCATION</span><span class="lines" aria-hidden="true"></span></div>
              <i class="corner" aria-hidden="true"></i>
            </div>
          </div>
          <div class="hint" id="instructions"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M8 13V5a2 2 0 0 1 4 0v6-2a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v6c0 4-3 6-6 6-2 0-4-1-5-3l-5-6a2 2 0 0 1 3-2l3 3"/></svg><span>Drag gently. Let it settle.</span></div>
        </div>`;
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.card = this.shadowRoot.querySelector('.card');
      this.assembly = this.shadowRoot.querySelector('.assembly');
      const image = this.shadowRoot.querySelector('img');
      image.src = this.getAttribute('photo') || DEFAULT_PHOTO;
      image.onerror = () => { image.onerror = null; image.src = DEFAULT_PHOTO; };
    }
    disconnectedCallback() {
      this._alive = false; this.pause(); this.abort?.abort();
      this.resizeObserver?.disconnect(); this.intersection?.disconnect();
    }
    measure() {
      const w = this.clientWidth, h = this.clientHeight;
      if (!w || !h) return;
      this.w = w; this.h = h;
      this.cw = this.card.offsetWidth; this.ch = this.card.offsetHeight;
      this.clip = parseFloat(getComputedStyle(this).getPropertyValue('--clip-height')) || 28;
      this.anchor = {x:w / 2, y:15};
      this.ropeLength = clamp(h - this.ch - this.clip - 57, 52, 125);
      this.linkLength = this.ropeLength / 16;
      this.dpr = Math.min(devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(w * this.dpr);
      this.canvas.height = Math.round(h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.release(); this.reset(); this.draw(); this.wake();
    }
    reset() {
      if (!this.anchor) return;
      this.nodes = Array.from({length:17}, (_, i) => ({x:this.anchor.x, y:this.anchor.y + i*this.linkLength, px:this.anchor.x, py:this.anchor.y + i*this.linkLength, mass:i === 0 ? 0 : i === 16 ? .075 : 1}));
      this.angle = 0; this.angularVelocity = 0; this.wind = 0; this.quiet = 0;
    }
    local(e) {
      const rect = this.getBoundingClientRect();
      return {x:(e.clientX - rect.left)*this.w/rect.width, y:(e.clientY-rect.top)*this.h/rect.height};
    }
    grab(e) {
      if ((e.pointerType === 'mouse' && e.button !== 0) || this.drag || !this.nodes.length) return;
      const p = this.local(e), end = this.nodes[16];
      const dx=p.x-end.x, dy=p.y-end.y, c=Math.cos(this.angle), s=Math.sin(this.angle);
      this.drag = {id:e.pointerId, x:p.x, y:p.y, offsetX:dx*c+dy*s, offsetY:-dx*s+dy*c};
      this.lastPointer = null;
      this.card.setPointerCapture(e.pointerId);
      this.assembly.classList.add('dragging', 'pointer-focus');
      this.assembly.focus({preventScroll:true});
      e.preventDefault(); this.wake();
    }
    move(e) {
      if (!this.drag || this.drag.id !== e.pointerId) return;
      const p = this.local(e); this.drag.x=p.x; this.drag.y=p.y;
      e.preventDefault(); this.wake();
    }
    release(e) {
      if (!this.drag || (e && e.pointerId !== this.drag.id)) return;
      const id = this.drag.id; this.drag = null;
      this.assembly.classList.remove('dragging');
      if (this.card.hasPointerCapture(id)) this.card.releasePointerCapture(id);
      // Do not reset previous positions: their difference carries release momentum.
      this.wake();
    }
    keyboard(e) {
      this.assembly.classList.remove('pointer-focus');
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','Enter',' '].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Home') this.reset();
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
    target() {
      const c=Math.cos(this.angle), s=Math.sin(this.angle), d=this.drag;
      let x=d.x-(d.offsetX*c-d.offsetY*s), y=d.y-(d.offsetX*s+d.offsetY*c);
      // Bound the full rotated card, not just its centre. This prevents clipping.
      const spread=this.cw/2+Math.sin(.12)*(this.ch+this.clip)+9;
      x=clamp(x,Math.min(this.w/2,spread),Math.max(this.w/2,this.w-spread));
      y=clamp(y,42,this.h-this.ch-this.clip-32);
      const dx=x-this.anchor.x, dy=y-this.anchor.y, r=Math.hypot(dx,dy), max=this.ropeLength*.985;
      if(r>max){x=this.anchor.x+dx/r*max;y=this.anchor.y+dy/r*max;}
      return {x,y};
    }
    step(dt) {
      const n=this.nodes, end=n[16], beforeX=end.x, beforeY=end.y;
      const target=this.drag?this.target():null;
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
        const p=n[i], vx=(p.x-p.px)*.982, vy=(p.y-p.py)*.982;
        p.px=p.x; p.py=p.y;
        p.x+=vx+this.wind*(i/16)*dt*dt*120;
        p.y+=vy+800*dt*dt;
      }
      if(target){
        end.x+=(target.x-end.x)*.115;
        end.y+=(target.y-end.y)*.115;
        end.px+=(end.x-end.px)*.12;
        end.py+=(end.y-end.py)*.12;
      }
      // Weighted constraints: the card is substantially heavier than each rope point.
      for(let pass=0;pass<32;pass++){
        n[0].x=this.anchor.x; n[0].y=this.anchor.y;
        for(let i=0;i<16;i++){
          const a=n[i],b=n[i+1],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||.001;
          const correction=(len-this.linkLength)/len, total=a.mass+b.mass;
          a.x+=dx*correction*a.mass/total;a.y+=dy*correction*a.mass/total;
          b.x-=dx*correction*b.mass/total;b.y-=dy*correction*b.mass/total;
        }
      }
      this.wind*=.93;
      // A damped angular joint: card orientation lags behind the strap and acceleration.
      const vx=(end.x-beforeX)/dt;
      const lean=clamp((this.anchor.x-end.x)/this.ropeLength*.22+vx*.0005,-.17,.17);
      const torque=this.drag?clamp(this.drag.offsetX/this.cw*.045,-.025,.025):0;
      this.angularVelocity+=((lean+torque-this.angle)*40-this.angularVelocity*8)*dt;
      this.angle=clamp(this.angle+this.angularVelocity*dt,-.20,.20);
      // Wall constraints use rotated corner extents and apply to the simulated endpoint.
      const sn=Math.sin(this.angle),cs=Math.cos(this.angle),half=this.cw/2;
      const xs=[-half*cs-this.clip*sn,half*cs-this.clip*sn,-half*cs-(this.clip+this.ch)*sn,half*cs-(this.clip+this.ch)*sn];
      const min=8-Math.min(...xs),max=this.w-8-Math.max(...xs);
      const oldX=end.x;end.x=clamp(end.x,min,max);
      if(oldX!==end.x) end.px=end.x;
      const maxY=this.h-29-(half*Math.abs(sn)+(this.clip+this.ch)*cs);
      if(end.y>maxY){end.y=maxY;end.py=end.y;}
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
      this.lastFrame=0;this.accumulator=0;this.quiet=0;
      this.raf=requestAnimationFrame(t=>this.frame(t));
    }
    pause() { cancelAnimationFrame(this.raf);this.raf=0;this.lastFrame=0; }
    frame(time) {
      this.raf=0;
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
  customElements.define('shahd-lanyard', ShahdLanyard);
})();

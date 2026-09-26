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
  const CSS = asset('css', 'cv-printer.css?v=2.0.0');
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
      trigger:'Print my CV', short:'Preview CV', hint:'A little paper magic. Tap to print.'
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
      trigger:'اطبع سيرتي الذاتية', short:'معاينة السيرة الذاتية', hint:'اضغط وشاهد سيرتي تخرج من الطابعة.'
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
    const cueStyle = document.createElement('style');
    cueStyle.textContent = '.cvp-trigger-hint{display:inline-flex!important;align-items:center;gap:6px;font:500 11px/1.6 "IBM Plex Sans Arabic","Space Grotesk",sans-serif;color:var(--chalk-dim,#425f55);padding:3px 2px;white-space:normal}.cvp-trigger-hint svg{width:15px;height:15px;flex:0 0 15px}html[data-theme="light"] .cvp-trigger-hint{color:#425f55}@media(max-width:767px){.cvp-trigger-hint{justify-content:center;grid-column:1/-1}}';
    document.head.append(cueStyle);
    const cue = document.createElement('span'); cue.className = 'cvp-trigger-hint'; cue.id = 'cv-printer-hint';
    cue.innerHTML = icons.pointer + '<span></span>';
    document.querySelector('#home .cta-row')?.append(cue);
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
          el.setAttribute('aria-describedby',cue.id);
        }
      });
      cue.querySelector('span').textContent = t.hint;
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

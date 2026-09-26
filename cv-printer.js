(() => {
  'use strict';
  if (customElements.get('shahd-cv-printer')) return;
  const PDF = 'assets/shahd-cv.pdf';
  const IMAGE = 'assets/shahd-cv-preview.webp';
  const FILE = 'Shahd-Mohamed-CV.pdf';
  const triggers = '#btnCV,#contactCvBtn,#cvLinkDesktop,#cvLinkMobile,[data-cv-print]';
  const copy = {en:{eyebrow:'SHAHD MOHAMED · THE PAPER EDITION',title:'My CV, freshly printed.',subtitle:'A small introduction to the work I care about.',close:'Close CV preview',download:'Download PDF',printing:'Printing a little about me…',ready:'Tap download to keep the original PDF',error:'The preview could not load. You can still download the original PDF.'},ar:{eyebrow:'شهد محمد · النسخة الورقية',title:'سيرتي الذاتية، من الطابعة.',subtitle:'ورقة واحدة، تحكي عن رحلتي وما أحب أن أقدّمه.',close:'إغلاق معاينة السيرة الذاتية',download:'تحميل PDF',printing:'جاري طباعة سيرتي الذاتية…',ready:'اضغط على التحميل للاحتفاظ بملف PDF الأصلي',error:'تعذّر عرض الصورة. يمكنك تحميل ملف PDF الأصلي.'}};
  const downloadIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v11m-4-4 4 4 4-4M5 16v4h14v-4"/></svg>';
  class CVPrinter extends HTMLElement {
    constructor(){super();this.attachShadow({mode:'open'});this.run=0;}
    connectedCallback(){
      this.shadowRoot.innerHTML = `<link rel="stylesheet" href="cv-printer.css"><dialog class="cv-dialog" aria-labelledby="cv-title" aria-describedby="cv-subtitle"><div class="cv-head"><div><p class="cv-eyebrow"></p><h2 class="cv-title" id="cv-title"></h2></div><button class="cv-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><p class="cv-subtitle" id="cv-subtitle"></p><div class="cv-stage" data-state="preparing"><div class="cv-printer" aria-hidden="true"><span class="cv-label">SHAHD / STUDIO</span><span class="cv-model">CV — 001</span><span class="cv-led"></span><div class="cv-slot"></div><div class="cv-scan"></div></div><div class="cv-feed"><button class="cv-paper" type="button" disabled><img draggable="false" decoding="async" alt=""></button></div></div><p class="cv-status" role="status" aria-live="polite"></p><div class="cv-footer"><a class="cv-download" href="${PDF}" download="${FILE}">${downloadIcon}<span></span></a></div></dialog>`;
      this.dialog=this.shadowRoot.querySelector('dialog');this.stage=this.shadowRoot.querySelector('.cv-stage');this.paper=this.shadowRoot.querySelector('.cv-paper');this.picture=this.shadowRoot.querySelector('.cv-paper img');this.link=this.shadowRoot.querySelector('.cv-download');
      this.shadowRoot.querySelector('.cv-close').addEventListener('click',()=>this.dialog.close());
      this.dialog.addEventListener('click',e=>{if(e.target===this.dialog)this.dialog.close();});
      this.dialog.addEventListener('close',()=>{document.body.style.overflow='';});
      this.sync();
    }
    get lang(){return document.documentElement.lang==='ar'?'ar':'en'}
    sync(){const t=copy[this.lang];this.shadowRoot.querySelector('.cv-eyebrow').textContent=t.eyebrow;this.shadowRoot.querySelector('.cv-title').textContent=t.title;this.shadowRoot.querySelector('.cv-subtitle').textContent=t.subtitle;this.shadowRoot.querySelector('.cv-close').setAttribute('aria-label',t.close);this.link.querySelector('span').textContent=t.download;this.picture.alt=this.lang==='ar'?'السيرة الذاتية لشهد محمد صديق':'Shahd Mohamed Siddiq — curriculum vitae';this.hostTheme=document.documentElement.dataset.theme==='light'?'light':'dark';this.setAttribute('theme',this.hostTheme)}
    open(){this.sync();this.dialog.showModal();document.body.style.overflow='hidden';this.print();}
    async print(){const t=copy[this.lang],ticket=++this.run;this.stage.dataset.state='printing';this.shadowRoot.querySelector('.cv-status').textContent=t.printing;this.paper.style.clipPath='inset(0 -18px 100% -18px)';this.picture.onload=()=>{if(ticket!==this.run)return;this.picture.onload=null;this.paper.animate([{clipPath:'inset(0 -18px 100% -18px)'},{clipPath:'inset(-3px -18px -22px -18px)'}],{duration:1100,easing:'cubic-bezier(.2,.8,.2,1)'}).finished.catch(()=>{}).then(()=>{if(ticket!==this.run)return;this.stage.dataset.state='ready';this.shadowRoot.querySelector('.cv-status').textContent=t.ready;});};this.picture.onerror=()=>{this.stage.dataset.state='ready';this.shadowRoot.querySelector('.cv-status').textContent=t.error};this.picture.src=IMAGE;}
  }
  customElements.define('shahd-cv-printer',CVPrinter);
  const start=()=>{const printer=document.createElement('shahd-cv-printer');document.body.append(printer);const sync=()=>{printer.sync();document.querySelectorAll(triggers).forEach(el=>{el.href=PDF;el.download=FILE;el.removeAttribute('target');el.setAttribute('aria-haspopup','dialog');el.setAttribute('aria-label',copy[document.documentElement.lang==='ar'?'ar':'en'].download);});};sync();new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang','data-theme']});document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const el=e.target.closest?.(triggers);if(!el)return;e.preventDefault();if(document.getElementById('mobileMenu')?.classList.contains('open'))document.getElementById('mobileMenuClose')?.click();printer.open();});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

(() => {
  "use strict";

  if (customElements.get("shahd-cv-printer")) return;

  const CONFIG = Object.freeze({
    pdf: "assets/shahd-cv.pdf",
    preview: "assets/shahd-cv-preview.webp",
    filename: "Shahd-Mohamed-CV.pdf",
    triggers: "#btnCV, #contactCvBtn, #cvLinkDesktop, #cvLinkMobile, [data-cv-print]"
  });

  const TEXT = Object.freeze({
    en: {
      eyebrow: "SHAHD MOHAMED · THE PAPER EDITION",
      title: "My CV, freshly printed.",
      subtitle: "A small introduction to the work I care about.",
      close: "Close CV preview",
      download: "Download PDF",
      printing: "Printing a little about me…",
      ready: "Tap the paper to read your CV",
      zoomed: "Scroll to read your CV, then download the original PDF.",
      error: "The preview could not load. You can still download the original PDF.",
      paperLabel: "Open the CV at a larger size",
      alt: "Shahd Mohamed Siddiq — curriculum vitae"
    },
    ar: {
      eyebrow: "شهد محمد · النسخة الورقية",
      title: "سيرتي الذاتية، من الطابعة.",
      subtitle: "ورقة واحدة، تحكي عن رحلتي وما أحب أن أقدّمه.",
      close: "إغلاق معاينة السيرة الذاتية",
      download: "تحميل PDF",
      printing: "جاري طباعة سيرتي الذاتية…",
      ready: "اضغط على الورقة لقراءة سيرتي الذاتية",
      zoomed: "مرّر لقراءة السيرة، ثم حمّل ملف PDF الأصلي.",
      error: "تعذّر عرض الصورة. يمكنك تحميل ملف PDF الأصلي.",
      paperLabel: "فتح السيرة الذاتية بحجم أكبر",
      alt: "السيرة الذاتية لشهد محمد صديق"
    }
  });

  const ICONS = {
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v11m-4-4 4 4 4-4M5 16v4h14v-4"/></svg>`
  };

  class CVPrinter extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.printRun = 0;
    }

    connectedCallback() {
      this.render();
      this.cacheElements();
      this.bindEvents();
      this.syncLanguageAndTheme();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="cv-printer.css">
        <dialog class="cv-dialog" aria-labelledby="cv-title" aria-describedby="cv-subtitle">
          <div class="cv-head">
            <div>
              <p class="cv-eyebrow"></p>
              <h2 class="cv-title" id="cv-title"></h2>
            </div>
            <button class="cv-close" type="button" aria-label="Close">${ICONS.close}</button>
          </div>

          <p class="cv-subtitle" id="cv-subtitle"></p>

          <div class="cv-stage" data-state="preparing">
            <div class="cv-printer" aria-hidden="true">
              <span class="cv-label">SHAHD / STUDIO</span>
              <span class="cv-model">CV — 001</span>
              <span class="cv-led"></span>
              <div class="cv-slot"></div>
              <div class="cv-scan"></div>
            </div>
            <div class="cv-feed">
              <button class="cv-paper" type="button" aria-expanded="false">
                <img draggable="false" decoding="async" alt="">
              </button>
            </div>
          </div>

          <p class="cv-status" role="status" aria-live="polite"></p>
          <div class="cv-footer">
            <a class="cv-download" href="${CONFIG.pdf}" download="${CONFIG.filename}">${ICONS.download}<span></span></a>
          </div>
        </dialog>
      `;
    }

    cacheElements() {
      const $ = (selector) => this.shadowRoot.querySelector(selector);
      this.dialog = $(".cv-dialog");
      this.stage = $(".cv-stage");
      this.paper = $(".cv-paper");
      this.preview = $(".cv-paper img");
      this.status = $(".cv-status");
      this.download = $(".cv-download");
      this.close = $(".cv-close");
    }

    bindEvents() {
      this.close.addEventListener("click", () => this.dialog.close());
      this.paper.addEventListener("click", () => this.toggleZoom());
      this.dialog.addEventListener("click", (event) => {
        if (event.target === this.dialog) this.dialog.close();
      });
      this.dialog.addEventListener("close", () => this.reset());
    }

    get language() {
      return document.documentElement.lang === "ar" ? "ar" : "en";
    }

    syncLanguageAndTheme() {
      const text = TEXT[this.language];
      this.shadowRoot.querySelector(".cv-eyebrow").textContent = text.eyebrow;
      this.shadowRoot.querySelector(".cv-title").textContent = text.title;
      this.shadowRoot.querySelector(".cv-subtitle").textContent = text.subtitle;
      this.close.setAttribute("aria-label", text.close);
      this.download.querySelector("span").textContent = text.download;
      this.preview.alt = text.alt;
      this.paper.setAttribute("aria-label", text.paperLabel);
      this.setAttribute("theme", document.documentElement.dataset.theme === "light" ? "light" : "dark");
    }

    open() {
      this.syncLanguageAndTheme();
      this.dialog.showModal();
      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.print();
    }

    print() {
      const text = TEXT[this.language];
      const run = ++this.printRun;

      this.dialog.classList.remove("is-zoomed");
      this.paper.setAttribute("aria-expanded", "false");
      this.stage.dataset.state = "printing";
      this.status.textContent = text.printing;
      this.paper.style.clipPath = "inset(0 -18px 100% -18px)";
      this.paper.style.transform = "translateY(8px)";

      this.preview.onload = () => {
        if (run !== this.printRun) return;
        this.preview.onload = null;

        const animation = this.paper.animate(
          [
            { clipPath: "inset(0 -18px 100% -18px)", transform: "translateY(8px)" },
            { clipPath: "inset(0 -18px 76% -18px)", transform: "translateY(5px)", offset: 0.28 },
            { clipPath: "inset(-3px -18px -22px -18px)", transform: "translateY(0)" }
          ],
          { duration: 3200, delay: 180, easing: "cubic-bezier(.16,.78,.24,1)", fill: "forwards" }
        );

        animation.finished.catch(() => {}).then(() => {
          if (run !== this.printRun || !this.dialog.open) return;
          this.stage.dataset.state = "ready";
          this.status.textContent = text.ready;
        });
      };

      this.preview.onerror = () => {
        this.stage.dataset.state = "ready";
        this.status.textContent = text.error;
      };
      this.preview.src = `${CONFIG.preview}?v=1`;
    }

    toggleZoom() {
      if (this.stage.dataset.state !== "ready") return;
      const isZoomed = this.dialog.classList.toggle("is-zoomed");
      const text = TEXT[this.language];
      this.paper.setAttribute("aria-expanded", String(isZoomed));
      this.status.textContent = isZoomed ? text.zoomed : text.ready;
      if (isZoomed) this.paper.focus({ preventScroll: true });
    }

    reset() {
      document.body.style.overflow = this.previousBodyOverflow || "";
      this.stage.dataset.state = "preparing";
      this.dialog.classList.remove("is-zoomed");
      this.paper.setAttribute("aria-expanded", "false");
    }
  }

  customElements.define("shahd-cv-printer", CVPrinter);

  function start() {
    const printer = document.createElement("shahd-cv-printer");
    document.body.append(printer);

    const syncTriggers = () => {
      printer.syncLanguageAndTheme();
      const text = TEXT[document.documentElement.lang === "ar" ? "ar" : "en"];
      document.querySelectorAll(CONFIG.triggers).forEach((element) => {
        element.href = CONFIG.pdf;
        element.download = CONFIG.filename;
        element.removeAttribute("target");
        element.setAttribute("aria-haspopup", "dialog");
        element.setAttribute("aria-label", text.download);
      });
    };

    syncTriggers();
    new MutationObserver(syncTriggers).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang", "data-theme"]
    });

    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const trigger = event.target.closest?.(CONFIG.triggers);
      if (!trigger) return;

      event.preventDefault();
      if (document.getElementById("mobileMenu")?.classList.contains("open")) {
        document.getElementById("mobileMenuClose")?.click();
      }
      printer.open();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

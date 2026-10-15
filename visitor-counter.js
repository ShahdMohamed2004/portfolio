  (() => {
    const number = document.getElementById('visitorCounterNumber');
    const label = document.getElementById('visitorCounterLabel');
    const caption = document.getElementById('visitorCounterCaption');
    const card = document.querySelector('.visitor-counter-card');
    if (!number) return;

    const apiBase = 'https://counterapi.com/api/shahdmohamed2004.github.io';
    const allVisitsEndpoint = `${apiBase}/view/portfolio`;
    const sourceEndpoint = source => `${apiBase}/referrer/${encodeURIComponent(source)}`;

    const applyCounterLanguage = () => {
      const arabic = document.documentElement.lang === 'ar';
      if (label) label.textContent = arabic ? 'زوار الموقع' : 'Visitors';
      if (caption) caption.textContent = arabic ? 'كل زيارات الصفحة' : 'All page visits';
      if (card) card.setAttribute('aria-label', arabic ? 'عداد زوار الموقع' : 'Visitor counter');
    };
    applyCounterLanguage();
    new MutationObserver(applyCounterLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    const classifySource = () => {
      const params = new URLSearchParams(window.location.search);
      const campaign = (params.get('utm_source') || '').trim().toLowerCase();
      const referrer = (document.referrer || '').toLowerCase();
      const value = campaign || referrer;
      if (!value) return 'direct';
      if (value.includes('linkedin')) return 'linkedin';
      if (value.includes('google')) return 'google';
      if (value.includes('bing')) return 'bing';
      if (value.includes('instagram')) return 'instagram';
      if (value.includes('facebook')) return 'facebook';
      if (value.includes('whatsapp')) return 'whatsapp';
      if (value.includes('youtube')) return 'youtube';
      return campaign || 'other';
    };

    // No unique=true here: every completed page load is counted as a visit.
    fetch(allVisitsEndpoint, { cache: 'no-store', credentials: 'omit', keepalive: true })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('counter unavailable')))
      .then(data => {
        if (!Number.isFinite(Number(data.value))) throw new Error('invalid counter value');
        number.textContent = Number(data.value).toLocaleString();
      })
      .catch(() => {
        number.textContent = '—';
        if (caption) caption.textContent = document.documentElement.lang === 'ar' ? 'الإحصاء غير متاح مؤقتًا' : 'Stats temporarily unavailable';
      });

    // One small public counter per source makes LinkedIn, Google, and other referrers comparable.
    fetch(sourceEndpoint(classifySource()), { cache: 'no-store', credentials: 'omit', keepalive: true }).catch(() => {});
  })();

(() => {
  'use strict';

  // Keep browser-native lazy loading as the only media scheduler. This is a
  // no-op on browsers that already support the attribute and avoids changing
  // the loading priority of the hero or the interactive lightbox image.
  const images = document.images;
  if ('loading' in HTMLImageElement.prototype) {
    for (const image of images) {
      if (!image.hasAttribute('loading') && !image.closest('.hero')) {
        image.loading = 'lazy';
      }
      if (!image.hasAttribute('decoding')) image.decoding = 'async';
    }
  }

  // Do not leave transient compositor state behind when navigating via the
  // browser back/forward cache or leaving the document.
  window.addEventListener('pagehide', () => {
    document.querySelectorAll('[style*="--card-x"], [style*="--card-y"]').forEach(node => {
      node.style.removeProperty('--card-x');
      node.style.removeProperty('--card-y');
    });
  }, { passive: true });
})();


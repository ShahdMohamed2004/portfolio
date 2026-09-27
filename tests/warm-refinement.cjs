// Focused acceptance checks for the warm palette, halo, and responsive layout.
// Run with: node tests/warm-refinement.cjs (Playwright + Chromium required).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
let checks = 0;
const check = (ok, label) => { assert.ok(ok, label); checks++; };

(async () => {
  const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.pdf':'application/pdf' };
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (error, data) => { res.writeHead(error ? 404 : 200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(error ? '' : data); });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport:{ width:1440, height:960 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil:'networkidle' });
    await page.waitForTimeout(350);
    check(await page.locator('link[href*="refinement.css"]').count() === 1, 'Refinement layer is loaded once');
    const badgeBefore = await page.locator('#home shahd-lanyard').boundingBox();
    await page.locator('#themeToggle').click();
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#aboutTagOne')).backgroundColor === 'rgb(238, 224, 220)');
    const visual = await page.evaluate(() => {
      const css = (selector, pseudo) => getComputedStyle(document.querySelector(selector), pseudo);
      const bounds = selector => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};
      };
      const card = css('#home shahd-lanyard', '::before');
      return {
        body: getComputedStyle(document.body).backgroundColor,
        about: css('#about .about-card').backgroundImage,
        contact: css('#contact .contact-box').backgroundImage,
        aboutTag: css('#about .about-tag:first-child').backgroundColor,
        halo: { content:card.content, position:card.position, zIndex:card.zIndex, background:card.backgroundImage },
        host: bounds('#home shahd-lanyard'),
        email: getComputedStyle(document.querySelector('#contact .contact-links .btn-solid')).backgroundImage,
      };
    });
    check(visual.body === 'rgb(247, 242, 236)', 'Light page canvas remains warm ivory');
    check(visual.about.includes('rgb(237, 228, 219)') && visual.about.includes('rgb(247, 242, 236)'), 'About surface uses warm beige and cream');
    check(visual.contact.includes('rgb(237, 228, 219)') && visual.contact.includes('rgb(247, 242, 236)'), 'Contact surface uses warm beige and cream');
    check(visual.aboutTag === 'rgb(238, 224, 220)', 'About tag uses blush, not green');
    check(visual.halo.content !== 'none' && visual.halo.position === 'absolute' && visual.halo.zIndex === '-1', 'Halo is softly layered behind the lanyard host');
    check(visual.halo.background.includes('rgba(240, 199, 201,') && visual.halo.background.includes('rgba(201, 143, 154,') && visual.halo.background.includes('rgba(143, 64, 85,'), 'Halo uses the requested blush, dusty rose, and muted burgundy stops');
    check(visual.email.includes('linear-gradient') || visual.email.includes('rgb(122, 38, 58)'), 'Primary contact action keeps the burgundy accent');
    const badgeAfter = await page.locator('#home shahd-lanyard').boundingBox();
    check(Math.abs(badgeBefore.width - badgeAfter.width) < 1 && Math.abs(badgeBefore.height - badgeAfter.height) < 1, 'Halo does not change the ID-card host proportions');

    for (const language of ['en','ar']) {
      if (language === 'ar') {
        await page.locator('#langToggle').click();
        await page.waitForFunction(() => document.documentElement.lang === 'ar');
        await page.waitForTimeout(250);
      }
      for (const width of [320,360,390,430,768,1024,1440]) {
        await page.setViewportSize({ width, height:900 });
        await page.waitForTimeout(100);
        const state = await page.evaluate(() => {
          const get = selector => {
            const e = document.querySelector(selector), r = e.getBoundingClientRect();
            return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth};
          };
          const boxes = selector => [...document.querySelectorAll(selector)].map(e => { const r=e.getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}; });
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            tag:get('#about .section-tag'), heading:get('#about .section-head h2'),
            about:get('#about .about-card'), bio:get('#about .about-bio'),
            aboutText:get('#about .about-text'), contact:get('#contact .contact-box'),
            contactCopy:get('#contact .contact-box p'), contactLinks:get('#contact .contact-links'),
            buttons:boxes('#contact .contact-links > *'),
            backToTop:get('#backToTop'), direction:document.documentElement.dir
          };
        });
        check(!state.overflow, `${language} ${width}px: no horizontal page overflow`);
        check(state.tag.bottom <= state.heading.top + 1, `${language} ${width}px: About section label does not collide with its heading`);
        check(state.aboutText.left >= state.about.left - 1 && state.aboutText.right <= state.about.right + 1, `${language} ${width}px: About text stays inside its card`);
        check(state.bio.scrollWidth <= state.bio.clientWidth + 1, `${language} ${width}px: About paragraph wraps within its measure`);
        check(state.contactCopy.scrollWidth <= state.contactCopy.clientWidth + 1, `${language} ${width}px: Contact copy wraps within its card`);
        check(state.buttons.every(button => button.left >= state.contact.left - 1 && button.right <= state.contact.right + 1), `${language} ${width}px: Contact actions stay inside their card`);
        check(state.backToTop.left >= -1 && state.backToTop.right <= width + 1, `${language} ${width}px: Back-to-top control stays within the viewport`);
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await page.waitForTimeout(180);
        const coversContactAction = await page.evaluate(() => {
          const control = document.querySelector('#backToTop'), style = getComputedStyle(control), r = control.getBoundingClientRect();
          if (style.visibility === 'hidden' || Number.parseFloat(style.opacity) < .5) return false;
          return [...document.querySelectorAll('#contact .contact-links > *')].some(node => {
            const b = node.getBoundingClientRect();
            return r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top;
          });
        });
        check(!coversContactAction, `${language} ${width}px: Back-to-top does not cover Contact actions`);
        await page.locator('#about').scrollIntoViewIfNeeded();
        await page.waitForTimeout(120);
        const aboutTagOverlaps = await page.evaluate(() => {
          const targets = [...document.querySelectorAll('#about .about-tags > *')];
          const controls = ['#backToTop','#whereAmI'].map(selector => document.querySelector(selector)).filter(node => {
            const style = getComputedStyle(node); return style.visibility !== 'hidden' && Number.parseFloat(style.opacity) >= .5;
          });
          return controls.flatMap(control => {
            const a = control.getBoundingClientRect();
            return targets.filter(node => { const b = node.getBoundingClientRect(); return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }).map(node => ({control:control.id,tag:node.textContent.trim(),controlBox:{x:a.x,y:a.y,w:a.width,h:a.height},tagBox:(()=>{const b=node.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height}})()}));
          });
        });
        check(aboutTagOverlaps.length === 0, `${language} ${width}px: Floating controls do not cover About tags ${JSON.stringify(aboutTagOverlaps)}`);
        await page.evaluate(() => window.scrollTo(0, 0));
        if (width === 390 && language === 'en') await page.screenshot({ path:'/tmp/portfolio-warm-mobile.png' });
        if (width === 1440 && language === 'en') await page.screenshot({ path:'/tmp/portfolio-warm-desktop.png' });
      }
    }
    check(errors.length === 0, `No browser runtime errors: ${errors.join('; ')}`);
    console.log(JSON.stringify({ checks, errors, visual }, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

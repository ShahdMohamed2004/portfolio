// Run: npm install --no-save playwright && npx playwright install chromium
// Then: node tests/materials-reader.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const rootDir = path.resolve(__dirname, '..');
let checks = 0;
const errors = [];
const expectedLinks = [
  'https://drive.google.com/drive/folders/1IlVHD_heQUisdcgzNAmCAjcgaJ_GM0nq',
  'https://drive.google.com/drive/folders/1_SgYq2bi8oCfyzkCNLl3ZWqLtBG197CM',
  'https://drive.google.com/file/d/16cr1k7iVTIZNDKl5tGr97EFSB0j0kQf6/view?usp=drivesdk',
  'https://drive.google.com/drive/folders/1zHdqDdbPUsbgA7wvTLmoMu3spNnbPXPA',
  'https://drive.google.com/drive/folders/1g0XnzDUJwKrmgcFmbgFSgwUHkl_kAXGK',
  'https://drive.google.com/drive/folders/1d2hgaLe5ASKrY-Op27gsmu6wMyygF70A',
];
function check(ok, label) { assert.ok(ok, label); checks++; }
function near(a, b, label, tolerance = .22) { check(Math.abs(a - b) < tolerance, `${label}: ${a} vs ${b}`); }
async function snap(page) {
  return page.locator('#materials').evaluate(section => {
    const root = section.querySelector('[data-reader-scene]');
    const card = root.querySelector('[data-reader-card]');
    const slot = root.querySelector('[data-reader-slot]');
    const scale = root.clientWidth / 560;
    const m = new DOMMatrixReadOnly(getComputedStyle(card).transform);
    const rect = card.getBoundingClientRect();
    return { x: m.m41 / scale, y: m.m42 / scale, scale,
      bound: (560 - card.offsetWidth / scale) / 2 - 8,
      dockY: (slot.offsetTop - card.offsetTop - card.offsetHeight) / scale + 22,
      cx: rect.x + rect.width * .5, cy: rect.y + rect.height * .38,
      state: root.dataset.readerState, docked: root.dataset.readerDocked === 'true', armed: root.dataset.readerArmed === 'true',
      percent: Number(card.getAttribute('aria-valuenow')), filesHidden: section.querySelector('#materials-files').hidden,
      opened: section.dataset.materialsOpen === 'true', source: section.dataset.materialsOpenSource,
      count: window.materialsRevealCount || 0, scrollY, overflow: document.documentElement.scrollWidth > innerWidth };
  });
}
async function settle(page) { await page.waitForTimeout(400); return snap(page); }
async function noSuccess(page, label) {
  const s = await snap(page);
  check(s.state !== 'READY' && !s.opened && s.filesHidden && s.count === 0, label);
}
async function success(page, label) {
  await page.waitForFunction(() => document.querySelector('#materials').dataset.materialsOpen === 'true');
  const s = await snap(page);
  check(s.state === 'READY' && s.percent === 100 && !s.filesHidden && s.source === 'swipe' && s.count === 1, label);
  check(await page.locator('[data-reader-display]').textContent() === 'ACCESS GRANTED', 'Successful display');
}
async function reset(page) { await page.locator('[data-materials-reset]').click(); return settle(page); }
async function grab(page) {
  const s = await snap(page);
  await page.mouse.move(s.cx, s.cy); await page.mouse.down(); return s;
}
async function move(page, s, dx, dy) {
  for (let i = 1; i <= 14; i++) {
    await page.mouse.move(s.cx + dx * s.scale * i / 14, s.cy + dy * s.scale * i / 14);
    await page.waitForTimeout(7);
  }
}
async function drag(page, dx, dy, release = true) {
  const s = await grab(page); await move(page, s, dx, dy);
  if (release) { await page.mouse.up(); await settle(page); }
  return s;
}
async function arm(page) {
  const s = await snap(page); await drag(page, -s.bound - s.x - 8, s.dockY - s.y);
  check((await snap(page)).armed, 'Reader arms at visible left endpoint inside slot');
}
async function checkLinks(page) {
  assert.deepEqual(await page.locator('#materialsGrid a').evaluateAll(nodes => nodes.map(a => a.getAttribute('href'))), expectedLinks);
  checks++;
}
(async () => {
  const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.pdf':'application/pdf' };
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(rootDir, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(rootDir + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (err, data) => { res.writeHead(err ? 404 : 200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(err ? '' : data); });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
  async function load(page) {
    await page.goto(url, { waitUntil:'networkidle' });
    await page.waitForFunction(() => document.querySelector('#materials').dataset.materialsReaderInit === 'ready');
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.materialsRevealCount = 0;
      document.addEventListener('materials:revealed', () => window.materialsRevealCount++);
      const reader = document.querySelector('[data-reader-scene]');
      window.scrollTo(0, reader.getBoundingClientRect().top + scrollY - 130);
    });
    await page.waitForTimeout(150);
  }
  try {
    const page = await browser.newPage({ viewport:{width:1280,height:1000} });
    page.on('pageerror', e => errors.push(e.message));
    await load(page);
    let s = await snap(page);
    near(s.x, 0, 'Starts centered'); near(s.y, 0, 'Starts above reader');
    check(!s.docked && !s.armed, 'Starts outside slot'); await checkLinks(page);
    await page.locator('[data-reader-card]').click(); await noSuccess(page, 'Tap fails');
    await page.locator('[data-reader-card]').press('Enter'); await page.locator('[data-reader-card]').press('Space');
    await noSuccess(page, 'Enter/Space cannot bypass');
    await drag(page, -200, -4); await drag(page, 400, 0);
    await noSuccess(page, 'Full traversal outside slot fails');
    await reset(page); s = await snap(page);
    await drag(page, 0, s.dockY);
    check((await snap(page)).docked && !(await snap(page)).armed, 'Middle insertion does not arm');
    await drag(page, 200, 0); await noSuccess(page, 'Middle-to-right fails');
    await drag(page, -400, 0); await noSuccess(page, 'Right-to-left never completes');
    check((await snap(page)).armed, 'Returning to left arms');
    await drag(page, 100, 0); s = await snap(page);
    check(s.percent > 20 && s.percent < 60, 'Partial progress');
    await page.waitForTimeout(600); near((await snap(page)).x, s.x, 'Release holds position');
    await drag(page, -40, 0); check((await snap(page)).percent < s.percent, 'Reverse subtracts progress');
    await drag(page, 0, -65); s = await snap(page);
    check(!s.docked && !s.armed && s.percent === 0, 'Removal clears scan');
    await drag(page, 300, 0); s = await snap(page); await drag(page, 0, s.dockY - s.y);
    await noSuccess(page, 'Reinsertion at right fails');
    await arm(page); s = await snap(page);
    await drag(page, 2 * s.bound - 1, 0); await noSuccess(page, 'Almost endpoint is insufficient');
    check((await snap(page)).percent === 99, '99 percent before verification');
    await reset(page); await arm(page);
    const g = await grab(page); await move(page, g, 2 * g.bound + 12, 0); await settle(page);
    await noSuccess(page, 'Endpoint waits for release');
    await page.mouse.move(g.cx + g.bound * g.scale, g.cy); await page.mouse.up(); await settle(page);
    await noSuccess(page, 'Reverse before release fails');
    await drag(page, 300, 0); await success(page, 'Full pass reveals original files once');
    await checkLinks(page);
    await page.waitForFunction(() => document.querySelector('[data-materials-reader]').hidden);
    check(!(await page.locator('[data-materials-reader]').isVisible()), 'Reader hides after successful swipe');
    await page.locator('#langToggle').click(); await settle(page);
    check((await snap(page)).opened && (await snap(page)).count === 1, 'Language switch retains open state');
    check((await page.locator('[data-materials-copy="title"]').textContent()).includes('مرّري'), 'Arabic reader labels');
    await checkLinks(page);
    await page.locator('#themeToggle').click(); await settle(page);
    check((await snap(page)).opened, 'Theme change retains open state');
    await page.setViewportSize({width:430,height:900}); await settle(page);
    check((await snap(page)).opened && (await snap(page)).count === 1, 'Resize keeps revealed files');

    await page.setViewportSize({width:1280,height:1000}); await load(page);
    await page.locator('[data-materials-direct]').click();
    s = await snap(page);
    check(s.opened && !s.filesHidden && s.source === 'direct' && s.state !== 'READY' && s.percent === 0, 'Direct reveal does not fake verification');
    await page.locator('[data-materials-direct]').click();
    check((await snap(page)).count === 1, 'Direct reveal is idempotent');
    await page.keyboard.press('Tab');
    check(await page.locator('#materialsGrid a').first().evaluate(n => n === document.activeElement), 'Revealed links are next keyboard stops');

    await load(page); await arm(page); await drag(page, 120, 0, false); await settle(page);
    const before = await snap(page);
    await page.evaluate(() => window.dispatchEvent(new Event('blur'))); await page.mouse.up();
    s = await settle(page); near(s.x, before.x, 'Blur keeps visible card position');
    await noSuccess(page, 'Blur never completes');
    await page.setViewportSize({width:420,height:900}); await settle(page);
    await noSuccess(page, 'Resize cannot complete');
    await page.setViewportSize({width:1280,height:1000}); await load(page);
    const single = await grab(page);
    await move(page, single, -single.bound - 8, single.dockY);
    await page.waitForFunction(() => document.querySelector('[data-reader-scene]').dataset.readerArmed === 'true');
    await page.mouse.move(single.cx + (single.bound + 10) * single.scale, single.cy + single.dockY * single.scale, {steps:25});
    await page.mouse.up(); await success(page, 'Continuous grab, insert, arm, swipe, release');

    await load(page); await page.locator('[data-reader-card]').focus();
    for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown');
    for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowLeft');
    await settle(page); check((await snap(page)).armed, 'Keyboard inserts and arms');
    for (let i = 0; i < 9; i++) await page.keyboard.press('ArrowRight');
    await noSuccess(page, 'Keyboard partial fails');
    await page.keyboard.press('ArrowRight'); await success(page, 'Keyboard full pass');

    console.log('Desktop physics, locale, theme, direct access and keyboard checks passed.');
    const mobile = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
    const touchPage = await mobile.newPage(); touchPage.on('pageerror',e=>errors.push(e.message));
    const cdp = await mobile.newCDPSession(touchPage);
    async function touch(type,x,y) {
      await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'||type==='touchCancel'?[]:[{id:1,x,y,radiusX:6,radiusY:6,force:.7}]});
    }
    async function swipe(dx,dy,release=true) {
      const t = await snap(touchPage); await touch('touchStart',t.cx,t.cy);
      for(let i=1;i<=14;i++) {await touch('touchMove',t.cx+dx*t.scale*i/14,t.cy+dy*t.scale*i/14);await touchPage.waitForTimeout(8);}
      if(release){await touch('touchEnd');await settle(touchPage);} return t;
    }
    async function touchArm(){const t=await snap(touchPage);await swipe(-t.bound-t.x-8,t.dockY-t.y);check((await snap(touchPage)).armed,'Touch arms inside slot');}
    await load(touchPage); s=await snap(touchPage);
    await touch('touchStart',s.cx,s.cy);await touch('touchEnd');await noSuccess(touchPage,'Mobile tap fails');
    await swipe(40,20); const free=await snap(touchPage);
    check(!free.docked && free.x>30 && free.y>15,'Touch supports free 2D pull');
    near(free.scrollY,s.scrollY,'Dragging card does not scroll');
    await touchArm(); await swipe(110,0);s=await snap(touchPage);await swipe(-40,0);
    check((await snap(touchPage)).percent<s.percent,'Touch reverse reduces progress');
    await swipe(50,0,false);await settle(touchPage);s=await snap(touchPage);
    await touch('touchCancel');await settle(touchPage);near((await snap(touchPage)).x,s.x,'Touch cancel holds position');
    await noSuccess(touchPage,'Touch cancel fails');
    await swipe(300,0,false);await settle(touchPage);await touch('touchCancel');await settle(touchPage);
    await noSuccess(touchPage,'Cancel at endpoint fails');
    s=await snap(touchPage);await touch('touchStart',s.cx,s.cy);await touch('touchEnd');await noSuccess(touchPage,'Tap cancelled endpoint fails');
    await swipe(-35,0);await swipe(65,0);await success(touchPage,'Mobile full pass');

    for(const width of [320,360,430,768]) {
      await touchPage.setViewportSize({width,height:900});await load(touchPage);
      check(!(await snap(touchPage)).overflow,`No horizontal overflow at ${width}`);
      await touchArm();await swipe(300,0);await success(touchPage,`Touch pass at ${width}`);
    }
    await touchPage.emulateMedia({reducedMotion:'reduce'});await load(touchPage);
    await touchArm();await swipe(80,0);await noSuccess(touchPage,'Reduced motion partial fails');
    await swipe(300,0);await success(touchPage,'Reduced motion full pass');

    console.log('Mobile swipe and responsive checks passed.');
    const noJs = await browser.newPage({javaScriptEnabled:false}); await noJs.goto(url);
    await checkLinks(noJs);
    check(await noJs.locator('#materialsGrid a').first().isVisible(),'Files available without JavaScript');
    check(!(await noJs.locator('[data-materials-reader]').isVisible()),'No nonworking reader without JS');
    for(const blocked of ['materials-reader.js','materials-reader.css','assets/materials-id-card.jpg']) {
      const fallback = await browser.newPage();
      await fallback.route(`**/${blocked}*`,route=>route.abort());await fallback.goto(url,{waitUntil:'networkidle'});
      await checkLinks(fallback);
      check(await fallback.locator('#materialsGrid a').first().isVisible(),`Files accessible when ${blocked} fails`);
      await fallback.close();
    }
    await page.setViewportSize({width:1280,height:1000});await load(page);
    await page.locator('#themeToggle').click();await page.locator('#langToggle').click();await settle(page);
    await page.screenshot({path:'/tmp/materials-preview-desktop.png'});
    await touchPage.setViewportSize({width:390,height:844});await load(touchPage);
    await touchPage.evaluate(()=>document.getElementById('langToggle').click());await settle(touchPage);
    await touchPage.screenshot({path:'/tmp/materials-preview-mobile.png'});
    // Existing hero and printer implementations must still initialize normally.
    await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(250);
    check(await page.locator('#btnCV').count()===1,'Existing CV button retained');
    await page.locator('#btnCV').click();
    await page.waitForFunction(() => document.querySelector('shahd-cv-printer')?.shadowRoot?.querySelector('dialog')?.open);
    check(await page.locator('shahd-cv-printer .cvp-download').getAttribute('href') === new URL('assets/shahd-cv.pdf',url).href, 'Printer keeps original CV file');
    await page.keyboard.press('Escape');
    check(await page.locator('script[src^="shahd-card.js"]').count()===1,'Original hero badge script retained once');
    check(await page.locator('script[src^="cv-printer.js"]').count()===1,'Original printer script retained once');
    check(errors.length===0,`No JavaScript errors: ${errors.join('; ')}`);
    console.log(JSON.stringify({checks,browser:'Chromium',touch:'CDP touch events',widths:[320,360,390,420,430,768,1280],errors},null,2));
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

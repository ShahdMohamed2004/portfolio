// Simulated sensor inputs, not a substitute for testing a physical phone.
const { start } = require('./browser-helper.cjs');
const assert = require('node:assert/strict');
let checks = 0;
async function unlock(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('#materials').dataset.materialsReaderInit === 'ready');
  await page.locator('[data-reader-card]').focus();
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown');
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowLeft');
  for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('#materials').dataset.materialsOpen === 'true');
}
(async () => {
  const h = await start();
  try {
    const context = await h.browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.promptCount = 0;
      DeviceOrientationEvent.requestPermission = async () => { window.promptCount++; return 'granted'; };
    });
    await page.goto(h.url, { waitUntil: 'networkidle' });
    await unlock(page);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('.verified-id').scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.locator('.verified-id').tap();
    await page.waitForTimeout(400);
    assert.equal(await page.evaluate(() => window.promptCount), 1); checks++;
    const orient = (beta, gamma) => page.evaluate(values => {
      window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', values));
    }, { beta, gamma });
    await orient(0, 0);
    await orient(300, 300);
    await page.waitForFunction(() => document.querySelector('.verified-id-surface').style.transform.includes('rotateX(-10deg)'));
    const pose = await page.locator('.verified-id-surface').evaluate(node => node.style.transform);
    assert.ok(pose.includes('rotateY(10deg)'), pose); checks++;
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await orient(200, 200);
    await page.waitForFunction(() => !document.querySelector('.verified-id-surface').style.transform);
    assert.equal(await page.locator('.verified-id-surface').evaluate(node => getComputedStyle(node).transform), 'none'); checks++;
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('.verified-id').tap();
    await orient(0, 0); await orient(20, 20);
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => !document.querySelector('.verified-id-surface').style.transform); checks++;
    for (const asset of ['portfolio-passport.js', 'portfolio-passport.css']) {
      const fallback = await h.browser.newPage();
      await fallback.route(`**/${asset}*`, route => route.abort());
      await fallback.goto(h.url, { waitUntil: 'domcontentloaded' });
      await unlock(fallback);
      assert.ok(await fallback.locator('#materialsGrid a').first().isVisible()); checks++;
      await fallback.close();
    }
    console.log(JSON.stringify({ checks, orientation: 'simulated permission, bounds, reduced motion, offscreen', fallbacks: 'passport JS and CSS missing' }, null, 2));
  } finally { await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

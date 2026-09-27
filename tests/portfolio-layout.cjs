// Browser acceptance checks for the cleaned project layout and Passport removal.
const { start } = require('./browser-helper.cjs');
const assert = require('node:assert/strict');

(async () => {
  const h = await start();
  const errors = [];
  let checks = 0;
  const check = (value, label) => { assert.ok(value, label); checks++; };
  try {
    const page = await h.browser.newPage({ viewport: { width: 1240, height: 763 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(h.url, { waitUntil: 'networkidle' });
    const project = page.locator('#projectDetails-0');
    if (!(await project.evaluate(node => node.open))) await project.locator(':scope > summary').click();
    await page.waitForTimeout(250);

    const measure = () => page.locator('#projectDetails-0').evaluate(node => {
      const facts = node.querySelector('.project-facts');
      const factItems = [...facts.children].map(item => {
        const dt = item.querySelector('dt').getBoundingClientRect();
        const dd = item.querySelector('dd').getBoundingClientRect();
        return { x: item.getBoundingClientRect().x, right: item.getBoundingClientRect().right,
          dtX: dt.x, dtBottom: dt.bottom, ddX: dd.x, ddTop: dd.top, ddRight: dd.right };
      });
      const description = node.querySelector('.project-description');
      const descStyle = getComputedStyle(description);
      return { width: innerWidth, docWidth: document.documentElement.scrollWidth,
        dir: document.documentElement.dir, factsWidth: facts.getBoundingClientRect().width,
        columns: Math.abs(factItems[1].x - factItems[0].x) > 10 ? 2 : 1,
        factCount: factItems.length, factItems, descriptionAlign: descStyle.textAlign,
        descriptionHyphens: descStyle.hyphens,
        summaryTitleCount: node.querySelectorAll('.entry-preview h3').length,
        duplicateDetailTitleCount: node.querySelectorAll('.embedded-case-study h3').length };
    });

    for (const width of [320, 360, 390, 430, 640, 768, 1024, 1240, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(90);
      const state = await measure();
      check(state.docWidth <= width, `No horizontal page overflow at ${width}px`);
      check(state.columns === (width <= 1024 ? 1 : 2), `Role and tools grouped cleanly at ${width}px`);
      check(state.factCount === 2 && state.factsWidth <= 821, `Two bounded fact cards at ${width}px`);
      check(state.factItems.every(item => item.right <= width + 1 && item.ddRight <= width + 1), `Fact text stays inside viewport at ${width}px`);
      check(state.factItems.every(item => item.ddX >= item.x && (width > 640 || item.ddTop > item.dtBottom - 1)), `Fact labels and values have a clear reading order at ${width}px`);
      check(state.descriptionAlign === 'start', `Description uses natural alignment at ${width}px`);
      check(state.descriptionHyphens === 'none', `No awkward automatic hyphenation at ${width}px`);
      check(state.summaryTitleCount === 1 && state.duplicateDetailTitleCount === 0, `Project title is not repeated at ${width}px`);
    }

    await page.setViewportSize({ width: 1240, height: 763 });
    await page.locator('#projectDetailsBody-0').scrollIntoViewIfNeeded();
    const desktopClearance = await page.evaluate(() => ({
      bodyTop: document.querySelector('#projectDetailsBody-0 .section-tag').getBoundingClientRect().top,
      headerBottom: document.querySelector('#siteHeader').getBoundingClientRect().bottom,
    }));
    check(desktopClearance.bodyTop >= desktopClearance.headerBottom + 8, 'Desktop navigation does not cover project details');
    await page.mouse.move(5, 110);
    await page.waitForTimeout(250);
    await page.screenshot({ path: '/tmp/portfolio-clean-layout-desktop.png' });

    await page.evaluate(() => document.getElementById('langToggle').click());
    await page.waitForFunction(() => document.documentElement.lang === 'ar');
    await page.setViewportSize({ width: 390, height: 844 });
    const arabic = await measure();
    check(arabic.dir === 'rtl' && arabic.docWidth <= 390, 'Arabic mobile layout respects RTL with no overflow');
    check(arabic.columns === 1 && arabic.descriptionAlign === 'right', 'Arabic mobile facts and copy align naturally');
    await page.locator('#projectDetailsBody-0').scrollIntoViewIfNeeded();
    const mobileClearance = await page.evaluate(() => ({
      bodyTop: document.querySelector('#projectDetailsBody-0 .section-tag').getBoundingClientRect().top,
      summaryTop: document.querySelector('#projectDetails-0 > summary').getBoundingClientRect().top,
      headerBottom: document.querySelector('#siteHeader').getBoundingClientRect().bottom,
    }));
    check(mobileClearance.bodyTop >= mobileClearance.headerBottom + 8, 'Mobile navigation does not cover project details');
    check(mobileClearance.summaryTop >= mobileClearance.headerBottom + 8, 'Mobile navigation does not cover the project card header');
    await page.mouse.move(5, 110);
    await page.waitForTimeout(200);
    await page.screenshot({ path: '/tmp/portfolio-clean-layout-mobile-ar.png' });

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('[data-reader-card]').focus();
    for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown');
    for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowLeft');
    for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('#materials').dataset.materialsOpen === 'true');
    const materialState = await page.locator('#materials').evaluate(node => ({
      text: node.innerText,
      links: [...node.querySelectorAll('#materialsGrid a')].length,
      direct: [...node.querySelectorAll('#materialsGrid a')].every(a => a.href.startsWith('https://drive.google.com/')),
      removedUi: node.querySelector('.portfolio-passport,.passport-stamp,.verified-id,.paper-file') === null,
    }));
    check(!/portfolio passport|a field guide to my work|portfolio evidence categories/i.test(materialState.text), 'Passport heading, caption and taxonomy are absent');
    check(materialState.links === 6 && materialState.direct, 'All original material links remain direct and intact');
    check(materialState.removedUi, 'No Passport, identity clone or archive animation nodes remain');
    check(errors.length === 0, `No runtime errors: ${errors.join('; ')}`);
    console.log(JSON.stringify({ checks, errors, screenshots: ['/tmp/portfolio-clean-layout-desktop.png', '/tmp/portfolio-clean-layout-mobile-ar.png'] }, null, 2));
  } finally {
    await h.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

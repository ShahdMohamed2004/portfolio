// Run with Playwright installed: node tests/portfolio-pass.cjs
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');let checks=0;
function check(value,label){assert.ok(value,label);checks++;}
(async()=>{
 const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.pdf':'application/pdf'})[path.extname(file)]||'application/octet-stream'});res.end(e?'':b)});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const errors=[];const results={};
 const instrument=()=>{
   window.dockMetrics={frames:0,reads:0};
   const raf=window.requestAnimationFrame;window.requestAnimationFrame=function(fn){const dock=new Error().stack.includes('dock-motion.js');return raf.call(this,t=>{if(dock)window.dockMetrics.frames++;fn(t);});};
   const rect=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){if(new Error().stack.includes('dock-motion.js'))window.dockMetrics.reads++;return rect.call(this);};
 };
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(instrument);await page.goto(url,{waitUntil:'networkidle'});await page.waitForTimeout(600);
 const initialLinks=await page.locator('#materialsGrid a').evaluateAll(nodes=>nodes.map(a=>a.href));
 check(await page.locator('.motion-dock,.dock-item').count()===0,'No old group controller classes');
 check(await page.locator('#main-content .dock-control').count()===0,'Dock targets only top-header controls');
 const header=()=>page.locator('#siteHeader').evaluate(el=>({rect:el.getBoundingClientRect().toJSON(),state:el.dataset.dockState,position:getComputedStyle(el).position}));
 for(const theme of ['dark','light']){
   if(theme==='light'){await page.locator('#themeToggle').click();await page.waitForFunction(()=>document.documentElement.dataset.theme==='light');await page.waitForTimeout(600);}
   await page.mouse.move(5,450);await page.waitForTimeout(400);const baseline=await header();
   check(baseline.position==='fixed'&&baseline.rect.y===16,`${theme}: fixed stable top`);
   const idle=await page.evaluate(()=>({...window.dockMetrics}));
   for(let i=0;i<12;i++)await page.mouse.move(100+i*35,400+i*5);
   await page.waitForTimeout(150);assert.deepEqual(await page.evaluate(()=>window.dockMetrics),idle);checks++;
   const rect=await page.locator('#navLinks a').nth(1).boundingBox();await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);await page.waitForTimeout(350);
   check((await header()).state==='ACTIVE',`${theme}: locally active`);
   const poses=await page.locator('#siteHeader .dock-control').evaluateAll(ns=>ns.map(n=>({t:getComputedStyle(n).translate,s:parseFloat(getComputedStyle(n).scale)||1,will:n.style.willChange})));
   check(poses.some(p=>p.s>1.02)&&poses.every(p=>p.s<=1.046),`${theme}: subtle bounded individual magnification`);
   await page.waitForFunction(()=>[...document.querySelectorAll('#siteHeader .dock-control')].every(n=>!n.style.willChange));
   const settled=await page.evaluate(()=>({...window.dockMetrics}));await page.waitForTimeout(200);assert.deepEqual(await page.evaluate(()=>window.dockMetrics),settled);checks++;
   check((await header()).rect.y===baseline.rect.y,'Controls never move header');
   await page.mouse.move(100,500);await page.waitForFunction(()=>document.querySelector('#siteHeader').dataset.dockState==='RESTING',null,{timeout:3000});
   check((await header()).state==='RESTING',`${theme}: exact return to rest`);
   check(await page.locator('#siteHeader .dock-control').evaluateAll(ns=>ns.every(n=>!n.style.translate&&!n.style.scale&&!n.style.willChange)),`${theme}: idle transforms and layers released`);
   const beforeScroll=await page.evaluate(()=>({...window.dockMetrics}));await page.evaluate(()=>window.scrollTo(0,2500));await page.waitForTimeout(700);
   check((await header()).rect.y===16,`${theme}: scroll position stable`);assert.deepEqual(await page.evaluate(()=>window.dockMetrics),beforeScroll);checks++;
   await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(500);
 }
 check(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor)==='rgb(247, 242, 236)','Ivory light background');
 check(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--lt-brand').trim())==='#7A263A','Burgundy light accent');
 await page.screenshot({path:'/tmp/portfolio-light-desktop.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.mouse.move(620,40);await page.waitForTimeout(150);check((await header()).state==='RESTING','Reduced motion keeps dock static');
 // Exercise the actual reader completion, including keyboard access.
 await page.locator('[data-reader-card]').focus();for(let i=0;i<4;i++)await page.keyboard.press('ArrowDown');for(let i=0;i<6;i++)await page.keyboard.press('ArrowLeft');for(let i=0;i<10;i++)await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('#materials').dataset.materialsOpen==='true');
 check(await page.locator('.passport-stamp').count()===4,'Four categories grounded in existing evidence');
 check(await page.locator('.paper-file').count()===5,'Five paper files; CV remains separate');
 check(!(await page.locator('#materialsGrid a').nth(2).getAttribute('class')).includes('paper-file'),'CV does not use evidence animation');
 assert.deepEqual(await page.locator('#materialsGrid a').evaluateAll(ns=>ns.map(a=>a.href)),initialLinks);checks++;
 check(await page.locator('.passport-stamp').evaluateAll(ns=>ns.every(a=>[...document.querySelectorAll('#workSpine .proj-links a')].some(original=>original.href===a.href))),'Each stamp resolves to original evidence URL');
 await page.locator('.verified-id').scrollIntoViewIfNeeded();check(await page.locator('.verified-id').isVisible(),'Original card image visible after scanning');
 const src=await page.locator('[data-reader-card] img').getAttribute('src');check(await page.locator('.verified-id img').getAttribute('src')===src,'Original image preserved');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.mouse.move(5,200);const card=await page.locator('.verified-id').boundingBox();await page.mouse.move(card.x+card.width*.9,card.y+card.height*.2);await page.waitForTimeout(450);
 check(await page.locator('.verified-id-surface').evaluate(n=>n.style.transform.includes('rotateX')),'Post-scan tilt works in light theme');await page.mouse.move(5,200);await page.waitForTimeout(500);check(await page.locator('.verified-id-surface').evaluate(n=>!n.style.transform),'Tilt returns exactly to neutral');
 await page.locator('.portfolio-passport').evaluate(()=>document.activeElement?.blur());
 await page.screenshot({path:'/tmp/portfolio-passport-desktop.png'});
 // Isolate navigation from Drive; verify exact destination without changing external data.
 await page.context().route('https://drive.google.com/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Existing evidence destination</title>'}));
 const destination=await page.locator('.paper-file').first().getAttribute('href');const popup=page.waitForEvent('popup');await page.locator('.paper-file').first().click();const evidence=await popup;await evidence.waitForURL(destination);check(evidence.url()===destination,'Paper file opens unchanged destination');check(await evidence.evaluate(()=>window.opener===null),'Evidence tab has no opener');await evidence.close();await page.bringToFront();
 // Locale update replaces cards: decoration and correct evidence links must survive.
 await page.evaluate(()=>document.getElementById('langToggle').click());await page.waitForFunction(()=>document.documentElement.lang==='ar');await page.waitForTimeout(700);check(await page.locator('.passport-stamp').first().textContent()==='التدريس','Arabic passport labels');check(await page.locator('.paper-file').count()===5,'Locale refresh does not duplicate decoration');
 await page.evaluate(()=>document.getElementById('themeToggle').click());await page.waitForFunction(()=>!document.documentElement.dataset.theme);await page.waitForTimeout(600);
 await page.locator('.verified-id').scrollIntoViewIfNeeded();const darkCard=await page.locator('.verified-id').boundingBox();await page.mouse.move(darkCard.x+darkCard.width*.85,darkCard.y+darkCard.height*.2);await page.waitForTimeout(400);check(await page.locator('.verified-id-surface').evaluate(n=>n.style.transform.includes('rotateX')),'Same tilt works after dark theme switch');
 for(const width of [320,360,390,430,768,1024,1440]){
   await page.setViewportSize({width,height:900});await page.waitForTimeout(250);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${width}`);
   const h=await header();check(h.rect.y>=12&&h.rect.y<=16&&h.rect.x>=0&&h.rect.right<=width+1,`Header stays within ${width} viewport`);
 }
 // Touch plus denied/unavailable orientation fallback, with no extra controls.
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const touch=await mobile.newPage();touch.on('pageerror',e=>errors.push(e.message));await touch.addInitScript(()=>{window.orientationPrompts=0;window.DeviceOrientationEvent.requestPermission=async()=>{window.orientationPrompts++;return 'denied';};});await touch.goto(url,{waitUntil:'networkidle'});await touch.emulateMedia({reducedMotion:'reduce'});await touch.locator('[data-reader-card]').focus();for(let i=0;i<4;i++)await touch.keyboard.press('ArrowDown');for(let i=0;i<6;i++)await touch.keyboard.press('ArrowLeft');for(let i=0;i<10;i++)await touch.keyboard.press('ArrowRight');await touch.waitForFunction(()=>document.querySelector('#materials').dataset.materialsOpen==='true');await touch.emulateMedia({reducedMotion:'no-preference'});await touch.locator('.verified-id').scrollIntoViewIfNeeded();await touch.waitForTimeout(250);
 const cdp=await mobile.newCDPSession(touch),box=await touch.locator('.verified-id').boundingBox();const tx=box.x+box.width*.4,ty=box.y+box.height*.5;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tx,y:ty,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:tx+30,y:ty,id:1}]});await touch.waitForTimeout(300);check(await touch.locator('.verified-id-surface').evaluate(n=>n.style.transform.includes('rotateY')),'Touch drag tilts card');check(await touch.evaluate(()=>window.orientationPrompts)===1,'Motion permission only requested on touch');await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.waitForTimeout(500);check(await touch.locator('.verified-id-surface').evaluate(n=>!n.style.transform),'Touch release returns to neutral after denied gyro permission');
 await touch.evaluate(()=>document.getElementById('langToggle').click());await touch.waitForFunction(()=>document.documentElement.lang==='ar');await touch.evaluate(()=>document.getElementById('themeToggleMobile').click());await touch.waitForFunction(()=>document.documentElement.dataset.theme==='light');await touch.waitForTimeout(700);await touch.locator('.portfolio-passport').scrollIntoViewIfNeeded();await touch.evaluate(()=>document.activeElement?.blur());await touch.screenshot({path:'/tmp/portfolio-passport-mobile.png'});
 await touch.evaluate(()=>window.scrollTo(0,0));await touch.waitForTimeout(500);await touch.locator('#hamburgerBtn').tap();await touch.waitForTimeout(250);check(await touch.locator('#mobileMenu').evaluate(n=>n.classList.contains('open')),'Mobile navigation opens');await touch.locator('#mobileMenuClose').tap();check(await touch.locator('#hamburgerBtn').getAttribute('aria-expanded')==='false','Mobile navigation closes');
 check(errors.length===0,`No runtime errors: ${errors.join('; ')}`);results.checks=checks;results.errors=errors;results.dock=await page.evaluate(()=>window.dockMetrics);console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

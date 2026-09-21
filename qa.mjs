import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];

const page = await browser.newPage();
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
});
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));

const rnd = Math.random().toString(36).slice(2, 8);
await page.goto(base + '/login?modo=cadastro', { waitUntil: 'networkidle' });
await page.fill('#name', 'Teste QA');
await page.fill('#email', `teste.${rnd}@gmail.com`);
await page.fill('#password', 'SenhaForte123');
await page.click('button[type=submit]');
await page.waitForTimeout(1000);
console.log('after signup ->', page.url());

await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/qa-dashboard.png', fullPage: true });
let mascotImgs = await page.$$eval('img[alt*="Mascote"]', (imgs) => imgs.map((i) => i.getAttribute('src')));
console.log('DASHBOARD mascot <img> count:', mascotImgs.length, mascotImgs);

await page.goto(base + '/app/relaxar?tab=respirar', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/qa-breathing.png', fullPage: true });
mascotImgs = await page.$$eval('img[alt*="Mascote"]', (imgs) => imgs.map((i) => i.getAttribute('src')));
console.log('BREATHING mascot <img> count (should be 0):', mascotImgs.length, mascotImgs);

// Start the breathing exercise and sample the phase label sequence
await page.click('button:has-text("Começar a respirar")');
const seen = [];
for (let i = 0; i < 15; i++) {
  await page.waitForTimeout(700);
  const label = await page.$eval('span.font-display.text-lg', (el) => el.textContent).catch(() => null);
  if (label && seen[seen.length - 1] !== label) seen.push(label);
}
console.log('PHASE SEQUENCE seen (should start Inspira, then Segura, then Expira):', seen);
await page.screenshot({ path: '/tmp/qa-breathing-active.png' });

await page.goto(base + '/app/relaxar?tab=sons', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const rainBtn = await page.$('button:has-text("Chuva")');
if (rainBtn) await rainBtn.click();
await page.waitForTimeout(200);
const playBtn = await page.$('button[aria-label*="Tocar"]');
if (playBtn) {
  await playBtn.click();
  await page.waitForTimeout(800);
}
await page.screenshot({ path: '/tmp/qa-sons.png', fullPage: true });
const pauseBtn = await page.$('button[aria-label*="Pausar"]');
console.log('sound is playing (pause button present):', !!pauseBtn);

await page.goto(base + '/app/mascote', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/qa-mascot.png', fullPage: true });
const colorPicker = await page.$('text=/Cor do mascote/i');
console.log('color picker present on mascot page (should be false):', !!colorPicker);

console.log('CONSOLE/PAGE ERRORS (network ERR_TUNNEL from offline sandbox is expected noise):');
console.log(errors.filter((e) => !e.includes('ERR_TUNNEL_CONNECTION_FAILED')));

await browser.close();

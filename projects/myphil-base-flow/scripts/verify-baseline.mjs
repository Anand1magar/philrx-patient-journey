import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto('http://localhost:5173/welcome', { waitUntil: 'networkidle' });
await page.waitForSelector('text=Welcome, Patricia!');
await page.screenshot({ path: 'scripts/out-baseline-welcome.png' });

console.log('ERRORS:', JSON.stringify(errors));
if (errors.length) process.exitCode = 1;

await browser.close();

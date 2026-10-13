// Walks the whole CAPLYTA patient journey in a real browser, screenshotting
// every screen and recording the session to video, then asserts the brand
// invariants that a string sweep is easy to get subtly wrong.
//
// Run the dev server first, then:
//   node scripts/record-journey.mjs [baseURL]
//
// Output: scripts/out/journey/NN-<name>.png and scripts/out/journey/*.webm
import { chromium } from 'playwright';
import { mkdirSync, rmSync, readdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.argv[2] || 'http://localhost:5175';
const OUT = 'scripts/out/journey';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Every screen in journey order. Each step is [routeName, path], walked by URL
// so one broken button can't silently truncate the recording — the click-paths
// are asserted separately below.
const JOURNEY = [
  ['sms', '/sms'],
  ['welcome', '/welcome'],
  ['insurance-details', '/insurance-details'],
  ['contact-information', '/contact-information'],
  ['hipaa-authorization', '/hipaa-authorization'],
  ['savings-enrollment', '/savings-enrollment'],
  ['enrollment-success', '/enrollment-success'],
  ['create-password', '/create-password'],

  ['pa-sms', '/pa-sms'],
  ['pa-required', '/pa-required'],
  ['pa-approved-sms', '/pa-approved-sms'],
  ['pa-approved', '/pa-approved'],
  ['pa-denied-sms', '/pa-denied-sms'],
  ['pa-denied', '/pa-denied'],
  ['finalizing-cost', '/finalizing-cost'],

  ['checkout-sms', '/checkout-sms'],
  ['login', '/login'],
  ['confirm-identity', '/confirm-identity'],
  ['otp-delivery', '/otp-delivery'],
  ['otp-verify', '/otp-verify'],
  ['my-prescriptions', '/my-prescriptions'],
  ['payment-coverage-picker', '/payment-scenarios'],
  ['payment-commercial-covered', '/payment-commercial-covered'],
  ['payment-commercial-uncovered', '/payment-commercial-uncovered'],
  ['payment-uninsured', '/payment-uninsured'],
  ['payment-government', '/payment-government'],
  ['order-confirmation', '/order-confirmation'],

  ['shipping-sms', '/shipping-sms'],
  ['shipped', '/shipped'],
  ['delivery-sms', '/delivery-sms'],
  ['delivered', '/delivered'],
  ['delivery-signature-sms', '/delivery-signature-sms'],
  ['delivery-confirmation-required', '/delivery-confirmation-required'],
  ['delivery-confirmation', '/delivery-confirmation'],

  ['refill-sms', '/refill-sms'],
  ['refill-review', '/refill-review'],
];

// Strings from the PhilRx base flow that must not survive the rebrand.
const FORBIDDEN = ['Drugname', 'PhilRx', 'PHILRx', 'Phil account', 'MyPhil account', 'philrx.com'];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 430, height: 932 },
  recordVideo: { dir: OUT, size: { width: 430, height: 932 } },
});
const page = await context.newPage();

const errors = [];
const failures = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));

async function visit(name, path, index) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  await page.screenshot({ path: join(OUT, `${String(index + 1).padStart(2, '0')}-${name}.png`), fullPage: true });

  // Visible copy plus the attributes a patient can actually end up seeing or
  // following. Deliberately NOT page.content(): in dev Vite inlines CSS into a
  // <style> tag, so source comments there would read as false leaks.
  const { text, attrs } = await page.evaluate(() => ({
    text: document.body.innerText,
    attrs: [...document.querySelectorAll('[alt],[href],[title],[aria-label],[placeholder]')]
      .flatMap((el) => ['alt', 'href', 'title', 'aria-label', 'placeholder'].map((a) => el.getAttribute(a) || ''))
      .join(' '),
  }));
  for (const bad of FORBIDDEN) {
    if (text.includes(bad)) failures.push(`${path}: leaked base-brand string "${bad}" in visible copy`);
    else if (attrs.includes(bad)) failures.push(`${path}: leaked base-brand string "${bad}" in an attribute`);
  }
  if (!text.trim()) failures.push(`${path}: rendered empty`);
}

for (const [i, [name, path]] of JOURNEY.entries()) {
  await visit(name, path, i);
}

// --- Brand + feedback assertions -------------------------------------------

// Text notifications default to on.
await page.goto(BASE + '/contact-information', { waitUntil: 'networkidle' });
const textPref = await page.evaluate(() => {
  const row = [...document.querySelectorAll('label')].find((l) => l.textContent.trim().startsWith('Text messages'));
  if (!row) return 'label-not-found';
  const box = row.querySelector('input[type=checkbox]');
  return box ? (box.checked ? 'checked' : 'unchecked') : 'input-not-found';
});
if (textPref !== 'checked') failures.push(`/contact-information: "Text message" preference is ${textPref}, expected checked`);

// Auto-refill defaults to on.
await page.goto(BASE + '/refill-review', { waitUntil: 'networkidle' });
const autoRefill = await page.evaluate(() => {
  const boxes = [...document.querySelectorAll('input[type=checkbox]')];
  const row = boxes.find((b) => (b.closest('label')?.textContent || '').includes('Ship refills automatically'));
  return row ? (row.checked ? 'checked' : 'unchecked') : 'not-found';
});
if (autoRefill !== 'checked') failures.push(`/refill-review: "Ship refills automatically" is ${autoRefill}, expected checked`);

// The PAP banner shows on exactly the uninsured + government coverages.
for (const [path, expected] of [
  ['/payment-commercial-covered', false],
  ['/payment-commercial-uncovered', false],
  ['/payment-uninsured', true],
  ['/payment-government', true],
]) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const hasBanner = await page.evaluate(() =>
    document.body.innerText.includes('patient assistance program') &&
    !!document.querySelector('a[href*="jnjwithme.com/patient-assistance"]'));
  if (hasBanner !== expected) failures.push(`${path}: PAP banner ${hasBanner ? 'present' : 'absent'}, expected ${expected ? 'present' : 'absent'}`);
}

// Login routes to the one-time code, and the refill SMS goes through log-in.
await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Log in with one-time code' }).click();
await page.waitForURL('**/otp-delivery*');
if (!page.url().includes('/otp-delivery')) failures.push('/login: one-time code button did not reach /otp-delivery');

await page.goto(BASE + '/login?next=refill', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Log in with one-time code' }).click();
await page.waitForURL('**/otp-delivery*');
await page.getByRole('button', { name: 'Send Code' }).click();
await page.waitForURL('**/otp-verify*');
await page.getByRole('button', { name: 'Confirm', exact: true }).click();
await page.waitForURL('**/refill-review');
if (!page.url().endsWith('/refill-review')) failures.push('?next=refill did not land on /refill-review');

// The journey side panel reports position.
await page.goto(BASE + '/flow/welcome', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const sidebar = await page.evaluate(() => document.body.innerText);
if (!/Step \d+ of \d+/.test(sidebar)) failures.push('/flow: sidebar is missing the "Step N of M" position indicator');
if (!sidebar.includes('Patient journey')) failures.push('/flow: sidebar heading missing');
await page.screenshot({ path: join(OUT, '00-flow-navigator.png') });

await context.close();
await browser.close();

// Give the recording a predictable name.
for (const f of readdirSync(OUT)) {
  if (f.endsWith('.webm')) renameSync(join(OUT, f), join(OUT, 'caplyta-journey.webm'));
}

console.log(`\nScreens captured: ${JOURNEY.length}`);
console.log(`Console errors:   ${errors.length}`);
errors.forEach((e) => console.log('  !', e));
console.log(`Failures:         ${failures.length}`);
failures.forEach((f) => console.log('  ✗', f));
if (errors.length || failures.length) process.exitCode = 1;
else console.log('\nAll checks passed.');

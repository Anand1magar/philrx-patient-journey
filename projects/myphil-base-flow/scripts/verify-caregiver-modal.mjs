import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

async function fillWelcome(dob) {
  await page.goto('http://localhost:5173/welcome', { waitUntil: 'networkidle' });
  await page.fill('input[placeholder="Last name"]', 'Doe');
  await page.fill('input[placeholder="Date of birth (MM/DD/YYYY)"]', dob);
  await page.click('text=Next');
}

// Adult DOB: modal must NOT appear, must land on /insurance-details.
await fillWelcome('01/01/1990');
await page.waitForURL('**/insurance-details');
console.log('ADULT_OK: reached /insurance-details without modal');

// Minor DOB: modal MUST appear.
await fillWelcome('01/01/2015');
await page.waitForSelector('text=Caregiver info for minors');
console.log('MINOR_OK: caregiver modal shown');
await page.screenshot({ path: 'scripts/out-caregiver-modal.png' });

// Garbage DOB (button only requires non-empty, not valid): must not crash,
// and must not be treated as a minor.
await fillWelcome('not-a-date');
await page.waitForURL('**/insurance-details');
console.log('GARBAGE_DOB_OK: reached /insurance-details without crashing or showing modal');

console.log('ERRORS:', JSON.stringify(errors));
if (errors.length) process.exitCode = 1;

await browser.close();

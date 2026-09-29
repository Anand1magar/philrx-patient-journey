import { chromium } from 'playwright';

// Regression check: SavingsHipaaAuthorizationPage is shared by the Enrollment
// stage (/coupon-enrollment) and the Payment-Approval Second-Chance stage
// (/coupon-enrollment-second-chance, per the PM table's distinct route name).
// The Enrollment fix must not change what the Second-Chance caller sees.

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

// Agree path: must land on /second-chance-enrolled, not /enrollment-success.
await page.goto('http://localhost:5173/second-chance-enrollment', { waitUntil: 'networkidle' });
await page.click('text=Enroll now');
await page.waitForURL('**/coupon-enrollment-second-chance');
await page.click('text=Agree and enroll');
await page.waitForURL('**/second-chance-enrolled');
console.log('SECOND_CHANCE_AGREE_OK: reached /second-chance-enrolled');

// No Enrollment-stage progress bar should appear in this context.
await page.goto('http://localhost:5173/coupon-enrollment-second-chance', { waitUntil: 'networkidle' });
const progressBarCount = await page.locator('[role="progressbar"]').count();
if (progressBarCount !== 0) {
  throw new Error(`Expected no progress bar on /coupon-enrollment-second-chance, found ${progressBarCount}`);
}
console.log('SECOND_CHANCE_NO_PROGRESS_BAR_OK');

// Decline path: must return to /second-chance-enrollment, not stay stuck or
// go to the Enrollment stage.
await page.goto('http://localhost:5173/second-chance-enrollment', { waitUntil: 'networkidle' });
await page.click('text=Enroll now');
await page.waitForURL('**/coupon-enrollment-second-chance');
await page.click('text=Decline enrollment');
await page.waitForSelector('text=Why pay full price?');
await page.getByRole('button', { name: 'Decline coupon' }).click();
await page.waitForURL('**/second-chance-enrollment');
console.log('SECOND_CHANCE_DECLINE_OK: reached /second-chance-enrollment');

console.log('ERRORS:', JSON.stringify(errors));
if (errors.length) process.exitCode = 1;

await browser.close();

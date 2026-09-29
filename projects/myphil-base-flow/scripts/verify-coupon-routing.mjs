import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });

async function toContactInformation() {
  await page.goto('http://localhost:5173/welcome', { waitUntil: 'networkidle' });
  await page.fill('input[placeholder="Last name"]', 'Doe');
  await page.fill('input[placeholder="Date of birth (MM/DD/YYYY)"]', '01/01/1990');
  await page.click('text=Next');
  await page.waitForURL('**/insurance-details');
  await page.click('text=Use this insurance card');
  await page.waitForURL('**/contact-information');
}

// Default branch: separate savings + HIPAA screens -> enrollment-success.
await toContactInformation();
await page.click('text=Next');
await page.waitForURL('**/savings-enrollment');
await page.click('text=Agree and enroll');
await page.waitForURL('**/hipaa-authorization');
await page.click('text=Confirm');
await page.waitForURL('**/enrollment-success');
console.log('DEFAULT_BRANCH_OK: reached /enrollment-success');

// Alternate branch: combined coupon-enrollment screen -> enrollment-success.
await toContactInformation();
await page.click('text=Prefer to do savings & HIPAA in one step?');
await page.waitForURL('**/coupon-enrollment');
await page.click('text=Agree and enroll');
await page.waitForURL('**/enrollment-success');
console.log('COMBINED_BRANCH_OK: reached /enrollment-success');
await page.screenshot({ path: 'scripts/out-enrollment-success.png' });

// Decline path on the combined screen: modal must close, and must NOT force
// navigation into the Second-Chance stage (the original bug).
await toContactInformation();
await page.click('text=Prefer to do savings & HIPAA in one step?');
await page.waitForURL('**/coupon-enrollment');
await page.click('text=Decline enrollment');
await page.waitForSelector('text=Why pay full price?');
await page.getByRole('button', { name: 'Decline coupon' }).click();
await page.waitForSelector('text=Why pay full price?', { state: 'detached' });
const urlAfterDecline = page.url();
if (!urlAfterDecline.includes('/coupon-enrollment')) {
  throw new Error(`Decline should close the modal and stay on /coupon-enrollment, but URL is ${urlAfterDecline}`);
}
console.log('DECLINE_CLOSES_MODAL_OK: modal closed, stayed on /coupon-enrollment');

await browser.close();

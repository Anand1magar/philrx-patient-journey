import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });

async function readPercent() {
  const text = await page.textContent('[role="progressbar"] span');
  return Number(text.replace('%', ''));
}

const defaultBranchRoutes = [
  '/welcome', '/insurance-details', '/contact-information',
  '/savings-enrollment', '/hipaa-authorization', '/enrollment-success',
];
const combinedBranchRoutes = [
  '/welcome', '/insurance-details', '/contact-information',
  '/coupon-enrollment', '/enrollment-success',
];

async function walkAndCheckMonotonic(routes) {
  let last = -1;
  for (const route of routes) {
    await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' });
    const pct = await readPercent();
    if (pct <= last) throw new Error(`Non-monotonic: ${route} showed ${pct}%, previous was ${last}%`);
    last = pct;
    console.log(`${route}: ${pct}%`);
  }
  if (last !== 100) throw new Error(`Branch did not end at 100% (ended at ${last}%)`);
}

await walkAndCheckMonotonic(defaultBranchRoutes);
console.log('DEFAULT_BRANCH_MONOTONIC_OK');

await walkAndCheckMonotonic(combinedBranchRoutes);
console.log('COMBINED_BRANCH_MONOTONIC_OK');

await page.goto('http://localhost:5173/welcome', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'scripts/out-progress-bar-welcome.png' });

await browser.close();

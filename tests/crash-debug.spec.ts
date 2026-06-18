import { test, expect } from '@playwright/test';

test.describe('Intensive Crash Debugger', () => {
  const pageErrors: string[] = [];

  test.beforeEach(({ page }) => {
    pageErrors.length = 0;
    page.on('pageerror', (err) => {
      console.error('PAGE ERROR DETECTED:', err.message, err.stack);
      pageErrors.push(`${err.message}\n${err.stack}`);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('BROWSER CONSOLE ERROR:', msg.text());
      }
    });
  });

  test('exhaustive navigation cycle with localStorage email set', async ({ page }) => {
    console.log('1. Navigating to Home...');
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(1000);

    console.log('2. Click Contact Us...');
    await page.click('text="Contact Us"');
    await page.waitForTimeout(1000);

    console.log('3. Authenticate with simulated account...');
    await page.click('text="ashayshah@gmail.com"');
    await page.waitForTimeout(1000);

    console.log('4. Navigate back to Home via logo...');
    await page.click('[aria-label*="home"]');
    await page.waitForTimeout(2000);

    console.log('5. Navigate to Testimonials...');
    await page.click('text="Testimonials"');
    await page.waitForTimeout(1500);

    console.log('6. Go back to Home using Back to Home button...');
    await page.click('text=/Back to Home/i');
    await page.waitForTimeout(2000);

    console.log('7. Navigate to Programs...');
    await page.click('text="Programs"');
    await page.waitForTimeout(1500);

    console.log('8. Go back to Home via logo...');
    await page.click('[aria-label*="home"]');
    await page.waitForTimeout(2000);

    console.log('9. Navigate to About Us...');
    await page.click('text="About Us"');
    await page.waitForTimeout(1500);

    console.log('10. Go back to Home via back link...');
    await page.click('text=/Back to home/i');
    await page.waitForTimeout(2000);

    console.log('11. Verify if any page errors occurred...');
    expect(pageErrors).toEqual([]);
  });
});

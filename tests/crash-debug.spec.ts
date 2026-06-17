import { test, expect } from '@playwright/test';

test.describe('Intensive Crash Debugger', () => {
  const pageErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    pageErrors.length = 0;

    page.on('pageerror', (err) => {
      console.error('PAGE ERROR:', err.message);
      pageErrors.push(err.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('BROWSER ERROR:', msg.text());
      }
    });

    // Set localStorage before the app loads
    await page.addInitScript(() => {
      localStorage.setItem(
        'guest_verified_email',
        'ashayshah@gmail.com'
      );
    });
  });
  test('exhaustive navigation cycle with localStorage email set', async ({
    page,
  }) => {
    console.log('Opening Home');

    await page.goto('/', {
      waitUntil: 'load',
    });

    await expect(page).toHaveURL(/localhost|127\.0\.0\.1|\/$/);

    // ----------------------------
    // Contact
    // ----------------------------

    const contactLink = page.getByRole('link', {
      name: /contact/i,
    }).first();

    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForURL(/\/contact/);
    }

    // ----------------------------
    // Optional Email Button
    // ----------------------------

    const emailElement = page.getByText(
      'ashayshah@gmail.com',
      { exact: false }
    );

    if (await emailElement.count()) {
      await emailElement.first().click();
      await page.waitForTimeout(500);
    }

    // ----------------------------
    // Home Logo
    // ----------------------------

    const homeLogo = page.locator(
      '[aria-label*="home"], a[href="/"], a[href="/"] img'
    );

    if (await homeLogo.first().count()) {
      await homeLogo.first().click();
      await page.waitForURL(/\/$/);
    }

    // ----------------------------
    // Testimonials
    // ----------------------------

    const testimonials = page.getByRole('link', {
      name: /testimonials/i,
    }).first();

    if (await testimonials.isVisible()) {
      await testimonials.click();
      await page.waitForURL(/\/testimonials/);
    }

    const backHome = page.getByText(/back to home/i);

    if (await backHome.count()) {
      await backHome.first().click();
      await page.waitForURL(/\/$/);
    }

    // ----------------------------
    // Programs
    // ----------------------------

    const programs = page.getByRole('link', {
      name: /programs/i,
    }).first();

    if (await programs.isVisible()) {
      await programs.click();
      await page.waitForURL(/\/programs/);
    }

    const homeLogoAgain = page.locator(
      '[aria-label*="home"], a[href="/"], a[href="/"] img'
    );

    if (await homeLogoAgain.count()) {
      await homeLogoAgain.first().click();
      await page.waitForURL(/\/$/);
    }

    // ----------------------------
    // About
    // ----------------------------

    const about = page.getByRole('link', {
      name: /about/i,
    }).first();

    if (await about.isVisible()) {
      await about.click();
      await page.waitForURL(/\/about/);
    }

    const back = page.getByText(/back to home/i);

    if (await back.count()) {
      await back.first().click();
      await page.waitForURL(/\/$/);
    }

    // ----------------------------
    // Final validation
    // ----------------------------

    expect(pageErrors).toEqual([]);
  });
});
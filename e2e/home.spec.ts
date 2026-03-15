import { test, expect } from '@playwright/test';

test('homepage has title and main heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/NewDayVentures/);

  // Expect main heading to be visible
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();
});

import { test, expect } from '@playwright/test';

test.describe('Store and Cart Flow', () => {

  test('should open and close the cart sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Click on cart icon (it has a span with the number of items inside)
    await page.locator('button:has(svg.lucide-shopping-cart)').first().click();
    
    // Expect cart to be visible
    await expect(page.getByText('Your Cart').first()).toBeVisible();
    await expect(page.getByText('Your cart is empty').first()).toBeVisible();
    
    // Close cart
    await page.locator('button:has(svg.lucide-x)').last().click();
    
    // Expect cart to be hidden
    await expect(page.getByText('Your Cart').first()).toBeHidden();
  });
});

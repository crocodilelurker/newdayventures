import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Click on the login button in navbar
    await page.getByRole('link', { name: 'Log in' }).click();
    
    // Verify we are on login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });

  test('should navigate to signup page and show validation error for short password', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill the form
    await page.fill('input[placeholder="John Doe"]', 'Test User');
    await page.fill('input[placeholder="you@example.com"]', `test-${Date.now()}@example.com`);
    await page.fill('input[type="password"]', '123'); // Short password
    
    // Submit form
    await page.getByRole('button', { name: 'Create account' }).click();
    
    // Verify toast error is shown (password too short)
    await expect(page.getByText('Password must be at least 6 characters').first()).toBeVisible();
  });
  
  // Note: We avoid fully testing successful signup here to avoid polluting the DB
  // unless we set up a dedicated test database and teardown script
});

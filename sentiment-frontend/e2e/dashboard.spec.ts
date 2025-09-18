import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
  });

  test('should display dashboard page', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/Sentiment Analysis/);
    
    // Check for main dashboard elements
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    // Test navigation to different sections
    await page.click('text=Posts');
    await expect(page).toHaveURL(/.*posts/);
    
    await page.click('text=Sentiment');
    await expect(page).toHaveURL(/.*sentiment/);
    
    await page.click('text=Trends');
    await expect(page).toHaveURL(/.*trends/);
  });

  test('should display charts and data visualizations', async ({ page }) => {
    // Check for chart containers
    await expect(page.locator('[data-testid="gauge-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="line-chart"]')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile navigation works
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Check if content is still accessible
    await expect(page.locator('main')).toBeVisible();
  });

  test('should handle theme toggle', async ({ page }) => {
    // Find and click theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
    
    // Click to toggle theme
    await themeToggle.click();
    
    // Check if theme changed (dark mode class should be added/removed)
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });
});
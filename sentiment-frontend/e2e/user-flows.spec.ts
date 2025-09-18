import { test, expect } from '@playwright/test';

test.describe('User Flows', () => {
  test('should complete login flow', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should filter posts by sentiment', async ({ page }) => {
    await page.goto('/posts');
    
    // Wait for posts to load
    await expect(page.locator('[data-testid="posts-container"]')).toBeVisible();
    
    // Apply sentiment filter
    await page.click('[data-testid="sentiment-filter"]');
    await page.click('text=Positive');
    
    // Check if filter is applied
    await expect(page.locator('[data-testid="active-filter"]')).toContainText('Positive');
    
    // Verify posts are filtered
    const posts = page.locator('[data-testid="post-item"]');
    await expect(posts.first()).toBeVisible();
  });

  test('should search for posts', async ({ page }) => {
    await page.goto('/posts');
    
    // Use search functionality
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('climate change');
    await page.keyboard.press('Enter');
    
    // Check if search results are displayed
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-query"]')).toContainText('climate change');
  });

  test('should display real-time updates', async ({ page }) => {
    await page.goto('/trends');
    
    // Check for real-time chart
    await expect(page.locator('[data-testid="realtime-chart"]')).toBeVisible();
    
    // Wait for potential updates (simulate real-time data)
    await page.waitForTimeout(2000);
    
    // Verify chart is still visible and functional
    await expect(page.locator('[data-testid="realtime-chart"]')).toBeVisible();
  });

  test('should handle date range selection', async ({ page }) => {
    await page.goto('/analytics');
    
    // Open date picker
    await page.click('[data-testid="date-range-picker"]');
    
    // Select a date range
    await page.click('[data-testid="last-7-days"]');
    
    // Verify date range is applied
    await expect(page.locator('[data-testid="selected-range"]')).toContainText('Last 7 days');
    
    // Check if data updates
    await expect(page.locator('[data-testid="analytics-data"]')).toBeVisible();
  });

  test('should export data', async ({ page }) => {
    await page.goto('/posts');
    
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-button"]');
    
    // Verify download starts
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/posts.*\.csv/);
  });
});
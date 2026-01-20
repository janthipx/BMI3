import { test, expect, type Page } from '@playwright/test';

test.describe.serial('Specific UI Tests: Login & Weight Recording', () => {
  let page: Page;
  const timestamp = Date.now();
  const email = `ui_test_${timestamp}@example.com`;
  const password = 'Password123!';
  const displayName = `UI Tester`;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // Pre-condition: Register a user so we can test Login
  test('Pre-condition: Create User', async () => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByLabel('Display Name').fill(displayName);
    
    await page.click('button:has-text("Create Account")');
    await expect(page).toHaveURL(/\/login/);
  });

  // Test 1: Login
  test('Test: User Login', async () => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  // Test 2: Record Weight (BMI)
  test('Test: Record Weight', async () => {
    await page.goto('/bmi/new');
    await expect(page.getByRole('heading', { name: 'New Measurement' })).toBeVisible();
    
    const today = new Date().toISOString().split('T')[0];
    await page.getByLabel('Date').fill(today);
    await page.getByLabel('Weight (kg)').fill('65.5');
    await page.getByLabel('Height (m)').fill('1.70');
    
    // Verify real-time preview
    await expect(page.getByText('Estimated BMI')).toBeVisible();
    
    await page.click('button:has-text("Save Record")');

    // Verify redirect and data in history
    await expect(page).toHaveURL(/\/bmi\/history/);
    await expect(page.getByRole('heading', { name: 'History Log' })).toBeVisible();
    
    const row = page.getByRole('row').filter({ hasText: '65.5' });
    await expect(row).toBeVisible();
    await expect(row).toContainText('1.7'); // 1.70 might show as 1.7
  });
});

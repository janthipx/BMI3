import { test, expect, type Page } from '@playwright/test';

test.describe.serial('BMI WebApp User Flow', () => {
  let page: Page;
  const timestamp = Date.now();
  const email = `user_${timestamp}@example.com`;
  const password = 'Password123!';
  const displayName = `User ${timestamp}`;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // Case 1: User Registration
  test('Case 1: User Registration', async () => {
    await page.goto('/register');
    // Updated for luxury UI
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByLabel('Display Name').fill(displayName);
    
    // Button "Create Account"
    await page.click('button:has-text("Create Account")');

    // Expect redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  // Case 2: Login
  test('Case 2: User Login', async () => {
    await page.goto('/login');
    // English labels
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    // Button "Sign In"
    await page.click('button:has-text("Sign In")');

    // Expect redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  // Case 3: Record BMI
  test('Case 3: Record BMI', async () => {
    await page.goto('/bmi/new');
    
    // English labels based on latest file read
    const today = new Date().toISOString().split('T')[0];
    await page.getByLabel('Date').fill(today);
    await page.getByLabel('Weight (kg)').fill('70');
    await page.getByLabel('Height (m)').fill('1.75');
    await page.getByLabel('Note').fill('Test record');

    // Verify real-time calculation (Label is "Estimated BMI")
    await expect(page.getByText('Estimated BMI')).toBeVisible();
    
    // Button "Save Record"
    await page.click('button:has-text("Save Record")');

    // Expect redirect to history
    await expect(page).toHaveURL(/\/bmi\/history/);
  });

  // Case 4: Verify History
  test('Case 4: Verify BMI History', async () => {
    await page.goto('/bmi/history');
    // Heading "History Log"
    await expect(page.getByRole('heading', { name: 'History Log' })).toBeVisible();
    
    const row = page.getByRole('row').filter({ hasText: 'Test record' });
    await expect(row).toBeVisible();
    await expect(row).toContainText('70');
    await expect(row).toContainText('1.75');
  });

  // Case 5: Logout
  test('Case 5: Logout', async () => {
    await page.goto('/dashboard');
    // Click Logout button
    await page.click('button:has-text("Logout")');
    
    // Expect redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

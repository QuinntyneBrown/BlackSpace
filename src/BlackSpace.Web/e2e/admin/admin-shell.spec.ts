import { test, expect } from '@playwright/test';
import { AdminShellPage } from './pages/admin-shell.po';
import { setupAdminApiMocks } from './helpers/api-mocks';

test.describe('Admin Shell', () => {
  let shell: AdminShellPage;

  test.beforeEach(async ({ page }) => {
    await setupAdminApiMocks(page);
    shell = new AdminShellPage(page);
    await shell.goto();
  });

  test('should load the admin dashboard by default', async ({ page }) => {
    expect(page.url()).toContain('/admin/dashboard');
  });

  test('should display the toolbar with title "Black Space Admin"', async () => {
    await expect(shell.toolbar).toBeVisible();
    const title = await shell.getTitle();
    expect(title.trim()).toBe('Black Space Admin');
  });

  test('should display 3 navigation links', async ({ }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Sidenav hidden on mobile by default');
    test.skip(testInfo.project.name === 'tablet', 'Sidenav hidden on tablet by default');

    const labels = await shell.getNavLinkLabels();
    expect(labels).toHaveLength(3);
    expect(labels).toContain('Dashboard');
    expect(labels).toContain('Members');
    expect(labels).toContain('Content');
  });

  test('should navigate to Members page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Sidenav hidden on mobile by default');
    test.skip(testInfo.project.name === 'tablet', 'Sidenav hidden on tablet by default');

    await shell.clickNavLink('Members');
    await page.waitForURL(/\/admin\/members/);
    expect(page.url()).toContain('/admin/members');
  });

  test('should navigate to Content page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Sidenav hidden on mobile by default');
    test.skip(testInfo.project.name === 'tablet', 'Sidenav hidden on tablet by default');

    await shell.clickNavLink('Content');
    await page.waitForURL(/\/admin\/content/);
    expect(page.url()).toContain('/admin/content');
  });

  test('should navigate back to Dashboard', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Sidenav hidden on mobile by default');
    test.skip(testInfo.project.name === 'tablet', 'Sidenav hidden on tablet by default');

    await shell.clickNavLink('Members');
    await page.waitForURL(/\/admin\/members/);

    await shell.clickNavLink('Dashboard');
    await page.waitForURL(/\/admin\/dashboard/);
    expect(page.url()).toContain('/admin/dashboard');
  });

  test('should toggle sidenav menu on mobile viewport', async ({ }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only test');

    // On mobile, sidenav is initially closed (mode=over, opened=false)
    const initiallyOpen = await shell.isMenuOpen();
    expect(initiallyOpen).toBe(false);

    // Toggle open
    await shell.toggleMenu();
    await shell.sidenav.waitFor({ state: 'visible' });
    expect(await shell.isMenuOpen()).toBe(true);

    // Toggle close
    await shell.toggleMenu();
    await shell.sidenav.waitFor({ state: 'hidden' });
    expect(await shell.isMenuOpen()).toBe(false);
  });
});

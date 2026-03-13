import { test, expect } from '@playwright/test';
import { MembersPage } from './pages/members.po';
import { MemberEditDialog } from './pages/member-edit-dialog.po';
import { ConfirmDialog } from './pages/confirm-dialog.po';
import { setupAdminApiMocks } from './helpers/api-mocks';

test.describe('Admin Members', () => {
  let members: MembersPage;

  test.beforeEach(async ({ page }) => {
    await setupAdminApiMocks(page);
    members = new MembersPage(page);
    await members.goto();
    await members.waitForTableLoaded();
  });

  test('should display Members page title', async () => {
    await expect(members.pageTitle).toBeVisible();
    const title = await members.getPageTitle();
    expect(title.trim()).toBe('Members');
  });

  test('should display members table with data', async () => {
    await expect(members.dataTable).toBeVisible();
    const rowCount = await members.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should search for members', async ({ page }) => {
    // Wait for initial data load
    await expect(members.tableRows.first()).toBeVisible();

    // Perform search
    await members.search('Alice');

    // Wait for the search API call to complete
    await page.waitForResponse(
      (response) => response.url().includes('/api/admin/members') && response.url().includes('search=Alice'),
    );

    // The mock will filter results to only Alice
    const rowCount = await members.getRowCount();
    expect(rowCount).toBe(1);
  });

  test('should open edit dialog when clicking edit', async ({ page }) => {
    await expect(members.tableRows.first()).toBeVisible();

    await members.clickEdit(0);

    const dialog = new MemberEditDialog(page);
    await dialog.dialog.waitFor({ state: 'visible' });
    expect(await dialog.isOpen()).toBe(true);
    const title = await dialog.getTitle();
    expect(title.trim()).toBe('Edit Member');
  });

  test('should close edit dialog on cancel', async ({ page }) => {
    await expect(members.tableRows.first()).toBeVisible();

    await members.clickEdit(0);

    const dialog = new MemberEditDialog(page);
    await dialog.dialog.waitFor({ state: 'visible' });
    expect(await dialog.isOpen()).toBe(true);

    await dialog.cancel();
    await dialog.dialog.waitFor({ state: 'hidden' });
    expect(await dialog.isOpen()).toBe(false);
  });

  test('should open confirm dialog when clicking delete', async ({ page }) => {
    await expect(members.tableRows.first()).toBeVisible();

    await members.clickDelete(0);

    const confirmDialog = new ConfirmDialog(page);
    await confirmDialog.dialog.waitFor({ state: 'visible' });
    expect(await confirmDialog.isOpen()).toBe(true);

    const title = await confirmDialog.getTitle();
    expect(title.trim()).toBe('Delete Member');

    const message = await confirmDialog.getMessage();
    expect(message).toContain('Are you sure you want to delete');
  });

  test('should dismiss confirm dialog on cancel', async ({ page }) => {
    await expect(members.tableRows.first()).toBeVisible();

    await members.clickDelete(0);

    const confirmDialog = new ConfirmDialog(page);
    await confirmDialog.dialog.waitFor({ state: 'visible' });
    expect(await confirmDialog.isOpen()).toBe(true);

    await confirmDialog.cancel();
    await confirmDialog.dialog.waitFor({ state: 'hidden' });
    expect(await confirmDialog.isOpen()).toBe(false);
  });
});

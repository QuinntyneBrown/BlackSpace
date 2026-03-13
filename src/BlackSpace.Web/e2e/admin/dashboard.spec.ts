import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/dashboard.po';
import { MemberEditDialog } from './pages/member-edit-dialog.po';
import { setupAdminApiMocks } from './helpers/api-mocks';

test.describe('Admin Dashboard', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await setupAdminApiMocks(page);
    dashboard = new DashboardPage(page);
    await dashboard.goto();
  });

  test('should display Dashboard page title', async () => {
    await expect(dashboard.pageTitle).toBeVisible();
    await expect(dashboard.pageTitle).toHaveText('Dashboard');
  });

  test('should display 4 stat cards', async () => {
    await expect(dashboard.statCards).toHaveCount(4);

    const labels = await dashboard.getStatCardLabels();
    expect(labels).toContain('Total Members');
    expect(labels).toContain('New This Month');
    expect(labels).toContain('Next Meetup Date');
    expect(labels).toContain('Active Referral Sources');
  });

  test('should display recent members table', async () => {
    await expect(dashboard.recentMembersHeading).toBeVisible();
    await expect(dashboard.recentMembersHeading).toHaveText('Recent Members');
    await expect(dashboard.recentMembersTable).toBeVisible();
  });

  test('should display quick action buttons', async () => {
    await expect(dashboard.quickActionsHeading).toBeVisible();
    await expect(dashboard.quickActionsHeading).toHaveText('Quick Actions');
    await expect(dashboard.addMemberButton).toBeVisible();
    await expect(dashboard.editMeetupDateButton).toBeVisible();
  });

  test('should open add member dialog when clicking Add Member', async ({ page }) => {
    await dashboard.clickAddMember();

    const dialog = new MemberEditDialog(page);
    await dialog.dialog.waitFor({ state: 'visible' });
    expect(await dialog.isOpen()).toBe(true);
    const title = await dialog.getTitle();
    expect(title.trim()).toBe('Add Member');
  });

  test('should navigate to content page when clicking Edit Meetup Date', async ({ page }) => {
    await dashboard.clickEditMeetupDate();
    await page.waitForURL(/\/admin\/content/);
    expect(page.url()).toContain('/admin/content');
  });
});

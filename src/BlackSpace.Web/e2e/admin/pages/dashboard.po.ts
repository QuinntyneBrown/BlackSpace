import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly statCards: Locator;
  readonly recentMembersHeading: Locator;
  readonly recentMembersTable: Locator;
  readonly quickActionsHeading: Locator;
  readonly actionButtons: Locator;
  readonly addMemberButton: Locator;
  readonly editMeetupDateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.admin-dashboard-page h1');
    this.statCards = page.locator('lib-admin-stat-card');
    this.recentMembersHeading = page.locator('.recent-section h2');
    this.recentMembersTable = page.locator('.recent-section lib-admin-data-table');
    this.quickActionsHeading = page.locator('.quick-actions h2');
    this.actionButtons = page.locator('.action-buttons button');
    this.addMemberButton = page.getByRole('button', { name: 'Add Member' });
    this.editMeetupDateButton = page.getByRole('button', { name: 'Edit Meetup Date' });
  }

  async goto() {
    await this.page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async getStatCardValue(label: string): Promise<string> {
    const card = this.statCards.filter({ hasText: label });
    const value = card.locator('.stat-value');
    return (await value.textContent()) ?? '';
  }

  async getStatCardLabels(): Promise<string[]> {
    const labels: string[] = [];
    const count = await this.statCards.count();
    for (let i = 0; i < count; i++) {
      const text = await this.statCards.nth(i).locator('.stat-label').textContent();
      if (text) {
        labels.push(text.trim());
      }
    }
    return labels;
  }

  async getTotalMembers(): Promise<string> {
    return this.getStatCardValue('Total Members');
  }

  async getNewThisMonth(): Promise<string> {
    return this.getStatCardValue('New This Month');
  }

  async clickAddMember() {
    await this.addMemberButton.click();
  }

  async clickEditMeetupDate() {
    await this.editMeetupDateButton.click();
  }
}

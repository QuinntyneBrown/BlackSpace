import { Page, Locator } from '@playwright/test';

export class MembersPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchBar: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly headerCells: Locator;
  readonly loadingSpinner: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.member-list-page h1');
    this.searchBar = page.locator('lib-admin-search-bar');
    this.searchInput = page.locator('lib-admin-search-bar input');
    this.dataTable = page.locator('lib-admin-data-table');
    this.tableRows = page.locator('lib-admin-data-table tr[mat-row]');
    this.headerCells = page.locator('lib-admin-data-table th[mat-header-cell]');
    this.loadingSpinner = page.locator('lib-admin-data-table mat-spinner');
    this.emptyState = page.locator('.empty-state');
  }

  async goto() {
    await this.page.goto('/admin/members', { waitUntil: 'domcontentloaded' });
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async clickEdit(index: number) {
    const row = this.tableRows.nth(index);
    await row.locator('button[aria-label="Edit"]').click();
  }

  async clickDelete(index: number) {
    const row = this.tableRows.nth(index);
    await row.locator('button[aria-label="Delete"]').click();
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  async waitForTableLoaded() {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      // Spinner may have already disappeared
    });
  }
}

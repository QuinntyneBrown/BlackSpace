import { Page, Locator } from '@playwright/test';

export class AdminShellPage {
  readonly page: Page;
  readonly toolbar: Locator;
  readonly toolbarTitle: Locator;
  readonly menuToggleButton: Locator;
  readonly sidenav: Locator;
  readonly navLinks: Locator;
  readonly contentArea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toolbar = page.locator('mat-toolbar');
    this.toolbarTitle = page.locator('.toolbar-title');
    this.menuToggleButton = page.locator('mat-toolbar button[aria-label="Toggle menu"]');
    this.sidenav = page.locator('mat-sidenav');
    this.navLinks = page.locator('mat-sidenav mat-nav-list a[mat-list-item]');
    this.contentArea = page.locator('mat-sidenav-content');
  }

  async goto() {
    await this.page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await this.page.waitForURL(/\/admin\/dashboard/);
    await this.toolbar.waitFor({ state: 'visible' });
  }

  async clickNavLink(label: string) {
    await this.navLinks.filter({ hasText: label }).click();
  }

  async toggleMenu() {
    await this.menuToggleButton.click();
  }

  async isMenuOpen(): Promise<boolean> {
    return await this.sidenav.isVisible();
  }

  async getTitle(): Promise<string> {
    return await this.toolbarTitle.textContent() ?? '';
  }

  async getNavLinkLabels(): Promise<string[]> {
    const labels: string[] = [];
    const count = await this.navLinks.count();
    for (let i = 0; i < count; i++) {
      const text = await this.navLinks.nth(i).locator('[matlistitemtitle]').textContent();
      if (text) {
        labels.push(text.trim());
      }
    }
    return labels;
  }
}

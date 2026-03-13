import { Page, Locator } from '@playwright/test';

export class ContentPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly meetupDateSection: Locator;
  readonly meetupDateInput: Locator;
  readonly meetupTimeInput: Locator;
  readonly saveMeetupButton: Locator;
  readonly referralSourcesSection: Locator;
  readonly referralSourceChips: Locator;
  readonly newSourceInput: Locator;
  readonly addSourceButton: Locator;
  readonly saveSourcesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.content-management-page h1');
    this.meetupDateSection = page.locator('mat-card').filter({ hasText: 'Next Meetup Date' });
    this.meetupDateInput = this.meetupDateSection.getByLabel('Date');
    this.meetupTimeInput = this.meetupDateSection.getByLabel('Time');
    this.saveMeetupButton = this.meetupDateSection.getByRole('button', { name: 'Save' });
    this.referralSourcesSection = page.locator('mat-card').filter({ hasText: 'Referral Sources' });
    this.referralSourceChips = this.referralSourcesSection.locator('mat-chip-row');
    this.newSourceInput = this.referralSourcesSection.getByLabel('New Source');
    this.addSourceButton = this.referralSourcesSection.getByRole('button', { name: 'Add' });
    this.saveSourcesButton = this.referralSourcesSection.locator('button.save-sources-btn');
  }

  async goto() {
    await this.page.goto('/admin/content', { waitUntil: 'domcontentloaded' });
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async setMeetupDate(date: string) {
    await this.meetupDateInput.fill(date);
  }

  async setMeetupTime(time: string) {
    await this.meetupTimeInput.fill(time);
  }

  async saveMeetupDate() {
    await this.saveMeetupButton.click();
  }

  async addSource(name: string) {
    await this.newSourceInput.fill(name);
    await this.addSourceButton.click();
  }

  async removeSource(name: string) {
    const chip = this.referralSourceChips.filter({ hasText: name });
    await chip.locator('button[matChipRemove]').click();
  }

  async saveReferralSources() {
    await this.saveSourcesButton.click();
  }

  async getSources(): Promise<string[]> {
    const sources: string[] = [];
    const count = await this.referralSourceChips.count();
    for (let i = 0; i < count; i++) {
      const text = await this.referralSourceChips.nth(i).textContent();
      if (text) {
        // Strip the 'cancel' icon text that may appear
        sources.push(text.replace('cancel', '').trim());
      }
    }
    return sources;
  }
}

import { Page, Locator } from '@playwright/test';

export class SignupFormPO {
  readonly page: Page;
  readonly form: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly roleTitleInput: Locator;
  readonly organizationInput: Locator;
  readonly referralSelect: Locator;
  readonly submitButton: Locator;
  readonly successState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('lib-signup-form-container form');
    this.fullNameInput = page.locator('lib-form-input').filter({ hasText: 'Full Name' }).locator('input');
    this.emailInput = page.locator('lib-form-input').filter({ hasText: 'Email' }).locator('input');
    this.roleTitleInput = page.locator('lib-form-input').filter({ hasText: 'Current Role' }).locator('input');
    this.organizationInput = page.locator('lib-form-input').filter({ hasText: 'Organization' }).locator('input');
    this.referralSelect = page.locator('lib-form-input').filter({ hasText: 'How did you hear' }).locator('select');
    this.submitButton = page.locator('lib-signup-form-container lib-button-primary').filter({ hasText: 'Join the Community' });
    this.successState = page.locator('lib-success-state');
  }

  async fillName(name: string) {
    await this.fullNameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillRole(role: string) {
    await this.roleTitleInput.fill(role);
  }

  async fillOrg(org: string) {
    await this.organizationInput.fill(org);
  }

  async submit() {
    await this.submitButton.click();
  }

  async getFormInputCount(): Promise<number> {
    return await this.page.locator('lib-signup-form-container lib-form-input').count();
  }

  async isSuccessVisible(): Promise<boolean> {
    return await this.successState.isVisible();
  }
}

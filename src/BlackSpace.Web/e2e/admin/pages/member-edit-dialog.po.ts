import { Page, Locator } from '@playwright/test';

export interface MemberFormData {
  fullName?: string;
  email?: string;
  roleTitle?: string;
  organization?: string;
  referralSource?: string;
}

export class MemberEditDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly dialogTitle: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly roleTitleInput: Locator;
  readonly organizationInput: Locator;
  readonly referralSourceSelect: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('mat-dialog-container');
    this.dialogTitle = page.locator('mat-dialog-container [mat-dialog-title]');
    this.fullNameInput = page.locator('mat-dialog-container').getByLabel('Full Name');
    this.emailInput = page.locator('mat-dialog-container').getByLabel('Email');
    this.roleTitleInput = page.locator('mat-dialog-container').getByLabel('Role/Title');
    this.organizationInput = page.locator('mat-dialog-container').getByLabel('Organization');
    this.referralSourceSelect = page.locator('mat-dialog-container mat-select');
    this.saveButton = page.locator('mat-dialog-container').getByRole('button', { name: 'Save' });
    this.cancelButton = page.locator('mat-dialog-container').getByRole('button', { name: 'Cancel' });
  }

  async fill(data: MemberFormData) {
    if (data.fullName !== undefined) {
      await this.fullNameInput.fill(data.fullName);
    }
    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }
    if (data.roleTitle !== undefined) {
      await this.roleTitleInput.fill(data.roleTitle);
    }
    if (data.organization !== undefined) {
      await this.organizationInput.fill(data.organization);
    }
    if (data.referralSource !== undefined) {
      await this.referralSourceSelect.click();
      await this.page.getByRole('option', { name: data.referralSource }).click();
    }
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async isOpen(): Promise<boolean> {
    return await this.dialog.isVisible();
  }

  async getTitle(): Promise<string> {
    return (await this.dialogTitle.textContent()) ?? '';
  }
}

import { Page, Locator } from '@playwright/test';

export class ConfirmDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly message: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('mat-dialog-container');
    this.title = page.locator('mat-dialog-container [mat-dialog-title]');
    this.message = page.locator('mat-dialog-container .message');
    this.confirmButton = page.locator('mat-dialog-container mat-dialog-actions button[mat-flat-button]');
    this.cancelButton = page.locator('mat-dialog-container mat-dialog-actions button[mat-button]');
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async isOpen(): Promise<boolean> {
    return await this.dialog.isVisible();
  }

  async getMessage(): Promise<string> {
    return (await this.message.textContent()) ?? '';
  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent()) ?? '';
  }
}

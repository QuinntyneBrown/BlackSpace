import { Page, Locator } from '@playwright/test';

export class NavigationPO {
  readonly page: Page;
  readonly navbar: Locator;
  readonly desktopLinks: Locator;
  readonly hamburger: Locator;
  readonly mobileOverlay: Locator;
  readonly mobileCloseButton: Locator;
  readonly mobileLinks: Locator;
  readonly joinButton: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.locator('lib-navigation-container .navbar');
    this.desktopLinks = page.locator('lib-navigation-container .nav-links .nav-link');
    this.hamburger = page.locator('lib-navigation-container .hamburger');
    this.mobileOverlay = page.locator('lib-mobile-menu-overlay .overlay');
    this.mobileCloseButton = page.locator('lib-mobile-menu-overlay .close-btn');
    this.mobileLinks = page.locator('lib-mobile-menu-overlay .nav-link');
    this.joinButton = page.locator('lib-navigation-container .nav-links lib-button-primary');
    this.logo = page.locator('lib-navigation-container .logo');
  }

  async clickLink(label: string) {
    await this.desktopLinks.filter({ hasText: label }).click();
  }

  async toggleMobileMenu() {
    await this.hamburger.click();
  }

  async closeMobileMenu() {
    await this.mobileCloseButton.click();
  }

  async isMenuOpen(): Promise<boolean> {
    return await this.mobileOverlay.isVisible();
  }

  async getDesktopLinkLabels(): Promise<string[]> {
    return await this.desktopLinks.allTextContents();
  }

  async getMobileLinkLabels(): Promise<string[]> {
    return await this.mobileLinks.allTextContents();
  }
}

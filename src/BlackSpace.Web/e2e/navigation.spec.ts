import { test, expect } from '@playwright/test';
import { NavigationPO } from './page-objects/navigation.po';
import { LandingPagePO } from './page-objects/landing-page.po';

test.describe('Navigation', () => {
  let nav: NavigationPO;
  let landingPage: LandingPagePO;

  test.beforeEach(async ({ page }) => {
    nav = new NavigationPO(page);
    landingPage = new LandingPagePO(page);
    await landingPage.goto();
  });

  test.describe('Desktop', () => {
    test('nav links are visible @desktop @tablet', async ({ }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'Desktop-only test');
      await expect(nav.navbar).toBeVisible();
      const labels = await nav.getDesktopLinkLabels();
      expect(labels).toContain('About');
      expect(labels).toContain("Who It's For");
      expect(labels).toContain('What We Do');
      expect(labels).toContain('Founder');
    });

    test('join button is visible in nav @desktop @tablet', async ({ }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'Desktop-only test');
      await expect(nav.joinButton).toBeVisible();
    });

    test('clicking About scrolls to about section @desktop @tablet', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'Desktop-only test');
      await nav.clickLink('About');
      await page.waitForTimeout(1000);
      const aboutSection = landingPage.problemSection;
      await expect(aboutSection).toBeInViewport();
    });

    test('clicking What We Do scrolls to that section @desktop @tablet', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'Desktop-only test');
      await nav.clickLink('What We Do');
      await page.waitForTimeout(1000);
      await expect(landingPage.whatWeDoSection).toBeInViewport();
    });
  });

  test.describe('Mobile', () => {
    test('hamburger menu is visible @mobile', async ({ }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'Mobile-only test');
      await expect(nav.hamburger).toBeVisible();
    });

    test('desktop nav links are hidden @mobile', async ({ }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'Mobile-only test');
      await expect(nav.desktopLinks.first()).not.toBeVisible();
    });

    test('mobile menu opens and shows links @mobile', async ({ }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'Mobile-only test');
      await nav.toggleMobileMenu();
      await expect(nav.mobileOverlay).toBeVisible();

      const labels = await nav.getMobileLinkLabels();
      expect(labels).toContain('About');
      expect(labels).toContain("Who It's For");
      expect(labels).toContain('What We Do');
      expect(labels).toContain('Founder');
    });

    test('mobile menu close button works @mobile', async ({ }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'Mobile-only test');
      await nav.toggleMobileMenu();
      await expect(nav.mobileOverlay).toBeVisible();

      await nav.closeMobileMenu();
      await expect(nav.mobileOverlay).not.toBeVisible();
    });

    test('mobile nav link navigates to section @mobile', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'Mobile-only test');
      await nav.toggleMobileMenu();
      await expect(nav.mobileOverlay).toBeVisible();

      await nav.mobileLinks.filter({ hasText: 'About' }).click();
      await expect(nav.mobileOverlay).not.toBeVisible();

      await page.waitForTimeout(1000);
      await expect(landingPage.problemSection).toBeInViewport();
    });
  });
});

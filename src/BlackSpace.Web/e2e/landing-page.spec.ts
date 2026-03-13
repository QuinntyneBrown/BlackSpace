import { test, expect } from '@playwright/test';
import { LandingPagePO } from './page-objects/landing-page.po';

test.describe('Landing Page', () => {
  let landingPage: LandingPagePO;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPagePO(page);
    await landingPage.goto();
  });

  test('page loads and hero section is visible', async () => {
    await expect(landingPage.heroSection).toBeVisible();
    await expect(landingPage.heroHeadline).toBeVisible();
    await expect(landingPage.heroHeadline).toContainText('Black Canadians');
  });

  test('hero subheadline has correct text', async () => {
    await expect(landingPage.heroSubheadline).toBeVisible();
    await expect(landingPage.heroSubheadline).toContainText('Connecting, elevating, and growing');
  });

  test('all 5 audience cards render', async () => {
    await expect(landingPage.audienceCards).toHaveCount(5);
  });

  test('all 3 pillar cards render', async () => {
    await expect(landingPage.pillarCards).toHaveCount(3);
  });

  test('footer is visible with correct copyright', async () => {
    await landingPage.footer.scrollIntoViewIfNeeded();
    await expect(landingPage.footer).toBeVisible();
    await expect(landingPage.footer).toContainText('2026 Black Space Canada');
  });

  test('all section IDs exist', async () => {
    await expect(landingPage.heroSection).toBeAttached();
    await expect(landingPage.problemSection).toBeAttached();
    await expect(landingPage.whoItsForSection).toBeAttached();
    await expect(landingPage.whatWeDoSection).toBeAttached();
    await expect(landingPage.signupSection).toBeAttached();
    await expect(landingPage.founderSection).toBeAttached();
  });

  test('navigation is visible', async ({ page }) => {
    // The navigation container's host element may report as hidden since
    // the actual navbar is position:fixed. Check the inner .navbar instead.
    await expect(page.locator('lib-navigation-container .navbar')).toBeVisible();
  });

  test('join and learn more buttons are visible in hero', async () => {
    await expect(landingPage.joinButton).toBeVisible();
    await expect(landingPage.learnMoreButton).toBeVisible();
  });
});

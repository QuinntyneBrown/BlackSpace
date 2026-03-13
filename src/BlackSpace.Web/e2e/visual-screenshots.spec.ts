import { test } from '@playwright/test';
import { LandingPagePO } from './page-objects/landing-page.po';

test.describe('Visual Screenshots', () => {
  let landingPage: LandingPagePO;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPagePO(page);
    await landingPage.goto();
  });

  test('full page screenshot', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await page.screenshot({
      path: `e2e/screenshots/full-page-${projectName}.png`,
      fullPage: true,
    });
  });

  test('hero section screenshot', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await landingPage.heroSection.screenshot({
      path: `e2e/screenshots/hero-${projectName}.png`,
    });
  });

  test('audience cards section screenshot', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await landingPage.whoItsForSection.scrollIntoViewIfNeeded();
    await landingPage.whoItsForSection.screenshot({
      path: `e2e/screenshots/audience-cards-${projectName}.png`,
    });
  });

  test('pillar cards section screenshot', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await landingPage.whatWeDoSection.scrollIntoViewIfNeeded();
    await landingPage.whatWeDoSection.screenshot({
      path: `e2e/screenshots/pillar-cards-${projectName}.png`,
    });
  });

  test('signup form screenshot', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await landingPage.signupSection.scrollIntoViewIfNeeded();
    await landingPage.signupSection.screenshot({
      path: `e2e/screenshots/signup-form-${projectName}.png`,
    });
  });

  test('footer screenshot', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    await landingPage.footer.scrollIntoViewIfNeeded();
    await landingPage.footer.screenshot({
      path: `e2e/screenshots/footer-${projectName}.png`,
    });
  });
});

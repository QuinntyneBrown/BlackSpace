import { test, expect } from '@playwright/test';
import { LandingPagePO } from './page-objects/landing-page.po';

test.describe('Fonts and Icons', () => {
  let landingPage: LandingPagePO;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPagePO(page);
    await landingPage.goto();
  });

  test('Sora font is applied to hero headline', async ({ page }) => {
    await expect(landingPage.heroHeadline).toBeVisible();
    const fontFamily = await page.evaluate(() => {
      const el = document.querySelector('.hero-headline');
      return el ? getComputedStyle(el).fontFamily : '';
    });
    expect(fontFamily).toContain('Sora');
  });

  test('Inter font is applied to body text', async ({ page }) => {
    const fontFamily = await page.evaluate(() => {
      return getComputedStyle(document.body).fontFamily;
    });
    expect(fontFamily).toContain('Inter');
  });

  test('Lucide icons render in audience cards as SVGs', async ({ page }) => {
    await landingPage.whoItsForSection.scrollIntoViewIfNeeded();

    const svgCount = await page.locator('lib-audience-card lib-lucide-icon svg').count();
    expect(svgCount).toBeGreaterThanOrEqual(5);

    // Verify SVGs have non-zero dimensions
    const firstSvg = page.locator('lib-audience-card lib-lucide-icon svg').first();
    const box = await firstSvg.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('Lucide icons render in pillar cards as SVGs', async ({ page }) => {
    await landingPage.whatWeDoSection.scrollIntoViewIfNeeded();

    const svgCount = await page.locator('lib-pillar-card lib-lucide-icon svg').count();
    expect(svgCount).toBeGreaterThanOrEqual(3);

    const firstSvg = page.locator('lib-pillar-card lib-lucide-icon svg').first();
    const box = await firstSvg.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('Sora font is applied to stat number', async ({ page }) => {
    await landingPage.problemSection.scrollIntoViewIfNeeded();

    const fontFamily = await page.evaluate(() => {
      const el = document.querySelector('.stat-number');
      return el ? getComputedStyle(el).fontFamily : '';
    });
    expect(fontFamily).toContain('Sora');
  });

  test('Sora font is applied to founder name', async ({ page }) => {
    await landingPage.founderSection.scrollIntoViewIfNeeded();

    const fontFamily = await page.evaluate(() => {
      const el = document.querySelector('.founder-name');
      return el ? getComputedStyle(el).fontFamily : '';
    });
    expect(fontFamily).toContain('Sora');
  });
});

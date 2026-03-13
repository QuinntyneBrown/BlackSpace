import { test, expect } from '@playwright/test';
import { LandingPagePO } from './page-objects/landing-page.po';

test.describe('Responsive Layout', () => {
  let landingPage: LandingPagePO;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPagePO(page);
    await landingPage.goto();
  });

  test.describe('Desktop Layout', () => {
    test('audience cards are in a multi-column grid @desktop @tablet', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'Desktop-only test');
      await landingPage.whoItsForSection.scrollIntoViewIfNeeded();

      const cards = landingPage.audienceCards;
      const count = await cards.count();
      expect(count).toBe(5);

      const box1 = await cards.nth(0).boundingBox();
      const box2 = await cards.nth(1).boundingBox();
      expect(box1).not.toBeNull();
      expect(box2).not.toBeNull();

      // In a multi-column grid, first two cards should be at the same vertical position
      expect(Math.abs(box1!.y - box2!.y)).toBeLessThan(10);
      // And different horizontal positions
      expect(Math.abs(box1!.x - box2!.x)).toBeGreaterThan(50);
    });

    test('pillar cards are in a 3-column grid @desktop @tablet', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'Desktop-only test');
      await landingPage.whatWeDoSection.scrollIntoViewIfNeeded();

      const cards = landingPage.pillarCards;
      const count = await cards.count();
      expect(count).toBe(3);

      const box1 = await cards.nth(0).boundingBox();
      const box2 = await cards.nth(1).boundingBox();
      const box3 = await cards.nth(2).boundingBox();

      expect(Math.abs(box1!.y - box2!.y)).toBeLessThan(10);
      expect(Math.abs(box2!.y - box3!.y)).toBeLessThan(10);

      expect(box2!.x).toBeGreaterThan(box1!.x);
      expect(box3!.x).toBeGreaterThan(box2!.x);
    });

    test('hero buttons are horizontally aligned @desktop @tablet', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'Desktop-only test');
      const joinBtn = landingPage.joinButton;
      const learnBtn = landingPage.learnMoreButton;

      const box1 = await joinBtn.boundingBox();
      const box2 = await learnBtn.boundingBox();

      expect(box1).not.toBeNull();
      expect(box2).not.toBeNull();

      expect(Math.abs(box1!.y - box2!.y)).toBeLessThan(20);
      expect(Math.abs(box1!.x - box2!.x)).toBeGreaterThan(20);
    });
  });

  test.describe('Mobile Layout', () => {
    test('audience cards stack vertically @mobile', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'Mobile-only test');
      await landingPage.whoItsForSection.scrollIntoViewIfNeeded();

      const cards = landingPage.audienceCards;
      const box1 = await cards.nth(0).boundingBox();
      const box2 = await cards.nth(1).boundingBox();

      expect(box1).not.toBeNull();
      expect(box2).not.toBeNull();

      // Stacked: second card should be below first card
      expect(box2!.y).toBeGreaterThan(box1!.y + box1!.height - 10);
    });

    test('pillar cards stack vertically @mobile', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'Mobile-only test');
      await landingPage.whatWeDoSection.scrollIntoViewIfNeeded();

      const cards = landingPage.pillarCards;
      const box1 = await cards.nth(0).boundingBox();
      const box2 = await cards.nth(1).boundingBox();

      expect(box1).not.toBeNull();
      expect(box2).not.toBeNull();

      expect(box2!.y).toBeGreaterThan(box1!.y + box1!.height - 10);
    });

    test('hero headline has responsive font size @mobile', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'Mobile-only test');
      const fontSize = await page.evaluate(() => {
        const el = document.querySelector('.hero-headline');
        return el ? parseFloat(getComputedStyle(el).fontSize) : 0;
      });

      // On mobile (375px), font size should be reduced from the desktop 64px
      expect(fontSize).toBeLessThan(64);
      expect(fontSize).toBeGreaterThan(20);
    });
  });
});

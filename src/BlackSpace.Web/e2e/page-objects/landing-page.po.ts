import { Page, Locator } from '@playwright/test';

export class LandingPagePO {
  readonly page: Page;
  readonly heroSection: Locator;
  readonly heroHeadline: Locator;
  readonly heroSubheadline: Locator;
  readonly joinButton: Locator;
  readonly learnMoreButton: Locator;
  readonly problemSection: Locator;
  readonly whoItsForSection: Locator;
  readonly audienceCards: Locator;
  readonly whatWeDoSection: Locator;
  readonly pillarCards: Locator;
  readonly signupSection: Locator;
  readonly founderSection: Locator;
  readonly footer: Locator;
  readonly navigation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroSection = page.locator('#hero');
    this.heroHeadline = page.locator('.hero-headline');
    this.heroSubheadline = page.locator('.hero-subheadline');
    this.joinButton = page.locator('lib-button-primary').filter({ hasText: 'Join the Community' }).first();
    this.learnMoreButton = page.locator('#hero lib-button-secondary').filter({ hasText: 'Learn More' });
    this.problemSection = page.locator('#about');
    this.whoItsForSection = page.locator('#who-its-for');
    this.audienceCards = page.locator('lib-audience-card');
    this.whatWeDoSection = page.locator('#what-we-do');
    this.pillarCards = page.locator('lib-pillar-card');
    this.signupSection = page.locator('#join');
    this.founderSection = page.locator('#founder');
    this.footer = page.locator('footer');
    this.navigation = page.locator('lib-navigation-container');
  }

  async goto() {
    // Mock API endpoints that the app calls to http://localhost:5000
    // Use a broad pattern to catch all API calls to the backend
    await this.page.route('http://localhost:5000/**', (route) => {
      const url = route.request().url();
      if (url.includes('/api/content/stats')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ totalMembers: 0 }),
        });
      }
      if (url.includes('/api/content/referral-sources')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(['LinkedIn', 'Twitter', 'Friend', 'Conference', 'Other']),
        });
      }
      if (url.includes('/api/members')) {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1 }),
        });
      }
      return route.fulfill({ status: 200, body: '{}' });
    });

    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for the lazy-loaded landing page component to render
    await this.page.waitForSelector('lib-landing-page', { timeout: 20000 });
  }
}

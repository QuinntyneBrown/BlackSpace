import { test, expect } from '@playwright/test';
import { ContentPage } from './pages/content.po';
import { setupAdminApiMocks } from './helpers/api-mocks';

test.describe('Admin Content Management', () => {
  let content: ContentPage;

  test.beforeEach(async ({ page }) => {
    await setupAdminApiMocks(page);
    content = new ContentPage(page);
    await content.goto();
  });

  test('should display Content Management page title', async () => {
    await expect(content.pageTitle).toBeVisible();
    await expect(content.pageTitle).toHaveText('Content Management');
  });

  test('should display meetup date section', async () => {
    await expect(content.meetupDateSection).toBeVisible();
    await expect(content.meetupDateInput).toBeVisible();
    await expect(content.meetupTimeInput).toBeVisible();
    await expect(content.saveMeetupButton).toBeVisible();
  });

  test('should display referral sources section', async () => {
    await expect(content.referralSourcesSection).toBeVisible();
    await expect(content.newSourceInput).toBeVisible();
    await expect(content.addSourceButton).toBeVisible();
  });

  test('should display existing referral sources as chips', async () => {
    // Wait for the referral sources API call to complete and chips to render
    await expect(content.referralSourceChips.first()).toBeVisible();

    const sources = await content.getSources();
    expect(sources.length).toBeGreaterThan(0);
    expect(sources).toContain('LinkedIn');
    expect(sources).toContain('Twitter');
  });

  test('should add a new referral source', async () => {
    // Wait for existing sources to load
    await expect(content.referralSourceChips.first()).toBeVisible();

    const initialSources = await content.getSources();
    const initialCount = initialSources.length;

    // Add a new source
    await content.addSource('Instagram');

    // Verify the chip was added
    const updatedSources = await content.getSources();
    expect(updatedSources.length).toBe(initialCount + 1);
    expect(updatedSources).toContain('Instagram');
  });

  test('should remove a referral source', async () => {
    // Wait for existing sources to load
    await expect(content.referralSourceChips.first()).toBeVisible();

    const initialSources = await content.getSources();
    const initialCount = initialSources.length;

    // Remove a source
    const sourceToRemove = initialSources[0];
    await content.removeSource(sourceToRemove);

    // Verify the chip was removed
    const updatedSources = await content.getSources();
    expect(updatedSources.length).toBe(initialCount - 1);
    expect(updatedSources).not.toContain(sourceToRemove);
  });
});

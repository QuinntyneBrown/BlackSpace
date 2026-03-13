import { test, expect } from '@playwright/test';
import { LandingPagePO } from './page-objects/landing-page.po';
import { SignupFormPO } from './page-objects/signup-form.po';

test.describe('Signup Form', () => {
  let landingPage: LandingPagePO;
  let signupForm: SignupFormPO;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPagePO(page);
    signupForm = new SignupFormPO(page);
    await landingPage.goto();
    await landingPage.signupSection.scrollIntoViewIfNeeded();
  });

  test('form renders with all 5 fields', async () => {
    const count = await signupForm.getFormInputCount();
    expect(count).toBe(5);
  });

  test('form has visible submit button', async () => {
    await expect(signupForm.submitButton).toBeVisible();
    await expect(signupForm.submitButton).toContainText('Join the Community');
  });

  test('full name field accepts input', async () => {
    await signupForm.fillName('Test User');
    await expect(signupForm.fullNameInput).toHaveValue('Test User');
  });

  test('email field accepts input', async () => {
    await signupForm.fillEmail('test@example.com');
    await expect(signupForm.emailInput).toHaveValue('test@example.com');
  });

  test('role field accepts input', async () => {
    await signupForm.fillRole('Software Engineer');
    await expect(signupForm.roleTitleInput).toHaveValue('Software Engineer');
  });

  test('organization field accepts input', async () => {
    await signupForm.fillOrg('MDA Space');
    await expect(signupForm.organizationInput).toHaveValue('MDA Space');
  });

  test('submit button is disabled when required fields are empty', async () => {
    // The form has required validators on fullName and email
    // The button should be disabled when form is invalid
    const isDisabled = await signupForm.submitButton.locator('button').isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('submit button becomes enabled after filling required fields', async () => {
    await signupForm.fillName('Test User');
    await signupForm.fillEmail('test@example.com');

    // After filling required fields, button should be enabled
    const isDisabled = await signupForm.submitButton.locator('button').isDisabled();
    expect(isDisabled).toBe(false);
  });
});

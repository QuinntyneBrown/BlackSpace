import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SignupFormContainerComponent } from './signup-form-container.component';

describe('SignupFormContainerComponent', () => {
  let component: SignupFormContainerComponent;
  let fixture: ComponentFixture<SignupFormContainerComponent>;
  let httpTesting: HttpTestingController;

  const baseUrl = 'http://localhost:5000';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupFormContainerComponent, ReactiveFormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SignupFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Flush the referral sources request from ngOnInit
    const refReq = httpTesting.expectOne(`${baseUrl}/api/content/referral-sources`);
    refReq.flush(['LinkedIn', 'Twitter', 'Friend']);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch referral sources on init', () => {
    expect(component.referralSources()).toEqual(['LinkedIn', 'Twitter', 'Friend']);
  });

  it('should have formState as form initially', () => {
    expect(component.formState()).toBe('form');
  });

  it('should have a form with 5 controls', () => {
    const controls = Object.keys(component.signupForm.controls);
    expect(controls.length).toBe(5);
    expect(controls).toContain('fullName');
    expect(controls).toContain('email');
    expect(controls).toContain('roleTitle');
    expect(controls).toContain('organization');
    expect(controls).toContain('referralSource');
  });

  it('should render 5 form input fields', () => {
    const formInputs = fixture.nativeElement.querySelectorAll('lib-form-input');
    expect(formInputs.length).toBe(5);
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    httpTesting.expectNone(`${baseUrl}/api/members`);
  });

  it('should require fullName', () => {
    const control = component.signupForm.controls.fullName;
    expect(control.valid).toBe(false);
    control.setValue('Jane Doe');
    expect(control.valid).toBe(true);
  });

  it('should require email', () => {
    const control = component.signupForm.controls.email;
    expect(control.valid).toBe(false);
    control.setValue('jane@example.com');
    expect(control.valid).toBe(true);
  });

  it('should validate email format', () => {
    const control = component.signupForm.controls.email;
    control.setValue('not-an-email');
    expect(control.valid).toBe(false);
    control.setValue('jane@example.com');
    expect(control.valid).toBe(true);
  });

  describe('successful submission', () => {
    beforeEach(() => {
      component.signupForm.controls.fullName.setValue('Jane Doe');
      component.signupForm.controls.email.setValue('jane@example.com');
      component.signupForm.controls.roleTitle.setValue('Engineer');
      component.signupForm.controls.organization.setValue('MDA');
      component.signupForm.controls.referralSource.setValue('LinkedIn');
    });

    it('should show loading state during API call', () => {
      expect(component.isLoading()).toBe(false);
      component.onSubmit();
      expect(component.isLoading()).toBe(true);

      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush({
        id: '123',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        createdAtUtc: '2026-01-15T10:30:00Z',
      });
      expect(component.isLoading()).toBe(false);
    });

    it('should switch to success state on 201', () => {
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        {
          id: '123',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          createdAtUtc: '2026-01-15T10:30:00Z',
        },
        { status: 201, statusText: 'Created' },
      );

      expect(component.formState()).toBe('success');
    });

    it('should render success state component after successful submission', () => {
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush({
        id: '123',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        createdAtUtc: '2026-01-15T10:30:00Z',
      });
      fixture.detectChanges();

      const successState = fixture.nativeElement.querySelector('lib-success-state');
      expect(successState).toBeTruthy();
    });

    it('should send correct request body', () => {
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      expect(req.request.body).toEqual({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        roleTitle: 'Engineer',
        organization: 'MDA',
        referralSource: 'LinkedIn',
      });
      req.flush({
        id: '123',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        createdAtUtc: '2026-01-15T10:30:00Z',
      });
    });

    it('should omit optional fields when empty', () => {
      component.signupForm.controls.roleTitle.setValue('');
      component.signupForm.controls.organization.setValue('');
      component.signupForm.controls.referralSource.setValue('');
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      expect(req.request.body).toEqual({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      });
      req.flush({
        id: '123',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        createdAtUtc: '2026-01-15T10:30:00Z',
      });
    });
  });

  describe('409 conflict error', () => {
    beforeEach(() => {
      component.signupForm.controls.fullName.setValue('Jane Doe');
      component.signupForm.controls.email.setValue('jane@example.com');
    });

    it('should show alert banner on duplicate email', () => {
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        { error: 'already_registered', message: 'This email is already part of the community.' },
        { status: 409, statusText: 'Conflict' },
      );

      expect(component.alertMessage()).toBe('This email is already registered in our community.');
    });

    it('should show warning toast on duplicate email', () => {
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        { error: 'already_registered', message: 'This email is already part of the community.' },
        { status: 409, statusText: 'Conflict' },
      );

      expect(component.toastVisible()).toBe(true);
      expect(component.toastType()).toBe('warning');
      expect(component.toastTitle()).toBe('Already Registered');
    });

    it('should render alert banner in template', () => {
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        { error: 'already_registered', message: 'Already registered' },
        { status: 409, statusText: 'Conflict' },
      );
      fixture.detectChanges();

      const alertBanner = fixture.nativeElement.querySelector('lib-alert-banner');
      expect(alertBanner).toBeTruthy();
    });

    it('should stop loading on 409 error', () => {
      component.onSubmit();
      expect(component.isLoading()).toBe(true);

      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        { error: 'already_registered', message: 'Already registered' },
        { status: 409, statusText: 'Conflict' },
      );

      expect(component.isLoading()).toBe(false);
    });
  });

  describe('422 validation error', () => {
    beforeEach(() => {
      component.signupForm.controls.fullName.setValue('Jane Doe');
      component.signupForm.controls.email.setValue('jane@example.com');
    });

    it('should map server errors to field error messages', () => {
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        {
          error: 'validation_failed',
          message: 'Please fix the errors below.',
          errors: {
            email: ['Invalid email format'],
            fullName: ['Name is too short'],
          },
        },
        { status: 422, statusText: 'Unprocessable Entity' },
      );

      expect(component.fieldError('email')).toBe('Invalid email format');
      expect(component.fieldError('fullName')).toBe('Name is too short');
    });

    it('should return empty string for fields without errors', () => {
      expect(component.fieldError('nonexistent')).toBe('');
    });

    it('should stop loading on 422 error', () => {
      component.onSubmit();
      expect(component.isLoading()).toBe(true);

      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        {
          error: 'validation_failed',
          message: 'Errors',
          errors: { email: ['Bad'] },
        },
        { status: 422, statusText: 'Unprocessable Entity' },
      );

      expect(component.isLoading()).toBe(false);
    });
  });

  describe('network error', () => {
    beforeEach(() => {
      component.signupForm.controls.fullName.setValue('Jane Doe');
      component.signupForm.controls.email.setValue('jane@example.com');
    });

    it('should show error toast on network error', () => {
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

      expect(component.toastVisible()).toBe(true);
      expect(component.toastType()).toBe('error');
      expect(component.toastTitle()).toBe('Network Error');
    });

    it('should stop loading on network error', () => {
      component.onSubmit();
      expect(component.isLoading()).toBe(true);

      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

      expect(component.isLoading()).toBe(false);
    });
  });

  describe('toast', () => {
    it('should hide toast on close', () => {
      component.onSubmit();
      // Need valid form
      component.signupForm.controls.fullName.setValue('Jane');
      component.signupForm.controls.email.setValue('j@e.com');
      component.onSubmit();
      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

      expect(component.toastVisible()).toBe(true);
      component.onToastClosed();
      expect(component.toastVisible()).toBe(false);
    });
  });

  describe('prevent duplicate submit', () => {
    it('should not submit while already loading', () => {
      component.signupForm.controls.fullName.setValue('Jane');
      component.signupForm.controls.email.setValue('j@e.com');
      component.onSubmit();
      expect(component.isLoading()).toBe(true);

      // Try again while still loading
      component.onSubmit();

      // Should only have one request
      const requests = httpTesting.match(`${baseUrl}/api/members`);
      expect(requests.length).toBe(1);
      requests[0].flush({
        id: '1',
        fullName: 'Jane',
        email: 'j@e.com',
        createdAtUtc: '2026-01-01',
      });
    });
  });

  describe('clearing state between submissions', () => {
    it('should clear alert message on new submission', () => {
      component.signupForm.controls.fullName.setValue('Jane');
      component.signupForm.controls.email.setValue('j@e.com');

      // First submit: trigger 409
      component.onSubmit();
      let req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        { error: 'already_registered', message: 'Dup' },
        { status: 409, statusText: 'Conflict' },
      );
      expect(component.alertMessage()).toBeTruthy();

      // Second submit: alert should be cleared
      component.onSubmit();
      expect(component.alertMessage()).toBe('');
      req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush({
        id: '1',
        fullName: 'Jane',
        email: 'j@e.com',
        createdAtUtc: '2026-01-01',
      });
    });

    it('should clear field errors on new submission', () => {
      component.signupForm.controls.fullName.setValue('Jane');
      component.signupForm.controls.email.setValue('j@e.com');

      // First: trigger 422
      component.onSubmit();
      let req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        { error: 'validation_failed', message: 'Err', errors: { email: ['Bad'] } },
        { status: 422, statusText: 'Unprocessable Entity' },
      );
      expect(component.fieldError('email')).toBe('Bad');

      // Second: errors should clear
      component.onSubmit();
      expect(component.fieldError('email')).toBe('');
      req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush({
        id: '1',
        fullName: 'Jane',
        email: 'j@e.com',
        createdAtUtc: '2026-01-01',
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MemberEditDialogComponent, MemberEditDialogData } from './member-edit-dialog.component';

describe('MemberEditDialogComponent', () => {
  const baseUrl = 'http://localhost:5000';

  function setup(data: MemberEditDialogData) {
    const dialogRefSpy = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [MemberEditDialogComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    });

    const httpTesting = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(MemberEditDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // Flush referral sources request from ngOnInit
    const refReq = httpTesting.expectOne(`${baseUrl}/api/admin/content/referral-sources`);
    refReq.flush({ sources: ['LinkedIn', 'Twitter', 'Friend'] });
    fixture.detectChanges();

    return { fixture, component, httpTesting, dialogRefSpy };
  }

  describe('create mode', () => {
    let fixture: ComponentFixture<MemberEditDialogComponent>;
    let component: MemberEditDialogComponent;
    let httpTesting: HttpTestingController;
    let dialogRefSpy: { close: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      const result = setup({ mode: 'create' });
      fixture = result.fixture;
      component = result.component;
      httpTesting = result.httpTesting;
      dialogRefSpy = result.dialogRefSpy;
    });

    afterEach(() => {
      httpTesting.verify();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have title "Add Member"', () => {
      expect(component.title).toBe('Add Member');
    });

    it('should load referral sources on init', () => {
      expect(component.referralSources()).toEqual(['LinkedIn', 'Twitter', 'Friend']);
    });

    it('should have 5 form controls', () => {
      const controls = Object.keys(component.form.controls);
      expect(controls.length).toBe(5);
      expect(controls).toContain('fullName');
      expect(controls).toContain('email');
      expect(controls).toContain('roleTitle');
      expect(controls).toContain('organization');
      expect(controls).toContain('referralSource');
    });

    it('should require fullName', () => {
      expect(component.form.controls.fullName.valid).toBe(false);
      component.form.controls.fullName.setValue('Jane Doe');
      expect(component.form.controls.fullName.valid).toBe(true);
    });

    it('should require email', () => {
      expect(component.form.controls.email.valid).toBe(false);
      component.form.controls.email.setValue('jane@example.com');
      expect(component.form.controls.email.valid).toBe(true);
    });

    it('should validate email format', () => {
      component.form.controls.email.setValue('not-email');
      expect(component.form.controls.email.valid).toBe(false);
    });

    it('should not submit when form is invalid', () => {
      component.onSave();
      httpTesting.expectNone(`${baseUrl}/api/members`);
    });

    it('should mark all controls as touched when form is invalid', () => {
      component.onSave();
      expect(component.form.controls.fullName.touched).toBe(true);
      expect(component.form.controls.email.touched).toBe(true);
    });

    it('should call MemberService.createMember on save in create mode', () => {
      component.form.controls.fullName.setValue('Jane Doe');
      component.form.controls.email.setValue('jane@example.com');
      component.form.controls.roleTitle.setValue('Engineer');
      component.form.controls.organization.setValue('MDA');
      component.form.controls.referralSource.setValue('LinkedIn');

      component.onSave();
      expect(component.saving()).toBe(true);

      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      expect(req.request.method).toBe('POST');
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

      expect(component.saving()).toBe(false);
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        id: '123',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        createdAtUtc: '2026-01-15T10:30:00Z',
      });
    });

    it('should omit optional fields when empty', () => {
      component.form.controls.fullName.setValue('Jane Doe');
      component.form.controls.email.setValue('jane@example.com');

      component.onSave();

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

    it('should handle 422 validation errors', () => {
      component.form.controls.fullName.setValue('Jane Doe');
      component.form.controls.email.setValue('jane@example.com');

      component.onSave();

      const req = httpTesting.expectOne(`${baseUrl}/api/members`);
      req.flush(
        {
          error: 'validation_failed',
          message: 'Errors',
          errors: { email: ['Email already in use'], fullName: ['Name too short'] },
        },
        { status: 422, statusText: 'Unprocessable Entity' },
      );

      expect(component.saving()).toBe(false);
      expect(component.fieldError('email')).toBe('Email already in use');
      expect(component.fieldError('fullName')).toBe('Name too short');
    });

    it('should return empty string for fields without errors', () => {
      expect(component.fieldError('nonexistent')).toBe('');
    });

    it('should close dialog with undefined on cancel', () => {
      component.onCancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(undefined);
    });

    it('should render form fields', () => {
      const formFields = fixture.nativeElement.querySelectorAll('mat-form-field');
      expect(formFields.length).toBe(5);
    });

    it('should render dialog title', () => {
      const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
      expect(title.textContent).toContain('Add Member');
    });

    it('should render save and cancel buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const buttonTexts = Array.from(buttons).map((b: unknown) => (b as HTMLElement).textContent?.trim());
      expect(buttonTexts).toContain('Cancel');
      expect(buttonTexts.some((t: string | undefined) => t?.includes('Save'))).toBe(true);
    });
  });

  describe('edit mode', () => {
    let fixture: ComponentFixture<MemberEditDialogComponent>;
    let component: MemberEditDialogComponent;
    let httpTesting: HttpTestingController;
    let dialogRefSpy: { close: ReturnType<typeof vi.fn> };

    const existingMember = {
      id: '456',
      fullName: 'John Smith',
      email: 'john@example.com',
      roleTitle: 'Manager',
      organization: 'SpaceX',
      createdAtUtc: '2026-01-01T00:00:00Z',
    };

    beforeEach(() => {
      const result = setup({ mode: 'edit', member: existingMember });
      fixture = result.fixture;
      component = result.component;
      httpTesting = result.httpTesting;
      dialogRefSpy = result.dialogRefSpy;
    });

    afterEach(() => {
      httpTesting.verify();
    });

    it('should have title "Edit Member"', () => {
      expect(component.title).toBe('Edit Member');
    });

    it('should pre-populate form with member data', () => {
      expect(component.form.controls.fullName.value).toBe('John Smith');
      expect(component.form.controls.email.value).toBe('john@example.com');
      expect(component.form.controls.roleTitle.value).toBe('Manager');
      expect(component.form.controls.organization.value).toBe('SpaceX');
    });

    it('should call AdminMemberService.updateMember on save in edit mode', () => {
      component.form.controls.fullName.setValue('John Updated');

      component.onSave();

      const req = httpTesting.expectOne(`${baseUrl}/api/admin/members/456`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.fullName).toBe('John Updated');

      req.flush({
        id: '456',
        fullName: 'John Updated',
        email: 'john@example.com',
        createdAtUtc: '2026-01-01T00:00:00Z',
      });

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        id: '456',
        fullName: 'John Updated',
        email: 'john@example.com',
        createdAtUtc: '2026-01-01T00:00:00Z',
      });
    });

    it('should handle update errors with 422', () => {
      component.onSave();

      const req = httpTesting.expectOne(`${baseUrl}/api/admin/members/456`);
      req.flush(
        {
          error: 'validation_failed',
          message: 'Errors',
          errors: { email: ['Invalid email'] },
        },
        { status: 422, statusText: 'Unprocessable Entity' },
      );

      expect(component.saving()).toBe(false);
      expect(component.fieldError('email')).toBe('Invalid email');
    });

    it('should render dialog title as Edit Member', () => {
      const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
      expect(title.textContent).toContain('Edit Member');
    });
  });
});

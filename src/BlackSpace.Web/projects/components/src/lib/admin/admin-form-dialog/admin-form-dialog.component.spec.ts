import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AdminFormDialogComponent,
  AdminFormDialogData,
  FormFieldConfig,
} from './admin-form-dialog.component';

describe('AdminFormDialogComponent', () => {
  let fixture: ComponentFixture<AdminFormDialogComponent>;
  let component: AdminFormDialogComponent;
  let dialogRefSpy: { close: ReturnType<typeof vi.fn> };

  const defaultFields: FormFieldConfig[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: false },
  ];

  function createComponent(data: Partial<AdminFormDialogData> = {}) {
    const dialogData: AdminFormDialogData = {
      title: data.title ?? 'Test Dialog',
      fields: data.fields ?? defaultFields,
      initialValues: data.initialValues,
    };

    dialogRefSpy = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AdminFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    createComponent({ title: 'Add User' });
    const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
    expect(title.textContent).toContain('Add User');
  });

  it('should render fields from config', () => {
    createComponent();
    const formFields = fixture.nativeElement.querySelectorAll('mat-form-field');
    expect(formFields.length).toBe(2);
  });

  it('should create form controls from fields config', () => {
    createComponent();
    expect(component.form.contains('name')).toBe(true);
    expect(component.form.contains('email')).toBe(true);
  });

  it('should populate initial values', () => {
    createComponent({ initialValues: { name: 'Alice', email: 'alice@test.com' } });
    expect(component.form.get('name')?.value).toBe('Alice');
    expect(component.form.get('email')?.value).toBe('alice@test.com');
  });

  it('should use empty string as default value when no initial value', () => {
    createComponent();
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
  });

  it('should validate required fields', () => {
    createComponent();
    const nameControl = component.form.get('name');
    expect(nameControl?.valid).toBe(false);
    nameControl?.setValue('Test');
    expect(nameControl?.valid).toBe(true);
  });

  it('should not require non-required fields', () => {
    createComponent();
    const emailControl = component.form.get('email');
    expect(emailControl?.valid).toBe(true);
  });

  it('should close dialog with form values on save when valid', () => {
    createComponent();
    component.form.get('name')?.setValue('Alice');
    component.form.get('email')?.setValue('alice@test.com');
    component.onSave();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ name: 'Alice', email: 'alice@test.com' });
  });

  it('should not close dialog on save when form is invalid', () => {
    createComponent();
    component.onSave();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched on invalid save attempt', () => {
    createComponent();
    component.onSave();
    expect(component.form.get('name')?.touched).toBe(true);
  });

  it('should close dialog with undefined on cancel', () => {
    createComponent();
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(undefined);
  });

  it('should render select field type', () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        required: true,
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
        ],
      },
    ];
    createComponent({ fields });
    const select = fixture.nativeElement.querySelector('mat-select');
    expect(select).toBeTruthy();
  });

  it('should render textarea field type', () => {
    const fields: FormFieldConfig[] = [
      { name: 'bio', label: 'Bio', type: 'textarea', required: false },
    ];
    createComponent({ fields });
    const textarea = fixture.nativeElement.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });

  it('should show error message for required field when touched and empty', () => {
    createComponent();
    const nameControl = component.form.get('name');
    nameControl?.markAsTouched();
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('mat-error');
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Name is required');
  });

  it('should render cancel and save buttons', () => {
    createComponent();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const buttonTexts = Array.from(buttons).map((b: any) => b.textContent.trim());
    expect(buttonTexts).toContain('Cancel');
    expect(buttonTexts).toContain('Save');
  });

  it('should show error for required select field when touched and empty', () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        required: true,
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
        ],
      },
    ];
    createComponent({ fields });
    const roleControl = component.form.get('role');
    roleControl?.markAsTouched();
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('mat-error');
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Role is required');
  });

  it('should show error for required textarea field when touched and empty', () => {
    const fields: FormFieldConfig[] = [
      { name: 'bio', label: 'Bio', type: 'textarea', required: true },
    ];
    createComponent({ fields });
    const bioControl = component.form.get('bio');
    bioControl?.markAsTouched();
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('mat-error');
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Bio is required');
  });
});

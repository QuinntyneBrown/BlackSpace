import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AdminConfirmDialogComponent,
  AdminConfirmDialogData,
} from './admin-confirm-dialog.component';

describe('AdminConfirmDialogComponent', () => {
  let fixture: ComponentFixture<AdminConfirmDialogComponent>;
  let component: AdminConfirmDialogComponent;
  let dialogRefSpy: { close: ReturnType<typeof vi.fn> };

  function createComponent(data: Partial<AdminConfirmDialogData> = {}) {
    const dialogData: AdminConfirmDialogData = {
      title: data.title ?? 'Confirm Action',
      message: data.message ?? 'Are you sure?',
      confirmLabel: data.confirmLabel,
      cancelLabel: data.cancelLabel,
      confirmColor: data.confirmColor,
    };

    dialogRefSpy = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AdminConfirmDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    createComponent({ title: 'Delete Item?' });
    const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
    expect(title.textContent).toContain('Delete Item?');
  });

  it('should display message', () => {
    createComponent({ message: 'This cannot be undone.' });
    const message = fixture.nativeElement.querySelector('.message');
    expect(message.textContent).toContain('This cannot be undone.');
  });

  it('should use default confirm label', () => {
    createComponent();
    expect(component.confirmLabel).toBe('Confirm');
  });

  it('should use custom confirm label', () => {
    createComponent({ confirmLabel: 'Delete' });
    expect(component.confirmLabel).toBe('Delete');
  });

  it('should use default cancel label', () => {
    createComponent();
    expect(component.cancelLabel).toBe('Cancel');
  });

  it('should use custom cancel label', () => {
    createComponent({ cancelLabel: 'Go Back' });
    expect(component.cancelLabel).toBe('Go Back');
  });

  it('should use default confirm color', () => {
    createComponent();
    expect(component.confirmColor).toBe('primary');
  });

  it('should use warn confirm color', () => {
    createComponent({ confirmColor: 'warn' });
    expect(component.confirmColor).toBe('warn');
  });

  it('should close dialog with true on confirm', () => {
    createComponent();
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false on cancel', () => {
    createComponent();
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should render confirm button with correct label', () => {
    createComponent({ confirmLabel: 'Yes, Delete' });
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const confirmBtn = Array.from(buttons).find((b: any) =>
      b.textContent.includes('Yes, Delete'),
    );
    expect(confirmBtn).toBeTruthy();
  });

  it('should render cancel button with correct label', () => {
    createComponent({ cancelLabel: 'Nope' });
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const cancelBtn = Array.from(buttons).find((b: any) => b.textContent.includes('Nope'));
    expect(cancelBtn).toBeTruthy();
  });
});

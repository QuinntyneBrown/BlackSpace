import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();
  });

  function createComponent(overrides: {
    title?: string;
    body?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: 'danger' | 'primary';
    isOpen?: boolean;
  } = {}) {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', overrides.title ?? 'Are you sure?');
    fixture.componentRef.setInput('body', overrides.body ?? 'This action cannot be undone.');
    if (overrides.confirmLabel !== undefined) fixture.componentRef.setInput('confirmLabel', overrides.confirmLabel);
    if (overrides.cancelLabel !== undefined) fixture.componentRef.setInput('cancelLabel', overrides.cancelLabel);
    if (overrides.confirmVariant !== undefined) fixture.componentRef.setInput('confirmVariant', overrides.confirmVariant);
    if (overrides.isOpen !== undefined) fixture.componentRef.setInput('isOpen', overrides.isOpen);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should not render when isOpen is false', () => {
    createComponent({ isOpen: false });
    const backdrop = fixture.nativeElement.querySelector('.backdrop');
    expect(backdrop).toBeFalsy();
  });

  it('should render when isOpen is true', () => {
    createComponent({ isOpen: true });
    const backdrop = fixture.nativeElement.querySelector('.backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('should display title', () => {
    createComponent({ isOpen: true, title: 'Delete item?' });
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Delete item?');
  });

  it('should display body', () => {
    createComponent({ isOpen: true, body: 'This will remove the item.' });
    const body = fixture.nativeElement.querySelector('.body');
    expect(body.textContent).toContain('This will remove the item.');
  });

  it('should display default confirm label', () => {
    createComponent({ isOpen: true });
    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    expect(confirmBtn.textContent).toContain('Confirm');
  });

  it('should display custom confirm label', () => {
    createComponent({ isOpen: true, confirmLabel: 'Delete' });
    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    expect(confirmBtn.textContent).toContain('Delete');
  });

  it('should display default cancel label', () => {
    createComponent({ isOpen: true });
    const cancelBtn = fixture.nativeElement.querySelector('.btn-cancel');
    expect(cancelBtn.textContent).toContain('Cancel');
  });

  it('should display custom cancel label', () => {
    createComponent({ isOpen: true, cancelLabel: 'Nevermind' });
    const cancelBtn = fixture.nativeElement.querySelector('.btn-cancel');
    expect(cancelBtn.textContent).toContain('Nevermind');
  });

  it('should apply danger class when confirmVariant is danger', () => {
    createComponent({ isOpen: true, confirmVariant: 'danger' });
    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    expect(confirmBtn.classList.contains('danger')).toBe(true);
  });

  it('should not apply danger class when confirmVariant is primary', () => {
    createComponent({ isOpen: true, confirmVariant: 'primary' });
    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    expect(confirmBtn.classList.contains('danger')).toBe(false);
  });

  it('should emit confirmed when confirm button clicked', () => {
    createComponent({ isOpen: true });
    const spy = vi.fn();
    component.confirmed.subscribe(spy);
    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    confirmBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancelled when cancel button clicked', () => {
    createComponent({ isOpen: true });
    const spy = vi.fn();
    component.cancelled.subscribe(spy);
    const cancelBtn = fixture.nativeElement.querySelector('.btn-cancel');
    cancelBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancelled when backdrop clicked', () => {
    createComponent({ isOpen: true });
    const spy = vi.fn();
    component.cancelled.subscribe(spy);
    const backdrop = fixture.nativeElement.querySelector('.backdrop');
    backdrop.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit cancelled when dialog content clicked', () => {
    createComponent({ isOpen: true });
    const spy = vi.fn();
    component.cancelled.subscribe(spy);
    const dialog = fixture.nativeElement.querySelector('.dialog');
    dialog.click();
    expect(spy).not.toHaveBeenCalled();
  });
});

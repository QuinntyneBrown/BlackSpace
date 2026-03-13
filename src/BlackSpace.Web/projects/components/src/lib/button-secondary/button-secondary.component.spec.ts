import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonSecondaryComponent } from './button-secondary.component';

describe('ButtonSecondaryComponent', () => {
  let fixture: ComponentFixture<ButtonSecondaryComponent>;
  let component: ButtonSecondaryComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSecondaryComponent],
    }).compileComponents();
  });

  function createComponent(overrides: { label?: string; disabled?: boolean; loading?: boolean; type?: 'button' | 'submit' } = {}) {
    fixture = TestBed.createComponent(ButtonSecondaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', overrides.label ?? 'Click me');
    if (overrides.disabled !== undefined) fixture.componentRef.setInput('disabled', overrides.disabled);
    if (overrides.loading !== undefined) fixture.componentRef.setInput('loading', overrides.loading);
    if (overrides.type !== undefined) fixture.componentRef.setInput('type', overrides.type);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display the label', () => {
    createComponent({ label: 'Learn More' });
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.textContent?.trim()).toBe('Learn More');
  });

  it('should default to type button', () => {
    createComponent();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.type).toBe('button');
  });

  it('should set type to submit when configured', () => {
    createComponent({ type: 'submit' });
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.type).toBe('submit');
  });

  it('should emit clicked on click', () => {
    createComponent();
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit clicked when disabled', () => {
    createComponent({ disabled: true });
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.onClick();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit clicked when loading', () => {
    createComponent({ loading: true });
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.onClick();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should have loading class when loading', () => {
    createComponent({ loading: true });
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('loading')).toBe(true);
  });

  it('should have disabled class when disabled', () => {
    createComponent({ disabled: true });
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('disabled')).toBe(true);
  });

  it('should show spinner when loading', () => {
    createComponent({ loading: true });
    const spinner = fixture.nativeElement.querySelector('.spinner');
    expect(spinner).toBeTruthy();
  });

  it('should not show spinner when not loading', () => {
    createComponent({ loading: false });
    const spinner = fixture.nativeElement.querySelector('.spinner');
    expect(spinner).toBeFalsy();
  });

  it('should set button disabled attribute when disabled', () => {
    createComponent({ disabled: true });
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(true);
  });
});

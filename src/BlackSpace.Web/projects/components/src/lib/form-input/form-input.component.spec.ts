import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInputComponent } from './form-input.component';

describe('FormInputComponent', () => {
  let fixture: ComponentFixture<FormInputComponent>;
  let component: FormInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputComponent],
    }).compileComponents();
  });

  function createComponent(overrides: {
    label?: string;
    placeholder?: string;
    errorMessage?: string;
    required?: boolean;
    fieldType?: 'text' | 'email' | 'select';
    selectOptions?: string[];
  } = {}) {
    fixture = TestBed.createComponent(FormInputComponent);
    component = fixture.componentInstance;
    if (overrides.label !== undefined) fixture.componentRef.setInput('label', overrides.label);
    if (overrides.placeholder !== undefined) fixture.componentRef.setInput('placeholder', overrides.placeholder);
    if (overrides.errorMessage !== undefined) fixture.componentRef.setInput('errorMessage', overrides.errorMessage);
    if (overrides.required !== undefined) fixture.componentRef.setInput('required', overrides.required);
    if (overrides.fieldType !== undefined) fixture.componentRef.setInput('fieldType', overrides.fieldType);
    if (overrides.selectOptions !== undefined) fixture.componentRef.setInput('selectOptions', overrides.selectOptions);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    createComponent({ label: 'Email' });
    const label = fixture.nativeElement.querySelector('.field-label');
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Email');
  });

  it('should not render label when empty', () => {
    createComponent({ label: '' });
    const label = fixture.nativeElement.querySelector('.field-label');
    expect(label).toBeFalsy();
  });

  it('should show required asterisk when required', () => {
    createComponent({ label: 'Name', required: true });
    const required = fixture.nativeElement.querySelector('.required');
    expect(required).toBeTruthy();
    expect(required.textContent).toBe('*');
  });

  it('should not show required asterisk when not required', () => {
    createComponent({ label: 'Name', required: false });
    const required = fixture.nativeElement.querySelector('.required');
    expect(required).toBeFalsy();
  });

  it('should render text input by default', () => {
    createComponent();
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
    expect(input.type).toBe('text');
  });

  it('should render email input when fieldType is email', () => {
    createComponent({ fieldType: 'email' });
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
    expect(input.type).toBe('email');
  });

  it('should render select when fieldType is select', () => {
    createComponent({ fieldType: 'select', selectOptions: ['A', 'B', 'C'] });
    const select = fixture.nativeElement.querySelector('select');
    expect(select).toBeTruthy();
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(3);
  });

  it('should render select with placeholder option', () => {
    createComponent({ fieldType: 'select', selectOptions: ['A', 'B'], placeholder: 'Choose one' });
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(3);
    expect(options[0].textContent).toContain('Choose one');
    expect(options[0].disabled).toBe(true);
  });

  it('should set placeholder on input', () => {
    createComponent({ placeholder: 'Enter text' });
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Enter text');
  });

  it('should show error message when provided', () => {
    createComponent({ errorMessage: 'Required field' });
    const error = fixture.nativeElement.querySelector('.error-message');
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Required field');
  });

  it('should not show error message when empty', () => {
    createComponent({ errorMessage: '' });
    const error = fixture.nativeElement.querySelector('.error-message');
    expect(error).toBeFalsy();
  });

  it('should apply has-error class when error message is present', () => {
    createComponent({ errorMessage: 'Error' });
    const input = fixture.nativeElement.querySelector('.field-control');
    expect(input.classList.contains('has-error')).toBe(true);
  });

  it('should not apply has-error class when no error', () => {
    createComponent();
    const input = fixture.nativeElement.querySelector('.field-control');
    expect(input.classList.contains('has-error')).toBe(false);
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      createComponent();
      component.writeValue('test');
      expect(component.value).toBe('test');
    });

    it('should handle null in writeValue', () => {
      createComponent();
      component.writeValue(null as unknown as string);
      expect(component.value).toBe('');
    });

    it('should register onChange', () => {
      createComponent();
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange('test');
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched', () => {
      createComponent();
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouched();
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      createComponent();
      component.setDisabledState(true);
      expect(component.isDisabled).toBe(true);
      component.setDisabledState(false);
      expect(component.isDisabled).toBe(false);
    });

    it('should call onChange on input change', () => {
      createComponent();
      const fn = vi.fn();
      component.registerOnChange(fn);
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'hello';
      input.dispatchEvent(new Event('input'));
      expect(fn).toHaveBeenCalledWith('hello');
    });

    it('should call onChange on select change', () => {
      createComponent({ fieldType: 'select', selectOptions: ['A', 'B'] });
      const fn = vi.fn();
      component.registerOnChange(fn);
      const select = fixture.nativeElement.querySelector('select');
      select.value = 'B';
      select.dispatchEvent(new Event('change'));
      expect(fn).toHaveBeenCalledWith('B');
    });

    it('should call onTouched on blur for input', () => {
      createComponent();
      const fn = vi.fn();
      component.registerOnTouched(fn);
      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new Event('blur'));
      expect(fn).toHaveBeenCalled();
    });

    it('should call onTouched on blur for select', () => {
      createComponent({ fieldType: 'select', selectOptions: ['A'] });
      const fn = vi.fn();
      component.registerOnTouched(fn);
      const select = fixture.nativeElement.querySelector('select');
      select.dispatchEvent(new Event('blur'));
      expect(fn).toHaveBeenCalled();
    });
  });
});

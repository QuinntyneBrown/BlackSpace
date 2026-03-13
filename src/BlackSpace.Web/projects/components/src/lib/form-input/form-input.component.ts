import { Component, input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'lib-form-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
  template: `
    @if (label()) {
      <label class="field-label">
        {{ label() }}
        @if (required()) {
          <span class="required">*</span>
        }
      </label>
    }
    @if (fieldType() === 'select') {
      <select
        class="field-control"
        [class.has-error]="!!errorMessage()"
        [disabled]="isDisabled"
        [value]="value"
        (change)="onSelectChange($event)"
        (blur)="onTouched()"
      >
        @if (placeholder()) {
          <option value="" disabled [selected]="!value">{{ placeholder() }}</option>
        }
        @for (option of selectOptions(); track option) {
          <option [value]="option">{{ option }}</option>
        }
      </select>
    } @else {
      <input
        class="field-control"
        [class.has-error]="!!errorMessage()"
        [type]="fieldType()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled"
        [value]="value"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
      />
    }
    @if (errorMessage()) {
      <span class="error-message">{{ errorMessage() }}</span>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .field-label {
      display: block;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #8A8A9A;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .required {
      color: #FF3B30;
    }
    .field-control {
      width: 100%;
      background: #0F1019;
      border: 1px solid #2A2A3A;
      border-radius: 8px;
      padding: 14px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      color: #FFFFFF;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }
    .field-control::placeholder {
      color: #52526A;
    }
    .field-control:focus {
      border-color: #4F9CF7;
    }
    .field-control.has-error {
      border-color: #FF3B30;
    }
    select.field-control {
      cursor: pointer;
    }
    .error-message {
      display: block;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #FF3B30;
      margin-top: 6px;
    }
  `,
})
export class FormInputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  errorMessage = input<string>('');
  required = input<boolean>(false);
  fieldType = input<'text' | 'email' | 'select'>('text');
  selectOptions = input<string[]>([]);

  value = '';
  isDisabled = false;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }
}

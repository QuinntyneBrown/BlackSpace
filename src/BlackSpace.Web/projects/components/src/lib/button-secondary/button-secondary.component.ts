import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-button-secondary',
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class.loading]="loading()"
      [class.disabled]="disabled()"
      (click)="onClick()"
    >
      @if (loading()) {
        <span class="spinner"></span>
      }
      {{ label() }}
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }
    button {
      background: transparent;
      color: #FFFFFF;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 500;
      border: 1px solid #FFFFFF30;
      border-radius: 8px;
      padding: 16px 32px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: opacity 0.2s;
    }
    button:hover:not(:disabled) {
      opacity: 0.9;
    }
    button.loading {
      opacity: 0.7;
      cursor: wait;
    }
    button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #FFFFFF40;
      border-top-color: #FFFFFF;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
})
export class ButtonSecondaryComponent {
  label = input.required<string>();
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<'button' | 'submit'>('button');

  clicked = output<void>();

  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}

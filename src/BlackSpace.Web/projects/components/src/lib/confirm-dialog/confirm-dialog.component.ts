import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-confirm-dialog',
  template: `
    @if (isOpen()) {
      <div class="backdrop" (click)="onCancel()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h2 class="title">{{ title() }}</h2>
          <p class="body">{{ body() }}</p>
          <div class="actions">
            <button class="btn-cancel" (click)="onCancel()">{{ cancelLabel() }}</button>
            <button
              class="btn-confirm"
              [class.danger]="confirmVariant() === 'danger'"
              (click)="onConfirm()"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #00000080;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog {
      background: #0D0E18;
      border: 1px solid #1A1A2E;
      border-radius: 16px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 480px;
      width: 100%;
    }
    .title {
      font-family: 'Sora', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
    }
    .body {
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 400;
      color: #8A8A9A;
      line-height: 1.6;
      margin: 0;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn-cancel {
      background: transparent;
      color: #FFFFFF;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #FFFFFF30;
      border-radius: 8px;
      padding: 10px 20px;
      cursor: pointer;
    }
    .btn-confirm {
      background: #4F9CF7;
      color: #FFFFFF;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      cursor: pointer;
    }
    .btn-confirm.danger {
      background: #FF3B30;
    }
  `,
})
export class ConfirmDialogComponent {
  title = input.required<string>();
  body = input.required<string>();
  confirmLabel = input<string>('Confirm');
  cancelLabel = input<string>('Cancel');
  confirmVariant = input<'danger' | 'primary'>('primary');
  isOpen = input<boolean>(false);

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

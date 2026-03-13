import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
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

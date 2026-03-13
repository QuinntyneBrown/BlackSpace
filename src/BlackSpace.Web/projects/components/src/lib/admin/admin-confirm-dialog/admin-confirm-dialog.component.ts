import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface AdminConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: 'primary' | 'warn';
}

@Component({
  selector: 'lib-admin-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './admin-confirm-dialog.component.html',
  styleUrl: './admin-confirm-dialog.component.scss',
})
export class AdminConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AdminConfirmDialogComponent>);
  readonly dialogData: AdminConfirmDialogData = inject(MAT_DIALOG_DATA);

  get confirmLabel(): string {
    return this.dialogData.confirmLabel ?? 'Confirm';
  }

  get cancelLabel(): string {
    return this.dialogData.cancelLabel ?? 'Cancel';
  }

  get confirmColor(): 'primary' | 'warn' {
    return this.dialogData.confirmColor ?? 'primary';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

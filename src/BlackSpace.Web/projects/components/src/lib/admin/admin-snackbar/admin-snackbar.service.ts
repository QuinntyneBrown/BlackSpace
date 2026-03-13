import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AdminSnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  showSuccess(message: string): void {
    this.open(message, { panelClass: ['admin-snackbar-success'] });
  }

  showError(message: string): void {
    this.open(message, { panelClass: ['admin-snackbar-error'] });
  }

  showInfo(message: string): void {
    this.open(message, { panelClass: ['admin-snackbar-info'] });
  }

  private open(message: string, config: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      ...config,
    });
  }
}

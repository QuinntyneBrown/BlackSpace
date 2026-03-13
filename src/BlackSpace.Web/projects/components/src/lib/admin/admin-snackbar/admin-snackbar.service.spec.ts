import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminSnackbarService } from './admin-snackbar.service';

describe('AdminSnackbarService', () => {
  let service: AdminSnackbarService;
  let snackBarSpy: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    snackBarSpy = { open: vi.fn() };

    TestBed.configureTestingModule({
      providers: [AdminSnackbarService, { provide: MatSnackBar, useValue: snackBarSpy }],
    });

    service = TestBed.inject(AdminSnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open success snackbar with correct config', () => {
    service.showSuccess('Item saved');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Item saved', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['admin-snackbar-success'],
    });
  });

  it('should open error snackbar with correct config', () => {
    service.showError('Something failed');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Something failed', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['admin-snackbar-error'],
    });
  });

  it('should open info snackbar with correct config', () => {
    service.showInfo('FYI');
    expect(snackBarSpy.open).toHaveBeenCalledWith('FYI', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['admin-snackbar-info'],
    });
  });
});

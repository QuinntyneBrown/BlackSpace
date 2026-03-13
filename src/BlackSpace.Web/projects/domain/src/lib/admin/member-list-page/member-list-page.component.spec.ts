import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { AdminSnackbarService } from 'components';
import { AdminConfirmDialogComponent } from 'components';
import { MemberListPageComponent } from './member-list-page.component';
import { MemberEditDialogComponent } from '../member-edit-dialog/member-edit-dialog.component';

describe('MemberListPageComponent', () => {
  let component: MemberListPageComponent;
  let fixture: ComponentFixture<MemberListPageComponent>;
  let httpTesting: HttpTestingController;
  let dialogOpenSpy: ReturnType<typeof vi.fn>;
  let snackbarSpy: { showSuccess: ReturnType<typeof vi.fn>; showError: ReturnType<typeof vi.fn> };

  const baseUrl = 'http://localhost:5000';

  const mockMembersResponse = {
    items: [
      {
        id: '1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        roleTitle: 'Engineer',
        organization: 'MDA',
        createdAtUtc: '2026-01-15T10:30:00Z',
      },
      {
        id: '2',
        fullName: 'John Smith',
        email: 'john@example.com',
        roleTitle: 'Manager',
        organization: 'SpaceX',
        createdAtUtc: '2026-02-01T08:00:00Z',
      },
    ],
    totalCount: 2,
    page: 1,
    pageSize: 10,
  };

  beforeEach(async () => {
    snackbarSpy = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MemberListPageComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AdminSnackbarService, useValue: snackbarSpy },
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    const realDialog = TestBed.inject(MatDialog);
    dialogOpenSpy = vi.spyOn(realDialog, 'open').mockReturnValue({
      afterClosed: () => of(undefined),
    } as any);
    fixture = TestBed.createComponent(MemberListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Flush initial listMembers from ngOnInit
    const req = httpTesting.expectOne(
      (r) => r.url === `${baseUrl}/api/admin/members` && r.params.get('page') === '1',
    );
    req.flush(mockMembersResponse);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load members on init', () => {
    expect(component.members().length).toBe(2);
    expect(component.totalCount()).toBe(2);
    expect(component.loading()).toBe(false);
  });

  it('should have 6 column definitions', () => {
    expect(component.columns.length).toBe(6);
    expect(component.columns[0].name).toBe('fullName');
    expect(component.columns[1].name).toBe('email');
    expect(component.columns[2].name).toBe('roleTitle');
    expect(component.columns[3].name).toBe('organization');
    expect(component.columns[4].name).toBe('referralSource');
    expect(component.columns[5].name).toBe('createdAtUtc');
  });

  it('should reload on search change', () => {
    component.onSearchChange('jane');

    const req = httpTesting.expectOne(
      (r) => r.url === `${baseUrl}/api/admin/members` && r.params.get('search') === 'jane',
    );
    req.flush(mockMembersResponse);
    expect(req.request.params.get('page')).toBe('1');
  });

  it('should reload on sort change', () => {
    component.onSortChange({ active: 'fullName', direction: 'asc' });

    const req = httpTesting.expectOne(
      (r) =>
        r.url === `${baseUrl}/api/admin/members` &&
        r.params.get('sortBy') === 'fullName' &&
        r.params.get('sortDirection') === 'asc',
    );
    req.flush(mockMembersResponse);
  });

  it('should reload on page change', () => {
    component.onPageChange({ pageIndex: 2, pageSize: 25, length: 100 });

    const req = httpTesting.expectOne(
      (r) =>
        r.url === `${baseUrl}/api/admin/members` &&
        r.params.get('page') === '3' &&
        r.params.get('pageSize') === '25',
    );
    req.flush(mockMembersResponse);
  });

  it('should open edit dialog on edit action', () => {
    const member = { id: '1', fullName: 'Jane Doe', email: 'jane@example.com', createdAtUtc: '2026-01-15T10:30:00Z' };

    component.onRowAction({ action: 'edit', row: member });

    expect(dialogOpenSpy).toHaveBeenCalledWith(MemberEditDialogComponent, {
      data: { mode: 'edit', member },
      width: '500px',
    });
  });

  it('should show success snackbar and reload when edit dialog returns result', () => {
    const savedMember = { id: '1', fullName: 'Jane Updated', email: 'jane@example.com', createdAtUtc: '2026-01-15T10:30:00Z' };

    dialogOpenSpy.mockReturnValue({
      afterClosed: () => of(savedMember),
    });

    component.openEditDialog({
      id: '1',
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      createdAtUtc: '2026-01-15T10:30:00Z',
    });

    expect(snackbarSpy.showSuccess).toHaveBeenCalledWith('Member saved successfully');

    // Flush the reload
    const req = httpTesting.expectOne(
      (r) => r.url === `${baseUrl}/api/admin/members`,
    );
    req.flush(mockMembersResponse);
  });

  it('should open confirm dialog on delete action', () => {
    const member = { id: '1', fullName: 'Jane Doe', email: 'jane@example.com', createdAtUtc: '2026-01-15T10:30:00Z' };

    dialogOpenSpy.mockReturnValue({
      afterClosed: () => of(false),
    });

    component.onRowAction({ action: 'delete', row: member });

    expect(dialogOpenSpy).toHaveBeenCalledWith(AdminConfirmDialogComponent, {
      data: {
        title: 'Delete Member',
        message: 'Are you sure you want to delete Jane Doe?',
        confirmLabel: 'Delete',
        confirmColor: 'warn',
      },
    });
  });

  it('should call deleteMember and show success snackbar when confirmed', () => {
    const member = { id: '1', fullName: 'Jane Doe', email: 'jane@example.com', createdAtUtc: '2026-01-15T10:30:00Z' };

    dialogOpenSpy.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.onRowAction({ action: 'delete', row: member });

    const deleteReq = httpTesting.expectOne(`${baseUrl}/api/admin/members/1`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    expect(snackbarSpy.showSuccess).toHaveBeenCalledWith('Member deleted successfully');

    // Flush the reload
    const reloadReq = httpTesting.expectOne(
      (r) => r.url === `${baseUrl}/api/admin/members`,
    );
    reloadReq.flush(mockMembersResponse);
  });

  it('should show error snackbar when delete fails', () => {
    const member = { id: '1', fullName: 'Jane Doe', email: 'jane@example.com', createdAtUtc: '2026-01-15T10:30:00Z' };

    dialogOpenSpy.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.onRowAction({ action: 'delete', row: member });

    const deleteReq = httpTesting.expectOne(`${baseUrl}/api/admin/members/1`);
    deleteReq.flush(null, { status: 500, statusText: 'Server Error' });

    expect(snackbarSpy.showError).toHaveBeenCalledWith('Failed to delete member');
  });

  it('should show error snackbar when load members fails', () => {
    component.loadMembers();

    const req = httpTesting.expectOne(
      (r) => r.url === `${baseUrl}/api/admin/members`,
    );
    req.flush(null, { status: 500, statusText: 'Server Error' });

    expect(snackbarSpy.showError).toHaveBeenCalledWith('Failed to load members');
    expect(component.loading()).toBe(false);
  });

  it('should render page header', () => {
    const header = fixture.nativeElement.querySelector('.page-header h1');
    expect(header.textContent).toContain('Members');
  });

  it('should render search bar', () => {
    const searchBar = fixture.nativeElement.querySelector('lib-admin-search-bar');
    expect(searchBar).toBeTruthy();
  });

  it('should render data table', () => {
    const table = fixture.nativeElement.querySelector('lib-admin-data-table');
    expect(table).toBeTruthy();
  });

  it('should open create dialog via openEditDialog without member', () => {
    component.openEditDialog();

    expect(dialogOpenSpy).toHaveBeenCalledWith(MemberEditDialogComponent, {
      data: { mode: 'create' },
      width: '500px',
    });
  });

  it('should handle sort with empty direction', () => {
    component.onSortChange({ active: 'fullName', direction: '' });

    const req = httpTesting.expectOne(
      (r) => r.url === `${baseUrl}/api/admin/members`,
    );
    req.flush(mockMembersResponse);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AdminDataTableComponent, ColumnConfig } from './admin-data-table.component';

describe('AdminDataTableComponent', () => {
  let fixture: ComponentFixture<AdminDataTableComponent>;
  let component: AdminDataTableComponent;

  const testColumns: ColumnConfig[] = [
    { name: 'id', label: 'ID', sortable: true },
    { name: 'name', label: 'Name', sortable: true },
    { name: 'email', label: 'Email', sortable: false },
  ];

  const testData = [
    { id: 1, name: 'Alice', email: 'alice@test.com' },
    { id: 2, name: 'Bob', email: 'bob@test.com' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDataTableComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  function createComponent(
    overrides: {
      columns?: ColumnConfig[];
      data?: Record<string, unknown>[];
      totalCount?: number;
      pageSizeOptions?: number[];
      loading?: boolean;
    } = {},
  ) {
    fixture = TestBed.createComponent(AdminDataTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', overrides.columns ?? testColumns);
    fixture.componentRef.setInput('data', overrides.data ?? testData);
    if (overrides.totalCount !== undefined) fixture.componentRef.setInput('totalCount', overrides.totalCount);
    if (overrides.pageSizeOptions !== undefined) fixture.componentRef.setInput('pageSizeOptions', overrides.pageSizeOptions);
    if (overrides.loading !== undefined) fixture.componentRef.setInput('loading', overrides.loading);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should render columns from config', () => {
    createComponent();
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers.length).toBe(4); // 3 columns + actions
    expect(headers[0].textContent).toContain('ID');
    expect(headers[1].textContent).toContain('Name');
    expect(headers[2].textContent).toContain('Email');
    expect(headers[3].textContent).toContain('Actions');
  });

  it('should render data rows', () => {
    createComponent();
    const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(2);
  });

  it('should compute displayedColumns correctly', () => {
    createComponent();
    expect(component.displayedColumns).toEqual(['id', 'name', 'email', 'actions']);
  });

  it('should show loading overlay when loading is true', () => {
    createComponent({ loading: true });
    const overlay = fixture.nativeElement.querySelector('.loading-overlay');
    expect(overlay).toBeTruthy();
    const spinner = overlay.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should not show loading overlay when loading is false', () => {
    createComponent({ loading: false });
    const overlay = fixture.nativeElement.querySelector('.loading-overlay');
    expect(overlay).toBeFalsy();
  });

  it('should show empty state when data is empty and not loading', () => {
    createComponent({ data: [], loading: false });
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No data available');
  });

  it('should not show empty state when data is present', () => {
    createComponent();
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeFalsy();
  });

  it('should emit sortChange on sort', () => {
    createComponent();
    const spy = vi.fn();
    component.sortChange.subscribe(spy);
    component.onSortChange({ active: 'name', direction: 'asc' });
    expect(spy).toHaveBeenCalledWith({ active: 'name', direction: 'asc' });
  });

  it('should emit pageChange on page event', () => {
    createComponent({ totalCount: 100 });
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 };
    component.onPageChange(pageEvent);
    expect(spy).toHaveBeenCalledWith(pageEvent);
  });

  it('should emit rowAction with edit when edit button clicked', () => {
    createComponent();
    const spy = vi.fn();
    component.rowAction.subscribe(spy);
    const editButtons = fixture.nativeElement.querySelectorAll('button[aria-label="Edit"]');
    editButtons[0].click();
    expect(spy).toHaveBeenCalledWith({ action: 'edit', row: testData[0] });
  });

  it('should emit rowAction with delete when delete button clicked', () => {
    createComponent();
    const spy = vi.fn();
    component.rowAction.subscribe(spy);
    const deleteButtons = fixture.nativeElement.querySelectorAll('button[aria-label="Delete"]');
    deleteButtons[0].click();
    expect(spy).toHaveBeenCalledWith({ action: 'delete', row: testData[0] });
  });

  it('should render paginator', () => {
    createComponent({ totalCount: 50 });
    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    expect(paginator).toBeTruthy();
  });

  it('should use default pageSizeOptions', () => {
    createComponent();
    expect(component.pageSizeOptions()).toEqual([5, 10, 25]);
  });

  it('should use custom pageSizeOptions', () => {
    createComponent({ pageSizeOptions: [10, 20] });
    expect(component.pageSizeOptions()).toEqual([10, 20]);
  });

  it('should use default totalCount of 0', () => {
    createComponent();
    expect(component.totalCount()).toBe(0);
  });

  it('should not show table when data is empty', () => {
    createComponent({ data: [] });
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeFalsy();
  });
});

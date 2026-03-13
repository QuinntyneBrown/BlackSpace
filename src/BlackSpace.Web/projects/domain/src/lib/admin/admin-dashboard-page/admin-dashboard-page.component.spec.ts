import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { AdminSnackbarService } from 'components';
import { AdminDashboardPageComponent } from './admin-dashboard-page.component';
import { MemberEditDialogComponent } from '../member-edit-dialog/member-edit-dialog.component';

describe('AdminDashboardPageComponent', () => {
  let component: AdminDashboardPageComponent;
  let fixture: ComponentFixture<AdminDashboardPageComponent>;
  let httpTesting: HttpTestingController;
  let dialogOpenSpy: ReturnType<typeof vi.fn>;
  let router: Router;
  let snackbarSpy: { showSuccess: ReturnType<typeof vi.fn>; showError: ReturnType<typeof vi.fn> };

  const baseUrl = 'http://localhost:5000';

  const now = new Date();
  const thisMonthDate = now.toISOString();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString();

  const mockAllMembers = {
    items: [
      { id: '1', fullName: 'Jane Doe', email: 'jane@example.com', createdAtUtc: thisMonthDate },
      { id: '2', fullName: 'John Smith', email: 'john@example.com', createdAtUtc: lastMonthDate },
      { id: '3', fullName: 'Alice Brown', email: 'alice@example.com', createdAtUtc: thisMonthDate },
    ],
    totalCount: 3,
    page: 1,
    pageSize: 3,
  };

  const mockRecentMembers = {
    items: [
      { id: '1', fullName: 'Jane Doe', email: 'jane@example.com', createdAtUtc: thisMonthDate },
      { id: '3', fullName: 'Alice Brown', email: 'alice@example.com', createdAtUtc: thisMonthDate },
    ],
    totalCount: 3,
    page: 1,
    pageSize: 5,
  };

  function flushInitRequests() {
    // 1. Stats: listMembers(page=1, pageSize=1)
    const statsReq = httpTesting.expectOne(
      (r) => r.url === `${baseUrl}/api/admin/members` && r.params.get('pageSize') === '1',
    );
    statsReq.flush({ items: [], totalCount: 3, page: 1, pageSize: 1 });

    // 2. Recent members: listMembers(page=1, pageSize=5, sortBy=createdAtUtc, sortDirection=desc)
    const recentReq = httpTesting.expectOne(
      (r) => r.url === `${baseUrl}/api/admin/members` && r.params.get('pageSize') === '5',
    );
    recentReq.flush(mockRecentMembers);

    // 3. Full list for new this month: listMembers(page=1, pageSize=totalCount)
    const allReq = httpTesting.expectOne(
      (r) => r.url === `${baseUrl}/api/admin/members` && r.params.get('pageSize') === '3',
    );
    allReq.flush(mockAllMembers);

    // 4. Next meetup date
    const meetupReq = httpTesting.expectOne(`${baseUrl}/api/admin/content/next-meetup`);
    meetupReq.flush({ nextMeetupDate: '2026-04-15T18:30:00Z' });

    // 5. Referral sources
    const sourcesReq = httpTesting.expectOne(`${baseUrl}/api/admin/content/referral-sources`);
    sourcesReq.flush({ sources: ['LinkedIn', 'Twitter', 'Friend'] });

    fixture.detectChanges();
  }

  beforeEach(async () => {
    snackbarSpy = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminDashboardPageComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AdminSnackbarService, useValue: snackbarSpy },
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    const realDialog = TestBed.inject(MatDialog);
    dialogOpenSpy = vi.spyOn(realDialog, 'open').mockReturnValue({
      afterClosed: () => of(undefined),
    } as any);
    fixture = TestBed.createComponent(AdminDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    flushInitRequests();
  });

  afterEach(() => {
    httpTesting.verify();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load total members count', () => {
    expect(component.totalMembers()).toBe('3');
  });

  it('should calculate new this month', () => {
    expect(parseInt(component.newThisMonth(), 10)).toBe(2);
  });

  it('should load next meetup date', () => {
    expect(component.nextMeetupDate()).not.toBe('--');
  });

  it('should load active referral sources count', () => {
    expect(component.activeReferralSources()).toBe('3');
  });

  it('should load recent members', () => {
    expect(component.recentMembers().length).toBe(2);
    expect(component.loadingRecent()).toBe(false);
  });

  it('should have 3 recent member columns', () => {
    expect(component.recentColumns.length).toBe(3);
  });

  it('should render 4 stat cards', () => {
    const statCards = fixture.nativeElement.querySelectorAll('lib-admin-stat-card');
    expect(statCards.length).toBe(4);
  });

  it('should render recent members table', () => {
    const table = fixture.nativeElement.querySelector('lib-admin-data-table');
    expect(table).toBeTruthy();
  });

  it('should render quick action buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.action-buttons button');
    expect(buttons.length).toBe(2);
  });

  it('should open add member dialog', () => {
    component.openAddMember();

    expect(dialogOpenSpy).toHaveBeenCalledWith(MemberEditDialogComponent, {
      data: { mode: 'create' },
      width: '500px',
    });
  });

  it('should show success snackbar and reload when add member dialog returns result', () => {
    const savedMember = { id: '99', fullName: 'New Member', email: 'new@example.com', createdAtUtc: thisMonthDate };

    dialogOpenSpy.mockReturnValue({
      afterClosed: () => of(savedMember),
    });

    component.openAddMember();

    expect(snackbarSpy.showSuccess).toHaveBeenCalledWith('Member added successfully');

    // Flush reload requests: first wave (stats, recent, meetup, sources)
    let pending = httpTesting.match(() => true);
    pending.forEach((r) => {
      if (r.request.url.includes('admin/members')) {
        r.flush(mockAllMembers);
      } else if (r.request.url.includes('next-meetup')) {
        r.flush({ nextMeetupDate: '2026-04-15T18:30:00Z' });
      } else if (r.request.url.includes('referral-sources')) {
        r.flush({ sources: ['LinkedIn', 'Twitter', 'Friend'] });
      } else {
        r.flush({});
      }
    });

    // Flush chained requests (e.g. all members after stats returns totalCount)
    pending = httpTesting.match(() => true);
    pending.forEach((r) => {
      if (r.request.url.includes('admin/members')) {
        r.flush(mockAllMembers);
      } else {
        r.flush({});
      }
    });
  });

  it('should navigate to content page', () => {
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.navigateToContent();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/content']);
  });

  it('should render page title', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('Dashboard');
  });

  it('should render recent section heading', () => {
    const h2s = fixture.nativeElement.querySelectorAll('h2');
    const texts = Array.from(h2s).map((h: unknown) => (h as HTMLElement).textContent);
    expect(texts.some((t: string | null) => t?.includes('Recent Members'))).toBe(true);
  });

  it('should render quick actions heading', () => {
    const h2s = fixture.nativeElement.querySelectorAll('h2');
    const texts = Array.from(h2s).map((h: unknown) => (h as HTMLElement).textContent);
    expect(texts.some((t: string | null) => t?.includes('Quick Actions'))).toBe(true);
  });

  it('should handle recent members load error', () => {
    expect(component.loadingRecent()).toBe(false);
  });
});

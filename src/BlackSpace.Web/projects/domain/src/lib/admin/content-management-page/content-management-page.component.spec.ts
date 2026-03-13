import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AdminSnackbarService } from 'components';
import { ContentManagementPageComponent } from './content-management-page.component';

describe('ContentManagementPageComponent', () => {
  let component: ContentManagementPageComponent;
  let fixture: ComponentFixture<ContentManagementPageComponent>;
  let httpTesting: HttpTestingController;
  let snackbarSpy: { showSuccess: ReturnType<typeof vi.fn>; showError: ReturnType<typeof vi.fn> };

  const baseUrl = 'http://localhost:5000';

  beforeEach(async () => {
    snackbarSpy = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ContentManagementPageComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AdminSnackbarService, useValue: snackbarSpy },
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ContentManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Flush the two init requests
    const meetupReq = httpTesting.expectOne(`${baseUrl}/api/admin/content/next-meetup`);
    meetupReq.flush({ nextMeetupDate: '2026-04-15T18:30:00Z' });

    const sourcesReq = httpTesting.expectOne(`${baseUrl}/api/admin/content/referral-sources`);
    sourcesReq.flush({ sources: ['LinkedIn', 'Twitter', 'Friend'] });

    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load meetup date on init', () => {
    expect(component.meetupDate.value).toBeTruthy();
    expect(component.meetupTime.value).toBeTruthy();
  });

  it('should load referral sources on init', () => {
    expect(component.referralSources()).toEqual(['LinkedIn', 'Twitter', 'Friend']);
  });

  it('should save meetup date successfully', () => {
    component.meetupDate.setValue('2026-05-01');
    component.meetupTime.setValue('19:00');

    component.saveMeetupDate();
    expect(component.savingMeetup()).toBe(true);

    const req = httpTesting.expectOne(`${baseUrl}/api/admin/content/next-meetup`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.nextMeetupDate).toBe('2026-05-01T19:00:00');
    req.flush({ nextMeetupDate: '2026-05-01T19:00:00Z' });

    expect(component.savingMeetup()).toBe(false);
    expect(snackbarSpy.showSuccess).toHaveBeenCalledWith('Meetup date updated successfully');
  });

  it('should show error snackbar when meetup save fails', () => {
    component.meetupDate.setValue('2026-05-01');
    component.meetupTime.setValue('19:00');

    component.saveMeetupDate();

    const req = httpTesting.expectOne(`${baseUrl}/api/admin/content/next-meetup`);
    req.flush(null, { status: 500, statusText: 'Server Error' });

    expect(component.savingMeetup()).toBe(false);
    expect(snackbarSpy.showError).toHaveBeenCalledWith('Failed to update meetup date');
  });

  it('should not save meetup when date is invalid', () => {
    component.meetupDate.setValue('');
    component.meetupTime.setValue('19:00');

    component.saveMeetupDate();

    httpTesting.expectNone(`${baseUrl}/api/admin/content/next-meetup`);
  });

  it('should not save meetup when time is invalid', () => {
    component.meetupDate.setValue('2026-05-01');
    component.meetupTime.setValue('');

    component.saveMeetupDate();

    httpTesting.expectNone(`${baseUrl}/api/admin/content/next-meetup`);
  });

  it('should add a new referral source', () => {
    component.newSource.setValue('YouTube');
    component.addSource();

    expect(component.referralSources()).toEqual(['LinkedIn', 'Twitter', 'Friend', 'YouTube']);
    expect(component.newSource.value).toBe('');
  });

  it('should not add duplicate source', () => {
    component.newSource.setValue('LinkedIn');
    component.addSource();

    expect(component.referralSources()).toEqual(['LinkedIn', 'Twitter', 'Friend']);
  });

  it('should not add empty source', () => {
    component.newSource.setValue('   ');
    component.addSource();

    expect(component.referralSources()).toEqual(['LinkedIn', 'Twitter', 'Friend']);
  });

  it('should remove a referral source', () => {
    component.removeSource('Twitter');

    expect(component.referralSources()).toEqual(['LinkedIn', 'Friend']);
  });

  it('should save referral sources successfully', () => {
    component.saveReferralSources();
    expect(component.savingSources()).toBe(true);

    const req = httpTesting.expectOne(`${baseUrl}/api/admin/content/referral-sources`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.sources).toEqual(['LinkedIn', 'Twitter', 'Friend']);
    req.flush({ sources: ['LinkedIn', 'Twitter', 'Friend'] });

    expect(component.savingSources()).toBe(false);
    expect(snackbarSpy.showSuccess).toHaveBeenCalledWith('Referral sources updated successfully');
  });

  it('should show error snackbar when sources save fails', () => {
    component.saveReferralSources();

    const req = httpTesting.expectOne(`${baseUrl}/api/admin/content/referral-sources`);
    req.flush(null, { status: 500, statusText: 'Server Error' });

    expect(component.savingSources()).toBe(false);
    expect(snackbarSpy.showError).toHaveBeenCalledWith('Failed to update referral sources');
  });

  it('should render page title', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('Content Management');
  });

  it('should render two section cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBe(2);
  });

  it('should render meetup date section', () => {
    const titles = fixture.nativeElement.querySelectorAll('mat-card-title');
    const titleTexts = Array.from(titles).map((t: unknown) => (t as HTMLElement).textContent);
    expect(titleTexts.some((t: string | null) => t?.includes('Next Meetup Date'))).toBe(true);
  });

  it('should render referral sources section', () => {
    const titles = fixture.nativeElement.querySelectorAll('mat-card-title');
    const titleTexts = Array.from(titles).map((t: unknown) => (t as HTMLElement).textContent);
    expect(titleTexts.some((t: string | null) => t?.includes('Referral Sources'))).toBe(true);
  });
});

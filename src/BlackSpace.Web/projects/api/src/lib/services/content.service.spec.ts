import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { ContentService } from './content.service';
import { API_BASE_URL } from '../api-config';
import { ContentStats } from '../models/content.models';

describe('ContentService', () => {
  let service: ContentService;
  let httpTesting: HttpTestingController;

  const defaultBaseUrl = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContentService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getStats', () => {
    const mockStats: ContentStats = {
      memberCount: 42,
      nextMeetupDate: '2026-04-15T18:00:00Z',
    };

    it('should send GET request to /api/content/stats', () => {
      service.getStats().subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/content/stats`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });

    it('should return content stats on success', () => {
      let result: ContentStats | undefined;
      service.getStats().subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/content/stats`);
      req.flush(mockStats);

      expect(result).toEqual(mockStats);
      expect(result!.memberCount).toBe(42);
      expect(result!.nextMeetupDate).toBe('2026-04-15T18:00:00Z');
    });

    it('should handle stats with no next meetup date', () => {
      const statsNoMeetup: ContentStats = {
        memberCount: 10,
      };

      let result: ContentStats | undefined;
      service.getStats().subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/content/stats`);
      req.flush(statsNoMeetup);

      expect(result).toEqual(statsNoMeetup);
      expect(result!.nextMeetupDate).toBeUndefined();
    });

    it('should propagate server errors', () => {
      let error: HttpErrorResponse | undefined;
      service.getStats().subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/content/stats`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });

      expect(error).toBeDefined();
      expect(error!.status).toBe(500);
    });
  });

  describe('getReferralSources', () => {
    const mockSources = [
      'LinkedIn',
      'Twitter/X',
      'A friend or colleague',
      'CSA/DND event',
      'Google search',
      'Other',
    ];

    it('should send GET request to /api/content/referral-sources', () => {
      service.getReferralSources().subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/content/referral-sources`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSources);
    });

    it('should return referral sources array on success', () => {
      let result: string[] | undefined;
      service.getReferralSources().subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/content/referral-sources`);
      req.flush(mockSources);

      expect(result).toEqual(mockSources);
      expect(result!).toHaveLength(6);
    });

    it('should handle empty referral sources array', () => {
      let result: string[] | undefined;
      service.getReferralSources().subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/content/referral-sources`);
      req.flush([]);

      expect(result).toEqual([]);
    });

    it('should propagate server errors', () => {
      let error: HttpErrorResponse | undefined;
      service.getReferralSources().subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/content/referral-sources`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });

      expect(error).toBeDefined();
      expect(error!.status).toBe(500);
    });
  });

  describe('with custom base URL', () => {
    const customBaseUrl = 'https://api.production.com';

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: API_BASE_URL, useValue: customBaseUrl },
        ],
      });
      service = TestBed.inject(ContentService);
      httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should use custom base URL for getStats', () => {
      service.getStats().subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/content/stats`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/content/stats`);
      req.flush({});
    });

    it('should use custom base URL for getReferralSources', () => {
      service.getReferralSources().subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/content/referral-sources`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/content/referral-sources`);
      req.flush([]);
    });
  });
});

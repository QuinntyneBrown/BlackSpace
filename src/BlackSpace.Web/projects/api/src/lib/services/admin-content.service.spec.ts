import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { AdminContentService } from './admin-content.service';
import { API_BASE_URL } from '../api-config';
import {
  NextMeetupDateResponse,
  UpdateNextMeetupDateRequest,
  ReferralSourcesResponse,
  UpdateReferralSourcesRequest,
} from '../models/admin.models';

describe('AdminContentService', () => {
  let service: AdminContentService;
  let httpTesting: HttpTestingController;

  const defaultBaseUrl = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminContentService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getNextMeetupDate', () => {
    const mockResponse: NextMeetupDateResponse = {
      nextMeetupDate: '2026-04-15T18:00:00Z',
    };

    it('should send GET request to /api/admin/content/next-meetup', () => {
      service.getNextMeetupDate().subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/next-meetup`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return next meetup date response on success', () => {
      let result: NextMeetupDateResponse | undefined;
      service.getNextMeetupDate().subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/next-meetup`);
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
      expect(result!.nextMeetupDate).toBe('2026-04-15T18:00:00Z');
    });

    it('should propagate server errors', () => {
      let error: HttpErrorResponse | undefined;
      service.getNextMeetupDate().subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/next-meetup`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });

      expect(error).toBeDefined();
      expect(error!.status).toBe(500);
    });
  });

  describe('updateNextMeetupDate', () => {
    const mockRequest: UpdateNextMeetupDateRequest = {
      nextMeetupDate: '2026-05-20T18:00:00Z',
    };

    const mockResponse: NextMeetupDateResponse = {
      nextMeetupDate: '2026-05-20T18:00:00Z',
    };

    it('should send PUT request to /api/admin/content/next-meetup', () => {
      service.updateNextMeetupDate(mockRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/next-meetup`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });

    it('should send the request body correctly', () => {
      service.updateNextMeetupDate(mockRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/next-meetup`);
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });

    it('should return the updated next meetup date response on success', () => {
      let result: NextMeetupDateResponse | undefined;
      service.updateNextMeetupDate(mockRequest).subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/next-meetup`);
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should propagate 422 validation error', () => {
      let error: HttpErrorResponse | undefined;
      service.updateNextMeetupDate(mockRequest).subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/next-meetup`);
      req.flush(
        {
          error: 'validation_failed',
          message: 'Please fix the errors below.',
          errors: { nextMeetupDate: ['Invalid date format'] },
        },
        { status: 422, statusText: 'Unprocessable Entity' },
      );

      expect(error).toBeDefined();
      expect(error!.status).toBe(422);
      expect(error!.error.error).toBe('validation_failed');
    });
  });

  describe('getReferralSources', () => {
    const mockResponse: ReferralSourcesResponse = {
      sources: ['LinkedIn', 'Twitter/X', 'A friend or colleague', 'Google search', 'Other'],
    };

    it('should send GET request to /api/admin/content/referral-sources', () => {
      service.getReferralSources().subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/referral-sources`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return referral sources response on success', () => {
      let result: ReferralSourcesResponse | undefined;
      service.getReferralSources().subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/referral-sources`);
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
      expect(result!.sources).toHaveLength(5);
    });

    it('should handle empty sources array', () => {
      const emptyResponse: ReferralSourcesResponse = { sources: [] };
      let result: ReferralSourcesResponse | undefined;
      service.getReferralSources().subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/referral-sources`);
      req.flush(emptyResponse);

      expect(result).toEqual(emptyResponse);
      expect(result!.sources).toHaveLength(0);
    });

    it('should propagate server errors', () => {
      let error: HttpErrorResponse | undefined;
      service.getReferralSources().subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/referral-sources`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });

      expect(error).toBeDefined();
      expect(error!.status).toBe(500);
    });
  });

  describe('updateReferralSources', () => {
    const mockRequest: UpdateReferralSourcesRequest = {
      sources: ['LinkedIn', 'Twitter/X', 'Conference', 'Other'],
    };

    const mockResponse: ReferralSourcesResponse = {
      sources: ['LinkedIn', 'Twitter/X', 'Conference', 'Other'],
    };

    it('should send PUT request to /api/admin/content/referral-sources', () => {
      service.updateReferralSources(mockRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/referral-sources`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });

    it('should send the request body correctly', () => {
      service.updateReferralSources(mockRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/referral-sources`);
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });

    it('should return the updated referral sources response on success', () => {
      let result: ReferralSourcesResponse | undefined;
      service.updateReferralSources(mockRequest).subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/referral-sources`);
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should propagate 422 validation error', () => {
      let error: HttpErrorResponse | undefined;
      service.updateReferralSources(mockRequest).subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/content/referral-sources`);
      req.flush(
        {
          error: 'validation_failed',
          message: 'Please fix the errors below.',
          errors: { sources: ['At least one source is required'] },
        },
        { status: 422, statusText: 'Unprocessable Entity' },
      );

      expect(error).toBeDefined();
      expect(error!.status).toBe(422);
      expect(error!.error.error).toBe('validation_failed');
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
      service = TestBed.inject(AdminContentService);
      httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should use custom base URL for getNextMeetupDate', () => {
      service.getNextMeetupDate().subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/admin/content/next-meetup`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/admin/content/next-meetup`);
      req.flush({});
    });

    it('should use custom base URL for updateNextMeetupDate', () => {
      const request: UpdateNextMeetupDateRequest = { nextMeetupDate: '2026-06-01T18:00:00Z' };
      service.updateNextMeetupDate(request).subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/admin/content/next-meetup`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/admin/content/next-meetup`);
      req.flush({});
    });

    it('should use custom base URL for getReferralSources', () => {
      service.getReferralSources().subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/admin/content/referral-sources`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/admin/content/referral-sources`);
      req.flush({ sources: [] });
    });

    it('should use custom base URL for updateReferralSources', () => {
      const request: UpdateReferralSourcesRequest = { sources: ['Test'] };
      service.updateReferralSources(request).subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/admin/content/referral-sources`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/admin/content/referral-sources`);
      req.flush({ sources: ['Test'] });
    });
  });
});

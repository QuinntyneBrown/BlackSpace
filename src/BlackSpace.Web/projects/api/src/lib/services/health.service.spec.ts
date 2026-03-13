import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { HealthService } from './health.service';
import { API_BASE_URL } from '../api-config';
import { HealthResponse } from '../models/health.models';

describe('HealthService', () => {
  let service: HealthService;
  let httpTesting: HttpTestingController;

  const defaultBaseUrl = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HealthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('checkHealth', () => {
    const mockResponse: HealthResponse = {
      status: 'Healthy',
    };

    it('should send GET request to /api/health', () => {
      service.checkHealth().subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/health`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return health response on success', () => {
      let result: HealthResponse | undefined;
      service.checkHealth().subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/health`);
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
      expect(result!.status).toBe('Healthy');
    });

    it('should propagate server errors', () => {
      let error: HttpErrorResponse | undefined;
      service.checkHealth().subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/health`);
      req.flush(null, { status: 503, statusText: 'Service Unavailable' });

      expect(error).toBeDefined();
      expect(error!.status).toBe(503);
    });

    it('should handle network errors', () => {
      let error: HttpErrorResponse | undefined;
      service.checkHealth().subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/health`);
      req.error(new ProgressEvent('error'));

      expect(error).toBeDefined();
      expect(error!.status).toBe(0);
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
      service = TestBed.inject(HealthService);
      httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should use custom base URL for checkHealth', () => {
      service.checkHealth().subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/health`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/health`);
      req.flush({});
    });
  });
});
